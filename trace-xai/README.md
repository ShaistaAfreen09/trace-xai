# 🌐 TRACE-XAI
### Temporal Retrieval-Augmented Conflict Explanation System

**TRACE-XAI** is an advanced Explainable AI (XAI) research and intelligence platform designed to ingest, parse, index, and audit temporal documents. By employing an in-memory high-performance vector semantic search index combined with Google's state-of-the-art **Gemini 3.5 Flash** model, TRACE-XAI addresses one of the hardest challenges in Document Intelligence: **Temporal contradictions and multi-source chronological conflicts**.

---

## 🚀 Core Research Features

*   **Temporal Ingestion Engine**: Native support for Plain Text (`.txt`), Markdown (`.md`), PDFs (`.pdf`), and Microsoft Word (`.docx`) with auto-extractable temporal anchors (historical year references).
*   **Vector Search & Indexing**: Uses high-dimensional neural representations via `gemini-embedding-2-preview` to retrieve highly relevant context segments with perfect mathematical cosine similarity mapping.
*   **Multi-Source Conflict Detection**: Scans across overlapping, chronological source blocks to isolate factual contradictions, chronological disagreements, or temporal parameter variances.
*   **Temporal Timeline & Evidence Mapping**: Automatically visualizes a unified chronological progression, complete with confidence scores and interactive source reference cards.
*   **Zero-Hallucination Guardrails**: Programmatic constraint instructions forcing the language generator to formulate claims ONLY using verified context snippets, alerting users when facts are missing or insufficient.

---

## 🛠️ Technological Stack

*   **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide-React, Motion (animations).
*   **Backend / Server**: Node.js, Express, ES Modules, `esbuild` compiler bundling.
*   **AI Models**: Google Gemini 3.5 Flash (`gemini-3.5-flash`), Google Gemini Embeddings (`gemini-embedding-2-preview`).
*   **Containerization**: Docker Multi-stage configuration, Docker Compose orchestration.

---

## ⚙️ Quickstart (Local Development)

### 1. Configure Secrets
Create a `.env` file in your root workspace:
```env
GEMINI_API_KEY="your_google_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### 2. Install & Run Locally
```bash
# Install packages
npm install

# Run the full-stack development environment (Port 3000)
npm run dev
```

### 3. Build & Run Production Bundle
```bash
# Bundle assets & compile server
npm run build

# Start the optimized build
npm run start
```

---

## 🐳 Docker Deployment

The fastest way to deploy TRACE-XAI to production:

```bash
# Build and run using Docker Compose
docker-compose up --build -d
```

Access the production console at `http://localhost:3000`.

---

## 🗺️ Workspace Navigation Guides

For more advanced operational and deploy guides, please consult our dedicated manuals:
1.  **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Exhaustive manual for Cloud Run, Kubernetes, SSL, and reverse proxy setup.
2.  **[Production Checklist](./PRODUCTION_CHECKLIST.md)**: Visual, step-by-step checklist to verify systems before live rollout.
