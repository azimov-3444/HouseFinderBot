import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProperties } from '../services/propertyService';
import { getCategories } from '../services/categoryService';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';
import {
  IoShieldCheckmark,
  IoPricetag,
  IoSparkles,
  IoHeadset,
  IoChevronForward,
  IoBriefcase,
  IoPeople,
  IoHome,
} from 'react-icons/io5';

// React Icons matching dynamically for categories
import * as RI from 'react-icons/fa';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, catRes] = await Promise.all([
          getFeaturedProperties(),
          getCategories(),
        ]);
        if (featRes?.success) setFeatured(featRes.data);
        if (catRes?.success) setCategories(catRes.data.filter((c) => c.isActive));
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Icon mapping utility
  const getCategoryIcon = (iconName) => {
    if (iconName === 'FaCrown') return <RI.FaCrown className="h-6 w-6 text-amber-500" />;
    if (iconName === 'FaBuilding') return <RI.FaBuilding className="h-6 w-6 text-primary-500" />;
    if (iconName === 'FaHome') return <RI.FaHome className="h-6 w-6 text-emerald-500" />;
    if (iconName === 'FaPercentage') return <RI.FaPercentage className="h-6 w-6 text-indigo-500" />;
    return <RI.FaHome className="h-6 w-6 text-slate-500" />;
  };

  return (
    <div className="space-y-20 -mt-24">
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white pt-36 pb-28 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-950/80 via-slate-900 to-slate-950 opacity-90 z-0"></div>
        <div className="absolute top-1/4 left-1/10 h-96 w-96 rounded-full bg-primary-650/10 blur-3xl shrink-0"></div>
        <div className="absolute bottom-1/4 right-1/10 h-[500px] w-[500px] rounded-full bg-accent-500/5 blur-3xl shrink-0"></div>

        <div className="mx-auto max-w-7xl w-full text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-bold text-slate-350 tracking-wider uppercase animate-pulse-soft">
            <IoSparkles className="text-accent-400 h-4 w-4" />
            O'zbekistondagi eng operates ko'chmas mulk qidiruvi
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none max-w-4xl mx-auto">
            Orzuingizdagi{' '}
            <span className="bg-gradient-to-r from-accent-400 via-accent-300 to-emerald-400 bg-clip-text text-transparent">
              Uyni
            </span>{' '}
            Oson Toping
          </h1>

          <p className="text-base sm:text-lg text-slate-350 max-w-2xl mx-auto leading-relaxed">
            Biz sizga orzuingizdagi xonadon, uchastka yoki premium villani qulay va ishonchli narxlarda topishga ko'maklashamiz.
          </p>

          {/* SearchBar Widget */}
          <div className="pt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 2. Categories Grid */}
        {categories.length > 0 && (
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                Kategoriyalar bo'yicha saralash
              </h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Mulk turiga yoki qulayligiga qarab o'zingizga yoqadigan toifani tanlang
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat, idx) => (
                <Link
                  key={cat._id}
                  to={`/properties?category=${cat._id}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-3.5 rounded-xl bg-slate-50 group-hover:bg-primary-50 transition-colors">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    <IoChevronForward className="h-5 w-5 text-slate-300 group-hover:text-primary-600 transition-all transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-6">
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 3. Featured Properties */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                Tavsiya etilgan eng so'nggi uylar
              </h2>
              <p className="text-sm text-slate-500">
                Ekspertlarimiz tomonidan tanlab olingan eng ishonchli va premium e'lonlar
              </p>
            </div>
            <Link
              to="/properties"
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-primary-900 hover:text-white font-bold text-xs transition-all active:scale-95 shrink-0"
            >
              <span>Barchasini ko'rish</span>
              <IoChevronForward className="h-4.5 w-4.5" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white">
              <div className="mx-auto h-12 w-12 text-slate-350">
                <IoHome className="h-full w-full" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-850">Tavsiya etilgan e'lonlar mavjud emas</h3>
              <p className="mt-1 text-xs text-slate-400">Yangi e'lonlar tez orada qo'shiladi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Why Choose Us Section */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Nega aynan biz?</h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Biz mijozlarimizga eng operates, shaffof va xavfsiz xizmatlarni taqdim etamiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            <div className="bg-white p-6.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <IoShieldCheckmark className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">100% Ishonchlilik</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tizimdagi barcha e'lonlar va admin tekshiruvidan o'tadi, shubhali uylar bloklanadi.
              </p>
            </div>

            <div className="bg-white p-6.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <IoPricetag className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Hamyonbop Narxlar</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Komissiya to'lovlarisiz va vositachilarsiz to'g'ridan-to'g'ri bog'lanish va kelishish imkoni.
              </p>
            </div>

            <div className="bg-white p-6.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-650">
                <IoSparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Keng Tanlov</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Barcha qulayliklarga ega premium villalardan tortib, arzon shinam kvartiralargacha.
              </p>
            </div>

            <div className="bg-white p-6.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <IoHeadset className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">24/7 Professional Yordam</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bizning professional maslahatchilarimiz sizga istalgan vaqtda yordam berishga tayyor.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Statistics Section */}
        <section className="bg-primary-950 text-white rounded-3xl p-10 sm:p-14 relative overflow-hidden text-left">
          {/* gradient blobs */}
          <div className="absolute top-0 right-0 h-64 w-64 bg-accent-500/10 blur-3xl rounded-full shrink-0"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-primary-650/15 blur-2xl rounded-full shrink-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-accent-400">
                  <IoHome className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-4">500+</div>
              <p className="text-sm font-semibold text-slate-400">Sotuvdagi faol uylar</p>
            </div>

            <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0">
              <div className="flex justify-center">
                <div className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-accent-400">
                  <IoPeople className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-4">1000+</div>
              <p className="text-sm font-semibold text-slate-400">Mamnun mijozlar</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-accent-400">
                  <IoBriefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-4">24/7</div>
              <p className="text-sm font-semibold text-slate-400">Professional qo'llab-quvvatlash</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
