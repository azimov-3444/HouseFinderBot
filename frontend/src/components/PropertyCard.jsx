import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoArrowForward,
  IoBed,
  IoExpand,
  IoHeart,
  IoHeartOutline,
  IoLayers,
  IoLocation,
  IoSparkles,
  IoStar,
} from 'react-icons/io5';
import { useLocale } from '../context/LocaleContext';

const fallbackImage =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

const isApartmentLike = (type) => (
  type === 'Ko‘p qavatli dom'
  || type === "Ko'p qavatli dom"
  || type === 'KoвЂp qavatli dom'
  || type === 'KoРІР‚Вp qavatli dom'
  || type === 'Yangi qurilgan uy'
);

const PropertyCard = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { t, tv, formatPrice } = useLocale();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    setIsSaved(saved.includes(property._id));
  }, [property._id]);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    const updated = saved.includes(property._id)
      ? saved.filter((id) => id !== property._id)
      : [...saved, property._id];

    setIsSaved(updated.includes(property._id));
    localStorage.setItem('saved_properties', JSON.stringify(updated));
    window.dispatchEvent(new Event('saved_properties_updated'));
  };

  const displayImage = property.images?.length ? property.images[0] : fallbackImage;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-slate-300/60"
    >
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-28 top-0 h-full w-28 rotate-12 bg-white/35 blur-xl transition-transform duration-700 group-hover:translate-x-[28rem]" />
      </div>

      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={property.title || 'Uy rasmi'}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent opacity-90" />

        <button
          onClick={toggleSave}
          className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white hover:text-rose-600 active:scale-95"
          aria-label={isSaved ? 'Remove saved property' : 'Save property'}
        >
          {isSaved ? (
            <IoHeart className="h-5.5 w-5.5 text-rose-500" />
          ) : (
            <IoHeartOutline className="h-5.5 w-5.5" />
          )}
        </button>

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {property.status && property.status !== 'Aktiv' && (
            <span
              className={`rounded-xl px-2.5 py-1 text-xs font-black shadow-sm ${
                property.status === 'Sotilgan' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
              }`}
            >
              {tv(property.status)}
            </span>
          )}

          {property.isPremium && (
            <span className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-2.5 py-1 text-xs font-black text-white shadow-sm">
              <IoStar className="h-3 w-3 fill-current" />
              {t('premium')}
            </span>
          )}

          {property.isFeatured && (
            <span className="flex items-center gap-1 rounded-xl bg-slate-950 px-2.5 py-1 text-xs font-black text-white shadow-sm">
              <IoSparkles className="h-3 w-3" />
              {t('featured')}
            </span>
          )}

          {property.price < 50000 && property.status === 'Aktiv' && (
            <span className="rounded-xl bg-emerald-500 px-2.5 py-1 text-xs font-black text-slate-950 shadow-sm">
              {t('affordable')}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3 text-white">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-200">{t('totalPrice')}</div>
            <div className="truncate text-xl font-black">{formatPrice(property.price, property.currency)}</div>
          </div>
          <div className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-black text-slate-950 backdrop-blur">
            {property.category?.name || t('property')}
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5 text-left">
        <div className="flex items-center justify-between gap-2 text-xs font-black uppercase tracking-wide text-emerald-700">
          <span className="truncate">{tv(property.propertyType) || t('property')}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{t('verifiedListings')}</span>
        </div>

        <h3 className="mt-3 line-clamp-1 text-lg font-black text-slate-950 transition-colors group-hover:text-emerald-700">
          {property.title || "Nomsiz e'lon"}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-slate-500">
          <IoLocation className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">
            {[property.city, property.district].filter(Boolean).join(', ') || 'Manzil kiritilmagan'}
          </span>
        </div>

        <div className="mt-5 grid shrink-0 grid-cols-3 gap-2 border-y border-slate-100 py-3 text-xs font-bold text-slate-600">
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2">
            <IoBed className="h-4 w-4 text-emerald-600" />
            <span>{t('roomsUnit', { count: property.rooms || 0 })}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2">
            <IoExpand className="h-4 w-4 text-amber-600" />
            <span className="truncate">
              {property.area || 0} m²{property.landArea > 0 && ` (${property.landArea} sotix)`}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2">
            <IoLayers className="h-4 w-4 text-rose-600" />
            <span className="truncate">
              {isApartmentLike(property.propertyType)
                ? t('floorOf', { floor: property.floor || 1, total: property.totalFloors || 1 })
                : t('floors', { count: property.totalFloors || 1 })}
            </span>
          </div>
        </div>

        <div className="mt-auto flex shrink-0 items-center justify-between gap-3 pt-5">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-none text-slate-400">{t('navListings')}</span>
            <span className="mt-1 text-sm font-black leading-tight text-slate-950">{t('details')}</span>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="group/btn inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition-all duration-300 hover:bg-emerald-600 active:scale-95"
          >
            <span>{t('details')}</span>
            <IoArrowForward className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
