const mongoose = require('mongoose');
const DSA = require('./Coding');
const MainFunctionSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: DSA
  },
  code: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('MainFunction', MainFunctionSchema);
