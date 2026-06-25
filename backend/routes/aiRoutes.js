const express = require('express');
const { evaluatePrice, recommendProperties, chatWithAi } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/evaluate-price', protect, evaluatePrice);
router.post('/recommend', recommendProperties);
router.post('/chat', chatWithAi);

module.exports = router;
