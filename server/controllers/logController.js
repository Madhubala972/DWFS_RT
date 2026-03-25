const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('express-async-handler');

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private (Admin)
const getLogs = asyncHandler(async (req, res) => {
    // Limited to 200 logs for better dashboard performance
    const logs = await ActivityLog.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(200);
    res.json(logs);
});

module.exports = {
    getLogs,
};
