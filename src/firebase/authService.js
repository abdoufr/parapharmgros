import { 
  auth, googleProvider, isFirebaseConfigured 
} from './config';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { createVendorInDB, getVendorById, getAllVendors, updateVendorProfile } from './firestoreService';

const MOCK_AUTH_STORAGE_KEY = 'paragros_auth_user';

export const getCurrentAuthUser = () => {
  if (isFirebaseConfigured && auth?.currentUser) {
    return auth.currentUser;
  }
  const saved = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const saveAuthSession = (user) => {
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
};

/**
 * Vendor Login / Register with Google
 */
export const signInWithGoogleAuth = async () => {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      let vendor = await getVendorById(firebaseUser.uid);
      if (!vendor) {
        vendor = await createVendorInDB({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Grossiste ' + firebaseUser.email.split('@')[0],
          ownerName: firebaseUser.displayName || '',
          email: firebaseUser.email,
          logo: firebaseUser.photoURL || undefined,
          isEmailVerified: true,
          status: 'active'
        });
      }
      
      saveAuthSession(vendor);
      return { user: vendor, isNew: !vendor };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  // Fallback Mock Google Auth
  const mockId = 'v_google_' + Date.now();
  const mockUser = await createVendorInDB({
    id: mockId,
    name: 'Boutique Grossiste (Google)',
    ownerName: 'Vendeur Google',
    email: 'vendeur.google@paragros.dz',
    phone: '0550 00 11 22',
    whatsapp: '213550001122',
    wilaya: '16 - Alger',
    status: 'active',
    isEmailVerified: true
  });
  saveAuthSession(mockUser);
  return { user: mockUser, isNew: true };
};

/**
 * Vendor Signup with Email & Password
 * Strict Email Verification: Does NOT save session automatically!
 */
export const registerWithEmailAuth = async (email, password, storeData = {}) => {
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const actionCodeSettings = {
        url: window.location.origin + '/vendeur?verified=true',
        handleCodeInApp: true,
      };

      try {
        await sendEmailVerification(firebaseUser, actionCodeSettings);
      } catch (e) {
        console.warn('Firebase email verification warning:', e);
      }

      const vendor = await createVendorInDB({
        id: firebaseUser.uid,
        name: storeData.name || 'Boutique Grossiste',
        ownerName: storeData.ownerName || '',
        email: email,
        phone: storeData.phone || '',
        whatsapp: storeData.whatsapp || '',
        wilaya: storeData.wilaya || '16 - Alger',
        address: storeData.address || '',
        status: 'active',
        isEmailVerified: false
      });

      // DO NOT save session until email is verified!
      return { 
        user: vendor,
        requiresVerification: true,
        verificationCode: generatedCode,
        message: `Votre compte a été créé ! Un e-mail de confirmation a été envoyé à ${email}. Veuillez cliquer sur le lien reçu par e-mail pour activer votre compte avant d'accéder au panneau vendeur.` 
      };
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  // Fallback Mock Email Registration
  const mockId = 'v_email_' + Date.now();
  const mockVendor = await createVendorInDB({
    id: mockId,
    name: storeData.name || 'Boutique Grossiste',
    ownerName: storeData.ownerName || '',
    email: email,
    phone: storeData.phone || '',
    whatsapp: storeData.whatsapp || '',
    wilaya: storeData.wilaya || '16 - Alger',
    address: storeData.address || '',
    status: 'active',
    isEmailVerified: false
  });

  return { 
    user: mockVendor, 
    requiresVerification: true,
    verificationCode: generatedCode,
    message: `Votre compte a été créé ! Un code de confirmation a été envoyé à ${email}.` 
  };
};

/**
 * Confirm/Verify Email with Code
 */
export const verifyVendorEmailCode = async (vendorId) => {
  await updateVendorProfile(vendorId, { isEmailVerified: true });
  const vendor = await getVendorById(vendorId);
  if (vendor) {
    saveAuthSession(vendor);
  }
  return vendor;
};

/**
 * Resend Email Verification Link/Code
 */
export const resendEmailVerificationAuth = async () => {
  if (isFirebaseConfigured && auth?.currentUser) {
    const actionCodeSettings = {
      url: window.location.origin + '/vendeur?verified=true',
      handleCodeInApp: true,
    };
    await sendEmailVerification(auth.currentUser, actionCodeSettings);
    return {
      message: `Un nouvel e-mail de confirmation a été renvoyé à ${auth.currentUser.email}.`
    };
  }
  return {
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    message: 'Nouveau code de confirmation envoyé avec succès.'
  };
};

/**
 * Vendor Login with Email & Password
 * Checks if Email is Verified!
 */
export const loginWithEmailAuth = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const vendor = await getVendorById(firebaseUser.uid);
      
      if (!vendor) {
        throw new Error('Profil vendeur non trouvé.');
      }
      if (vendor.isDeleted) {
        throw new Error('Ce compte a été supprimé par l\'administrateur.');
      }
      if (vendor.status === 'deactivated') {
        throw new Error('Votre compte est désactivé. Veuillez contacter l\'administrateur.');
      }

      // Check if verified in Firebase or profile
      if (firebaseUser.emailVerified && !vendor.isEmailVerified) {
        await updateVendorProfile(vendor.id, { isEmailVerified: true });
        vendor.isEmailVerified = true;
      }

      if (!firebaseUser.emailVerified && !vendor.isEmailVerified) {
        // Sign out Firebase session temporarily
        await signOut(auth);
        const err = new Error(`Votre adresse e-mail (${email}) n'a pas encore été confirmée. Veuillez cliquer sur le lien de vérification reçu dans votre boîte e-mail.`);
        err.requiresVerification = true;
        err.vendorId = vendor.id;
        err.email = email;
        throw err;
      }

      saveAuthSession(vendor);
      return vendor;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  // Fallback Mock Login
  const vendors = await getAllVendors(true);
  const found = vendors.find(v => v.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    throw new Error('Aucun compte trouvé avec cet e-mail.');
  }
  if (found.isDeleted) {
    throw new Error('Ce compte a été supprimé par l\'administrateur.');
  }
  if (found.status === 'deactivated') {
    throw new Error('Votre compte est désactivé par l\'administrateur.');
  }

  if (!found.isEmailVerified) {
    const err = new Error(`Votre adresse e-mail (${email}) n'a pas encore été confirmée. Veuillez saisir le code de confirmation.`);
    err.requiresVerification = true;
    err.vendorId = found.id;
    err.email = email;
    throw err;
  }

  saveAuthSession(found);
  return found;
};

/**
 * Send Password Reset Email / Code ("Password Oublié")
 */
export const sendPasswordResetAuth = async (email) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (isFirebaseConfigured && auth) {
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/vendeur',
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      return { 
        success: true, 
        resetCode: resetCode,
        message: `Un e-mail contenant le lien de réinitialisation a été envoyé à ${email}. (Vérifiez également votre dossier Spams).` 
      };
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  }

  return {
    success: true,
    resetCode: resetCode,
    message: `Un code de réinitialisation a été envoyé à ${email}. (Code démo : ${resetCode})`
  };
};

/**
 * Logout
 */
export const logoutAuth = async () => {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  }
  clearAuthSession();
};
