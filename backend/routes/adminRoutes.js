const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/stats', protect, adminOnly, getAdminStats);

module.exports = router;
