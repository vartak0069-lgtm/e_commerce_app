const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.put('/me', userController.updateProfile);
router.put('/me/password', userController.changePassword);

module.exports = router;
