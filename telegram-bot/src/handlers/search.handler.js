const { Markup } = require('telegraf');
const SearchHistory = require('../models/SearchHistory');
const { setSession, getSession, mergeSession } = require('../services/session.service');
const { showProperties } = require('./property.handler');
const { propertyTypeKeyboard, roomsKeyboard, priceKeyboard, cityKeyboard, areaKeyboard } = require('../keyboards/search.keyboard');
const { parsePositiveNumber } = require('../utils/validators');

const startSearch = async (ctx) => {
  await setSession(ctx.from.id, 'search:type', {});
  await ctx.reply('Uy turini tanlang:', propertyTypeKeyboard());
};

const startPriceSearch = async (ctx) => {
  await setSession(ctx.from.id, 'price:min', {});
  await ctx.reply('Minimal narxni kiriting:');
};

const askPropertyType = async (ctx) => {
  await setSession(ctx.from.id, 'type:only', {});
  return ctx.reply('Uy turini tanlang:', propertyTypeKeyboard());
};

const askLocation = async (ctx) =>
  ctx.reply(
    'Shahar yoki tumanni tanlang yoki location yuboring:',
    Markup.keyboard([
      ['Toshkent', 'Samarqand', 'Buxoro'],
      ['Andijon', 'Farg‘ona', 'Namangan'],
      [Markup.button.locationRequest('Location yuborish')],
      ['Asosiy menyu'],
    ]).resize()
  );

const handleSearchCallback = async (ctx, parts) => {
  const [, field, ...values] = parts;

  if (field === 'type') {
    const value = values.join(':');
    const session = await getSession(ctx.from.id);
    if (session?.step === 'type:only') {
      await ctx.answerCbQuery();
      return showProperties(ctx, value === 'any' ? { page: 1 } : { propertyType: value, page: 1 });
    }
    await mergeSession(ctx.from.id, value === 'any' ? {} : { propertyType: value }, 'search:rooms');
    await ctx.answerCbQuery();
    return ctx.reply('Xonalar sonini tanlang:', roomsKeyboard());
  }

  if (field === 'rooms') {
    const value = values[0];
    await mergeSession(ctx.from.id, value === 'any' ? {} : { rooms: value }, 'search:price');
    await ctx.answerCbQuery();
    return ctx.reply('Narx oralig‘ini tanlang:', priceKeyboard());
  }

  if (field === 'price') {
    if (values[0] === 'manual') {
      await setSession(ctx.from.id, 'search:manualMin', (await getSession(ctx.from.id))?.data || {});
      await ctx.answerCbQuery();
      return ctx.reply('Minimal narxni kiriting:');
    }
    const patch = values[0] === 'any' ? {} : { minPrice: values[0], maxPrice: values[1] || undefined };
    await mergeSession(ctx.from.id, patch, 'search:city');
    await ctx.answerCbQuery();
    return ctx.reply('Shahar yoki tumanni tanlang:', cityKeyboard());
  }

  if (field === 'city') {
    if (values[0] === 'manual') {
      await setSession(ctx.from.id, 'search:manualCity', (await getSession(ctx.from.id))?.data || {});
      await ctx.answerCbQuery();
      return ctx.reply('Shahar yoki tuman nomini yozing:');
    }
    const patch = values[0] === 'any' ? {} : { city: values.join(':') };
    await mergeSession(ctx.from.id, patch, 'search:area');
    await ctx.answerCbQuery();
    return ctx.reply('Maydon oralig‘ini tanlang:', areaKeyboard());
  }

  if (field === 'area') {
    const session = await getSession(ctx.from.id);
    const patch = values[0] === 'any' ? {} : { minArea: values[0], maxArea: values[1] || undefined };
    const filters = { ...(session?.data || {}), ...patch };
    await SearchHistory.create({ telegramId: String(ctx.from.id), filters, resultCount: 0 });
    await ctx.answerCbQuery();
    return showProperties(ctx, filters);
  }
};

const handleSearchText = async (ctx, session) => {
  const text = ctx.message?.text?.trim();
  if (!text) return false;

  if (session.step === 'price:min') {
    const min = parsePositiveNumber(text);
    if (min === null) {
      await ctx.reply('Faqat raqam kiriting.');
      return true;
    }
    await mergeSession(ctx.from.id, { minPrice: min }, 'price:max');
    await ctx.reply('Maksimal narxni kiriting:');
    return true;
  }

  if (session.step === 'price:max') {
    const max = parsePositiveNumber(text);
    const min = Number(session.data.minPrice || 0);
    if (max === null || max < min) {
      await ctx.reply('Maksimal narx minimal narxdan katta bo‘lishi kerak.');
      return true;
    }
    await mergeSession(ctx.from.id, { maxPrice: max }, 'price:currency');
    await ctx.reply(
      'Valyutani tanlang:',
      Markup.inlineKeyboard([
        [Markup.button.callback('USD', 'price:currency:USD'), Markup.button.callback('UZS', 'price:currency:UZS')],
      ])
    );
    return true;
  }

  if (session.step === 'search:manualMin') {
    const min = parsePositiveNumber(text);
    if (min === null) {
      await ctx.reply('Faqat raqam kiriting.');
      return true;
    }
    await mergeSession(ctx.from.id, { minPrice: min }, 'search:manualMax');
    await ctx.reply('Maksimal narxni kiriting:');
    return true;
  }

  if (session.step === 'search:manualMax') {
    const max = parsePositiveNumber(text);
    if (max === null || max < Number(session.data.minPrice || 0)) {
      await ctx.reply('Maksimal narx noto‘g‘ri.');
      return true;
    }
    await mergeSession(ctx.from.id, { maxPrice: max }, 'search:city');
    await ctx.reply('Shahar yoki tumanni tanlang:', cityKeyboard());
    return true;
  }

  if (session.step === 'search:manualCity') {
    await mergeSession(ctx.from.id, { city: text }, 'search:area');
    await ctx.reply('Maydon oralig‘ini tanlang:', areaKeyboard());
    return true;
  }

  return false;
};

const handlePriceCurrency = async (ctx, currency) => {
  const session = await getSession(ctx.from.id);
  const filters = { minPrice: session?.data?.minPrice, maxPrice: session?.data?.maxPrice, currency };
  await SearchHistory.create({ telegramId: String(ctx.from.id), filters, query: 'price' });
  await ctx.answerCbQuery();
  return showProperties(ctx, filters);
};

module.exports = { startSearch, startPriceSearch, askPropertyType, askLocation, handleSearchCallback, handleSearchText, handlePriceCurrency };
