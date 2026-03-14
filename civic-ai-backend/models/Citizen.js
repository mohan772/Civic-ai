const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  trustScore: { type: Number, default: 50, min: 0, max: 100 },
  points: { type: Number, default: 0 },
  level: { type: String, default: "Citizen Reporter" },
  totalComplaints: { type: Number, default: 0 },
  validComplaints: { type: Number, default: 0 },
  fakeComplaints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Level system logic
const calculateLevel = (points) => {
  if (points <= 50) return "Citizen Reporter";
  if (points <= 150) return "Civic Helper";
  if (points <= 300) return "Community Guardian";
  return "City Champion";
};

// Pre-save hook to update level automatically
citizenSchema.pre('save', function() {
  if (this.isModified('points')) {
    this.level = calculateLevel(this.points);
  }
});

module.exports = mongoose.model('Citizen', citizenSchema);
