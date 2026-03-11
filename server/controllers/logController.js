const ActivityLog = require('../models/ActivityLog');
const asyncHandler = require('express-async-handler');

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private (Admin)
const getLogs = asyncHandler(async (req, res) => {
    const logs = await ActivityLog.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 });
    res.json(logs);
});

module.exports = {
    getLogs,
};
