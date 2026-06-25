import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IoMenu, IoClose, IoHome, IoSearch, IoGrid, IoLogOut, IoSettingsSharp, IoLogIn, IoAddCircle } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect for styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      showToast('success', 'Tizimdan muvaffaqiyatli chiqdingiz!');
      navigate('/');
    } else {
      showToast('error', res.message);
    }
  };

  const activeStyle = "text-primary-600 font-semibold border-b-2 border-primary-600 pb-1";
  const inactiveStyle = "text-slate-600 hover:text-primary-600 font-medium pb-1 transition-colors";
  
  const mobileActiveStyle = "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-semibold";
  const mobileInactiveStyle = "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
              <IoHome className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
              House<span className="text-accent-600 font-extrabold">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              Bosh sahifa
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              E'lonlar
            </NavLink>
            <NavLink to="/add-property" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              E'lon joylash
            </NavLink>
            {user && user.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-100" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.role === 'admin' ? 'Admin' : 'Mijoz'}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-100 transition-all"
                  title="Chiqish"
                >
                  <IoLogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-900 text-white font-medium hover:bg-primary-800 shadow-md shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all"
              >
                <IoLogIn className="h-5 w-5" />
                <span>Kirish</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 transition-all border border-slate-100"
            >
              {isOpen ? <IoClose className="h-6 w-6" /> : <IoMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-effect border-b border-slate-100 mx-4 mt-2 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 py-4">
            <NavLink to="/" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoHome className="h-5 w-5" />
              Bosh sahifa
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoGrid className="h-5 w-5" />
              E'lonlar
            </NavLink>
            <NavLink to="/add-property" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoAddCircle className="h-5 w-5" />
              E'lon joylash
            </NavLink>
            {user && user.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
                <IoSettingsSharp className="h-5 w-5" />
                Admin Panel
              </NavLink>
            )}

            {user ? (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-4 py-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.role === 'admin' ? 'Admin' : 'Mijoz'}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition-colors"
                >
                  <IoLogOut className="h-5 w-5" />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary-900 text-white font-semibold hover:bg-primary-800 transition-colors shadow-md shadow-primary-900/10"
              >
                <IoLogIn className="h-5 w-5" />
                <span>Kirish</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
