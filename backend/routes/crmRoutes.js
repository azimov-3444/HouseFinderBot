const express = require('express');
const { getLeads, createLead, updateLead } = require('../controllers/crmController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Need to be logged in

// We can add a middleware to check if user is Makler, but for now we rely on the controller logic or a custom role check.
router.route('/leads')
  .get(getLeads)
  .post(createLead);

router.route('/leads/:id')
  .put(updateLead);

module.exports = router;
