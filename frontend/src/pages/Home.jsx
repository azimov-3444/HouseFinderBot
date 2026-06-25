import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as RI from 'react-icons/fa';
import {
  IoArrowForward,
  IoBed,
  IoBriefcase,
  IoChevronForward,
  IoFlash,
  IoHome,
  IoLocation,
  IoPeople,
  IoPricetag,
  IoShieldCheckmark,
  IoSparkles,
  IoTime,
} from 'react-icons/io5';
import { getFeaturedProperties } from '../services/propertyService';
import { getCategories } from '../services/categoryService';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { useLocale } from '../context/LocaleContext';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const heroImage =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLocale();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, catRes] = await Promise.all([getFeaturedProperties(), getCategories()]);
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

  const previewProperty = featured?.[0];
  const heroStats = useMemo(
    () => [
      { value: '500+', label: t('activeHomes'), icon: IoHome },
      { value: '12 daq', label: t('choiceTitle'), icon: IoTime },
      { value: '24/7', label: t('professionalSupport'), icon: IoFlash },
    ],
    [t]
  );

  const getCategoryIcon = (iconName) => {
    if (iconName === 'FaCrown') return <RI.FaCrown className="h-6 w-6" />;
    if (iconName === 'FaBuilding') return <RI.FaBuilding className="h-6 w-6" />;
    if (iconName === 'FaPercentage') return <RI.FaPercentage className="h-6 w-6" />;
    return <RI.FaHome className="h-6 w-6" />;
  };

  const categoriesToShow = categories.slice(0, 8);

  return (
    <div className="-mt-24 overflow-hidden bg-[#f7f8f4] text-slate-950">
      <section className="relative min-h-[96vh] px-4 pt-36 pb-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Modern uy interyeri" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.92)_0%,rgba(15,23,42,0.76)_46%,rgba(15,23,42,0.24)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f8f4] to-transparent" />
        </div>

        <motion.div
          variants={stagger}
          initial={false}
          animate="visible"
          className="relative z-10 mx-auto grid min-h-[72vh] w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="w-full max-w-[22rem] text-left sm:max-w-[32rem] lg:max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-emerald-100 backdrop-blur-xl lg:tracking-[0.18em]"
            >
              <IoSparkles className="h-4 w-4 text-amber-300" />
              <span className="truncate">Demo day uchun premium real-estate platforma</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-4xl break-words text-4xl font-black leading-[1.02] tracking-normal text-white sm:text-5xl lg:text-8xl"
            >
              Uy topish endi kinodek tez va zavqli.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              HouseFinder mijozni e'lonlar ichida adashtirmaydi: AI qidiruv, real rasmlar, xarita va ishonchli
              filtrlar bitta sahifada ishlaydi.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/properties"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-emerald-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-300 lg:w-auto"
              >
                E'lonlarni ko'rish
                <IoArrowForward className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/add-property"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-slate-950 lg:w-auto"
              >
                Uy joylash
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid max-w-2xl grid-cols-1 gap-3 lg:grid-cols-3">
              {heroStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                    <Icon className="mb-3 h-5 w-5 text-amber-300" />
                    <div className="text-2xl font-black text-white">{item.value}</div>
                    <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-300">{item.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="hidden lg:block">
            <div className="relative ml-auto max-w-md">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/12 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <img
                    src={previewProperty?.images?.[0] || heroImage}
                    alt={previewProperty?.title || 'Premium uy'}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-slate-950">
                      <IoShieldCheckmark className="h-4 w-4" />
                      {t('verifiedListings')}
                    </span>
                    <h2 className="text-2xl font-black text-white">{previewProperty?.title || 'Premium villa'}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <IoLocation className="h-4 w-4 text-amber-300" />
                      {previewProperty?.city || 'Toshkent'}, {previewProperty?.district || 'Yunusobod'}
                    </p>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -left-12 top-12 rounded-2xl border border-white/20 bg-white/90 p-4 text-slate-950 shadow-2xl">
                <div className="text-xs font-black uppercase text-slate-500">AI</div>
                <div className="mt-1 text-3xl font-black">98%</div>
              </div>
              <div className="absolute -right-10 bottom-16 rounded-2xl bg-amber-300 p-4 text-slate-950 shadow-2xl">
                <div className="text-xs font-black uppercase">{t('priceTitle')}</div>
                <div className="mt-1 text-sm font-black">{t('priceText')}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.75 }}
          className="relative z-20 mx-auto mt-4 max-w-7xl"
        >
          <SearchBar />
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {categoriesToShow.length > 0 && (
          <motion.section
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="py-16"
          >
            <motion.div variants={fadeUp} className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl text-left">
                <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">{t('categories')}</span>
                <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                  {t('categoriesTitle')}
                </h2>
              </div>
              <p className="max-w-sm text-left text-sm font-medium leading-7 text-slate-600">
                {t('categoriesText')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoriesToShow.map((cat, idx) => (
                <motion.div key={cat._id} variants={fadeUp}>
                  <Link
                    to={`/properties?category=${cat._id}`}
                    className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/40"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400" />
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          idx % 4 === 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : idx % 4 === 1
                              ? 'bg-amber-100 text-amber-700'
                              : idx % 4 === 2
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <IoChevronForward className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-slate-950" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-950">{cat.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-500">{cat.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="py-16"
        >
          <motion.div variants={fadeUp} className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="text-left">
              <span className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">{t('featured')}</span>
              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">{t('featuredTitle')}</h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600">
                {t('featuredText')}
              </p>
            </div>
            <Link
              to="/properties"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-600"
            >
              {t('viewAll')}
              <IoChevronForward className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {loading ? (
            <Loading />
          ) : featured.length === 0 ? (
            <motion.div variants={fadeUp} className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <IoHome className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-black text-slate-950">{t('noFeatured')}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">{t('newListingsSoon')}</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((prop) => (
                <motion.div key={prop._id} variants={fadeUp}>
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-5 py-16 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <motion.div variants={fadeUp} className="rounded-[2rem] bg-slate-950 p-8 text-left text-white sm:p-10">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">{t('whyUs')}</span>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">{t('whyUs')}</h2>
            <p className="mt-5 text-sm font-medium leading-7 text-slate-300">
              {t('whyUsText')}
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: IoShieldCheckmark,
                title: t('trustTitle'),
                text: t('trustText'),
                color: 'bg-emerald-100 text-emerald-700',
              },
              {
                icon: IoPricetag,
                title: t('priceTitle'),
                text: t('priceText'),
                color: 'bg-amber-100 text-amber-700',
              },
              {
                icon: IoBed,
                title: t('choiceTitle'),
                text: t('choiceText'),
                color: 'bg-sky-100 text-sky-700',
              },
              {
                icon: IoPeople,
                title: t('supportTitle'),
                text: t('supportText'),
                color: 'bg-rose-100 text-rose-700',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="rounded-[2rem] border border-slate-200 bg-white p-7 text-left shadow-sm"
                >
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#12362d] p-8 text-white sm:p-12"
        >
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: IoHome, value: '500+', label: t('activeHomes') },
              { icon: IoPeople, value: '1000+', label: t('happyClients') },
              { icon: IoBriefcase, value: '24/7', label: t('professionalSupport') },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-amber-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-4xl font-black">{item.value}</div>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-emerald-100">{item.label}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;
