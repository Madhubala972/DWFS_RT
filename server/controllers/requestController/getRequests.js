const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

// Get all requests for Admin/NGO/Volunteer - Limited and sorted for performance
const getRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({})
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 }) // Use the index to get recent requests first
        .limit(100); // Prevent loading thousands of records at once
    res.json(requests);
});

module.exports = getRequests;
