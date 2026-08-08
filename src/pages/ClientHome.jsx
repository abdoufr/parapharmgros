import React, { useState, useEffect } from 'react';
import { getAllProducts, getAllVendors } from '../firebase/firestoreService';
import { CATEGORIES, WILAYAS } from '../data/initialMockData';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import ProductModal from '../components/ProductModal';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Search, ShieldCheck, Package, Building2, RefreshCw } from 'lucide-react';

export default function ClientHome() {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous les produits');
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes les wilayas');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'stores'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedVendors] = await Promise.all([
        getAllProducts(),
        getAllVendors(false) // exclude deleted & deactivated
      ]);
      setProducts(fetchedProducts);
      setVendors(fetchedVendors.filter(v => v.status === 'active'));
    } catch (e) {
      console.error('Error fetching catalog:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const vendorMap = new Map(vendors.map(v => [v.id, v]));

  // Filter Products
  const filteredProducts = products.filter(product => {
    const vendor = vendorMap.get(product.vendorId);
    if (!vendor) return false;

    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'Tous les produits' || product.category === selectedCategory;

    const matchesWilaya = 
      selectedWilaya === 'Toutes les wilayas' || vendor.wilaya === selectedWilaya;

    return matchesSearch && matchesCategory && matchesWilaya;
  });

  // Filter Stores
  const filteredStores = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.wilaya.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWilaya = 
      selectedWilaya === 'Toutes les wilayas' || vendor.wilaya === selectedWilaya;

    return matchesSearch && matchesWilaya;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      
      {/* Hero Banner matching the screenshot */}
      <section className="bg-[#0d9488] dark:bg-[#0f2922] text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 text-center relative shadow-inner">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-200" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Floating White Card Container for Search & Filters */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 space-y-3">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Category & Wilaya Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-2.5 px-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Tous les produits">{t('allCategories')}</option>
                  {CATEGORIES.filter(c => c !== 'Tous les produits').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-2.5 px-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Toutes les wilayas">{t('allWilayas')}</option>
                  {WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Catalog Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Title Header matching reference screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('catalogTitle')} ({filteredProducts.length} {t('productsCount')})
            </h2>

            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'products'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('productsCount')}
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'stores'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('storesTitle')}
              </button>
            </div>
          </div>

          <button
            onClick={fetchData}
            title="Refresh"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Chargement...</p>
          </div>
        ) : activeTab === 'products' ? (
          filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendor={vendorMap.get(product.vendorId)}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('noProducts')}</h3>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tous les produits');
                  setSelectedWilaya('Toutes les wilayas');
                }}
                className="mt-4 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {t('resetFilters')}
              </button>
            </div>
          )
        ) : (
          filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map(vendor => {
                const count = products.filter(p => p.vendorId === vendor.id).length;
                return (
                  <StoreCard
                    key={vendor.id}
                    vendor={vendor}
                    productCount={count}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Aucune boutique trouvée</h3>
            </div>
          )
        )}
      </main>

      {/* Modal for product view */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          vendor={vendorMap.get(selectedProduct.vendorId)}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
