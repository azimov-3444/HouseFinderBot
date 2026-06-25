const helpText = [
  'Yordam:',
  '',
  'Uylarni ko‘rish uchun "Uylarni ko‘rish" tugmasini bosing.',
  'Filter qilish uchun "Uy qidirish" tugmasini bosing.',
  'Narx orqali topish uchun "Narx bo‘yicha" tugmasini bosing.',
  'Uy haqida to‘liq ma‘lumot olish uchun "Batafsil" tugmasini bosing.',
  'Ariza qoldirish uchun "Ariza qoldirish" tugmasini bosing.',
  '',
  'Komandalar: /start, /menu, /properties, /search, /favorites, /contact, /help',
].join('\n');

const registerHelpCommand = (bot) => {
  bot.command('help', (ctx) => ctx.reply(helpText));
};

module.exports = { registerHelpCommand, helpText };
