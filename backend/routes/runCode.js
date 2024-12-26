const express = require('express');
const { NodeVM } = require('vm2');  // Import NodeVM from vm2 for sandboxing
const Submission = require('../models/Submission');
const router = express.Router();

// Map difficulty to scores
const difficultyScores = {
    easy: 2,
    medium: 4,
    hard: 8,
};

router.post('/run', async (req, res) => {
    const { question_id, code, userId } = req.body;

    try {
        console.log('Received request to execute code:', { question_id, code });

        // Example difficulty, you may want to fetch this dynamically based on the question
        const difficulty = 'easy';

        // Create a NodeVM for secure code execution
        const vm = new NodeVM({
            console: 'redirect', // Capture console logs
            sandbox: { userId, question_id }, // Add any necessary variables to the sandbox
            require: {
                external: true, // Allow external libraries if needed
            },
            wrapper: 'none', // Prevent the wrapper function from modifying the code
        });

        // Run the user's code in the sandbox
        const result = vm.run(code);

        // Check for success (you might want to improve this part with actual test cases)
        const success = result.success || false;
        const score = success ? difficultyScores[difficulty] : 0;

        // Create a new submission document
        const newSubmission = new Submission({
            userId,
            questionId: question_id,
            code,
            language: 'javascript',
            output: result.output,
            error: result.error || null,
            score,  // Add score
        });

        // Save the submission to the database
        await newSubmission.save();

        // Send response with results
        res.json({
            passedCount: 1,
            totalTestCases: 1,
            results: [{
                input: code,
                expectedOutput: result.output || 'No output',
                output: result.output,
                passed: success,
            }],
            score,
            success,
        });
    } catch (err) {
        console.error('Error during code execution:', err);
        res.status(500).json({ error: 'Error executing code.' });
    }
});

module.exports = router;
