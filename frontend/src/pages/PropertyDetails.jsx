import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  IoAlertCircleOutline,
  IoBed,
  IoBuild,
  IoCalendar,
  IoCall,
  IoCheckmarkCircle,
  IoCopy,
  IoExpand,
  IoHome,
  IoLayers,
  IoLocation,
  IoLogoWhatsapp,
  IoSchool,
  IoTime,
} from 'react-icons/io5';
import { getProperty, getSimilarProperties, submitContactRequest } from '../services/propertyService';
import ImageGallery from '../components/ImageGallery';
import PropertyMap from '../components/PropertyMap';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { useLocale } from '../context/LocaleContext';

const isApartmentLike = (type) => (
  type === 'Ko‘p qavatli dom'
  || type === "Ko'p qavatli dom"
  || type === 'KoвЂp qavatli dom'
  || type === 'Yangi qurilgan uy'
);

const PropertyDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { t, formatPrice } = useLocale();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("Salom, ushbu uy bo'yicha batafsilroq ma'lumot olmoqchi edim.");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [propRes, simRes] = await Promise.all([
          getProperty(id),
          getSimilarProperties(id),
        ]);
        if (propRes?.success) setProperty(propRes.data);
        if (simRes?.success) setSimilar(simRes.data);
      } catch (err) {
        console.error('Error fetching property details:', err);
        showToast('error', 'Mulk tafsilotlarini yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, showToast]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('error', 'Iltimos, ism va telefon raqamingizni kiriting');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitContactRequest({
        propertyId: property._id,
        name,
        phone,
        email,
        message,
      });

      if (res?.success) {
        showToast('success', 'Arizangiz muvaffaqiyatli qabul qilindi! Admin tez orada siz bilan boglanadi.');
        setName('');
        setPhone('');
        setEmail('');
        setMessage("Salom, ushbu uy bo'yicha batafsilroq ma'lumot olmoqchi edim.");
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Ariza yuborishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Havola clipboardga nusxalandi!');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Salom! Menga ushbu uy juda yoqdi: ${property.title} - ${formatPrice(property.price, property.currency)}. Havola: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) return <Loading />;

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center space-y-4">
        <IoAlertCircleOutline className="h-16 w-16 mx-auto text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">{t('notFound')}</h2>
        <Link to="/properties" className="inline-block px-5 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-sm">
          {t('backToListings')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-650 uppercase tracking-wider">
            <Link to="/" className="hover:text-primary-850">{t('navHome')}</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-850">{t('navListings')}</Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[150px] sm:max-w-xs">{property.title}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 leading-tight">{property.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl">
              <IoLocation className="h-4.5 w-4.5 text-slate-400" />
              <span>{property.city}, {property.district}, {property.address}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl">
              <IoTime className="h-4.5 w-4.5 text-slate-400" />
              <span>{t('views', { count: property.views })}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:w-full lg:w-auto gap-4 shrink-0">
          <div className="text-left lg:text-right">
            <span className="text-xs text-slate-400 font-medium">{t('startingPrice')}</span>
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mt-1 leading-none">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 font-bold text-xs active:scale-95 transition-all shadow-sm"
            >
              <IoCopy className="h-4 w-4" />
              {t('copyLink')}
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-100 font-bold text-xs active:scale-95 transition-all shadow-sm"
            >
              <IoLogoWhatsapp className="h-4 w-4" />
              {t('share')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery images={property.images} />

          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">{t('mainSpecs')}</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-left text-sm text-slate-650 font-medium">
              <Spec icon={IoBed} label={t('rooms')} value={t('roomsUnit', { count: property.rooms })} />
              <Spec icon={IoExpand} label={t('area')} value={`${property.area} m²`} />
              <Spec
                icon={IoLayers}
                label={t('floor')}
                value={isApartmentLike(property.propertyType)
                  ? t('floorOf', { floor: property.floor, total: property.totalFloors })
                  : t('floors', { count: property.totalFloors || 1 })}
              />
              {property.landArea > 0 && <Spec icon={IoHome} label={t('landArea')} value={`${property.landArea} sotix`} />}
              {property.buildingYear && <Spec icon={IoCalendar} label={t('builtYear')} value={`${property.buildingYear}-yil`} />}
              <Spec icon={IoBuild} label={t('renovation')} value={property.renovationStatus} />
            </div>
          </div>

          <InfoSection title={t('description')}>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </InfoSection>

          {(property.amenities.length > 0 || property.communications.length > 0) && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {property.amenities.length > 0 && (
                <ChipGroup title={t('amenities')} items={property.amenities} color="emerald" />
              )}
              {property.communications.length > 0 && (
                <ChipGroup title={t('communications')} items={property.communications} color="blue" />
              )}
            </div>
          )}

          {property.nearbyPlaces.length > 0 && (
            <InfoSection title={t('nearby')}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.nearbyPlaces.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
                    <IoSchool className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            </InfoSection>
          )}

          {property.latitude && property.longitude && (
            <InfoSection title={t('mapLocation')}>
              <PropertyMap
                lat={property.latitude}
                lng={property.longitude}
                title={property.title}
                address={property.address}
              />
            </InfoSection>
          )}
        </div>

        <div className="space-y-6 lg:col-span-1 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-800 mb-2">{t('quickContact')}</h3>
            <a
              href="tel:+998901234567"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-850 active:scale-[0.98] transition-all shadow-md"
            >
              <IoCall className="h-5 w-5" />
              {t('call')}
            </a>
            <a
              href="https://t.me/housefinder"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all shadow-md"
            >
              {t('telegram')}
            </a>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md text-left space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">{t('purchaseRequest')}</h3>
              <p className="text-xs text-slate-400">{t('requestText')}</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Field label={t('name')} value={name} onChange={setName} placeholder="Masalan: Asror" disabled={submitting} />
              <Field label={t('phone')} type="tel" value={phone} onChange={setPhone} placeholder="+998 (90) 123-45-67" disabled={submitting} />
              <Field label={t('emailOptional')} type="email" value={email} onChange={setEmail} placeholder="asror@example.com" disabled={submitting} />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{t('message')}</label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-800 text-white font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {submitting ? t('submitting') : t('sendRequest')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="space-y-8 pt-10 border-t border-slate-100">
          <div className="text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{t('similar')}</h2>
            <p className="text-xs text-slate-500">{t('similarText')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const Spec = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">{label}</span>
      <span className="font-bold text-slate-800 mt-1 block truncate max-w-[140px]">{value}</span>
    </div>
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
    <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">{title}</h3>
    {children}
  </div>
);

const ChipGroup = ({ title, items, color }) => (
  <div className="space-y-4">
    <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-50">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span
          key={idx}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
            color === 'blue' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <IoCheckmarkCircle className="h-4 w-4" />
          {item}
        </span>
      ))}
    </div>
  </div>
);

const Field = ({ label, type = 'text', value, onChange, placeholder, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  </div>
);

export default PropertyDetails;
