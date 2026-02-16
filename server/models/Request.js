const mongoose = require('mongoose');

const requestSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: {
            type: String,
            required: true,
            enum: ['Food', 'Funds', 'Clothes', 'Essentials', 'Medical', 'Other'],
        },
        description: {
            type: String,
            required: true,
        },
        quantity: { // e.g., "5 people", "1000 INR", "3 packets"
            type: String,
            required: true,
        },
        location: {
            address: String,
            city: String,
            state: String,
            zip: String,
            latitude: Number,
            longitude: Number,
        },
        status: {
            type: String,
            // enum: ['Pending', 'Verified', 'Approved', 'Assigned', 'InProgress', 'Collected', 'Delivered', 'Rejected', 'Cancelled'],
            default: 'Pending',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium',
        },
        priorityScore: {
            type: Number,
            default: 0,
        },
        priorityExplanation: {
            type: String,
        },
        incomeLevel: {
            type: Number, // Monthly income
        },
        vulnerability: {
            hasElderly: { type: Boolean, default: false },
            hasDisabled: { type: Boolean, default: false },
            familySize: { type: Number, default: 1 },
        },
        locationRisk: {
            isFloodZone: { type: Boolean, default: false },
            isDroughtArea: { type: Boolean, default: false },
        },
        assignedTo: { // Volunteer or NGO
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        adminNotes: {
            type: String,
        },
        deliveryNotes: {
            type: String, // Notes from volunteer/NGO upon delivery
        },
        proofOfNeed: {
            type: String, // URL to ID or photo of need
        },
        proofOfDelivery: {
            type: String, // URL to image/document
        },
        deliveryStartedAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
