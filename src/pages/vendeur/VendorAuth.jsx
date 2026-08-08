import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  signInWithGoogleAuth, 
  registerWithEmailAuth, 
  loginWithEmailAuth, 
  sendPasswordResetAuth,
  resendEmailVerificationAuth,
  verifyVendorEmailCode
} from '../../firebase/authService';
import { WILAYAS } from '../../data/initialMockData';
import { 
  Store, Lock, Mail, ArrowRight, Send, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function VendorAuth() {
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'verify'
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');
  const [address, setAddress] = useState('');

  // Verification Pending Screen State
  const [pendingVerification, setPendingVerification] = useState(null); // { vendorId, email, code, message }
  const [enteredCode, setEnteredCode] = useState('');

  // Google Sign-In (Auto-verified)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogleAuth();
      loginUser(res.user);
      toast.success('Connexion via Google réussie !');
    } catch (err) {
      toast.error(err.message || 'Échec de la connexion Google.');
    } finally {
      setLoading(false);
    }
  };

  // Email + Password Login (Checks Email Verification)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const vendor = await loginWithEmailAuth(email, password);
      loginUser(vendor);
      toast.success('Bienvenue dans votre espace vendeur !');
    } catch (err) {
      if (err.requiresVerification) {
        setPendingVerification({
          vendorId: err.vendorId,
          email: err.email,
          message: err.message
        });
        setMode('verify');
        toast.info('Vérification e-mail requise.');
      } else {
        toast.error(err.message || 'Email ou mot de passe incorrect.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Registration (Strict Email Verification Enforcement)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !storeName) {
      toast.error('Veuillez renseigner le nom de boutique, email et mot de passe.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerWithEmailAuth(email, password, {
        name: storeName,
        ownerName,
        phone,
        whatsapp: whatsapp || phone,
        wilaya,
        address
      });

      // Switch to Verification Screen (DO NOT OPEN DASHBOARD)
      setPendingVerification({
        vendorId: res.user.id,
        email: email,
        code: res.verificationCode,
        message: res.message
      });
      setMode('verify');
      toast.info('Veuillez confirmer votre adresse e-mail pour activer le compte.');
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  // Validate Email Verification Code or Confirmation Link Click
  const handleConfirmVerification = async (e) => {
    e.preventDefault();
    if (!pendingVerification) return;
    setLoading(true);
    try {
      const verifiedVendor = await verifyVendorEmailCode(pendingVerification.vendorId);
      loginUser(verifiedVendor);
      toast.success('E-mail confirmé avec succès ! Accès au panneau vendeur accordé.');
    } catch (err) {
      toast.error('Erreur lors de la validation du compte.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email
  const handleResendEmail = async () => {
    setResending(true);
    try {
      const res = await resendEmailVerificationAuth();
      toast.success(res.message);
    } catch (err) {
      toast.error('Erreur lors du renvoi de l\'e-mail.');
    } finally {
      setResending(false);
    }
  };

  // Forgot Password ("Password Oublié")
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez saisir votre adresse e-mail.');
      return;
    }
    setLoading(true);
    try {
      const res = await sendPasswordResetAuth(email);
      toast.success('Lien / Code de réinitialisation envoyé à votre e-mail !');
    } catch (err) {
      toast.error(err.message || 'Erreur lors de l\'envoi du code.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoVendorLogin = async () => {
    setLoading(true);
    try {
      const vendor = await loginWithEmailAuth('karim@pharmaplus-gros.dz', 'password');
      loginUser(vendor);
      toast.success('Connecté en tant que Boutique Démo (Vérifiée)');
    } catch (err) {
      toast.error('Erreur démo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 transition-colors">
      
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#0d9488] flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-teal-700/30">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('vendorTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('vendorSub')}
          </p>
        </div>

        {/* Verification Required Dedicated Screen */}
        {mode === 'verify' && pendingVerification ? (
          <div className="bg-white dark:bg-slate-900 border border-teal-500/50 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Vérification E-mail Requise</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Un e-mail de confirmation avec un **lien d'activation** a été envoyé à :
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-100 dark:bg-slate-950 rounded-lg text-xs font-mono font-bold text-[#0d9488] dark:text-teal-400 border border-slate-200 dark:border-slate-800">
                {pendingVerification.email}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 text-left space-y-2">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Instructions d'activation :
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Ouvrez votre boîte e-mail ({pendingVerification.email}).</li>
                <li>Consultez les **Boîte de réception** et **Spams/Courriers indésirables**.</li>
                <li>Cliquez sur le **lien de confirmation** reçu par e-mail.</li>
              </ol>
            </div>

            {/* Optional Manual Code / Validation Form */}
            <form onSubmit={handleConfirmVerification} className="space-y-3">
              {pendingVerification.code && (
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Ou saisissez votre code de confirmation :
                  </label>
                  <input
                    type="text"
                    placeholder="Saisissez le code"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-center font-mono font-bold text-base px-3 py-2 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Vérification...' : 'J\'ai confirmé mon e-mail / Activer le compte'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="font-bold text-[#0d9488] dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                Renvoyer l'e-mail
              </button>

              <button
                onClick={() => { setMode('login'); setPendingVerification(null); }}
                className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        ) : (

          /* Standard Auth Box */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setMode('login')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-[#0d9488] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('login')}
              </button>
              <button
                onClick={() => setMode('register')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-[#0d9488] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t('register')}
              </button>
            </div>

            {/* Google Auth Button */}
            {mode !== 'forgot' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-3 shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span>{t('googleAuth')}</span>
                </button>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">{t('orWithEmail')}</span>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('emailLabel')}</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="votre-nom@grossiste.dz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('passLabel')}</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-bold text-[#0d9488] dark:text-teal-400 hover:underline"
                    >
                      {t('forgotPass')}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 pl-10 pr-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? '...' : t('login')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Registration Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('storeNameLabel')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pharmaplus Gros Alger"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('emailLabel')} *</label>
                  <input
                    type="email"
                    required
                    placeholder="vendeur@domaine.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('passLabel')} *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('phoneLabel')}</label>
                    <input
                      type="text"
                      placeholder="0550 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('wilayaLabel')}</label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-2 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                    >
                      {WILAYAS.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? '...' : t('createAccountBtn')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Forgot Password */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('forgotPass')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Saisissez votre e-mail pour recevoir le code de réinitialisation.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{t('emailLabel')}</label>
                  <input
                    type="email"
                    required
                    placeholder="votre-email@grossiste.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  {loading ? '...' : t('sendResetBtn')}
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white text-center pt-2"
                >
                  ← {t('login')}
                </button>
              </form>
            )}

            {/* Demo Shortcut */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={handleDemoVendorLogin}
                className="text-xs font-bold text-[#0d9488] dark:text-teal-400 hover:underline bg-teal-50 dark:bg-teal-950/60 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800/40"
              >
                🚀 Accès Démo Vendeur
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
