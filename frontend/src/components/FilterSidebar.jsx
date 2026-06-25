import React from 'react';
import { IoClose, IoFunnelOutline, IoSyncOutline } from 'react-icons/io5';
import { useLocale } from '../context/LocaleContext';

const propertyTypes = ['KoвЂp qavatli dom', 'Uchastka', 'Hovli', 'Villa', 'Yangi qurilgan uy'];

const FilterSidebar = ({ filters, setFilters, categories = [], onClose, isMobile = false }) => {
  const { t, tv } = useLocale();

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
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <IoFunnelOutline className="text-primary-600 h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-800">{t('filters')}</h2>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors bg-slate-50 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
        >
          <IoSyncOutline className="h-3.5 w-3.5" />
          {t('clear')}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('sort')}</label>
        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="newest">{t('newest')}</option>
          <option value="cheapest">{t('cheapest')}</option>
          <option value="expensive">{t('expensive')}</option>
          <option value="largest">{t('largest')}</option>
        </select>
      </div>

      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('categories')}</label>
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
              {filters.category === cat._id && <span className="h-2 w-2 rounded-full bg-accent-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('propertyType')}</label>
        <select
          name="propertyType"
          value={filters.propertyType || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="">{t('all')}</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{tv(type)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('city')}</label>
          <input
            type="text"
            name="city"
            placeholder={t('cityPlaceholder')}
            value={filters.city || ''}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('district')}</label>
          <input
            type="text"
            name="district"
            placeholder={t('districtPlaceholder')}
            value={filters.district || ''}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('priceRangeUsd')}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder={t('min')}
            value={filters.minPrice || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder={t('max')}
            value={filters.maxPrice || ''}
            onChange={handleChange}
            className="w-1/2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-850 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('roomsCount')}</label>
        <select
          name="rooms"
          value={filters.rooms || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="">{t('any')}</option>
          {[1, 2, 3, 4].map((count) => (
            <option key={count} value={count}>{t('roomsUnit', { count })}</option>
          ))}
          <option value="5">5+ {t('rooms').toLowerCase()}</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('areaRange')}</label>
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

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('floor')}</label>
        <input
          type="number"
          name="floor"
          placeholder={t('floorPlaceholder')}
          value={filters.floor || ''}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('extraSettings')}</label>

        {[
          ['isOwner', t('ownerOnly')],
          ['isVerified', t('verifiedListings')],
          ['isDocumentChecked', t('documentChecked')],
        ].map(([name, label]) => (
          <label key={name} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={name}
                checked={filters[name] || false}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{label}</span>
          </label>
        ))}
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
              aria-label="Close filters"
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
