const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

const isOrganizer = (req, res, next) => {
    if (req.user.role !== 'organizer') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Organizer privileges required.'
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    isOrganizer
};
