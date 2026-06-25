const Property = require('../models/Property');
const Category = require('../models/Category');
const ContactRequest = require('../models/ContactRequest');

// @desc    Get admin panel statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeProperties = await Property.countDocuments({ status: 'Aktiv', isActive: true });
    const soldProperties = await Property.countDocuments({ status: 'Sotilgan' });
    const totalRequests = await ContactRequest.countDocuments();
    const newRequests = await ContactRequest.countDocuments({ status: 'new' });
    const totalCategories = await Category.countDocuments();

    // Fetch recent 5 properties
    const recentProperties = await Property.find()
      .populate('category', 'name')
      .sort('-createdAt')
      .limit(5);

    // Fetch recent 5 contact requests
    const recentRequests = await ContactRequest.find()
      .populate('propertyId', 'title')
      .sort('-createdAt')
      .limit(5);

    // Fetch views statistics - total and top properties
    const totalViewsArr = await Property.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = totalViewsArr.length > 0 ? totalViewsArr[0].totalViews : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProperties,
          activeProperties,
          soldProperties,
          totalRequests,
          newRequests,
          totalCategories,
          totalViews,
        },
        recentProperties,
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
