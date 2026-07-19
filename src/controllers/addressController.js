const asyncHandler = require('../middleware/asyncHandler');
const Address = require('../models/Address');
const { NotFoundError, ForbiddenError } = require('../utils/errors');

// GET /api/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findByUser(req.user.id);
  res.json({ success: true, data: addresses });
});

// POST /api/addresses
const addAddress = asyncHandler(async (req, res) => {
  if (req.body.is_default) {
    await Address.unsetDefaultForUser(req.user.id);
  }
  const address = await Address.create({ ...req.body, user_id: req.user.id });
  res.status(201).json({ success: true, data: address });
});

// PUT /api/addresses/:id
const updateAddress = asyncHandler(async (req, res) => {
  const existing = await Address.findById(req.params.id);
  if (!existing) throw new NotFoundError('Address not found');
  if (existing.user_id !== req.user.id) throw new ForbiddenError('Not your address');

  if (req.body.is_default) {
    await Address.unsetDefaultForUser(req.user.id);
  }
  const address = await Address.update(req.params.id, req.body);
  res.json({ success: true, data: address });
});

// DELETE /api/addresses/:id
const deleteAddress = asyncHandler(async (req, res) => {
  const existing = await Address.findById(req.params.id);
  if (!existing) throw new NotFoundError('Address not found');
  if (existing.user_id !== req.user.id) throw new ForbiddenError('Not your address');

  await Address.remove(req.params.id);
  res.json({ success: true, message: 'Address deleted' });
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
