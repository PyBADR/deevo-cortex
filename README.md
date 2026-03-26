<div align="center">

# DEEVO Decision Intelligence

### Insurance Decision Operating System

**Real-time decision infrastructure for insurance claims.**

[![Version](https://img.shields.io/badge/v3.0.0-cyan?style=flat-square)](https://github.com/PyBADR/deevo-cortex)
[![License](https://img.shields.io/badge/MIT-green?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/Vercel-black?style=flat-square)](https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex)

*by Bader Alabddan*

</div>

---

## Live Demo

[**Claims Decision Control Room**](https://deevo-cortex.vercel.app/claims) · [**Monitor**](https://deevo-cortex.vercel.app/monitor) · [**Command Center**](https://deevo-cortex.vercel.app/command-center)

---

## What This Is

We built a real-time decision system for insurance claims.

It doesn't just show data.

It tells you:
- **What's happening** — fraud signals, anomaly detection, risk scoring
- **Why it's happening** — entity network analysis, decision drivers, evidence trail
- **What to do** — AI-driven recommendations with confidence scores
- **What the financial impact is** — approval cost, rejection saving, litigation risk

All decisions are auditable and explainable.

This reduces fraud loss, speeds up claims, and improves compliance.

**This is not a dashboard. This is a Decision Operating System for insurance.**

---

## Claims Decision Control Room

The flagship interface. Route: `/claims`

### What it does

- Detects fraud signals in real-time
- Provides AI-driven claim decisions
- Shows explainable reasoning
- Tracks full audit trail
- Enables human override

### Key Features

| Feature | Description |
|---------|-------------|
| Decision Engine | Approve / Reject / Escalate / Request Docs |
| Risk Scoring | 8-factor weighted assessment with category breakdown |
| Anomaly Detection | Statistical deviation alerts with severity classification |
| Entity Relationship Graph | Network visualization — flagged entities, suspicious links |
| Decision Drivers | Signal-to-decision bridge showing weighted impact factors |
| Financial Impact | Approval cost, rejection saving, litigation risk, reinsurance recovery |
| Forensic Audit Timeline | SHA-256 hashed, actor-typed event log (AI / SYSTEM / ANALYST) |
| Evidence Tracking | Document verification status with completeness scoring |

### Layout

```
TOP:     Claim ID · Claimant · Policy · Amount · Risk Score · Status · SLA
LEFT:    Entity Graph + Claim Metadata + Evidence
CENTER:  Risk Summary + Decision Drivers + Time Series + Anomalies
RIGHT:   AI Recommendation + Confidence + Reasoning + Impact + Actions
BOTTOM:  Forensic Audit Timeline
```

---

## Signal Intelligence Monitor

The macro intelligence layer. Route: `/monitor`

Five visualization engines for GCC-wide market intelligence:

| Engine | Function |
|--------|----------|
| GCC Map | Interactive country risk map with trade corridors |
| Wave Simulation | Causal wave propagation with animated particles |
| Cognitive Engine | Multi-path reasoning — competing futures per scenario |
| Pre-Causal Engine | Pressure fields detecting risk before signals form |
| Video Renderer | Cinematic scenario video generation |

---

## Architecture

```
Signals → Graph → Rules → Simulation → Decision → Action → Audit
```

```
┌─────────────────────────────────────────────────────┐
│ 7. Governance        Audit trail, SHA-256, PDPL     │
├─────────────────────────────────────────────────────┤
│ 6. UI & Actions      Control Room, Decision Panels  │
├─────────────────────────────────────────────────────┤
│ 5. API               REST endpoints, WebSocket      │
├─────────────────────────────────────────────────────┤
│ 4. Agent Layer       AI recommendations, reasoning  │
├─────────────────────────────────────────────────────┤
│ 3. Decision Logic    Risk rules, anomaly detection   │
├─────────────────────────────────────────────────────┤
│ 2. Feature Engine    Signals, entity graphs, scoring │
├─────────────────────────────────────────────────────┤
│ 1. Data Ingestion    Claims, policies, fraud feeds   │
└─────────────────────────────────────────────────────┘
```

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Design System | Graphite-gray 4-layer surface system (d-* tokens) |
| Visualization | SVG entity graphs, sparkline charts, time series |
| Backend | FastAPI + PostgreSQL + LangGraph |
| AI | Ollama (local GPU), GPT-4 (cloud) |
| Deployment | Vercel (frontend), Docker Compose (backend) |

---

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173` — claims demo works without backend.

For full stack:

```bash
pip install -r requirements.txt
python run.py          # Backend on :8000
cd frontend && npm run dev  # Frontend on :5173
```

---

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex)

Set `VITE_API_BASE_URL` to connect a backend. Leave empty for demo mode.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

**Built by [Bader Alabddan](https://github.com/PyBADR)**

Star this repo to follow development.

</div>
