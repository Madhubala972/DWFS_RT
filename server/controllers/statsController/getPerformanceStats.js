const Request = require('../../models/Request');
const { formatDuration } = require('../../utils/statsHelper');

const getPerformanceStats = async () => {
    const [roleStats, efficiencyData] = await Promise.all([
        Request.aggregate([
            { $match: { status: { $in: ['Assigned', 'Delivered'] } } },
            { $group: { _id: { user: "$assignedTo", status: "$status" }, count: { $sum: 1 } } },
            { $lookup: { from: 'users', localField: '_id.user', foreignField: '_id', as: 'user' } },
            { $project: { status: "$_id.status", role: { $ifNull: [{ $arrayElemAt: ["$user.role", 0] }, "admin"] }, count: 1 } },
            { $group: { _id: { status: "$status", role: "$role" }, count: { $sum: "$count" } } }
        ]),
        Request.aggregate([
            { $match: { status: 'Delivered', createdAt: { $exists: true } } },
            { $project: { duration: { $subtract: [{ $ifNull: ["$deliveredAt", "$updatedAt"] }, "$createdAt"] } } },
            { $group: { _id: null, avg: { $avg: "$duration" }, min: { $min: "$duration" }, max: { $max: "$duration" } } }
        ])
    ]);

    const fulfillment = { accepted: { volunteer: 0, ngo: 0, admin: 0 }, delivered: { volunteer: 0, ngo: 0, admin: 0 } };
    roleStats.forEach(item => {
        const { status, role } = item._id;
        const key = status === 'Assigned' ? 'accepted' : 'delivered';
        if (fulfillment[key][role.toLowerCase()] !== undefined) fulfillment[key][role.toLowerCase()] += item.count;
    });

    return {
        fulfillment, efficiency: efficiencyData.length > 0 ? {
            avg: formatDuration(efficiencyData[0].avg), fastest: formatDuration(efficiencyData[0].min), slowest: formatDuration(efficiencyData[0].max)
        } : null
    };
};

module.exports = getPerformanceStats;
