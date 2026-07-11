# 🗺️ TRACE-XAI Technical Deployment Guide

This guide details the architectural specs and technical steps to deploy the TRACE-XAI platform in secure, production-grade cloud environments.

---

## 🏗️ Architectural Overview

TRACE-XAI uses a **single-node full-stack TypeScript** runtime architecture:
```
  [ Client Browser ]
          │ (HTTPS requests / WebSockets / Static Files)
          ▼
   [ Reverse Proxy ] ── (Terminates SSL / GZIP / Rate Limiting)
          │ (Port 3000)
          ▼
   [ Express Server ] ── (In-memory Vector Search, Activity, Reset Endpoints)
          │
          ├── [ Google Gemini API ] (Inquiries, Extraction, Neural Embeddings)
          └── [ Memory Stores ] (Document chunks & history list)
```

By leveraging the native TypeScript compilation of `esbuild` to compile `server.ts` into a bundled CommonJS file (`dist/server.cjs`), we ensure maximum runtime efficiency, lightning-fast container startup speeds, and 100% compliance with strict ES Module standards.

---

## 🛡️ Production Hardening & Security

Before rolling out the application, verify that the following security policies are implemented:

### 1. API Secret Safeguards
*   Never store raw API keys in source control.
*   **GEMINI_API_KEY** must be injected at runtime using cloud environment secrets managers (Google Secret Manager, AWS Parameter Store, or HashiCorp Vault).
*   Use environment variable checking on server startup to gracefully halt container execution if keys are missing.

### 2. Express Server Security Headers
We recommend deploying a reverse proxy like Nginx or Cloudflare in front of the application to inject proper security headers, including:
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com;" always;
```

---

## ☁️ Cloud Run Deployment (Google Cloud)

Google Cloud Run is the recommended hosting environment for TRACE-XAI due to its serverless, scale-to-zero capabilities and automatic HTTPS provisioning.

### Step-by-Step Command Line Setup

```bash
# 1. Authenticate with your Google Cloud account
gcloud auth login

# 2. Set your active target GCP Project ID
gcloud config set project [YOUR_PROJECT_ID]

# 3. Enable necessary Google Cloud APIs
gcloud services enable run.googleapis.com containerregistry.googleapis.com secretmanager.googleapis.com

# 4. Store your Gemini API Key in GCP Secret Manager securely
echo -n "your-gemini-key" | gcloud secrets create GEMINI_API_KEY --data-file=-

# 5. Build and submit your container image to Google Container Registry
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/trace-xai:latest

# 6. Deploy the container image to serverless Cloud Run
gcloud run deploy trace-xai \
  --image gcr.io/[YOUR_PROJECT_ID]/trace-xai:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --set-env-vars "NODE_ENV=production,APP_URL=https://trace-xai-service-url.run.app"
```

---

## 📦 Traditional VPS Deployment (Nginx + Systemd)

If deploying on virtual machines (Ubuntu / Debian / RHEL):

### 1. Systemd Service File
Create `/etc/systemd/system/trace-xai.service`:
```ini
[Unit]
Description=TRACE-XAI App Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/trace-xai
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=GEMINI_API_KEY=your_key_here
ExecStart=/usr/bin/node dist/server.cjs
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 2. Service Management Commands
```bash
# Reload daemon configurations
sudo systemctl daemon-reload

# Start the service
sudo systemctl start trace-xai

# Enable automatic startup on machine reboot
sudo systemctl enable trace-xai

# Check logs
sudo journalctl -u trace-xai -f
```

---

## ⚡ Caching, Performance & Optimization

*   **Vite Gzip Assets**: Vite compiles and splits assets in `dist/assets` into small, highly cached chunks. Configure your web server (Nginx/Apache) to use `gzip_static on;` to serve pre-compressed `.gz` files immediately.
*   **Memory Footprint**: In-memory vector databases are ideal for fast, multi-user temporary research sessions. For larger enterprises or multi-gigabyte document volumes, adapt the memory indices in `server.ts` to connect to a persistent Firestore collection or Cloud SQL instance.
