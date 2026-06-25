const escapeHtml = require('../utils/escapeHtml');
const formatPrice = require('../utils/formatPrice');

const statusLabel = (status) => {
  if (status === 'Sotilgan') return '🔴 Sotilgan';
  if (status === 'Band qilingan') return '🟠 Band qilingan';
  return '✅ Aktiv';
};

const boolText = (value) => (value ? '✅ Bor' : '❌ Yo‘q');

const valueOrDash = (value, suffix = '') => {
  if (value === undefined || value === null || value === '' || Number(value) === 0) {
    return 'Kiritilmagan';
  }
  return `${value}${suffix}`;
};

const joinList = (items) => (items?.length ? items.join(', ') : 'Kiritilmagan');

const cardText = (property, extra = '') => {
  const floor = property.totalFloors ? `${property.floor || 0}/${property.totalFloors}` : 'Kiritilmagan';

  return [
    `🏡 <b>${escapeHtml(property.title || 'Nomsiz e‘lon')}</b>`,
    '',
    `💰 <b>Narxi:</b> ${escapeHtml(formatPrice(property.price, property.currency))}`,
    `📍 <b>Manzil:</b> ${escapeHtml([property.city, property.district].filter(Boolean).join(', ') || 'Kiritilmagan')}`,
    `🏠 <b>Turi:</b> ${escapeHtml(property.propertyType || 'Kiritilmagan')}`,
    `🚪 <b>Xonalar:</b> ${valueOrDash(property.rooms)}`,
    `📐 <b>Maydon:</b> ${valueOrDash(property.area, ' m²')}`,
    property.landArea ? `🌿 <b>Yer:</b> ${property.landArea} sotix` : null,
    `🏢 <b>Qavat:</b> ${escapeHtml(floor)}`,
    `<b>Status:</b> ${escapeHtml(statusLabel(property.status))}`,
    extra ? `\n${escapeHtml(extra)}` : '',
  ]
    .filter(Boolean)
    .join('\n');
};

const detailText = (property) => {
  const category = typeof property.category === 'object' ? property.category?.name : '';
  const lines = [
    `🏡 <b>${escapeHtml(property.title || 'Nomsiz e‘lon')}</b>`,
    escapeHtml(statusLabel(property.status)),
    '',
    '💵 <b>Narx</b>',
    escapeHtml(formatPrice(property.price, property.currency)),
    '',
    '📍 <b>Manzil</b>',
    `Shahar: ${escapeHtml(property.city || 'Kiritilmagan')}`,
    `Tuman: ${escapeHtml(property.district || 'Kiritilmagan')}`,
    `To‘liq manzil: ${escapeHtml(property.address || 'Kiritilmagan')}`,
    '',
    '🏠 <b>Uy ma‘lumotlari</b>',
    `Turi: ${escapeHtml(property.propertyType || 'Kiritilmagan')}`,
    `Kategoriya: ${escapeHtml(category || 'Kiritilmagan')}`,
    `Xonalar: ${valueOrDash(property.rooms)}`,
    `Maydon: ${valueOrDash(property.area, ' m²')}`,
  ];

  if (property.propertyType === 'Ko‘p qavatli dom' || property.floor || property.totalFloors) {
    lines.push(`Qavat: ${property.totalFloors ? `${property.floor || 0}/${property.totalFloors}` : 'Kiritilmagan'}`);
  }
  if (property.landArea) lines.push(`Yer maydoni: ${property.landArea} sotix`);
  if (property.buildingYear) lines.push(`Qurilgan yili: ${property.buildingYear}`);

  lines.push('', '🛠 <b>Holati va qulayliklar</b>');
  lines.push(`Remont: ${escapeHtml(property.renovationStatus || 'Kiritilmagan')}`);
  lines.push(`Balkon: ${boolText(property.hasBalcony)}`);
  lines.push(`Lift: ${boolText(property.hasLift)}`);
  lines.push(`Parking: ${boolText(property.hasParking)}`);
  lines.push(`Kommunikatsiyalar: ${escapeHtml(joinList(property.communications))}`);
  lines.push(`Qulayliklar: ${escapeHtml(joinList(property.amenities))}`);
  lines.push(`Yonidagi joylar: ${escapeHtml(joinList(property.nearbyPlaces))}`);

  if (property.videoUrl) lines.push(`Video: ${escapeHtml(property.videoUrl)}`);
  if (property.tourUrl) lines.push(`360 tour: ${escapeHtml(property.tourUrl)}`);
  if (property.createdAt) lines.push(`Qo‘shilgan sana: ${new Date(property.createdAt).toLocaleDateString('uz-UZ')}`);
  if (property.views !== undefined) lines.push(`Ko‘rishlar: ${property.views}`);

  if (property.description) {
    lines.push('', '📝 <b>Tavsif</b>');
    lines.push(escapeHtml(property.description).slice(0, 2500));
  }

  return lines.join('\n');
};

module.exports = { cardText, detailText, statusLabel };
