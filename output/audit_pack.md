# DEEVO Cortex — PROJECT AUDIT PACK
**Generated:** 2026-03-25
**Role:** COWORK (Local System Builder)
**Test status:** 72/72 PASS
**Total lines (core + tests):** 2,235
**Total lines (data):** 547
**Total lines (output):** 481

---

## PROJECT TREE

```
cortex-v2/
├── core/                          # LOCAL DECISION ENGINE (COWORK)
│   ├── __init__.py                #   1 loc
│   ├── rules.py                   #  91 loc — signal evaluation + decision logic
│   ├── scenario_registry.py       #  63 loc — scenario detection + selection
│   ├── simulation_engine.py       # 149 loc — BFS propagation + simulation
│   ├── agents.py                  # 116 loc — 3 analyst agents
│   ├── engine.py                  # 221 loc — main orchestrator
│   ├── contracts.py               # 135 loc — schema validators
│   ├── api_adapter.py             # 110 loc — decision engine adapter (VERCEPT)
│   ├── gcc_graph.py               # 122 loc — GCC weighted graph loader
│   ├── graph_weights.py           # 108 loc — dynamic edge weight computation
│   ├── propagation.py             # 284 loc — weighted BFS propagation engine
│   ├── graph_engine.py            # 128 loc — graph engine wrapper (VERCEPT)
│   ├── graph_adapter.py           #  53 loc — graph adapter (VERCEPT)
│   └── graph.json                 #  22 loc — legacy flat graph (Phase 2)
│
├── data/                          # INPUT DATA
│   ├── signals.json               #  10 loc — CANONICAL runtime input
│   ├── signals_macro.json         #  10 loc — reference/original signals
│   ├── scenarios.json             #  44 loc — 3 scenario definitions
│   ├── context_profile.json       #  12 loc — GCC context + thresholds
│   ├── gcc_entities.json          #  42 loc — 6 countries, 6 sectors, 4 LoB, 6 macro, 8 derived
│   ├── gcc_edges.json             #  38 loc — 25 weighted causal edges
│   ├── sector_profiles.json       #  74 loc — 4 LoB sensitivity profiles
│   ├── graph.json                 # 295 loc — CANONICAL unified graph (derived)
│   └── mock/                      #           mock data (VERCEPT-created)
│       ├── graph.json
│       ├── rules.json
│       └── signals.json
│
├── output/                        # GENERATED OUTPUTS
│   ├── decision.json              #   decision: APPROVE | REVIEW | ESCALATE
│   ├── decision_trace.json        #   full audit trail with SHA-256 hash
│   ├── simulation_result.json     #   scenario + impacted domains + severity
│   ├── graph_state.json           #   active nodes + countries + sectors + lines
│   ├── propagation_trace.json     #   25-step weighted traversal trace
│   ├── integration_ready.json     #   decision engine integration manifest
│   ├── vercept_compatibility.json #   decision engine contract report
│   ├── vercept_graph_compatibility.json  # graph contract report
│   └── example_output.json        #   Phase 1 legacy example
│
├── tests/                         # VERIFICATION
│   ├── __init__.py
│   ├── test_contracts.py          # 15 tests — schema validation
│   ├── test_engine.py             # 32 tests — decision engine + VERCEPT signatures
│   └── test_graph.py              # 25 tests — graph engine + adapter + canonical file
│
├── backend/                       # PLATFORM LAYER (VERCEPT-OWNED)
│   ├── app/main.py
│   ├── app/api/routes/            #   decisions, graph, signals, simulate, simulate_v2, simulation
│   ├── app/engine/                #   decision, graph, rules, signals, simulation engines
│   ├── app/models/                #   Pydantic models
│   ├── app/services/              #   graph_service
│   └── requirements.txt
│
├── contracts/                     # SHARED CONTRACTS (VERCEPT-OWNED)
│   ├── api/openapi.yaml
│   ├── schemas/                   #   JSON schemas for decision, graph, rules, signals, simulation
│   ├── graph/                     #   graph node/edge schemas, data flow, module spec
│   └── integration/               #   api-contract, types, data-flow, execution-pipeline
│
├── frontend/                      # UI LAYER (VERCEPT-OWNED)
│   ├── src/app/                   #   command-center, executive-brief, signals pages
│   ├── src/components/            #   AlertBanner, RiskGauge, DecisionCard, SignalFeed
│   └── src/types/                 #   TypeScript type definitions
│
├── ARCHITECTURE.md
└── README.md
```

---

## CORE FILES (COWORK-OWNED)

| File | Lines | Purpose | Key Functions |
|------|-------|---------|---------------|
| `core/rules.py` | 91 | Signal risk scoring + decision thresholds | `evaluate(signals) → float`, `decide(risk, context) → (str, float)`, `compute_scenario_severity(scenario, signals) → float` |
| `core/scenario_registry.py` | 63 | Scenario detection from signals | `load_scenarios(path)`, `detect_scenarios(signals, scenarios)`, `select_primary_scenario(triggered, signals)` |
| `core/simulation_engine.py` | 149 | BFS propagation + impact simulation | `simulate(scenario: str\|dict, signals) → dict`, `propagate(graph, entry_nodes)`, `load_graph(path)` |
| `core/agents.py` | 116 | 3 analyst roles with weighted observations | `analyze(context) → dict`, `observe(sim_result) → list`, `weighted_risk(observations) → float` |
| `core/engine.py` | 221 | Main orchestrator — full pipeline | `run(signals?, input_path?, write_outputs?) → dict` |
| `core/gcc_graph.py` | 122 | GCC weighted graph class | `GCCGraph`, `load_gcc_graph()`, `.to_legacy_graph()` |
| `core/graph_weights.py` | 108 | Dynamic weight computation | `compute_dynamic_weight(...)`, `compute_all_weights(...)`, `signal_deviation(value, baseline)` |
| `core/propagation.py` | 284 | Weighted BFS propagation | `run_propagation(signals, country?, lob?)`, `propagate_weighted(entry, graph, signals)`, `PropagationResult` |

---

## API / ADAPTER FILES (COWORK integration surface for VERCEPT)

| File | Lines | Purpose | Key Functions |
|------|-------|---------|---------------|
| `core/api_adapter.py` | 110 | Decision engine adapter | `execute(signals?) → dict`, `health()`, `read_canonical_signals()`, `supported_scenarios()` |
| `core/graph_engine.py` | 128 | Graph engine wrapper | `get_graph_state(signals?, country?, lob?) → dict`, `propagate(source, value?, signals?) → dict` |
| `core/graph_adapter.py` | 53 | Graph adapter (pass-through) | `get_graph_state(...)`, `propagate(...)` |
| `core/contracts.py` | 135 | Schema validators | `validate_signals()`, `validate_simulation_result()`, `validate_decision_trace()`, `validate_decision()`, `validate_engine_output()` |

---

## DATA FILES

| File | Role | Status |
|------|------|--------|
| `data/signals.json` | **CANONICAL** runtime input | Active — engine reads this by default |
| `data/signals_macro.json` | Original reference signals | Reference only |
| `data/scenarios.json` | 3 scenarios: oil_spike, fraud_surge, repair_cost_inflation | Active |
| `data/context_profile.json` | GCC context, thresholds, PDPL/IFRS 17 tags | Active |
| `data/gcc_entities.json` | 6 countries, 6 sectors, 4 LoB, 14 graph nodes | Active |
| `data/gcc_edges.json` | 25 weighted causal edges with relation types | Active |
| `data/sector_profiles.json` | 4 LoB sensitivity profiles (motor/medical/property/marine) | Active |
| `data/graph.json` | **CANONICAL** unified graph (14 nodes, 25 edges) | Derived from gcc_entities + gcc_edges |

---

## OUTPUT FILES

| File | Content | Updated By |
|------|---------|------------|
| `output/decision.json` | `{decision, confidence, summary}` | `core.engine.run()` |
| `output/decision_trace.json` | Full audit trail + SHA-256 hash | `core.engine.run()` |
| `output/simulation_result.json` | Active scenario + impacted domains + severity | `core.engine.run()` |
| `output/graph_state.json` | Active nodes + affected dimensions + weighted impacts | `core.propagation.run_propagation()` |
| `output/propagation_trace.json` | 25-step traversal with weights + pressures | `core.propagation.run_propagation()` |
| `output/integration_ready.json` | Decision engine integration manifest | Static |
| `output/vercept_compatibility.json` | Decision engine contract report | Static |
| `output/vercept_graph_compatibility.json` | Graph contract report | Static |

---

## ENTRYPOINTS

### Decision Engine
```
core.engine.run(signals?, input_path?) → {simulation_result, decision_trace, decision}
core.api_adapter.execute(signals?) → {simulation_result, decision_trace, decision}  [validated]
```

### Graph Engine
```
core.graph_engine.get_graph_state(signals?, country_id?, lob?) → dict
core.graph_engine.propagate(source, value?, signals?, country_id?, lob?) → {graph_state, propagation_trace}
core.graph_adapter.get_graph_state(...)  [pass-through]
core.graph_adapter.propagate(...)        [pass-through]
```

### Individual Module Calls (VERCEPT contract)
```
core.rules.evaluate(signals: dict) → float
core.simulation_engine.simulate(scenario: str, signals: dict) → dict
core.agents.analyze(context: dict) → dict
```

---

## CURRENT EXECUTION FLOW

### Decision Pipeline
```
data/signals.json
    → core.engine.run()
        → scenario_registry.detect_scenarios()     # which scenario is active?
        → scenario_registry.select_primary_scenario()
        → simulation_engine.simulate()              # BFS propagation + impact
        → agents.observe()                          # 3 analyst assessments
        → agents.weighted_risk()                    # blended risk score
        → rules.evaluate() + rules.decide()         # APPROVE | REVIEW | ESCALATE
    → output/decision.json
    → output/decision_trace.json
    → output/simulation_result.json
```

### Graph Pipeline
```
data/signals.json + data/gcc_entities.json + data/gcc_edges.json + data/sector_profiles.json
    → core.propagation.run_propagation()
        → gcc_graph.load_gcc_graph()                # build weighted graph
        → graph_weights.compute_dynamic_weight()     # signal × country × LoB
        → propagation.propagate_weighted()           # weighted BFS
    → output/graph_state.json
    → output/propagation_trace.json
```

### How VERCEPT Calls COWORK
```
# Decision
from core.api_adapter import execute
result = execute(signals_dict)          # returns validated {simulation_result, decision_trace, decision}

# Graph
from core.graph_adapter import get_graph_state, propagate
state = get_graph_state(signals_dict, country_id="SA", lob="motor")
trace = propagate("oil_price", value=1.5, signals=signals_dict)
```

---

## REMAINING GAPS

| # | Gap | Scope | Severity |
|---|-----|-------|----------|
| 1 | **Two separate graphs** — `core/graph.json` (legacy Phase 2, 9 nodes) and `data/graph.json` (canonical Phase 3, 14 nodes). `engine.py` still reads the legacy `core/graph.json` for simulation. Graph unification incomplete. | COWORK | Medium |
| 2 | **Decision engine does not use GCC weighted propagation** — `engine.run()` calls `simulation_engine.simulate()` which uses flat BFS from `core/graph.json`. The weighted `propagation.py` runs independently. No wiring between the two pipelines. | COWORK | Medium |
| 3 | **No unified orchestrator** — Decision pipeline and graph pipeline are separate execution paths. No single `run()` that produces both decision outputs AND graph outputs in one call. | COWORK | Low-Medium |
| 4 | **Signal schema mismatch** — `signals.json` has 8 fields (oil_price, inflation, claims_rate, fraud_index, repair_cost_index, currency_volatility, region, timestamp). Graph propagation expects additional fields (interest_rate, supply_chain_stress). Contract validator only requires 5 numeric keys. | COWORK | Low |
| 5 | **Output files stale** — `decision.json` and `decision_trace.json` currently reflect low-signal APPROVE (from adapter test earlier). Not regenerated with canonical high signals. | COWORK | Cosmetic |
| 6 | **No tests for backend/** — VERCEPT's `backend/app/` routes and services have no test coverage from COWORK side. Expected to be VERCEPT responsibility. | VERCEPT | N/A |
| 7 | **No `__main__.py`** — No single CLI entry point for the project. Must use `python -m core.engine` or import directly. | COWORK | Low |
| 8 | **`data/mock/` directory** — Contains VERCEPT-created mock files that are not used by COWORK logic. May cause confusion. | VERCEPT | Cosmetic |
