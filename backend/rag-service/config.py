import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CHROMA_PERSIST_DIR = os.getenv(
    "CHROMA_PERSIST_PATH",
    str(BASE_DIR / "chroma_data"),
)
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "5"))
CHUNK_SIZE = int(os.getenv("RAG_CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("RAG_CHUNK_OVERLAP", "100"))
COLLECTION_NAME = "patient_clinical_records"
