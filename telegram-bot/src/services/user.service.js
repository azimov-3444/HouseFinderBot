const TelegramUser = require('../models/TelegramUser');

const upsertTelegramUser = async (from) => {
  if (!from) return null;
  return TelegramUser.findOneAndUpdate(
    { telegramId: String(from.id) },
    {
      telegramId: String(from.id),
      firstName: from.first_name || '',
      lastName: from.last_name || '',
      username: from.username || '',
    },
    { new: true, upsert: true }
  );
};

const savePhone = async (telegramId, phone) =>
  TelegramUser.findOneAndUpdate({ telegramId: String(telegramId) }, { phone }, { new: true, upsert: true });

module.exports = { upsertTelegramUser, savePhone };
