const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Ruxsat berilmagan, faqat adminlar kirishi mumkin' });
  }
};

module.exports = { adminOnly };
