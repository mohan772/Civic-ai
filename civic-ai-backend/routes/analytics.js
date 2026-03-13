const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// 1. Civic Health Score
router.get('/civic-health', async (req, res) => {
  try {
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const critical = await Complaint.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } });

    // score = 100 - (pending × 0.5) - (critical × 2) + (resolved × 1)
    let score = 100 - (pending * 0.5) - (critical * 2) + (resolved * 1);
    score = Math.min(100, Math.max(0, Math.round(score)));

    res.json({ score, pending, resolved, critical });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Department Performance
router.get('/department-performance', async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          },
          avgResTimeMs: {
            $avg: {
              $cond: [
                { $and: [{ $eq: ["$status", "Resolved"] }, { $ne: ["$resolvedAt", null] }] },
                { $subtract: ["$resolvedAt", "$createdAt"] },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          department: "$_id",
          total: 1,
          resolved: 1,
          resolutionRate: {
            $multiply: [{ $divide: ["$resolved", "$total"] }, 100]
          },
          avgResTimeHours: { $divide: ["$avgResTimeMs", 3600000] }
        }
      },
      { $sort: { resolutionRate: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Civic Hotspots
router.get('/hotspots', async (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeekComplaints = await Complaint.find({
      createdAt: { $gte: oneWeekAgo }
    });

    const lastWeekComplaints = await Complaint.find({
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    // Helper to group by area (first part of address)
    const getArea = (address) => address ? address.split(',')[0].trim() : "Unknown";

    const currentStats = {};
    currentWeekComplaints.forEach(c => {
      const area = getArea(c.address);
      if (!currentStats[area]) currentStats[area] = { count: 0, categories: {} };
      currentStats[area].count++;
      currentStats[area].categories[c.category] = (currentStats[area].categories[c.category] || 0) + 1;
    });

    const lastStats = {};
    lastWeekComplaints.forEach(c => {
      const area = getArea(c.address);
      lastStats[area] = (lastStats[area] || 0) + 1;
    });

    const hotspots = [];
    for (const area in currentStats) {
      const currentCount = currentStats[area].count;
      const lastCount = lastStats[area] || 0;
      let trend = "stable";
      
      // If increase > 30% or if it's new and has significant volume
      if (lastCount === 0 && currentCount > 5) {
        trend = "increasing";
      } else if (lastCount > 0 && (currentCount - lastCount) / lastCount > 0.3) {
        trend = "increasing";
      }

      // Find top category
      let topCategory = "General";
      let maxCatCount = 0;
      for (const cat in currentStats[area].categories) {
        if (currentStats[area].categories[cat] > maxCatCount) {
          maxCatCount = currentStats[area].categories[cat];
          topCategory = cat;
        }
      }

      hotspots.push({
        area,
        category: topCategory,
        complaints: currentCount,
        trend
      });
    }

    res.json(hotspots.filter(h => h.trend === "increasing" || h.complaints > 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Emergency Alert Detection
router.get('/emergency-alerts', async (req, res) => {
  try {
    const emergencyKeywords = [
      'transformer fire', 'electric spark', 'open manhole', 'flooded road', 
      'gas leak', 'live wire', 'tree fallen', 'sewer overflow'
    ];
    
    const regex = new RegExp(emergencyKeywords.join('|'), 'i');

    const alerts = await Complaint.find({
      $or: [
        { priority: 'Critical', status: { $ne: 'Resolved' } },
        { description: { $regex: regex }, status: { $ne: 'Resolved' } }
      ]
    }).sort({ createdAt: -1 }).limit(10);

    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Real-Time Live Metrics
router.get('/live-metrics', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalComplaints = await Complaint.countDocuments();
    const complaintsToday = await Complaint.countDocuments({ createdAt: { $gte: startOfDay } });
    const resolvedToday = await Complaint.countDocuments({ 
      status: 'Resolved', 
      resolvedAt: { $gte: startOfDay } 
    });
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const criticalIssues = await Complaint.countDocuments({ 
      priority: 'Critical', 
      status: { $ne: 'Resolved' } 
    });

    res.json({
      totalComplaints,
      complaintsToday,
      resolvedToday,
      pendingComplaints,
      criticalIssues
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
