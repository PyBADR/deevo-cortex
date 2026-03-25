# DEEVO Cortex Documentation

## Overview

DEEVO Cortex is a Decision Intelligence platform designed for GCC markets. This documentation covers the architecture, deployment, and usage of the platform.

## Contents

- [Architecture](../ARCHITECTURE.md) - System architecture and design
- [Contributing](../CONTRIBUTING.md) - How to contribute
- [Security](../SECURITY.md) - Security policy
- [Releases](../RELEASES.md) - Release notes

## Quick Links

### For Users

- [Getting Started](#getting-started)
- [Command Center Guide](#command-center)
- [Signal Types](#signal-types)
- [Decision Logic](#decision-logic)

### For Developers

- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## Getting Started

### One-Click Deploy

The fastest way to get started is to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex)

### Local Development

```bash
# Clone the repository
git clone https://github.com/PyBADR/deevo-cortex.git
cd deevo-cortex

# Install frontend dependencies
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

---

## Command Center

The DEEVO GCC Command Center is the primary interface for decision intelligence.

### Components

1. **Globe Canvas** - Interactive visualization of GCC countries
2. **Signal Feed** - Real-time signal monitoring
3. **Decision Rail** - AI-powered recommendations
4. **Executive Brief** - Quick summary panel
5. **Propagation Panel** - Impact visualization

### Navigation

- Use the settings button to toggle panels
- Click on nodes in the globe to see details
- Signals are color-coded by severity

---

## Signal Types

| Type | Description | Examples |
|------|-------------|----------|
| MACRO | Macroeconomic indicators | Oil prices, GDP, Inflation |
| MARKET | Market data | Stock indices, Volatility |
| INSURANCE | Insurance metrics | Loss ratios, Claims |
| FRAUD | Fraud indicators | Detection scores, Patterns |
| REGULATORY | Compliance data | Policy changes, Scores |

---

## Decision Logic

DEEVO uses a layered decision process:

1. **Signal Ingestion** - Collect and normalize signals
2. **Graph Propagation** - Model causal relationships
3. **Rule Evaluation** - Apply business rules
4. **Simulation** - Run scenarios
5. **Decision Output** - Generate recommendations

### Decision Types

- **APPROVE** - Low risk, proceed with action
- **REVIEW** - Medium risk, requires human review
- **ESCALATE** - High risk, immediate attention needed

---

## API Reference

See the [OpenAPI specification](../contracts/api/) for full API documentation.

### Key Endpoints

- `GET /api/intelligence/run` - Run intelligence pipeline
- `GET /api/signals` - List signals
- `GET /api/graph` - Get graph state
- `GET /api/decisions` - List decisions

---

## Deployment

### Vercel (Recommended)

1. Fork the repository
2. Import to Vercel
3. Set root directory to `frontend`
4. Deploy

### Docker

```bash
docker-compose up -d
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | (empty for mock mode) |

---

## Support

- [GitHub Issues](https://github.com/PyBADR/deevo-cortex/issues)

---

*Built by Bader Alabddan for GCC markets*
