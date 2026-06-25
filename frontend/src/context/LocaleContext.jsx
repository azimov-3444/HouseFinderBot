import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrencyRates } from '../services/currencyService';
import formatPriceUtil, { FALLBACK_RATES } from '../utils/formatPrice';

const LocaleContext = createContext(null);

export const LANGUAGES = [
  { code: 'uz', label: "O'zbek" },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

export const CURRENCIES = [
  { code: 'USD', label: 'USD' },
  { code: 'UZS', label: 'UZS' },
  { code: 'RUB', label: 'RUB' },
];

const locales = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
};

const dictionary = {
  navHome: { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  navListings: { uz: "E'lonlar", ru: 'Объявления', en: 'Listings' },
  navAdd: { uz: "E'lon joylash", ru: 'Разместить', en: 'Add listing' },
  adminPanel: { uz: 'Admin Panel', ru: 'Админ-панель', en: 'Admin Panel' },
  login: { uz: 'Kirish', ru: 'Войти', en: 'Login' },
  logout: { uz: 'Tizimdan chiqish', ru: 'Выйти', en: 'Logout' },
  client: { uz: 'Mijoz', ru: 'Клиент', en: 'Client' },
  heroBadge: { uz: "O'zbekistondagi qulay ko'chmas mulk qidiruvi", ru: 'Удобный поиск недвижимости в Узбекистане', en: 'Simple real estate search in Uzbekistan' },
  heroBefore: { uz: 'Orzuingizdagi', ru: 'Найдите дом', en: 'Find Your' },
  heroAccent: { uz: 'Uyni', ru: 'мечты', en: 'Dream Home' },
  heroAfter: { uz: 'Oson Toping', ru: 'легко', en: 'Easily' },
  heroText: { uz: "Biz sizga orzuingizdagi xonadon, uchastka yoki premium villani qulay va ishonchli narxlarda topishga ko'maklashamiz.", ru: 'Мы поможем найти квартиру, участок или премиальную виллу по удобной и надежной цене.', en: 'We help you find apartments, land plots, and premium villas at clear and reliable prices.' },
  normalSearch: { uz: 'Oddiy Qidiruv', ru: 'Обычный поиск', en: 'Standard Search' },
  aiSearch: { uz: 'AI Qidiruv', ru: 'AI поиск', en: 'AI Search' },
  aiPlaceholder: { uz: "Masalan: Yunusobodda 3 xonali 700$ gacha remontli uy kerak...", ru: 'Например: нужна 3-комнатная квартира в Юнусабаде до 700$ с ремонтом...', en: 'Example: I need a renovated 3-room home in Yunusabad under $700...' },
  analyzing: { uz: 'Tahlil qilinmoqda...', ru: 'Анализируем...', en: 'Analyzing...' },
  aiSubmit: { uz: 'AI Qidirish', ru: 'Искать с AI', en: 'AI Search' },
  locationSearch: { uz: 'Joylashuv / Qidiruv', ru: 'Локация / поиск', en: 'Location / Search' },
  locationPlaceholder: { uz: 'Shahar, tuman, manzil...', ru: 'Город, район, адрес...', en: 'City, district, address...' },
  propertyType: { uz: 'Mulk Turi', ru: 'Тип недвижимости', en: 'Property Type' },
  roomsCount: { uz: 'Xonalar soni', ru: 'Количество комнат', en: 'Rooms' },
  priceRangeUsd: { uz: "Narx oralig'i (USD)", ru: 'Диапазон цены (USD)', en: 'Price range (USD)' },
  all: { uz: 'Barchasi', ru: 'Все', en: 'All' },
  any: { uz: "Farqi yo'q", ru: 'Не важно', en: 'Any' },
  search: { uz: 'Qidirish', ru: 'Искать', en: 'Search' },
  categoriesTitle: { uz: "Kategoriyalar bo'yicha saralash", ru: 'Поиск по категориям', en: 'Browse by Categories' },
  categoriesText: { uz: "Mulk turiga yoki qulayligiga qarab o'zingizga yoqadigan toifani tanlang", ru: 'Выберите категорию по типу недвижимости или удобствам', en: 'Choose the category that fits your preferred property type or convenience' },
  featuredTitle: { uz: "Tavsiya etilgan eng so'nggi uylar", ru: 'Свежие рекомендуемые дома', en: 'Latest Featured Homes' },
  featuredText: { uz: "Ekspertlarimiz tomonidan tanlab olingan eng ishonchli va premium e'lonlar", ru: 'Надежные и премиальные объявления, отобранные нашими экспертами', en: 'Trusted and premium listings selected by our experts' },
  viewAll: { uz: "Barchasini ko'rish", ru: 'Смотреть все', en: 'View all' },
  noFeatured: { uz: "Tavsiya etilgan e'lonlar mavjud emas", ru: 'Рекомендуемых объявлений пока нет', en: 'No featured listings yet' },
  newListingsSoon: { uz: "Yangi e'lonlar tez orada qo'shiladi.", ru: 'Новые объявления скоро появятся.', en: 'New listings will be added soon.' },
  whyUs: { uz: 'Nega aynan biz?', ru: 'Почему мы?', en: 'Why Choose Us?' },
  whyUsText: { uz: 'Biz mijozlarimizga qulay, shaffof va xavfsiz xizmatlarni taqdim etamiz.', ru: 'Мы предоставляем удобный, прозрачный и безопасный сервис.', en: 'We provide a convenient, transparent, and secure service.' },
  trustTitle: { uz: '100% Ishonchlilik', ru: '100% надежность', en: '100% Trusted' },
  trustText: { uz: "Tizimdagi barcha e'lonlar admin tekshiruvidan o'tadi, shubhali uylar bloklanadi.", ru: 'Все объявления проходят проверку администратора, подозрительные объекты блокируются.', en: 'All listings are checked by admins, and suspicious properties are blocked.' },
  priceTitle: { uz: 'Hamyonbop Narxlar', ru: 'Доступные цены', en: 'Affordable Prices' },
  priceText: { uz: "Komissiya to'lovlarisiz to'g'ridan-to'g'ri bog'lanish va kelishish imkoni.", ru: 'Связывайтесь напрямую и договаривайтесь без лишних комиссий.', en: 'Connect and negotiate directly without extra commission fees.' },
  choiceTitle: { uz: 'Keng Tanlov', ru: 'Большой выбор', en: 'Wide Selection' },
  choiceText: { uz: 'Premium villalardan tortib, arzon shinam kvartiralargacha.', ru: 'От премиальных вилл до уютных бюджетных квартир.', en: 'From premium villas to cozy budget apartments.' },
  supportTitle: { uz: '24/7 Professional Yordam', ru: 'Профессиональная помощь 24/7', en: '24/7 Professional Support' },
  supportText: { uz: 'Maslahatchilarimiz sizga istalgan vaqtda yordam berishga tayyor.', ru: 'Наши консультанты готовы помочь вам в любое время.', en: 'Our consultants are ready to help you anytime.' },
  activeHomes: { uz: 'Sotuvdagi faol uylar', ru: 'Активные дома в продаже', en: 'Active Homes for Sale' },
  happyClients: { uz: 'Mamnun mijozlar', ru: 'Довольные клиенты', en: 'Happy Clients' },
  professionalSupport: { uz: "Professional qo'llab-quvvatlash", ru: 'Профессиональная поддержка', en: 'Professional Support' },
  filters: { uz: 'Filtrlar', ru: 'Фильтры', en: 'Filters' },
  clear: { uz: 'Tozalash', ru: 'Очистить', en: 'Clear' },
  sort: { uz: 'Tartiblash', ru: 'Сортировка', en: 'Sort' },
  newest: { uz: 'Eng yangilari', ru: 'Сначала новые', en: 'Newest' },
  cheapest: { uz: 'Eng arzonlari', ru: 'Сначала дешевые', en: 'Cheapest' },
  expensive: { uz: 'Eng qimmatlari', ru: 'Сначала дорогие', en: 'Most expensive' },
  largest: { uz: 'Eng katta maydonlilar', ru: 'Самая большая площадь', en: 'Largest area' },
  categories: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
  city: { uz: 'Shahar / Viloyat', ru: 'Город / область', en: 'City / Region' },
  cityPlaceholder: { uz: 'Masalan: Toshkent', ru: 'Например: Ташкент', en: 'Example: Tashkent' },
  district: { uz: 'Tuman', ru: 'Район', en: 'District' },
  districtPlaceholder: { uz: 'Masalan: Chilonzor', ru: 'Например: Чиланзар', en: 'Example: Chilanzar' },
  min: { uz: 'Kamida', ru: 'От', en: 'Min' },
  max: { uz: "Ko'pi bilan", ru: 'До', en: 'Max' },
  area: { uz: 'Maydoni', ru: 'Площадь', en: 'Area' },
  areaRange: { uz: 'Maydoni (kv.m.)', ru: 'Площадь (кв.м.)', en: 'Area (sq.m.)' },
  floor: { uz: 'Qavat', ru: 'Этаж', en: 'Floor' },
  floorPlaceholder: { uz: 'Istagan qavat...', ru: 'Желаемый этаж...', en: 'Preferred floor...' },
  extraSettings: { uz: "Qo'shimcha sozlamalar", ru: 'Дополнительные настройки', en: 'Extra settings' },
  ownerOnly: { uz: 'Maklersiz (Faqat egasidan)', ru: 'Без риелтора (от собственника)', en: 'No broker (owner only)' },
  verifiedListings: { uz: "Tasdiqlangan e'lonlar", ru: 'Проверенные объявления', en: 'Verified listings' },
  documentChecked: { uz: 'Hujjatlari tekshirilgan', ru: 'Документы проверены', en: 'Documents checked' },
  list: { uz: "Ro'yxat", ru: 'Список', en: 'List' },
  map: { uz: 'Xarita', ru: 'Карта', en: 'Map' },
  totalFound: { uz: 'Jami {{count}} ta uy eʼloni topildi', ru: 'Найдено объявлений: {{count}}', en: '{{count}} listings found' },
  noListings: { uz: "Hech qanday e'lon topilmadi", ru: 'Объявления не найдены', en: 'No listings found' },
  noListingsText: { uz: "Kiritilgan filtr parametrlariga mos uylar topilmadi. Qidiruv parametrlarini o'zgartirib ko'ring.", ru: 'По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска.', en: 'No homes match the selected filters. Try changing your search settings.' },
  searchListingsPlaceholder: { uz: "Nomi, manzili yoki tuman bo'yicha qidirish...", ru: 'Поиск по названию, адресу или району...', en: 'Search by name, address, or district...' },
  totalPrice: { uz: 'Jami narxi:', ru: 'Общая цена:', en: 'Total price:' },
  details: { uz: 'Batafsil', ru: 'Подробнее', en: 'Details' },
  premium: { uz: 'Premium', ru: 'Премиум', en: 'Premium' },
  featured: { uz: 'Tavsiya', ru: 'Рекомендуем', en: 'Featured' },
  affordable: { uz: 'Hamyonbop', ru: 'Доступно', en: 'Affordable' },
  property: { uz: 'Mulk', ru: 'Недвижимость', en: 'Property' },
  roomsUnit: { uz: '{{count}} xona', ru: '{{count}} комн.', en: '{{count}} rooms' },
  floorOf: { uz: '{{floor}}/{{total}} qavat', ru: '{{floor}}/{{total}} этаж', en: 'Floor {{floor}}/{{total}}' },
  floors: { uz: '{{count}} qavatli', ru: '{{count}} этажн.', en: '{{count}} floors' },
  views: { uz: "Ko'rilganlar soni: {{count}} ta", ru: 'Просмотров: {{count}}', en: 'Views: {{count}}' },
  startingPrice: { uz: "Boshlang'ich narxi:", ru: 'Начальная цена:', en: 'Starting price:' },
  copyLink: { uz: 'Nusxa havola', ru: 'Копировать', en: 'Copy link' },
  share: { uz: 'Ulashish', ru: 'Поделиться', en: 'Share' },
  mainSpecs: { uz: "Asosiy ko'rsatkichlar", ru: 'Основные характеристики', en: 'Main Details' },
  rooms: { uz: 'Xonalar', ru: 'Комнаты', en: 'Rooms' },
  landArea: { uz: 'Yer maydoni', ru: 'Площадь участка', en: 'Land area' },
  builtYear: { uz: 'Qurilgan yili', ru: 'Год постройки', en: 'Built year' },
  renovation: { uz: 'Remont holati', ru: 'Состояние ремонта', en: 'Renovation' },
  description: { uz: 'Tavsif', ru: 'Описание', en: 'Description' },
  amenities: { uz: 'Qulayliklar', ru: 'Удобства', en: 'Amenities' },
  communications: { uz: 'Kommunikatsiya liniyalari', ru: 'Коммуникации', en: 'Utilities' },
  nearby: { uz: 'Atrofdagi muhim joylar', ru: 'Важные места рядом', en: 'Nearby Places' },
  mapLocation: { uz: 'Mulkning xaritadagi joylashuvi', ru: 'Расположение на карте', en: 'Property Location' },
  quickContact: { uz: "Tezkor bog'lanish", ru: 'Быстрая связь', en: 'Quick Contact' },
  call: { uz: "Qo'ng'iroq qilish", ru: 'Позвонить', en: 'Call' },
  telegram: { uz: "Telegram orqali bog'lanish", ru: 'Связаться через Telegram', en: 'Contact via Telegram' },
  purchaseRequest: { uz: 'Sotib olish arizasi', ru: 'Заявка на покупку', en: 'Purchase Request' },
  requestText: { uz: "Bizga so'rov yuboring va xodimimiz tezda siz bilan aloqaga chiqadi.", ru: 'Отправьте заявку, и наш сотрудник скоро свяжется с вами.', en: 'Send a request and our team will contact you shortly.' },
  name: { uz: 'Ismingiz', ru: 'Ваше имя', en: 'Your name' },
  phone: { uz: 'Telefon raqamingiz', ru: 'Телефон', en: 'Phone number' },
  emailOptional: { uz: 'Email (ixtiyoriy)', ru: 'Email (необязательно)', en: 'Email (optional)' },
  message: { uz: 'Xabaringiz', ru: 'Сообщение', en: 'Message' },
  submitting: { uz: 'Yuborilmoqda...', ru: 'Отправляется...', en: 'Sending...' },
  sendRequest: { uz: 'Ariza yuborish', ru: 'Отправить заявку', en: 'Send request' },
  similar: { uz: "O'xshash uylar e'lonlari", ru: 'Похожие объявления', en: 'Similar Homes' },
  similarText: { uz: "Siz tanlagan mulk bilan o'xshash joylashuvdagi yoki toifadagi boshqa e'lonlar", ru: 'Другие объявления в похожей локации или категории', en: 'Other listings in a similar location or category' },
  notFound: { uz: 'Mulk topilmadi', ru: 'Объект не найден', en: 'Property not found' },
  backToListings: { uz: "E'lonlar ro'yxatiga qaytish", ru: 'Вернуться к объявлениям', en: 'Back to listings' },
  footerText: { uz: "O'zbekistondagi qulay va shinam ko'chmas mulk qidirish tizimi. Orzuingizdagi uyni biz bilan toping.", ru: 'Удобная система поиска недвижимости в Узбекистане. Найдите дом мечты вместе с нами.', en: 'A convenient real estate search platform in Uzbekistan. Find your dream home with us.' },
  quickLinks: { uz: 'Tezkor havolalar', ru: 'Быстрые ссылки', en: 'Quick Links' },
  allListings: { uz: "Barcha e'lonlar", ru: 'Все объявления', en: 'All listings' },
  copyright: { uz: 'Barcha huquqlar himoyalangan.', ru: 'Все права защищены.', en: 'All rights reserved.' },
};

const valueTranslations = {
  "Ko'p qavatli dom": { uz: "Ko'p qavatli dom", ru: 'Многоэтажный дом', en: 'Apartment building' },
  'Ko‘p qavatli dom': { uz: "Ko'p qavatli dom", ru: 'Многоэтажный дом', en: 'Apartment building' },
  'KoвЂp qavatli dom': { uz: "Ko'p qavatli dom", ru: 'Многоэтажный дом', en: 'Apartment building' },
  Uchastka: { uz: 'Uchastka', ru: 'Участок', en: 'Land plot' },
  Hovli: { uz: 'Hovli', ru: 'Дом с двором', en: 'House' },
  Villa: { uz: 'Villa', ru: 'Вилла', en: 'Villa' },
  'Yangi qurilgan uy': { uz: 'Yangi qurilgan uy', ru: 'Новостройка', en: 'New build' },
  Aktiv: { uz: 'Aktiv', ru: 'Активно', en: 'Active' },
  Sotilgan: { uz: 'Sotilgan', ru: 'Продано', en: 'Sold' },
  'Band qilingan': { uz: 'Band qilingan', ru: 'Забронировано', en: 'Reserved' },
};

export const LocaleProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'uz');
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('currency') || 'USD');
  const [rates, setRates] = useState(FALLBACK_RATES);
  const [exchangeUpdatedAt, setExchangeUpdatedAt] = useState(null);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    let isMounted = true;

    getCurrencyRates()
      .then((res) => {
        if (!isMounted || !res?.success || !res.data?.rates) return;
        setRates({ ...FALLBACK_RATES, ...res.data.rates });
        setExchangeUpdatedAt(res.data.updatedAt || null);
      })
      .catch(() => {
        if (isMounted) setRates(FALLBACK_RATES);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const t = (key, params = {}) => {
    const phrase = dictionary[key]?.[language] || dictionary[key]?.uz || key;
    return Object.entries(params).reduce(
      (text, [param, value]) => text.replaceAll(`{{${param}}}`, value),
      phrase
    );
  };

  const tv = (value) => valueTranslations[value]?.[language] || value;

  const formatPrice = (price, sourceCurrency = 'USD') => formatPriceUtil(price, sourceCurrency, {
    displayCurrency: currency,
    locale: locales[language],
    rates,
  });

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    currency,
    setCurrency: setCurrencyState,
    rates,
    exchangeUpdatedAt,
    t,
    tv,
    formatPrice,
    locale: locales[language],
  }), [language, currency, rates, exchangeUpdatedAt]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return context;
};
