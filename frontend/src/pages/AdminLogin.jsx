import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IoMail, IoLockClosed, IoLogIn, IoHome } from 'react-icons/io5';

const AdminLogin = () => {
  const { user, login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Iltimos, barcha maydonlarni to‘ldiring');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      showToast('success', `Xush kelibsiz, ${res.user.name}!`);
      const from = location.state?.from?.pathname || (res.user.role === 'admin' ? '/admin/dashboard' : '/');
      navigate(from, { replace: true });
    } else {
      showToast('error', res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative px-4 overflow-hidden py-12">
      {/* Background visual shapes */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary-600/20 blur-3xl shrink-0"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-accent-600/10 blur-3xl shrink-0"></div>

      {/* Main card */}
      <div className="w-full max-w-md dark-glass-effect rounded-3xl p-8 border border-white/5 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white shadow-lg mb-4">
            <IoHome className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">House Finder</h2>
          <p className="text-sm text-slate-400 mt-2">Tizimga kirish uchun ma‘lumotlaringizni kiriting</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Email manzili</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Masalan: admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <IoMail className="absolute left-4 top-4 text-slate-650 h-5 w-5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Maxfiy parol</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Parolingizni kiriting..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <IoLockClosed className="absolute left-4 top-4 text-slate-650 h-5 w-5" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 rounded-xl bg-gradient-to-tr from-primary-650 to-primary-550 text-white font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-primary-700/25 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white"></div>
            ) : (
              <>
                <IoLogIn className="h-5 w-5" />
                <span>Tizimga kirish</span>
              </>
            )}
          </button>
        </form>

        {/* Demo hints */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p className="mb-5 text-sm text-slate-400">
            Akauntingiz yo'qmi?{' '}
            <Link to="/register" state={location.state} className="font-bold text-accent-400 hover:text-accent-300">
              Ro'yxatdan o'ting
            </Link>
          </p>
          <p className="font-semibold text-slate-400">Demo Admin Ma‘lumotlari:</p>
          <p className="mt-1">Email: <span className="text-slate-350 select-all font-mono">admin@example.com</span></p>
          <p>Parol: <span className="text-slate-350 select-all font-mono">admin123</span></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
