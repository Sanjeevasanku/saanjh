"""
Saanjh Patient-Aware RAG Service
LangChain + ChromaDB + BGE embeddings + Ollama LLM
"""
import logging
from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama
from langchain_text_splitters import RecursiveCharacterTextSplitter

import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

_embeddings = None
_vectorstore = None
_llm = None
_text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=config.CHUNK_SIZE,
    chunk_overlap=config.CHUNK_OVERLAP,
)

RAG_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are MedAssist, a clinical assistant for the Saanjh healthcare platform.
Answer using ONLY the patient context below. If the answer is not in the context, say you do not have that information in this patient's records.

Rules:
- Do not invent lab values, diagnoses, or medications
- Do not prescribe or change treatment plans
- Use plain language
- Keep answers concise (under 200 words)
- End with: "Please consult a healthcare professional for medical decisions."

Patient context:
{context}""",
        ),
        ("human", "{input}"),
    ]
)

DISCLAIMER = "Please consult a healthcare professional for medical decisions."


def get_embeddings():
    global _embeddings
    if _embeddings is None:
        logger.info("Loading embedding model: %s", config.EMBEDDING_MODEL)
        _embeddings = HuggingFaceEmbeddings(
            model_name=config.EMBEDDING_MODEL,
            encode_kwargs={"normalize_embeddings": True},
        )
    return _embeddings


def get_vectorstore():
    global _vectorstore
    if _vectorstore is None:
        Path = __import__("pathlib").Path
        Path(config.CHROMA_PERSIST_DIR).mkdir(parents=True, exist_ok=True)
        _vectorstore = Chroma(
            collection_name=config.COLLECTION_NAME,
            embedding_function=get_embeddings(),
            persist_directory=config.CHROMA_PERSIST_DIR,
        )
    return _vectorstore


def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatOllama(
            base_url=config.OLLAMA_BASE_URL,
            model=config.OLLAMA_MODEL,
            temperature=0.1,
        )
    return _llm


def _patient_filter(patient_id: str) -> dict:
    return {"patientId": str(patient_id)}


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "embeddingModel": config.EMBEDDING_MODEL,
            "ollamaModel": config.OLLAMA_MODEL,
            "chromaPath": config.CHROMA_PERSIST_DIR,
        }
    )


@app.route("/index", methods=["POST"])
def index_documents():
    """
    Index patient documents into ChromaDB.
    Body: { patientId, patientName, documents: [{ docId, text, metadata? }] }
    """
    data = request.get_json(silent=True) or {}
    patient_id = data.get("patientId")
    patient_name = data.get("patientName", "")
    documents = data.get("documents", [])

    if not patient_id or not documents:
        return jsonify({"error": "patientId and documents are required"}), 400

    try:
        store = get_vectorstore()
        indexed = 0

        for doc in documents:
            doc_id = doc.get("docId")
            text = (doc.get("text") or "").strip()
            if not doc_id or not text:
                continue

            # Remove existing chunks for this docId + patient
            try:
                store.delete(where={"docId": str(doc_id), "patientId": str(patient_id)})
            except Exception:
                pass

            extra_meta = doc.get("metadata") or {}
            chunks = _text_splitter.split_text(text)
            langchain_docs = []
            for i, chunk in enumerate(chunks):
                langchain_docs.append(
                    Document(
                        page_content=chunk,
                        metadata={
                            "patientId": str(patient_id),
                            "patientName": str(patient_name),
                            "docId": str(doc_id),
                            "chunkIndex": i,
                            **{k: str(v) for k, v in extra_meta.items()},
                        },
                    )
                )

            if langchain_docs:
                store.add_documents(langchain_docs)
                indexed += len(langchain_docs)

        return jsonify({"indexed": indexed, "patientId": patient_id})
    except Exception as exc:
        logger.exception("Index failed")
        return jsonify({"error": str(exc)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    """
    Patient-aware RAG chat.
    Body: { patientId, query, patientName? }
    """
    data = request.get_json(silent=True) or {}
    patient_id = data.get("patientId")
    query = (data.get("query") or "").strip()
    patient_name = data.get("patientName", "")

    if not patient_id or not query:
        return jsonify({"error": "patientId and query are required"}), 400

    try:
        store = get_vectorstore()
        retriever = store.as_retriever(
            search_kwargs={
                "k": config.RAG_TOP_K,
                "filter": _patient_filter(patient_id),
            }
        )

        docs = retriever.invoke(query)
        if not docs:
            return jsonify(
                {
                    "answer": (
                        f"I don't have any indexed records for this patient yet. "
                        f"Upload a lab report or re-index patient data. {DISCLAIMER}"
                    ),
                    "sources": [],
                    "patientAware": True,
                }
            )

        context = "\n\n---\n\n".join(d.page_content for d in docs)
        sources = [
            {
                "docId": d.metadata.get("docId"),
                "type": d.metadata.get("type", "unknown"),
                "preview": d.page_content[:200],
            }
            for d in docs
        ]

        prompt_value = RAG_PROMPT.invoke(
            {
                "context": context,
                "input": query,
            }
        )

        try:
            llm = get_llm()
            response = llm.invoke(prompt_value)
            answer = response.content.strip()
        except Exception as llm_err:
            logger.warning("Ollama unavailable, returning retrieval-only: %s", llm_err)
            answer = (
                f"Based on {patient_name or 'this patient'}'s records:\n\n{context[:1500]}\n\n{DISCLAIMER}"
            )

        if DISCLAIMER not in answer:
            answer = f"{answer}\n\n{DISCLAIMER}"

        return jsonify(
            {
                "answer": answer,
                "sources": sources,
                "patientAware": True,
            }
        )
    except Exception as exc:
        logger.exception("Chat failed")
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    port = int(__import__("os").getenv("RAG_SERVICE_PORT", "5001"))
    app.run(host="127.0.0.1", port=port, debug=False)
