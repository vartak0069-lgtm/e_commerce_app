const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');

const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const couponController = require('../controllers/couponController');
const inventoryController = require('../controllers/inventoryController');
const analyticsController = require('../controllers/analyticsController');

// All admin routes require login + admin role
router.use(authenticate, requireRole('admin'));

// Orders management
router.get('/orders', orderController.getAllOrders);
router.patch('/orders/:id/status', orderController.updateOrderStatus);

// Users management
router.get('/users', userController.getAllUsers);
router.patch('/users/:id/role', userController.updateUserRole);

// Coupons management
router.get('/coupons', couponController.getAllCoupons);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

// Inventory management
router.get('/inventory/:productId', inventoryController.getProductInventory);
router.post('/inventory/:productId/restock', inventoryController.restockProduct);

// Analytics / reports
router.get('/analytics/sales', analyticsController.getSalesReport);
router.get('/analytics/top-products', analyticsController.getTopProducts);

module.exports = router;
