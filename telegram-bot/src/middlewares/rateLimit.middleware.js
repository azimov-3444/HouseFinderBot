const buckets = new Map();

const rateLimitMiddleware = async (ctx, next) => {
  const id = ctx.from?.id;
  if (!id) return next();

  const now = Date.now();
  const current = buckets.get(id) || { count: 0, resetAt: now + 60_000 };
  if (now > current.resetAt) {
    current.count = 0;
    current.resetAt = now + 60_000;
  }
  current.count += 1;
  buckets.set(id, current);

  if (current.count > 40) {
    return ctx.reply('Juda ko‘p so‘rov yuborildi. Iltimos, biroz kutib qayta urinib ko‘ring.');
  }

  return next();
};

module.exports = rateLimitMiddleware;
