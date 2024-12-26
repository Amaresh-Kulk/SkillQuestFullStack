const express = require('express');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');  // Assuming authentication middleware is present
const { check, validationResult } = require('express-validator');
const router = express.Router();

// Create a new submission
router.post(
    '/',
    [
        auth, // Authentication middleware to ensure the user is logged in
        check('questionId', 'Question ID is required').not().isEmpty(),
        check('code', 'Code is required').not().isEmpty(),
        check('language', 'Language is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { questionId, code, language } = req.body;
        const userId = req.user.id; // Assuming auth middleware adds user data

        try {
            // Create a new submission
            const newSubmission = new Submission({
                userId,
                questionId,
                code,
                language,
            });

            await newSubmission.save();
            res.status(201).json(newSubmission);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get all submissions for a specific user
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.params.userId }).populate('questionId', 'title');
        if (!submissions) {
            return res.status(404).json({ msg: 'No submissions found for this user' });
        }
        res.json(submissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all submissions for a specific question
router.get('/question/:questionId', async (req, res) => {
    try {
        const submissions = await Submission.find({ questionId: req.params.questionId }).populate('userId', 'username');
        if (!submissions) {
            return res.status(404).json({ msg: 'No submissions found for this question' });
        }
        res.json(submissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single submission by its ID
router.get('/:id', async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id).populate('userId', 'username').populate('questionId', 'title');
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found' });
        }
        res.json(submission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a submission (for example, to add output or errors)
router.put('/:id', auth, async (req, res) => {
    const { output, error } = req.body;

    // Input validation
    if (!output && !error) {
        return res.status(400).json({ msg: 'Either output or error must be provided' });
    }

    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found' });
        }

        // Update the submission with the output or error
        submission.output = output || submission.output;
        submission.error = error || submission.error;

        await submission.save();
        res.json(submission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a submission (optional)
router.delete('/:id', auth, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found' });
        }

        // Ensure the logged-in user is the one who made the submission
        if (submission.userId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to delete this submission' });
        }

        await submission.remove();
        res.json({ msg: 'Submission removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
