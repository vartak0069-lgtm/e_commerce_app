const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post('/', authenticate, requireRole('admin'), categoryController.createCategory);
router.put('/:id', authenticate, requireRole('admin'), categoryController.updateCategory);
router.delete('/:id', authenticate, requireRole('admin'), categoryController.deleteCategory);

module.exports = router;
