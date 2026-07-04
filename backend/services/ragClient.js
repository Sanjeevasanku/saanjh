const axios = require('axios');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:5001';
const RAG_TIMEOUT = parseInt(process.env.RAG_TIMEOUT_MS || '120000', 10);

const client = axios.create({
    baseURL: RAG_SERVICE_URL,
    timeout: RAG_TIMEOUT,
});

async function isAvailable() {
    try {
        await client.get('/health');
        return true;
    } catch {
        return false;
    }
}

async function indexDocuments(patientId, patientName, documents) {
    const { data } = await client.post('/index', {
        patientId: String(patientId),
        patientName: patientName || '',
        documents,
    });
    return data;
}

async function chat(patientId, query, patientName) {
    const { data } = await client.post('/chat', {
        patientId: String(patientId),
        query,
        patientName: patientName || '',
    });
    return data;
}

module.exports = {
    isAvailable,
    indexDocuments,
    chat,
};
