const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  purchaseOrderNumber: {
    type: String,
    required: [true, 'Purchase order number is required'],
    unique: true,
    trim: true
  },
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
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitCost: {
    type: Number,
    required: [true, 'Unit cost is required'],
    min: [0, 'Unit cost cannot be negative']
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String
    }
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
    default: Date.now
  },
  deliveryDate: {
    type: Date
  },
  expectedDeliveryDate: {
    type: Date,
    required: [true, 'Expected delivery date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'ordered', 'delivered', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Ordered by is required']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Calculate total cost before saving
purchaseSchema.pre('save', function(next) {
  this.totalCost = this.quantity * this.unitCost;
  next();
});

// Index for efficient searching
purchaseSchema.index({ base: 1, purchaseDate: -1 });
purchaseSchema.index({ asset: 1, purchaseDate: -1 });
purchaseSchema.index({ status: 1, purchaseDate: -1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
