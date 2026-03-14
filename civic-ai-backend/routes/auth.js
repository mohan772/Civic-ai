const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

// POST: Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for admin
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid email or password" });

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.json({
      token,
      admin: { email: admin.email, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Admin Logout
router.post('/logout', (req, res) => {
  // Logout is typically handled on the frontend by removing the token
  res.json({ message: "Logout successful" });
});

module.exports = router;
