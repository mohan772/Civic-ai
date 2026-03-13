const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// GET all notifications for a citizen
router.get('/:phone', async (req, res) => {
  try {
    const notifications = await Notification.find({ userPhone: req.params.phone }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
