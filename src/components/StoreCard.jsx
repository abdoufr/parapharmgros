import React from 'react';
import { Store, MapPin, Phone, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StoreCard({ vendor, productCount }) {
  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-lg hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate flex items-center gap-1.5">
              {vendor.name}
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            </h3>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {vendor.wilaya}
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-900 text-slate-300 text-[11px] font-semibold rounded-md border border-slate-700">
              {productCount} Produits en gros
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {vendor.bio || 'Grossiste agréé en parapharmacie.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Tél: <span className="text-slate-200 font-semibold">{vendor.phone || 'Non renseigné'}</span>
        </div>

        <Link
          to={`/store/${vendor.id}`}
          className="py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-emerald-500/30"
        >
          Visiter Boutique
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
