import { db, isFirebaseConfigured } from './config';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where 
} from 'firebase/firestore';
import { INITIAL_VENDORS, INITIAL_PRODUCTS } from '../data/initialMockData';

const LOCAL_STORAGE_KEY_VENDORS = 'paragros_vendors_v1';
const LOCAL_STORAGE_KEY_PRODUCTS = 'paragros_products_v1';

// Helpers to get local storage data
const getLocalVendors = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_VENDORS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY_VENDORS, JSON.stringify(INITIAL_VENDORS));
    return INITIAL_VENDORS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_VENDORS;
  }
};

const saveLocalVendors = (vendors) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_VENDORS, JSON.stringify(vendors));
};

const getLocalProducts = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
};

const saveLocalProducts = (products) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
};

/* ==================== VENDOR SERVICES ==================== */

export const getAllVendors = async (includeDeleted = false) => {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      const vendors = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return includeDeleted ? vendors : vendors.filter(v => !v.isDeleted);
    } catch (e) {
      console.warn('Firebase error, falling back to local:', e);
    }
  }
  const vendors = getLocalVendors();
  return includeDeleted ? vendors : vendors.filter(v => !v.isDeleted);
};

export const getVendorById = async (vendorId) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'vendors', vendorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (e) {
      console.warn('Firebase getVendor error:', e);
    }
  }
  const vendors = getLocalVendors();
  return vendors.find(v => v.id === vendorId) || null;
};

export const createVendorInDB = async (vendorData) => {
  const newVendor = {
    id: vendorData.id || 'v_' + Date.now(),
    name: vendorData.name || 'Boutique Grossiste',
    ownerName: vendorData.ownerName || '',
    email: vendorData.email,
    phone: vendorData.phone || '',
    whatsapp: vendorData.whatsapp || '',
    wilaya: vendorData.wilaya || '16 - Alger',
    address: vendorData.address || '',
    logo: vendorData.logo || '', // Default empty profile picture for new accounts
    bio: vendorData.bio || 'Grossiste de produits de parapharmacie.',
    status: vendorData.status || 'active',
    isDeleted: false,
    deletedAt: null,
    isEmailVerified: vendorData.isEmailVerified || false,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'vendors', newVendor.id), newVendor);
    } catch (e) {
      console.warn('Firebase setDoc vendor error:', e);
    }
  }

  const vendors = getLocalVendors();
  const index = vendors.findIndex(v => v.id === newVendor.id);
  if (index >= 0) {
    vendors[index] = newVendor;
  } else {
    vendors.unshift(newVendor);
  }
  saveLocalVendors(vendors);
  return newVendor;
};

export const updateVendorProfile = async (vendorId, profileData) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'vendors', vendorId);
      await updateDoc(docRef, profileData);
    } catch (e) {
      console.warn('Firebase update vendor error:', e);
    }
  }

  const vendors = getLocalVendors();
  const index = vendors.findIndex(v => v.id === vendorId);
  if (index >= 0) {
    vendors[index] = { ...vendors[index], ...profileData };
    saveLocalVendors(vendors);
    return vendors[index];
  }
  return null;
};

export const toggleVendorStatus = async (vendorId, newStatus) => {
  return await updateVendorProfile(vendorId, { status: newStatus });
};

// Soft Delete Vendor (marked isDeleted: true)
export const softDeleteVendor = async (vendorId) => {
  return await updateVendorProfile(vendorId, { 
    isDeleted: true, 
    deletedAt: new Date().toISOString() 
  });
};

// Restore Soft Deleted Vendor
export const restoreVendor = async (vendorId) => {
  return await updateVendorProfile(vendorId, { 
    isDeleted: false, 
    deletedAt: null 
  });
};

/* ==================== PRODUCT SERVICES ==================== */

export const getAllProducts = async () => {
  const vendors = await getAllVendors(false); // active non-deleted vendors
  const activeVendorIds = new Set(vendors.filter(v => v.status === 'active').map(v => v.id));

  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return products.filter(p => p.active && activeVendorIds.has(p.vendorId));
    } catch (e) {
      console.warn('Firebase getProducts error:', e);
    }
  }

  const products = getLocalProducts();
  return products.filter(p => p.active && activeVendorIds.has(p.vendorId));
};

export const getVendorProducts = async (vendorId) => {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'products'), where('vendorId', '==', vendorId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('Firebase getVendorProducts error:', e);
    }
  }

  const products = getLocalProducts();
  return products.filter(p => p.vendorId === vendorId);
};

export const addProduct = async (productData) => {
  const newProduct = {
    id: 'p_' + Date.now(),
    vendorId: productData.vendorId,
    title: productData.title,
    category: productData.category || 'Général',
    wholesalePrice: Number(productData.wholesalePrice) || 0,
    suggestedRetailPrice: Number(productData.suggestedRetailPrice) || 0,
    minOrderQuantity: Number(productData.minOrderQuantity) || 1,
    stock: Number(productData.stock) || 0,
    inStock: Number(productData.stock) > 0,
    image: productData.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: productData.description || '',
    brand: productData.brand || '',
    active: true,
    createdAt: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (e) {
      console.warn('Firebase addProduct error:', e);
    }
  }

  const products = getLocalProducts();
  products.unshift(newProduct);
  saveLocalProducts(products);
  return newProduct;
};

export const updateProduct = async (productId, productData) => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, productData);
    } catch (e) {
      console.warn('Firebase updateProduct error:', e);
    }
  }

  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index >= 0) {
    products[index] = { ...products[index], ...productData };
    saveLocalProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = async (productId) => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.warn('Firebase deleteProduct error:', e);
    }
  }

  const products = getLocalProducts();
  const filtered = products.filter(p => p.id !== productId);
  saveLocalProducts(filtered);
  return true;
};
