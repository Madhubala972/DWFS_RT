const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logActivity = require('../utils/logger');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, location, address, city, state, zip } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Construct location object if individual fields are provided
        const userLocation = location || {
            address: address,
            city: city,
            state: state,
            zip: zip
        };

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            location: userLocation
        });

        if (user) {
            await logActivity(user._id, 'REGISTER', 'User registered', user._id, 'User', req.ip);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            await logActivity(user._id, 'LOGIN', 'User logged in successfully', user._id, 'User', req.ip);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            // Log failed attempt if user exists, otherwise log anonymous failure
            if (user) {
                await logActivity(user._id, 'LOGIN_FAILURE', `Failed login attempt for ${email}`, user._id, 'User', req.ip);
            }
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        await logActivity(req.user._id, 'LOGOUT', 'User logged out', req.user._id, 'User', req.ip);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = { registerUser, loginUser, logoutUser };
