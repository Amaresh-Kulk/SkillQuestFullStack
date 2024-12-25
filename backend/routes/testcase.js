//routes/testcase.js
const express = require('express');
const TestCase = require('../models/TestCase'); // Ensure proper model import
const auth = require('../middleware/auth'); // Authentication middleware
const router = express.Router();

// Fetch test cases by question_id
router.get('/', async (req, res) => {
    const { question_id } = req.params;

    try {
        const testCases = await TestCase.find({ question_id });
        if (!testCases || testCases.length === 0) {
            return res.status(404).json({ msg: 'No test cases found for this question' });
        }
        res.json(testCases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add test cases for a question (admin only)
router.post('/', async (req, res) => {
    const { question_id, testCases } = req.body;

    try {
        const newTestCase = new TestCase({ question_id, testCases });
        await newTestCase.save();
        res.status(201).json(newTestCase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update test cases for a specific question (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        let testCase = await TestCase.findById(req.params.id);
        if (!testCase) return res.status(404).json({ msg: 'Test case not found' });

        testCase.set(req.body);
        await testCase.save();
        res.json(testCase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete test cases for a specific question (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        let testCase = await TestCase.findById(req.params.id);
        if (!testCase) return res.status(404).json({ msg: 'Test case not found' });

        await testCase.remove();
        res.json({ msg: 'Test case removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

