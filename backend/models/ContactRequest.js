const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Mulk tanlanishi shart'],
    },
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefon raqam kiritilishi shart'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['website', 'telegram'],
      default: 'website',
    },
    telegramId: {
      type: String,
      trim: true,
    },
    telegramUsername: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
