import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getVendorProducts, addProduct, updateProduct, deleteProduct, updateVendorProfile 
} from '../../firebase/firestoreService';
import { processImageFile } from '../../utils/imageUtils';
import { CATEGORIES, WILAYAS } from '../../data/initialMockData';
import { 
  Store, Package, PlusCircle, Edit3, Trash2, Eye, Save, X, 
  ExternalLink, ShieldCheck, Camera, Upload, Image as ImageIcon, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'profile'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingProductImg, setUploadingProductImg] = useState(false);

  // Modal / Form state for Add or Edit Product
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Dermo-Cosmétique',
    wholesalePrice: '',
    suggestedRetailPrice: '',
    minOrderQuantity: 12,
    stock: 100,
    image: '',
    description: '',
    brand: ''
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    ownerName: user?.ownerName || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    wilaya: user?.wilaya || '16 - Alger',
    address: user?.address || '',
    bio: user?.bio || '',
    logo: user?.logo || ''
  });

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getVendorProducts(user.id);
      setProducts(data);
    } catch (e) {
      console.error('Error fetching vendor products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (user) {
      setProfileForm({
        name: user.name || '',
        ownerName: user.ownerName || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        wilaya: user.wilaya || '16 - Alger',
        address: user.address || '',
        bio: user.bio || '',
        logo: user.logo || ''
      });
    }
  }, [user]);

  // Handle Logo Upload from Phone / Computer
  const handleLogoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const processedDataUrl = await processImageFile(file, 800, 800, 0.85);
      setProfileForm(prev => ({ ...prev, logo: processedDataUrl }));
      toast.success('Photo de profil chargée avec succès !');
    } catch (err) {
      toast.error('Erreur lors du traitement de la photo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle Product Image Upload from Phone / Computer
  const handleProductFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProductImg(true);
    try {
      const processedDataUrl = await processImageFile(file, 1000, 1000, 0.85);
      setProductForm(prev => ({ ...prev, image: processedDataUrl }));
      toast.success('Image du produit chargée avec succès !');
    } catch (err) {
      toast.error('Erreur lors du traitement de l\'image.');
    } finally {
      setUploadingProductImg(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct({ isNew: true });
    setProductForm({
      title: '',
      category: 'Dermo-Cosmétique',
      wholesalePrice: '',
      suggestedRetailPrice: '',
      minOrderQuantity: 12,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
      description: '',
      brand: ''
    });
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      category: product.category,
      wholesalePrice: product.wholesalePrice,
      suggestedRetailPrice: product.suggestedRetailPrice || '',
      minOrderQuantity: product.minOrderQuantity || 1,
      stock: product.stock || 0,
      image: product.image || '',
      description: product.description || '',
      brand: product.brand || ''
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.wholesalePrice) {
      toast.error('Veuillez entrer le titre et le prix de gros HT.');
      return;
    }

    try {
      if (editingProduct.isNew) {
        await addProduct({
          ...productForm,
          vendorId: user.id
        });
        toast.success('Nouveau produit en gros ajouté avec succès !');
      } else {
        await updateProduct(editingProduct.id, productForm);
        toast.success('Produit mis à jour avec succès !');
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde du produit.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit de votre catalogue ?')) return;
    try {
      await deleteProduct(productId);
      toast.success('Produit supprimé.');
      fetchProducts();
    } catch (err) {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateVendorProfile(user.id, profileForm);
      updateUserProfile(updated);
      toast.success('Profil de la boutique mis à jour avec succès !');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              {user?.logo ? (
                <img
                  src={user.logo}
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-sm shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 border-2 border-teal-300 dark:border-teal-800 flex items-center justify-center text-[#0d9488] dark:text-teal-400 shadow-sm shrink-0">
                  <Store className="w-8 h-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-500/30 text-[#0d9488] dark:text-teal-400 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Compte Vendeur Actif
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user?.wilaya} • {user?.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/store/${user?.id}`}
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                {t('viewPublicStore')}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {t('addProduct')}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Tabs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#0d9488] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('myProducts')} ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#0d9488] text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('myProfile')}</span>
          </button>
        </div>

        {/* Tab 1: Products Manager */}
        {activeTab === 'products' && (
          <div>
            {loading ? (
              <div className="py-16 text-center text-slate-500">Chargement de vos produits...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-4 items-start shadow-xs">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[11px] font-bold text-[#0d9488] dark:text-teal-400">{product.category}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.title}</h4>
                        <p className="text-xs text-slate-900 dark:text-teal-300 font-black mt-1">
                          {product.wholesalePrice.toLocaleString()} DZD <span className="text-slate-500 font-normal">/ un (Min: {product.minOrderQuantity})</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          {t('editProduct')}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-900/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t('deleteProduct')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Aucun produit en gros</h3>
                <button
                  onClick={handleOpenAddProduct}
                  className="mt-4 px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  + {t('addProduct')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Manager */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Modifier les informations de la boutique</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Profile Photo Uploader Section */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                  <span>Photo de Profil / Logo Boutique (Sans limite de taille)</span>
                </label>

                <div className="flex items-center gap-4">
                  {profileForm.logo ? (
                    <img
                      src={profileForm.logo}
                      alt="Logo preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/40 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 border-2 border-teal-300 dark:border-teal-800 flex items-center justify-center text-[#0d9488] dark:text-teal-400 shrink-0">
                      <Store className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all">
                      {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Choisir une photo depuis votre appareil (Galerie / Téléphone)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Ou collez un lien d'image direct ci-dessous :
                    </div>

                    <input
                      type="url"
                      placeholder="https://..."
                      value={profileForm.logo}
                      onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom de la boutique *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom du propriétaire / Responsable</label>
                  <input
                    type="text"
                    value={profileForm.ownerName}
                    onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Téléphone fixe / mobile</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Numéro WhatsApp commande</label>
                  <input
                    type="text"
                    placeholder="213550123456"
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Wilaya</label>
                  <select
                    value={profileForm.wilaya}
                    onChange={(e) => setProfileForm({ ...profileForm, wilaya: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-2 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  >
                    {WILAYAS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Adresse exacte / Zone industrielle</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description / Présentation du Grossiste</label>
                <textarea
                  rows="3"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t('saveProfile')}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingProduct.isNew ? 'Ajouter un Produit Gros' : t('editProduct')}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Titre du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sérum Vitamine C 30ml"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Catégorie</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-2 py-2 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  >
                    {CATEGORIES.filter(c => c !== 'Tous les produits').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Marque</label>
                  <input
                    type="text"
                    placeholder="Ex: DermaGlow"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0d9488] dark:text-teal-400 block mb-1">Prix de Gros HT (DZD) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1450"
                    value={productForm.wholesalePrice}
                    onChange={(e) => setProductForm({ ...productForm, wholesalePrice: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-teal-300 dark:border-teal-500/50 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantité Min (MOQ) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.minOrderQuantity}
                    onChange={(e) => setProductForm({ ...productForm, minOrderQuantity: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Product Image Uploader Section */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                  <span>Image du produit (Télécharger depuis l'appareil)</span>
                </label>

                <div className="flex items-center gap-3">
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Product preview"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                    />
                  )}

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all">
                      {uploadingProductImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Choisir une photo du produit</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Ou collez un lien URL d'image"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
