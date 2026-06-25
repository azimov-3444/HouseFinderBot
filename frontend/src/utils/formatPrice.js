export const formatPrice = (price, currency = 'USD') => {
  if (price === undefined || price === null) return '';
  
  const formattedNumber = new Intl.NumberFormat('uz-UZ').format(price);
  
  if (currency === 'USD') {
    return `$${formattedNumber}`;
  }
  
  return `${formattedNumber} UZS`;
};

export default formatPrice;
