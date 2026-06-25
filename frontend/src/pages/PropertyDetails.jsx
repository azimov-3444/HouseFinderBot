import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty, getSimilarProperties, submitContactRequest } from '../services/propertyService';
import ImageGallery from '../components/ImageGallery';
import PropertyMap from '../components/PropertyMap';
import PropertyCard from '../components/PropertyCard';
import Loading from '../components/Loading';
import formatPrice from '../utils/formatPrice';
import { useToast } from '../context/ToastContext';
import {
  IoCall,
  IoLogoWhatsapp,
  IoShareSocial,
  IoCopy,
  IoHome,
  IoLocation,
  IoBed,
  IoExpand,
  IoLayers,
  IoCalendar,
  IoBuild,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoSchool,
  IoSparkles,
  IoBriefcase,
  IoTime,
} from 'react-icons/io5';

const PropertyDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  // States
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Salom, ushbu uy bo‘yicha batafsilroq ma’lumot olmoqchi edim.');
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
  }, [id]);

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
        showToast('success', 'Arizangiz muvaffaqiyatli qabul qilindi! Admin tez orada siz bilan bog‘lanadi.');
        setName('');
        setPhone('');
        setEmail('');
        setMessage('Salom, ushbu uy bo‘yicha batafsilroq ma’lumot olmoqchi edim.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Ariza yuborishda xatolik yuz berdi';
      showToast('error', msg);
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
        <h2 className="text-xl font-bold text-slate-800">Mulk topilmadi</h2>
        <Link to="/properties" className="inline-block px-5 py-2.5 rounded-xl bg-primary-900 text-white font-bold text-sm">
          E'lonlar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-left">
      {/* 1. Header Details (Breadcrumbs, Title & Actions) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-650 uppercase tracking-wider">
            <Link to="/" className="hover:text-primary-850">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-850">E'lonlar</Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[150px] sm:max-w-xs">{property.title}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 leading-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl">
              <IoLocation className="h-4.5 w-4.5 text-slate-400" />
              <span>{property.city}, {property.district}, {property.address}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl">
              <IoTime className="h-4.5 w-4.5 text-slate-400" />
              <span>Ko'rilganlar soni: {property.views} ta</span>
            </div>
          </div>
        </div>

        {/* Pricing / Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:w-full lg:w-auto gap-4 shrink-0">
          <div className="text-left lg:text-right">
            <span className="text-xs text-slate-400 font-medium">Boshlang'ich narxi:</span>
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mt-1 leading-none">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 font-bold text-xs active:scale-95 transition-all shadow-sm"
              title="Havolani nusxalash"
            >
              <IoCopy className="h-4 w-4" />
              Nusxa havola
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-100 font-bold text-xs active:scale-95 transition-all shadow-sm"
              title="WhatsApp orqali ulashish"
            >
              <IoLogoWhatsapp className="h-4 w-4" />
              Ulashish
            </button>
          </div>
        </div>
      </div>

      {/* 2. Photo Gallery split with Contact Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Gallery on Left (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery images={property.images} />

          {/* Specifications Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">Asosiy ko‘rsatkichlar</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-left text-sm text-slate-650 font-medium">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                  <IoBed className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Xonalar</span>
                  <span className="font-bold text-slate-800 mt-1 block">{property.rooms} xona</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                  <IoExpand className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Maydoni</span>
                  <span className="font-bold text-slate-800 mt-1 block">{property.area} m²</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                  <IoLayers className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Qavati</span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {property.propertyType === 'Ko‘p qavatli dom' || property.propertyType === 'Yangi qurilgan uy'
                      ? `${property.floor}/${property.totalFloors} qavat`
                      : `${property.totalFloors || 1} qavatli`}
                  </span>
                </div>
              </div>

              {property.landArea > 0 && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                    <IoHome className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Yer maydoni</span>
                    <span className="font-bold text-slate-800 mt-1 block">{property.landArea} sotix</span>
                  </div>
                </div>
              )}

              {property.buildingYear && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                    <IoCalendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Qurilgan yili</span>
                    <span className="font-bold text-slate-800 mt-1 block">{property.buildingYear}-yil</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-650 shrink-0">
                  <IoBuild className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Remont holati</span>
                  <span className="font-bold text-slate-800 mt-1 block truncate max-w-[120px]">{property.renovationStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">Tavsif</h3>
            <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line text-slate-600">
              {property.description}
            </p>
          </div>

          {/* Amenities & Communications */}
          {(property.amenities.length > 0 || property.communications.length > 0) && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {/* Amenities */}
              {property.amenities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-50">Qulayliklar</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold shadow-sm">
                        <IoCheckmarkCircle className="h-4 w-4" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Communications */}
              {property.communications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-50">Kommunikatsiya liniyalari</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.communications.map((comm, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold shadow-sm">
                        <IoCheckmarkCircle className="h-4 w-4" />
                        {comm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nearby Places */}
          {property.nearbyPlaces.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">Atrofdagi muhim joylar</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.nearbyPlaces.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold">
                    <IoSchool className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          {property.latitude && property.longitude && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-50">Mulkning xaritadagi joylashuvi</h3>
              <PropertyMap
                lat={property.latitude}
                lng={property.longitude}
                title={property.title}
                address={property.address}
              />
            </div>
          )}

        </div>

        {/* Form panel on Right (1 column) */}
        <div className="space-y-6 lg:col-span-1 sticky top-24">
          {/* Quick Contact buttons panel */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-800 mb-2">Tezkor bog‘lanish</h3>
            
            <a
              href={`tel:+998901234567`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-850 active:scale-[0.98] transition-all shadow-md"
            >
              <IoCall className="h-5 w-5" />
              Qo'ng'iroq qilish
            </a>

            <a
              href={`https://t.me/housefinder`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all shadow-md"
            >
              Telegram orqali bog'lanish
            </a>
          </div>

          {/* ARIZA QOLDIRISH FORM */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md text-left space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">Sotib olish arizasi</h3>
              <p className="text-xs text-slate-400">Bizga so‘rov yuboring va xodimimiz tezda siz bilan aloqaga chiqadi.</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Ismingiz</label>
                <input
                  type="text"
                  placeholder="Masalan: Asror"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Telefon raqamingiz</label>
                <input
                  type="tel"
                  placeholder="Masalan: +998 (90) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Email (ixtiyoriy)</label>
                <input
                  type="email"
                  placeholder="asror@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Xabaringiz</label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-tr from-primary-900 to-primary-800 text-white font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {submitting ? 'Yuborilmoqda...' : 'Ariza yuborish'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Similar Properties Section */}
      {similar.length > 0 && (
        <section className="space-y-8 pt-10 border-t border-slate-100">
          <div className="text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              O'xshash uylar e'lonlari
            </h2>
            <p className="text-xs text-slate-500">
              Siz tanlagan mulk bilan o‘xshash joylashuvdagi yoki toifadagi boshqa e'lonlar
            </p>
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

export default PropertyDetails;
