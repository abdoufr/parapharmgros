import React from 'react';
import { X, MessageCircle, Phone, MapPin, Store, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ProductModal({ product, vendor, onClose }) {
  const { t } = useLanguage();
  if (!product) return null;

  const whatsappNumber = vendor?.whatsapp || vendor?.phone?.replace(/\s+/g, '') || '';
  const cleanWhatsapp = whatsappNumber.startsWith('+') ? whatsappNumber.substring(1) : whatsappNumber;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Bonjour ${vendor?.name || 'Grossiste'},\nJe souhaite commander votre produit en gros sur PARAGROS :\n- Produit : ${product.title}\n- Quantité minimum : ${product.minOrderQuantity} pièces\n- Prix unitaire : ${product.wholesalePrice} DZD`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Image */}
            <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <span className="inline-block px-3 py-1 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-500/40 text-[#0d9488] dark:text-teal-400 text-xs font-bold rounded-lg mb-2">
                  {product.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h2>
                {product.brand && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Marque : {product.brand}</p>
                )}
              </div>

              {/* Wholesale Pricing Box */}
              <div className="bg-slate-50 dark:bg-slate-950/90 rounded-2xl p-4 border border-teal-200 dark:border-teal-500/30">
                <div className="text-xs text-[#0d9488] dark:text-teal-400 font-semibold mb-1">Prix de Gros Vendeur</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-teal-300 flex items-baseline gap-1">
                  {product.wholesalePrice.toLocaleString()} <span className="text-xs sm:text-sm font-bold text-[#0d9488] dark:text-teal-500">DZD / Unité</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Quantité Min (MOQ):</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200 text-sm">{product.minOrderQuantity} {t('pcs')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Prix Conseillé:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{product.suggestedRetailPrice ? `${product.suggestedRetailPrice} DZD` : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {product.description || 'Aucune description spécifique fournie par le fournisseur.'}
                </p>
              </div>
            </div>
          </div>

          {/* Supplier Info Section */}
          {vendor && (
            <div className="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-teal-200 dark:border-teal-500/30 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {vendor.name}
                      <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-teal-400" />
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0d9488] dark:text-teal-400" />
                      {vendor.address ? `${vendor.address}, ${vendor.wilaya}` : vendor.wilaya}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/store/${vendor.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0d9488] dark:text-teal-400 hover:underline font-bold bg-teal-50 dark:bg-teal-950/60 px-3 py-2 rounded-xl border border-teal-200 dark:border-teal-500/30 self-start sm:self-auto"
                >
                  <Store className="w-3.5 h-3.5" />
                  {t('visitStore')}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Direct Order Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {whatsappNumber && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    {t('contactSupplier')}
                  </a>
                )}

                {vendor.phone && (
                  <a
                    href={`tel:${vendor.phone}`}
                    className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#0d9488] dark:text-teal-400" />
                    {t('callSupplier')} ({vendor.phone})
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
