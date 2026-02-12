const Request = require('../models/Request');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const logActivity = require('../utils/logger');

// @desc    Create a new help request
// @route   POST /api/requests
// @access  Private (User)
const createRequest = asyncHandler(async (req, res) => {
    const { type, description, quantity, location, proofOfNeed } = req.body;

    if (!type || !description || !quantity) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }


    let priority = 'Medium';
    try {
        if (process.env.AI_SERVICE_URL) {
            const aiResponse = await axios.post(process.env.AI_SERVICE_URL, { description });
            if (aiResponse.data && aiResponse.data.priority) {
                priority = aiResponse.data.priority;
            }
        }
    } catch (err) {
        console.log('AI Service validation failed, using default', err.message);
    }

    const request = await Request.create({
        user: req.user._id,
        type,
        description,
        quantity,
        location,
        proofOfNeed,
        status: 'Pending',
        priority: priority
    });

    await logActivity(req.user._id, 'CREATE_REQUEST', `Created request for ${type}`, request._id, 'Request', req.ip);

    res.status(201).json(request);
});

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin/NGO/Volunteer)
const getRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({}).populate('user', 'name email phone');
    res.json(requests);
});

// @desc    Get logged in user requests
// @route   GET /api/requests/my
// @access  Private (User)
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ user: req.user._id });
    res.json(requests);
});

// @desc    Update request status or assign
// @route   PUT /api/requests/:id
// @access  Private (Admin/NGO)
const updateRequest = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Check permissions
    // Admin can update anything. NGO can update status/delivery notes if assigned or if picking up?
    // For simplicity: Admin & NGO can update.
    if (req.user.role !== 'admin' && req.user.role !== 'ngo' && req.user.role !== 'volunteer') {
        res.status(401);
        throw new Error('Not authorized');
    }

    // Higher Authority Approval Check
    if (req.body.status === 'Approved' && request.priority === 'Critical') {
        if (req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Critical requests require Admin approval');
        }
    }

    // Update fields if present
    if (req.body.status) request.status = req.body.status;
    if (req.body.assignedTo) request.assignedTo = req.body.assignedTo;
    if (req.body.adminNotes) request.adminNotes = req.body.adminNotes;
    if (req.body.deliveryNotes) request.deliveryNotes = req.body.deliveryNotes;
    if (req.body.priority) request.priority = req.body.priority;

    const updatedRequest = await request.save();

    await logActivity(req.user._id, 'UPDATE_REQUEST', `Updated request status to ${updatedRequest.status}`, updatedRequest._id, 'Request', req.ip);

    res.json(updatedRequest);
});

const getRequestById = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id).populate('user', 'name email phone').populate('assignedTo', 'name email phone');
    if (request) {
        res.json(request);
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});

module.exports = {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequest,
    getRequestById
};
