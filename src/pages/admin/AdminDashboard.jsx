import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getAllVendors, createVendorInDB, toggleVendorStatus, softDeleteVendor, restoreVendor 
} from '../../firebase/firestoreService';
import { sendPasswordResetAuth } from '../../firebase/authService';
import { WILAYAS } from '../../data/initialMockData';
import { 
  ShieldCheck, Users, UserPlus, Trash2, RotateCcw, KeyRound, 
  Search, CheckCircle2, XCircle, AlertTriangle, Send, RefreshCw, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vendors'); // 'vendors' | 'trash' | 'create'
  const [searchTerm, setSearchTerm] = useState('');

  // Password reset action message store
  const [resetPromptInfo, setResetPromptInfo] = useState(null);

  // New Vendor Form State
  const [newVendorForm, setNewVendorForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    wilaya: '16 - Alger',
    address: ''
  });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await getAllVendors(true);
      setVendors(data);
    } catch (e) {
      console.error('Error fetching vendors for admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Filter Active / Deactivated Vendors (not deleted)
  const activeVendors = vendors.filter(v => !v.isDeleted && (
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.wilaya.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Soft Deleted Vendors (Trash Tab)
  const deletedVendors = vendors.filter(v => v.isDeleted && (
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Admin Action: Toggle Active / Deactivated Status
  const handleToggleStatus = async (vendor) => {
    const nextStatus = vendor.status === 'active' ? 'deactivated' : 'active';
    try {
      await toggleVendorStatus(vendor.id, nextStatus);
      toast.success(
        nextStatus === 'deactivated'
          ? `Compte "${vendor.name}" désactivé.`
          : `Compte "${vendor.name}" réactivé avec succès.`
      );
      fetchVendors();
    } catch (e) {
      toast.error('Erreur lors du changement de statut.');
    }
  };

  // Admin Action: Soft Delete Vendor Account
  const handleSoftDelete = async (vendor) => {
    if (!window.confirm(`Supprimer le compte "${vendor.name}" ? Il sera placé dans la corbeille et pourra être restauré à tout moment.`)) {
      return;
    }
    try {
      await softDeleteVendor(vendor.id);
      toast.info(`Compte "${vendor.name}" déplacé dans la corbeille admin.`);
      fetchVendors();
    } catch (e) {
      toast.error('Erreur lors de la suppression.');
    }
  };

  // Admin Action: Restore Soft Deleted Vendor
  const handleRestoreVendor = async (vendor) => {
    try {
      await restoreVendor(vendor.id);
      toast.success(`Compte "${vendor.name}" restauré avec succès !`);
      fetchVendors();
    } catch (e) {
      toast.error('Erreur lors de la restauration du compte.');
    }
  };

  // Admin Action: Send Reset Password Code/Link to Vendor
  const handleSendResetPasswordCode = async (vendor) => {
    try {
      const res = await sendPasswordResetAuth(vendor.email);
      setResetPromptInfo({
        vendorName: vendor.name,
        email: vendor.email,
        code: res.resetCode,
        message: res.message
      });
      toast.success(`Code / Email de réinitialisation envoyé à ${vendor.email}`);
    } catch (e) {
      toast.error('Erreur lors de l\'envoi du code de réinitialisation.');
    }
  };

  // Admin Action: Create Vendor Manually
  const handleCreateVendor = async (e) => {
    e.preventDefault();
    if (!newVendorForm.name || !newVendorForm.email) {
      toast.error('Veuillez renseigner au moins le nom de la boutique et l\'adresse e-mail.');
      return;
    }

    try {
      const created = await createVendorInDB({
        name: newVendorForm.name,
        ownerName: newVendorForm.ownerName,
        email: newVendorForm.email,
        phone: newVendorForm.phone,
        whatsapp: newVendorForm.whatsapp || newVendorForm.phone,
        wilaya: newVendorForm.wilaya,
        address: newVendorForm.address,
        status: 'active',
        isEmailVerified: true
      });

      toast.success(`Nouveau compte vendeur "${created.name}" créé avec succès !`);
      setNewVendorForm({
        name: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        whatsapp: '',
        wilaya: '16 - Alger',
        address: ''
      });
      setActiveTab('vendors');
      fetchVendors();
    } catch (err) {
      toast.error('Erreur lors de la création du compte.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {t('adminTitle')}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold uppercase">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('adminSub')}</p>
              </div>
            </div>

            <button
              onClick={fetchVendors}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors self-start sm:self-center"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Reset Code Result Notification Box */}
        {resetPromptInfo && (
          <div className="mb-6 bg-white dark:bg-slate-900 border border-teal-500/50 rounded-2xl p-5 shadow-xl relative animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Code de réinitialisation généré pour {resetPromptInfo.vendorName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{resetPromptInfo.message}</p>
                </div>
              </div>
              <button
                onClick={() => setResetPromptInfo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                Fermer
              </button>
            </div>
            {resetPromptInfo.code && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-teal-300 dark:border-teal-500/30 font-mono text-center font-bold text-[#0d9488] dark:text-teal-400 text-lg">
                Code à transmettre au vendeur : {resetPromptInfo.code}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">Total Vendeurs</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{vendors.filter(v => !v.isDeleted).length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-teal-600 dark:text-emerald-400 font-semibold mb-1">Vendeurs Actifs</div>
            <div className="text-2xl font-black text-teal-600 dark:text-emerald-400">{vendors.filter(v => !v.isDeleted && v.status === 'active').length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1">Comptes Désactivés</div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{vendors.filter(v => !v.isDeleted && v.status === 'deactivated').length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">Dans la Corbeille</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{vendors.filter(v => v.isDeleted).length}</div>
          </div>
        </div>

        {/* Tabs Navigation (Firebase button removed as requested) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'vendors'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('activeAccounts')} ({activeVendors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('trash')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'trash'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('trashAccounts')} ({deletedVendors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('createNewVendor')}</span>
            </button>
          </div>

          {(activeTab === 'vendors' || activeTab === 'trash') && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrer vendeurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white pl-9 pr-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>
          )}
        </div>

        {/* Tab Content 1: Active & Deactivated Vendors */}
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            {activeVendors.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Boutique & Propriétaire</th>
                        <th className="p-4">Email & Téléphone</th>
                        <th className="p-4">Wilaya</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-right">Actions Administrateur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {activeVendors.map(vendor => (
                        <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={vendor.logo}
                                alt={vendor.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                                  {vendor.name}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-[11px]">{vendor.ownerName || 'Sans nom désigné'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{vendor.email}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{vendor.phone || 'Pas de numéro'}</div>
                          </td>
                          <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{vendor.wilaya}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                              vendor.status === 'active'
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                            }`}>
                              {vendor.status === 'active' ? (
                                <><CheckCircle2 className="w-3 h-3" /> Actif</>
                              ) : (
                                <><XCircle className="w-3 h-3" /> Désactivé</>
                              )}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Trigger Password Reset Code */}
                              <button
                                onClick={() => handleSendResetPasswordCode(vendor)}
                                title="Envoyer un code / lien de réinitialisation"
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-700 dark:text-cyan-300 text-xs font-bold flex items-center gap-1 border border-teal-200 dark:border-cyan-500/30"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                                {t('sendPasswordCode')}
                              </button>

                              {/* Toggle Activate / Deactivate */}
                              <button
                                onClick={() => handleToggleStatus(vendor)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  vendor.status === 'active'
                                    ? 'bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-900/40'
                                    : 'bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-900/40'
                                }`}
                              >
                                {vendor.status === 'active' ? t('deactivate') : t('activate')}
                              </button>

                              {/* Soft Delete */}
                              <button
                                onClick={() => handleSoftDelete(vendor)}
                                title="Supprimer (Déplacer vers corbeille)"
                                className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900/40 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <Link
                                to={`/store/${vendor.id}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                title="Voir la boutique"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Aucun vendeur trouvé.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Corbeille / Soft Deleted Trash */}
        {activeTab === 'trash' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/30 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>
                Les comptes supprimés sont stockés dans la corbeille et peuvent être **restaurés à tout moment**.
              </span>
            </div>

            {deletedVendors.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Compte Supprimé</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Date Suppression</th>
                      <th className="p-4 text-right">Restauration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {deletedVendors.map(vendor => (
                      <tr key={vendor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-slate-900 dark:text-slate-200">{vendor.name}</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{vendor.email}</td>
                        <td className="p-4 text-slate-400">{vendor.deletedAt ? new Date(vendor.deletedAt).toLocaleDateString() : 'Corbeille'}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleRestoreVendor(vendor)}
                            className="px-3 py-1.5 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {t('restore')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
                <Trash2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">La corbeille est vide.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Create Vendor Account Manually */}
        {activeTab === 'create' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Créer personnellement un compte vendeur</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              L'administrateur peut ouvrir directement un compte pour un grossiste sans validation préalable.
            </p>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom de la boutique grossiste *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pharmacie Grossiste Atlas"
                  value={newVendorForm.name}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email du vendeur *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@grossiste.dz"
                    value={newVendorForm.email}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom du responsable</label>
                  <input
                    type="text"
                    placeholder="Ex: Mohamed Khelil"
                    value={newVendorForm.ownerName}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, ownerName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="0550 00 11 22"
                    value={newVendorForm.phone}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Wilaya</label>
                  <select
                    value={newVendorForm.wilaya}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, wilaya: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-2 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                  >
                    {WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Créer le compte grossiste
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
