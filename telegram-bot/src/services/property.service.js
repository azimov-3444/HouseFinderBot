const axios = require('axios');
const mongoose = require('mongoose');
const env = require('../config/env');
const Property = require('../models/Property');

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
  try {
    const response = await api.get('/properties/catalog', { params });
    return response.data;
  } catch (error) {
    console.warn(`Backend API unavailable for property catalog, using MongoDB fallback: ${error.message}`);
    if (mongoose.connection.readyState !== 1) {
      throw error;
    }
    return listPropertiesFromMongo(params);
  }
};

const getProperty = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    console.warn(`Backend API unavailable for property ${id}, using MongoDB fallback: ${error.message}`);
    if (mongoose.connection.readyState !== 1) {
      throw error;
    }
    const property = await Property.findById(id).populate('category', 'name slug').lean();
    if (!property) {
      const notFound = new Error('Property not found');
      notFound.statusCode = 404;
      throw notFound;
    }
    return property;
  }
};

const listPropertiesFromMongo = async (params = {}) => {
  const query = { isActive: true };

  if (params.status && params.status !== 'all') query.status = params.status;
  if (params.propertyType) query.propertyType = params.propertyType;
  if (params.rooms) query.rooms = Number(params.rooms);
  if (params.category) query.category = params.category;
  if (params.city) query.city = new RegExp(params.city, 'i');
  if (params.district) query.district = new RegExp(params.district, 'i');
  if (params.floor) query.floor = Number(params.floor);

  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = Number(params.minPrice);
    if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
  }

  if (params.minArea || params.maxArea) {
    query.area = {};
    if (params.minArea) query.area.$gte = Number(params.minArea);
    if (params.maxArea) query.area.$lte = Number(params.maxArea);
  }

  if (params.search) {
    const searchRegex = new RegExp(params.search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { address: searchRegex },
      { city: searchRegex },
      { district: searchRegex },
    ];
  }

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 5;
  const skip = (page - 1) * limit;
  const sort = getSort(params.sort);

  const [total, properties] = await Promise.all([
    Property.countDocuments(query),
    Property.find(query).populate('category', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
  ]);

  return {
    success: true,
    count: properties.length,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    },
    data: properties,
    source: 'mongodb',
  };
};

const getSort = (sort = 'newest') => {
  if (sort === 'cheapest' || sort === 'price_asc') return { price: 1 };
  if (sort === 'expensive' || sort === 'price_desc') return { price: -1 };
  if (sort === 'largest' || sort === 'area_desc') return { area: -1 };
  return { createdAt: -1 };
};

module.exports = { listProperties, getProperty };
