const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from Authorization header
        const token = req.header('Authorization')?.split(' ')[1];

        // Check if no token is provided
        if (!token) {
            return res.status(401).json({ msg: 'No token provided, authorization denied' });
        }

        // Verify the token with JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate decoded user object
        if (!decoded.user || !decoded.user.id) {
            return res.status(400).json({ msg: 'Invalid token payload' });
        }

        // Attach the user data to the request object
        req.user = decoded.user;

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Error in auth middleware:', err.message);

        // Handle token expiration specifically
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        }

        // Handle other token errors
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
