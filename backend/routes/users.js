//routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register a user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '200h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get performance metrics for a user
router.get('/:id/performance', auth, async (req, res) => {
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
router.post('/:id/performance', auth, async (req, res) => {
    const { section, score } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.performanceMetrics.push({ section, score });
        
        // Update overall scores based on section
        if (section === 'aptitude') user.scores.aptitude += score;
        else if (section === 'coding') user.scores.coding += score;

        await user.save();
        
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
