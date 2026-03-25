# Cortex-v2 - Decision Intelligence System

## Overview

Cortex-v2 is a decision intelligence system that processes signals, evaluates risk through graph relationships, and produces actionable decisions.

## Architecture

```
cortex-v2/
├── core/
│   ├── graph.json      # Signal relationships
│   └── rules.py        # Evaluation & decision logic
├── data/
│   └── signals.json    # Input signals
└── output/
    └── example_output.json
```

## Layers

1. **SIGNALS** - Input data (oil_price, inflation, claims_rate)
2. **GRAPH** - Relationships between signals
3. **RULES** - Evaluation logic
4. **DECISION ENGINE** - Risk-based decision making
5. **OUTPUT** - Structured decision output

## Usage

```python
from core.rules import run_decision_engine

result = run_decision_engine()
print(result)
```

## Decision Outputs

- **APPROVE** - Risk ≤ 0.3
- **REVIEW** - Risk 0.3-0.6
- **ESCALATE** - Risk > 0.6

## Philosophy

> You are NOT writing code. You ARE designing how decisions are made.
