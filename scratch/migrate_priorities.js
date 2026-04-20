const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Request = require('../server/models/Request');
const { calculatePriority } = require('../server/utils/priorityHelper');

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

const migratePriorities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/disaster_welfare');
        console.log('Connected to DB for priority migration');

        const requests = await Request.find({});
        console.log(`Found ${requests.length} requests to re-evaluate...`);

        let updatedCount = 0;
        for (const req of requests) {
            // Re-run priority calculation
            // We'll use the existing priority as a base "AI Prediction" if we don't have the raw AI result saved separately,
            // but in this system the 'priority' field is the FINAL one. 
            // Actually, we should probably check if we can estimate the AI result from the explanation or just use a default.
            
            // To be safe and actually change things like 'Medical' from 'Low' to 'Critical/High', 
            // we'll re-calculate using the 'type' and other metadata.
            
            // We assume a 'Low' AI prediction as a baseline if we're re-calculating from scratch
            const { score, priority, explanation } = calculatePriority(req, 'Low'); 
            
            if (req.priority !== priority) {
                req.priority = priority;
                req.priorityScore = score;
                req.priorityExplanation = 'MIGRATED: ' + explanation;
                await req.save();
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
