const ContactRequest = require('../models/ContactRequest');

const createTelegramRequest = async ({ propertyId, name, phone, message, telegramId, telegramUsername }) =>
  ContactRequest.create({
    propertyId,
    name,
    phone,
    email: '',
    message: message || 'Telegram bot orqali qoldirilgan ariza',
    source: 'telegram',
    telegramId: String(telegramId),
    telegramUsername: telegramUsername || '',
    status: 'new',
  });

module.exports = { createTelegramRequest };
