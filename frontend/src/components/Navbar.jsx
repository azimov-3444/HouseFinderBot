import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LANGUAGES, CURRENCIES, useLocale } from '../context/LocaleContext';
import { useTheme } from '../context/ThemeContext';
import { IoMenu, IoClose, IoHome, IoGrid, IoLogOut, IoSettingsSharp, IoLogIn, IoAddCircle, IoMoon, IoSunny } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { language, setLanguage, currency, setCurrency, t } = useLocale();
  const { isDark, toggleTheme } = useTheme();
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
      showToast('success', t('logout'));
      navigate('/');
    } else {
      showToast('error', res.message);
    }
  };

  const isHeroNav = location.pathname === '/' && !isScrolled;
  const activeStyle = isHeroNav
    ? "text-white font-semibold border-b-2 border-emerald-300 pb-1"
    : "text-primary-600 dark:text-emerald-300 font-semibold border-b-2 border-primary-600 dark:border-emerald-300 pb-1";
  const inactiveStyle = isHeroNav
    ? "text-white/80 hover:text-white font-medium pb-1 transition-colors"
    : "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white font-medium pb-1 transition-colors";
  
  const mobileActiveStyle = "flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-emerald-400/10 text-primary-700 dark:text-emerald-200 font-semibold";
  const mobileInactiveStyle = "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/82 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-white/10 py-3'
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
            <span className={`text-xl font-bold ${isHeroNav ? 'text-white' : 'bg-gradient-to-r from-primary-900 to-primary-700 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent'}`}>
              House<span className="text-accent-600 font-extrabold">Finder</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              {t('navHome')}
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              {t('navListings')}
            </NavLink>
            <NavLink to="/add-property" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
              {t('navAdd')}
            </NavLink>
            {user && user.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}>
                {t('adminPanel')}
              </NavLink>
            )}
          </div>

          {/* Desktop User Panel */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 px-3 text-xs font-bold text-slate-700 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-400"
                aria-label="Language"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 px-3 text-xs font-bold text-slate-700 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-emerald-400"
                aria-label="Currency"
              >
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg shadow-sm transition-all active:scale-95 ${
                  isHeroNav
                    ? 'border-white/20 bg-white/12 text-white hover:bg-white/22'
                    : 'border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
                aria-label={isDark ? 'Light mode' : 'Dark mode'}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <IoSunny className="h-5 w-5" /> : <IoMoon className="h-5 w-5" />}
              </button>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-100" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-emerald-400/10 text-primary-700 dark:text-emerald-200 font-semibold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{user.role === 'admin' ? 'Admin' : t('client')}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/8 text-slate-500 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 border border-slate-100 dark:border-white/10 transition-all"
                  title="Chiqish"
                >
                  <IoLogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium shadow-md active:scale-95 transition-all ${
                  isHeroNav
                    ? 'bg-white text-slate-950 hover:bg-emerald-300 shadow-slate-950/20'
                    : 'bg-primary-900 dark:bg-emerald-400 text-white dark:text-slate-950 hover:bg-primary-800 dark:hover:bg-emerald-300 shadow-primary-900/10 hover:shadow-primary-900/20'
                }`}
              >
                <IoLogIn className="h-5 w-5" />
                <span>{t('login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-all border ${
                isHeroNav
                  ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                  : 'border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-white/10 hover:text-slate-800'
              }`}
            >
              {isOpen ? <IoClose className="h-6 w-6" /> : <IoMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-effect border-b border-slate-100 dark:border-white/10 mx-4 mt-2 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 py-4">
            <NavLink to="/" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoHome className="h-5 w-5" />
              {t('navHome')}
            </NavLink>
            <NavLink to="/properties" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoGrid className="h-5 w-5" />
              {t('navListings')}
            </NavLink>
            <NavLink to="/add-property" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
              <IoAddCircle className="h-5 w-5" />
              {t('navAdd')}
            </NavLink>
            {user && user.role === 'admin' && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? mobileActiveStyle : mobileInactiveStyle)}>
                <IoSettingsSharp className="h-5 w-5" />
                {t('adminPanel')}
              </NavLink>
            )}

            <div className="grid grid-cols-2 gap-2 pt-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-100"
                aria-label="Language"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-100"
                aria-label="Currency"
              >
                {CURRENCIES.map((item) => (
                  <option key={item.code} value={item.code}>{item.label}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/10 px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-100 transition-all active:scale-95"
            >
              {isDark ? <IoSunny className="h-5 w-5 text-amber-300" /> : <IoMoon className="h-5 w-5" />}
              <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            </button>

            {user ? (
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3 px-4 py-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-emerald-400/10 text-primary-700 dark:text-emerald-200 font-semibold uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{user.role === 'admin' ? 'Admin' : t('client')}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-700 dark:text-rose-200 font-semibold transition-colors"
                >
                  <IoLogOut className="h-5 w-5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary-900 dark:bg-emerald-400 text-white dark:text-slate-950 font-semibold hover:bg-primary-800 dark:hover:bg-emerald-300 transition-colors shadow-md shadow-primary-900/10"
              >
                <IoLogIn className="h-5 w-5" />
                <span>{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
