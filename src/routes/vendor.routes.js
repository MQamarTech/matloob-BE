const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor/vendor.controller');
console.log('vendor ro0uter is working');

router.get('/', vendorController.getAllVendorsByType);

router.get('/:id', vendorController.getVendorById);
router.post('/', vendorController.createVendor);
router.patch('/:id', vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
