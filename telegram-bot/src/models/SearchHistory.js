const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, index: true },
    filters: { type: Object, default: {} },
    query: { type: String, default: '' },
    resultCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
