const mongoose = require('mongoose');
const User = require('./models/User');
const Request = require('./models/Request');
const ActivityLog = require('./models/ActivityLog');

const LOCAL_URI = 'mongodb://localhost:27017/disaster_welfare';
const CLOUD_URI = 'mongodb+srv://madhu211003redif_db_user:ma2110sa@cluster0.1lqaud4.mongodb.net/disaster_welfare?retryWrites=true&w=majority&appName=Cluster0';

const migrate = async () => {
    try {
        console.log('Connecting to Local MongoDB...');
        const localConn = await mongoose.createConnection(LOCAL_URI);
        const LocalUser = localConn.model('User', User.schema);
        const LocalRequest = localConn.model('Request', Request.schema);
        const LocalLog = localConn.model('ActivityLog', ActivityLog.schema);

        console.log('Connecting to Cloud MongoDB Atlas...');
        await mongoose.connect(CLOUD_URI);
        console.log('Connected to Cloud!');

        // 1. Migrate Users
        console.log('Migrating Users...');
        const users = await LocalUser.find({});
        for (const user of users) {
            await User.updateOne({ _id: user._id }, user.toObject(), { upsert: true });
        }
        console.log(`Migrated ${users.length} users.`);

        // 2. Migrate Requests
        console.log('Migrating Requests...');
        const requests = await LocalRequest.find({});
        for (const req of requests) {
            await Request.updateOne({ _id: req._id }, req.toObject(), { upsert: true });
        }
        console.log(`Migrated ${requests.length} requests.`);

        // 3. Migrate Activity Logs
        console.log('Migrating Activity Logs...');
        const logs = await LocalLog.find({});
        for (const log of logs) {
            await ActivityLog.updateOne({ _id: log._id }, log.toObject(), { upsert: true });
        }
        console.log(`Migrated ${logs.length} logs.`);

        console.log('✅ All data migrated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
};

migrate();
