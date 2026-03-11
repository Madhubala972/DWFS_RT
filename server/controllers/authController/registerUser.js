const User = require('../../models/User');
const logActivity = require('../../utils/logger');
const generateToken = require('./tokenHelper');

const registerUser = async (req, res) => {
    const { name, email, password, role, phone, location } = req.body;
    try {
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }
        if (!location || !location.address || location.address.trim().length < 5) {
            return res.status(400).json({ message: 'Please provide a valid address' });
        }
        if (!location || !/^\d{6}$/.test(location.zip)) {
            return res.status(400).json({ message: 'Zip code must be exactly 6 digits' });
        }

        if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role, phone, location });
        if (user) {
            await logActivity(user._id, 'REGISTER', 'User registered', user._id, 'User', req.ip);
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id, user.role) });
        } else res.status(400).json({ message: 'Invalid user data' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = registerUser;
