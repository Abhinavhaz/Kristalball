const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  assignmentNumber: {
    type: String,
    required: [true, 'Assignment number is required'],
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
  assignedTo: {
    personnelId: {
      type: String,
      required: [true, 'Personnel ID is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Personnel name is required'],
      trim: true
    },
    rank: {
      type: String,
      required: [true, 'Personnel rank is required'],
      trim: true
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  assignmentDate: {
    type: Date,
    required: [true, 'Assignment date is required'],
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  expectedReturnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['assigned', 'returned', 'lost', 'damaged', 'expended'],
    default: 'assigned'
  },
  purpose: {
    type: String,
    required: [true, 'Assignment purpose is required'],
    trim: true,
    maxlength: [500, 'Purpose cannot exceed 500 characters']
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assigned by is required']
  },
  condition: {
    atAssignment: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    atReturn: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'damaged', 'lost']
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for efficient searching
assignmentSchema.index({ base: 1, assignmentDate: -1 });
assignmentSchema.index({ asset: 1, assignmentDate: -1 });
assignmentSchema.index({ 'assignedTo.personnelId': 1, assignmentDate: -1 });
assignmentSchema.index({ status: 1, assignmentDate: -1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
