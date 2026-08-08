import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default admin validation
    loginAdmin();
    toast.success('Bienvenue dans le panneau d\'administration Paragros !');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-rose-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Administration PARAGROS</h1>
          <p className="text-xs text-slate-400 mt-1">Gestion centrale des comptes grossistes</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Identifiant Admin</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@paragros.dz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Accéder au Panneau d'Administration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              onClick={() => { loginAdmin(); toast.success('Accès Administrateur démo accordé'); }}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/40"
            >
              🔑 Connexion Rapide Administrateur (Démo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
