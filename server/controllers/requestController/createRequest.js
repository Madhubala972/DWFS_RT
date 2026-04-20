const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const logActivity = require('../../utils/logger');
const { calculatePriority } = require('../../utils/priorityHelper');

const getAiPriority = async (description) => {
    try {
        let baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
        // Handle case where .env already includes /predict
        const url = baseUrl.endsWith('/predict') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/predict`;
        const response = await axios.post(url, { description }, { timeout: 5000 });
        return response.data.priority || 'Low';
    } catch (err) {
        console.error(`AI Analysis Error [${err.code || err.message}]: Falling back to Low priority.`);
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

    // 1. Initial Priority (Before AI)
    const { score: initScore, priority: initPrio, explanation: initExpl } = calculatePriority({
        type, vulnerability, locationRisk
    }, 'Low');

    const request = await Request.create({
        user: req.user._id, type, description, quantity, city, location, pincode,
        vulnerability, locationRisk,
        status: 'Pending', priority: initPrio, priorityScore: initScore, priorityExplanation: initExpl
    });

    // 2. Return immediate response
    res.status(201).json(request);

    // 3. Background AI Update
    (async () => {
        try {
            const aiPrediction = await getAiPriority(description);
            const { score, priority, explanation } = calculatePriority({
                type, vulnerability, locationRisk
            }, aiPrediction);
            
            await Request.findByIdAndUpdate(request._id, {
                priority, priorityScore: score, priorityExplanation: explanation
            });
            console.log(`Background AI update complete for request ${request._id}`);
        } catch (err) {
            console.error('Background AI update failed:', err);
        }
    })();

    const { clearStatsCache } = require('../statsController');
    clearStatsCache(); // Ensure dashboard reflects new data instantly

    await logActivity(req.user._id, 'CREATE_REQUEST', `New request: ${type}`, request._id, 'Request', req.ip);
});

module.exports = createRequest;
