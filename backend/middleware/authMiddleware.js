const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Ruxsat berilmagan, token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Ruxsat berilmagan, yaroqsiz token' });
  }
};

module.exports = { protect };
