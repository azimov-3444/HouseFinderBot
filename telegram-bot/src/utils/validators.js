const parsePositiveNumber = (value) => {
  const cleaned = String(value || '').replace(/[^\d.]/g, '');
  const number = Number(cleaned);
  return Number.isFinite(number) && number >= 0 ? number : null;
};

const isValidPhone = (value) => /^\+?\d[\d\s()-]{7,}$/.test(String(value || '').trim());

module.exports = { parsePositiveNumber, isValidPhone };
