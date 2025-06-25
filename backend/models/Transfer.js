const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  transferNumber: {
    type: String,
    required: [true, 'Transfer number is required'],
    unique: true,
    trim: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: [true, 'Asset is required']
  },
  fromBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: [true, 'From base is required']
  },
  toBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Base',
    required: [true, 'To base is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requested by is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestDate: {
    type: Date,
    required: [true, 'Request date is required'],
    default: Date.now
  },
  approvalDate: {
    type: Date
  },
  shippedDate: {
    type: Date
  },
  receivedDate: {
    type: Date
  },
  expectedDeliveryDate: {
    type: Date,
    required: [true, 'Expected delivery date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'shipped', 'received', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reason: {
    type: String,
    required: [true, 'Transfer reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  transportMethod: {
    type: String,
    enum: ['ground', 'air', 'sea', 'rail'],
    default: 'ground'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Validation to ensure fromBase and toBase are different
transferSchema.pre('save', function(next) {
  if (this.fromBase.toString() === this.toBase.toString()) {
    next(new Error('From base and to base cannot be the same'));
  }
  next();
});

// Index for efficient searching
transferSchema.index({ fromBase: 1, requestDate: -1 });
transferSchema.index({ toBase: 1, requestDate: -1 });
transferSchema.index({ asset: 1, requestDate: -1 });
transferSchema.index({ status: 1, requestDate: -1 });

module.exports = mongoose.model('Transfer', transferSchema);
