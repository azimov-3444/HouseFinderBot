const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Iltimos, rasm yuklang' });
  }

  // Generate file URLs
  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  
  res.status(200).json({
    success: true,
    urls,
  });
});

module.exports = router;
