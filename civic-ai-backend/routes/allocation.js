const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET: Resource Allocation Recommendations
router.get('/', async (req, res) => {
  try {
    const allocationData = await Complaint.aggregate([
      {
        $match: { status: { $nin: ['Resolved', 'Cancelled'] } } // Only active and non-cancelled issues
      },
      {
        $group: {
          _id: {
            category: "$category",
            area: "$address"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recommendations = allocationData.map(item => {
      const { category, area } = item._id;
      const count = item.count;
      let suggestion = "Monitor situation";

      if (category === 'Sanitation' && count > 10) {
        suggestion = `Deploy ${Math.floor(count / 5)} additional garbage trucks`;
      } else if (category === 'Infrastructure' && count > 8) {
        suggestion = "Send specialized road repair team";
      } else if (category === 'Utilities' && count > 7) {
        suggestion = "Dispatch emergency maintenance crew";
      } else if (category === 'Transportation' && count > 6) {
        suggestion = "Adjust traffic signal timings and deploy wardens";
      } else if (category === 'Public Services' && count > 5) {
        suggestion = "Send municipal inspection and audit team";
      } else if (count > 3) {
        suggestion = "Increase patrol frequency in this area";
      }

      if (count > 3) {
        return { area, category, complaints: count, suggestion };
      }
      return null;
    }).filter(item => item !== null);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
