const { mainKeyboard } = require('../keyboards/main.keyboard');

const showMenu = (ctx) => ctx.reply('Asosiy menyu:', mainKeyboard());

const registerMenuCommand = (bot) => {
  bot.command('menu', showMenu);
};

module.exports = { registerMenuCommand, showMenu };
