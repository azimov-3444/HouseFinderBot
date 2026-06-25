const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Sarlavha kiritilishi shart'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Tavsif kiritilishi shart'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Narx kiritilishi shart'],
      min: [0, 'Narx manfiy bo‘lishi mumkin emas'],
    },
    currency: {
      type: String,
      enum: ['UZS', 'USD'],
      default: 'USD',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategoriya tanlanishi shart'],
    },
    propertyType: {
      type: String,
      enum: ['Ko‘p qavatli dom', 'Uchastka', 'Hovli', 'Villa', 'Yangi qurilgan uy'],
      required: [true, 'Uy turi tanlanishi shart'],
    },
    status: {
      type: String,
      enum: ['Aktiv', 'Sotilgan', 'Band qilingan'],
      default: 'Aktiv',
    },
    rooms: {
      type: Number,
      default: 0,
    },
    floor: {
      type: Number,
      default: 0,
    },
    totalFloors: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number, // kv.m
      default: 0,
    },
    landArea: {
      type: Number, // sotix (uchastka/hovli/villa uchun)
      default: 0,
    },
    address: {
      type: String,
      required: [true, 'To‘liq manzil kiritilishi shart'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Shahar kiritilishi shart'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'Tuman kiritilishi shart'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Kenglik (latitude) koordinatasi shart'],
    },
    longitude: {
      type: Number,
      required: [true, 'Uzunlik (longitude) koordinatasi shart'],
    },
    images: {
      type: [String],
      required: [true, 'Kamida bitta rasm yuklash shart'],
      validate: [
        {
          validator: function (v) {
            return Array.isArray(v) && v.length > 0;
          },
          message: 'Kamida bitta rasm yuklash shart',
        },
      ],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    tourUrl: {
      type: String,
      default: '',
    },
    amenities: {
      type: [String],
      default: [],
    },
    nearbyPlaces: {
      type: [String],
      default: [],
    },
    buildingYear: {
      type: Number,
    },
    renovationStatus: {
      type: String,
      default: 'Ta‘mirlanmagan',
    },
    hasBalcony: {
      type: Boolean,
      default: false,
    },
    hasLift: {
      type: Boolean,
      default: false,
    },
    hasParking: {
      type: Boolean,
      default: false,
    },
    communications: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDocumentChecked: {
      type: Boolean,
      default: false,
    },
    marketPriceStatus: {
      type: String,
      enum: ['Bozor narxidan arzon', 'Bozor narxida', 'Bozor narxidan qimmat', 'Baholanmagan'],
      default: 'Baholanmagan',
    },
    distances: {
      metro: { type: Number, default: 0 },
      school: { type: Number, default: 0 },
      kindergarten: { type: Number, default: 0 },
      supermarket: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Slugify before saving
propertySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
      
    // append a random string or short timestamp to make slug unique
    this.slug += '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
