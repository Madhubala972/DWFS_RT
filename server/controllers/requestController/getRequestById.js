const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

// Get a single request details
const getRequestById = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('assignedTo', 'name email phone');

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    res.json(request);
});

module.exports = getRequestById;
