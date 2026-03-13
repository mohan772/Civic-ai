const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const Complaint = require('../models/Complaint');
const Citizen = require('../models/Citizen'); 
const Notification = require('../models/Notification'); 
const Ticket = require('../models/Ticket'); 
const { classifyComplaint } = require('../services/aiClassifier');
const { detectCategoryByKeywords = () => null } = require('../services/categoryClassifier');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const deptMapping = {
  Infrastructure: 'BBMP Roads',
  Sanitation: 'BBMP Waste Management',
  Utilities: 'BWSSB',
  Transportation: 'Traffic Police',
  'Public Services': 'Municipal Services'
};

// Helper to update trust score and notify citizen
const updateTrustAndNotify = async (phone, delta, message, complaintId) => {
  try {
    const citizen = await Citizen.findOne({ phone });
    if (citizen) {
      citizen.trustScore = Math.min(100, Math.max(0, citizen.trustScore + delta));
      if (delta > 0) citizen.validComplaints += 1;
      if (delta < 0) citizen.fakeComplaints += 1;
      await citizen.save();
    }
    
    await Notification.create({
      userPhone: phone,
      message,
      complaintId
    });
  } catch (err) {
    console.warn("Trust/Notify error:", err.message);
  }
};

// POST: Create Complaint (Requirement 2)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, description, priority: userPriority } = req.body;
    
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ message: "Invalid Indian phone number" });

    let citizen = await Citizen.findOne({ phone });
    if (!citizen) {
      citizen = new Citizen({ phone });
    }
    citizen.totalComplaints += 1;
    await citizen.save();

    const { latitude, longitude, accuracy } = req.body;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const acc = accuracy ? parseFloat(accuracy) : null;

    if (isNaN(lng) || isNaN(lat)) return res.status(400).json({ error: 'Location data required.' });

    const location = { type: "Point", coordinates: [lng, lat] };

    let readableAddress = "Unknown Location";
    try {
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'User-Agent': 'CivicAI-Complaint-Platform' }
      });
      if (geoResponse.data && geoResponse.data.display_name) readableAddress = geoResponse.data.display_name;
    } catch (geoErr) {
      readableAddress = req.body.locationText || "Address Fetch Failed";
    }

    // AI Classification (Requirement 2)
    const keywordCategory = detectCategoryByKeywords(description);
    const aiResult = await classifyComplaint(description);
    
    if (aiResult.isFake) {
      await updateTrustAndNotify(phone, -20, "Your report was classified as invalid/fake by our AI system.", null);
      return res.status(400).json({ error: 'Invalid complaint', reason: aiResult.reason });
    }

    const category = keywordCategory || aiResult.category || 'Public Services';
    const department = aiResult.department || (keywordCategory ? deptMapping[keywordCategory] : 'Municipal Services');
    let finalPriority = ['Low', 'Medium', 'High', 'Critical'].includes(userPriority) ? userPriority : (aiResult.priority || 'Medium');
    
    if (citizen.trustScore > 80) finalPriority = 'High';

    // Duplicate Detection
    const duplicateResults = await Complaint.aggregate([
      { $geoNear: { near: location, distanceField: 'distance', maxDistance: 15, spherical: true, key: 'location', query: { category: category, status: { $ne: 'Resolved' } } } },
      { $limit: 1 }
    ]);

    if (duplicateResults.length > 0) {
      const duplicate = await Complaint.findByIdAndUpdate(duplicateResults[0]._id, { $inc: { report_count: 1 } }, { new: true });
      await updateTrustAndNotify(phone, -5, "Duplicate report detected. Your trust score has been slightly reduced.", duplicate._id);
      return res.status(200).json({ duplicate: true, message: 'Already reported in this area.', complaint: duplicate });
    }

    const newComplaint = new Complaint({
      name, phone, description, category, 
      priority: finalPriority, 
      department,
      status: 'Pending', // Requirement 2: Status remains Pending
      report_count: 1,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      location,
      accuracy: acc,
      address: readableAddress
    });

    const saved = await newComplaint.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Update Complaint Status (Requirement 4 & 5)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (status === 'Accepted') {
      // Requirement 4: Accept Complaint Logic
      complaint.status = 'Accepted';
      complaint.ticketId = "TCK-" + Date.now();
      complaint.ticketStatus = 'Open';
      
      const ticket = new Ticket({
        ticketId: complaint.ticketId,
        complaintId: complaint._id,
        department: complaint.department,
        status: 'Pending'
      });
      
      await ticket.save();
      await complaint.save();
      
      await updateTrustAndNotify(
        complaint.phone, 
        5, 
        `Your complaint has been accepted and assigned to the ${complaint.department} department. Ticket: ${complaint.ticketId}`, 
        complaint._id
      );
    } 
    else if (status === 'Rejected') {
      // Requirement 5: Cancel Complaint Logic
      complaint.status = 'Rejected';
      complaint.rejectionReason = reason;
      await complaint.save();
      
      await updateTrustAndNotify(
        complaint.phone, 
        -20, 
        `Your complaint has been rejected: ${reason}`, 
        complaint._id
      );
    } 
    else {
      complaint.status = status;
      await complaint.save();
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All complaints
router.get('/', async (req, res) => {
  try {
    const { category, status, department } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (department) filter.department = department;
    const data = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
