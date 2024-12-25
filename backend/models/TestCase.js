const mongoose = require('mongoose');
const DSA = require('./Coding');
const TestCaseSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: DSA
    },
    testCases: [
        {
            input: { type: String, required: true },
            expectedOutput: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model('TestCase', TestCaseSchema);
