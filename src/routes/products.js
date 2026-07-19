const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateProduct, validateReview } = require('../middleware/validation');

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:slug', productController.getProductBySlug);

// Reviews nested under a product
router.get('/:productId/reviews', reviewController.getProductReviews);
router.post('/:productId/reviews', authenticate, validateReview, reviewController.addReview);

// Admin only
router.post('/', authenticate, requireRole('admin'), validateProduct, productController.createProduct);
router.put('/:id', authenticate, requireRole('admin'), productController.updateProduct);
router.delete('/:id', authenticate, requireRole('admin'), productController.deleteProduct);

module.exports = router;
