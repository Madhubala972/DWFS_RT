const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const logActivity = require('../../utils/logger');
const { calculatePriority } = require('../../utils/priorityHelper');

const getAiPriority = async (description) => {
    try {
        const response = await axios.post('http://localhost:5001/predict', { description });
        return response.data.priority || 'Low';
    } catch (err) {
        return 'Low';
    }
};

const createRequest = asyncHandler(async (req, res) => {
    const { type, description, quantity, city, location, pincode, vulnerability, locationRisk } = req.body;

    if (!type || !description || !quantity || !city || !location || !pincode) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    if (location.trim().length < 5) {
        res.status(400);
        throw new Error('Please provide a valid address');
    }

    if (!/^\d{6}$/.test(pincode)) {
        res.status(400);
        throw new Error('Pincode must be exactly 6 digits');
    }

    const aiPrediction = await getAiPriority(description);
    const { score, priority, explanation } = calculatePriority({
        type, vulnerability, locationRisk
    }, aiPrediction);

    const request = await Request.create({
        user: req.user._id, type, description, quantity, city, location, pincode,
        vulnerability, locationRisk,
        status: 'Pending', priority, priorityScore: score, priorityExplanation: explanation
    });

    await logActivity(req.user._id, 'CREATE_REQUEST', `New request: ${type}`, request._id, 'Request', req.ip);
    res.status(201).json(request);
});

module.exports = createRequest;
