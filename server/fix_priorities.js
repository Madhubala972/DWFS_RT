const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Request = require('./models/Request');
const { calculatePriority } = require('./utils/priorityHelper');

dotenv.config({ path: path.join(__dirname, '.env') });

const migratePriorities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/disaster_welfare');
        console.log('Connected to DB for priority migration');

        const requests = await Request.find({});
        console.log(`Found ${requests.length} requests to re-evaluate...`);

        let updatedCount = 0;
        for (const req of requests) {
            // Re-calculate using updated weight logic
            const { score, priority, explanation } = calculatePriority(req, 'Low'); 
            
            if (req.priority !== priority) {
                console.log(`Updating ${req._id}: ${req.priority} -> ${priority} (${req.type})`);
                
                // Using findOneAndUpdate to bypass schema validation for non-priority fields
                await Request.findOneAndUpdate(
                    { _id: req._id },
                    { 
                        priority, 
                        priorityScore: score, 
                        priorityExplanation: 'AUTO-RECALIBRATED: ' + explanation 
                    },
                    { runValidators: false } // Avoid failing on legacy data unrelated to priority
                );
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} requests.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migratePriorities();
