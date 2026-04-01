const Request = require('../models/Request');
const asyncHandler = require('express-async-handler');

// Lightweight summary for UI notifications and status bars
const getSummaryAction = asyncHandler(async (req, res) => {
    const [statusCounts, urgentRequests] = await Promise.all([
        Request.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Request.find({ status: 'Pending', priority: { $in: ['Critical', 'High'] } })
            .sort({ createdAt: -1 }).limit(3).select('type priority location')
    ]);

    const byStatus = {};
    statusCounts.forEach(item => { byStatus[item._id] = item.count; });

    res.json({ byStatus, urgentRequests });
});

module.exports = getSummaryAction;
