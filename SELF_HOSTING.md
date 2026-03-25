# Self-Hosting DEEVO Cortex

This guide covers deploying DEEVO Cortex on your own infrastructure, including Docker containerization, manual setup, and local development with Ollama on Mac M4 Max.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Manual Setup](#manual-setup)
3. [Environment Variables](#environment-variables)
4. [Mac M4 Max Local Setup with Ollama](#mac-m4-max-local-setup-with-ollama)
5. [Reverse Proxy Configuration](#reverse-proxy-configuration)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Security Hardening](#security-hardening)
8. [Troubleshooting](#troubleshooting)

---

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+ (optional, for multi-container setup)
- 2GB RAM minimum
- 1GB disk space

### Quick Start

Build and run the Docker image:

```bash
# Clone the repository
git clone https://github.com/PyBADR/deevo-cortex.git
cd deevo-cortex

# Build the Docker image
docker build -t deevo-cortex:latest .

# Run the container
docker run -p 8000:8000 -p 5173:5173 \
  -e NODE_ENV=production \
  -e PYTHON_ENV=production \
  deevo-cortex:latest
```

The application will be accessible at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Health check: http://localhost:8000/api/health

### Docker Compose Setup

For a more robust setup with separate services, use Docker Compose:

```yaml
# docker-compose.yml
version: "3.8"

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - PYTHON_ENV=production
      - LOG_LEVEL=info
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    environment:
      - REACT_APP_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

### Docker Environment Variables

```bash
# Backend
docker run -e FLASK_ENV=production \
           -e LOG_LEVEL=info \
           -e CORS_ORIGINS="https://yourdomain.com" \
           deevo-cortex:latest
```

---

## Manual Setup

### Prerequisites

- Node.js 18.0+
- Python 3.11+
- npm or yarn
- Git
- SQLite3 (optional, for persistence)

### Step 1: Backend Setup

```bash
# Clone repository
git clone https://github.com/PyBADR/deevo-cortex.git
cd deevo-cortex

# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration (see Environment Variables section)

# Run migrations (if applicable)
python migrate.py

# Start the backend server
python run.py
```

Backend will run on http://localhost:8000

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local to point to your backend

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

For production:

```bash
# Build optimized frontend
npm run build

# Serve with a production server
npm install -g serve
serve -s dist -l 5173
```

### Step 3: Verify Installation

```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend accessibility
curl http://localhost:5173
```

---

## Environment Variables

### Backend (.env.local)

```bash
# Server Configuration
FLASK_ENV=production
FLASK_DEBUG=False
LOG_LEVEL=info
PORT=8000

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
RATE_LIMIT_ENABLED=True
RATE_LIMIT_PER_MINUTE=100

# Database (optional)
DATABASE_URL=sqlite:///./cortex.db
# or for PostgreSQL: postgresql://user:password@localhost/cortex

# Logging
LOG_FILE=/var/log/deevo-cortex/backend.log
LOG_MAX_SIZE=10M
LOG_BACKUP_COUNT=5

# Feature Flags
ENABLE_DEMO_MODE=False
ENABLE_API_DOCUMENTATION=True
```

### Frontend (.env.local)

```bash
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=True
VITE_ENABLE_ERROR_TRACKING=True

# Locale
VITE_DEFAULT_LOCALE=en
VITE_SUPPORTED_LOCALES=en,ar

# Build
VITE_BUILD_TARGET=es2020
```

### Production Checklist

Before deploying to production:

- [ ] All secrets are in .env.local (not in .env.example)
- [ ] SECRET_KEY is a long, random string (min 32 characters)
- [ ] JWT_SECRET is unique and secure
- [ ] CORS_ORIGINS is restricted to your domain only
- [ ] LOG_LEVEL is set to info (not debug)
- [ ] ENABLE_DEMO_MODE is False
- [ ] FLASK_DEBUG is False
- [ ] Database is backed up automatically
- [ ] Rate limiting is enabled
- [ ] HTTPS/TLS is enforced

---

## Mac M4 Max Local Setup with Ollama

For local development on Mac M4 Max with AI model capabilities via Ollama.

### Prerequisites

- Mac M4 Max (or M3/M2 with sufficient RAM)
- 8GB RAM minimum (16GB+ recommended)
- 50GB free disk space for models
- Homebrew installed

### Step 1: Install Ollama

```bash
# Install via Homebrew
brew install ollama

# Or download from https://ollama.ai/download/mac

# Start Ollama service
ollama serve
```

This starts the Ollama API on http://localhost:11434

### Step 2: Download Models

In a new terminal:

```bash
# Pull a lightweight model for testing
ollama pull mistral

# Pull neural search model
ollama pull neural-search

# Pull embedding model (recommended: nomic-embed-text)
ollama pull nomic-embed-text

# List installed models
ollama list
```

### Step 3: Configure Backend for Ollama

Update .env.local:

```bash
# Ollama Configuration
OLLAMA_ENABLED=True
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_TEMPERATURE=0.7
OLLAMA_TOP_K=40
OLLAMA_TOP_P=0.9

# Model-specific settings
OLLAMA_CONTEXT_SIZE=2048
OLLAMA_NUM_PREDICT=256
```

### Step 4: Run DEEVO Cortex with Ollama

```bash
# From the deevo-cortex directory
source venv/bin/activate

# Start the backend (will use Ollama if configured)
python run.py

# In another terminal, start frontend
cd frontend
npm run dev
```

### Step 5: Test Ollama Integration

```bash
# Test Ollama connectivity
curl http://localhost:11434/api/tags

# Test via DEEVO Cortex API
curl -X POST http://localhost:8000/api/intelligence/run \
  -H "Content-Type: application/json" \
  -d '{"locale": "en", "scenario": "oil_spike", "country_id": "sa"}'
```

### Performance Optimization on M4 Max

```bash
# Allocate GPU acceleration to Ollama
# Edit Ollama configuration or environment
export OLLAMA_GPU_LAYERS=20  # Adjust based on available VRAM

# Increase context window for better reasoning
export OLLAMA_CONTEXT_SIZE=4096

# Monitor resource usage
top -o %MEM -o %CPU
```

### Model Selection for M4 Max

| Model | Size | Speed | Quality | Recommended |
|-------|------|-------|---------|------------|
| **mistral** | 4.1GB | Fast | High | ✅ Best Balance |
| **neural-search** | 3.8GB | Fast | High | ✅ For Embeddings |
| **llama2** | 3.8GB | Medium | High | ✅ Good Alternative |
| **orca-mini** | 1.7GB | Very Fast | Medium | For Testing |

---

## Reverse Proxy Configuration

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/deevo-cortex
upstream backend {
    server 127.0.0.1:8000;
}

upstream frontend {
    server 127.0.0.1:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # API Routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # Frontend Routes
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/deevo-cortex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Monitoring and Logging

### Backend Logging

Configure logging in run.py or settings:

```python
import logging
from logging.handlers import RotatingFileHandler

# Set up rotating file handler
handler = RotatingFileHandler(
    'logs/cortex.log',
    maxBytes=10485760,  # 10MB
    backupCount=5
)
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
))
logger.addHandler(handler)
```

### System Monitoring

```bash
# Monitor CPU and memory usage
watch -n 5 'ps aux | grep python | grep run.py'

# Monitor disk usage
df -h

# Monitor logs in real-time
tail -f logs/cortex.log
```

### Health Checks

```bash
# Simple health check script
#!/bin/bash
curl -f http://localhost:8000/api/health && \
curl -f http://localhost:5173 && \
echo "All systems operational" || \
echo "Health check failed - system may be down"
```

---

## Security Hardening

### Checklist

- [ ] HTTPS/TLS enabled with valid certificate
- [ ] Security headers configured (see Nginx config)
- [ ] Rate limiting enabled (100 requests/minute)
- [ ] API authentication enforced
- [ ] Database backups configured and tested
- [ ] Access logs configured and monitored
- [ ] Firewall rules restricting access to necessary ports only
- [ ] Regular dependency updates via `npm audit` and `pip-audit`
- [ ] Secrets stored in .env.local (never committed)
- [ ] CORS properly configured for your domain

### Firewall Rules (UFW)

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other incoming
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Enable firewall
sudo ufw enable
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Should be 3.11+

# Check if port 8000 is in use
lsof -i :8000
# Kill the process if needed
kill -9 <PID>

# Check for import errors
python -c "import flask; import numpy; import pandas"

# View detailed error logs
FLASK_DEBUG=True python run.py
```

### Frontend Won't Start

```bash
# Check Node version
node --version  # Should be 18+

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if port 5173 is in use
lsof -i :5173
```

### Ollama Connection Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve

# Check Ollama logs
log stream --predicate 'process == "ollama"'

# Re-pull model if corrupted
ollama pull --insecure mistral
```

### Database Issues

```bash
# Check database integrity
sqlite3 cortex.db "PRAGMA integrity_check;"

# Backup before troubleshooting
cp cortex.db cortex.db.backup

# Reset database (development only)
rm cortex.db
python migrate.py
```

### Performance Issues

```bash
# Check system resources
free -h
df -h
vmstat 1 5

# Monitor running processes
top

# Check network connectivity
ping google.com
curl -I http://localhost:8000/api/health
```

### SSL/TLS Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /path/to/cert.pem -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew --dry-run
sudo certbot renew

# Verify Nginx SSL configuration
sudo nginx -t
```

---

## Support and Resources

- **GitHub Issues**: https://github.com/PyBADR/deevo-cortex/issues
- **Email Support**: bader.marketing.39@gmail.com
- **Documentation**: https://deevo-cortex.vercel.app/docs

---

**Last Updated**: 2026-03-25
**Maintained By**: DEEVO Team
