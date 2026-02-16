const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logActivity = require('../utils/logger');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            // Log security breach attempt (invalid token)
            await logActivity(null, 'SECURITY_BREACH', `Failed token verification: ${error.message} from IP: ${req.ip}`, null, null, req.ip);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return async (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            // Log unauthorized role access attempt
            if (req.user) {
                await logActivity(req.user._id, 'SECURITY_BREACH', `Unauthorized role attempt (${req.user.role}) for route: ${req.originalUrl}`, null, null, req.ip);
            }
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
