const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');

        // Check if no token is provided
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify the token with JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user to the request object (useful for access control)
        req.user = decoded.user;

        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // Log error and provide a specific error message
        console.error('Error in auth middleware:', err.message);
        
        // If the token is expired or invalid, return a specific error message
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
    }
};

module.exports = auth;
