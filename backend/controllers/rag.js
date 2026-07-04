const ragClient = require('../services/ragClient');
const ragIndexer = require('../services/ragIndexer');

async function reindexPatient(req, res) {
    const { patientId } = req.body;
    if (!patientId) {
        return res.status(400).json({ error: 'patientId is required' });
    }

    try {
        const available = await ragClient.isAvailable();
        if (!available) {
            return res.status(503).json({
                error: 'RAG service unavailable. Start: python backend/rag-service/app.py',
            });
        }

        const result = await ragIndexer.indexPatient(patientId);
        return res.json({ success: true, ...result });
    } catch (error) {
        console.error('Reindex failed:', error);
        return res.status(500).json({ error: 'Failed to reindex patient records' });
    }
}

module.exports = { reindexPatient };
