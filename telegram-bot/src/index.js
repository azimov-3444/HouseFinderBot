const connectDB = require('./config/db');
const { createBot } = require('./bot');

const start = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.warn('Telegram bot will continue without direct MongoDB features. Listings can still load from the backend API.');
  }

  const bot = createBot();
  console.log('House Finder Telegram bot started with node-telegram-bot-api');

  const stop = async (signal) => {
    console.log(`Received ${signal}. Stopping Telegram bot...`);
    await bot.stopPolling().catch(() => {});
    process.exit(0);
  };

  process.once('SIGINT', () => stop('SIGINT'));
  process.once('SIGTERM', () => stop('SIGTERM'));
};

start().catch((error) => {
  console.error('Failed to start Telegram bot:', error);
  process.exit(1);
});
