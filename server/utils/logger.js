const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, details, resourceId = null, resourceModel = null, ipAddress = null) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details,
            resourceId,
            resourceModel,
            ipAddress
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = logActivity;
