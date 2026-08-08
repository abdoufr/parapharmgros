import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentAuthUser, logoutAuth } from '../firebase/authService';
import { getVendorById } from '../firebase/firestoreService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedAdmin = localStorage.getItem('paragros_admin_session');
      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }

      const current = getCurrentAuthUser();
      if (current && current.id) {
        // Refresh profile from DB
        const fresh = await getVendorById(current.id);
        if (fresh && !fresh.isDeleted && fresh.status === 'active') {
          setUser(fresh);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAdmin(false);
    localStorage.removeItem('paragros_admin_session');
  };

  const loginAdmin = () => {
    setIsAdmin(true);
    setUser(null);
    localStorage.setItem('paragros_admin_session', 'true');
  };

  const logout = async () => {
    await logoutAuth();
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('paragros_admin_session');
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginUser, loginAdmin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
