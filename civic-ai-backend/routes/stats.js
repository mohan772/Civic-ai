const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET: Comprehensive Civic Intelligence Stats
router.get('/', async (req, res) => {
  try {
    // EXCLUDE CANCELLED COMPLAINTS FROM STATS
    const complaints = await Complaint.find({ status: { $ne: 'Cancelled' } });
    
    // 1. Basic Counts
    const total = complaints.length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
    const pendingCount = complaints.filter(c => c.status === 'Pending').length;
    const criticalCount = complaints.filter(c => c.priority === 'Critical').length;
    const highPriorityCount = complaints.filter(c => c.priority === 'High').length;

    // 2. Weighted Civic Health Score Calculation
    let score = 100;
    if (total > 0) {
      score -= (pendingCount * 1.5);
      score -= (criticalCount * 4);
      score -= (highPriorityCount * 2);
      score += (resolvedCount * 0.5);
    }
    const civicHealthScore = Math.max(0, Math.min(100, Math.round(score)));

    // 3. Trend Indicator
    const now = new Date();
    const last24h = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const prev24h = new Date(now.getTime() - (48 * 60 * 60 * 1000));

    const complaintsLast24h = await Complaint.countDocuments({ 
      createdAt: { $gte: last24h },
      status: { $ne: 'Cancelled' }
    });
    const complaintsPrev24h = await Complaint.countDocuments({ 
      createdAt: { $gte: prev24h, $lt: last24h },
      status: { $ne: 'Cancelled' }
    });

    let trend = 'neutral';
    let change = 0;

    if (complaintsPrev24h > 0) {
      change = Math.round(((complaintsLast24h - complaintsPrev24h) / complaintsPrev24h) * 100);
      trend = complaintsLast24h <= complaintsPrev24h ? 'up' : 'down';
    } else if (complaintsLast24h > 0) {
      trend = 'down';
      change = 100;
    }

    // 4. Top Problem Category
    const topCategoryResult = await Complaint.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topCategory = topCategoryResult.length > 0 ? topCategoryResult[0]._id : "None";
    const topCategoryCount = topCategoryResult.length > 0 ? topCategoryResult[0].count : 0;

    // 5. Most Affected Area
    const hotspotResult = await Complaint.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: "$address", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const hotspotArea = hotspotResult.length > 0 ? hotspotResult[0]._id : "Unknown";
    const hotspotReports = hotspotResult.length > 0 ? hotspotResult[0].count : 0;

    let color = '#27ae60'; // Green
    if (civicHealthScore < 60) {
      color = '#e74c3c'; // Red
    } else if (civicHealthScore < 85) {
      color = '#f39c12'; // Orange
    }

    res.json({
      civicHealthScore,
      pending: pendingCount,
      resolved: resolvedCount,
      critical: criticalCount,
      total,
      trend,
      change: Math.abs(change),
      topCategory,
      topCategoryCount,
      hotspotArea,
      hotspotReports,
      color
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
