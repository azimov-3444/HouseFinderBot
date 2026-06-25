import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoLocation, IoHome, IoBed, IoCash, IoHardwareChip } from 'react-icons/io5';
import { useToast } from '../context/ToastContext';
import { recommendWithAi } from '../services/aiService';

const SearchBar = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [rooms, setRooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!aiQuery) return;
    
    setIsLoadingAi(true);
    try {
      const res = await recommendWithAi(aiQuery);
      const { parsedFilters, message } = res.data;
      
      showToast('success', message);
      
      const params = new URLSearchParams();
      Object.entries(parsedFilters || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.append(key, value);
      });
      
      navigate(`/properties?${params.toString()}`);
    } catch (err) {
      showToast('error', err.response?.data?.message || "AI ishlashida xatolik yuz berdi");
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (propertyType) params.append('propertyType', propertyType);
    if (rooms) params.append('rooms', rooms);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex justify-center mb-4">
        <div className="bg-white/20 backdrop-blur-md p-1 rounded-full inline-flex shadow-inner border border-white/30">
          <button
            type="button"
            onClick={() => setIsAiMode(false)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              !isAiMode ? 'bg-white text-primary-900 shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            Oddiy Qidiruv
          </button>
          <button
            type="button"
            onClick={() => setIsAiMode(true)}
            className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
              isAiMode ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md' : 'text-white hover:bg-white/10'
            }`}
          >
            <IoHardwareChip className="text-lg" />
            AI Qidiruv
          </button>
        </div>
      </div>

      {isAiMode ? (
        <form onSubmit={handleAiSearch} className="glass-effect rounded-3xl p-6 shadow-2xl border border-accent-300/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Masalan: Yunusobodda 3 xonali 700$ gacha remontli uy kerak..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="w-full pl-6 pr-12 py-4 rounded-xl bg-white border-2 border-accent-200 text-slate-800 font-medium focus:outline-none focus:border-accent-500 transition-all shadow-sm text-lg"
              />
              <IoHardwareChip className="absolute right-4 top-4 text-accent-500 h-6 w-6 animate-pulse" />
            </div>
            <button
              type="submit"
              disabled={isLoadingAi}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 text-white font-bold hover:from-accent-500 hover:to-accent-400 transition-all shadow-lg shadow-accent-500/30 whitespace-nowrap disabled:opacity-70 flex items-center gap-2"
            >
              {isLoadingAi ? 'Tahlil qilinmoqda...' : 'AI Qidirish'}
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSearch}
          className="glass-effect rounded-3xl p-6 shadow-2xl border border-white/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search input / Location */}
        <div className="flex flex-col text-left col-span-1 md:col-span-1">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wider pl-1">
            <IoLocation className="text-accent-500 h-4 w-4" />
            Joylashuv / Qidiruv
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Shahar, tuman, manzil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
            />
            <IoSearch className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
          </div>
        </div>

        {/* Property Type selection */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wider pl-1">
            <IoHome className="text-accent-500 h-4 w-4" />
            Mulk Turi
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Barchasi</option>
            <option value="Ko‘p qavatli dom">Ko‘p qavatli dom</option>
            <option value="Uchastka">Uchastka</option>
            <option value="Hovli">Hovli</option>
            <option value="Villa">Villa</option>
            <option value="Yangi qurilgan uy">Yangi qurilgan uy</option>
          </select>
        </div>

        {/* Rooms selection */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wider pl-1">
            <IoBed className="text-accent-500 h-4 w-4" />
            Xonalar soni
          </label>
          <select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Barchasi</option>
            <option value="1">1 xonali</option>
            <option value="2">2 xonali</option>
            <option value="3">3 xonali</option>
            <option value="4">4 xonali</option>
            <option value="5">5+ xonali</option>
          </select>
        </div>

        {/* Price limits */}
        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 uppercase tracking-wider pl-1">
            <IoCash className="text-accent-500 h-4 w-4" />
            Narx oralig'i (USD)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm placeholder:text-slate-300"
            />
            <span className="text-slate-400 font-bold text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 px-3 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-primary-900 to-primary-800 text-white font-bold hover:from-primary-850 hover:to-primary-750 transition-all shadow-lg shadow-primary-900/10 hover:shadow-primary-900/25 active:scale-98"
        >
          <IoSearch className="h-5 w-5" />
          <span>Qidirish</span>
        </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SearchBar;
