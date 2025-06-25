const Inventory = require('../models/Inventory');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Base = require('../models/Base');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard/metrics
// @access  Private
const getDashboardMetrics = async (req, res) => {
  try {
    const { baseId, assetType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.assignedBase?._id;

    // Build base filter based on user role
    let baseFilter = {};
    if (userRole !== 'admin') {
      baseFilter = { base: userBaseId };
    } else if (baseId) {
      baseFilter = { base: baseId };
    }

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Build asset filter
    let assetFilter = {};
    if (assetType) {
      const assets = await Asset.find({ type: assetType }).select('_id');
      assetFilter = { asset: { $in: assets.map(a => a._id) } };
    }

    // Combine filters
    const inventoryFilter = { ...baseFilter, ...assetFilter };
    const transactionFilter = { ...baseFilter, ...assetFilter, ...dateFilter };

    // Get inventory metrics
    const inventoryMetrics = await Inventory.aggregate([
      { $match: inventoryFilter },
      {
        $lookup: {
          from: 'assets',
          localField: 'asset',
          foreignField: '_id',
          as: 'assetInfo'
        }
      },
      { $unwind: '$assetInfo' },
      {
        $group: {
          _id: null,
          totalOpeningBalance: { $sum: '$openingBalance' },
          totalCurrentStock: { $sum: '$currentStock' },
          totalPurchased: { $sum: '$totalPurchased' },
          totalTransferredIn: { $sum: '$totalTransferredIn' },
          totalTransferredOut: { $sum: '$totalTransferredOut' },
          totalAssigned: { $sum: '$totalAssigned' },
          totalExpended: { $sum: '$totalExpended' }
        }
      }
    ]);

    const metrics = inventoryMetrics[0] || {
      totalOpeningBalance: 0,
      totalCurrentStock: 0,
      totalPurchased: 0,
      totalTransferredIn: 0,
      totalTransferredOut: 0,
      totalAssigned: 0,
      totalExpended: 0
    };

    // Calculate derived metrics
    const netMovement = metrics.totalPurchased + metrics.totalTransferredIn - metrics.totalTransferredOut;
    const closingBalance = metrics.totalOpeningBalance + netMovement - metrics.totalAssigned - metrics.totalExpended;

    // Get recent activities
    const recentPurchases = await Purchase.find(transactionFilter)
      .populate('asset', 'name type')
      .populate('base', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTransfers = await Transfer.find(transactionFilter)
      .populate('asset', 'name type')
      .populate('fromBase', 'name code')
      .populate('toBase', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAssignments = await Assignment.find(transactionFilter)
      .populate('asset', 'name type')
      .populate('base', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get low stock alerts
    const lowStockItems = await Inventory.find({
      ...inventoryFilter,
      $expr: { $lte: ['$currentStock', '$minimumStock'] }
    })
      .populate('asset', 'name type minimumStock')
      .populate('base', 'name code')
      .limit(10);

    res.json({
      success: true,
      data: {
        metrics: {
          openingBalance: metrics.totalOpeningBalance,
          closingBalance,
          netMovement,
          currentStock: metrics.totalCurrentStock,
          totalPurchased: metrics.totalPurchased,
          totalTransferredIn: metrics.totalTransferredIn,
          totalTransferredOut: metrics.totalTransferredOut,
          totalAssigned: metrics.totalAssigned,
          totalExpended: metrics.totalExpended
        },
        recentActivities: {
          purchases: recentPurchases,
          transfers: recentTransfers,
          assignments: recentAssignments
        },
        alerts: {
          lowStockItems
        }
      }
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard metrics'
    });
  }
};

// @desc    Get movement details (for popup)
// @route   GET /api/dashboard/movement-details
// @access  Private
const getMovementDetails = async (req, res) => {
  try {
    const { baseId, assetType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.assignedBase?._id;

    // Build filters (same as above)
    let baseFilter = {};
    if (userRole !== 'admin') {
      baseFilter = { base: userBaseId };
    } else if (baseId) {
      baseFilter = { base: baseId };
    }

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    let assetFilter = {};
    if (assetType) {
      const assets = await Asset.find({ type: assetType }).select('_id');
      assetFilter = { asset: { $in: assets.map(a => a._id) } };
    }

    const filter = { ...baseFilter, ...assetFilter, ...dateFilter };

    // Get detailed movement data
    const purchases = await Purchase.find(filter)
      .populate('asset', 'name type')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank')
      .sort({ createdAt: -1 });

    const transfersIn = await Transfer.find({ 
      ...filter, 
      toBase: userRole === 'admin' ? (baseId || { $exists: true }) : userBaseId 
    })
      .populate('asset', 'name type')
      .populate('fromBase', 'name code')
      .populate('toBase', 'name code')
      .sort({ createdAt: -1 });

    const transfersOut = await Transfer.find({ 
      ...filter, 
      fromBase: userRole === 'admin' ? (baseId || { $exists: true }) : userBaseId 
    })
      .populate('asset', 'name type')
      .populate('fromBase', 'name code')
      .populate('toBase', 'name code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        purchases,
        transfersIn,
        transfersOut
      }
    });
  } catch (error) {
    console.error('Movement details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movement details'
    });
  }
};

module.exports = {
  getDashboardMetrics,
  getMovementDetails
};
