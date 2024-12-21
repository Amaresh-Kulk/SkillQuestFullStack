const express = require('express');
const Aptitude = require('../models/Aptitude');
const auth = require('../middleware/auth');
const router = express.Router();

// Fetch aptitude questions based on difficulty
router.get('/', async (req, res) => {
    const { difficulty } = req.query;

    try {
        const questions = await Aptitude.find({ difficulty });
        res.json(questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new aptitude question (admin only)
router.post('/', async (req, res) => {
    const { difficulty, questionText, options } = req.body;

    try {
        const newQuestion = new Aptitude({ difficulty, questionText, options });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an aptitude question (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        let question = await Aptitude.findById(req.params.id);
        if (!question) return res.status(404).json({ msg: 'Question not found' });

        question.set(req.body);
        await question.save();
        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an aptitude question (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        let question = await Aptitude.findById(req.params.id);
        if (!question) return res.status(404).json({ msg: 'Question not found' });

        await question.remove();
        res.json({ msg: 'Question removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
