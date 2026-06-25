import React from 'react';
import { Link } from 'react-router-dom';
import { IoCall, IoHome, IoLocation, IoLogoInstagram, IoLogoYoutube, IoMail, IoPaperPlane } from 'react-icons/io5';
import { useLocale } from '../context/LocaleContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 text-white">
                <IoHome className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white">
                House<span className="text-accent-500 font-extrabold">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400">{t('footerText')}</p>
            <div className="flex gap-4 pt-2">
              <a href="https://t.me/housefinder" target="_blank" rel="noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <IoPaperPlane className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/housefinder" target="_blank" rel="noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <IoLogoInstagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/housefinder" target="_blank" rel="noreferrer" className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                <IoLogoYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">{t('navHome')}</Link></li>
              <li><Link to="/properties" className="text-sm text-slate-400 hover:text-white transition-colors">{t('allListings')}</Link></li>
              <li><Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">{t('login')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{t('categories')}</h3>
            <ul className="space-y-2">
              <li><Link to="/properties?category=Arzon+uylar" className="text-sm text-slate-400 hover:text-white transition-colors">Arzon uylar</Link></li>
              <li><Link to="/properties?category=Premium+uylar" className="text-sm text-slate-400 hover:text-white transition-colors">Premium uylar</Link></li>
              <li><Link to="/properties?category=Yangi+qurilgan+uylar" className="text-sm text-slate-400 hover:text-white transition-colors">Yangi uylar</Link></li>
              <li><Link to="/properties?category=Uchastkalar+va+Hovlilar" className="text-sm text-slate-400 hover:text-white transition-colors">Uchastka & Hovlilar</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <IoLocation className="h-5 w-5 text-accent-500 shrink-0" />
              <span>Toshkent shahar, Yunusobod tumani, Amir Temur ko'chasi 15-uy</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <IoCall className="h-5 w-5 text-accent-500 shrink-0" />
              <a href="tel:+998901234567" className="hover:text-white transition-colors">+998 (90) 123-45-67</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <IoMail className="h-5 w-5 text-accent-500 shrink-0" />
              <a href="mailto:info@housefinder.uz" className="hover:text-white transition-colors">info@housefinder.uz</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">&copy; {currentYear} House Finder. {t('copyright')}</p>
          <p className="text-xs text-slate-500">Loyihani professional darajada tayyorladi: Antigravity AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
