"""DEEVO Cortex — Scenario Registry

Loads scenario definitions and detects the active scenario from signals.
"""

import json
import os
from typing import Optional, List

OPERATORS = {
    ">": lambda v, t: v > t,
    ">=": lambda v, t: v >= t,
    "<": lambda v, t: v < t,
    "<=": lambda v, t: v <= t,
    "==": lambda v, t: v == t,
}


def load_scenarios(path: str) -> dict:
    """Load scenario definitions from JSON."""
    with open(path, "r") as f:
        return json.load(f)


def check_trigger(signals: dict, conditions: dict) -> bool:
    """Return True if all trigger conditions are met."""
    for signal_key, rule in conditions.items():
        op_fn = OPERATORS.get(rule["operator"])
        if op_fn is None:
            continue
        value = signals.get(signal_key, 0)
        if not op_fn(value, rule["threshold"]):
            return False
    return True


def detect_scenarios(signals: dict, scenarios: dict) -> List[dict]:
    """Return list of all triggered scenarios, ordered by id."""
    triggered = []
    for scenario_id, defn in scenarios.items():
        if check_trigger(signals, defn.get("trigger_conditions", {})):
            triggered.append(defn)
    return triggered


def select_primary_scenario(triggered: List[dict], signals: dict) -> Optional[dict]:
    """Pick the highest-severity scenario as the active one."""
    if not triggered:
        return None
    if len(triggered) == 1:
        return triggered[0]

    # Import here to avoid circular dependency
    from core.rules import compute_scenario_severity

    best = None
    best_sev = -1.0
    for s in triggered:
        sev = compute_scenario_severity(s, signals)
        if sev > best_sev:
            best_sev = sev
            best = s
    return best
