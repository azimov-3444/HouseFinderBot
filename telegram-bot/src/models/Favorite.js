const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    telegramId: { type: String, required: true, index: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ telegramId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
