const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);
