const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { authenticate } = require('../middleware/auth');

router.post('/initiate', authenticate, checkoutController.initiateCheckout);

module.exports = router;
