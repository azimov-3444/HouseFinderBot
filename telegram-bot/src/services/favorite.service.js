const Favorite = require('../models/Favorite');
const { getProperty } = require('./property.service');

const toggleFavorite = async (telegramId, propertyId) => {
  const existing = await Favorite.findOne({ telegramId: String(telegramId), propertyId });
  if (existing) {
    await existing.deleteOne();
    return { saved: false };
  }
  await Favorite.create({ telegramId: String(telegramId), propertyId });
  return { saved: true };
};

const listFavorites = async (telegramId) => {
  const favorites = await Favorite.find({ telegramId: String(telegramId) }).sort('-createdAt').lean();
  const properties = [];
  for (const fav of favorites) {
    try {
      properties.push(await getProperty(fav.propertyId.toString()));
    } catch (error) {
      properties.push(null);
    }
  }
  return properties;
};

module.exports = { toggleFavorite, listFavorites };
