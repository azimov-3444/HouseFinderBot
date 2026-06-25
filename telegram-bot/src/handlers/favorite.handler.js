const { toggleFavorite, listFavorites } = require('../services/favorite.service');
const { sendPropertyCard } = require('./property.handler');

const toggleFavoriteHandler = async (ctx, propertyId) => {
  const result = await toggleFavorite(ctx.from.id, propertyId);
  await ctx.answerCbQuery(result.saved ? 'Sevimlilarga qo‘shildi' : 'Sevimlilardan olib tashlandi');
};

const showFavorites = async (ctx) => {
  const properties = await listFavorites(ctx.from.id);
  const existing = properties.filter(Boolean);
  if (!existing.length) {
    return ctx.reply('Sevimlilar ro‘yxati hozircha bo‘sh.');
  }
  await ctx.reply(`Sevimli e‘lonlaringiz: ${existing.length} ta`);
  for (const property of existing) {
    await sendPropertyCard(ctx, property, 1);
  }
};

module.exports = { toggleFavoriteHandler, showFavorites };
