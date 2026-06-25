const { startSearch } = require('../handlers/search.handler');

const registerSearchCommand = (bot) => {
  bot.command('search', startSearch);
};

module.exports = { registerSearchCommand };
