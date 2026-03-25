"""DEEVO Cortex — Unified Intelligence Engine

Canonical orchestrator: combines the decision pipeline, GCC weighted
graph pipeline, signal enrichment, executive briefing, and decision
reasoning into a single living intelligence execution.

    signals → enrichment
            → scenario detection
            → GCC weighted propagation (graph_state + propagation_trace)
            → cause-effect chain
            → simulation context derived from propagation pressures
            → agent observations
            → risk blending
            → decision + reasoning + executive brief

Returns one dict with eight top-level keys:
    simulation_result, decision_trace, decision, graph_state,
    propagation_trace, enriched_signals, executive_brief, signal_summary

Phase 4.0 — Live Intelligence Layer
"""

import json
import os
import hashlib
from datetime import datetime, timezone
from typing import Dict, List, Optional

from core.scenario_registry import load_scenarios, detect_scenarios, select_primary_scenario
from core.propagation import run_propagation, PropagationResult
from core.agents import observe, weighted_risk
from core.rules import evaluate, compute_scenario_severity, decide
from core.signal_enrichment import enrich_signals, signal_summary as compute_signal_summary
from core.brief_generator import (
    generate_brief,
    generate_reasoning,
    build_cause_effect_chain,
    build_readable_path,
)


# ---------------------------------------------------------------------------
# Paths
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
# Signal defaults
# ---------------------------------------------------------------------------

SIGNAL_DEFAULTS = {
    "interest_rate": 5.0,
    "supply_chain_stress": 0.3,
}


def _resolve_signals(
    signals: Optional[dict] = None,
    input_path: Optional[str] = None,
) -> dict:
    """Load and normalise signals.

    Resolution order:
        1. signals dict (if provided)
        2. input_path file (if provided)
        3. canonical data/signals.json

    Missing graph-layer fields are filled from SIGNAL_DEFAULTS.
    """
    if signals is not None:
        resolved = dict(signals)
    elif input_path is not None:
        resolved = _load_json(input_path)
    else:
        resolved = _load_json(_path("data/signals.json"))

    for key, default in SIGNAL_DEFAULTS.items():
        if key not in resolved:
            resolved[key] = default

    return resolved


# ---------------------------------------------------------------------------
# Propagation → Simulation bridge
# ---------------------------------------------------------------------------

def _derive_simulation_result(
    scenario: Optional[dict],
    signals: dict,
    prop_result: PropagationResult,
) -> dict:
    """Convert propagation pressures into simulation_result schema."""
    pressures = prop_result.node_pressures
    impacted = prop_result.impacted_nodes
    root_ids = set(prop_result.root_signals)

    if scenario is None:
        return {
            "active_scenario": None,
            "impacted_domains": list(impacted),
            "severity": 0.0,
            "simulated_changes": {},
            "graph_links_used": [
                f"{step['from']} -> {step['to']}"
                for step in prop_result.traversal_path
            ],
        }

    simulated_changes: Dict[str, dict] = {}
    depth = 0
    for node_id in impacted:
        depth += 1
        pressure = abs(pressures.get(node_id, 0.0))
        direction = "increase" if pressures.get(node_id, 0) >= 0 else "decrease"
        simulated_changes[node_id] = {
            "direction": direction,
            "magnitude": round(min(pressure, 2.0), 4),
            "propagation_depth": depth,
        }

    all_domains = list(root_ids | set(impacted))
    graph_links_used = [
        f"{step['from']} -> {step['to']}"
        for step in prop_result.traversal_path
    ]
    severity = compute_scenario_severity(scenario, signals)

    return {
        "active_scenario": scenario["id"],
        "impacted_domains": all_domains,
        "severity": severity,
        "simulated_changes": simulated_changes,
        "graph_links_used": graph_links_used,
    }


# ---------------------------------------------------------------------------
# Output builders
# ---------------------------------------------------------------------------

def _build_decision_trace(
    signals: dict,
    scenario_id: Optional[str],
    observations: List[dict],
    risk: float,
    decision_str: str,
    confidence: float,
    ts: str,
) -> dict:
    return {
        "timestamp": ts,
        "input_signals": signals,
        "detected_scenario": scenario_id,
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
        "trace_hash": _sha256({
            "signals": signals,
            "scenario": scenario_id,
            "risk": risk,
        }),
    }


def _build_decision(
    scenario: Optional[dict],
    sim_result: dict,
    risk: float,
    decision_str: str,
    confidence: float,
    reasoning: List[str],
) -> dict:
    if scenario is not None:
        summary = (
            f"Scenario '{scenario['name']}' detected. "
            f"Severity {sim_result['severity']:.2f}, blended risk {risk:.2f}. "
            f"Decision: {decision_str} (confidence {confidence})."
        )
    else:
        summary = (
            f"No active scenario detected. "
            f"Signal-level risk {risk:.2f}. "
            f"Decision: {decision_str} (confidence {confidence})."
        )
    return {
        "decision": decision_str,
        "confidence": confidence,
        "risk_score": risk,
        "summary": summary,
        "reasoning": reasoning,
    }


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

def _write_all_outputs(result: dict) -> None:
    """Persist all output artefacts to disk."""
    _save_json(_path("output/simulation_result.json"), result["simulation_result"])
    _save_json(_path("output/decision_trace.json"), result["decision_trace"])
    _save_json(_path("output/decision.json"), result["decision"])
    _save_json(_path("output/graph_state.json"), result["graph_state"])
    _save_json(_path("output/propagation_trace.json"), result["propagation_trace"])
    _save_json(_path("output/enriched_signals.json"), result["enriched_signals"])
    _save_json(_path("output/executive_brief.json"), {
        "brief": result["executive_brief"],
        "signal_summary": result["signal_summary"],
    })


# ---------------------------------------------------------------------------
# Unified pipeline
# ---------------------------------------------------------------------------

def run(
    signals: dict = None,
    input_path: str = None,
    write_outputs: bool = True,
    country_id: str = None,
    lob: str = None,
    previous_signals: dict = None,
) -> dict:
    """Execute the unified live intelligence pipeline.

    This is the canonical COWORK entrypoint for DEEVO Cortex.
    Combines decision pipeline, GCC weighted graph pipeline,
    signal enrichment, and executive briefing.

    Args:
        signals:           Optional signal dict. Highest priority.
        input_path:        Optional path to signals JSON.
        write_outputs:     If True, persists all output files to disk.
        country_id:        Optional GCC country code (SA, AE, KW, QA, BH, OM).
        lob:               Optional insurance line (motor, medical, property, marine).
        previous_signals:  Previous signal dict for delta/direction computation.

    Returns:
        dict with keys:
            simulation_result   — active scenario, impacted domains, severity
            decision_trace      — full audit trail with SHA-256 hash
            decision            — APPROVE | REVIEW | ESCALATE + confidence + reasoning
            graph_state         — active nodes, affected dimensions, weighted impacts
            propagation_trace   — weighted traversal + cause_effect_chain + readable_path
            enriched_signals    — per-signal enrichment (value, delta, direction, severity)
            executive_brief     — 2-3 sentence business-language summary
            signal_summary      — elevated count, critical/high signals, top movers
    """
    ts = datetime.now(timezone.utc).isoformat()

    # ── 1. Resolve signals ────────────────────────────────────────────────
    signals = _resolve_signals(signals, input_path)

    # ── 2. Enrich signals ─────────────────────────────────────────────────
    enriched = enrich_signals(signals, previous_signals=previous_signals, ts=ts)
    sig_summary = compute_signal_summary(enriched)

    # ── 3. Load context ───────────────────────────────────────────────────
    scenarios_def = load_scenarios(_path("data/scenarios.json"))
    context = _load_json(_path("data/context_profile.json"))

    # ── 4. Detect active scenario ─────────────────────────────────────────
    triggered = detect_scenarios(signals, scenarios_def)
    primary = select_primary_scenario(triggered, signals)

    # ── 5. GCC weighted propagation ───────────────────────────────────────
    prop_result = run_propagation(
        signals=signals,
        country_id=country_id,
        lob=lob,
        write_outputs=False,
    )
    graph_state = prop_result.to_graph_state()
    propagation_trace = prop_result.to_propagation_trace()

    # ── 6. Enhance propagation with cause-effect chain ────────────────────
    cause_effect_chain = build_cause_effect_chain(propagation_trace)
    readable_path = build_readable_path(propagation_trace)
    propagation_trace["cause_effect_chain"] = cause_effect_chain
    propagation_trace["readable_path"] = readable_path

    # ── 7. Derive simulation context from propagation ─────────────────────
    sim_result = _derive_simulation_result(primary, signals, prop_result)

    # ── 8. Agent observations ─────────────────────────────────────────────
    observations = observe(sim_result)
    agent_risk = weighted_risk(observations)

    # ── 9. Risk blending ──────────────────────────────────────────────────
    severity = sim_result["severity"]
    base_signal_risk = evaluate(signals)

    if primary is not None:
        blended = round(0.5 * severity + 0.5 * agent_risk, 4)
        final_risk = round(max(blended, base_signal_risk), 4)
    else:
        final_risk = base_signal_risk

    # Graph pressure boost
    max_pressure = max(
        (abs(v) for v in prop_result.node_pressures.values()),
        default=0.0,
    )
    if max_pressure > 1.5:
        graph_boost = round(min(0.10, (max_pressure - 1.5) * 0.05), 4)
        final_risk = round(min(1.0, final_risk + graph_boost), 4)

    # ── 10. Decision ──────────────────────────────────────────────────────
    decision_str, confidence = decide(final_risk, context)

    # ── 11. Decision reasoning ────────────────────────────────────────────
    scenario_id = primary["id"] if primary else None
    reasoning = generate_reasoning(
        decision_str=decision_str,
        risk_score=final_risk,
        scenario=primary,
        enriched_signals=enriched,
        observations=observations,
        graph_state=graph_state,
        propagation_trace=propagation_trace,
    )

    # ── 12. Build decision trace ──────────────────────────────────────────
    decision_trace = _build_decision_trace(
        signals, scenario_id, observations, final_risk, decision_str, confidence, ts,
    )

    # ── 13. Build enhanced decision ───────────────────────────────────────
    decision = _build_decision(
        primary, sim_result, final_risk, decision_str, confidence, reasoning,
    )

    # ── 14. Assemble unified output ───────────────────────────────────────
    output = {
        "simulation_result": sim_result,
        "decision_trace": decision_trace,
        "decision": decision,
        "graph_state": graph_state,
        "propagation_trace": propagation_trace,
        "enriched_signals": enriched,
        "executive_brief": "",
        "signal_summary": sig_summary,
    }

    # ── 15. Executive brief (needs full output) ───────────────────────────
    output["executive_brief"] = generate_brief(output)

    if write_outputs:
        _write_all_outputs(output)

    return output


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    result = run()
    print("=" * 60)
    print("DEEVO Cortex — LIVE INTELLIGENCE BRIEF")
    print("=" * 60)
    print()
    print(result["executive_brief"])
    print()
    print(json.dumps(result["decision"], indent=2))
    print()
    print(f"Graph: {len(result['graph_state']['active_nodes'])} active nodes")
    print(f"Propagation: {len(result['propagation_trace']['traversal_path'])} edges traversed")
    print(f"Signals: {result['signal_summary']['elevated_count']} elevated")
