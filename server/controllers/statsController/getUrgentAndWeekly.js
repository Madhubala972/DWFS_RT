const Request = require('../../models/Request');

const getUrgentAndWeekly = async (now) => {
    const urgentRequests = await Request.find({ status: 'Pending', priority: { $in: ['Critical', 'High'] } })
        .sort({ priority: 1, createdAt: -1 }).limit(5).select('type description location priority createdAt');

    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const getDeliveries = async (start, end) => {
        const query = { status: 'Delivered', $or: [{ deliveredAt: { $gte: start } }, { updatedAt: { $gte: start } }] };
        if (end) query.$or[0].deliveredAt.$lt = end;
        return await Request.countDocuments(query);
    };

    return {
        urgentRequests,
        lastWeekDeliveries: await getDeliveries(sevenDaysAgo),
        previousWeekDeliveries: await getDeliveries(fourteenDaysAgo, sevenDaysAgo)
    };
};

module.exports = getUrgentAndWeekly;
