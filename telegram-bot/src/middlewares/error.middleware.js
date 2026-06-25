const errorMiddleware = (bot) => {
  bot.catch(async (error, ctx) => {
    console.error('Telegram bot error:', error);
    if (ctx?.reply) {
      await ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring yoki /menu buyrug‘ini bosing.');
    }
  });
};

module.exports = errorMiddleware;
