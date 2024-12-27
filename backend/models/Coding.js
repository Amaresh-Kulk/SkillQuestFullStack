const mongoose = require('mongoose');

const DsaSchema = new mongoose.Schema({
    category: { 
        type: String, 
        enum: ['arrays', 'linked-lists', 'trees', 'graphs', 'dynamic-programming', 'recursion', 'sorting'], 
        required: true 
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionText: { type: String, required: true },
    constraints: { type: String }, // Optional constraints like input size, range
    example: {
        input: String,
        output: String
    },
    solution: { type: String }, // Optional field to store a solution hint or full solution
    description: { type: String } 
});

module.exports = mongoose.model('DSA', DsaSchema);
