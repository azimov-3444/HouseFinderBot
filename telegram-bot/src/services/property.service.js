const axios = require('axios');
const env = require('../config/env');

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10000,
});

const listProperties = async (filters = {}) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 5,
    sort: filters.sort || 'newest',
    ...filters,
  };
  delete params.distanceFrom;
  const response = await api.get('/properties/catalog', { params });
  return response.data;
};

const getProperty = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data.data;
};

module.exports = { listProperties, getProperty };
