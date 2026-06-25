const express = require('express');
const {
  createContactRequest,
  getContactRequests,
  updateContactRequestStatus,
  deleteContactRequest,
} = require('../controllers/contactRequestController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', createContactRequest);

// Protected Admin Routes
router.get('/', protect, adminOnly, getContactRequests);
router.patch('/:id/status', protect, adminOnly, updateContactRequestStatus);
router.delete('/:id', protect, adminOnly, deleteContactRequest);

module.exports = router;
