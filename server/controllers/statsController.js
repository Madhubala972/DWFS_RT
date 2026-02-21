const Request = require('../models/Request');
const asyncHandler = require('express-async-handler');
const { formatDuration, getTimelineDates } = require('../utils/statsHelper');

// @desc    Get public request statistics
// @route   GET /api/requests/stats
// @access  Public
const getPublicStats = asyncHandler(async (req, res) => {
    // 1. Total Requests
    const total = await Request.countDocuments({});

    // 2. Status Distribution
    const statusCounts = await Request.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const byStatus = {};
    statusCounts.forEach(item => { byStatus[item._id] = item.count; });

    // 3. Priority Distribution
    const priorityCounts = await Request.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);
    const byPriority = {};
    priorityCounts.forEach(item => { byPriority[item._id] = item.count; });

    // 4. Type Distribution
    const typeCounts = await Request.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    const byType = {};
    typeCounts.forEach(item => { byType[item._id] = item.count; });

    // 5. Lifecycle Timelines
    const timeframe = req.query.timeframe || 'week'; // 'day', 'week', 'month', 'year', 'all'
    const now = new Date();
    let startDate = new Date(now);
    let formatString = "%Y-%m-%d";
    let stepCount = 7;
    let stepType = 'day';

    // Normalize to start of day for consistent grouping
    if (timeframe !== 'day') {
        startDate.setHours(0, 0, 0, 0);
    }

    if (timeframe === 'month') {
        startDate.setDate(startDate.getDate() - 29); // Past 29 days + today = 30
        stepCount = 30;
    } else if (timeframe === 'day') {
        startDate.setHours(startDate.getHours() - 23); // Past 23h + current h = 24
        formatString = "%Y-%m-%d %H:00";
        stepCount = 24;
        stepType = 'hour';
    } else if (timeframe === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setDate(1); // Start of the month a year ago
        stepCount = 12;
        stepType = 'month';
        formatString = "%Y-%m";
    } else if (timeframe === 'all') {
        const oldestRequest = await Request.findOne({}).sort({ createdAt: 1 });
        if (oldestRequest) {
            startDate = new Date(oldestRequest.createdAt);
            startDate.setHours(0, 0, 0, 0);
        } else {
            startDate.setDate(startDate.getDate() - 6);
        }
        const diffTime = Math.abs(now - startDate);
        stepCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        stepType = 'day';
    } else { // week
        startDate.setDate(startDate.getDate() - 6); // Past 6 days + today = 7
        stepCount = 7;
    }

    const getTimeline = async (dateField, matchFilter = {}) => {
        return await Request.aggregate([
            {
                $match: {
                    [dateField]: { $gte: startDate },
                    ...matchFilter
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: formatString, date: `$${dateField}` } },
                        type: "$type"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);
    };

    const requestTimeline = await getTimeline('createdAt');

    // Custom timeline logic for Deliveries (Robust Fallback)
    const deliveryTimeline = await Request.aggregate([
        {
            $match: {
                status: 'Delivered'
            }
        },
        {
            $addFields: {
                effectiveDate: { $ifNull: ["$deliveredAt", "$updatedAt"] }
            }
        },
        {
            $match: {
                effectiveDate: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: formatString, date: "$effectiveDate" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Helper to merge timelines into a single dataset for line charts
    const dates = getTimelineDates(now, stepCount, stepType);

    const categories = ['Food', 'Funds', 'Clothes', 'Essentials', 'Medical', 'Other'];

    const timeline = dates.map(date => {
        const point = { date };

        // Per-category counts for this date
        categories.forEach(cat => {
            const match = requestTimeline.find(t => t._id.date === date && t._id.type === cat);
            point[cat] = match ? match.count : 0;
        });

        // Totals and Deliveries
        point.requests = categories.reduce((sum, cat) => sum + point[cat], 0);
        point.delivery = deliveryTimeline.find(t => t._id === date)?.count || 0;

        return point;
    });


    // 6. Detailed Performance Stats (Accepted & Delivered by Role)
    const roleStats = await Request.aggregate([
        {
            $match: {
                status: { $in: ['Assigned', 'Delivered'] }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'assignedTo',
                foreignField: '_id',
                as: 'assignedUser'
            }
        },
        {
            $project: {
                status: 1,
                role: {
                    $ifNull: [{ $arrayElemAt: ["$assignedUser.role", 0] }, "admin"]
                }
            }
        },
        {
            $group: {
                _id: {
                    status: "$status",
                    role: "$role"
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const fulfillmentStats = {
        accepted: { volunteer: 0, ngo: 0, admin: 0 },
        delivered: { volunteer: 0, ngo: 0, admin: 0 }
    };

    roleStats.forEach(item => {
        const { status, role } = item._id;
        const normalizedRole = role ? role.toLowerCase() : 'admin'; // Fallback to admin if role is missing/null
        const count = item.count;

        if (status === 'Assigned') { // 'Assigned' means Accepted/In Progress
            if (fulfillmentStats.accepted[normalizedRole] !== undefined) {
                fulfillmentStats.accepted[normalizedRole] += count; // Accumulate counts
            }
        } else if (status === 'Delivered') {
            if (fulfillmentStats.delivered[normalizedRole] !== undefined) {
                fulfillmentStats.delivered[normalizedRole] += count; // Accumulate counts
            }
        }
    });

    // 7. Average Completion Time (Efficiency Analysis)
    const completionEfficiency = await Request.aggregate([
        {
            $match: {
                status: 'Delivered',
                createdAt: { $exists: true }
            }
        },
        {
            $project: {
                duration: {
                    $subtract: [
                        { $ifNull: ["$deliveredAt", "$updatedAt"] },
                        "$createdAt"
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                avgDuration: { $avg: "$duration" },
                minDuration: { $min: "$duration" },
                maxDuration: { $max: "$duration" }
            }
        }
    ]);

    const efficiency = completionEfficiency.length > 0 ? {
        avg: formatDuration(completionEfficiency[0].avgDuration),
        fastest: formatDuration(completionEfficiency[0].minDuration),
        slowest: formatDuration(completionEfficiency[0].maxDuration)
    } : null;

    // 8. Recent Urgent Requests (Top 5 Critical/High)
    const urgentRequests = await Request.find({
        status: 'Pending',
        priority: { $in: ['Critical', 'High'] }
    })
        .sort({ priority: 1, createdAt: -1 }) // 'Critical' comes before 'High' alphabetically
        .limit(5)
        .select('type description location priority createdAt');

    // 9. Last Week Delivery Metrics
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const lastWeekDeliveries = await Request.countDocuments({
        status: 'Delivered',
        $or: [
            { deliveredAt: { $gte: sevenDaysAgo } },
            { updatedAt: { $gte: sevenDaysAgo }, deliveredAt: { $exists: false } }
        ]
    });

    const previousWeekDeliveries = await Request.countDocuments({
        status: 'Delivered',
        $or: [
            { deliveredAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } },
            { updatedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }, deliveredAt: { $exists: false } }
        ]
    });

    res.json({
        total,
        byStatus,
        byPriority,
        byType,
        timeline,
        fulfillmentStats,
        completionEfficiency: efficiency,
        urgentRequests,
        lastWeekDeliveries,
        previousWeekDeliveries
    });
});

// @desc    Get public request status by ID
// @route   GET /api/requests/track/:id
// @access  Public
const getPublicRequestStatus = asyncHandler(async (req, res) => {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error('Invalid Request ID format');
    }

    const request = await Request.findById(req.params.id).select('status type quantity description createdAt updatedAt deliveryStartedAt deliveredAt');

    if (request) {
        res.json(request);
    } else {
        res.status(404);
        throw new Error('Request not found');
    }
});

module.exports = {
    getPublicStats,
    getPublicRequestStatus
};
