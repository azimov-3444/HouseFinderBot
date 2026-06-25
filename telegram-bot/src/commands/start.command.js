const { mainKeyboard } = require('../keyboards/main.keyboard');

const welcomeText = [
  'Assalomu alaykum! House Finder botiga xush kelibsiz.',
  '',
  'Bu bot orqali siz o‘zingizga mos uy, kvartira, hovli yoki uchastkani tez va qulay topishingiz mumkin.',
].join('\n');

const registerStartCommand = (bot) => {
  bot.start((ctx) => ctx.reply(welcomeText, mainKeyboard()));
};

module.exports = { registerStartCommand, welcomeText };
