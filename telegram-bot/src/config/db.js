const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected for Telegram bot: ${connection.connection.host}`);
  } catch (error) {
    if (error.name === 'MongooseServerSelectionError') {
      console.error(
        [
          'Telegram bot MongoDB connection failed.',
          'If you use MongoDB Atlas, add this machine/server IP to Network Access whitelist.',
          `Original error: ${error.message}`,
        ].join('\n')
      );
    }
    throw error;
  }
};

module.exports = connectDB;
