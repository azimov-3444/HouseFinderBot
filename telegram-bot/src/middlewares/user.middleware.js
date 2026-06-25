const { upsertTelegramUser } = require('../services/user.service');

const userMiddleware = async (ctx, next) => {
  if (ctx.from) {
    ctx.telegramUser = await upsertTelegramUser(ctx.from);
  }
  return next();
};

module.exports = userMiddleware;
