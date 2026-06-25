const express = require('express');
const {
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
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getProperties);
router.get('/admin/all', protect, adminOnly, getAdminProperties);
router.get('/catalog', getCatalogProperties);
router.get('/featured', getFeaturedProperties);
router.get('/similar/:id', getSimilarProperties);
router.get('/:id', getProperty);

// Any logged-in user can create their own property listing.
router.post('/', protect, createProperty);

// Protected Admin Routes
router.put('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);
router.patch('/:id/status', protect, adminOnly, updatePropertyStatus);

module.exports = router;
