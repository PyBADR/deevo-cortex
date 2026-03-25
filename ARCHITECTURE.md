# DEEVO Cortex — Architecture Documentation

## System Overview

**DEEVO Cortex** is a DEEVO Decision Intelligence platform designed for GCC + Insurance + Economic Risk analysis. It transforms raw signals into actionable decisions through a layered processing pipeline.

## Core Pipeline

```
Signals → Graph → Rules → Simulation → Decisions → Output
```

---

## Architecture Layers

### Layer 1: Signals
**Purpose:** Ingest, normalize, and classify incoming data signals.

| Component | Location | Description |
|-----------|----------|-------------|
| Signal Processor | `backend/app/engine/signals/processor.py` | Core signal processing logic |
| Signal Models | `backend/app/models/signals.py` | Pydantic data models |
| Signal Types | `frontend/src/types/signals.ts` | TypeScript type definitions |
| Signal Schema | `contracts/schemas/signals.schema.json` | JSON Schema validation |

**Signal Sources:**
- MACRO (Oil, Inflation, GDP)
- MARKET (Volatility, Indices)
- INSURANCE (Loss Ratio, Premiums)
- FRAUD (Detection Indices)
- CLAIMS (Rates, Patterns)
- REGULATORY (Compliance Scores)
- GEOPOLITICAL (Risk Factors)

---

### Layer 2: Graph
**Purpose:** Model causal relationships between signals, factors, and outcomes.

| Component | Location | Description |
|-----------|----------|-------------|
| Graph Propagator | `backend/app/engine/graph/propagator.py` | Causal graph traversal |
| Graph Models | `backend/app/models/graph.py` | Node and edge models |
| Graph Types | `frontend/src/types/graph.ts` | TypeScript definitions |
| Graph Schema | `contracts/schemas/graph.schema.json` | JSON Schema |

**Node Types:**
- SIGNAL - Input data points
- FACTOR - Intermediate variables
- RISK - Risk indicators
- OUTCOME - Business outcomes
- DECISION - Decision points
- CONSTRAINT - Limiting factors

**Edge Types:**
- CAUSES - Direct causation
- CORRELATES - Statistical correlation
- AMPLIFIES - Positive feedback
- MITIGATES - Negative feedback
- TRIGGERS - Threshold activation
- BLOCKS - Prevention

---

### Layer 3: Rules
**Purpose:** Evaluate business rules and risk thresholds.

| Component | Location | Description |
|-----------|----------|-------------|
| Rules Evaluator | `backend/app/engine/rules/evaluator.py` | Rule evaluation engine |
| Rules Models | `backend/app/models/rules.py` | Rule data models |
| Rules Types | `frontend/src/types/rules.ts` | TypeScript definitions |
| Rules Schema | `contracts/schemas/rules.schema.json` | JSON Schema |

**Rule Categories:**
- RISK_THRESHOLD - Value-based triggers
- FRAUD_DETECTION - Fraud pattern rules
- CLAIMS_TRIGGER - Claims monitoring
- UNDERWRITING - Policy rules
- COMPLIANCE - Regulatory rules
- ESCALATION - Escalation criteria

---

### Layer 4: Simulation
**Purpose:** Run scenario simulations and stress tests.

| Component | Location | Description |
|-----------|----------|-------------|
| Simulation Engine | `backend/app/engine/simulation/simulator.py` | Scenario execution |
| Simulation Models | `backend/app/models/simulation.py` | Scenario models |
| Simulation Types | `frontend/src/types/simulation.ts` | TypeScript definitions |
| Simulation Schema | `contracts/schemas/simulation.schema.json` | JSON Schema |

**Simulation Types:**
- STRESS_TEST - Extreme scenario testing
- WHAT_IF - Hypothetical analysis
- MONTE_CARLO - Probabilistic simulation
- SENSITIVITY - Variable sensitivity
- HISTORICAL_REPLAY - Past event replay

---

### Layer 5: Decision Engine
**Purpose:** Generate final decisions with evidence and recommendations.

| Component | Location | Description |
|-----------|----------|-------------|
| Decision Engine | `backend/app/engine/decision/engine.py` | Core decision logic |
| Decision Models | `backend/app/models/decision.py` | Decision models |
| Decision Types | `frontend/src/types/decision.ts` | TypeScript definitions |
| Decision Schema | `contracts/schemas/decision.schema.json` | JSON Schema |

**Decision Types:**
- APPROVE - Accept with no conditions
- REJECT - Decline
- REVIEW - Requires human review
- ESCALATE - Escalate to senior authority
- DEFER - Postpone decision
- CONDITIONAL_APPROVE - Accept with conditions

---

### Layer 6: Output
**Purpose:** Present decisions to users through various surfaces.

| Surface | Route | Description |
|---------|-------|-------------|
| GCC Command Center | `/command-center` | Real-time overview |
| Signals | `/signals` | Signal monitoring |
| Graph | `/graph` | Causal graph visualization |
| Simulation | `/simulation` | Scenario management |
| Decisions | `/decisions` | Decision history |
| Executive Brief | `/executive-brief` | Executive summary |

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Data Fetching:** TanStack Query
- **Visualization:** D3.js, Recharts

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Validation:** Pydantic v2
- **Graph Processing:** NetworkX
- **Data Processing:** NumPy, Pandas

### Data Contracts
- **Schema Format:** JSON Schema (Draft-07)
- **API Spec:** OpenAPI 3.0
- **Type Generation:** Automated from schemas

---

## Folder Structure

```
cortex-v2/
├── frontend/                    # Next.js frontend
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── command-center/
│   │   │   ├── signals/
│   │   │   ├── graph/
│   │   │   ├── simulation/
│   │   │   ├── decisions/
│   │   │   └── executive-brief/
│   │   ├── components/         # Reusable components
│   │   │   ├── core/
│   │   │   ├── signals/
│   │   │   ├── graph/
│   │   │   ├── simulation/
│   │   │   └── decisions/
│   │   ├── lib/                # Utilities
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── types/              # TypeScript types
│   │   └── store/              # State management
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/         # API endpoints
│   │   ├── core/               # Core config
│   │   ├── models/             # Pydantic models
│   │   ├── services/           # Business logic
│   │   └── engine/             # Decision engine
│   │       ├── signals/
│   │       ├── graph/
│   │       ├── rules/
│   │       ├── simulation/
│   │       └── decision/
│   ├── main.py
│   └── requirements.txt
│
├── contracts/                   # Data contracts
│   ├── schemas/                # JSON Schemas
│   └── api/                    # OpenAPI spec
│
├── data/                        # Data files
│   ├── signals/
│   ├── scenarios/
│   └── mock/                   # Mock data
│
├── core/                        # Legacy core files
├── output/                      # Output files
└── ARCHITECTURE.md              # This file
```

---

## API Endpoints

### Signals API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/signals/ingest` | Ingest signal batch |
| GET | `/api/v1/signals/snapshot` | Get current snapshot |
| POST | `/api/v1/signals/filter` | Filter signals |
| GET | `/api/v1/signals/critical` | Get critical signals |
| GET | `/api/v1/signals/aggregate` | Get aggregations |

### Decisions API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/decisions/evaluate` | Evaluate decision |
| GET | `/api/v1/decisions/{id}` | Get decision by ID |
| GET | `/api/v1/decisions` | List decisions |
| GET | `/api/v1/decisions/stats` | Get statistics |
| POST | `/api/v1/decisions/configure/graph` | Configure graph |
| POST | `/api/v1/decisions/configure/rules` | Configure rules |

### Simulation API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/simulation/scenarios` | Create scenario |
| GET | `/api/v1/simulation/scenarios` | List scenarios |
| POST | `/api/v1/simulation/run/{id}` | Run scenario |
| POST | `/api/v1/simulation/monte-carlo/{id}` | Run Monte Carlo |
| POST | `/api/v1/simulation/stress-test` | Run stress test |
| POST | `/api/v1/simulation/sensitivity` | Run sensitivity |

---

## Running the System

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Design Principles

1. **Decision-First Architecture** - Every component exists to support decision-making
2. **Layered Processing** - Clear separation between signal, graph, rules, and decision layers
3. **Type Safety** - Strong typing across frontend and backend
4. **Contract-Driven** - JSON Schema and OpenAPI contracts define interfaces
5. **Audit Trail** - Every decision includes full audit trail
6. **Simulation-Ready** - Built-in support for scenario analysis
7. **Enterprise-Grade** - Production-ready patterns and practices

---

## Business Domains

- **GCC Macro Intelligence** - Oil, inflation, GDP, regional economics
- **Insurance Risk** - Underwriting, claims, loss ratios
- **Fraud Detection** - Pattern recognition, anomaly detection
- **Regulatory Compliance** - Compliance scoring, regulatory monitoring
- **Executive Intelligence** - High-level briefings and recommendations

---

*DEEVO Cortex — DEEVO Decision Intelligence*
*Version 2.0.0*
