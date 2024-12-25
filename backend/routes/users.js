const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Register a user
router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({ username, email, password });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY || '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Login a user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            const payload = { user: { id: user.id } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '1h' });
                // , (err, token) => 
            //     {
            //     if (err) throw err;
            //     // res.json({ token });
            // });

            // Set cookie with the token
            res.cookie('token', token, {
                httpOnly: true, // Prevent access from client-side scripts
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'Lax', // CSRF protection
            maxAge: 3600000, // 1 hour
            });
            res.status(200).json({ success: true, message: "User logged in successfully" });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get current user's details
router.get('/me', auth, async (req, res) => {
    try {
        // const user = await User.findById(req.user.id).select('-password');
        // if (!user) return res.status(404).json({ msg: 'User not found' });
        const user = req.user;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Get performance metrics for a user
router.get('/:id/performance', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user.performanceMetrics);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update performance metrics after completing a test
router.post('/:id/performance', async (req, res) => {
    const { section, score } = req.body;

    if (!['aptitude', 'coding'].includes(section) || typeof score !== 'number') {
        return res.status(400).json({ msg: 'Invalid section or score' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.performanceMetrics.push({ section, score });

        // Update overall scores based on section
        user.scores = {
            ...user.scores,
            [section]: (user.scores[section] || 0) + score,
        };

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
