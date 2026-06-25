const mongoose = require('mongoose');

const telegramUserSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    username: { type: String, default: '' },
    phone: { type: String, default: '' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    lastSearchFilters: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TelegramUser', telegramUserSchema);
