const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'ngo', 'volunteer'],
            default: 'user',
        },
        phone: {
            type: String,
            required: true,
        },
        location: {
            address: String,
            city: String,
            state: String,
            zip: String,
        },
        isVerified: {
            type: Boolean,
            default: false, // For affected users to be verified by admin
        },
        availability: {
            type: Boolean, // For volunteers
            default: true,
        },
        organization: {
            type: String, // For NGO users
        },
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
