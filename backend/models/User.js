//models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    scores: {
        aptitude: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
    },
    performanceMetrics: [{
        section: String,
        score: Number,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
