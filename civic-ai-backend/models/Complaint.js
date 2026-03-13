const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
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
    enum: ['Pending', 'Accepted', 'Rejected', 'Assigned', 'Resolved'],
    default: 'Pending' 
  },
  ticketId: { type: String }, // Requirement 4
  ticketStatus: { type: String, default: 'Open' }, // Requirement 3
  rejectionReason: { type: String },
  report_count: { type: Number, default: 1 },
  image: { type: String },
  cancelReason: { type: String },
  cancelledAt: { type: Date },
  accuracy: { type: Number },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { collection: 'complaints' });

complaintSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Complaint', complaintSchema);
