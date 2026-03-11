const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

// Get all requests for Admin/NGO/Volunteer
const getRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({})
        .populate('user', 'name email phone');
    res.json(requests);
});

module.exports = getRequests;
