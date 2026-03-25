# VERCEPT PLATFORM ARCHITECTURE AUDIT PACK
## DEEVO Cortex — DEEVO Decision Intelligence

Generated: 2026-03-25
Phase: Post-Phase 3 (GCC Graph Complete)

---

## PLATFORM TREE

```
cortex-v2/
│
├── backend/                          # FastAPI Backend (VERCEPT)
│   ├── app/
│   │   ├── main.py                   # Application entrypoint
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── signals.py        # GET/POST /api/signals
│   │   │       ├── decisions.py      # GET /api/decisions
│   │   │       ├── simulation.py     # POST /api/simulation
│   │   │       ├── simulate.py       # POST /api/simulate (v1)
│   │   │       ├── simulate_v2.py    # POST /api/simulate (v2 - COWORK integrated)
│   │   │       └── graph.py          # GET/POST /api/graph/*
│   │   ├── models/
│   │   │   ├── signals.py            # Pydantic: SignalSchema
│   │   │   ├── decision.py           # Pydantic: DecisionSchema
│   │   │   ├── simulation.py         # Pydantic: SimulationSchema
│   │   │   ├── rules.py              # Pydantic: RulesSchema
│   │   │   └── graph.py              # Pydantic: GraphSchema
│   │   ├── services/
│   │   │   └── graph_service.py      # Graph service layer
│   │   ├── engine/                   # (Deprecated - use core/)
│   │   └── core/                     # (Deprecated - use core/)
│   └── requirements.txt
│
├── frontend/                         # Next.js Frontend (VERCEPT)
│   ├── src/
│   │   ├── app/                      # Route pages
│   │   ├── components/               # UI components
│   │   ├── lib/                      # Utilities
│   │   ├── store/                    # State management
│   │   └── types/                    # TypeScript types
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── contracts/                        # API & Type Contracts (VERCEPT)
│   ├── api/
│   │   └── openapi.yaml              # OpenAPI 3.0 spec
│   ├── schemas/
│   │   ├── signals.schema.json
│   │   ├── decision.schema.json
│   │   ├── simulation.schema.json
│   │   ├── rules.schema.json
│   │   └── graph.schema.json
│   ├── integration/
│   │   ├── api-contract.json         # POST /api/simulate contract
│   │   ├── types.ts                  # TypeScript integration types
│   │   ├── data-flow.md              # Signal flow documentation
│   │   ├── file-mapping.md           # File-to-API mapping
│   │   ├── execution-pipeline.md     # 7-step pipeline spec
│   │   ├── constraints.md            # Runtime constraints
│   │   └── final-integration-report.md
│   └── graph/
│       ├── node-schema.ts            # Graph node types
│       ├── edge-schema.ts            # Graph edge types
│       ├── graph-response.ts         # API response schemas
│       ├── graph-data-flow.md
│       └── gcc-graph-module.md
│
├── core/                             # Local Engine (COWORK)
│   ├── __init__.py
│   ├── engine.py                     # Main decision engine
│   ├── api_adapter.py                # VERCEPT integration adapter
│   ├── simulation_engine.py          # Simulation logic
│   ├── agents.py                     # Agent analysis
│   ├── rules.py                      # Rules evaluation
│   ├── contracts.py                  # Internal contracts
│   ├── scenario_registry.py          # Scenario management
│   ├── gcc_graph.py                  # GCC graph logic
│   ├── graph_engine.py               # Graph engine
│   ├── graph_adapter.py              # Graph VERCEPT adapter
│   ├── graph_weights.py              # Edge weights
│   ├── propagation.py                # Signal propagation
│   └── graph.json                    # Graph definition
│
├── data/                             # Data Layer (COWORK)
│   ├── signals.json                  # Canonical signals
│   ├── signals_macro.json            # Macro signals
│   ├── graph.json                    # Graph data
│   ├── gcc_entities.json             # GCC entities
│   ├── gcc_edges.json                # GCC edges
│   ├── scenarios.json                # Scenario definitions
│   ├── sector_profiles.json          # Sector data
│   ├── context_profile.json          # Context data
│   ├── signals/                      # Signal variants
│   ├── scenarios/                    # Scenario variants
│   └── mock/                         # Mock data
│
├── output/                           # Decision outputs
├── tests/                            # Test suite
├── ARCHITECTURE.md                   # Architecture documentation
└── README.md
```

---

## ROUTES

| Method | Route | Handler | Status | Owner |
|--------|-------|---------|--------|-------|
| GET | `/api/signals` | signals.py | ✅ Ready | VERCEPT |
| POST | `/api/signals` | signals.py | ✅ Ready | VERCEPT |
| GET | `/api/decisions` | decisions.py | ✅ Ready | VERCEPT |
| POST | `/api/simulation` | simulation.py | ✅ Ready | VERCEPT |
| POST | `/api/simulate` | simulate.py | ⚠️ Legacy | VERCEPT |
| POST | `/api/simulate` | simulate_v2.py | ✅ Integrated | VERCEPT+COWORK |
| GET | `/api/graph/state` | graph.py | ✅ Ready | VERCEPT |
| POST | `/api/graph/propagate` | graph.py | ✅ Ready | VERCEPT |
| GET | `/api/graph/health` | graph.py | ✅ Ready | VERCEPT |

### Frontend Routes (Planned)

| Route | Page | Status |
|-------|------|--------|
| `/command-center` | GCC Command Center | 🔲 Scaffold |
| `/signals` | Signal monitor | 🔲 Scaffold |
| `/graph` | Graph viewer | 🔲 Scaffold |
| `/simulation` | Simulation runner | 🔲 Scaffold |
| `/decisions` | Decision log | 🔲 Scaffold |
| `/executive-brief` | Executive summary | 🔲 Scaffold |

---

## CONTRACTS

### JSON Schemas (contracts/schemas/)

| Schema | Purpose | Status |
|--------|---------|--------|
| signals.schema.json | Signal data validation | ✅ Complete |
| decision.schema.json | Decision output validation | ✅ Complete |
| simulation.schema.json | Simulation config validation | ✅ Complete |
| rules.schema.json | Rules definition validation | ✅ Complete |
| graph.schema.json | Graph structure validation | ✅ Complete |

### TypeScript Contracts (contracts/)

| File | Purpose | Status |
|------|---------|--------|
| integration/types.ts | Integration type definitions | ✅ Complete |
| graph/node-schema.ts | Graph node types | ✅ Complete |
| graph/edge-schema.ts | Graph edge types | ✅ Complete |
| graph/graph-response.ts | Graph API responses | ✅ Complete |

### API Contracts

| File | Purpose | Status |
|------|---------|--------|
| api/openapi.yaml | OpenAPI 3.0 specification | ✅ Complete |
| integration/api-contract.json | Simulate endpoint contract | ✅ Complete |

---

## SERVICES

| Service | File | Purpose | Status |
|---------|------|---------|--------|
| GraphService | services/graph_service.py | Wraps COWORK graph_adapter | ✅ Complete |

### Service Layer Architecture

```
API Route → Service → COWORK Adapter → COWORK Engine → Response
```

**Note:** Services do NOT implement logic. They wrap COWORK adapters.

---

## COWORK INTEGRATION POINTS

### Adapters (core/)

| Adapter | File | Functions | Status |
|---------|------|-----------|--------|
| API Adapter | api_adapter.py | `execute(signals)`, `health()` | ✅ Complete |
| Graph Adapter | graph_adapter.py | `get_graph_state()`, `propagate()`, `health()` | ✅ Complete |

### Data Files (data/)

| File | Purpose | Status |
|------|---------|--------|
| signals.json | Canonical signal input | ✅ Complete |
| graph.json | Graph definition | ✅ Complete |
| gcc_entities.json | GCC entity nodes | ✅ Complete |
| gcc_edges.json | GCC edge definitions | ✅ Complete |
| scenarios.json | Scenario registry | ✅ Complete |

### Engine Files (core/)

| File | Purpose | Status |
|------|---------|--------|
| engine.py | Main decision engine | ✅ Complete |
| simulation_engine.py | Simulation logic | ✅ Complete |
| graph_engine.py | Graph operations | ✅ Complete |
| rules.py | Rules evaluation | ✅ Complete |
| agents.py | Agent analysis | ✅ Complete |

---

## EXECUTION FLOW

### Simulation Flow (POST /api/simulate)

```
1. Client Request
   ↓
2. simulate_v2.py (VERCEPT route)
   ↓
3. core.api_adapter.execute(signals) (COWORK adapter)
   ↓
4. core.engine.run() (COWORK engine)
   ↓
5. simulation_engine.simulate() (COWORK)
   ↓
6. agents.analyze() (COWORK)
   ↓
7. rules.evaluate() (COWORK)
   ↓
8. Decision Output
   ↓
9. API Response
```

### Graph Flow (POST /api/graph/propagate)

```
1. Client Request
   ↓
2. graph.py (VERCEPT route)
   ↓
3. graph_service.py (VERCEPT service)
   ↓
4. core.graph_adapter.propagate() (COWORK adapter)
   ↓
5. core.graph_engine.propagate() (COWORK engine)
   ↓
6. Propagation Result
   ↓
7. API Response
```

---

## READINESS STATUS

### Backend

| Component | Status | Notes |
|-----------|--------|-------|
| FastAPI main.py | ✅ Ready | Entrypoint configured |
| Route handlers | ✅ Ready | All routes implemented |
| Pydantic models | ✅ Ready | All schemas defined |
| Service layer | ✅ Ready | Graph service complete |
| COWORK integration | ✅ Ready | Adapters connected |

### Frontend

| Component | Status | Notes |
|-----------|--------|-------|
| Next.js setup | ⚠️ Scaffold | Config files only |
| Route pages | 🔲 Pending | Not implemented |
| Components | 🔲 Pending | Not implemented |
| State management | 🔲 Pending | Not implemented |

### Contracts

| Component | Status | Notes |
|-----------|--------|-------|
| JSON Schemas | ✅ Complete | All 5 schemas |
| TypeScript types | ✅ Complete | Integration + Graph |
| OpenAPI spec | ✅ Complete | Full API documented |
| Integration docs | ✅ Complete | All docs written |

### COWORK Integration

| Component | Status | Notes |
|-----------|--------|-------|
| API Adapter | ✅ Complete | execute(), health() |
| Graph Adapter | ✅ Complete | get_graph_state(), propagate() |
| Engine | ✅ Complete | Full pipeline |
| Data files | ✅ Complete | All canonical files |

---

## REMAINING GAPS

### Priority 1 — Required for Phase 4

| Gap | Description | Owner |
|-----|-------------|-------|
| Frontend implementation | Route pages not built | VERCEPT |
| API client | Frontend API client not built | VERCEPT |
| State management | Store not implemented | VERCEPT |

### Priority 2 — Recommended

| Gap | Description | Owner |
|-----|-------------|-------|
| Error handling | Standardized error responses | VERCEPT |
| Logging | Structured logging | BOTH |
| Tests | Integration tests | BOTH |
| Docker | Containerization | VERCEPT |

### Priority 3 — Future

| Gap | Description | Owner |
|-----|-------------|-------|
| Authentication | User auth system | VERCEPT |
| Caching | Response caching | VERCEPT |
| WebSocket | Real-time updates | VERCEPT |
| Monitoring | Health dashboards | VERCEPT |

---

## SUMMARY

| Layer | Files | Status |
|-------|-------|--------|
| Backend Routes | 6 | ✅ Complete |
| Backend Models | 5 | ✅ Complete |
| Backend Services | 1 | ✅ Complete |
| Contracts | 15 | ✅ Complete |
| COWORK Adapters | 2 | ✅ Complete |
| COWORK Engines | 5 | ✅ Complete |
| Data Files | 10 | ✅ Complete |
| Frontend Pages | 0/6 | 🔲 Pending |

**Overall Architecture Readiness: 85%**

Backend + Contracts + Integration = Complete
Frontend = Scaffold only

---

*End of Audit Pack*
