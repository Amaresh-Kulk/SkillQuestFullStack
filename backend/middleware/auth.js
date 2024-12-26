const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
    // try {
        // // Get token from Authorization header
        // const authHeader = req.header('Authorization');

        // if (!authHeader) {
        //     return res.status(401).json({ msg: 'Authorization header missing, access denied' });
        // }

        // const token = authHeader.split(' ')[1]; // Expected format: "Bearer <token>"
        
        // if (!token) {
        //     return res.status(401).json({ msg: 'Token missing in Authorization header' });
        // }

        // // Verify the token using the JWT secret
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // // Validate the decoded payload structure
        // if (!decoded || !decoded.user || !decoded.user.id) {
        //     return res.status(401).json({ msg: 'Invalid token structure' });
        // }


        const { token } = req.cookies;

    if (!token) {
        console.error("Token is missing.");
        return res.status(400).json({ status: false, message: "Please log in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Log decoded token

        // const user = await User.findById(decoded.user.id);
        const user = await User.findById(decoded.user.id).select('-password');


        if (!user) {
            console.error("User not found.");
            return res.status(400).json({ status: false, message: "User not found. Please register." });
        }

        req.user = user;
        next();

    } catch (err) {
        console.error('Error in auth middleware:', err.message);

        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired, please log in again' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token, access denied' });
        }

        // Handle any other errors
        return res.status(500).json({ msg: 'Server error in authorization middleware' });
    }
};

module.exports = auth;
