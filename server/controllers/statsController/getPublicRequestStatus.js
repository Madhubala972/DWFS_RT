const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');

const getPublicRequestStatus = asyncHandler(async (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error('Invalid Request ID format');
    }

    const request = await Request.findById(req.params.id)
        .select('status type quantity description city location pincode createdAt updatedAt deliveryStartedAt deliveredAt');

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    res.json(request);
});

module.exports = getPublicRequestStatus;
