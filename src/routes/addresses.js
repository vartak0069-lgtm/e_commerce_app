const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticate } = require('../middleware/auth');
const { validateAddress } = require('../middleware/validation');

router.use(authenticate);

router.get('/', addressController.getAddresses);
router.post('/', validateAddress, addressController.addAddress);
router.put('/:id', validateAddress, addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
