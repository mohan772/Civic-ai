const express = require('express');
const router = express.Router();
const Citizen = require('../models/Citizen');

// GET: Top 10 Citizens by Points
router.get('/', async (req, res) => {
  try {
    const topCitizens = await Citizen.find({})
      .sort({ points: -1 })
      .limit(10)
      .select('phone points level');
    
    res.json(topCitizens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Citizen Stats by Phone
router.get('/:phone', async (req, res) => {
  try {
    const citizen = await Citizen.findOne({ phone: req.params.phone })
      .select('phone points level trustScore totalComplaints validComplaints fakeComplaints');
    
    if (!citizen) return res.status(404).json({ message: "Citizen not found" });
    res.json(citizen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
