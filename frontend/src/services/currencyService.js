import api from './api';

export const getCurrencyRates = async () => {
  const res = await api.get('/currency/rates');
  return res.data;
};
