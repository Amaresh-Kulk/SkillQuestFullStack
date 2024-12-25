const express = require('express');
const { exec } = require('child_process');
const TestCase = require('../models/TestCase'); // Ensure proper model import
const router = express.Router();

// Map difficulty to scores
const difficultyScores = {
    easy: 2,
    medium: 4,
    hard: 8,
};

// Run code endpoint
router.post('/run', async (req, res) => {
    const { question_id, code } = req.body;
    // console.log(question_id);
    try {
        // Fetch the test cases for the given question ID
        const questionTestCases = await TestCase.findOne({ question_id: question_id });
        console.log(questionTestCases);
        if (!questionTestCases || questionTestCases.testCases.length === 0) {
            return res.status(404).json({ error: 'No test cases found for the given question.' });
        }

        const testCases = questionTestCases.testCases;
        const results = [];
        let passedCount = 0;

        // Execute test cases sequentially (or parallel based on language support)
        for (const testCase of testCases) {
            const { input, expectedOutput } = testCase;

            // Command to execute code (Adjust based on language and setup)
            const command = `echo "${input}" | node -e "${code}"`; // Adjust for JavaScript

            // Run the code with test case input
            const output = await new Promise((resolve, reject) => {
                exec(command, (err, stdout, stderr) => {
                    if (err) reject(stderr);
                    resolve(stdout.trim());
                });
            });

            // Compare output with expected output
            const passed = output === expectedOutput;
            if (passed) passedCount++;
            results.push({ input, expectedOutput, output, passed });
        }

        // Calculate score
        const score = passedCount === testCases.length ? difficultyScores[question.difficulty] : 0;

        res.json({
            passedCount,
            totalTestCases: testCases.length,
            results,
            score,
            success: passedCount === testCases.length,
        });
    } catch (err) {
        console.error('Error during code execution:', err);
        res.status(500).json({ error: 'Error executing code.' });
    }
});

module.exports = router;
