import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, LogOut, Sun, Moon, Globe, Menu, X, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Subtitle */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-400 shadow-xs group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                {t('appName')}
              </span>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {t('appSub')}
              </p>
            </div>
          </Link>

          {/* Desktop Right Controls (Language Switcher + Theme Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 mx-1 sm:mx-1.5 hidden sm:inline" />
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs rounded-lg transition-all ${
                  lang === 'fr' 
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs rounded-lg transition-all ${
                  lang === 'ar' 
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs rounded-lg transition-all ${
                  lang === 'en' 
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs font-black' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Light Mode" : "Dark Mode"}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-700" />}
            </button>

            {/* Logged in user/admin indicator & Logout */}
            {(user || isAdmin) && (
              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
