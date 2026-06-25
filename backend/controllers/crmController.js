const Lead = require('../models/Lead');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all leads for a makler
// @route   GET /api/crm/leads
// @access  Private (Makler only)
exports.getLeads = asyncHandler(async (req, res, next) => {
  const leads = await Lead.find({ makler: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

// @desc    Create a new lead
// @route   POST /api/crm/leads
// @access  Private (Makler only)
exports.createLead = asyncHandler(async (req, res, next) => {
  req.body.makler = req.user.id;

  const lead = await Lead.create(req.body);

  res.status(201).json({
    success: true,
    data: lead,
  });
});

// @desc    Update a lead
// @route   PUT /api/crm/leads/:id
// @access  Private (Makler only)
exports.updateLead = asyncHandler(async (req, res, next) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse('Mijoz topilmadi', 404));
  }

  // Make sure lead belongs to makler
  if (lead.makler.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Sizda bu mijozni tahrirlash huquqi yoq', 401));
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: lead,
  });
});
