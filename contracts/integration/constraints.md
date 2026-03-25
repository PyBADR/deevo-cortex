# Integration Constraints

## Runtime Requirements

| Constraint | Requirement |
|------------|-------------|
| Execution | Local filesystem only |
| Cloud | NOT required |
| Database | NOT required |
| External APIs | NOT required |
| Network | Localhost only |

## Compatibility Rules

### COWORK File Compatibility

The API must work with these COWORK-created files:

```
core/rules.py         → Must export: evaluate(signals: dict) -> float
core/simulation_engine.py → Must export: simulate(scenario: str, signals: dict) -> dict
core/agents.py        → Must export: analyze(context: dict) -> dict
data/signals.json     → Must match SignalSchema
output/decision.json  → Written by API, matches DecisionSchema
```

### Fallback Behavior

If COWORK files are missing or broken:
- API uses inline fallback functions
- Pipeline continues without failure
- Response includes degraded confidence

### No New Dependencies

The integration layer must NOT introduce:
- ❌ New databases
- ❌ Cloud services
- ❌ Message queues
- ❌ External APIs
- ❌ WebSocket servers
- ❌ Background workers

### Allowed Dependencies

- ✅ FastAPI (already in stack)
- ✅ Pydantic (already in stack)
- ✅ Python stdlib (json, time, uuid, pathlib)
- ✅ Local filesystem read/write

## Execution Constraints

| Aspect | Limit |
|--------|-------|
| Max pipeline time | 5000ms |
| Max signal fields | 20 |
| Max scenario adjustments | 10 |
| Output file size | 100KB |

## Error Handling

| Scenario | Behavior |
|----------|----------|
| COWORK files missing | Use fallback, continue |
| Invalid signals | Return 400 INVALID_SIGNALS |
| Simulation timeout | Return 400 SIMULATION_FAILED |
| Rules exception | Return 400 ENGINE_ERROR |
| Output write fail | Log warning, continue |

## Testing Locally

```bash
# Start API
cd backend
uvicorn app.main:app --reload --port 8000

# Test endpoint
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"signals": {"oil_price": 92, "inflation": 3.1, "claims_rate": 0.4, "fraud_index": 0.15}}'
```
