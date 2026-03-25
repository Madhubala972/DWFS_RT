const User = require('../../models/User');
const logActivity = require('../../utils/logger');
const generateToken = require('./tokenHelper');

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            logActivity(user._id, 'LOGIN', 'Logged in', user._id, 'User', req.ip);
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id, user.role) });
        } else {
            if (user) logActivity(user._id, 'LOGIN_FAILURE', `Failed login for ${email}`, user._id, 'User', req.ip);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = loginUser;
