import React from 'react';
import { IoClose, IoFunnelOutline, IoSyncOutline } from 'react-icons/io5';

const FilterSidebar = ({ filters, setFilters, categories = [], onClose, isMobile = false }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectCategory = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === categoryId ? '' : categoryId,
    }));
  };

  const handleClear = () => {
    setFilters({
      search: '',
      propertyType: '',
      rooms: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      floor: '',
      city: '',
      district: '',
      sort: 'newest',
      isVerified: false,
      isDocumentChecked: false,
      isOwner: false,
    });
  };

  const filterContent = (
    <div className="space-y-6 text-left">
      {/* Title with Clear button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <IoFunnelOutline className="text-primary-600 h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-800">Filtrlar</h2>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors bg-slate-50 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
        >
          <IoSyncOutline className="h-3.5 w-3.5" />
          Tozalash
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tartiblash</label>
        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="newest">Eng yangilari</option>
          <option value="cheapest">Eng arzonlari</option>
          <option value="expensive">Eng qimmatlari</option>
          <option value="largest">Eng katta maydonlilar</option>
        </select>
      </div>

      {/* Category selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kategoriyalar</label>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => handleSelectCategory(cat._id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                filters.category === cat._id
                  ? 'bg-primary-900 border-primary-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {filters.category === cat._id && (
                <span className="h-2 w-2 rounded-full bg-accent-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Mulk turi</label>
        <select
          name="propertyType"
          value={filters.propertyType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="">Barchasi</option>
          <option value="Ko‘p qavatli dom">Ko‘p qavatli dom</option>
          <option value="Uchastka">Uchastka</option>
          <option value="Hovli">Hovli</option>
          <option value="Villa">Villa</option>
          <option value="Yangi qurilgan uy">Yangi qurilgan uy</option>
        </select>
      </div>

      {/* Location (City / District) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Shahar / Viloyat</label>
          <input
            type="text"
            name="city"
            placeholder="Masalan: Toshkent"
            value={filters.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tuman</label>
          <input
            type="text"
            name="district"
            placeholder="Masalan: Chilonzor"
            value={filters.district || ''}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Price filter (Range) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Narx oralig'i (USD)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Kamida"
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Ko'pi bilan"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Rooms Count */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Xonalar soni</label>
        <select
          name="rooms"
          value={filters.rooms || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="">Farqi yo'q</option>
          <option value="1">1 xonali</option>
          <option value="2">2 xonali</option>
          <option value="3">3 xonali</option>
          <option value="4">4 xonali</option>
          <option value="5">5+ xonali</option>
        </select>
      </div>

      {/* Area range (kv.m) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Maydoni (kv.m.)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minArea"
            placeholder="Min"
            value={filters.minArea || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            name="maxArea"
            placeholder="Max"
            value={filters.maxArea || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Floor */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qavat</label>
        <input
          type="number"
          name="floor"
          placeholder="Istagan qavat..."
          value={filters.floor || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
      </div>

      {/* Advanced Verification Filters */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qo'shimcha sozlamalar</label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              name="isOwner"
              checked={filters.isOwner || false}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Maklersiz (Faqat egasidan)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              name="isVerified"
              checked={filters.isVerified || false}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-accent-500 peer-checked:border-accent-500 transition-all flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Tasdiqlangan e'lonlar ✅</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              name="isDocumentChecked"
              checked={filters.isDocumentChecked || false}
              onChange={handleChange}
              className="peer sr-only"
            />
            <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Hujjatlari tekshirilgan 📄</span>
        </label>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow">
            {filterContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sticky top-24 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm text-left">
      {filterContent}
    </div>
  );
};

export default FilterSidebar;
