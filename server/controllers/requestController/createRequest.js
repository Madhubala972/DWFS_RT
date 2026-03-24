const Request = require('../../models/Request');
const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const logActivity = require('../../utils/logger');
const { calculatePriority } = require('../../utils/priorityHelper');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getAiPriority = async (description) => {
    try {
        if (!process.env.OPENAI_API_KEY) return 'Low';

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a crisis triage expert. Based on the disaster relief request description, assign a priority: 'Low', 'Medium', 'High', or 'Critical'. Response should be exactly one word."
                },
                {
                    role: "user",
                    content: description
                }
            ],
            max_tokens: 5,
        });

        const priority = response.choices[0].message.content.trim();
        return ['Low', 'Medium', 'High', 'Critical'].includes(priority) ? priority : 'Low';
    } catch (err) {
        console.error('OpenAI Error:', err);
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
