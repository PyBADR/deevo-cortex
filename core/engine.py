"""DEEVO Cortex — Decision Engine (Legacy / Decision-Only Path)

LEGACY NOTE — Phase 3.5 Unification
    The canonical entrypoint is now ``core.unified_engine.run()``, which
    combines the decision pipeline and GCC weighted graph pipeline into
    a single orchestrated execution returning all five output keys.

    This module is preserved for backward compatibility and as a
    lightweight decision-only path (no graph propagation outputs).

    For new integrations, use ``core.unified_engine.run()`` instead.

Orchestrates the decision-only pipeline:
  signals → scenario detection → simulation → agent observations → decision → trace
"""

import json
import os
import hashlib
from datetime import datetime, timezone

from core.scenario_registry import load_scenarios, detect_scenarios, select_primary_scenario
from core.simulation_engine import simulate
from core.agents import observe, weighted_risk
from core.rules import evaluate, evaluate_signal_risk, compute_scenario_severity, decide


# ---------------------------------------------------------------------------
# Paths (relative to project root)
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _path(rel: str) -> str:
    return os.path.join(_project_root(), rel)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_json(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)


def _save_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def _sha256(obj: dict) -> str:
    raw = json.dumps(obj, sort_keys=True).encode()
    return hashlib.sha256(raw).hexdigest()


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def run(signals: dict = None, input_path: str = None,
        write_outputs: bool = True) -> dict:
    """Execute the full DEEVO Decision Intelligence pipeline.

    VERCEPT contract: run(signals: dict | None, input_path: str | None) -> dict

    Args:
        signals: Optional signals dict. Takes priority if provided.
        input_path: Optional path to signals JSON file.
                    Used if signals is None.
        write_outputs: If True, writes output JSON files to disk.
                       Set False for programmatic/test usage.

    Resolution order:
        1. signals dict (if provided)
        2. input_path file (if provided)
        3. canonical data/signals.json

    Returns:
        dict with keys: simulation_result, decision_trace, decision
    """

    ts = datetime.now(timezone.utc).isoformat()

    # 1. Load inputs — resolution order: dict > path > canonical
    if signals is not None:
        pass  # use provided dict
    elif input_path is not None:
        signals = _load_json(input_path)
    else:
        signals = _load_json(_path("data/signals.json"))
    scenarios_def = load_scenarios(_path("data/scenarios.json"))
    context = _load_json(_path("data/context_profile.json"))
    graph_path = _path("core/graph.json")

    # 2. Detect active scenario
    triggered = detect_scenarios(signals, scenarios_def)
    primary = select_primary_scenario(triggered, signals)

    if primary is None:
        # No scenario triggered — fallback to signal-only evaluation
        base_risk = evaluate(signals)
        decision_str, confidence = decide(base_risk, context)
        result = _build_no_scenario_output(signals, base_risk, decision_str, confidence, ts)
        if write_outputs:
            _write_outputs(result)
        return result

    # 3. Simulate
    sim_result = simulate(primary, signals, graph_path)

    # 4. Agent observations
    observations = observe(sim_result)
    agent_risk = weighted_risk(observations)

    # 5. Blend simulation severity with agent risk
    blended_risk = round(0.5 * sim_result["severity"] + 0.5 * agent_risk, 4)
    final_risk = round(max(blended_risk, evaluate(signals)), 4)

    # 6. Decision
    decision_str, confidence = decide(final_risk, context)

    # 7. Build output artefacts
    result = _build_full_output(
        signals, primary, sim_result, observations,
        final_risk, decision_str, confidence, ts,
    )
    if write_outputs:
        _write_outputs(result)
    return result


# ---------------------------------------------------------------------------
# Output builders
# ---------------------------------------------------------------------------

def _build_full_output(signals, scenario, sim_result, observations,
                       risk, decision_str, confidence, ts):
    simulation_result = {
        "active_scenario": sim_result["active_scenario"],
        "impacted_domains": sim_result["impacted_domains"],
        "severity": sim_result["severity"],
        "simulated_changes": sim_result["simulated_changes"],
    }

    decision_trace = {
        "timestamp": ts,
        "input_signals": signals,
        "detected_scenario": scenario["id"],
        "graph_links_used": sim_result["graph_links_used"],
        "agent_observations": [
            {
                "agent": o["agent"],
                "assessed_risk": o["assessed_risk"],
                "observation": o["observation"],
            }
            for o in observations
        ],
        "final_risk_score": risk,
        "final_decision": decision_str,
        "confidence": confidence,
        "trace_hash": _sha256({"signals": signals, "scenario": scenario["id"], "risk": risk}),
    }

    decision = {
        "decision": decision_str,
        "confidence": confidence,
        "summary": (
            f"Scenario '{scenario['name']}' detected. "
            f"Severity {sim_result['severity']:.2f}, blended risk {risk:.2f}. "
            f"Decision: {decision_str} (confidence {confidence})."
        ),
    }

    return {
        "simulation_result": simulation_result,
        "decision_trace": decision_trace,
        "decision": decision,
    }


def _build_no_scenario_output(signals, risk, decision_str, confidence, ts):
    simulation_result = {
        "active_scenario": None,
        "impacted_domains": [],
        "severity": 0.0,
        "simulated_changes": {},
    }
    decision_trace = {
        "timestamp": ts,
        "input_signals": signals,
        "detected_scenario": None,
        "graph_links_used": [],
        "agent_observations": [],
        "final_risk_score": risk,
        "final_decision": decision_str,
        "confidence": confidence,
        "trace_hash": _sha256({"signals": signals, "scenario": None, "risk": risk}),
    }
    decision = {
        "decision": decision_str,
        "confidence": confidence,
        "summary": (
            f"No active scenario detected. "
            f"Signal-level risk {risk:.2f}. "
            f"Decision: {decision_str} (confidence {confidence})."
        ),
    }
    return {
        "simulation_result": simulation_result,
        "decision_trace": decision_trace,
        "decision": decision,
    }


def _write_outputs(result: dict) -> None:
    _save_json(_path("output/simulation_result.json"), result["simulation_result"])
    _save_json(_path("output/decision_trace.json"), result["decision_trace"])
    _save_json(_path("output/decision.json"), result["decision"])


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    result = run()
    print(json.dumps(result["decision"], indent=2))
