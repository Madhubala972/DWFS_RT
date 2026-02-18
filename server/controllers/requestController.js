const Request = require('../models/Request');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const logActivity = require('../utils/logger');

const calculatePriority = (requestData, aiPrediction = 'Low') => {
    let score = 0;
    const reasons = [];

    // 1. AI Content Analysis (Emergency Sentiment from ML Model)
    const aiServiceWeights = {
        'Critical': 45,
        'High': 35,
        'Medium': 20,
        'Low': 5
    };
    const aiScore = aiServiceWeights[aiPrediction] || 5;
    score += aiScore;
    reasons.push(`AI Analysis (${aiPrediction}): +${aiScore}`);

    // 2. Resource Type Necessity
    const emergencyTypes = {
        'Medical': 15,
        'Food': 12,
        'Essentials': 8,
        'Funds': 5,
        'Clothes': 3,
        'Other': 2
    };
    const typeScore = emergencyTypes[requestData.type] || 0;
    score += typeScore;
    reasons.push(`Aid Type (${requestData.type}): +${typeScore}`);

    // 3. Vulnerability (Socio-economic)
    if (requestData.incomeLevel < 10000) {
        score += 20;
        reasons.push('Extreme Poverty: +20');
    } else if (requestData.incomeLevel < 30000) {
        score += 10;
        reasons.push('Vulnerable Income: +10');
    }

    if (requestData.vulnerability?.hasElderly) {
        score += 10;
        reasons.push('Elderly present: +10');
    }
    if (requestData.vulnerability?.hasDisabled) {
        score += 15;
        reasons.push('Disability present: +15');
    }
    const famBonus = Math.min(requestData.vulnerability?.familySize * 2, 10);
    if (famBonus > 0) {
        score += famBonus;
        reasons.push(`Household size (${requestData.vulnerability?.familySize}): +${famBonus}`);
    }

    // 4. Environmental Risk
    if (requestData.locationRisk?.isFloodZone) {
        score += 25;
        reasons.push('Flood Zone: +25');
    }
    if (requestData.locationRisk?.isDroughtArea) {
        score += 15;
        reasons.push('Drought Zone: +15');
    }

    // Final Mapping
    let priority = 'Low';
    if (score >= 80) priority = 'Critical';
    else if (score >= 55) priority = 'High';
    else if (score >= 30) priority = 'Medium';

    return { score, priority, explanation: reasons.join(' | ') };
};

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

    // 5. Lifecycle Timelines (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const getTimeline = async (dateField) => {
        return await Request.aggregate([
            {
                $match: {
                    [dateField]: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
    };

    const requestTimeline = await getTimeline('createdAt');

    // Custom timeline logic for Deliveries (Robust Fallback)
    const deliveryTimeline = await Request.aggregate([
        {
            $match: {
                status: 'Delivered',
                updatedAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $project: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $ifNull: ["$deliveredAt", "$updatedAt"] }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Helper to merge timelines into a single dataset for line charts
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }
    dates.sort();

    const timeline = dates.map(date => ({
        date,
        requests: requestTimeline.find(t => t._id === date)?.count || 0,
        delivery: deliveryTimeline.find(t => t._id === date)?.count || 0
    }));


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



    const formatDuration = (ms) => {
        if (ms < 0) return '0m'; // Safety for bad data
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m`;
        return 'Less than 1m';
    };

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

    res.json({
        total,
        byStatus,
        byPriority,
        byType,
        timeline,
        fulfillmentStats,
        completionEfficiency: efficiency,
        urgentRequests
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
    createRequest,
    getRequests,
    getMyRequests,
    updateRequest,
    getRequestById,
    getPublicStats,
    getPublicRequestStatus
};
