# DEEVO Cortex v2.0.0 — Launch Release Notes

**Release Date:** 2026-03-25
**Author:** Bader Alabddan (@PyBADR)
**License:** MIT

---

## Overview

DEEVO Cortex v2.0.0 is the first public release of the AI decision intelligence platform for GCC insurance markets. It transforms real-time economic signals into executive-level APPROVE / REVIEW / ESCALATE decisions through causal graph analysis.

The frontend ships as a standalone SPA that works with zero backend dependency — 5 curated demo scenarios powered by real engine output provide the full product experience out of the box.

---

## What's New

### Command Center
- Cinematic dark UI inspired by Palantir / World Monitor aesthetic
- Decision-dominant layout with 40px glow effects and text-5xl risk scores
- 12-column responsive grid: Signals | Globe | Decisions | Brief | Propagation | Scenarios | Country
- SVG-based GCC Intelligence Network with animated node pulses and edge intensity
- Real-time signal feed sorted by severity with embedded sparkline charts

### Demo Mode
- 5 production-quality scenarios generated from actual engine output:
  - **Oil Price Spike** — OPEC+ disruption cascading through GCC markets
  - **Fraud Surge** — Insurance fraud waves impacting portfolio risk
  - **Supply Chain Break** — Global logistics disruptions on trade insurance
  - **Repair Cost Inflation** — Parts cost escalation affecting claims reserves
  - **Geopolitical Escalation** — Regional tensions driving cross-market risk
- Automatic fallback when backend is unreachable (3s health check timeout)
- Scenario switching with live payload reload

### Bilingual Support
- Full EN/AR toggle with 38 translated labels
- RTL layout support via `dir` attribute on root element
- Arabic labels across all 10 command center components

### Landing Page
- Bold product page: "See the risk. Before the market does."
- Animated gradient hero with pipeline flow visualization
- Capability cards, architecture strip, GitHub CTA

### Architecture
- Vite + React 18 + TypeScript (strict mode) + Tailwind CSS
- React Router v6 with 4 routes: `/`, `/command-center`, `/docs`, `/*`
- API client with health check → live data || demo fallback pattern
- 10 modular components: TopCommandBar, SignalRail, GlobeCanvas, DecisionRail, ExecutiveBrief, PropagationPanel, ScenarioSwitcher, CountryCard, LoadingState, EmptyState

### Deployment
- Vercel-optimized with `vercel.json` SPA rewrites
- Security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- `VITE_API_BASE_URL` environment variable for backend connection (empty = demo-only)
- One-click Vercel deploy button in README

### Repository
- README.md — bold, decision-focused, under 101 lines
- CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md
- SELF_HOSTING.md — Docker, manual setup, Mac M4 Max + Ollama guide
- CHANGELOG.md, RELEASES.md, LICENSE (MIT)

---

## Build Stats

| Metric | Value |
|--------|-------|
| TypeScript errors | 0 |
| Build time | ~6s |
| JS bundle | 365.90 KB (86.42 KB gzip) |
| CSS bundle | 20.31 KB (4.63 KB gzip) |
| Components | 10 |
| Demo payloads | 5 |
| i18n keys | 38 (EN + AR) |
| Routes | 4 |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3 |
| Build | Vite 5.4 |
| Language | TypeScript 5.5 (strict) |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router 6.23 |
| Icons | Lucide React 0.383 |
| Charts | Recharts 2.12 |
| Deployment | Vercel (SPA) |
| Backend | FastAPI + PostgreSQL + LangGraph + Ollama (optional) |

---

## Known Limitations

1. **Demo payloads are static** — they represent a snapshot of engine output at generation time. Live data requires the backend running.
2. **Globe visualization is SVG-based** — not a true 3D globe. Adequate for GCC 6-country network topology.
3. **No authentication** — v2.0.0 is a public demo. Multi-tenant auth planned for v2.1.
4. **No community chat** — consider adding GitHub Discussions for community engagement.

---

## Upgrade Path

- **v2.1** — Authentication, user roles, tenant isolation
- **v2.2** — CesiumJS 3D globe, real-time WebSocket signal streaming
- **v2.3** — IFRS 17 compliance module, PDPL data sovereignty controls
- **v3.0** — Full FRIN (Fraud & Risk Intelligence Network) cross-industry deployment

---

**Built by [Bader Alabddan](https://github.com/PyBADR)**
