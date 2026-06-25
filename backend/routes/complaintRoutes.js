const express = require('express');
const { createComplaint, getComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createComplaint)
  .get(protect, adminOnly, getComplaints);

module.exports = router;
