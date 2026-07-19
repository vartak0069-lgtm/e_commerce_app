const asyncHandler = require('../middleware/asyncHandler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { NotFoundError, ConflictError, ForbiddenError } = require('../utils/errors');

// GET /api/products/:productId/reviews
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.findByProduct(req.params.productId);
  res.json({ success: true, data: reviews });
});

// POST /api/products/:productId/reviews
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment, order_id } = req.body;

  const existing = await Review.findOneByUserProduct(req.user.id, productId);
  if (existing) throw new ConflictError('You have already reviewed this product');

  const review = await Review.create({
    product_id: productId,
    user_id: req.user.id,
    order_id,
    rating,
    comment,
  });

  const { avg, count } = await Review.getAverageRating(productId);
  await Product.update(productId, { avg_rating: avg, total_reviews: count });

  res.status(201).json({ success: true, data: review });
});

// PUT /api/reviews/:id
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.update(req.params.id, { rating, comment });

  const { avg, count } = await Review.getAverageRating(review.product_id);
  await Product.update(review.product_id, { avg_rating: avg, total_reviews: count });

  res.json({ success: true, data: review });
});

// DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  await Review.remove(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { getProductReviews, addReview, updateReview, deleteReview };
