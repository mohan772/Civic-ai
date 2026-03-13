const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Ticket = require('../models/Ticket');
const Complaint = require('../models/Complaint');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, 'res-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// POST: Raise Ticket (Admin)
router.post('/raise', async (req, res) => {
  try {
    const { complaintId, department, assignedAuthority } = req.body;
    
    // Create ticket
    const ticket = new Ticket({
      complaintId,
      department,
      assignedAuthority: assignedAuthority || 'Duty Officer',
      status: 'Pending'
    });
    
    const savedTicket = await ticket.save();
    
    // Update complaint status to Ticket Raised
    await Complaint.findByIdAndUpdate(complaintId, { status: 'Ticket Raised' });
    
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: All Tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('complaintId');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Resolve Ticket (Authority)
router.patch('/:id/resolve', upload.single('resolutionPhoto'), async (req, res) => {
  try {
    const updateData = { status: 'Resolved', resolvedAt: Date.now() };
    if (req.file) {
      updateData.resolutionPhoto = `/uploads/${req.file.filename}`;
    }
    
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Close Ticket (Admin)
router.patch('/:id/close', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 'Closed' }, { new: true });
    
    // Update linked complaint status to Resolved
    await Complaint.findByIdAndUpdate(ticket.complaintId, { status: 'Resolved' });
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
