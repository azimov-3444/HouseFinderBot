const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  const connection = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected for Telegram bot: ${connection.connection.host}`);
};

module.exports = connectDB;
