"""DEEVO Cortex — Rules Engine

Scenario-aware evaluation and decision logic for the
DEEVO Decision Intelligence system. Supports APPROVE / REVIEW / ESCALATE.
"""

import json
from typing import Tuple


# ---------------------------------------------------------------------------
# Signal evaluation
# ---------------------------------------------------------------------------

def evaluate(signals: dict) -> float:
    """Compute a base risk score from raw signals (0..1).

    VERCEPT contract: evaluate(signals: dict) -> float
    """
    risk = 0.0

    oil = signals.get("oil_price", 0)
    if oil > 100:
        risk += 0.25
    elif oil > 90:
        risk += 0.15

    if signals.get("inflation", 0) > 3.5:
        risk += 0.20

    claims = signals.get("claims_rate", 0)
    if claims > 0.6:
        risk += 0.25
    elif claims > 0.4:
        risk += 0.15

    if signals.get("fraud_index", 0) > 0.6:
        risk += 0.20

    if signals.get("repair_cost_index", 0) > 1.2:
        risk += 0.15

    return min(risk, 1.0)


# Backward-compatible alias
evaluate_signal_risk = evaluate


# ---------------------------------------------------------------------------
# Scenario-level severity
# ---------------------------------------------------------------------------

def compute_scenario_severity(scenario: dict, signals: dict) -> float:
    """Weighted severity score for a detected scenario (0..1)."""
    weights = scenario.get("severity_weights", {})
    severity = 0.0

    mapping = {
        "oil_price_factor": ("oil_price", 95, 130),
        "inflation_factor": ("inflation", 3.0, 6.0),
        "claims_factor": ("claims_rate", 0.4, 0.9),
        "fraud_index_factor": ("fraud_index", 0.4, 1.0),
        "repair_cost_factor": ("repair_cost_index", 1.0, 2.0),
    }

    for key, weight in weights.items():
        if key in mapping:
            signal_key, low, high = mapping[key]
            value = signals.get(signal_key, 0)
            normalised = max(0.0, min(1.0, (value - low) / (high - low)))
            severity += weight * normalised

    return round(min(severity, 1.0), 4)


# ---------------------------------------------------------------------------
# Decision logic
# ---------------------------------------------------------------------------

def decide(risk_score: float, context: dict) -> Tuple[str, float]:
    """Return (decision, confidence) using context thresholds."""
    esc = context.get("escalation_threshold", 0.65)
    rev = context.get("review_threshold", 0.35)

    if risk_score >= esc:
        return "ESCALATE", round(0.70 + 0.25 * min(risk_score, 1.0), 2)
    elif risk_score >= rev:
        return "REVIEW", round(0.60 + 0.20 * risk_score, 2)
    else:
        return "APPROVE", round(0.80 + 0.15 * (1.0 - risk_score), 2)
