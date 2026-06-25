const formatPrice = (price = 0, currency = 'USD') => {
  const numeric = Number(price) || 0;
  return `${numeric.toLocaleString('en-US')} ${currency}`;
};

module.exports = formatPrice;
