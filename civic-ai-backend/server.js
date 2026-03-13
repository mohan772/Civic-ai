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
app.use('/api/complaints', complaintRoutes);

// Database Connection and Data Migration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_ai';
const Complaint = require('./models/Complaint');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    
    try {
      // 1. DATA MIGRATION: Fix documents where 'location' is a string (legacy data)
      // This moves the string to 'address' and provides a default GeoJSON point
      const malformedDocs = await Complaint.find({ location: { $type: "string" } });
      
      if (malformedDocs.length > 0) {
        console.log(`Found ${malformedDocs.length} legacy documents. Migrating...`);
        
        for (let doc of malformedDocs) {
          const oldLocationText = doc.location;
          // Use direct mongo update to bypass schema validation temporarily
          await mongoose.connection.collection('complaints').updateOne(
            { _id: doc._id },
            { 
              $set: { 
                address: oldLocationText,
                location: { type: "Point", coordinates: [77.5946, 12.9716] } // Default coordinates
              } 
            }
          );
        }
        console.log('Migration complete.');
      }

      // 2. ENSURE INDEXES ARE CREATED
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
