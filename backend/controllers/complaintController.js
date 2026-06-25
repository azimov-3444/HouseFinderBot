const Complaint = require('../models/Complaint');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit a complaint for a property
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = asyncHandler(async (req, res, next) => {
  const { property, reason, description } = req.body;

  const complaint = await Complaint.create({
    property,
    user: req.user.id,
    reason,
    description
  });

  res.status(201).json({
    success: true,
    data: complaint,
    message: "Shikoyatingiz qabul qilindi va moderatorlarga yuborildi."
  });
});

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private/Admin
exports.getComplaints = asyncHandler(async (req, res, next) => {
  const complaints = await Complaint.find().populate('property', 'title').populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: complaints.length,
    data: complaints
  });
});
