const OpenAI = require('openai');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Property = require('../models/Property');

const MODEL = process.env.OPENAI_MODEL || 'gpt-5.5';

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getPropertyContext = async () => {
  const properties = await Property.find({ isActive: true })
    .populate('category', 'name')
    .sort('-createdAt')
    .limit(12)
    .lean();

  return properties.map((property) => ({
    id: property._id.toString(),
    title: property.title,
    price: property.price,
    currency: property.currency,
    city: property.city,
    district: property.district,
    address: property.address,
    propertyType: property.propertyType,
    status: property.status,
    rooms: property.rooms,
    area: property.area,
    landArea: property.landArea,
    category: property.category?.name || '',
    amenities: property.amenities || [],
    nearbyPlaces: property.nearbyPlaces || [],
    url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/properties/${property._id}`,
  }));
};

const localParseFilters = (query = '') => {
  const lower = query.toLowerCase();
  const parsedFilters = {};

  const districts = ['Yunusobod', 'Mirzo Ulug‘bek', 'Chilonzor', 'Olmazor', 'Olmozor', 'Sergeli', 'Yakkasaroy', 'Shayxontohur'];
  const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Farg‘ona', 'Namangan'];
  const types = ['Ko‘p qavatli dom', 'Uchastka', 'Hovli', 'Villa', 'Yangi qurilgan uy'];

  const district = districts.find((item) => lower.includes(item.toLowerCase().replace('‘', "'")) || lower.includes(item.toLowerCase()));
  const city = cities.find((item) => lower.includes(item.toLowerCase().replace('‘', "'")) || lower.includes(item.toLowerCase()));
  const propertyType = types.find((item) => lower.includes(item.toLowerCase().replace('‘', "'")) || lower.includes(item.toLowerCase()));

  if (district) parsedFilters.district = district;
  if (city) parsedFilters.city = city;
  if (propertyType) parsedFilters.propertyType = propertyType;

  const roomMatch = lower.match(/(\d+)\s*(xona|xonali|room)/);
  if (roomMatch) parsedFilters.rooms = Number(roomMatch[1]);

  const priceMatch = lower.match(/(\d[\d\s,.]*)\s*(usd|\$|dollar)/);
  if (priceMatch) {
    parsedFilters.maxPrice = Number(priceMatch[1].replace(/[^\d]/g, ''));
  }

  if (lower.includes('arzon')) parsedFilters.sort = 'cheapest';
  if (lower.includes('qimmat') || lower.includes('premium')) parsedFilters.sort = 'price_desc';
  if (lower.includes('katta') || lower.includes('keng')) parsedFilters.sort = 'largest';

  return parsedFilters;
};

const fallbackChat = async (message) => {
  const properties = await getPropertyContext();
  const lower = message.toLowerCase();

  if (lower.includes('uy') || lower.includes('kvartira') || lower.includes('uchastka') || lower.includes('hovli')) {
    const lines = properties.slice(0, 4).map((property, index) => (
      `${index + 1}. ${property.title} — ${Number(property.price).toLocaleString('en-US')} ${property.currency}, ${property.city}, ${property.district}. ${property.url}`
    ));

    if (lines.length) {
      return `Hozir bazada ko‘rinayotgan e‘lonlardan moslari:\n\n${lines.join('\n')}\n\nAniqroq topish uchun masalan: "Toshkent Chilonzorda 3 xonali 80000 USD gacha uy kerak" deb yozing.`;
    }
  }

  return [
    'Men House Finder AI yordamchisiman.',
    '',
    'Hozir OpenAI javobi mavjud emasligi uchun oddiy rejimda javob beryapman.',
    'OpenAI billing/quota sozlangandan keyin men savolingizni tushunib, bazadagi uylarga qarab aniq tavsiya bera olaman.',
  ].join('\n');
};

const isOpenAIQuotaError = (error) =>
  error?.status === 429 || error?.code === 'insufficient_quota' || error?.type === 'insufficient_quota';

// @desc    Evaluate property price via AI
// @route   POST /api/ai/evaluate-price
// @access  Private
exports.evaluatePrice = asyncHandler(async (req, res) => {
  const { price, rooms, area, district, propertyType } = req.body;
  const averagePricePerSqm = 800;
  const estimatedPrice = Number(area || 0) * averagePricePerSqm;
  let evaluation = 'Bozor narxida';

  if (price < estimatedPrice * 0.8) evaluation = 'Bozor narxidan arzon';
  if (price > estimatedPrice * 1.2) evaluation = 'Bozor narxidan qimmat';

  const client = getOpenAIClient();
  if (!client) {
    return res.status(200).json({
      success: true,
      data: {
        evaluation,
        estimatedPrice,
        message: `AI key sozlanmagan. Oddiy hisob-kitob bo‘yicha bu uy: ${evaluation.toLowerCase()}.`,
        aiEnabled: false,
      },
    });
  }

  let aiMessage = '';
  let aiEnabled = true;

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: 'Siz O‘zbekiston ko‘chmas mulk bozorini tushunadigan maslahatchisiz. Javobni o‘zbek tilida, qisqa va amaliy yozing.',
      input: `Uy narxini baholang: price=${price}, rooms=${rooms}, area=${area}, district=${district}, propertyType=${propertyType}. Oddiy taxminiy narx=${estimatedPrice} USD.`,
    });
    aiMessage = response.output_text;
  } catch (error) {
    console.warn('OpenAI price evaluation failed:', error.code || error.message);
    aiEnabled = false;
    aiMessage = isOpenAIQuotaError(error)
      ? `OpenAI quota/billing limiti sabab AI javob bermadi. Oddiy hisob-kitob bo‘yicha bu uy: ${evaluation.toLowerCase()}.`
      : `AI javobida xatolik bo‘ldi. Oddiy hisob-kitob bo‘yicha bu uy: ${evaluation.toLowerCase()}.`;
  }

  res.status(200).json({
    success: true,
    data: {
      evaluation,
      estimatedPrice,
      message: aiMessage,
      aiEnabled,
    },
  });
});

// @desc    Recommend properties via text (NLP search)
// @route   POST /api/ai/recommend
// @access  Public
exports.recommendProperties = asyncHandler(async (req, res, next) => {
  const { query } = req.body;
  if (!query) return next(new ErrorResponse('Iltimos, nima izlayotganingizni yozing', 400));

  const client = getOpenAIClient();
  let parsedFilters = localParseFilters(query);
  let explanation = 'AI key sozlanmagan. So‘rov oddiy parser orqali tushunildi.';

  if (client) {
    try {
      const response = await client.responses.create({
        model: MODEL,
        instructions: [
          'Userning ko‘chmas mulk qidiruv so‘rovini JSON filterga aylantiring.',
          'Faqat JSON qaytaring. Maydonlar: search, propertyType, rooms, minPrice, maxPrice, city, district, minArea, maxArea, sort.',
          'propertyType faqat: Ko‘p qavatli dom, Uchastka, Hovli, Villa, Yangi qurilgan uy.',
          'sort faqat: newest, cheapest, price_desc, largest.',
        ].join(' '),
        input: query,
      });
      parsedFilters = JSON.parse(response.output_text.replace(/```json|```/g, '').trim());
      explanation = 'AI so‘rovingizni tushundi, mos e‘lonlar qidirilmoqda.';
    } catch (error) {
      console.warn('OpenAI recommend failed:', error.code || error.message);
      explanation = isOpenAIQuotaError(error)
        ? 'OpenAI quota/billing limiti sabab oddiy parser ishlatildi.'
        : 'AI javobini filterga aylantirishda muammo bo‘ldi, oddiy qidiruv ishlatildi.';
    }
  }

  Object.keys(parsedFilters).forEach((key) => {
    if (parsedFilters[key] === undefined || parsedFilters[key] === null || parsedFilters[key] === '') {
      delete parsedFilters[key];
    }
  });

  res.status(200).json({
    success: true,
    data: {
      parsedFilters,
      message: explanation,
      aiEnabled: Boolean(client) && !explanation.includes('oddiy'),
    },
  });
});

// @desc    Chat with AI for real estate advice
// @route   POST /api/ai/chat
// @access  Public
exports.chatWithAi = asyncHandler(async (req, res, next) => {
  const { message, history = [] } = req.body;
  if (!message) return next(new ErrorResponse('Xabar kiritilmagan', 400));

  const client = getOpenAIClient();
  if (!client) {
    const reply = await fallbackChat(message);
    return res.status(200).json({ success: true, data: { reply, aiEnabled: false } });
  }

  const properties = await getPropertyContext();
  const safeHistory = Array.isArray(history) ? history.slice(-8) : [];

  let reply = '';
  let aiEnabled = true;

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: [
        'Siz House Finder saytining AI yordamchisisiz.',
        'O‘zbek tilida, samimiy va aniq javob bering.',
        'Faqat berilgan property contextdagi uylarga tayangan holda aniq e‘lon tavsiya qiling.',
        'Agar mos uy bo‘lmasa, qanday filter bilan qidirishni ayting.',
        'Huquqiy yoki moliyaviy maslahatda ehtiyotkorlik bilan, tekshirish kerakligini eslatib o‘ting.',
        `Hozirgi uylar JSON context:\n${JSON.stringify(properties, null, 2)}`,
      ].join('\n'),
      input: [
        ...safeHistory.map((item) => ({
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: String(item.text || '').slice(0, 1000),
        })),
        { role: 'user', content: message },
      ],
    });
    reply = response.output_text;
  } catch (error) {
    console.warn('OpenAI chat failed:', error.code || error.message);
    aiEnabled = false;
    reply = await fallbackChat(message);
    if (isOpenAIQuotaError(error)) {
      reply = `OpenAI quota/billing limiti sabab hozir fallback rejim ishlayapti.\n\n${reply}`;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      reply,
      aiEnabled,
    },
  });
});
