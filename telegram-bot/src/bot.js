const TelegramBot = require('node-telegram-bot-api');
const env = require('./config/env');
const { listProperties, getProperty } = require('./services/property.service');
const { createTelegramRequest } = require('./services/request.service');
const { googleMapsLink, distanceKm } = require('./services/map.service');
const TelegramUser = require('./models/TelegramUser');
const Favorite = require('./models/Favorite');
const escapeHtml = require('./utils/escapeHtml');
const formatPrice = require('./utils/formatPrice');

const sessions = new Map();

const PROPERTY_TYPE_OPTIONS = [
  { label: 'Kop qavatli dom', value: 'Ko\u2018p qavatli dom' },
  { label: 'Uchastka', value: 'Uchastka' },
  { label: 'Hovli', value: 'Hovli' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Yangi qurilgan uy', value: 'Yangi qurilgan uy' },
];
const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Fargona', 'Namangan'];

const mainKeyboard = {
  keyboard: [
    ['Uylarni korish', 'Uy qidirish'],
    ['Narx boyicha', 'Uy turi'],
    ['Manzil boyicha', 'Sevimlilar'],
    ['Boglanish', 'Yordam'],
  ],
  resize_keyboard: true,
};

const searchKeyboard = {
  inline_keyboard: [
    [{ text: 'Barcha uylar', callback_data: 'properties:page:1' }],
    [{ text: 'Narx boyicha', callback_data: 'search:price' }],
    [{ text: 'Uy turi', callback_data: 'search:type' }],
    [{ text: 'Shahar boyicha', callback_data: 'search:city' }],
    [{ text: 'Lokatsiya yuborish', callback_data: 'search:location' }],
  ],
};

const isTelegramFetchableImage = (url = '') =>
  /^https?:\/\//i.test(url) && !url.includes('localhost') && !url.includes('127.0.0.1');

const upsertTelegramUser = async (from = {}, contact = null) => {
  if (!from.id) return null;
  const update = {
    telegramId: String(from.id),
    firstName: from.first_name || '',
    lastName: from.last_name || '',
    username: from.username || '',
  };
  if (contact?.phone_number) update.phone = contact.phone_number;
  return TelegramUser.findOneAndUpdate({ telegramId: String(from.id) }, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
};

const sendHtml = (bot, chatId, text, options = {}) =>
  bot.sendMessage(chatId, text, { parse_mode: 'HTML', disable_web_page_preview: true, ...options });

const propertyUrl = (property) => `${env.clientUrl.replace(/\/$/, '')}/properties/${property._id}`;

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/'/g, '')
    .trim();

const propertyTypeFromText = (text = '') => {
  const normalized = normalizeText(text);
  const option = PROPERTY_TYPE_OPTIONS.find(
    (type) => normalizeText(type.label) === normalized || normalizeText(type.value) === normalized
  );
  return option?.value || text.trim();
};

const cardText = (property, extra = '') => {
  const place = [property.city, property.district].filter(Boolean).join(', ') || 'Kiritilmagan';
  const floor = property.totalFloors ? `${property.floor || 0}/${property.totalFloors}` : 'Kiritilmagan';
  return [
    `<b>${escapeHtml(property.title || 'Nomsiz elon')}</b>`,
    '',
    `<b>Narx:</b> ${escapeHtml(formatPrice(property.price, property.currency))}`,
    `<b>Manzil:</b> ${escapeHtml(place)}`,
    `<b>Turi:</b> ${escapeHtml(property.propertyType || 'Kiritilmagan')}`,
    `<b>Xonalar:</b> ${property.rooms || 'Kiritilmagan'}`,
    `<b>Maydon:</b> ${property.area ? `${property.area} m2` : 'Kiritilmagan'}`,
    property.landArea ? `<b>Yer:</b> ${property.landArea} sotix` : null,
    `<b>Qavat:</b> ${escapeHtml(floor)}`,
    `<b>Status:</b> ${escapeHtml(property.status || 'Aktiv')}`,
    extra ? `\n${escapeHtml(extra)}` : null,
  ]
    .filter(Boolean)
    .join('\n');
};

const detailText = (property) => {
  const category = typeof property.category === 'object' ? property.category?.name : '';
  const lines = [
    `<b>${escapeHtml(property.title || 'Nomsiz elon')}</b>`,
    escapeHtml(property.status || 'Aktiv'),
    '',
    `<b>Narx:</b> ${escapeHtml(formatPrice(property.price, property.currency))}`,
    `<b>Shahar:</b> ${escapeHtml(property.city || 'Kiritilmagan')}`,
    `<b>Tuman:</b> ${escapeHtml(property.district || 'Kiritilmagan')}`,
    `<b>Toliq manzil:</b> ${escapeHtml(property.address || 'Kiritilmagan')}`,
    '',
    `<b>Turi:</b> ${escapeHtml(property.propertyType || 'Kiritilmagan')}`,
    `<b>Kategoriya:</b> ${escapeHtml(category || 'Kiritilmagan')}`,
    `<b>Xonalar:</b> ${property.rooms || 'Kiritilmagan'}`,
    `<b>Maydon:</b> ${property.area ? `${property.area} m2` : 'Kiritilmagan'}`,
  ];

  if (property.floor || property.totalFloors) {
    lines.push(`<b>Qavat:</b> ${property.totalFloors ? `${property.floor || 0}/${property.totalFloors}` : property.floor}`);
  }
  if (property.landArea) lines.push(`<b>Yer:</b> ${property.landArea} sotix`);
  if (property.buildingYear) lines.push(`<b>Qurilgan yili:</b> ${property.buildingYear}`);
  if (property.description) {
    lines.push('', '<b>Tavsif:</b>');
    lines.push(escapeHtml(property.description).slice(0, 2500));
  }
  if (property.views !== undefined) lines.push('', `<b>Korishlar:</b> ${property.views}`);

  return lines.join('\n');
};

const propertyButtons = (property, page = 1) => ({
  inline_keyboard: [
    [
      { text: 'Batafsil', callback_data: `property:detail:${property._id}:${page}` },
      { text: 'Sevimli', callback_data: `favorite:toggle:${property._id}` },
    ],
    [
      { text: 'Xarita', callback_data: `property:map:${property._id}` },
      { text: 'Ariza qoldirish', callback_data: `request:start:${property._id}` },
    ],
    [{ text: 'Saytda korish', url: propertyUrl(property) }],
  ],
});

const detailButtons = (property, page = 1) => ({
  inline_keyboard: [
    [
      { text: 'Xarita', callback_data: `property:map:${property._id}` },
      { text: 'Sevimli', callback_data: `favorite:toggle:${property._id}` },
    ],
    [{ text: 'Ariza qoldirish', callback_data: `request:start:${property._id}` }],
    [{ text: 'Orqaga', callback_data: `properties:page:${page}` }],
  ],
});

const sendPropertyCard = async (bot, chatId, property, page = 1, extra = '') => {
  const image = property.images?.[0];
  const text = cardText(property, extra);
  if (isTelegramFetchableImage(image)) {
    try {
      await bot.sendPhoto(chatId, image, {
        caption: text,
        parse_mode: 'HTML',
        reply_markup: propertyButtons(property, page),
      });
      return;
    } catch (error) {
      console.warn('Photo send failed, using text fallback:', error.message);
    }
  }
  await sendHtml(bot, chatId, text, { reply_markup: propertyButtons(property, page) });
};

const showProperties = async (bot, chatId, filters = {}) => {
  const page = Number(filters.page || 1);
  const loading = await bot.sendMessage(chatId, 'Malumotlar yuklanmoqda...');
  const response = await listProperties({ ...filters, page, limit: 5 });
  const properties = response.data || [];

  await bot.deleteMessage(chatId, loading.message_id).catch(() => {});

  if (!properties.length) {
    await bot.sendMessage(chatId, 'Bu filterlarga mos uy topilmadi.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Filterni ozgartirish', callback_data: 'search:start' }],
          [{ text: 'Barcha uylar', callback_data: 'properties:page:1' }],
          [{ text: 'Asosiy menyu', callback_data: 'menu:main' }],
        ],
      },
    });
    return;
  }

  const total = response.pagination?.total || properties.length;
  const totalPages = response.pagination?.totalPages || page;
  const paginationButtons = [];
  if (page > 1) paginationButtons.push({ text: 'Oldingi', callback_data: `properties:page:${page - 1}` });
  if (page < totalPages) paginationButtons.push({ text: 'Keyingi', callback_data: `properties:page:${page + 1}` });

  await bot.sendMessage(chatId, `Topildi: ${total} ta elon. Sahifa: ${page}/${totalPages}`);
  for (const property of properties) {
    const extra = typeof filters.distanceFrom === 'function'
      ? `Sizdan taxminan ${filters.distanceFrom(property).toFixed(1)} km uzoqlikda`
      : '';
    await sendPropertyCard(bot, chatId, property, page, extra);
  }
  if (paginationButtons.length) {
    await bot.sendMessage(chatId, 'Sahifalar:', { reply_markup: { inline_keyboard: [paginationButtons] } });
  }
};

const showPropertyDetail = async (bot, chatId, id, page = 1) => {
  const property = await getProperty(id);
  await sendHtml(bot, chatId, detailText(property), { reply_markup: detailButtons(property, page) });
};

const showMap = async (bot, chatId, id) => {
  const property = await getProperty(id);
  if (!property.latitude || !property.longitude) {
    await bot.sendMessage(chatId, 'Bu uy uchun xarita malumoti kiritilmagan.');
    return;
  }
  await bot.sendLocation(chatId, Number(property.latitude), Number(property.longitude));
  await bot.sendMessage(chatId, googleMapsLink(property.latitude, property.longitude));
};

const toggleFavorite = async (bot, chatId, telegramId, propertyId) => {
  const query = { telegramId: String(telegramId), propertyId };
  const existing = await Favorite.findOne(query);
  if (existing) {
    await existing.deleteOne();
    await bot.sendMessage(chatId, 'Sevimlilardan olib tashlandi.');
    return;
  }
  await Favorite.create(query);
  await bot.sendMessage(chatId, 'Sevimlilarga qoshildi.');
};

const showFavorites = async (bot, chatId, telegramId) => {
  const favorites = await Favorite.find({ telegramId: String(telegramId) })
    .sort('-createdAt')
    .limit(10)
    .populate('propertyId');

  const properties = favorites.map((item) => item.propertyId).filter(Boolean);
  if (!properties.length) {
    await bot.sendMessage(chatId, 'Hozircha sevimli uylar yoq.');
    return;
  }

  await bot.sendMessage(chatId, `Sevimlilar: ${properties.length} ta`);
  for (const property of properties) {
    await sendPropertyCard(bot, chatId, property, 1);
  }
};

const startRequest = async (bot, chatId, telegramId, propertyId) => {
  sessions.set(String(telegramId), { type: 'request:name', propertyId, data: {} });
  await bot.sendMessage(chatId, 'Ismingizni yuboring:', {
    reply_markup: { keyboard: [['Bekor qilish']], resize_keyboard: true },
  });
};

const handleRequestText = async (bot, msg, session) => {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);
  const text = (msg.text || '').trim();

  if (text === 'Bekor qilish') {
    sessions.delete(telegramId);
    await bot.sendMessage(chatId, 'Bekor qilindi.', { reply_markup: mainKeyboard });
    return true;
  }

  if (session.type === 'request:name') {
    session.data.name = text;
    session.type = 'request:phone';
    sessions.set(telegramId, session);
    await bot.sendMessage(chatId, 'Telefon raqamingizni yuboring:', {
      reply_markup: {
        keyboard: [[{ text: 'Telefon raqamni yuborish', request_contact: true }], ['Bekor qilish']],
        resize_keyboard: true,
      },
    });
    return true;
  }

  if (session.type === 'request:phone') {
    session.data.phone = msg.contact?.phone_number || text;
    session.type = 'request:message';
    sessions.set(telegramId, session);
    await bot.sendMessage(chatId, 'Qoshimcha izoh yozing yoki "Yuborish" tugmasini bosing:', {
      reply_markup: { keyboard: [['Yuborish'], ['Bekor qilish']], resize_keyboard: true },
    });
    return true;
  }

  if (session.type === 'request:message') {
    const message = text === 'Yuborish' ? '' : text;
    await createTelegramRequest({
      propertyId: session.propertyId,
      name: session.data.name,
      phone: session.data.phone,
      message,
      telegramId,
      telegramUsername: msg.from.username || '',
    });
    sessions.delete(telegramId);
    await bot.sendMessage(chatId, 'Arizangiz qabul qilindi. Tez orada boglanamiz.', { reply_markup: mainKeyboard });
    return true;
  }

  return false;
};

const handleSearchText = async (bot, msg, session) => {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);
  const text = (msg.text || '').trim();

  if (text === 'Bekor qilish') {
    sessions.delete(telegramId);
    await bot.sendMessage(chatId, 'Qidiruv bekor qilindi.', { reply_markup: mainKeyboard });
    return true;
  }

  if (session.type === 'search:price') {
    const numbers = text.match(/\d+/g)?.map(Number) || [];
    const filters = {};
    if (numbers[0]) filters.minPrice = numbers[0];
    if (numbers[1]) filters.maxPrice = numbers[1];
    sessions.delete(telegramId);
    await showProperties(bot, chatId, filters);
    return true;
  }

  if (session.type === 'search:type') {
    sessions.delete(telegramId);
    await showProperties(bot, chatId, { propertyType: propertyTypeFromText(text) });
    return true;
  }

  if (session.type === 'search:city') {
    sessions.delete(telegramId);
    await showProperties(bot, chatId, { city: text });
    return true;
  }

  return false;
};

const showHelp = (bot, chatId) =>
  bot.sendMessage(
    chatId,
    [
      'Buyruqlar:',
      '/start - botni boshlash',
      '/properties - uylarni korish',
      '/search - qidirish',
      '/favorites - sevimlilar',
      '/contact - boglanish',
      '/help - yordam',
    ].join('\n'),
    { reply_markup: mainKeyboard }
  );

const createBot = () => {
  if (!env.botToken) {
    throw new Error('BOT_TOKEN is required. Create telegram-bot/.env and add your BotFather token.');
  }

  const bot = new TelegramBot(env.botToken, { polling: true });

  bot.on('message', async (msg) => {
    try {
      await upsertTelegramUser(msg.from, msg.contact);

      if (msg.contact) {
        const session = sessions.get(String(msg.from.id));
        if (session) {
          await handleRequestText(bot, msg, session);
          return;
        }
      }

      if (msg.location) {
        const lat = msg.location.latitude;
        const lng = msg.location.longitude;
        const response = await listProperties({ page: 1, limit: 30 });
        const withDistance = (response.data || [])
          .filter((property) => property.latitude && property.longitude)
          .map((property) => ({
            ...property,
            distance: distanceKm(lat, lng, property.latitude, property.longitude),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        if (!withDistance.length) {
          await bot.sendMessage(msg.chat.id, 'Yaqin uylar topilmadi.');
          return;
        }

        await bot.sendMessage(msg.chat.id, 'Sizga eng yaqin uylar:');
        for (const property of withDistance) {
          await sendPropertyCard(bot, msg.chat.id, property, 1, `Sizdan taxminan ${property.distance.toFixed(1)} km`);
        }
        return;
      }

      const text = (msg.text || '').trim();
      if (!text) return;

      const session = sessions.get(String(msg.from.id));
      if (session) {
        const handledRequest = await handleRequestText(bot, msg, session);
        if (handledRequest) return;
        const handledSearch = await handleSearchText(bot, msg, session);
        if (handledSearch) return;
      }

      if (text === '/start' || text === 'Asosiy menyu') {
        await bot.sendMessage(
          msg.chat.id,
          `Assalomu alaykum, ${msg.from.first_name || 'xush kelibsiz'}! Uylarni korish yoki qidirish uchun menyudan foydalaning.`,
          { reply_markup: mainKeyboard }
        );
        return;
      }

      if (text === '/properties' || text === 'Uylarni korish') {
        await showProperties(bot, msg.chat.id, { page: 1 });
        return;
      }

      if (text === '/search' || text === 'Uy qidirish') {
        await bot.sendMessage(msg.chat.id, 'Qidiruv turini tanlang:', { reply_markup: searchKeyboard });
        return;
      }

      if (text === 'Narx boyicha') {
        sessions.set(String(msg.from.id), { type: 'search:price' });
        await bot.sendMessage(msg.chat.id, 'Narx oraligini yozing. Masalan: 50000 90000', {
          reply_markup: { keyboard: [['Bekor qilish']], resize_keyboard: true },
        });
        return;
      }

      if (text === 'Uy turi') {
        sessions.set(String(msg.from.id), { type: 'search:type' });
        await bot.sendMessage(msg.chat.id, 'Uy turini tanlang yoki yozing:', {
          reply_markup: {
            keyboard: PROPERTY_TYPE_OPTIONS.map((type) => [type.label]).concat([['Bekor qilish']]),
            resize_keyboard: true,
          },
        });
        return;
      }

      if (text === 'Manzil boyicha') {
        sessions.set(String(msg.from.id), { type: 'search:city' });
        await bot.sendMessage(msg.chat.id, 'Shaharni tanlang yoki yozing:', {
          reply_markup: { keyboard: CITIES.map((city) => [city]).concat([['Bekor qilish']]), resize_keyboard: true },
        });
        return;
      }

      if (text === '/favorites' || text === 'Sevimlilar') {
        await showFavorites(bot, msg.chat.id, msg.from.id);
        return;
      }

      if (text === '/contact' || text === 'Boglanish') {
        await bot.sendMessage(msg.chat.id, 'Savollar uchun sayt admini bilan boglaning yoki uy kartasidan "Ariza qoldirish" tugmasini bosing.', {
          reply_markup: mainKeyboard,
        });
        return;
      }

      if (text === '/help' || text === 'Yordam') {
        await showHelp(bot, msg.chat.id);
        return;
      }

      await bot.sendMessage(msg.chat.id, 'Tushunmadim. Menyudan tanlang yoki /help buyrugini bosing.', {
        reply_markup: mainKeyboard,
      });
    } catch (error) {
      console.error('Message handler failed:', error);
      await bot.sendMessage(msg.chat.id, 'Xatolik yuz berdi. Iltimos, keyinroq qayta urinib koring.').catch(() => {});
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const telegramId = query.from.id;
    const data = query.data || '';

    try {
      await upsertTelegramUser(query.from);
      await bot.answerCallbackQuery(query.id).catch(() => {});

      if (data === 'menu:main') {
        sessions.delete(String(telegramId));
        await bot.sendMessage(chatId, 'Asosiy menyu', { reply_markup: mainKeyboard });
        return;
      }

      if (data === 'search:start') {
        await bot.sendMessage(chatId, 'Qidiruv turini tanlang:', { reply_markup: searchKeyboard });
        return;
      }

      if (data === 'search:price') {
        sessions.set(String(telegramId), { type: 'search:price' });
        await bot.sendMessage(chatId, 'Narx oraligini yozing. Masalan: 50000 90000');
        return;
      }

      if (data === 'search:type') {
        sessions.set(String(telegramId), { type: 'search:type' });
        await bot.sendMessage(chatId, 'Uy turini yozing. Masalan: Hovli');
        return;
      }

      if (data === 'search:city') {
        sessions.set(String(telegramId), { type: 'search:city' });
        await bot.sendMessage(chatId, 'Shahar nomini yozing. Masalan: Toshkent');
        return;
      }

      if (data === 'search:location') {
        await bot.sendMessage(chatId, 'Lokatsiyangizni yuboring:', {
          reply_markup: {
            keyboard: [[{ text: 'Lokatsiya yuborish', request_location: true }], ['Bekor qilish']],
            resize_keyboard: true,
          },
        });
        return;
      }

      const pageMatch = data.match(/^properties:page:(\d+)$/);
      if (pageMatch) {
        await showProperties(bot, chatId, { page: Number(pageMatch[1]) });
        return;
      }

      const detailMatch = data.match(/^property:detail:([^:]+):(\d+)$/);
      if (detailMatch) {
        await showPropertyDetail(bot, chatId, detailMatch[1], Number(detailMatch[2]));
        return;
      }

      const mapMatch = data.match(/^property:map:([^:]+)$/);
      if (mapMatch) {
        await showMap(bot, chatId, mapMatch[1]);
        return;
      }

      const favoriteMatch = data.match(/^favorite:toggle:([^:]+)$/);
      if (favoriteMatch) {
        await toggleFavorite(bot, chatId, telegramId, favoriteMatch[1]);
        return;
      }

      const requestMatch = data.match(/^request:start:([^:]+)$/);
      if (requestMatch) {
        await startRequest(bot, chatId, telegramId, requestMatch[1]);
      }
    } catch (error) {
      console.error('Callback handler failed:', error);
      await bot.sendMessage(chatId, 'Xatolik yuz berdi. Iltimos, keyinroq qayta urinib koring.').catch(() => {});
    }
  });

  bot.on('polling_error', (error) => {
    console.error('Telegram polling error:', error.message);
  });

  return bot;
};

module.exports = { createBot };
