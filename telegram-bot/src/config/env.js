const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  botToken: process.env.BOT_TOKEN,
  botUsername: process.env.BOT_USERNAME || 'HouseFinderBot',
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/house-finder',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  botMode: process.env.BOT_MODE || 'polling',
  webhookUrl: process.env.WEBHOOK_URL || '',
  port: Number(process.env.PORT || 7000),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowInsecureTls:
    process.env.ALLOW_INSECURE_TLS === 'true' ||
    (process.env.ALLOW_INSECURE_TLS !== 'false' && (process.env.NODE_ENV || 'development') === 'development'),
};

module.exports = env;
