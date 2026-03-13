const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    unique: true, 
    default: () => 'TKT-' + Math.floor(100000 + Math.random() * 900000) 
  },
  complaintId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Complaint', 
    required: true 
  },
  department: { type: String, required: true },
  assignedAuthority: { type: String, default: 'Duty Officer' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'], 
    default: 'Pending' 
  },
  resolutionPhoto: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

module.exports = mongoose.model('Ticket', ticketSchema);
