const express = require('express');
const Analysis = require('../models/Analysis');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

// Auto detect python command
function getPythonCmd() {
    return process.platform === 'win32' ? 'python' : 'python3';
}

// POST /api/predict - Analyze email and save to database
router.post('/predict', async (req, res) => {
    const text = req.body.text || '';

    const pythonFile = path.join(__dirname, '..', 'python', 'predict.py');
    const python = spawn(getPythonCmd(), [pythonFile]);
    let result = '';

    python.stdin.write(JSON.stringify({ text }));
    python.stdin.end();

    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    python.on('close', async () => {
        try {
            const output = JSON.parse(result);

            // Try to save to MongoDB if connected
            try {
                const analysis = new Analysis({
                    emailText: text,
                    prediction: output.prediction,
                    confidence: output.confidence,
                    reasons: output.reasons || [],
                });

                await analysis.save();

                // Return result with database ID
                res.json({
                    ...output,
                    id: analysis._id,
                    saved: true
                });
            } catch (dbError) {
                // MongoDB not available, just return results without saving
                console.log('MongoDB not available, returning results without saving');
                res.json({
                    ...output,
                    saved: false
                });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Prediction failed' });
        }
    });
});

// GET /api/history - Get all analysis history
router.get('/history', async (req, res) => {
    try {
        const history = await Analysis.find()
            .sort({ timestamp: -1 })
            .limit(50);

        res.json(history);
    } catch (error) {
        console.log('MongoDB not available, returning empty history');
        res.json([]);
    }
});

// DELETE /api/history/:id - Delete specific analysis
router.delete('/history/:id', async (req, res) => {
    try {
        await Analysis.findByIdAndDelete(req.params.id);
        res.json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        console.error('Error deleting analysis:', error);
        res.status(500).json({ error: 'Failed to delete analysis' });
    }
});

// DELETE /api/history - Clear all history
router.delete('/history', async (req, res) => {
    try {
        await Analysis.deleteMany({});
        res.json({ message: 'All history cleared successfully' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ error: 'Failed to clear history' });
    }
});

module.exports = router;
