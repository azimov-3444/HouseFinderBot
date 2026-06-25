const { Markup } = require('telegraf');

const propertyTypeKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Ko‘p qavatli dom', 'search:type:Ko‘p qavatli dom')],
    [Markup.button.callback('Uchastka', 'search:type:Uchastka'), Markup.button.callback('Hovli', 'search:type:Hovli')],
    [Markup.button.callback('Villa', 'search:type:Villa'), Markup.button.callback('Yangi qurilgan uy', 'search:type:Yangi qurilgan uy')],
    [Markup.button.callback('Farqi yo‘q', 'search:type:any')],
    [Markup.button.callback('Asosiy menyu', 'menu:main')],
  ]);

const roomsKeyboard = () =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback('1 xona', 'search:rooms:1'),
      Markup.button.callback('2 xona', 'search:rooms:2'),
      Markup.button.callback('3 xona', 'search:rooms:3'),
    ],
    [Markup.button.callback('4 xona', 'search:rooms:4'), Markup.button.callback('5+', 'search:rooms:5')],
    [Markup.button.callback('Farqi yo‘q', 'search:rooms:any')],
  ]);

const priceKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('0 - 20 000 USD', 'search:price:0:20000')],
    [Markup.button.callback('20 000 - 50 000 USD', 'search:price:20000:50000')],
    [Markup.button.callback('50 000 - 100 000 USD', 'search:price:50000:100000')],
    [Markup.button.callback('100 000+ USD', 'search:price:100000:')],
    [Markup.button.callback('Qo‘lda kiritish', 'search:price:manual')],
    [Markup.button.callback('Farqi yo‘q', 'search:price:any')],
  ]);

const cityKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('Toshkent', 'search:city:Toshkent'), Markup.button.callback('Samarqand', 'search:city:Samarqand')],
    [Markup.button.callback('Buxoro', 'search:city:Buxoro'), Markup.button.callback('Andijon', 'search:city:Andijon')],
    [Markup.button.callback('Farg‘ona', 'search:city:Farg‘ona'), Markup.button.callback('Namangan', 'search:city:Namangan')],
    [Markup.button.callback('Boshqa', 'search:city:manual'), Markup.button.callback('Farqi yo‘q', 'search:city:any')],
  ]);

const areaKeyboard = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('30 - 50 m²', 'search:area:30:50'), Markup.button.callback('50 - 80 m²', 'search:area:50:80')],
    [Markup.button.callback('80 - 120 m²', 'search:area:80:120'), Markup.button.callback('120+ m²', 'search:area:120:')],
    [Markup.button.callback('Farqi yo‘q', 'search:area:any')],
  ]);

module.exports = { propertyTypeKeyboard, roomsKeyboard, priceKeyboard, cityKeyboard, areaKeyboard };
