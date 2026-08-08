import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-900 text-slate-400 text-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <Store className="w-5 h-5 text-teal-400" />
              <span>{t('appName')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {t('appSub')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Grossistes Agréés</h4>
            <ul className="space-y-2 text-xs">
              <li><span>Alger, Oran, Sétif, Blida, Constantine</span></li>
              <li><span>Dermo-Cosmétique & Compléments Alimentaires</span></li>
              <li><span>Matériel Médical & Produits Bébé</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Contact & Assistance</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@paragros.dz</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+213 (0) 550 00 00 00</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>© 2026 PARAGROS. Tous droits réservés.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-slate-300 cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
