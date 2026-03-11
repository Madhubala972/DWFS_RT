const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

const updateRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (!['admin', 'ngo', 'volunteer'].includes(req.user.role)) {
        res.status(401);
        throw new Error('Not authorized');
    }

    if (req.body.status === 'Approved' && request.priority === 'Critical' && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Critical requests require Admin approval');
    }

    Object.assign(request, req.body);

    if (req.body.status === 'InProgress' && !request.deliveryStartedAt) request.deliveryStartedAt = new Date();
    if (req.body.status === 'Delivered' && !request.deliveredAt) request.deliveredAt = new Date();

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

module.exports = updateRequest;
