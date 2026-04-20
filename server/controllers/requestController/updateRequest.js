const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

const updateRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);
    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Role-based Access Control
    if (!['admin', 'ngo', 'volunteer'].includes(req.user.role)) {
        res.status(401);
        throw new Error('Not authorized to update requests');
    }

    // Critical Priority Governance Rule:
    // "Critical" requests MUST be approved/rejected by Admin only.
    // "High", "Medium", "Low" can be handled by NGO/Volunteers.
    if (request.priority === 'Critical' && req.user.role !== 'admin') {
        const isStatusChange = req.body.status && req.body.status !== request.status;
        if (isStatusChange && ['Approved', 'Rejected'].includes(req.body.status)) {
            res.status(403);
            throw new Error('Action restricted: Critical requests require Admin intervention');
        }
    }

    Object.assign(request, req.body);

    if (req.body.status === 'InProgress' && !request.deliveryStartedAt) request.deliveryStartedAt = new Date();
    if (req.body.status === 'Delivered' && !request.deliveredAt) request.deliveredAt = new Date();

    const updatedRequest = await request.save();

    const { clearStatsCache } = require('../statsController');
    clearStatsCache(); // Invalidate cache on update

    res.json(updatedRequest);
});

module.exports = updateRequest;
