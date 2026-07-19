const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const { paginate } = require('../utils/formatters');
const { ValidationError } = require('../utils/errors');

// GET /api/search?q=...
const searchProducts = asyncHandler(async (req, res) => {
  const { q, page, limit, minPrice, maxPrice, category, sortBy, sortOrder } = req.query;
  if (!q || q.trim().length < 1) throw new ValidationError('Search query is required');

  const { from, to } = paginate(page, limit);
  const { data, count } = await Product.findAll({
    from,
    to,
    search: q,
    categoryId: category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  res.json({ success: true, data, meta: { total: count, query: q } });
});

module.exports = { searchProducts };
