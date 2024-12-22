const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    testCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('TestCase', TestCaseSchema);
