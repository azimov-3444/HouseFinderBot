import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty, uploadImages } from '../services/propertyService';
import { getCategories } from '../services/categoryService';
import MapPicker from '../components/MapPicker';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  IoAdd,
  IoImages,
  IoClose,
  IoLocation,
  IoCheckmarkCircle,
  IoSave,
  IoArrowBack,
  IoCloudUpload,
} from 'react-icons/io5';

const AdminAddProperty = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const backPath = user?.role === 'admin' ? '/admin/properties' : '/properties';

  // Categories list
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. General Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [propertyType, setPropertyType] = useState('Ko‘p qavatli dom');
  const [status, setStatus] = useState('Aktiv');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [tourUrl, setTourUrl] = useState('');

  // 2. Images State
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // 3. Address & Location
  const [city, setCity] = useState('Toshkent');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(41.31108); // center of Tashkent
  const [longitude, setLongitude] = useState(69.24056);

  // 4. Dynamic/Conditional fields
  const [rooms, setRooms] = useState('');
  const [floor, setFloor] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [area, setArea] = useState('');
  const [landArea, setLandArea] = useState('');
  const [buildingYear, setBuildingYear] = useState('');
  const [renovationStatus, setRenovationStatus] = useState('Evroremont');
  
  // Booleans
  const [hasBalcony, setHasBalcony] = useState(false);
  const [hasLift, setHasLift] = useState(false);
  const [hasParking, setHasParking] = useState(false);

  // 5. Communications checklist
  const [commList, setCommList] = useState({
    Gaz: true,
    Svet: true,
    Suv: true,
    Kanalizatsiya: true,
    Internet: false,
  });

  // 6. Amenities checklists
  const [amenitiesChecklist, setAmenitiesChecklist] = useState({
    Mebel: false,
    Konditsioner: false,
    Televizor: false,
    'Kir yuvish mashinasi': false,
    Internet: false,
    'Kamera tizimi': false,
    Garaj: false,
    Basseyn: false,
    Sauna: false,
    'Aqlli uy': false,
  });

  // 7. Nearby places checklist
  const [nearbyChecklist, setNearbyChecklist] = useState({
    Metro: false,
    Maktab: false,
    'Bog‘cha': false,
    Supermarket: false,
    Masjid: false,
    Park: false,
    Shifoxona: false,
    'Sport zal': false,
    Bozor: false,
    'Savdo markazi': false,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await getCategories();
        if (res?.success) {
          const activeCats = res.data.filter((c) => c.isActive);
          setCategories(activeCats);
          if (activeCats.length > 0) setCategory(activeCats[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Multi-Image Upload triggers
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setIsUploading(true);
      const res = await uploadImages(formData);
      if (res?.success) {
        // Append loaded image URLs (need fully qualified domain url in local dev, let's store standard path)
        const newUrls = res.urls.map(url => `http://localhost:5000${url}`);
        setImages((prev) => [...prev, ...newUrls]);
        showToast('success', 'Rasmlar muvaffaqiyatli yuklandi!');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Rasmlar yuklashda xatolik yuz berdi');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Map marker drag coordinate changes
  const handleMapChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validations
    if (!title || !price || !category || !propertyType || !address || !city || !district) {
      showToast('error', 'Iltimos, barcha asosiy majburiy maydonlarni to‘ldiring');
      return;
    }
    if (images.length === 0) {
      showToast('error', 'Kamida bitta rasm yuklashingiz shart');
      return;
    }

    // 2. Prepare payload
    const payload = {
      title,
      price: Number(price),
      currency,
      category,
      propertyType,
      status,
      description,
      isFeatured,
      isPremium,
      videoUrl,
      tourUrl,
      images,
      city,
      district,
      address,
      latitude,
      longitude,
    };

    // Sub-arrays filters
    payload.amenities = Object.keys(amenitiesChecklist).filter((key) => amenitiesChecklist[key]);
    payload.nearbyPlaces = Object.keys(nearbyChecklist).filter((key) => nearbyChecklist[key]);
    payload.communications = Object.keys(commList).filter((key) => commList[key]);

    // Conditional details mapping
    if (propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') {
      payload.rooms = Number(rooms) || 0;
      payload.floor = Number(floor) || 0;
      payload.totalFloors = Number(totalFloors) || 0;
      payload.area = Number(area) || 0;
      payload.hasBalcony = hasBalcony;
      payload.hasLift = hasLift;
      payload.hasParking = hasParking;
      payload.renovationStatus = renovationStatus;
      payload.buildingYear = Number(buildingYear) || undefined;
    } else if (propertyType === 'Uchastka') {
      payload.landArea = Number(landArea) || 0;
      payload.rooms = Number(rooms) || 0;
    } else if (propertyType === 'Hovli') {
      payload.rooms = Number(rooms) || 0;
      payload.landArea = Number(landArea) || 0;
      payload.area = Number(area) || 0;
      payload.totalFloors = Number(totalFloors) || 1;
      payload.renovationStatus = renovationStatus;
    } else if (propertyType === 'Villa') {
      payload.rooms = Number(rooms) || 0;
      payload.landArea = Number(landArea) || 0;
      payload.area = Number(area) || 0;
      payload.totalFloors = Number(totalFloors) || 1;
      payload.renovationStatus = renovationStatus;
    }

    try {
      const res = await createProperty(payload);
      if (res?.success) {
        showToast('success', 'Yangi e‘lon muvaffaqiyatli yaratildi!');
        navigate(backPath);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'E‘lon yaratishda xatolik yuz berdi';
      showToast('error', msg);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top action header bar */}
      <div className="flex items-center justify-between bg-white border border-slate-100 p-5 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(backPath)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            <IoArrowBack className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-800">Yangi uy qo'shish</h2>
            <p className="text-xs text-slate-400">Mulk tafsilotlarini quyidagi formaga kiriting.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: GENERAL INFO */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Umumiy ma'lumotlar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">E'lon sarlavhasi *</label>
              <input
                type="text"
                placeholder="Masalan: Shahar markazida shinam 3 xonali uy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Narxi *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Narxi..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-2/3 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="UZS">UZS (so'm)</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kategoriya *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Mulk turi *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="Ko‘p qavatli dom">Ko‘p qavatli dom</option>
                <option value="Uchastka">Uchastka</option>
                <option value="Hovli">Hovli</option>
                <option value="Villa">Villa</option>
                <option value="Yangi qurilgan uy">Yangi qurilgan uy</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Sotuv holati *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Sotilgan">Sotilgan</option>
                <option value="Band qilingan">Band qilingan</option>
              </select>
            </div>

            {/* Badges toggles */}
            <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700">Tavsiya etilgan (Featured) badge qo‘shish</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700">Premium badge qo‘shish</span>
              </label>
            </div>

            {/* Description */}
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Batafsil tavsif *</label>
              <textarea
                rows="4"
                placeholder="Uy bo'yicha batafsil ma'lumot, sharoitlar va afzalliklarini yozing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 2: DYNAMIC SPECIFIC FIELDS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">
            Mulk xususiyatlari ({propertyType})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Rooms (All types except maybe empty plot) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Xonalar soni</label>
              <input
                type="number"
                placeholder="Xonalar..."
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Floor (apartment only) */}
            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qavat</label>
                <input
                  type="number"
                  placeholder="Qavati..."
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Total Floors */}
            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                  {propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy'
                    ? 'Jami qavatlar soni'
                    : 'Qavatlar soni'}
                </label>
                <input
                  type="number"
                  placeholder="Qavatlar..."
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Area (apartment, hovli, villa) */}
            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Umumiy maydoni (kv.m)</label>
                <input
                  type="number"
                  placeholder="Maydoni..."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Land Area (sotix - villa, hovli, plot) */}
            {propertyType !== 'Ko‘p qavatli dom' && propertyType !== 'Yangi qurilgan uy' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Yer maydoni (sotixda)</label>
                <input
                  type="number"
                  placeholder="Sotix..."
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Building Year */}
            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qurilgan yili</label>
                <input
                  type="number"
                  placeholder="Yili..."
                  value={buildingYear}
                  onChange={(e) => setBuildingYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {/* Renovation */}
            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Ta'mir holati</label>
                <select
                  value={renovationStatus}
                  onChange={(e) => setRenovationStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="Dizaynerlik remonti">Dizaynerlik remonti</option>
                  <option value="Evroremont">Evroremont</option>
                  <option value="Yaxshi">Yaxshi</option>
                  <option value="O‘rtacha">O‘rtacha</option>
                  <option value="Ta‘mirsiz (Korobka)">Ta‘mirsiz (Korobka)</option>
                  <option value="Ta‘mirtalab">Ta‘mirtalab</option>
                </select>
              </div>
            )}

            {/* Booleans (Apartments) */}
            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="col-span-1 sm:col-span-3 flex flex-wrap gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasBalcony}
                    onChange={(e) => setHasBalcony(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Balkon bormi?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasLift}
                    onChange={(e) => setHasLift(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Lift bormi?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Parking joyi bormi?</span>
                </label>
              </div>
            )}

          </div>
        </div>

        {/* SECTION 3: IMAGE UPLOAD GALLERY */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Uy rasmlari galereyasi</h3>
          
          <div className="space-y-4">
            {/* Upload Zone */}
            <div className="relative border-2 border-dashed border-slate-200 hover:border-primary-500 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/50 transition-all cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                <IoCloudUpload className="h-10 w-10 text-slate-400 animate-pulse-soft" />
                <span className="text-sm font-bold text-slate-750">Rasmlarni yuklash uchun bosing yoki sudrang</span>
                <span className="text-xs text-slate-400">Faqat JPG, PNG, WEBP formatlari qabul qilinadi. Maksimal 5MB.</span>
              </div>
            </div>

            {isUploading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-550 justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600"></div>
                <span>Rasmlar yuklanmoqda...</span>
              </div>
            )}

            {/* Previews grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shadow-sm group">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-2 top-2 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <IoClose className="h-4 w-4" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute left-2 bottom-2 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
                        Asosiy
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: ADDRESS & MAP COORDINATE */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Manzil va Xaritadan tanlash</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Shahar / Viloyat *</label>
              <input
                type="text"
                placeholder="Masalan: Toshkent"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tuman *</label>
              <input
                type="text"
                placeholder="Masalan: Yunusobod"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5 col-span-1 sm:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">To'liq ko‘cha manzili *</label>
              <input
                type="text"
                placeholder="Masalan: Amir Temur ko‘chasi, 15-uy"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Map Coordinate inputs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kenglik (Latitude) *</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Uzunlik (Longitude) *</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 font-mono"
              />
            </div>

            {/* Map Picker container */}
            <div className="col-span-1 sm:col-span-3 pt-2">
              <MapPicker lat={latitude} lng={longitude} onChange={handleMapChange} />
            </div>
          </div>
        </div>

        {/* SECTION 5: EXTRA FEATURES (AMENITIES, COMMUNICATIONS, NEARBY) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Qulayliklar va Kommunikatsiyalar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {/* Communications */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50">Kommunikatsiyalar</h4>
              <div className="flex flex-col gap-2">
                {Object.keys(commList).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={commList[key]}
                      onChange={(e) => setCommList((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 text-primary-900 focus:ring-primary-500 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3 col-span-1 sm:col-span-2">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50">Qulayliklar (Amenities)</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.keys(amenitiesChecklist).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={amenitiesChecklist[key]}
                      onChange={(e) => setAmenitiesChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 text-primary-900 focus:ring-primary-500 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="space-y-3 col-span-1 sm:col-span-3 pt-2">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50">Yaqin atrofda bor joylar</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.keys(nearbyChecklist).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-650 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={nearbyChecklist[key]}
                      onChange={(e) => setNearbyChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 text-primary-900 focus:ring-primary-500 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: TOURS & VIDEO LINKS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Video va Virtual 3D tur linklari</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Video havola (YouTube, etc.)</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">360 Virtual Tour Link (Matterport, etc.)</label>
              <input
                type="url"
                placeholder="https://my.matterport.com/show/?m=..."
                value={tourUrl}
                onChange={(e) => setTourUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Form Submit buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-95 transition-all"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-850 active:scale-95 transition-all shadow-lg shadow-primary-900/10"
          >
            <IoSave className="h-5 w-5" />
            <span>Mulkni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProperty;
