const Request = require('../models/Request');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const logActivity = require('../utils/logger');
const { calculatePriority } = require('../utils/priorityHelper');

// @desc    Create a new help request
// @route   POST /api/requests
// @access  Private (User)
const createRequest = asyncHandler(async (req, res) => {
    const {
        type,
        description,
        quantity,
        location,
        proofOfNeed,
        incomeLevel,
        vulnerability,
        locationRisk
    } = req.body;

    if (!type || !description || !quantity) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    // 1. Get AI Sentiment Prediction from ML Model
    let aiPrediction = 'Low';
    try {
        const aiResponse = await axios.post('http://localhost:5001/predict', { description });
        aiPrediction = aiResponse.data.priority || 'Low';
    } catch (err) {
        console.error('AI Service Offline, falling back to basic scoring');
    }

    // 2. Comprehensive Prioritization Logic
    const { score, priority, explanation } = calculatePriority({
        type,
        incomeLevel: Number(incomeLevel) || 50000,
        vulnerability,
        locationRisk
    }, aiPrediction);

    // 3. Perspectives Persistence
    const request = await Request.create({
        user: req.user._id,
        type,
        description,
        quantity,
        location,
        proofOfNeed,
        incomeLevel: Number(incomeLevel) || 50000,
        vulnerability,
        locationRisk,
        status: 'Pending',
        priority,
        priorityScore: score,
        priorityExplanation: explanation
    });

    // 4. Audit Trail Logging (Transparency)
    await logActivity(
        req.user._id,
        'AI_PRIORITIZATION',
        `AI prioritized ${type} as ${priority} (Score: ${score}). Factors: ${explanation}`,
        request._id,
        'Request',
        req.ip
    );

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
    if (req.body.status) {
        request.status = req.body.status;

        // Timestamp logic
        if (req.body.status === 'InProgress' && !request.deliveryStartedAt) {
            request.deliveryStartedAt = new Date();
        }
        if (req.body.status === 'Delivered' && !request.deliveredAt) {
            request.deliveredAt = new Date();
        }
    }
    if (req.body.assignedTo) request.assignedTo = req.body.assignedTo;
    if (req.body.adminNotes) request.adminNotes = req.body.adminNotes;
    if (req.body.deliveryNotes) request.deliveryNotes = req.body.deliveryNotes;
    if (req.body.priority) request.priority = req.body.priority;

    try {
        const updatedRequest = await request.save();

        // Log activity safely
        // try {
        //     await logActivity(req.user._id, 'UPDATE_REQUEST', `Updated request status to ${updatedRequest.status}`, updatedRequest._id, 'Request', req.ip);
        // } catch (logError) {
        //     console.error('Logging failed:', logError);
        //     // Continue execution, do not fail request
        // }

        res.json(updatedRequest);
    } catch (error) {
        console.error('Update Request Error:', error);
        res.status(400); // Validation errors usually
        throw new Error(error.message);
    }
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
