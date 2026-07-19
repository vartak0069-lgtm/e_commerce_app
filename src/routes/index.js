const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/cart', require('./cart'));
router.use('/checkout', require('./checkout'));
router.use('/payments', require('./payments'));
router.use('/orders', require('./orders'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));
router.use('/wishlist', require('./wishlist'));
router.use('/addresses', require('./addresses'));
router.use('/search', require('./search'));
router.use('/coupons', require('./coupons'));
router.use('/admin', require('./admin'));

// Health check
router.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

module.exports = router;
