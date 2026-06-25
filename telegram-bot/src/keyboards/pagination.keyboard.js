const { Markup } = require('telegraf');

const paginationKeyboard = (prefix, page) =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback('Oldingi', `${prefix}:${Math.max(page - 1, 1)}`),
      Markup.button.callback('Keyingi', `${prefix}:${page + 1}`),
    ],
    [Markup.button.callback('Asosiy menyu', 'menu:main')],
  ]);

module.exports = { paginationKeyboard };
