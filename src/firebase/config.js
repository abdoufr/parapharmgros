import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase credentials provided by user
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGPiEFDZ3wYYZ_LQZKViWaa48UxNJtg1Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "parapharmgros-f926b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "parapharmgros-f926b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "parapharmgros-f926b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "323967307995",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:323967307995:web:63e9329428629d8ae83cfe"
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { app, auth, db, googleProvider };
