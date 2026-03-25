const asyncHandler = require('express-async-handler');
const axios = require('axios');

const warmupAi = asyncHandler(async (req, res) => {
    try {
        const baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
        // Hit the health-check or root of the AI space with a timeout to wake it up
        await axios.get(baseUrl, { timeout: 5000 });
        res.json({ message: 'Warm-up signal sent to AI server' });
    } catch (err) {
        // We don't care if it fails (e.g. timeout during wake-up), just want to ping it
        res.json({ message: 'Warm-up attempted', status: 'Waking up...' });
    }
});

module.exports = warmupAi;
