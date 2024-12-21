const mongoose = require('mongoose');

const AptitudeSchema = new mongoose.Schema({
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionText: { type: String, required: true },
    options: [{ optionText: String, isCorrect: Boolean }]
});

module.exports = mongoose.model('Aptitude', AptitudeSchema);
