const axios = require('axios');
const env = require('../config/env');

const listCategories = async () => {
  const response = await axios.get(`${env.apiBaseUrl}/categories`, { timeout: 10000 });
  return response.data.data || [];
};

module.exports = { listCategories };
