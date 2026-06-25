const { showFavorites } = require('../handlers/favorite.handler');

const registerFavoritesCommand = (bot) => {
  bot.command('favorites', showFavorites);
};

module.exports = { registerFavoritesCommand };
