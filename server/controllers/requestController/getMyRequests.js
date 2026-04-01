const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

// Get recent requests created by the logged-in user
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    res.json(requests);
});

module.exports = getMyRequests;
