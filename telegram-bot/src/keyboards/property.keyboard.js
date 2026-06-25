const { Markup } = require('telegraf');
const env = require('../config/env');

const propertyKeyboard = (property, page = 1) => {
  const id = property._id || property.id;
  const buttons = [
    [
      Markup.button.callback('Batafsil', `property:detail:${id}:${page}`),
      Markup.button.callback('Saqlash', `favorite:toggle:${id}`),
    ],
  ];

  if (property.latitude && property.longitude) {
    buttons.push([Markup.button.callback('Xarita', `property:map:${id}`)]);
  }

  buttons.push([
    Markup.button.url('Saytda ko‘rish', `${env.clientUrl}/properties/${id}`),
  ]);

  buttons.push([
    Markup.button.callback('Oldingi', `properties:page:${Math.max(page - 1, 1)}`),
    Markup.button.callback('Keyingi', `properties:page:${page + 1}`),
  ]);

  return Markup.inlineKeyboard(buttons);
};

const detailKeyboard = (property, backPage = 1) => {
  const id = property._id || property.id;
  const rows = [];
  if (property.latitude && property.longitude) rows.push([Markup.button.callback('Xarita', `property:map:${id}`)]);
  rows.push([
    Markup.button.callback('Ariza qoldirish', `request:start:${id}`),
    Markup.button.callback('Sevimlilarga qo‘shish', `favorite:toggle:${id}`),
  ]);
  rows.push([
    Markup.button.url('Saytda ko‘rish', `${env.clientUrl}/properties/${id}`),
    Markup.button.switchToChat('Ulashish', `House Finder: ${property.title}`),
  ]);
  rows.push([Markup.button.callback('Orqaga', `properties:page:${backPage}`)]);
  return Markup.inlineKeyboard(rows);
};

module.exports = { propertyKeyboard, detailKeyboard };
