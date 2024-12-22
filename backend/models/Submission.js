// models/Submission.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  output: { type: String },  // Store output of the code execution
  error: { type: String },   // Store any errors encountered during execution
  submissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
