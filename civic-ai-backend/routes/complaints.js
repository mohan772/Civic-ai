const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');
const { classifyComplaint } = require('../services/aiClassifier');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST: Create or Update a Complaint (with AI Intelligence & Robust Duplicate Detection)
router.post('/', upload.single('image'), async (req, res) => {
  console.log('--- Incoming Request ---');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  try {
    const { name, location: address, description } = req.body;
    
    // 1. Validate coordinates
    const lng = parseFloat(req.body.lng);
    const lat = parseFloat(req.body.lat);

    // Reject if coordinates are missing, NaN, or [0,0]
    if (isNaN(lng) || isNaN(lat) || (lng === 0 && lat === 0)) {
      return res.status(400).json({ error: 'Invalid location coordinates. Please provide a valid location.' });
    }

    // Strict GeoJSON range validation
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Coordinates out of valid range (Lng: -180 to 180, Lat: -90 to 90).' });
    }

    console.log('Validated coordinates:', { lng, lat });

    // 2. AI Classification and Validation
    const aiResult = await classifyComplaint(description);
    
    // Reject fake/invalid complaints
    if (aiResult.isFake) {
      console.log('Complaint rejected (isFake):', aiResult.reason);
      return res.status(400).json({
        error: 'Invalid complaint',
        reason: aiResult.reason
      });
    }

    const category = aiResult.category || 'Other';
    const department = aiResult.department || 'General';
    const priority = aiResult.priority || 'Medium';

    // 3. DUPLICATE DETECTION using $geoNear (Aggressive 15m radius)
    // We check for duplicates BEFORE saving the new document to prevent self-matching
    const duplicateResults = await Complaint.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: 15, // Reduced radius to 15 meters
          spherical: true,
          key: 'location', 
          query: { 
            category: category,
            status: { $ne: 'Resolved' }
          }
        }
      },
      { $limit: 1 }
    ]);

    if (duplicateResults.length > 0) {
      const duplicate = await Complaint.findById(duplicateResults[0]._id);
      duplicate.report_count += 1;
      await duplicate.save();
      
      console.log('Duplicate detected within 15m radius, increased report_count');
      return res.status(200).json({ 
        duplicate: true, 
        message: 'This issue has already been reported by someone else in this area.',
        complaint: duplicate
      });
    }

    // 4. Create new complaint (GeoJSON format)
    const newComplaint = new Complaint({
      name,
      address,
      description,
      category,
      priority,
      department,
      report_count: 1,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // [longitude, latitude]
      }
    });

    const saved = await newComplaint.save();
    console.log('New complaint saved:', saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error processing complaint:', err.message);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

// GET: All complaints
router.get('/', async (req, res) => {
  try {
    const data = await Complaint.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
