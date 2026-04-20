const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Request = require('./server/models/Request');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const checkStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/disaster_welfare');
        console.log('Connected to DB');

        const [statusCounts, urgentRequests] = await Promise.all([
            Request.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Request.find({ status: 'Pending' }).limit(5).lean()
        ]);

        console.log('--- STATUS COUNTS ---');
        console.log(statusCounts);
        console.log('--- URGENT REQUESTS ---');
        console.log(urgentRequests.length);

        const byStatus = {};
        statusCounts.forEach(item => { byStatus[item._id] = item.count; });
        console.log('Pending count:', byStatus.Pending);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStats();
