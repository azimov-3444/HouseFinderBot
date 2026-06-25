import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, updateProperty, uploadImages } from '../services/propertyService';
import { getCategories } from '../services/categoryService';
import MapPicker from '../components/MapPicker';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import {
  IoArrowBack,
  IoImages,
  IoClose,
  IoSave,
  IoCloudUpload,
} from 'react-icons/io5';

const AdminEditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

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
  const [latitude, setLatitude] = useState(41.31108);
  const [longitude, setLongitude] = useState(69.24056);

  // 4. Dynamic fields
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
    Gaz: false,
    Svet: false,
    Suv: false,
    Kanalizatsiya: false,
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
    const loadData = async () => {
      try {
        setPageLoading(true);
        // Load categories and selected property details
        const [catsRes, propRes] = await Promise.all([
          getCategories(),
          getProperty(id),
        ]);

        if (catsRes?.success) {
          setCategories(catsRes.data.filter((c) => c.isActive));
        }

        if (propRes?.success) {
          const prop = propRes.data;
          
          // Fill states
          setTitle(prop.title);
          setPrice(prop.price);
          setCurrency(prop.currency || 'USD');
          setCategory(prop.category?._id || prop.category);
          setPropertyType(prop.propertyType);
          setStatus(prop.status || 'Aktiv');
          setDescription(prop.description);
          setIsFeatured(prop.isFeatured || false);
          setIsPremium(prop.isPremium || false);
          setVideoUrl(prop.videoUrl || '');
          setTourUrl(prop.tourUrl || '');
          setImages(prop.images || []);
          setCity(prop.city || 'Toshkent');
          setDistrict(prop.district || '');
          setAddress(prop.address || '');
          setLatitude(prop.latitude || 41.31108);
          setLongitude(prop.longitude || 69.24056);

          // Specs
          setRooms(prop.rooms !== undefined ? prop.rooms : '');
          setFloor(prop.floor !== undefined ? prop.floor : '');
          setTotalFloors(prop.totalFloors !== undefined ? prop.totalFloors : '');
          setArea(prop.area !== undefined ? prop.area : '');
          setLandArea(prop.landArea !== undefined ? prop.landArea : '');
          setBuildingYear(prop.buildingYear !== undefined ? prop.buildingYear : '');
          setRenovationStatus(prop.renovationStatus || 'Evroremont');
          setHasBalcony(prop.hasBalcony || false);
          setHasLift(prop.hasLift || false);
          setHasParking(prop.hasParking || false);

          // Populate communications checklist
          if (prop.communications) {
            setCommList((prev) => {
              const updated = { ...prev };
              Object.keys(updated).forEach(k => {
                updated[k] = prop.communications.includes(k);
              });
              return updated;
            });
          }

          // Populate amenities checklist
          if (prop.amenities) {
            setAmenitiesChecklist((prev) => {
              const updated = { ...prev };
              Object.keys(updated).forEach(k => {
                updated[k] = prop.amenities.includes(k);
              });
              return updated;
            });
          }

          // Populate nearby places checklist
          if (prop.nearbyPlaces) {
            setNearbyChecklist((prev) => {
              const updated = { ...prev };
              Object.keys(updated).forEach(k => {
                updated[k] = prop.nearbyPlaces.includes(k);
              });
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching edit data:', err);
        showToast('error', 'E‘lon tafsilotlarini yuklashda xatolik yuz berdi');
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [id]);

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
        const newUrls = res.urls.map(url => `http://localhost:5000${url}`);
        setImages((prev) => [...prev, ...newUrls]);
        showToast('success', 'Rasmlar yuklandi!');
      }
    } catch (err) {
      showToast('error', 'Rasmlarni yuklashda xatolik');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMapChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !category || !propertyType || !address || !city || !district) {
      showToast('error', 'Iltimos, barcha asosiy majburiy maydonlarni kiriting');
      return;
    }
    if (images.length === 0) {
      showToast('error', 'Kamida bitta rasm bo‘lishi majburiy');
      return;
    }

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

    payload.amenities = Object.keys(amenitiesChecklist).filter(k => amenitiesChecklist[k]);
    payload.nearbyPlaces = Object.keys(nearbyChecklist).filter(k => nearbyChecklist[k]);
    payload.communications = Object.keys(commList).filter(k => commList[k]);

    // Dynamic specs mapping
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
      payload.landArea = 0;
    } else if (propertyType === 'Uchastka') {
      payload.landArea = Number(landArea) || 0;
      payload.rooms = Number(rooms) || 0;
      payload.area = 0;
      payload.floor = 0;
    } else if (propertyType === 'Hovli' || propertyType === 'Villa') {
      payload.rooms = Number(rooms) || 0;
      payload.landArea = Number(landArea) || 0;
      payload.area = Number(area) || 0;
      payload.totalFloors = Number(totalFloors) || 1;
      payload.renovationStatus = renovationStatus;
    }

    try {
      const res = await updateProperty(id, payload);
      if (res?.success) {
        showToast('success', 'E‘lon muvaffaqiyatli tahrirlandi!');
        navigate('/admin/properties');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Tahrirlashda xatolik yuz berdi';
      showToast('error', msg);
    }
  };

  if (pageLoading) return <Loading />;

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="flex items-center gap-3 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <button
          onClick={() => navigate('/admin/properties')}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
        >
          <IoArrowBack className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-slate-800">E'lonni tahrirlash</h2>
          <p className="text-xs text-slate-400">Uy ma'lumotlarini o'zgartiring va saqlang.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: GENERAL INFO */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Umumiy ma'lumotlar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">E'lon sarlavhasi *</label>
              <input
                type="text"
                placeholder="Sarlavha..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Narxi *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Narxi..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-2/3 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="UZS">UZS (so'm)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Kategoriya *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Mulk turi *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer"
              >
                <option value="Ko‘p qavatli dom">Ko‘p qavatli dom</option>
                <option value="Uchastka">Uchastka</option>
                <option value="Hovli">Hovli</option>
                <option value="Villa">Villa</option>
                <option value="Yangi qurilgan uy">Yangi qurilgan uy</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Sotuv holati *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Sotilgan">Sotilgan</option>
                <option value="Band qilingan">Band qilingan</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2 flex flex-wrap gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700">Tavsiya etilgan badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                />
                <span className="text-sm font-semibold text-slate-700">Premium badge</span>
              </label>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tavsif *</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Xonalar soni</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
              />
            </div>

            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qavat</label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                />
              </div>
            )}

            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">
                  Qavatlar soni
                </label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                />
              </div>
            )}

            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Umumiy maydoni (kv.m)</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                />
              </div>
            )}

            {propertyType !== 'Ko‘p qavatli dom' && propertyType !== 'Yangi qurilgan uy' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Yer maydoni (sotixda)</label>
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                />
              </div>
            )}

            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Qurilgan yili</label>
                <input
                  type="number"
                  value={buildingYear}
                  onChange={(e) => setBuildingYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800"
                />
              </div>
            )}

            {propertyType !== 'Uchastka' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Ta'mir holati</label>
                <select
                  value={renovationStatus}
                  onChange={(e) => setRenovationStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white cursor-pointer"
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

            {(propertyType === 'Ko‘p qavatli dom' || propertyType === 'Yangi qurilgan uy') && (
              <div className="col-span-1 sm:col-span-3 flex flex-wrap gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasBalcony}
                    onChange={(e) => setHasBalcony(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Balkon bormi?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasLift}
                    onChange={(e) => setHasLift(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Lift bormi?</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-slate-700">Parking bormi?</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: IMAGES */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Galereya</h3>
          
          <div className="space-y-4">
            <div className="relative border-2 border-dashed border-slate-200 hover:border-primary-500 rounded-2xl p-8 text-center bg-slate-50 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                <IoCloudUpload className="h-10 w-10 text-slate-400" />
                <span className="text-sm font-bold text-slate-750">Ushbu hududga rasm yuklang</span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-2 top-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoClose className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: ADDRESS & MAP */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Manzil va Xarita</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Shahar / Viloyat *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Tuman *</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5 col-span-1 sm:col-span-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Manzil *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="col-span-1 sm:col-span-3 pt-2">
              <MapPicker lat={latitude} lng={longitude} onChange={handleMapChange} />
            </div>
          </div>
        </div>

        {/* SECTION 5: CHECKLISTS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Qulayliklar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {/* Comms */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50">Kommunikatsiyalar</h4>
              <div className="flex flex-col gap-2">
                {Object.keys(commList).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium select-none">
                    <input
                      type="checkbox"
                      checked={commList[key]}
                      onChange={(e) => setCommList((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3 col-span-1 sm:col-span-2">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50 font-bold">Qulayliklar (Amenities)</h4>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.keys(amenitiesChecklist).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium select-none">
                    <input
                      type="checkbox"
                      checked={amenitiesChecklist[key]}
                      onChange={(e) => setAmenitiesChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nearby */}
            <div className="space-y-3 col-span-1 sm:col-span-3 pt-2">
              <h4 className="text-sm font-black text-slate-750 uppercase tracking-wider pb-1.5 border-b border-slate-50 font-bold">Yaqin atrofda bor joylar</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Object.keys(nearbyChecklist).map((key) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium select-none">
                    <input
                      type="checkbox"
                      checked={nearbyChecklist[key]}
                      onChange={(e) => setNearbyChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-5 w-5 rounded border-slate-350 cursor-pointer"
                    />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: TOURS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-50 pb-3">Video va Virtual Tur</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Video link</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-0.5">Virtual Tur Link (3D)</label>
              <input
                type="url"
                value={tourUrl}
                onChange={(e) => setTourUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submits */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm active:scale-95"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary-900 text-white font-bold text-sm hover:bg-primary-850 active:scale-95 transition-all shadow-lg"
          >
            <IoSave className="h-5 w-5" />
            <span>Tahrirlashni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProperty;
