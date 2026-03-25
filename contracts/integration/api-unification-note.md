# API Unification Note
## Phase 3.6: Unified Intelligence Endpoint

Date: 2026-03-25
Status: COMPLETE

---

## CANONICAL ROUTE

```
POST /api/intelligence/run
```

This is the **PRIMARY** endpoint for all intelligence operations in DEEVO Cortex.

### Request

```json
{
  "signals": {                    // Optional - uses canonical file if omitted
    "oil_price": 95,
    "inflation": 3.5,
    "claims_rate": 0.45,
    "fraud_index": 0.7
  },
  "context": {                    // Optional
    "country": "UAE",
    "sector": "energy",
    "lob": "property"
  }
}
```

### Response

```json
{
  "simulation_result": {
    "scenario": "fraud_surge",
    "risk_score": 0.72,
    "confidence": 0.85,
    "factors": {...}
  },
  "decision_trace": {
    "rules_triggered": [...],
    "risk_contributions": {...},
    "agent_observations": [...]
  },
  "decision": "ESCALATE",
  "graph_state": {
    "nodes": [...],
    "edges": [...],
    "active_nodes": 10
  },
  "propagation_trace": {
    "source_node": "oil_price",
    "nodes_affected": 8,
    "edges_traversed": 25,
    "propagation_path": [...]
  },
  "confidence": 0.85,
  "risk_score": 0.72,
  "scenario": "fraud_surge"
}
```

### Health Check

```
GET /api/intelligence/health
```

---

## LEGACY ROUTES

| Route | Status | Notes |
|-------|--------|-------|
| `POST /api/simulate` | LEGACY | Missing graph_state, propagation_trace |
| `POST /api/v1/simulation/run` | LEGACY | Original simulation endpoint |

## SPECIALIZED ROUTES

| Route | Status | Use Case |
|-------|--------|----------|
| `GET /api/graph/state` | ACTIVE | Graph state only |
| `POST /api/graph/propagate` | ACTIVE | Propagation only |
| `GET/POST /api/v1/signals` | ACTIVE | Signal CRUD |
| `GET /api/v1/decisions` | ACTIVE | Decision history |

---

## MIGRATION PATH

### From `POST /api/simulate`

**Before:**
```javascript
const response = await fetch('/api/simulate', {
  method: 'POST',
  body: JSON.stringify({ signals: {...} })
});
const { simulation_result, decision_trace, decision } = await response.json();
```

**After:**
```javascript
const response = await fetch('/api/intelligence/run', {
  method: 'POST',
  body: JSON.stringify({ signals: {...} })
});
const { 
  simulation_result, 
  decision_trace, 
  decision,
  graph_state,        // NEW
  propagation_trace   // NEW
} = await response.json();
```

### Backward Compatibility

- All existing response keys are preserved
- `simulation_result`, `decision_trace`, `decision` remain unchanged
- New keys (`graph_state`, `propagation_trace`) are additions
- Convenience fields (`confidence`, `risk_score`, `scenario`) are derived from `simulation_result`

---

## EXECUTION FLOW

```
Client Request
    ↓
POST /api/intelligence/run (VERCEPT route)
    ↓
core.unified_engine.run() (COWORK engine)
    ↓
├── Signal loading/normalization
├── Scenario detection
├── GCC graph propagation
├── Simulation execution
├── Agent analysis
├── Rules evaluation
└── Decision generation
    ↓
Unified Response (5 keys)
    ↓
Client
```

---

## COWORK INTEGRATION

### Entrypoint

```python
from unified_engine import run, health

# Execute full pipeline
result = run(signals=optional_dict)

# Health check
status = health()
```

### Output Keys

| Key | Type | Source |
|-----|------|--------|
| `simulation_result` | dict | simulation_engine |
| `decision_trace` | dict | rules + agents |
| `decision` | str | decision logic |
| `graph_state` | dict | graph_engine |
| `propagation_trace` | dict | propagation |

---

## FILES CREATED/MODIFIED

### Created
- `backend/app/api/routes/intelligence.py` - Unified route handler
- `contracts/integration/api-unification-note.md` - This document

### Modified
- `backend/app/main.py` - Added intelligence router

---

## SUMMARY

| Aspect | Value |
|--------|-------|
| Canonical Endpoint | `POST /api/intelligence/run` |
| Response Keys | 5 (+ 3 convenience) |
| COWORK Entrypoint | `unified_engine.run()` |
| Backward Compatible | Yes |
| Legacy Routes | Preserved |

**Phase 3.6 API Unification: COMPLETE**
