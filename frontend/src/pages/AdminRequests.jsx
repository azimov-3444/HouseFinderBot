import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContactRequests, updateContactRequestStatus, deleteContactRequest } from '../services/propertyService';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import { IoMailOpen, IoTrash, IoOpen, IoAlertCircleOutline, IoCheckmarkCircle } from 'react-icons/io5';

const AdminRequests = () => {
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete Confirm Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getContactRequests();
      if (res?.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Kelgan arizalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateContactRequestStatus(id, newStatus);
      if (res?.success) {
        showToast('success', 'Ariza statusi muvaffaqiyatli o‘zgartirildi!');
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      showToast('error', 'Statusni yangilashda xatolik yuz berdi');
    }
  };

  const triggerDelete = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteContactRequest(deleteId);
      if (res?.success) {
        showToast('success', 'Ariza muvaffaqiyatli o‘chirildi!');
        setRequests(prev => prev.filter(r => r._id !== deleteId));
        setIsDeleteOpen(false);
      }
    } catch (err) {
      showToast('error', 'O‘chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header banner */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <h2 className="text-lg font-black text-slate-800">Kelgan arizalar (Mijozlar so'rovlari)</h2>
        <p className="text-xs text-slate-400">
          Uylar sahifasida ariza qoldirgan mijozlar ro‘yxati. Bog‘lanib bo‘linganlar statusini o'zgartiring.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white">
          <IoAlertCircleOutline className="h-16 w-16 mx-auto text-slate-350" />
          <h3 className="mt-4 text-sm font-bold text-slate-850">Arizalar kelmagan</h3>
          <p className="mt-1 text-xs text-slate-400">Hozircha hech kim ariza qoldirmadi.</p>
        </div>
      ) : (
        /* Requests Table */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs uppercase">
                  <th className="px-6 py-4">Mijoz ismi</th>
                  <th className="px-6 py-4">Telefon raqam</th>
                  <th className="px-6 py-4">Mulk sarlavhasi</th>
                  <th className="px-6 py-4">Xabar (Sarlavha)</th>
                  <th className="px-6 py-4">Holati (Status)</th>
                  <th className="px-6 py-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Mijoz ismi */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-slate-700">{req.name}</span>
                        <span className="text-xs text-slate-400 mt-1">{req.email || "Email kiritilmagan"}</span>
                      </div>
                    </td>

                    {/* Telefon */}
                    <td className="px-6 py-4 font-mono font-semibold text-slate-650">{req.phone}</td>

                    {/* Mulk */}
                    <td className="px-6 py-4">
                      {req.propertyId ? (
                        <div className="flex flex-col text-left">
                          <Link to={`/properties/${req.propertyId._id}`} className="font-bold text-slate-700 hover:underline hover:text-primary-600 truncate max-w-[200px]">
                            {req.propertyId.title}
                          </Link>
                          <span className="text-xs text-slate-400 mt-1">{req.propertyId.city}, {req.propertyId.district}</span>
                        </div>
                      ) : (
                        <span className="text-rose-500 font-medium text-xs">Mulk o‘chirilgan</span>
                      )}
                    </td>

                    {/* Xabar */}
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={req.message}>
                      {req.message || '-'}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm ${
                          req.status === 'new'
                            ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse-soft'
                            : req.status === 'contacted'
                            ? 'bg-blue-50 border-blue-100 text-blue-700'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      >
                        <option value="new">Yangi</option>
                        <option value="contacted">Aloqada</option>
                        <option value="closed">Yopilgan</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {req.propertyId && (
                          <Link
                            to={`/properties/${req.propertyId._id}`}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-primary-900 hover:text-white border border-slate-100 text-slate-500 transition-all shadow-sm"
                            title="Uy sahifasini ochish"
                          >
                            <IoOpen className="h-4.5 w-4.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => triggerDelete(req._id)}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-600 hover:text-white border border-slate-100 text-slate-550 transition-all shadow-sm"
                          title="Ariza o'chirish"
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
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Arizani o'chirish">
        <div className="space-y-6 text-left">
          <p className="text-sm text-slate-500 leading-relaxed">
            Haqiqatan ham ushbu mijoz arizasini o‘chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo‘lmaydi.
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

export default AdminRequests;
