const { showProperties } = require('../handlers/property.handler');

const registerPropertiesCommand = (bot) => {
  bot.command('properties', (ctx) => showProperties(ctx, { page: 1 }));
};

module.exports = { registerPropertiesCommand };
