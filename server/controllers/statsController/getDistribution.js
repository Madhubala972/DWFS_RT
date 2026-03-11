const Request = require('../../models/Request');

const getDistribution = async () => {
    const total = await Request.countDocuments({});

    const getGrouped = async (field) => {
        const counts = await Request.aggregate([{ $group: { _id: `$${field}`, count: { $sum: 1 } } }]);
        const result = {};
        counts.forEach(item => { result[item._id] = item.count; });
        return result;
    };

    return {
        total,
        byStatus: await getGrouped('status'),
        byPriority: await getGrouped('priority'),
        byType: await getGrouped('type')
    };
};

module.exports = getDistribution;
