const asyncHandler = require('../middleware/asyncHandler');
const Wishlist = require('../models/Wishlist');

// GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.findByUser(req.user.id);
  res.json({ success: true, data: items });
});

// POST /api/wishlist/:productId
const addToWishlist = asyncHandler(async (req, res) => {
  const item = await Wishlist.add(req.user.id, req.params.productId);
  res.status(201).json({ success: true, data: item });
});

// DELETE /api/wishlist/:productId
const removeFromWishlist = asyncHandler(async (req, res) => {
  await Wishlist.remove(req.user.id, req.params.productId);
  res.json({ success: true, message: 'Removed from wishlist' });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
