// models/AptitudeSubmission.js
const mongoose = require('mongoose');

const AptitudeSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aptitude', required: true }, // Reference to Aptitude question
  selectedOption: { type: String, required: true }, // User-selected answer
  isCorrect: { type: Boolean, required: true }, // Whether the selected option is correct
  submissionDate: { type: Date, default: Date.now } // When the submission was made
});

module.exports = mongoose.model('AptitudeSubmission', AptitudeSubmissionSchema);
