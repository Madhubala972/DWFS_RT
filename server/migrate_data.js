const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/disaster_welfare';
const ATLAS_URI = process.env.MONGO_URI;

const migrate = async () => {
    try {
        console.log('Connecting to Local MongoDB...');
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('Local MongoDB Connected.');

        console.log('Connecting to MongoDB Atlas...');
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('MongoDB Atlas Connected.');

        const collections = ['users', 'requests', 'activitylogs'];

        for (const colName of collections) {
            console.log(`Migrating collection: ${colName}...`);
            
            // Get raw data from local collection using native driver to avoid schema issues
            const localColl = localConn.db.collection(colName);
            const data = await localColl.find({}).toArray();
            console.log(`Found ${data.length} documents in local ${colName}.`);

            if (data.length > 0) {
                const atlasColl = atlasConn.db.collection(colName);
                
                // Clear Atlas collection first
                await atlasColl.deleteMany({});
                console.log(`Cleared existing documents in Atlas ${colName}.`);

                // Insert into Atlas using native driver (skips mongoose validation)
                await atlasColl.insertMany(data);
                console.log(`Successfully migrated ${data.length} documents to Atlas ${colName}.`);
            }
        }

        console.log('Data migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
