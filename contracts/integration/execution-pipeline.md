# Execution Pipeline

## 7-Step Pipeline

### Step 1: Load Signals
```
Input:  Request body OR data/signals.json
Action: Parse and validate signal values
Output: Normalized SignalSchema object
Fail:   INVALID_SIGNALS error
```

### Step 2: Detect Scenario
```
Input:  Signals + scenario_override
Action: Pattern match against known scenarios
Logic:
  - If scenario_override provided → use it
  - Else if oil_price > 100 → "oil_shock"
  - Else if inflation > 5 → "inflation_spike"
  - Else if claims_rate > 0.6 → "claims_stress"
  - Else → "baseline"
Output: scenario_name string
```

### Step 3: Run Simulation
```
Input:  scenario_name + signals
Action: Execute simulation_engine.simulate()
Output: SimulationResult {
  scenario_detected: string,
  risk_distribution: { min, max, mean, p95 }
}
Fail:   SIMULATION_FAILED error
```

### Step 4: Run Agent Analysis
```
Input:  SimulationResult + signals
Action: Execute agents.analyze()
Output: AgentInsights {
  risk_factors: string[],
  recommendations: string[]
}
Note:   Optional step, pipeline continues if skipped
```

### Step 5: Compute Risk Score
```
Input:  Signals (possibly adjusted by simulation)
Action: Execute rules.evaluate()
Logic:  Apply rule conditions, sum weighted risks
Output: risk_score (float 0.0 - 1.0)
```

### Step 6: Produce Decision
```
Input:  risk_score
Action: Apply decision thresholds
Logic:
  if risk_score > 0.6:
    decision = "ESCALATE"
    confidence = 0.9 - (risk_score - 0.6)
  elif risk_score > 0.3:
    decision = "REVIEW"
    confidence = 0.7
  else:
    decision = "APPROVE"
    confidence = 0.95 - risk_score
Output: decision + confidence
```

### Step 7: Return Output
```
Input:  All pipeline results
Action: 
  1. Assemble DecisionSchema response
  2. Write to output/decision.json
  3. Return HTTP response
Output: Full DecisionSchema with trace
```

## Pipeline Trace Format

```json
{
  "pipeline_id": "exec-{timestamp}-{random}",
  "steps": [
    {"step": "load_signals", "status": "ok", "ms": 2},
    {"step": "detect_scenario", "status": "ok", "result": "oil_shock", "ms": 5},
    {"step": "run_simulation", "status": "ok", "ms": 45},
    {"step": "agent_analysis", "status": "ok", "ms": 12},
    {"step": "compute_risk", "status": "ok", "result": 0.65, "ms": 3},
    {"step": "produce_decision", "status": "ok", "result": "ESCALATE", "ms": 1}
  ],
  "total_ms": 68
}
```

## Error Handling

| Step | Error Code | Condition |
|------|------------|----------|
| 1 | INVALID_SIGNALS | Missing required fields, invalid types |
| 3 | SIMULATION_FAILED | Engine exception, timeout |
| 5-6 | ENGINE_ERROR | Rules/decision logic failure |
