const mongoose = require('mongoose');

const botSessionSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, unique: true, index: true },
    step: { type: String, default: '' },
    data: { type: Object, default: {} },
    expiresAt: { type: Date, index: { expires: 0 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BotSession', botSessionSchema);
