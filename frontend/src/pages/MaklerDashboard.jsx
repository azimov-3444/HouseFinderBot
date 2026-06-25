import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IoPeopleOutline, IoAddCircleOutline, IoLocationOutline, IoCashOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoCloseCircleOutline, IoBriefcaseOutline } from 'react-icons/io5';

const MaklerDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ clientName: '', clientPhone: '', budget: '', requirements: '' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/crm/leads', { withCredentials: true });
      setLeads(res.data.data);
    } catch (error) {
      addToast('error', 'Mijozlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/crm/leads', newLead, { withCredentials: true });
      setLeads([res.data.data, ...leads]);
      setShowAddModal(false);
      setNewLead({ clientName: '', clientPhone: '', budget: '', requirements: '' });
      addToast('success', 'Yangi mijoz muvaffaqiyatli qo`shildi');
    } catch (error) {
      addToast('error', 'Mijoz qo`shishda xatolik');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Yangi': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Aloqaga chiqildi': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Uy ko‘rdi': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Muzokarada': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Bitim yopildi': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Bekor qilindi': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <IoBriefcaseOutline className="text-primary-600" />
              Makler CRM Panel
            </h1>
            <p className="text-slate-500 mt-1">Mijozlaringiz bilan ishlash va ularni boshqarish tizimi</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-primary-600/20"
          >
            <IoAddCircleOutline className="text-xl" />
            Yangi Mijoz Qo'shish
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <IoPeopleOutline className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Jami Mijozlar</p>
                <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <IoCheckmarkCircleOutline className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Yopilgan Bitimlar</p>
                <p className="text-2xl font-bold text-slate-900">{leads.filter(l => l.status === 'Bitim yopildi').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <IoTimeOutline className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Muzokarada</p>
                <p className="text-2xl font-bold text-slate-900">{leads.filter(l => l.status === 'Muzokarada').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="font-bold text-slate-800">Mijozlar Ro'yxati</h2>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Sizda hozircha mijozlar yo'q.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">Mijoz</th>
                    <th className="p-4">Talab</th>
                    <th className="p-4">Byudjet</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Harakat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-800">{lead.clientName}</p>
                        <p className="text-sm text-slate-500">{lead.clientPhone}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={lead.requirements}>
                        {lead.requirements || "Kiritilmagan"}
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        ${lead.budget.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button className="text-primary-600 font-semibold text-sm hover:underline">
                          Tahrirlash
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Yangi Mijoz Qo'shish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <IoCloseCircleOutline className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mijoz Ismi</label>
                <input 
                  type="text" required
                  value={newLead.clientName} onChange={e => setNewLead({...newLead, clientName: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Ism Familiya"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon Raqami</label>
                <input 
                  type="text" required
                  value={newLead.clientPhone} onChange={e => setNewLead({...newLead, clientPhone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Byudjet (USD)</label>
                <input 
                  type="number"
                  value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Masalan: 50000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Mijoz talablari</label>
                <textarea 
                  value={newLead.requirements} onChange={e => setNewLead({...newLead, requirements: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-24"
                  placeholder="3 xonali, Yunusobod, metoga yaqin..."
                ></textarea>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaklerDashboard;
