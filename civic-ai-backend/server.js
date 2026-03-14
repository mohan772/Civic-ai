const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Models
const Complaint = require('./models/Complaint');
const Admin = require('./models/Admin');

// Import Routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const statsRoutes = require('./routes/stats');
const allocationRoutes = require('./routes/allocation');
const ticketRoutes = require('./routes/tickets');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const leaderboardRoutes = require('./routes/leaderboard');

// Import Middleware
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// 2. ROUTE REGISTRATION

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
console.log("✔ Public routes loaded (Auth, Leaderboard)");

// Complaints Route Logic
// Allow POST (submission) to be public
// Allow GET (tracking) to be public for everyone to see all complaints
app.use('/api/complaints', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'GET') {
    return next(); // Public access for both submitting and viewing
  }
  return verifyToken(req, res, next); 
}, complaintRoutes);
console.log("✔ Complaints routes loaded (POST public, others protected)");

// Other Protected Routes (Require JWT)
app.use('/api/stats', verifyToken, statsRoutes);
app.use('/api/resource-allocation', verifyToken, allocationRoutes);
app.use('/api/tickets', verifyToken, ticketRoutes);
app.use('/api/notifications', verifyToken, notificationRoutes);
app.use('/api/analytics', verifyToken, analyticsRoutes);
console.log("✔ Protected Administrative routes loaded");

// 3. DATABASE & SERVER START
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✔ Successfully connected to MongoDB');
    
    // Default Admin Creation
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const defaultAdmin = new Admin({
          email: 'admin@city.gov',
          password: 'AdminPassword123'
        });
        await defaultAdmin.save();
        console.log('ℹ Default admin created: admin@city.gov / AdminPassword123');
      }
    } catch (adminErr) {
      console.error('✘ Error creating default admin:', adminErr.message);
    }
    
    // Data Migration & Indexing
    try {
      const legacyDocs = await Complaint.find({ 
        $or: [
          { location: { $type: "string" } },
          { phone: { $exists: false } }
        ] 
      });
      
      if (legacyDocs.length > 0) {
        for (let doc of legacyDocs) {
          const update = {};
          if (typeof doc.location === 'string') {
            update.address = doc.location;
            update.location = { type: "Point", coordinates: [77.5946, 12.9716] };
          }
          if (!doc.phone) update.phone = "0000000000";
          
          await mongoose.connection.collection('complaints').updateOne(
            { _id: doc._id },
            { $set: update }
          );
        }
      }
      await Complaint.createIndexes();
    } catch (err) {
      console.error('✘ Initialization error:', err.message);
    }

    app.listen(PORT, () => console.log(`🚀 Backend server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('✘ Database connection error:', err.message);
    process.exit(1);
  });
