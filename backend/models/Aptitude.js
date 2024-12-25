const mongoose = require('mongoose');

const AptitudeSchema = new mongoose.Schema({
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionText: { type: String, required: true },
    options: [{ optionText: String, isCorrect: Boolean }],
    explanation: { type: String } // New field for brief explanations
});

module.exports = mongoose.model('Aptitude', AptitudeSchema);
