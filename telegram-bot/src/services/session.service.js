const BotSession = require('../models/BotSession');

const ttlDate = () => new Date(Date.now() + 60 * 60 * 1000);

const setSession = async (telegramId, step, data = {}) =>
  BotSession.findOneAndUpdate(
    { telegramId: String(telegramId) },
    { step, data, expiresAt: ttlDate() },
    { new: true, upsert: true }
  );

const getSession = async (telegramId) => BotSession.findOne({ telegramId: String(telegramId) }).lean();

const clearSession = async (telegramId) => BotSession.deleteOne({ telegramId: String(telegramId) });

const mergeSession = async (telegramId, patch = {}, step) => {
  const current = await getSession(telegramId);
  return setSession(telegramId, step || current?.step || '', { ...(current?.data || {}), ...patch });
};

module.exports = { setSession, getSession, clearSession, mergeSession };
