import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorById, getVendorProducts } from '../firebase/firestoreService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { useLanguage } from '../context/LanguageContext';
import { Store, MapPin, Phone, MessageCircle, ArrowLeft, ShieldCheck, Search, Package } from 'lucide-react';

export default function StoreDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const vendorData = await getVendorById(id);
        if (vendorData && !vendorData.isDeleted && vendorData.status === 'active') {
          setVendor(vendorData);
          const vendorProds = await getVendorProducts(id);
          setProducts(vendorProds.filter(p => p.active));
        } else {
          setVendor(null);
        }
      } catch (e) {
        console.error('Error loading store details:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md text-center shadow-md">
          <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Boutique introuvable ou inactive</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Cette boutique n'existe plus ou a été désactivée par l'administration.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToCatalog')}
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanWhatsapp = vendor.whatsapp ? vendor.whatsapp.replace(/\s+/g, '') : vendor.phone ? vendor.phone.replace(/\s+/g, '') : '';
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Bonjour ${vendor.name}, je vous contacte depuis la plateforme PARAGROS.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      
      {/* Back Button Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#0d9488] dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToCatalog')}
          </Link>
        </div>
      </div>

      {/* Store Header Banner */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-5">
              {vendor.logo ? (
                <img
                  src={vendor.logo}
                  alt={vendor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-teal-500/40 shadow-md shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-50 dark:bg-teal-950 border-2 border-teal-300 dark:border-teal-800 flex items-center justify-center text-[#0d9488] dark:text-teal-400 shadow-md shrink-0">
                  <Store className="w-10 h-10" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{vendor.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-500/40 text-[#0d9488] dark:text-teal-400 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t('certifiedGrossiste')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                  {vendor.address ? `${vendor.address}, ${vendor.wilaya}` : vendor.wilaya}
                </p>
                {vendor.bio && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">{vendor.bio}</p>
                )}
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  {t('contactSupplier')}
                </a>
              )}
              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                  {vendor.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Store Products */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0d9488] dark:text-teal-400" />
              Produits de la boutique ({filteredProducts.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Prix de gros HT réservés aux professionnels de parapharmacie</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher dans cette boutique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                vendor={vendor}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Aucun produit dans cette boutique</h3>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          vendor={vendor}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
