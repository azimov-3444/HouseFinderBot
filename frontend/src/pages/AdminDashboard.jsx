import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../services/propertyService';
import Loading from '../components/Loading';
import formatPrice from '../utils/formatPrice';
import {
  IoHome,
  IoMailOpen,
  IoCheckmarkCircle,
  IoEye,
  IoFolder,
  IoTimeOutline,
  IoChevronForward,
  IoTrash,
  IoOpen,
} from 'react-icons/io5';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getAdminStats();
        if (res?.success) {
          setStats(res.data.stats);
          setRecentProperties(res.data.recentProperties);
          setRecentRequests(res.data.recentRequests);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 h-48 w-48 bg-primary-650/15 blur-2xl rounded-full shrink-0"></div>
        <div className="relative z-10 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black">Xush kelibsiz, Admin!</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            House Finder tizimidagi uylar ro‘yxatini, arizalarni va boshqa muhim parametrlarni osongina boshqaring.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Jami uylar */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider block">Jami Uylar</span>
              <span className="text-2xl font-black text-slate-800 block">{stats.totalProperties} ta</span>
              <span className="text-[10px] font-bold text-slate-400">
                Aktiv: {stats.activeProperties} | Sotilgan: {stats.soldProperties}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600 shrink-0 shadow-inner">
              <IoHome className="h-6 w-6" />
            </div>
          </div>

          {/* Card 2: Arizalar */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider block">Arizalar</span>
              <span className="text-2xl font-black text-slate-800 block">{stats.totalRequests} ta</span>
              <span className="text-[10px] font-bold text-rose-500">
                Ko'rilmagan (yangi): {stats.newRequests}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
              <IoMailOpen className="h-6 w-6" />
            </div>
          </div>

          {/* Card 3: Ko'rishlar */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider block">Ko'rishlar</span>
              <span className="text-2xl font-black text-slate-800 block">{stats.totalViews} marta</span>
              <span className="text-[10px] font-bold text-emerald-500">
                Mijozlar qiziqishi yuqori
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
              <IoEye className="h-6 w-6" />
            </div>
          </div>

          {/* Card 4: Kategoriyalar */}
          <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider block">Kategoriyalar</span>
              <span className="text-2xl font-black text-slate-800 block">{stats.totalCategories} ta</span>
              <span className="text-[10px] font-bold text-slate-400">
                Faol turdagi bo'limlar
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 shrink-0 shadow-inner">
              <IoFolder className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Grid for tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Properties Table */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-base font-black text-slate-850">So‘nggi qo‘shilgan uylar</h3>
            <Link
              to="/admin/properties"
              className="flex items-center gap-1 text-xs font-bold text-primary-650 hover:text-primary-850 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 transition-colors"
            >
              <span>Barchasi</span>
              <IoChevronForward className="h-3 w-3" />
            </Link>
          </div>

          {recentProperties.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Yaqinda uylar qo'shilmagan.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase">
                    <th className="py-2.5">Nomi</th>
                    <th className="py-2.5">Turi</th>
                    <th className="py-2.5">Narxi</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentProperties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-700 truncate max-w-[150px]">
                        <Link to={`/properties/${prop._id}`} className="hover:underline hover:text-primary-600">
                          {prop.title}
                        </Link>
                      </td>
                      <td className="py-3 text-slate-500 text-xs">{prop.propertyType}</td>
                      <td className="py-3 font-bold text-slate-800">
                        {formatPrice(prop.price, prop.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prop.status === 'Aktiv'
                            ? 'bg-emerald-50 text-emerald-700'
                            : prop.status === 'Sotilgan'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contact Requests Table */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-base font-black text-slate-850">So‘nggi arizalar</h3>
            <Link
              to="/admin/requests"
              className="flex items-center gap-1 text-xs font-bold text-primary-650 hover:text-primary-850 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 transition-colors"
            >
              <span>Barchasi</span>
              <IoChevronForward className="h-3 w-3" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Kelgan arizalar mavjud emas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase">
                    <th className="py-2.5">Mijoz</th>
                    <th className="py-2.5">Telefon</th>
                    <th className="py-2.5">Uy</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-700">{req.name}</td>
                      <td className="py-3 text-slate-500 font-mono text-xs">{req.phone}</td>
                      <td className="py-3 text-slate-400 text-xs truncate max-w-[120px]">
                        {req.propertyId?.title || 'Mulk o‘chirilgan'}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'new'
                            ? 'bg-rose-50 text-rose-600 animate-pulse'
                            : req.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {req.status === 'new' ? 'Yangi' : req.status === 'contacted' ? 'Aloqada' : 'Yopilgan'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
