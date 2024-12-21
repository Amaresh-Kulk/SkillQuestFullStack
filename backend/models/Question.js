const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: { type: String, enum: ['aptitude', 'coding'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionText: { type: String, required: true },
    options: [{ optionText: String, isCorrect: Boolean }]
});

module.exports = mongoose.model('Question', QuestionSchema);
