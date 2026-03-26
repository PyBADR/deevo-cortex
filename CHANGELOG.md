# Changelog

All notable changes to DEEVO Cortex are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-03-26

### Added
- **DEEVO Monitor** — Live decision intelligence operating system at `/monitor`
- **Signal Engine** — Mean-reverting random walk signal simulation with scenario biases
- **Causal Graph Engine** — 3-iteration weighted influence propagation across 8 nodes, 10 edges
- **Decision Engine** — Rule-based computation with configurable client profiles, 6 risk rules
- **Causal Wave Engine** — requestAnimationFrame particle propagation with speed controls
- **Cognitive Scenario Engine** — Multi-path reasoning (3-5 futures), probability scoring, dominant path selection, convergence metrics
- **Pre-Causal Engine** — Pressure field model across 8 domains, narrative ingestion, anomaly detection, cross-domain contagion, forming indicators with ETA
- **Scenario Video Engine** — Canvas-based cinematic renderer, 5 scenarios, 4-scene structure (Hook→Chain→Decision→Branding), vertical/horizontal export, batch generation
- **5 interactive view modes** — GCC Map, Wave Sim, Cognitive Futures, Pre-Causal Intelligence, Video Engine
- **Interactive GCC Map** — SVG country nodes, trade corridors, click-to-select, hover tooltips
- **Signal Bar** — Real-time sparkline signal cards with severity coloring
- **Intel Blocks** — 6 clickable intelligence blocks (Risk, Claims, Fraud, Oil, Inflation, Supply)
- **Alerts Rail** — Decision badge, AI brief panel, country detail, alert feed

## [2.0.0] - 2026-03-25

### Added
- **Decision Intelligence Platform** - Enterprise-grade system for GCC markets intelligence
- **7-Layer Architecture** - Data Ingestion → Signal Processing → Causal Graph → Propagation Engine → Decision Logic → Executive Layer → API & UI
- **Causal Graph Engine** - Advanced signal relationship mapping and dependency analysis
- **Real-time Signal Processing** - Normalization and contextualization of market data streams
- **Propagation Simulation** - Cascading effect analysis through causal relationships
- **Executive Intelligence** - Automated briefing generation with confidence scoring
- **Risk Assessment Engine** - Portfolio and market risk evaluation under market shocks
- **GCC Market Coverage** - Support for 6 Gulf Cooperation Council countries with localized intelligence
- **Multi-language Support** - English (en) and Arabic (ar) interface localization
- **Demo Scenarios** - 5 pre-configured scenarios for market intelligence demonstration:
  - Oil Price Spike (geopolitical and OPEC+ impacts)
  - Fraud Surge (insurance fraud and portfolio cascading)
  - Inflation Crisis (central bank policy propagation)
  - Regulatory Changes (insurance regulation impact)
  - Supply Chain Shock (global logistics disruption)
- **REST API** - Complete API for intelligence computation and configuration retrieval
  - `/api/health` - Backend health check
  - `/api/settings` - Configuration and available scenarios
  - `/api/intelligence/ui` - UI-optimized intelligence payload
  - `/api/intelligence/run` - Custom intelligence computation
- **Premium Web Interface** - Dark theme command center with responsive dashboard
  - Signal Rail for real-time data streams
  - Globe Canvas for geospatial intelligence visualization
  - Decision Rail for executive recommendations
  - Executive Brief Panel with confidence metrics
  - Propagation Panel for effect simulation visualization
  - Scenario Switcher for demo scenario selection
  - Country Cards for regional analysis
- **Rate Limiting** - 100 requests/minute per endpoint
- **Token-based Authentication** - Secure API access with token validation
- **Session Management** - 1-hour inactivity timeout for sessions
- **Comprehensive Documentation**
  - README with architecture overview and quick start guide
  - Contributing guidelines with code style standards
  - Security policy with vulnerability reporting procedures
  - Self-hosting instructions for Docker and local deployment
  - Architecture documentation for 7-layer system design
- **Docker Support** - Full containerization for easy deployment
- **Vercel Deployment** - One-click serverless deployment option
- **Development Environment** - Complete setup for frontend (Node.js 18+, npm/yarn) and backend (Python 3.11+)

### Technical Highlights
- **Frontend** - React with TypeScript, Tailwind CSS, React Router
- **Backend** - Python with signal processing and causal graph libraries
- **UI/UX** - Premium dark theme with cyan accents, responsive grid layouts
- **Security** - HTTPS enforced, security headers configured, dependency scanning via Dependabot
- **Testing** - Comprehensive test suites for frontend (npm test) and backend (pytest)
- **Code Quality** - ESLint for JavaScript/TypeScript, PEP 8 compliance for Python
- **Performance** - Optimized signal processing with sub-second decision generation
- **Scalability** - Serverless architecture supporting enterprise workloads

### Notes
- Initial public release of DEEVO Cortex
- Production-ready for GCC market intelligence operations
- MIT Licensed - open source for community contributions
- Built by Bader Alabddan

---

## Roadmap

### Upcoming Features
- Advanced visualization modes for causal graph exploration
- Custom signal integration framework
- Machine learning signal prediction
- Historical scenario backtesting
- Real-time alert system
- Enhanced Arabic language support
- API authentication with OAuth2
- Database persistence layer
- Audit logging and compliance reporting
- Multi-user collaboration features
