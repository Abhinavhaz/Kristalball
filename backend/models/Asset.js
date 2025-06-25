const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [100, 'Asset name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Asset type is required'],
    enum: ['vehicle', 'weapon', 'ammunition', 'equipment', 'supplies'],
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Asset category is required'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    capacity: Number,
    range: Number,
    caliber: String,
    fuelType: String,
    maxSpeed: Number
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    enum: ['piece', 'kg', 'liter', 'meter', 'box', 'crate', 'round'],
    default: 'piece'
  },
  costPerUnit: {
    type: Number,
    required: [true, 'Cost per unit is required'],
    min: [0, 'Cost cannot be negative']
  },
  minimumStock: {
    type: Number,
    default: 0,
    min: [0, 'Minimum stock cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
assetSchema.index({ name: 1, type: 1, category: 1 });
assetSchema.index({ serialNumber: 1 });

module.exports = mongoose.model('Asset', assetSchema);
