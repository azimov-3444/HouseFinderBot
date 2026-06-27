import axios from 'axios';

const apiRoot = import.meta.env.VITE_API_URL || 'https://gw70.onrender.com/api';
const baseURL = apiRoot.replace(/\/$/, '').endsWith('/api')
  ? apiRoot.replace(/\/$/, '')
  : `${apiRoot.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
