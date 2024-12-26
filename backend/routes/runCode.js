const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const Submission = require('../models/Submission'); // Import the Submission model

const router = express.Router();

router.use(bodyParser.json());
router.use(cors());

const TMP_FOLDER = './tmp';

// Ensure temporary folder exists
if (!fs.existsSync(TMP_FOLDER)) {
    fs.mkdirSync(TMP_FOLDER);
}



// Endpoint to run user code
router.post('/run', async (req, res) => {
    console.log('Request received:', req.body);

    const { code, language, userId, questionId } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required.' });
    }

    const fileExtensions = {
        javascript: 'js',
        python: 'py',
        java: 'java',
    };

    const fileExtension = fileExtensions[language.toLowerCase()];

    if (!fileExtension) {
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    const fileName = `code_${Date.now()}.${fileExtension}`;
    const filePath = path.join(TMP_FOLDER, fileName);

    // Write code to a temporary file
    fs.writeFileSync(filePath, code);

    let command = '';
    if (language === 'javascript') {
        command = `node ${filePath}`;
    } else if (language === 'python') {
        command = `python ${filePath}`;
    } else if (language === 'java') {
        const className = fileName.replace('.java', '');
        command = `javac ${filePath} && java ${className}`;
    }

    // Execute the command
    exec(command, async (error, stdout, stderr) => {
        // Cleanup temporary file
        fs.unlinkSync(filePath);

        const output = error || stderr ? stderr || 'Error executing the code.' : stdout.trim();

        // Save the submission to the database
        const submission = new Submission({
            userId,
            questionId,
            code,
            language,
            output,
            error: error || stderr ? output : null,
        });

        try {
            await submission.save();
            res.json({ output });
        } catch (err) {
            console.error("Error saving submission:", err);
            res.status(500).json({ error: 'Failed to save submission.' });
        }
    });
});

module.exports = router;
