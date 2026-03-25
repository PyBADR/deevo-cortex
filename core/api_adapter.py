"""DEEVO Cortex — API Adapter

Integration adapter for VERCEPT platform layer.
Provides a clean, stable interface to the local decision engine.
No server logic — this is a callable adapter only.
"""

import json
import os
from typing import Optional

from core.engine import run as engine_run
from core.contracts import validate_signals, validate_engine_output


def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _path(rel: str) -> str:
    return os.path.join(_project_root(), rel)


# ---------------------------------------------------------------------------
# Primary integration entry point
# ---------------------------------------------------------------------------

def execute(signals: Optional[dict] = None) -> dict:
    """Run the decision engine and return a normalised result.

    Args:
        signals: Optional signals dict. If provided, written to
                 the canonical data/signals.json before execution.
                 If None, reads existing data/signals.json.

    Returns:
        dict with exactly three keys:
            - simulation_result
            - decision_trace
            - decision

    Raises:
        ValueError: If input signals fail schema validation.
        RuntimeError: If engine output fails contract validation.
    """
    # If signals provided externally, validate and write to canonical path
    if signals is not None:
        ok, errors = validate_signals(signals)
        if not ok:
            raise ValueError(f"Input signal validation failed: {errors}")
        canonical_path = _path("data/signals.json")
        os.makedirs(os.path.dirname(canonical_path), exist_ok=True)
        with open(canonical_path, "w") as f:
            json.dump(signals, f, indent=2)

    # Execute engine — pass signals directly if provided (avoids file round-trip)
    if signals is not None:
        result = engine_run(signals=signals, write_outputs=False)
    else:
        result = engine_run(write_outputs=False)

    # Validate output contract
    ok, errors = validate_engine_output(result)
    if not ok:
        raise RuntimeError(f"Engine output contract violation: {errors}")

    # Return normalised output — exactly the three expected keys
    return {
        "simulation_result": result["simulation_result"],
        "decision_trace": result["decision_trace"],
        "decision": result["decision"],
    }


# ---------------------------------------------------------------------------
# Convenience: read current canonical signals
# ---------------------------------------------------------------------------

def read_canonical_signals() -> dict:
    """Load and return the current canonical signals file."""
    path = _path("data/signals.json")
    with open(path, "r") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Convenience: list supported scenarios
# ---------------------------------------------------------------------------

def supported_scenarios() -> list:
    """Return list of scenario IDs from the registry."""
    path = _path("data/scenarios.json")
    with open(path, "r") as f:
        scenarios = json.load(f)
    return sorted(scenarios.keys())


# ---------------------------------------------------------------------------
# Convenience: health check
# ---------------------------------------------------------------------------

def health() -> dict:
    """Minimal health check for platform integration."""
    return {
        "status": "ok",
        "engine_entrypoint": "core.api_adapter.execute",
        "canonical_input": "data/signals.json",
        "supported_decisions": ["APPROVE", "REVIEW", "ESCALATE"],
        "supported_scenarios": supported_scenarios(),
    }
