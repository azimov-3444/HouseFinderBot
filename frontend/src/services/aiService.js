import api from './api';

export const chatWithAi = async (message, history = []) => {
  const response = await api.post('/ai/chat', { message, history });
  return response.data;
};

export const recommendWithAi = async (query) => {
  const response = await api.post('/ai/recommend', { query });
  return response.data;
};

export const evaluatePriceWithAi = async (payload) => {
  const response = await api.post('/ai/evaluate-price', payload);
  return response.data;
};
