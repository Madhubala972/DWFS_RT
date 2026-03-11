const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        action: {
            type: String,
            required: true, // e.g., "LOGIN", "CREATE_REQUEST", "APPROVE_REQUEST"
        },
        details: {
            type: String, // Description of the action
        },
        ipAddress: {
            type: String,
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId, // ID of the related object (e.g., Request ID)
            refPath: 'resourceModel',
        },
        resourceModel: {
            type: String, // 'Request', 'User', etc.
            enum: ['Request', 'User'],
        },
    },
    {
        timestamps: true,
    }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
