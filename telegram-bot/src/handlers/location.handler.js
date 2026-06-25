const { listProperties } = require('../services/property.service');
const { distanceKm } = require('../services/map.service');
const { sendPropertyCard } = require('./property.handler');

const handleLocation = async (ctx) => {
  const location = ctx.message.location;
  if (!location) return false;

  const response = await listProperties({ limit: 100, page: 1 });
  const sorted = (response.data || [])
    .filter((property) => property.latitude && property.longitude)
    .map((property) => ({
      property,
      distance: distanceKm(location.latitude, location.longitude, property.latitude, property.longitude),
    }))
    .filter((item) => item.distance <= 20)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  if (!sorted.length) {
    return ctx.reply('20 km radiusda mos uy topilmadi.');
  }

  await ctx.reply('Sizga yaqin uylar:');
  for (const item of sorted) {
    await sendPropertyCard(ctx, item.property, 1, `Sizdan taxminan ${item.distance.toFixed(1)} km uzoqlikda`);
  }
  return true;
};

module.exports = { handleLocation };
