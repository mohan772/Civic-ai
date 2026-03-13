const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  trustScore: { type: Number, default: 50, min: 0, max: 100 },
  totalComplaints: { type: Number, default: 0 },
  validComplaints: { type: Number, default: 0 },
  fakeComplaints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Citizen', citizenSchema);
