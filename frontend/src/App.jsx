import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminAddProperty from './pages/AdminAddProperty';
import AdminEditProperty from './pages/AdminEditProperty';
import AdminCategories from './pages/AdminCategories';
import AdminRequests from './pages/AdminRequests';
import MaklerDashboard from './pages/MaklerDashboard';

// Route Guards
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';

// 404 Page Component
const NotFound = () => {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-5 text-slate-800">
      <div className="text-6xl font-black text-primary-900">404</div>
      <h2 className="text-xl font-bold">404</h2>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">
        {t('notFound')}
      </p>
      <Link
        to="/"
        className="inline-block px-5 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-sm shadow-md"
      >
        {t('navHome')}
      </Link>
    </div>
  );
};
import { Link } from 'react-router-dom';

function App() {
  return (
    <ToastProvider>
      <LocaleProvider>
        <AuthProvider>
          <Router>
            <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:id" element={<PropertyDetails />} />
              <Route path="login" element={<AdminLogin />} />
              <Route path="register" element={<Register />} />
              <Route
                path="add-property"
                element={
                  <ProtectedRoute>
                    <AdminAddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="makler"
                element={
                  <ProtectedRoute>
                    <MaklerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Dashboard Layout Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="add-property" element={<AdminAddProperty />} />
              <Route path="edit-property/:id" element={<AdminEditProperty />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="requests" element={<AdminRequests />} />
            </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </LocaleProvider>
    </ToastProvider>
  );
}

export default App;
