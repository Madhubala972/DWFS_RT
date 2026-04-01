const Request = require('../../models/Request');
const { getTimelineDates } = require('../../utils/statsHelper');

const getTimelineData = async (startDate, formatString, stepCount, stepType) => {
    const [requestTimeline, deliveryTimeline] = await Promise.all([
        Request.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: { date: { $dateToString: { format: formatString, date: "$createdAt", timezone: "+05:30" } }, type: "$type" }, count: { $sum: 1 } } },
            { $sort: { "_id.date": 1 } }
        ]),
        Request.aggregate([
            { $match: { status: 'Delivered' } },
            { $addFields: { effectiveDate: { $ifNull: ["$deliveredAt", "$updatedAt"] } } },
            { $match: { effectiveDate: { $gte: startDate } } },
            { $group: { _id: { $dateToString: { format: formatString, date: "$effectiveDate", timezone: "+05:30" } }, count: { $sum: 1 } } }
        ])
    ]);

    const dates = getTimelineDates(new Date(), stepCount, stepType);
    const categories = ['Food', 'Funds', 'Clothes', 'Essentials', 'Medical', 'Other'];

    // Map the results for O(1) lookup to avoid O(N^2) search
    const reqMap = new Map();
    requestTimeline.forEach(t => reqMap.set(`${t._id.date}_${t._id.type}`, t.count));
    
    const delMap = new Map();
    deliveryTimeline.forEach(t => delMap.set(t._id, t.count));

    return dates.map(date => {
        const point = { date };
        categories.forEach(cat => {
            point[cat] = reqMap.get(`${date}_${cat}`) || 0;
        });
        point.requests = categories.reduce((sum, cat) => sum + point[cat], 0);
        point.delivery = delMap.get(date) || 0;
        return point;
    });
};

module.exports = getTimelineData;
