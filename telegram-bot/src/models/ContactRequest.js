const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    source: { type: String, enum: ['website', 'telegram'], default: 'telegram' },
    telegramId: { type: String, trim: true },
    telegramUsername: { type: String, trim: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema);
