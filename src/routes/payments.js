const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/verify', authenticate, paymentController.verifyPayment);
router.post('/failed', authenticate, paymentController.markPaymentFailed);

module.exports = router;
