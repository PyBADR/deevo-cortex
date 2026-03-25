# GitHub Profile Optimization — DEEVO Cortex

> Recommendations for maximizing visibility and credibility of the repository on GitHub.

---

## Repository Metadata

**Name:** `deevo-cortex`
**Description:** AI decision intelligence for GCC insurance markets — See the risk. Before the market does.
**URL:** https://deevo-cortex.vercel.app

### Recommended Topics
```
ai, decision-intelligence, insurance, gcc, risk-analysis, causal-graph,
react, typescript, tailwindcss, vite, fastapi, langraph, ollama,
insurtech, middle-east, saudi-arabia, uae
```

### Social Preview Image
Create a 1280x640px image with:
- Dark background (#05070b)
- DEEVO wordmark in cyan (#22d3ee)
- Tagline: "See the risk. Before the market does."
- Subtle GCC map or network graph overlay
- Version badge: v2.0.0

---

## PyBADR GitHub Profile

### Profile README (`PyBADR/PyBADR/README.md`)

Suggested content:

```markdown
### Bader Alabddan

Building **DEEVO** — AI decision intelligence for GCC insurance markets.

**Stack:** Swift 6 · FastAPI · React · LangGraph · Ollama · CesiumJS · PostgreSQL

**Focus:** Insurance AI, causal reasoning, GCC regulatory compliance (PDPL, IFRS 17)

[DEEVO Cortex](https://github.com/PyBADR/deevo-cortex) · [Website](https://deevo-cortex.vercel.app)
```

### Pinned Repositories
1. **deevo-cortex** — the flagship repository (pin first)
2. Any supporting tools or libraries

---

## README Badges (already included)

```markdown
[![Version](https://img.shields.io/badge/v2.0.0-cyan?style=flat-square)](https://github.com/PyBADR/deevo-cortex)
[![License](https://img.shields.io/badge/MIT-green?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/badge/Vercel-black?style=flat-square)](https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex)
```

### Optional additional badges:
```markdown
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](frontend/tsconfig.json)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)](frontend/package.json)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square)](frontend/tailwind.config.ts)
```

---

## SEO & Discovery

### GitHub Searches This Repo Should Appear In:
- "insurance AI"
- "GCC risk analysis"
- "decision intelligence platform"
- "causal graph insurance"
- "insurtech open source"
- "AI underwriting"

### Actions to Improve Discovery:
1. **Star the repo** from your own account (signals activity)
2. **Create a GitHub Discussion** category for "Show and Tell"
3. **Add a GitHub Actions workflow** — even a simple CI badge builds credibility
4. **Write a launch post** for:
   - LinkedIn (GCC insurance + AI audience)
   - X/Twitter (developer audience)
   - Reddit r/insurtech, r/reactjs, r/machinelearning
   - Hacker News (Show HN)

---

## Suggested GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd frontend && npm ci && npm run build
```

This adds a green CI badge:
```markdown
[![CI](https://github.com/PyBADR/deevo-cortex/actions/workflows/ci.yml/badge.svg)](https://github.com/PyBADR/deevo-cortex/actions)
```

---

## Launch Announcement Template

### LinkedIn Post
```
Launching DEEVO Cortex — open-source AI decision intelligence for GCC insurance markets.

It reads 8 live signals, builds causal graphs, and outputs
APPROVE / REVIEW / ESCALATE decisions with confidence scores.

Built with React, FastAPI, LangGraph, and Ollama.
Deploys to Vercel in one click. No backend needed for demo mode.

Try it: https://deevo-cortex.vercel.app
Code: https://github.com/PyBADR/deevo-cortex

#InsurTech #AI #GCC #OpenSource #DecisionIntelligence
```

### Show HN
```
Title: Show HN: DEEVO – AI decision intelligence for GCC insurance markets
URL: https://github.com/PyBADR/deevo-cortex
```

---

**Prepared by:** Bader Alabddan (@PyBADR)
