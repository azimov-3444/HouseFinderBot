const ContactRequest = require('../models/ContactRequest');
const Property = require('../models/Property');

// @desc    Submit a contact request for a property
// @route   POST /api/contact-requests
// @access  Public
const createContactRequest = async (req, res, next) => {
  const { propertyId, name, phone, email, message, source, telegramId, telegramUsername } = req.body;

  try {
    if (!propertyId || !name || !phone) {
      return res.status(400).json({ success: false, message: 'Iltimos, barcha majburiy maydonlarni to‘ldiring' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Mulk topilmadi' });
    }

    const contactRequest = await ContactRequest.create({
      propertyId,
      name,
      phone,
      email,
      message,
      source,
      telegramId,
      telegramUsername,
    });

    res.status(201).json({ success: true, data: contactRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact requests (Admin only)
// @route   GET /api/contact-requests
// @access  Private/Admin
const getContactRequests = async (req, res, next) => {
  try {
    const requests = await ContactRequest.find()
      .populate('propertyId', 'title price currency address city district')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact request status (Admin only)
// @route   PATCH /api/contact-requests/:id/status
// @access  Private/Admin
const updateContactRequestStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['new', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Noto‘g‘ri status yuborildi' });
  }

  try {
    let request = await ContactRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Ariza topilmadi' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact request (Admin only)
// @route   DELETE /api/contact-requests/:id
// @access  Private/Admin
const deleteContactRequest = async (req, res, next) => {
  try {
    const request = await ContactRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Ariza topilmadi' });
    }

    await request.deleteOne();

    res.status(200).json({ success: true, message: 'Ariza muvaffaqiyatli o‘chirildi' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContactRequest,
  getContactRequests,
  updateContactRequestStatus,
  deleteContactRequest,
};
