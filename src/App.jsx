import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import ClientHome from './pages/ClientHome';
import StoreDetail from './pages/StoreDetail';
import VendorAuth from './pages/vendeur/VendorAuth';
import VendorDashboard from './pages/vendeur/VendorDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Wrapper for /vendeur route
function VendorRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 text-sm">
        Chargement de la session...
      </div>
    );
  }
  return user ? <VendorDashboard /> : <VendorAuth />;
}

// Wrapper for /admin route
function AdminRoute() {
  const { isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 text-sm">
        Chargement d'administration...
      </div>
    );
  }
  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<ClientHome />} />
                    <Route path="/store/:id" element={<StoreDetail />} />
                    <Route path="/vendeur/*" element={<VendorRoute />} />
                    <Route path="/admin/*" element={<AdminRoute />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
