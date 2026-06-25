import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getProperties } from '../services/propertyService';
import { getCategories } from '../services/categoryService';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import Loading from '../components/Loading';
import { useLocale } from '../context/LocaleContext';
import { IoGrid, IoMap, IoFunnel, IoAlertCircleOutline, IoSearch, IoClose } from 'react-icons/io5';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker asset packaging bug in Vite
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Properties = () => {
  const location = useLocation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { t, formatPrice } = useLocale();

  // States
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Initializing filters from URL query parameters
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      propertyType: params.get('propertyType') || '',
      rooms: params.get('rooms') || '',
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      minArea: params.get('minArea') || '',
      maxArea: params.get('maxArea') || '',
      floor: params.get('floor') || '',
      city: params.get('city') || '',
      district: params.get('district') || '',
      sort: params.get('sort') || 'newest',
    };
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res?.success) setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Update filters if URL parameters change externally (e.g. from Home SearchBar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      search: params.get('search') || '',
      propertyType: params.get('propertyType') || '',
      rooms: params.get('rooms') || '',
      category: params.get('category') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      minArea: params.get('minArea') || '',
      maxArea: params.get('maxArea') || '',
      floor: params.get('floor') || '',
      city: params.get('city') || '',
      district: params.get('district') || '',
      sort: params.get('sort') || 'newest',
    });
    setSearchVal(params.get('search') || '');
  }, [location.search]);

  // Main fetch properties effect
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Clean filters
        const activeParams = {};
        Object.keys(filters).forEach((key) => {
          if (filters[key]) activeParams[key] = filters[key];
        });

        const res = await getProperties(activeParams);
        if (res?.success) {
          setProperties(res.data);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  // Leaflet initialization for Multi-Marker Map View
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current || properties.length === 0) return;

    // 1. Initialize map centered on Tashkent or the first property
    const defaultCenter = properties.length > 0 && properties[0].latitude
      ? [properties[0].latitude, properties[0].longitude]
      : [41.31108, 69.24056];

    const map = L.map(mapContainerRef.current).setView(defaultCenter, 12);
    mapInstanceRef.current = map;

    // 2. Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // 3. Populate markers
    const bounds = [];
    properties.forEach((prop) => {
      if (prop.latitude && prop.longitude) {
        bounds.push([prop.latitude, prop.longitude]);
        
        const popupContent = `
          <div style="font-family: sans-serif; text-align: left; width: 180px;">
            <img src="${prop.images[0]}" style="width:100%; height:90px; object-cover; border-radius: 8px; margin-bottom: 8px;" />
            <h4 style="margin: 0; font-weight: bold; font-size: 13px; color: #1e293b; line-clamp: 1;">${prop.title}</h4>
            <span style="font-size: 11px; font-weight: 800; color: #10b981; display: block; margin: 4px 0;">${formatPrice(prop.price, prop.currency)}</span>
            <a href="/properties/${prop._id}" style="display: block; text-align: center; background: #0f172a; color: white; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: bold; text-decoration: none; margin-top: 4px;">${t('details')}</a>
          </div>
        `;

        L.marker([prop.latitude, prop.longitude], { icon: DefaultIcon })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    // Auto-fit map bounds to encompass all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [viewMode, properties, t, formatPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchVal,
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        
        {/* Search bar input */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md relative flex items-center">
          <input
            type="text"
            placeholder={t('searchListingsPlaceholder')}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm placeholder:text-slate-300"
          />
          <IoSearch className="absolute left-3.5 top-3.5 text-slate-400 h-4.5 w-4.5" />
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal('');
                setFilters((prev) => ({ ...prev, search: '' }));
              }}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-650"
            >
              <IoClose className="h-4.5 w-4.5" />
            </button>
          )}
        </form>

        {/* Action Toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex md:hidden items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-bold text-xs active:scale-95"
          >
            <IoFunnel className="h-4.5 w-4.5 text-slate-500" />
            {t('filters')}
          </button>

          {/* Grid vs Map views switches */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-250/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs active:scale-95 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IoGrid className="h-4 w-4" />
              {t('list')}
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs active:scale-95 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <IoMap className="h-4 w-4" />
              {t('map')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content viewport splits */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sticky Sidebar (desktop only) */}
        <aside className="hidden md:block w-72 shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />
        </aside>

        {/* Mobile Filter Modal drawer */}
        {isMobileFilterOpen && (
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            isMobile={true}
            onClose={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Right Listings/Map boxes */}
        <div className="flex-grow w-full space-y-6">
          
          {/* Listings count header */}
          <div className="flex items-center justify-between text-left">
            <span className="text-sm font-semibold text-slate-500">
              {t('totalFound', { count: properties.length })}
            </span>
          </div>

          {loading ? (
            <Loading />
          ) : properties.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center bg-white">
              <div className="mx-auto h-16 w-16 text-slate-350">
                <IoAlertCircleOutline className="h-full w-full" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-850">{t('noListings')}</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-xs mx-auto">
                {t('noListingsText')}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Card Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          ) : (
            /* Multi-Marker Leaflet Map View */
            <div className="w-full h-[580px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-10 animate-in fade-in duration-300">
              <div ref={mapContainerRef} className="w-full h-full min-h-[580px]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
