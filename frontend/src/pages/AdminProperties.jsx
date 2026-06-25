import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminProperties, deleteProperty, updatePropertyStatus } from '../services/propertyService';
import Loading from '../components/Loading';
import formatPrice from '../utils/formatPrice';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import {
  IoAdd,
  IoPencil,
  IoTrash,
  IoOpen,
  IoCheckmarkCircle,
  IoEllipsisHorizontal,
  IoCloseCircle,
  IoAlertCircleOutline,
} from 'react-icons/io5';

const AdminProperties = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // States
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState(null);
  const [selectedPropTitle, setSelectedPropTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Clean params
      const params = { limit: 100 }; // Fetch up to 100 for admin
      if (search) params.search = search;
      if (propertyType) params.propertyType = propertyType;
      if (status) params.status = status;
      
      if (status) params.status = status;

      const res = await getAdminProperties(params);
      if (res?.success) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin listings:', err);
      showToast('error', 'E‘lonlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [propertyType, status]); // reload if selects change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updatePropertyStatus(id, newStatus);
      if (res?.success) {
        showToast('success', 'Uy statusi muvaffaqiyatli yangilandi!');
        // Update local state
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Status yangilashda xatolik';
      showToast('error', msg);
    }
  };

  const triggerDelete = (id, title) => {
    setSelectedPropId(id);
    setSelectedPropTitle(title);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPropId) return;
    try {
      setIsDeleting(true);
      const res = await deleteProperty(selectedPropId);
      if (res?.success) {
        showToast('success', 'Mulk muvaffaqiyatli o‘chirildi!');
        setProperties((prev) => prev.filter((p) => p._id !== selectedPropId));
        setIsDeleteOpen(false);
      }
    } catch (err) {
      showToast('error', 'O‘chirishda xatolik yuz berdi');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner with Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-800">Uylar ro‘yxati</h2>
          <p className="text-xs text-slate-400">Mavjud uylarni tahrirlang, o‘chiring yoki yangi e'lon qo'shing.</p>
        </div>
        <Link
          to="/admin/add-property"
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-xs hover:bg-primary-850 active:scale-95 shadow-md transition-all shrink-0"
        >
          <IoAdd className="h-5 w-5" />
          <span>Yangi uy qo'shish</span>
        </Link>
      </div>

      {/* Filters & Search Row */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Nomi yoki manzili bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
        
        {/* Property Type */}
        <div>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">Barcha turlar</option>
            <option value="Ko‘p qavatli dom">Ko‘p qavatli dom</option>
            <option value="Uchastka">Uchastka</option>
            <option value="Hovli">Hovli</option>
            <option value="Villa">Villa</option>
            <option value="Yangi qurilgan uy">Yangi qurilgan uy</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">Barcha holatlar</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Sotilgan">Sotilgan</option>
            <option value="Band qilingan">Band qilingan</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-xs hover:bg-primary-850 active:scale-95 shadow-sm transition-all"
          >
            Qidirish
          </button>
        </div>
      </form>

      {/* Main Table view */}
      {loading ? (
        <Loading />
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white">
          <div className="mx-auto h-16 w-16 text-slate-300">
            <IoAlertCircleOutline className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-850">Uylar topilmadi</h3>
          <p className="mt-1 text-xs text-slate-400">Yangi uy qo'shish tugmasini bosib e'lon yarating.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase">
                  <th className="px-6 py-4">Rasm</th>
                  <th className="px-6 py-4">Sarlavha</th>
                  <th className="px-6 py-4">Turi</th>
                  <th className="px-6 py-4">Narxi</th>
                  <th className="px-6 py-4">Holati (Status)</th>
                  <th className="px-6 py-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Rasm */}
                    <td className="px-6 py-4 shrink-0">
                      <img
                        src={prop.images && prop.images.length > 0 ? prop.images[0] : ''}
                        alt=""
                        className="h-12 w-16 rounded-xl object-cover border border-slate-100 shadow-sm"
                      />
                    </td>
                    
                    {/* Sarlavha & Manzil */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{prop.title}</span>
                        <span className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">{prop.city}, {prop.district}</span>
                      </div>
                    </td>

                    {/* Turi */}
                    <td className="px-6 py-4 text-slate-500 font-medium text-xs">{prop.propertyType}</td>

                    {/* Narxi */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {formatPrice(prop.price, prop.currency)}
                    </td>

                    {/* Holat patch update */}
                    <td className="px-6 py-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleStatusChange(prop._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm ${
                          prop.status === 'Aktiv'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                            : prop.status === 'Sotilgan'
                            ? 'bg-rose-50 border-rose-100 text-rose-700'
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}
                      >
                        <option value="Aktiv">Aktiv</option>
                        <option value="Sotilgan">Sotilgan</option>
                        <option value="Band qilingan">Band qilingan</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/properties/${prop._id}`}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-primary-900 hover:text-white border border-slate-100 text-slate-500 transition-all shadow-sm"
                          title="Saytda ko'rish"
                        >
                          <IoOpen className="h-4.5 w-4.5" />
                        </Link>
                        <Link
                          to={`/admin/edit-property/${prop._id}`}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-primary-900 hover:text-white border border-slate-100 text-slate-500 transition-all shadow-sm"
                          title="Tahrirlash"
                        >
                          <IoPencil className="h-4.5 w-4.5" />
                        </Link>
                        <button
                          onClick={() => triggerDelete(prop._id, prop.title)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-600 hover:text-white border border-slate-100 text-slate-550 transition-all shadow-sm"
                          title="O'chirish"
                        >
                          <IoTrash className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Mulkni o'chirish">
        <div className="space-y-6 text-left">
          <p className="text-sm text-slate-500 leading-relaxed">
            Haqiqatan ham <span className="font-bold text-slate-800">"{selectedPropTitle}"</span> e'lonini o‘chirib tashlamoqchimisiz? Ushbu amal ortga qaytarilmaydi.
          </p>
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-50">
            <button
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold active:scale-95 transition-all"
            >
              Bekor qilish
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold active:scale-95 transition-all shadow-md shadow-rose-600/10"
            >
              {isDeleting ? 'O‘chirilmoqda...' : 'O‘chirish'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProperties;
