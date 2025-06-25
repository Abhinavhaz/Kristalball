const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset is required']
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: [true, 'Base is required']
  },
  openingBalance: {
    type: Number,
    required: [true, 'Opening balance is required'],
    min: [0, 'Opening balance cannot be negative'],
    default: 0
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Current stock cannot be negative'],
    default: 0
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: [0, 'Reserved stock cannot be negative']
  },
  availableStock: {
    type: Number,
    default: 0,
    min: [0, 'Available stock cannot be negative']
  },
  totalPurchased: {
    type: Number,
    default: 0,
    min: [0, 'Total purchased cannot be negative']
  },
  totalTransferredIn: {
    type: Number,
    default: 0,
    min: [0, 'Total transferred in cannot be negative']
  },
  totalTransferredOut: {
    type: Number,
    default: 0,
    min: [0, 'Total transferred out cannot be negative']
  },
  totalAssigned: {
    type: Number,
    default: 0,
    min: [0, 'Total assigned cannot be negative']
  },
  totalExpended: {
    type: Number,
    default: 0,
    min: [0, 'Total expended cannot be negative']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastCountDate: {
    type: Date
  },
  location: {
    warehouse: String,
    section: String,
    shelf: String,
    bin: String
  }
}, {
  timestamps: true
});

// Calculate available stock before saving
inventorySchema.pre('save', function(next) {
  this.availableStock = this.currentStock - this.reservedStock;
  this.lastUpdated = new Date();
  next();
});

// Calculate net movement
inventorySchema.virtual('netMovement').get(function() {
  return this.totalPurchased + this.totalTransferredIn - this.totalTransferredOut;
});

// Calculate closing balance
inventorySchema.virtual('closingBalance').get(function() {
  return this.openingBalance + this.netMovement - this.totalAssigned - this.totalExpended;
});

// Ensure unique combination of asset and base
inventorySchema.index({ asset: 1, base: 1 }, { unique: true });
inventorySchema.index({ base: 1, currentStock: -1 });

module.exports = mongoose.model('Inventory', inventorySchema);
