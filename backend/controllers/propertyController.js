const Property = require('../models/Property');

// @desc    Get all properties with filtering, search, sorting and pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const isAdminList = Boolean(req.adminList);
    const isCatalogList = Boolean(req.catalogList);

    // Fields to exclude from direct matching
    const excludeFields = [
      'minPrice',
      'maxPrice',
      'minArea',
      'maxArea',
      'search',
      'sort',
      'page',
      'limit',
    ];
    excludeFields.forEach((param) => delete queryObj[param]);

    if (queryObj.isActive === 'all') {
      delete queryObj.isActive;
    }
    if (queryObj.status === 'all') {
      delete queryObj.status;
    }

    // Build filters
    let query = {};

    // Direct match filters (rooms, propertyType, category, city, district, floor, status, isActive, etc.)
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key]) {
        // If it's a comma-separated list, make it an $in query
        if (typeof queryObj[key] === 'string' && queryObj[key].includes(',')) {
          query[key] = { $in: queryObj[key].split(',') };
        } else {
          query[key] = queryObj[key];
        }
      }
    });

    if (query.isActive === 'true') query.isActive = true;
    if (query.isActive === 'false') query.isActive = false;

    // Default public website listing only returns active-status properties.
    // Bot catalog can show sold/reserved badges while still hiding inactive records.
    if (!isAdminList && !isCatalogList && !query.status) {
      query.status = 'Aktiv';
    }
    if (!isAdminList && query.isActive === undefined) {
      query.isActive = true;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Area range filter
    if (req.query.minArea || req.query.maxArea) {
      query.area = {};
      if (req.query.minArea) query.area.$gte = Number(req.query.minArea);
      if (req.query.maxArea) query.area.$lte = Number(req.query.maxArea);
    }

    // Search filter (text search in title, description, address, city, district)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { city: searchRegex },
        { district: searchRegex },
      ];
    }

    // 1. Initial Mongoose Query Builder
    let queryBuilder = Property.find(query).populate('category', 'name slug');

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort;
      if (sortBy === 'cheapest' || sortBy === 'price_asc') {
        queryBuilder = queryBuilder.sort('price');
      } else if (sortBy === 'expensive' || sortBy === 'price_desc') {
        queryBuilder = queryBuilder.sort('-price');
      } else if (sortBy === 'largest' || sortBy === 'area_desc') {
        queryBuilder = queryBuilder.sort('-area');
      } else if (sortBy === 'newest') {
        queryBuilder = queryBuilder.sort('-createdAt');
      } else {
        queryBuilder = queryBuilder.sort('-createdAt');
      }
    } else {
      queryBuilder = queryBuilder.sort('-createdAt');
    }

    // 3. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const total = await Property.countDocuments(query);

    queryBuilder = queryBuilder.skip(startIndex).limit(limit);

    // Execute query
    const properties = await queryBuilder;

    res.status(200).json({
      success: true,
      count: properties.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties for admin, including inactive/sold/reserved
// @route   GET /api/properties/admin/all
// @access  Private/Admin
const getAdminProperties = async (req, res, next) => {
  req.adminList = true;
  return getProperties(req, res, next);
};

// @desc    Get active catalog properties for Telegram bot, including sold/reserved statuses
// @route   GET /api/properties/catalog
// @access  Public
const getCatalogProperties = async (req, res, next) => {
  req.catalogList = true;
  return getProperties(req, res, next);
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res, next) => {
  try {
    // Increment view count on each retrieval
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug')
      .populate('createdBy', 'name email avatar');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Loyiha topilmadi' });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res, next) => {
  try {
    // Attach current admin user id
    req.body.createdBy = req.user._id;

    // Build sub-arrays from comma separated values if sent as strings (e.g. from FormData)
    if (typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities ? req.body.amenities.split(',') : [];
    }
    if (typeof req.body.nearbyPlaces === 'string') {
      req.body.nearbyPlaces = req.body.nearbyPlaces ? req.body.nearbyPlaces.split(',') : [];
    }
    if (typeof req.body.communications === 'string') {
      req.body.communications = req.body.communications ? req.body.communications.split(',') : [];
    }
    if (typeof req.body.images === 'string') {
      req.body.images = req.body.images ? req.body.images.split(',') : [];
    }

    const property = await Property.create(req.body);

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Mulk topilmadi' });
    }

    // Process lists if sent as strings
    if (typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities ? req.body.amenities.split(',') : [];
    }
    if (typeof req.body.nearbyPlaces === 'string') {
      req.body.nearbyPlaces = req.body.nearbyPlaces ? req.body.nearbyPlaces.split(',') : [];
    }
    if (typeof req.body.communications === 'string') {
      req.body.communications = req.body.communications ? req.body.communications.split(',') : [];
    }
    if (typeof req.body.images === 'string') {
      req.body.images = req.body.images ? req.body.images.split(',') : [];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Mulk topilmadi' });
    }

    await property.deleteOne();

    res.status(200).json({ success: true, message: 'Mulk muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    next(error);
  }
};

// @desc    Patch property status
// @route   PATCH /api/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['Aktiv', 'Sotilgan', 'Band qilingan'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Noto‘g‘ri status yuborildi' });
  }

  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Mulk topilmadi' });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ isFeatured: true, status: 'Aktiv', isActive: true })
      .populate('category', 'name slug')
      .limit(6);

    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/similar/:id
// @access  Public
const getSimilarProperties = async (req, res, next) => {
  try {
    const currentProperty = await Property.findById(req.params.id);

    if (!currentProperty) {
      return res.status(404).json({ success: false, message: 'Mulk topilmadi' });
    }

    // Find similar properties: same category OR same propertyType, active, not itself
    const similar = await Property.find({
      _id: { $ne: currentProperty._id },
      status: 'Aktiv',
      isActive: true,
      $or: [
        { category: currentProperty.category },
        { propertyType: currentProperty.propertyType },
      ],
    })
      .populate('category', 'name slug')
      .limit(4);

    res.status(200).json({ success: true, count: similar.length, data: similar });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getAdminProperties,
  getCatalogProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  getFeaturedProperties,
  getSimilarProperties,
};
