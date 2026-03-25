# Data Flow Definition

## Execution Flow

```
Frontend → API → Simulation Engine → Decision → Response
```

## Step-by-Step Flow

### 1. Frontend Sends Request
```
POST /api/simulate
Body: { signals, scenario_override? }
```

### 2. API Receives & Validates
```
Validate SignalSchema
Validate ScenarioOverride (if present)
Reject if invalid → 400 Error
```

### 3. Load Signals
```
Source: Request body OR data/signals.json fallback
Output: Normalized signal object
```

### 4. Detect Scenario
```
Input: signals + scenario_override
Logic: Match signal patterns to known scenarios
Output: scenario_name (e.g., "oil_shock", "baseline")
```

### 5. Run Simulation
```
Input: signals + scenario
Engine: core/simulation_engine.py
Output: SimulationResult (risk distribution)
```

### 6. Run Agent Analysis
```
Input: simulation result + signals
Engine: core/agents.py
Output: Agent insights (optional enrichment)
```

### 7. Compute Risk Score
```
Input: simulation result + agent analysis
Engine: core/rules.py → evaluate()
Output: risk_score (0.0 - 1.0)
```

### 8. Produce Decision
```
Input: risk_score
Logic:
  - risk > 0.6 → ESCALATE
  - risk > 0.3 → REVIEW  
  - risk ≤ 0.3 → APPROVE
Output: decision + confidence
```

### 9. Return Response
```
Output: DecisionSchema with full trace
Write: output/decision.json (for audit)
```

## Signal Movement

```
┌─────────────┐
│  Frontend   │
│  (signals)  │
└──────┬──────┘
       │ POST /api/simulate
       ▼
┌─────────────┐
│    API      │
│  (validate) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Scenario   │
│  Detector   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Simulation  │
│   Engine    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Agents    │
│  (analyze)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Rules     │
│ (evaluate)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Decision   │
│   Engine    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Response   │
│ + Audit Log │
└─────────────┘
```
