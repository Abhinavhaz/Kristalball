const express = require('express');
const { body } = require('express-validator');
const {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  approvePurchase,
  deliverPurchase
} = require('../controllers/purchaseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const purchaseValidation = [
  body('asset')
    .isMongoId()
    .withMessage('Valid asset ID is required'),
  body('base')
    .isMongoId()
    .withMessage('Valid base ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('unitCost')
    .isFloat({ min: 0 })
    .withMessage('Unit cost must be a positive number'),
  body('supplier.name')
    .isLength({ min: 1 })
    .withMessage('Supplier name is required')
    .trim(),
  body('expectedDeliveryDate')
    .isISO8601()
    .withMessage('Valid expected delivery date is required')
];

// Routes
router.route('/')
  .get(getPurchases)
  .post(purchaseValidation, createPurchase);

router.route('/:id')
  .get(getPurchase)
  .put(updatePurchase);

router.put('/:id/approve', authorize('admin', 'base_commander'), approvePurchase);
router.put('/:id/deliver', deliverPurchase);

module.exports = router;
