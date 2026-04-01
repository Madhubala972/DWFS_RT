const asyncHandler = require('express-async-handler');
const getDistribution = require('./getDistribution');
const getTimelineData = require('./getTimelineData');
const getPerformanceStats = require('./getPerformanceStats');
const getUrgentAndWeekly = require('./getUrgentAndWeekly');
const Request = require('../../models/Request');

// Simple In-Memory Cache (TTL: 1 minute)
const statsCache = new Map();
const CACHE_TTL = 60 * 1000;

const getTimeParams = async (timeframe) => {
    let startDate = new Date(); startDate.setHours(0, 0, 0, 0);
    let format = "%Y-%m-%d", steps = 7, type = 'day';
    if (timeframe === 'month') { startDate.setDate(startDate.getDate() - 29); steps = 30; }
    else if (timeframe === 'day') { startDate.setHours(startDate.getHours() - 23); format = "%Y-%m-%d %H:00"; steps = 24; type = 'hour'; }
    else if (timeframe === 'year') { startDate.setFullYear(startDate.getFullYear() - 1); startDate.setDate(1); steps = 12; type = 'month'; format = "%Y-%m"; }
    else if (timeframe === 'all') {
        const oldest = await Request.findOne({}).sort({ createdAt: 1 }).lean();
        if (oldest) startDate = new Date(oldest.createdAt);
        const dayDiff = Math.ceil(Math.abs(new Date() - startDate) / (1000 * 60 * 60 * 24));
        // If more than 60 days, show monthly view for performance
        if (dayDiff > 60) {
            startDate.setDate(1); 
            steps = Math.ceil(dayDiff / 30) + 1; type = 'month'; format = "%Y-%m";
        } else {
            steps = dayDiff + 1;
        }
    } else { startDate.setDate(startDate.getDate() - 6); }
    return { startDate, format, steps, type };
};

const getPublicStats = asyncHandler(async (req, res) => {
    const timeframe = req.query.timeframe || 'week';
    
    // Check Cache
    const cached = statsCache.get(timeframe);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        console.log(`Serving statistics from cache for timeframe: ${timeframe}`);
        return res.json(cached.data);
    }

    const { startDate, format, steps, type } = await getTimeParams(timeframe);
    
    // Run multiple aggregation queries in parallel
    const [dist, timeline, perf, extra] = await Promise.all([
        getDistribution(),
        getTimelineData(startDate, format, steps, type),
        getPerformanceStats(),
        getUrgentAndWeekly(new Date())
    ]);

    const result = { 
        ...dist, 
        timeline, 
        fulfillmentStats: perf.fulfillment, 
        completionEfficiency: perf.efficiency, 
        ...extra 
    };

    // Store in Cache
    statsCache.set(timeframe, { timestamp: Date.now(), data: result });

    res.json(result);
});

module.exports = getPublicStats;
