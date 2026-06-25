export const FALLBACK_RATES = {
  USD: 1,
  UZS: 12650,
  RUB: 78,
};

export const convertPrice = (price, fromCurrency = 'USD', toCurrency = 'USD', rates = FALLBACK_RATES) => {
  if (price === undefined || price === null || Number.isNaN(Number(price))) return 0;

  const sourceRate = rates[fromCurrency] || 1;
  const targetRate = rates[toCurrency] || 1;
  const priceInUsd = fromCurrency === 'USD' ? Number(price) : Number(price) / sourceRate;

  return toCurrency === 'USD' ? priceInUsd : priceInUsd * targetRate;
};

export const formatPrice = (price, currency = 'USD', options = {}) => {
  if (price === undefined || price === null) return '';

  const {
    displayCurrency = currency,
    locale = 'uz-UZ',
    rates = FALLBACK_RATES,
  } = options;

  const converted = convertPrice(price, currency, displayCurrency, rates);
  const formattedNumber = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(converted);

  if (displayCurrency === 'USD') return `$${formattedNumber}`;
  if (displayCurrency === 'RUB') return `${formattedNumber} RUB`;

  return `${formattedNumber} UZS`;
};

export default formatPrice;
