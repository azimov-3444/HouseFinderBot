import api from './api';

export const getProperties = async (params = {}) => {
  const response = await api.get('/properties', { params });
  return response.data;
};

export const getAdminProperties = async (params = {}) => {
  const response = await api.get('/properties/admin/all', { params });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const createProperty = async (data) => {
  const response = await api.post('/properties', data);
  return response.data;
};

export const updateProperty = async (id, data) => {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
};

export const updatePropertyStatus = async (id, status) => {
  const response = await api.patch(`/properties/${id}/status`, { status });
  return response.data;
};

export const getFeaturedProperties = async () => {
  const response = await api.get('/properties/featured');
  return response.data;
};

export const getSimilarProperties = async (id) => {
  const response = await api.get(`/properties/similar/${id}`);
  return response.data;
};

export const submitContactRequest = async (requestData) => {
  const response = await api.post('/contact-requests', requestData);
  return response.data;
};

export const getContactRequests = async () => {
  const response = await api.get('/contact-requests');
  return response.data;
};

export const updateContactRequestStatus = async (id, status) => {
  const response = await api.patch(`/contact-requests/${id}/status`, { status });
  return response.data;
};

export const deleteContactRequest = async (id) => {
  const response = await api.delete(`/contact-requests/${id}`);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const uploadImages = async (formData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
