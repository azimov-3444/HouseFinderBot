const googleMapsLink = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

const distanceKm = (fromLat, fromLng, toLat, toLng) => {
  const toRad = (v) => (Number(v) * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = { googleMapsLink, distanceKm };
