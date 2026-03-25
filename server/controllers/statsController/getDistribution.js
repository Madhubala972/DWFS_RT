const Request = require('../../models/Request');

const getDistribution = async () => {
    const [total, statusCounts, priorityCounts, typeCounts] = await Promise.all([
        Request.countDocuments({}),
        Request.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Request.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
        Request.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }])
    ]);

    const format = (data) => {
        const res = {};
        data.forEach(item => { res[item._id] = item.count; });
        return res;
    };

    return {
        total,
        byStatus: format(statusCounts),
        byPriority: format(priorityCounts),
        byType: format(typeCounts)
    };
};

module.exports = getDistribution;
