const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Essential Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists and serve static files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Route Registration
const complaintRoutes = require('./routes/complaints');
const statsRoutes = require('./routes/stats');
const allocationRoutes = require('./routes/allocation');
const ticketRoutes = require('./routes/tickets');
const notificationRoutes = require('./routes/notifications'); // Requirement 7
const analyticsRoutes = require('./routes/analytics');

app.use('/api/complaints', complaintRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/resource-allocation', allocationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes); // Requirement 7
app.use('/api/analytics', analyticsRoutes);

// Database Connection and Data Migration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_ai';
const Complaint = require('./models/Complaint');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    
    try {
      // 1. DATA MIGRATION: Fix legacy documents missing 'phone' or having string 'location'
      const legacyDocs = await Complaint.find({ 
        $or: [
          { location: { $type: "string" } },
          { phone: { $exists: false } }
        ] 
      });
      
      if (legacyDocs.length > 0) {
        console.log(`Found ${legacyDocs.length} legacy documents. Migrating...`);
        
        for (let doc of legacyDocs) {
          const update = {};
          if (typeof doc.location === 'string') {
            update.address = doc.location;
            update.location = { type: "Point", coordinates: [77.5946, 12.9716] };
          }
          if (!doc.phone) {
            update.phone = "0000000000"; // Fallback for legacy data
          }
          
          await mongoose.connection.collection('complaints').updateOne(
            { _id: doc._id },
            { $set: update }
          );
        }
        console.log('Migration complete.');
      }

      await Complaint.createIndexes();
      console.log('Geospatial indexes verified and active');
    } catch (err) {
      console.error('Initialization error (Migration/Indexing):', err.message);
    }

    app.listen(PORT, () => console.log(`Backend server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
