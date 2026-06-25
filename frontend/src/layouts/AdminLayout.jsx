import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  IoGrid,
  IoHome,
  IoAddCircle,
  IoFolderOpen,
  IoMailOpen,
  IoLogOut,
  IoMenu,
  IoClose,
  IoGlobeOutline,
  IoPersonCircle,
} from 'react-icons/io5';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      showToast('success', 'Tizimdan muvaffaqiyatli chiqdingiz!');
      navigate('/');
    } else {
      showToast('error', res.message);
    }
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: IoGrid },
    { to: '/admin/properties', label: 'Barcha uylar', icon: IoHome },
    { to: '/admin/add-property', label: 'Yangi uy qo‘shish', icon: IoAddCircle },
    { to: '/admin/categories', label: 'Kategoriyalar', icon: IoFolderOpen },
    { to: '/admin/requests', label: 'Kelgan arizalar', icon: IoMailOpen },
  ];

  const linkStyle = "flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium text-sm";
  const activeLinkStyle = "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-primary-800 text-white font-bold text-sm shadow-md";

  const getPageTitle = () => {
    const current = navLinks.find(link => location.pathname === link.to);
    if (current) return current.label;
    if (location.pathname.includes('/admin/edit-property')) return 'Uyni tahrirlash';
    return 'Admin Panel';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-350 p-5">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-900 mb-6 shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 text-white shadow-md">
            <IoHome className="h-4 w-4" />
          </div>
          <span className="text-base font-bold text-white leading-none">
            House<span className="text-accent-500 font-extrabold">Finder</span>
            <span className="block text-[9px] font-semibold text-slate-500 tracking-widest mt-1">ADMIN PANEL</span>
          </span>
        </Link>
        {isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white md:hidden"
          >
            <IoClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-1.5 overflow-y-auto no-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="pt-6 border-t border-slate-900 mt-auto space-y-2 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all text-sm font-medium"
        >
          <IoGlobeOutline className="h-5 w-5 text-slate-500" />
          <span>Saytga qaytish</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 w-full text-left px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all text-sm font-bold"
        >
          <IoLogOut className="h-5 w-5" />
          <span>Tizimdan chiqish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:block w-64 h-full shrink-0 border-r border-slate-200">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="w-64 h-full bg-slate-950 shadow-2xl animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
          {/* overlay click closes it */}
          <div className="flex-grow" onClick={() => setIsSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 md:hidden border border-slate-100"
            >
              <IoMenu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-black text-slate-800">{getPageTitle()}</h1>
          </div>

          {/* Admin User Info */}
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-150">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-50" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800 leading-none">{user.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user.role}</span>
              </div>
            </div>
          )}
        </header>

        {/* Content Box */}
        <main className="flex-grow p-6 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
