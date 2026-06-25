import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';
import { IoHeart, IoHeartOutline, IoLocation, IoBed, IoExpand, IoLayers, IoSparkles, IoStar } from 'react-icons/io5';

const PropertyCard = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if saved on mount/update
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    setIsSaved(saved.includes(property._id));
  }, [property._id]);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    let updated;
    if (saved.includes(property._id)) {
      updated = saved.filter((id) => id !== property._id);
      setIsSaved(false);
    } else {
      updated = [...saved, property._id];
      setIsSaved(true);
    }
    localStorage.setItem('saved_properties', JSON.stringify(updated));
    // Trigger standard custom event for other listeners
    window.dispatchEvent(new Event('saved_properties_updated'));
  };

  // Get first image or fallback
  const displayImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Property Badges and Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={displayImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60"></div>

        {/* Favorite Save Button */}
        <button
          onClick={toggleSave}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md backdrop-blur-sm active:scale-95 transition-all"
        >
          {isSaved ? (
            <IoHeart className="h-5.5 w-5.5 text-rose-500 animate-in zoom-in-50 duration-200" />
          ) : (
            <IoHeartOutline className="h-5.5 w-5.5 transition-colors" />
          )}
        </button>

        {/* Status Badge */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 items-start">
          {property.status && property.status !== 'Aktiv' && (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
              property.status === 'Sotilgan'
                ? 'bg-rose-600 text-white'
                : 'bg-amber-500 text-white'
            }`}>
              {property.status}
            </span>
          )}

          {property.isPremium && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-sm">
              <IoStar className="h-3 w-3 fill-current" />
              Premium
            </span>
          )}

          {property.isFeatured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-900 text-white shadow-sm">
              <IoSparkles className="h-3 w-3" />
              Tavsiya
            </span>
          )}

          {property.price < 50000 && property.status === 'Aktiv' && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm">
              Hamyonbop
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow text-left">
        {/* Type & City */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wide">
          <span>{property.propertyType}</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            {property.category?.name || 'Mulk'}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base font-bold text-slate-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <div className="mt-1.5 flex items-center gap-1 text-slate-500 text-sm">
          <IoLocation className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">{property.city}, {property.district}</span>
        </div>

        {/* Property Specs Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 py-3 border-y border-slate-50 text-slate-600 text-xs font-medium shrink-0">
          <div className="flex items-center gap-1.5 justify-center">
            <IoBed className="h-4 w-4 text-slate-400" />
            <span>{property.rooms} xona</span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <IoExpand className="h-4 w-4 text-slate-400" />
            <span>
              {property.area} m²
              {property.landArea > 0 && ` (${property.landArea} sotix)`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <IoLayers className="h-4 w-4 text-slate-400" />
            <span>
              {property.propertyType === 'Ko‘p qavatli dom' || property.propertyType === 'Yangi qurilgan uy'
                ? `${property.floor}/${property.totalFloors} qavat`
                : `${property.totalFloors || 1} qavatli`}
            </span>
          </div>
        </div>

        {/* Footer Area - Price & Button */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-1 mt-auto shrink-0">
          <div className="flex flex-col text-left">
            <span className="text-xs text-slate-400 leading-none">Jami narxi:</span>
            <span className="text-lg font-black text-slate-800 leading-tight mt-1">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-primary-900 hover:text-white font-semibold text-sm active:scale-95 shadow-sm hover:shadow-md transition-all duration-200"
          >
            Batafsil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
