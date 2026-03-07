const logActivity = require('../../utils/logger');

const logoutUser = async (req, res) => {
    try {
        await logActivity(req.user._id, 'LOGOUT', 'User logged out', req.user._id, 'User', req.ip);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = logoutUser;
