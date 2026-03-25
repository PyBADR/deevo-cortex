"""DEEVO Cortex — Contract Models

Minimal schema definitions for platform integration.
Each schema validates a dict and returns (is_valid, errors).
No external dependencies — pure Python validation.
"""

from typing import Tuple, List, Optional


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

def _check_keys(data: dict, required: list, name: str) -> List[str]:
    """Return list of error strings for missing keys."""
    errors = []
    for key in required:
        if key not in data:
            errors.append(f"{name}: missing required key '{key}'")
    return errors


def _check_type(data: dict, key: str, expected_type, name: str) -> List[str]:
    if key in data and not isinstance(data[key], expected_type):
        return [f"{name}.{key}: expected {expected_type.__name__}, got {type(data[key]).__name__}"]
    return []


# ---------------------------------------------------------------------------
# SignalSchema
# ---------------------------------------------------------------------------

SIGNAL_REQUIRED_KEYS = [
    "oil_price", "inflation", "claims_rate",
    "fraud_index", "repair_cost_index",
]

SIGNAL_NUMERIC_KEYS = [
    "oil_price", "inflation", "claims_rate",
    "fraud_index", "repair_cost_index", "currency_volatility",
]


def validate_signals(data: dict) -> Tuple[bool, List[str]]:
    """Validate a signals dict against the canonical schema."""
    errors = _check_keys(data, SIGNAL_REQUIRED_KEYS, "SignalSchema")
    for key in SIGNAL_NUMERIC_KEYS:
        if key in data and not isinstance(data[key], (int, float)):
            errors.append(f"SignalSchema.{key}: must be numeric, got {type(data[key]).__name__}")
    return (len(errors) == 0, errors)


# ---------------------------------------------------------------------------
# SimulationResultSchema
# ---------------------------------------------------------------------------

SIMULATION_RESULT_KEYS = [
    "active_scenario", "impacted_domains", "severity", "simulated_changes",
]


def validate_simulation_result(data: dict) -> Tuple[bool, List[str]]:
    """Validate a simulation result dict."""
    errors = _check_keys(data, SIMULATION_RESULT_KEYS, "SimulationResultSchema")
    errors += _check_type(data, "impacted_domains", list, "SimulationResultSchema")
    errors += _check_type(data, "severity", (int, float), "SimulationResultSchema")
    errors += _check_type(data, "simulated_changes", dict, "SimulationResultSchema")
    return (len(errors) == 0, errors)


# ---------------------------------------------------------------------------
# DecisionTraceSchema
# ---------------------------------------------------------------------------

DECISION_TRACE_KEYS = [
    "timestamp", "input_signals", "detected_scenario",
    "graph_links_used", "agent_observations",
    "final_risk_score", "final_decision", "confidence",
]


def validate_decision_trace(data: dict) -> Tuple[bool, List[str]]:
    """Validate a decision trace dict."""
    errors = _check_keys(data, DECISION_TRACE_KEYS, "DecisionTraceSchema")
    errors += _check_type(data, "input_signals", dict, "DecisionTraceSchema")
    errors += _check_type(data, "graph_links_used", list, "DecisionTraceSchema")
    errors += _check_type(data, "agent_observations", list, "DecisionTraceSchema")
    if "final_decision" in data and data["final_decision"] not in ("APPROVE", "REVIEW", "ESCALATE"):
        errors.append(
            f"DecisionTraceSchema.final_decision: must be APPROVE|REVIEW|ESCALATE, "
            f"got '{data['final_decision']}'"
        )
    return (len(errors) == 0, errors)


# ---------------------------------------------------------------------------
# DecisionSchema
# ---------------------------------------------------------------------------

DECISION_KEYS = ["decision", "confidence", "summary"]

VALID_DECISIONS = {"APPROVE", "REVIEW", "ESCALATE"}


def validate_decision(data: dict) -> Tuple[bool, List[str]]:
    """Validate a decision dict."""
    errors = _check_keys(data, DECISION_KEYS, "DecisionSchema")
    if "decision" in data and data["decision"] not in VALID_DECISIONS:
        errors.append(
            f"DecisionSchema.decision: must be one of {sorted(VALID_DECISIONS)}, "
            f"got '{data['decision']}'"
        )
    errors += _check_type(data, "confidence", (int, float), "DecisionSchema")
    errors += _check_type(data, "summary", str, "DecisionSchema")
    return (len(errors) == 0, errors)


# ---------------------------------------------------------------------------
# Full output validation
# ---------------------------------------------------------------------------

def validate_engine_output(data: dict) -> Tuple[bool, List[str]]:
    """Validate the full output dict returned by core.engine.run()."""
    errors = _check_keys(data, ["simulation_result", "decision_trace", "decision"], "EngineOutput")
    if "simulation_result" in data:
        ok, errs = validate_simulation_result(data["simulation_result"])
        errors += errs
    if "decision_trace" in data:
        ok, errs = validate_decision_trace(data["decision_trace"])
        errors += errs
    if "decision" in data:
        ok, errs = validate_decision(data["decision"])
        errors += errs
    return (len(errors) == 0, errors)
