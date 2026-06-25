const { Markup } = require('telegraf');

const mainKeyboard = () =>
  Markup.keyboard([
    ['Uylarni ko‘rish', 'Uy qidirish'],
    ['Narx bo‘yicha', 'Uy turi'],
    ['Manzil bo‘yicha', 'Sevimlilar'],
    ['Bog‘lanish', 'Yordam'],
  ]).resize();

module.exports = { mainKeyboard };
