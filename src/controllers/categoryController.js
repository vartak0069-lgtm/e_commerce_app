const asyncHandler = require('../middleware/asyncHandler');
const Category = require('../models/Category');
const { generateSlug } = require('../utils/formatters');
const { NotFoundError } = require('../utils/errors');

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.json({ success: true, data: categories });
});

// GET /api/categories/:slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findBySlug(req.params.slug);
  if (!category) throw new NotFoundError('Category not found');
  res.json({ success: true, data: category });
});

// POST /api/admin/categories (admin)
const createCategory = asyncHandler(async (req, res) => {
  const slug = generateSlug(req.body.name);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ success: true, data: category });
});

// PUT /api/admin/categories/:id (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  if (updates.name) updates.slug = generateSlug(updates.name);
  const category = await Category.update(req.params.id, updates);
  res.json({ success: true, data: category });
});

// DELETE /api/admin/categories/:id (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  await Category.remove(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
