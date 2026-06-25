const { Markup } = require('telegraf');
const { listProperties, getProperty } = require('../services/property.service');
const { cardText, detailText } = require('../services/format.service');
const { googleMapsLink } = require('../services/map.service');
const { propertyKeyboard, detailKeyboard } = require('../keyboards/property.keyboard');

const isTelegramFetchableImage = (url = '') => /^https?:\/\//i.test(url) && !url.includes('localhost') && !url.includes('127.0.0.1');

const sendPropertyCard = async (ctx, property, page = 1, extra = '') => {
  const image = property.images?.[0];
  const localImageNote =
    image && !isTelegramFetchableImage(image)
      ? '\n\nRasm mavjud, lekin hozir localhost manzilda. Telegram localhost rasmni ocholmaydi.'
      : '';
  const text = `${cardText(property, extra)}${localImageNote}`;
  if (isTelegramFetchableImage(image)) {
    try {
      return await ctx.replyWithPhoto(image, {
        caption: text,
        parse_mode: 'HTML',
        ...propertyKeyboard(property, page),
      });
    } catch (error) {
      console.warn('Photo send failed, falling back to text:', error.message);
    }
  }
  return ctx.reply(text, { parse_mode: 'HTML', ...propertyKeyboard(property, page) });
};

const showProperties = async (ctx, filters = {}) => {
  const page = Number(filters.page || 1);
  const loading = await ctx.reply('Ma‘lumotlar yuklanmoqda...');
  const response = await listProperties({ ...filters, page, limit: 5 });
  const properties = response.data || [];

  await ctx.telegram.deleteMessage(ctx.chat.id, loading.message_id).catch(() => {});

  if (!properties.length) {
    return ctx.reply(
      'Kechirasiz, bu filterlarga mos uy topilmadi. Filterlarni o‘zgartirib qayta urinib ko‘ring.',
      Markup.inlineKeyboard([
        [Markup.button.callback('Filterni o‘zgartirish', 'search:start')],
        [Markup.button.callback('Barcha uylar', 'properties:page:1')],
        [Markup.button.callback('Asosiy menyu', 'menu:main')],
      ])
    );
  }

  await ctx.reply(`Topildi: ${response.pagination?.total || properties.length} ta e‘lon. Sahifa: ${page}`);
  for (const property of properties) {
    await sendPropertyCard(ctx, property, page, filters.distanceFrom ? `Sizdan taxminan ${filters.distanceFrom(property).toFixed(1)} km uzoqlikda` : '');
  }
};

const showPropertyDetail = async (ctx, id, backPage = 1) => {
  const property = await getProperty(id);
  const localImages = (property.images || []).filter((url) => url && !isTelegramFetchableImage(url));
  const imageNote = localImages.length
    ? '\n\nRasmlar bor, lekin ular localhost manzilda. Telegram ularni bot ichida ocholmaydi; productionda public URL ishlating yoki "Saytda ko‘rish" tugmasini bosing.'
    : '';
  await ctx.reply(`${detailText(property)}${imageNote}`, { parse_mode: 'HTML', ...detailKeyboard(property, backPage) });

  const images = (property.images || []).filter(isTelegramFetchableImage).slice(0, 10);
  if (images.length > 1) {
    await ctx.replyWithMediaGroup(images.map((url) => ({ type: 'photo', media: url }))).catch(() => {});
  }
};

const sendPropertyMap = async (ctx, id) => {
  const property = await getProperty(id);
  if (!property.latitude || !property.longitude) {
    return ctx.reply('Bu uy uchun xarita ma‘lumoti kiritilmagan.');
  }
  await ctx.replyWithLocation(Number(property.latitude), Number(property.longitude));
  return ctx.reply(`Google Maps: ${googleMapsLink(property.latitude, property.longitude)}`);
};

module.exports = { showProperties, showPropertyDetail, sendPropertyMap, sendPropertyCard };
