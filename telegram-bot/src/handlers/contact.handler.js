const showContact = async (ctx) =>
  ctx.reply(
    [
      'Bog‘lanish ma‘lumotlari:',
      '',
      'Telefon: +998 (90) 123-45-67',
      'Telegram: @housefinder',
      'Sayt: https://housefinder.uz',
      'Manzil: Toshkent shahri',
      'Ish vaqti: 09:00 - 18:00',
    ].join('\n')
  );

module.exports = { showContact };
