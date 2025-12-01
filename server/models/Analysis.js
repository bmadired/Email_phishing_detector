const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    emailText: {
        type: String,
        required: true,
    },
    prediction: {
        type: String,
        required: true,
        enum: ['phishing', 'safe'],
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    reasons: {
        type: [String],
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Analysis', analysisSchema);
