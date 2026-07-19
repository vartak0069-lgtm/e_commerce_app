const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { NotFoundError } = require('../utils/errors');
const { paginate, generateSlug } = require('../utils/formatters');

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, category, search, minPrice, maxPrice, sortBy, sortOrder } = req.query;
  const { from, to } = paginate(page, limit);

  const { data, count } = await Product.findAll({
    from,
    to,
    categoryId: category,
    search,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  res.json({ success: true, data, meta: { total: count, page: Number(page) || 1, limit: Number(limit) || 12 } });
});

// GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findFeatured();
  res.json({ success: true, data: products });
});

// GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findBySlug(req.params.slug);
  if (!product) throw new NotFoundError('Product not found');
  res.json({ success: true, data: product });
});

// POST /api/products (admin only)
const createProduct = asyncHandler(async (req, res) => {
  const slug = generateSlug(req.body.name);
  const product = await Product.create({ ...req.body, slug });
  await Inventory.logChange(product.id, product.stock_quantity, 'initial_stock');
  res.status(201).json({ success: true, data: product });
});

// PUT /api/products/:id (admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) throw new NotFoundError('Product not found');

  const updates = { ...req.body };
  if (updates.name) updates.slug = generateSlug(updates.name);

  const product = await Product.update(req.params.id, updates);
  res.json({ success: true, data: product });
});

// DELETE /api/products/:id (admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const existing = await Product.findById(req.params.id);
  if (!existing) throw new NotFoundError('Product not found');
  await Product.remove(req.params.id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
