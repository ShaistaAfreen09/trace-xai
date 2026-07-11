# TRACE XAI

An AI-powered document intelligence platform that retrieves information from uploaded documents, identifies conflicting evidence, tracks the evolution of information over time, and generates transparent, evidence-based responses.

## Overview

TRACE XAI is designed for scenarios where information is spread across multiple documents and may contain conflicting viewpoints. Instead of returning a single synthesized answer, the system retrieves supporting evidence, highlights disagreements, and presents a chronological view of how information has evolved.

The project combines semantic search, conflict analysis, and explainable AI into a single workflow for transparent document understanding.

---

## Features

- Upload and manage PDF and text documents
- Semantic document retrieval
- Retrieval-Augmented Generation (RAG)
- Conflict detection between retrieved sources
- Timeline-based knowledge evolution
- Source attribution
- Evidence-based answer generation
- Interactive dashboard
- Responsive interface with dark and light themes

---

## Workflow

```text
Upload Documents
        ↓
Document Parsing
        ↓
Text Chunking
        ↓
Embedding Generation
        ↓
Vector Database
        ↓
Semantic Retrieval
        ↓
Conflict Detection
        ↓
Temporal Analysis
        ↓
Answer Generation
        ↓
Evidence & Timeline
```

---

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion

### Backend

- Python
- FastAPI

### AI & NLP

- Google Gemini
- Sentence Transformers
- FAISS
- BART MNLI

### Document Processing

- PyMuPDF

---

## Project Structure

```
trace-xai/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── assets/
│
└── README.md
```


---

## Installation

### Clone

```bash
git clone https://github.com/ShaistaAfreen09/trace-xai.git
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Applications

- Research paper analysis
- Enterprise document search
- Technical documentation
- Policy comparison
- Knowledge management
- Literature review

---

## Roadmap

- [ ] Multi-document comparison
- [ ] OCR support
- [ ] Multilingual document analysis
- [ ] Advanced visualization
- [ ] Additional embedding models

---

## License

MIT License
