import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { IoAdd, IoPencil, IoTrash, IoFolderOpen, IoAlertCircleOutline, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const AdminCategories = () => {
  const { showToast } = useToast();

  // States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [icon, setIcon] = useState('FaHome');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState('');

  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res?.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Kategoriyalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setName('');
    setDescription('');
    setImage('');
    setIcon('FaHome');
    setIsActive(true);
    setIsOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditMode(true);
    setSelectedId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setIcon(cat.icon || 'FaHome');
    setIsActive(cat.isActive);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast('error', 'Kategoriya nomi majburiy!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { name, description, image, icon, isActive };
      
      if (isEditMode) {
        const res = await updateCategory(selectedId, payload);
        if (res?.success) {
          showToast('success', 'Kategoriya muvaffaqiyatli tahrirlandi!');
          setCategories(prev => prev.map(c => c._id === selectedId ? res.data : c));
          setIsOpen(false);
        }
      } else {
        const res = await createCategory(payload);
        if (res?.success) {
          showToast('success', 'Yangi kategoriya yaratildi!');
          setCategories(prev => [...prev, res.data]);
          setIsOpen(false);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Xatolik yuz berdi';
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDelete = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteCategory(deleteId);
      if (res?.success) {
        showToast('success', 'Kategoriya muvaffaqiyatli o‘chirildi!');
        setCategories(prev => prev.filter(c => c._id !== deleteId));
        setIsDeleteOpen(false);
      }
    } catch (err) {
      showToast('error', 'O‘chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top action header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-800">Kategoriyalar boshqaruvi</h2>
          <p className="text-xs text-slate-400">Saytda foydalaniladigan uylar kategoriyalarini tahrirlang yoki qo'shing.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-xs hover:bg-primary-850 active:scale-95 shadow-md transition-all shrink-0"
        >
          <IoAdd className="h-5 w-5" />
          <span>Yangi kategoriya</span>
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white">
          <IoAlertCircleOutline className="h-16 w-16 mx-auto text-slate-350" />
          <h3 className="mt-4 text-sm font-bold text-slate-850">Kategoriyalar mavjud emas</h3>
          <p className="mt-1 text-xs text-slate-400">Yangi kategoriya yaratish tugmasini bosing.</p>
        </div>
      ) : (
        /* Categories Table */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase">
                  <th className="px-6 py-4">Nomlanishi</th>
                  <th className="px-6 py-4">Sarlavha (Slug)</th>
                  <th className="px-6 py-4">Tavsif</th>
                  <th className="px-6 py-4">Ikonka</th>
                  <th className="px-6 py-4">Holati</th>
                  <th className="px-6 py-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-55/30 transition-colors">
                    {/* Nomlanishi */}
                    <td className="px-6 py-4 font-bold text-slate-700">{cat.name}</td>
                    
                    {/* Slug */}
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                    
                    {/* Tavsif */}
                    <td className="px-6 py-4 text-slate-550 max-w-xs truncate">{cat.description || '-'}</td>
                    
                    {/* Icon */}
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.icon}</td>

                    {/* Status check */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat.isActive ? 'Faol' : 'Noaktiv'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-primary-900 hover:text-white border border-slate-100 text-slate-500 transition-all shadow-sm"
                          title="Tahrirlash"
                        >
                          <IoPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => triggerDelete(cat._id, cat.name)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-600 hover:text-white border border-slate-100 text-slate-550 transition-all shadow-sm"
                          title="O'chirish"
                        >
                          <IoTrash className="h-4 w-4" />
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

      {/* Category Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditMode ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kategoriya nomi *</label>
            <input
              type="text"
              placeholder="Masalan: Arzon uylar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tavsif</label>
            <textarea
              rows="3"
              placeholder="Kategoriya bo'yicha qisqacha tavsif..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            ></textarea>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Ikonka (React Icon classi)</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer"
            >
              <option value="FaHome">FaHome (Uchastka/Hovli)</option>
              <option value="FaBuilding">FaBuilding (Ko'p qavatli bino)</option>
              <option value="FaCrown">FaCrown (Premium/Villa)</option>
              <option value="FaPercentage">FaPercentage (Arzon/Kredit)</option>
            </select>
          </div>

          {/* Image Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kategoriya rasm havolasi (URL)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* IsActive Status */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 rounded border-slate-350 cursor-pointer text-primary-900 focus:ring-primary-500"
            />
            <span className="text-sm font-semibold text-slate-700">Ushbu kategoriya faol holatda bo‘lsin</span>
          </label>

          <div className="flex gap-3 justify-end pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-primary-900 hover:bg-primary-850 text-white text-xs font-bold transition-all shadow-md"
            >
              {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Kategoriyani o'chirish">
        <div className="space-y-6 text-left">
          <p className="text-sm text-slate-500 leading-relaxed">
            Haqiqatan ham <span className="font-bold text-slate-800">"{deleteName}"</span> kategoriyasini o‘chirib tashlamoqchimisiz? Ushbu toifaga tegishli e'lonlar o'chib ketmaydi, lekin kategoriyasiz qolishi mumkin.
          </p>
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-50">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold active:scale-95 transition-all"
            >
              Bekor qilish
            </button>
            <button
              onClick={confirmDelete}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold active:scale-95 transition-all shadow-md"
            >
              O‘chirish
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default AdminCategories;
