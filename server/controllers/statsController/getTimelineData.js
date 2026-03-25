const Request = require('../../models/Request');
const { getTimelineDates } = require('../../utils/statsHelper');

const getTimelineData = async (startDate, formatString, stepCount, stepType) => {
    const [requestTimeline, deliveryTimeline] = await Promise.all([
        Request.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: { date: { $dateToString: { format: formatString, date: "$createdAt" } }, type: "$type" }, count: { $sum: 1 } } },
            { $sort: { "_id.date": 1 } }
        ]),
        Request.aggregate([
            { $match: { status: 'Delivered' } },
            { $addFields: { effectiveDate: { $ifNull: ["$deliveredAt", "$updatedAt"] } } },
            { $match: { effectiveDate: { $gte: startDate } } },
            { $group: { _id: { $dateToString: { format: formatString, date: "$effectiveDate" } }, count: { $sum: 1 } } }
        ])
    ]);

    const dates = getTimelineDates(new Date(), stepCount, stepType);
    const categories = ['Food', 'Funds', 'Clothes', 'Essentials', 'Medical', 'Other'];

    return dates.map(date => {
        const point = { date };
        categories.forEach(cat => {
            const match = requestTimeline.find(t => t._id.date === date && t._id.type === cat);
            point[cat] = match ? match.count : 0;
        });
        point.requests = categories.reduce((sum, cat) => sum + point[cat], 0);
        point.delivery = deliveryTimeline.find(t => t._id === date)?.count || 0;
        return point;
    });
};

module.exports = getTimelineData;
