import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, loginUser, logoutUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on refresh
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await getMe();
      if (res && res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log('Session check failed or user not logged in.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res && res.success) {
        setUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Xatolik yuz berdi' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login qilishda xatolik yuz berdi';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await registerUser(name, email, password);
      if (res && res.success) {
        setUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error('Logout failed', err);
      return { success: false, message: 'Tizimdan chiqishda xatolik yuz berdi' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
