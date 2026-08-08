import React from 'react';
import { Store, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StoreCard({ vendor, productCount }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          {vendor.logo ? (
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="w-14 h-14 rounded-2xl object-cover border border-teal-200 dark:border-teal-500/30 shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-[#0d9488] dark:text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
              <Store className="w-7 h-7" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0d9488] dark:group-hover:text-teal-400 transition-colors truncate flex items-center gap-1.5">
              {vendor.name}
              <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-teal-400 shrink-0" />
            </h3>
            <p className="text-xs text-[#0d9488] dark:text-teal-400 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {vendor.wilaya}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-800">
              {productCount} Produits en gros
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {vendor.bio || 'Grossiste agréé en parapharmacie.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Tél: <span className="text-slate-800 dark:text-slate-200 font-semibold">{vendor.phone || 'Non renseigné'}</span>
        </div>

        <Link
          to={`/store/${vendor.id}`}
          className="py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-[#0d9488] text-[#0d9488] dark:text-teal-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-teal-200 dark:border-teal-500/30"
        >
          Visiter Boutique
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
