const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Infrastructure', 'Sanitation', 'Utilities', 'Transportation', 'Public Services', 'Other'],
    default: 'Other' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium' 
  },
  department: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending' 
  },
  report_count: { type: Number, default: 1 },
  image: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'complaints' }); // Explicitly set collection name

// Explicit 2dsphere index for geospatial queries
complaintSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Complaint', complaintSchema);
