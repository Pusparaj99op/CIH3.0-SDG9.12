const mongoose = require('mongoose');

const bondSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bond name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  issuer: {
    type: String,
    required: [true, 'Issuer is required'],
    trim: true
  },
  returnRate: {
    type: Number,
    required: [true, 'Return rate is required'],
    min: [0, 'Return rate cannot be negative'],
    max: [100, 'Return rate cannot exceed 100%']
  },
  riskLevel: {
    type: String,
    required: [true, 'Risk level is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Risk level must be Low, Medium, or High'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  maturityYears: {
    type: Number,
    required: [true, 'Maturity years is required'],
    min: [1, 'Maturity must be at least 1 year']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  sector: {
    type: String,
    required: [true, 'Sector is required'],
    trim: true
  },
  totalValue: {
    type: Number,
    default: 0
  },
  availableUnits: {
    type: Number,
    default: 0
  },
  launchDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bondSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search
bondSchema.index({ name: 'text', issuer: 'text', description: 'text' });

module.exports = mongoose.model('Bond', bondSchema);
