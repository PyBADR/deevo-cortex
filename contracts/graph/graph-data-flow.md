# GCC Graph Data Flow

## Overview

This document defines how data flows through the GCC decision graph system.

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│           API LAYER (VERCEPT)           │
│  backend/app/api/routes/graph.py       │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         SERVICE LAYER (VERCEPT)         │
│  backend/app/services/graph_service.py │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         ADAPTER LAYER (COWORK)          │
│  core/graph_adapter.py                  │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          ENGINE LAYER (COWORK)          │
│  core/graph_engine.py                   │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           DATA LAYER (COWORK)           │
│  data/graph.json                        │
└─────────────────────────────────────────┘
```

---

## GET /api/graph/state Flow

```
1. Client Request
   GET /api/graph/state
       │
       ▼
2. API Route (graph.py)
   get_graph_state()
       │
       ▼
3. Service Layer (graph_service.py)
   GraphService.get_state()
       │
       ▼
4. COWORK Adapter (graph_adapter.py)
   get_graph_state()
       │
       ▼
5. COWORK Engine (graph_engine.py)
   load and return graph data
       │
       ▼
6. Response
   GraphStateResponse {
     graph_id, timestamp,
     nodes[], edges[],
     metadata
   }
```

---

## POST /api/graph/propagate Flow

```
1. Client Request
   POST /api/graph/propagate
   {
     source_node: "oil_price",
     impulse: 0.3,
     max_depth: 5
   }
       │
       ▼
2. API Route (graph.py)
   propagate(request)
   - Validate impulse range
       │
       ▼
3. Service Layer (graph_service.py)
   GraphService.propagate(
     source_node, impulse,
     max_depth, decay_factor
   )
       │
       ▼
4. COWORK Adapter (graph_adapter.py)
   propagate(
     source_node, impulse,
     max_depth, decay_factor,
     include_trace
   )
       │
       ▼
5. COWORK Engine (graph_engine.py)
   - Find source node
   - Traverse edges by weight
   - Apply decay at each hop
   - Collect affected nodes
   - Build trace if requested
       │
       ▼
6. Response
   PropagateResponse {
     propagation_id,
     affected_nodes[],
     propagation_trace[],
     summary
   }
```

---

## Propagation Algorithm

```
function propagate(source, impulse, max_depth, decay):
    queue = [(source, impulse, 0)]  # (node, current_impulse, depth)
    visited = {}
    affected = []
    
    while queue not empty:
        node, imp, depth = queue.pop()
        
        if depth > max_depth:
            continue
        if node in visited:
            continue
        
        visited[node] = true
        
        # Record effect
        delta = imp * node.weight
        affected.append({
            node_id: node.id,
            delta: delta,
            depth: depth
        })
        
        # Propagate to neighbors
        for edge in node.outgoing_edges:
            next_impulse = imp * edge.weight * decay
            if abs(next_impulse) > threshold:
                queue.append((edge.target, next_impulse, depth + 1))
    
    return affected
```

---

## Data Contracts

### COWORK → VERCEPT

| COWORK Output | VERCEPT Schema |
|---------------|----------------|
| `graph_adapter.get_graph_state()` | `GraphStateResponse` |
| `graph_adapter.propagate()` | `PropagateResponse` |
| `graph_adapter.health()` | `GraphHealthResponse` |

### Expected COWORK Adapter Interface

```python
# core/graph_adapter.py

def get_graph_state() -> dict:
    """
    Returns:
        {
            'graph_id': str,
            'timestamp': str,
            'node_count': int,
            'edge_count': int,
            'nodes': [...],
            'edges': [...],
            'metadata': {...}
        }
    """

def propagate(
    source_node: str,
    impulse: float,
    max_depth: int = 5,
    decay_factor: float = 0.8,
    include_trace: bool = True
) -> dict:
    """
    Returns:
        {
            'propagation_id': str,
            'affected_nodes': [...],
            'propagation_trace': [...],
            'summary': {...}
        }
    """

def health() -> dict:
    """
    Returns:
        {
            'ready': bool,
            'graph_loaded': bool,
            'version': str
        }
    """
```

---

## Error Handling

| Error | HTTP Code | Error Code |
|-------|-----------|------------|
| Adapter not loaded | 503 | `ADAPTER_UNAVAILABLE` |
| Graph not loaded | 500 | `GRAPH_NOT_LOADED` |
| Node not found | 404 | `NODE_NOT_FOUND` |
| Invalid impulse | 400 | `INVALID_IMPULSE` |
| Propagation failed | 500 | `PROPAGATION_FAILED` |
