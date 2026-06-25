const { Markup } = require('telegraf');
const { setSession, getSession, mergeSession, clearSession } = require('../services/session.service');
const { createTelegramRequest } = require('../services/request.service');
const { isValidPhone } = require('../utils/validators');

const startRequest = async (ctx, propertyId) => {
  await setSession(ctx.from.id, 'request:name', { propertyId });
  await ctx.reply('Ismingizni kiriting:', Markup.inlineKeyboard([[Markup.button.callback('Bekor qilish', 'request:cancel')]]));
};

const handleRequestText = async (ctx, session) => {
  const text = ctx.message?.text?.trim();
  if (!text) return false;

  if (session.step === 'request:name') {
    await mergeSession(ctx.from.id, { name: text }, 'request:phone');
    await ctx.reply(
      'Telefon raqamingizni yuboring yoki pastdagi tugmani bosing:',
      Markup.keyboard([[Markup.button.contactRequest('Telefon raqam yuborish')], ['Bekor qilish']]).resize()
    );
    return true;
  }

  if (session.step === 'request:phone') {
    if (!isValidPhone(text)) {
      await ctx.reply('Telefon raqam noto‘g‘ri. Masalan: +998901234567');
      return true;
    }
    await mergeSession(ctx.from.id, { phone: text }, 'request:message');
    await ctx.reply('Qo‘shimcha xabar yozing yoki "O‘tkazib yuborish" deb yuboring:', Markup.removeKeyboard());
    return true;
  }

  if (session.step === 'request:message') {
    const message = text.toLowerCase().includes('tkazib') ? '' : text;
    const data = { ...session.data, message };
    await setSession(ctx.from.id, 'request:confirm', data);
    await ctx.reply(
      `Tasdiqlaysizmi?\n\nIsm: ${data.name}\nTelefon: ${data.phone}\nXabar: ${data.message || 'Yo‘q'}`,
      Markup.inlineKeyboard([
        [Markup.button.callback('Tasdiqlash', 'request:confirm')],
        [Markup.button.callback('Bekor qilish', 'request:cancel')],
      ])
    );
    return true;
  }

  return false;
};

const handleContact = async (ctx) => {
  const session = await getSession(ctx.from.id);
  if (!session || session.step !== 'request:phone') return false;
  const phone = ctx.message.contact.phone_number;
  await mergeSession(ctx.from.id, { phone }, 'request:message');
  await ctx.reply('Qo‘shimcha xabar yozing yoki "O‘tkazib yuborish" deb yuboring:', Markup.removeKeyboard());
  return true;
};

const confirmRequest = async (ctx) => {
  const session = await getSession(ctx.from.id);
  if (!session || session.step !== 'request:confirm') {
    await ctx.answerCbQuery('Ariza sessiyasi topilmadi');
    return;
  }
  await createTelegramRequest({
    ...session.data,
    telegramId: ctx.from.id,
    telegramUsername: ctx.from.username || '',
  });
  await clearSession(ctx.from.id);
  await ctx.answerCbQuery('Ariza yuborildi');
  await ctx.reply('Arizangiz qabul qilindi. Tez orada siz bilan bog‘lanishadi.', Markup.removeKeyboard());
};

const cancelRequest = async (ctx) => {
  await clearSession(ctx.from.id);
  await ctx.answerCbQuery('Bekor qilindi').catch(() => {});
  await ctx.reply('Ariza bekor qilindi.', Markup.removeKeyboard());
};

module.exports = { startRequest, handleRequestText, handleContact, confirmRequest, cancelRequest };
