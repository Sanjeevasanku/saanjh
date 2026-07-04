# Saanjh RAG Service

Patient-aware clinical chatbot using **LangChain**, **ChromaDB**, **BAAI/bge-small-en-v1.5**, and **Ollama**.

## Prerequisites

1. **Python 3.10+**
2. **Ollama** running locally with a chat model:
   ```bash
   ollama pull llama3.1:8b
   # or: ollama pull cniongolo/biomistral
   ```

## Setup

```bash
cd backend/rag-service
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Service listens on **http://127.0.0.1:5001**

## Environment variables

| Variable | Default |
|----------|---------|
| `RAG_SERVICE_PORT` | `5001` |
| `EMBEDDING_MODEL` | `BAAI/bge-small-en-v1.5` |
| `CHROMA_PERSIST_PATH` | `./chroma_data` |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` |
| `OLLAMA_MODEL` | `llama3.1:8b` |
| `RAG_TOP_K` | `5` |

Add to `backend/.env`:

```
RAG_SERVICE_URL=http://127.0.0.1:5001
```

## API

### `GET /health`
Service status.

### `POST /index`
Index patient documents.

```json
{
  "patientId": "...",
  "patientName": "Jane Doe",
  "documents": [
    { "docId": "profile_xxx", "text": "...", "metadata": { "type": "profile" } }
  ]
}
```

### `POST /chat`
Patient-scoped RAG query.

```json
{
  "patientId": "...",
  "patientName": "Jane Doe",
  "query": "What was the last HbA1c?"
}
```

## Integration with Node backend

- Reports are auto-indexed after `/en/analysis` completes.
- Chatbot calls `/chat` when `patientId` is sent to `/en/chatbot`.
- Re-index all reports for a patient: `POST /en/rag/reindex-patient` with `{ "patientId": "..." }`.
- If Ollama is down, Node falls back to Gemini with full MongoDB context.
