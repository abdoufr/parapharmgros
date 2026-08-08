import React from 'react';
import { Store, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product, vendor, onSelect }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      
      <div>
        {/* Image Container with category pill & photos count matching screenshot */}
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Left Category Pill */}
          <div className="absolute top-3 left-3 bg-[#0d9488] text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
            {product.category}
          </div>

          {/* Bottom Right Photo Count Badge */}
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20">
            <ImageIcon className="w-3 h-3" />
            <span>1 {t('photos')}</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-[#0d9488] cursor-pointer transition-colors leading-snug"
          >
            {product.title}
          </h3>

          {/* Vendor Link matching screenshot */}
          {vendor && (
            <Link 
              to={`/store/${vendor.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#0d9488] dark:text-teal-400 hover:underline font-semibold"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="truncate max-w-[180px]">{vendor.name} ({vendor.wilaya?.split('-')[1] || vendor.wilaya})</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* Pricing & Button Box */}
      <div className="p-4 sm:p-5 pt-0 space-y-3">
        
        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-lg sm:text-xl font-black text-[#0d9488] dark:text-teal-400">
            {product.wholesalePrice.toLocaleString()} <span className="text-xs font-bold uppercase">DZD</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('minQty')}: <span className="font-bold text-slate-700 dark:text-slate-200">{product.minOrderQuantity} {t('pcs')}</span>
          </div>
        </div>

        {/* Action Button matching screenshot */}
        <button
          onClick={() => onSelect(product)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>{t('seeDetails')} (1 {t('photos')})</span>
        </button>

      </div>
    </div>
  );
}
