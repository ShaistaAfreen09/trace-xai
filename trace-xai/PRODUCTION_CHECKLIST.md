# 📋 TRACE-XAI Production Readiness Checklist

This document provides a systematic verification guide to check off before promoting any instance of TRACE-XAI into a production environment.

---

## 🔒 Security Configuration
- [ ] **Secrets Segregation**: The `GEMINI_API_KEY` is injected as a secure runtime container variable or Secret Mount. It is **not** hardcoded in the codebase or version control.
- [ ] **HTTPS Redirection**: Your domain redirect policy forces all HTTP requests to redirect to HTTPS.
- [ ] **Vulnerability Auditing**: Run `npm audit` to verify all client and server dependencies are up-to-date and free of major vulnerabilities.
- [ ] **Security Headers Configured**: Secure frame headers (`X-Frame-Options: DENY`, CSP, and `X-Content-Type-Options: nosniff`) are configured in the reverse proxy or Cloud Run configuration.

---

## ⚙️ Environment Variables Verification
- [ ] **NODE_ENV**: Explicitly set to `"production"`.
- [ ] **PORT**: Properly set to `3000` (or mapped properly by your cloud provider).
- [ ] **APP_URL**: Corresponds to your actual custom public-facing domain (e.g., `https://trace.your-org.com`).

---

## 🚦 Operational Performance Testing
- [ ] **Payload Limits Verified**: Upload large PDF and DOCX files (up to 10MB) to verify that the Express body parsers (`limit: '10mb'`) and proxy structures handle heavy uploads without 413 Payload Too Large errors.
- [ ] **Text Extraction and Parsing**: Ingest binary documents (PDF, DOCX) to ensure text extraction pipelines via Gemini are operating quickly and correctly.
- [ ] **High-Dimensional Neural Embedding**: Submit multiple queries to confirm `gemini-embedding-2-preview` model responses and verify that the cosine similarity calculations output correct relevancy scores.
- [ ] **Memory Integrity Checking**: Confirm that memory caches, retrieved chunk arrays, and query histories are stored cleanly and can be purged instantly using the "Wipe System Index" button under Settings.

---

## 📱 Accessibility & Design Quality
- [ ] **Responsive Visual Flow**: Test on Mobile, Tablet, and Desktop viewport sizes to confirm that grid cards, input containers, and side timeline overlays scale properly.
- [ ] **Color Contrast Verification**: Verify that light/dark state contrasts adhere to WCAG AAA standards for optimal readability.
- [ ] **HTML ID Mappings**: Confirm that interactive controls have correct unique HTML `id` targets for accessibility and telemetry tracking.
