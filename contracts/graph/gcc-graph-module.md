# GCC Graph Module Specification

## Overview

The GCC Graph Module provides a weighted decision graph for modeling relationships between:
- GCC countries
- Economic sectors
- Insurance lines
- Macro variables
- Risk factors

---

## Module Architecture

```
contracts/graph/
├── node-schema.ts       # Node type definitions
├── edge-schema.ts       # Edge type definitions
├── graph-response.ts    # API response schemas
├── graph-data-flow.md   # Data flow documentation
└── gcc-graph-module.md  # This file

backend/app/
├── api/routes/graph.py  # API routes
└── services/graph_service.py  # Service layer

core/ (COWORK)
├── graph_adapter.py     # Adapter interface
├── graph_engine.py      # Graph logic
└── data/graph.json      # Graph data
```

---

## Node Types

### Country Nodes
```typescript
{
  id: "uae",
  type: "country",
  label: "United Arab Emirates",
  value: 0.85,  // Economic health index
  weight: 0.9,  // Importance in GCC
  metadata: {
    iso_code: "AE",
    region: "gcc"
  }
}
```

**GCC Countries:** UAE, KSA, Kuwait, Qatar, Bahrain, Oman

### Sector Nodes
```typescript
{
  id: "oil_gas",
  type: "sector",
  label: "Oil & Gas",
  value: 0.72,  // Sector performance
  weight: 0.95, // GDP contribution weight
  metadata: {
    sector_code: "B",
    gdp_contribution: 0.35
  }
}
```

**Sectors:** oil_gas, finance, real_estate, tourism, construction, retail

### Insurance Line Nodes
```typescript
{
  id: "motor",
  type: "insurance_line",
  label: "Motor Insurance",
  value: 0.65,  // Line performance
  weight: 0.7,  // Premium volume weight
  metadata: {
    line_code: "MOT",
    loss_ratio: 0.68
  }
}
```

**Lines:** motor, health, property, marine, liability, life

### Macro Variable Nodes
```typescript
{
  id: "oil_price",
  type: "macro_variable",
  label: "Oil Price",
  value: 0.82,  // Normalized value
  weight: 0.9,  // Impact weight
  metadata: {
    unit: "usd_barrel",
    source: "OPEC"
  }
}
```

**Variables:** oil_price, inflation, gdp_growth, unemployment, interest_rate, exchange_rate, credit_growth

---

## Edge Types

| Type | Description | Example |
|------|-------------|--------|
| `causal` | A causes B | oil_price → inflation |
| `correlation` | A correlates with B | gdp ↔ employment |
| `dependency` | A depends on B | insurance → regulation |
| `exposure` | A exposed to B | motor → oil_price |
| `contains` | A contains B | uae → oil_sector |
| `influences` | A influences B | inflation → claims |

---

## GCC Graph Structure

```
                    ┌─────────────┐
                    │  OIL_PRICE  │
                    └──────┬──────┘
                           │ 0.9
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌────────┐   ┌────────┐   ┌────────┐
        │  UAE   │   │  KSA   │   │ KUWAIT │
        └────┬───┘   └────┬───┘   └────┬───┘
             │ 0.8        │ 0.8        │ 0.7
             ▼            ▼            ▼
        ┌────────┐   ┌────────┐   ┌────────┐
        │OIL_GAS │   │FINANCE │   │REAL_EST│
        └────┬───┘   └────┬───┘   └────┬───┘
             │ 0.6        │ 0.7        │ 0.5
             ▼            ▼            ▼
        ┌────────┐   ┌────────┐   ┌────────┐
        │ MOTOR  │   │ HEALTH │   │PROPERTY│
        └────────┘   └────────┘   └────────┘
```

---

## API Endpoints

### GET /api/graph/state

Returns the full graph state.

**Response:**
```json
{
  "graph_id": "gcc-graph-v1",
  "timestamp": "2026-03-25T12:00:00Z",
  "node_count": 25,
  "edge_count": 42,
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "version": "1.0.0",
    "region": "gcc"
  }
}
```

### POST /api/graph/propagate

Runs propagation from a source node.

**Request:**
```json
{
  "source_node": "oil_price",
  "impulse": 0.3,
  "max_depth": 5,
  "decay_factor": 0.8,
  "include_trace": true
}
```

**Response:**
```json
{
  "propagation_id": "prop-20260325-abc123",
  "source_node": "oil_price",
  "impulse": 0.3,
  "affected_nodes": [
    {
      "node_id": "uae",
      "original_value": 0.85,
      "new_value": 0.91,
      "delta": 0.06,
      "depth": 1,
      "path": ["oil_price", "uae"]
    },
    {
      "node_id": "oil_gas",
      "original_value": 0.72,
      "new_value": 0.76,
      "delta": 0.04,
      "depth": 2,
      "path": ["oil_price", "uae", "oil_gas"]
    }
  ],
  "summary": {
    "total_affected": 12,
    "max_depth_reached": 4,
    "total_delta": 0.45,
    "most_affected": {
      "node_id": "uae",
      "delta": 0.06
    }
  }
}
```

### GET /api/graph/health

Checks graph service health.

**Response:**
```json
{
  "status": "ok",
  "ready": true,
  "adapter_available": true,
  "graph_loaded": true,
  "version": "1.0.0"
}
```

---

## COWORK Integration

### Required Adapter Functions

```python
# core/graph_adapter.py

def get_graph_state() -> dict
def propagate(source_node, impulse, max_depth, decay_factor, include_trace) -> dict
def health() -> dict
```

### Data File

```
data/graph.json
```

Contains the full GCC graph definition with nodes and edges.

---

## Propagation Rules

1. **Decay:** Each hop reduces impulse by `decay_factor`
2. **Threshold:** Stop when impulse < 0.01
3. **Max Depth:** Never exceed `max_depth` hops
4. **No Cycles:** Each node visited once per propagation
5. **Weight Application:** `next_impulse = current_impulse * edge_weight * decay_factor`

---

## Use Cases

### 1. Oil Price Shock Analysis
```
POST /api/graph/propagate
{
  "source_node": "oil_price",
  "impulse": -0.3  // 30% drop
}
```

### 2. Inflation Impact
```
POST /api/graph/propagate
{
  "source_node": "inflation",
  "impulse": 0.2  // 20% increase
}
```

### 3. Country-Specific Stress
```
POST /api/graph/propagate
{
  "source_node": "uae",
  "impulse": -0.15  // Economic stress
}
```

---

## Compatibility

| Component | Owner | Status |
|-----------|-------|--------|
| API Routes | VERCEPT | ✅ Built |
| Service Layer | VERCEPT | ✅ Built |
| Type Contracts | VERCEPT | ✅ Built |
| Graph Adapter | COWORK | ⏳ Expected |
| Graph Engine | COWORK | ⏳ Expected |
| Graph Data | COWORK | ⏳ Expected |

---

## Next Steps

1. COWORK builds `core/graph_adapter.py`
2. COWORK builds `core/graph_engine.py`
3. COWORK creates `data/graph.json` with GCC nodes/edges
4. Integration test via `/api/graph/health`
5. End-to-end propagation test
