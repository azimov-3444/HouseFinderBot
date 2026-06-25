const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    makler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      default: 0,
    },
    requirements: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Yangi', 'Aloqaga chiqildi', 'Uy ko‘rdi', 'Muzokarada', 'Bitim yopildi', 'Bekor qilindi'],
      default: 'Yangi',
    },
    appointments: [
      {
        date: { type: Date },
        location: { type: String },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
