const { validationResult } = require('express-validator');
const Purchase = require('../models/Purchase');
const Inventory = require('../models/Inventory');
const Asset = require('../models/Asset');

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private
const getPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, baseId, assetType, startDate, endDate, status } = req.query;
    const userRole = req.user.role;
    const userBaseId = req.user.assignedBase?._id;

    // Build filter based on user role
    let filter = {};
    if (userRole !== 'admin') {
      filter.base = userBaseId;
    } else if (baseId) {
      filter.base = baseId;
    }

    // Add additional filters
    if (status) filter.status = status;
    
    if (startDate && endDate) {
      filter.purchaseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Asset type filter
    if (assetType) {
      const assets = await Asset.find({ type: assetType }).select('_id');
      filter.asset = { $in: assets.map(a => a._id) };
    }

    const purchases = await Purchase.find(filter)
      .populate('asset', 'name type category unitOfMeasure')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank')
      .populate('approvedBy', 'firstName lastName rank')
      .sort({ purchaseDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Purchase.countDocuments(filter);

    res.json({
      success: true,
      data: purchases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchases'
    });
  }
};

// @desc    Get single purchase
// @route   GET /api/purchases/:id
// @access  Private
const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('asset', 'name type category unitOfMeasure costPerUnit')
      .populate('base', 'name code location')
      .populate('orderedBy', 'firstName lastName rank email')
      .populate('approvedBy', 'firstName lastName rank email');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Check access permissions
    const userRole = req.user.role;
    const userBaseId = req.user.assignedBase?._id?.toString();
    
    if (userRole !== 'admin' && purchase.base._id.toString() !== userBaseId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase'
    });
  }
};

// @desc    Create new purchase
// @route   POST /api/purchases
// @access  Private
const createPurchase = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      asset,
      base,
      quantity,
      unitCost,
      supplier,
      expectedDeliveryDate,
      notes
    } = req.body;

    // Generate purchase order number
    const lastPurchase = await Purchase.findOne().sort({ createdAt: -1 });
    const orderNumber = `PO-${Date.now()}-${(lastPurchase?.purchaseOrderNumber?.split('-')[2] || 0) + 1}`;

    // Create purchase
    const purchase = await Purchase.create({
      purchaseOrderNumber: orderNumber,
      asset,
      base,
      quantity,
      unitCost,
      totalCost: quantity * unitCost,
      supplier,
      expectedDeliveryDate,
      orderedBy: req.user.id,
      notes
    });

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('asset', 'name type category unitOfMeasure')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank');

    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: populatedPurchase
    });
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating purchase'
    });
  }
};

// @desc    Update purchase
// @route   PUT /api/purchases/:id
// @access  Private
const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    // Check permissions
    const userRole = req.user.role;
    const userBaseId = req.user.assignedBase?._id?.toString();
    
    if (userRole !== 'admin' && purchase.base.toString() !== userBaseId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update purchase
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('asset', 'name type category unitOfMeasure')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank')
      .populate('approvedBy', 'firstName lastName rank');

    res.json({
      success: true,
      message: 'Purchase updated successfully',
      data: updatedPurchase
    });
  } catch (error) {
    console.error('Update purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating purchase'
    });
  }
};

// @desc    Approve purchase
// @route   PUT /api/purchases/:id/approve
// @access  Private (Admin or Base Commander)
const approvePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    if (purchase.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Purchase is not in pending status'
      });
    }

    // Update purchase status and approver
    purchase.status = 'approved';
    purchase.approvedBy = req.user.id;
    await purchase.save();

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('asset', 'name type category unitOfMeasure')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank')
      .populate('approvedBy', 'firstName lastName rank');

    res.json({
      success: true,
      message: 'Purchase approved successfully',
      data: populatedPurchase
    });
  } catch (error) {
    console.error('Approve purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving purchase'
    });
  }
};

// @desc    Mark purchase as delivered
// @route   PUT /api/purchases/:id/deliver
// @access  Private
const deliverPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    if (purchase.status !== 'ordered') {
      return res.status(400).json({
        success: false,
        message: 'Purchase must be in ordered status to mark as delivered'
      });
    }

    // Update purchase status
    purchase.status = 'delivered';
    purchase.deliveryDate = new Date();
    await purchase.save();

    // Update inventory
    let inventory = await Inventory.findOne({
      asset: purchase.asset,
      base: purchase.base
    });

    if (!inventory) {
      inventory = new Inventory({
        asset: purchase.asset,
        base: purchase.base,
        openingBalance: 0,
        currentStock: 0
      });
    }

    inventory.currentStock += purchase.quantity;
    inventory.totalPurchased += purchase.quantity;
    await inventory.save();

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('asset', 'name type category unitOfMeasure')
      .populate('base', 'name code')
      .populate('orderedBy', 'firstName lastName rank')
      .populate('approvedBy', 'firstName lastName rank');

    res.json({
      success: true,
      message: 'Purchase marked as delivered and inventory updated',
      data: populatedPurchase
    });
  } catch (error) {
    console.error('Deliver purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking purchase as delivered'
    });
  }
};

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  approvePurchase,
  deliverPurchase
};
