const express = require('express');
const { getDashboardMetrics, getMovementDetails } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/metrics', getDashboardMetrics);
router.get('/movement-details', getMovementDetails);

module.exports = router;
