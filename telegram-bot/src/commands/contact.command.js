const { showContact } = require('../handlers/contact.handler');

const registerContactCommand = (bot) => {
  bot.command('contact', showContact);
};

module.exports = { registerContactCommand };
