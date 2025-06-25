const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Base name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Base name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Base code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Base code cannot exceed 10 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'USA'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  commander: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  establishedDate: {
    type: Date,
    required: [true, 'Established date is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient searching
baseSchema.index({ name: 1, code: 1 });
baseSchema.index({ 'location.city': 1, 'location.state': 1 });

module.exports = mongoose.model('Base', baseSchema);
