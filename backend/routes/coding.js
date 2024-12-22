const express = require('express');
const DSA = require('../models/Coding'); // Correct model import
const auth = require('../middleware/auth');
const router = express.Router();

// Fetch coding questions based on category and difficulty
router.get('/', async (req, res) => {
    const { category, difficulty } = req.query;

    try {
        const query = {};
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;

        const questions = await DSA.find(query); // Correct method
        res.json(questions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new coding question (admin only)
router.post('/', auth, async (req, res) => {
    const { category, difficulty, questionText, constraints, example, solution } = req.body;

    try {
        const newQuestion = new DSA({
            category,
            difficulty,
            questionText,
            constraints,
            example,
            solution
        });

        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an existing coding question (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        let question = await DSA.findById(req.params.id); // Correct model usage
        if (!question) return res.status(404).json({ msg: 'Question not found' });

        question.set(req.body);
        await question.save();

        res.json(question);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a coding question (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        let question = await DSA.findById(req.params.id); // Correct model usage
        if (!question) return res.status(404).json({ msg: 'Question not found' });

        await question.remove();
        res.json({ msg: 'Question removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
