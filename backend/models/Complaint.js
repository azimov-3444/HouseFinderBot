const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'Soxta e‘lon',
        'Rasm boshqa uyga tegishli',
        'Narx noto‘g‘ri',
        'Uy allaqachon sotilgan/ijaraga berilgan',
        'Makler o‘zini egasi deb ko‘rsatgan',
        'Boshqa',
      ],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Kutilmoqda', 'Ko‘rib chiqildi', 'Rad etildi'],
      default: 'Kutilmoqda',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
