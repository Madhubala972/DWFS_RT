const asyncHandler = require('express-async-handler');
const getDistribution = require('./getDistribution');
const getTimelineData = require('./getTimelineData');
const getPerformanceStats = require('./getPerformanceStats');
const getUrgentAndWeekly = require('./getUrgentAndWeekly');
const Request = require('../../models/Request');

const getTimeParams = async (timeframe) => {
    let startDate = new Date(); startDate.setHours(0, 0, 0, 0);
    let format = "%Y-%m-%d", steps = 7, type = 'day';
    if (timeframe === 'month') { startDate.setDate(startDate.getDate() - 29); steps = 30; }
    else if (timeframe === 'day') { startDate.setHours(startDate.getHours() - 23); format = "%Y-%m-%d %H:00"; steps = 24; type = 'hour'; }
    else if (timeframe === 'year') { startDate.setFullYear(startDate.getFullYear() - 1); startDate.setDate(1); steps = 12; type = 'month'; format = "%Y-%m"; }
    else if (timeframe === 'all') {
        const oldest = await Request.findOne({}).sort({ createdAt: 1 });
        if (oldest) startDate = new Date(oldest.createdAt);
        steps = Math.ceil(Math.abs(new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;
    } else { startDate.setDate(startDate.getDate() - 6); }
    return { startDate, format, steps, type };
};

const getPublicStats = asyncHandler(async (req, res) => {
    const { startDate, format, steps, type } = await getTimeParams(req.query.timeframe);
    const dist = await getDistribution();
    const timeline = await getTimelineData(startDate, format, steps, type);
    const perf = await getPerformanceStats();
    const extra = await getUrgentAndWeekly(new Date());

    res.json({ ...dist, timeline, fulfillmentStats: perf.fulfillment, completionEfficiency: perf.efficiency, ...extra });
});

module.exports = getPublicStats;
