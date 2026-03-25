# File-to-API Mapping

## Input Mapping

| Source | Maps To | Usage |
|--------|---------|-------|
| `data/signals.json` | API input fallback | Default signals if none provided |
| Request body `signals` | Primary input | Overrides file data |
| Request body `scenario_override` | Scenario modifier | Adjusts signals for simulation |

## Execution Mapping

| File | Function | API Role |
|------|----------|----------|
| `core/engine.py` | `execute_pipeline()` | Main entry point |
| `core/rules.py` | `evaluate(signals)` | Risk scoring |
| `core/simulation_engine.py` | `simulate(scenario, signals)` | Simulation execution |
| `core/agents.py` | `analyze(context)` | Agent analysis |

## Output Mapping

| API Response Field | Source | Persisted To |
|--------------------|--------|-------------|
| `decision` | Decision engine | `output/decision.json` |
| `confidence` | Simulation result | `output/decision.json` |
| `risk_score` | Rules evaluation | `output/decision.json` |
| `trace` | Pipeline execution | `output/decision.json` |

## File Structure Required by COWORK

```
cortex-v2/
├── data/
│   └── signals.json          # Default signal values
├── core/
│   ├── engine.py             # Pipeline orchestrator
│   ├── rules.py              # evaluate(signals) → float
│   ├── simulation_engine.py  # simulate(scenario, signals) → result
│   └── agents.py             # analyze(context) → insights
└── output/
    └── decision.json         # Persisted decision output
```

## Function Signatures (Contract)

```python
# core/engine.py
def execute_pipeline(signals: dict, scenario_override: dict = None) -> dict:
    """Main entry. Returns DecisionSchema-compatible dict."""

# core/rules.py  
def evaluate(signals: dict) -> float:
    """Returns risk score 0.0 - 1.0"""

# core/simulation_engine.py
def simulate(scenario: str, signals: dict) -> dict:
    """Returns simulation result with risk distribution."""

# core/agents.py
def analyze(context: dict) -> dict:
    """Returns agent analysis insights."""
```
