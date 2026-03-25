"""DEEVO Cortex — UI Payload Builder

Transforms unified_engine.run() output into a UI-friendly structure
for the bilingual GCC GCC Command Center frontend.

This is a shaping layer — it does NOT remove raw data. It adds
computed fields, rearranges for panel consumption, and attaches
bilingual metadata where relevant.

Phase 4.1 — Intelligence Payload Layer
Phase 4.1+ — Visual enrichment (sparklines, graph metadata, headlines)
"""

import json
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional

from core.visual_enrichment import (
    build_sparkline,
    signal_movement,
    impact_level_from_risk,
    impact_level_from_severity,
    headline_summary,
    short_reasoning,
    brief_headline,
    build_node_details,
    build_edge_details,
)


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _data_path(name: str) -> str:
    return os.path.join(_project_root(), "data", name)


def _load_json(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Severity / decision color mapping
# ---------------------------------------------------------------------------

DECISION_STYLES = {
    "ESCALATE": {"color": "red", "urgency": "immediate", "icon": "alert-triangle"},
    "REVIEW":   {"color": "amber", "urgency": "soon", "icon": "eye"},
    "APPROVE":  {"color": "green", "urgency": "none", "icon": "check-circle"},
}

SEVERITY_STYLES = {
    "critical": {"color": "red", "priority": 4},
    "high":     {"color": "orange", "priority": 3},
    "moderate": {"color": "yellow", "priority": 2},
    "low":      {"color": "green", "priority": 1},
}


# ---------------------------------------------------------------------------
# Top bar summary
# ---------------------------------------------------------------------------

def _build_top_bar(unified: dict) -> dict:
    """Shape the top command bar data."""
    decision = unified.get("decision", {})
    sig_summary = unified.get("signal_summary", {})
    trace = unified.get("decision_trace", {})
    sim = unified.get("simulation_result", {})

    scenario_id = sim.get("active_scenario")
    scenario_label = (scenario_id or "monitoring").replace("_", " ").upper()

    risk = decision.get("risk_score", 0)
    dec_str = decision.get("decision", "UNKNOWN")
    elevated = sig_summary.get("elevated_count", 0)

    return {
        "scenario_id": scenario_id,
        "scenario_label": scenario_label,
        "decision": dec_str,
        "decision_style": DECISION_STYLES.get(dec_str, {}),
        "risk_score": risk,
        "confidence": decision.get("confidence", 0),
        "elevated_count": elevated,
        "critical_signals": sig_summary.get("critical_signals", []),
        "high_signals": sig_summary.get("high_signals", []),
        "timestamp": trace.get("timestamp", datetime.now(timezone.utc).isoformat()),
        # Visual enrichment (4.1+)
        "headline_summary": headline_summary(dec_str, risk, scenario_id, elevated),
        "impact_level": impact_level_from_risk(risk),
    }


# ---------------------------------------------------------------------------
# Signal rail items
# ---------------------------------------------------------------------------

def _build_signal_rail(unified: dict) -> List[dict]:
    """Shape enriched signals into a flat list for the signal feed rail.

    Each item is a self-contained card with all display fields.
    """
    enriched = unified.get("enriched_signals", {})
    items = []

    for key, sig in enriched.items():
        if key.startswith("_"):
            continue
        val = sig.get("value", 0)
        bl = sig.get("baseline", 0)
        sev = sig.get("severity", "low")
        spark = build_sparkline(key, val, bl)
        items.append({
            "id": key,
            "label": sig.get("label", key),
            "value": val,
            "unit": sig.get("unit", ""),
            "delta": sig.get("delta", 0),
            "direction": sig.get("direction", "stable"),
            "category": sig.get("category", "unknown"),
            "severity": sev,
            "severity_style": SEVERITY_STYLES.get(sev, {}),
            "deviation": sig.get("deviation", 0),
            "baseline": bl,
            "timestamp": sig.get("timestamp", ""),
            # Visual enrichment (4.1+)
            "sparkline": spark,
            "movement": signal_movement(spark),
            "impact_level": impact_level_from_severity(sev),
        })

    # Sort: critical first, then high, then by absolute delta
    priority_map = {"critical": 0, "high": 1, "moderate": 2, "low": 3}
    items.sort(key=lambda x: (priority_map.get(x["severity"], 9), -abs(x["delta"])))

    return items


# ---------------------------------------------------------------------------
# Decision rail content
# ---------------------------------------------------------------------------

def _build_decision_rail(unified: dict) -> dict:
    """Shape decision + reasoning + agent observations for the decision panel."""
    decision = unified.get("decision", {})
    trace = unified.get("decision_trace", {})

    observations = trace.get("agent_observations", [])
    agent_cards = []
    for obs in observations:
        agent_cards.append({
            "agent": obs.get("agent", ""),
            "risk": obs.get("assessed_risk", 0),
            "observation": obs.get("observation", ""),
        })

    dec_str = decision.get("decision", "UNKNOWN")
    risk = decision.get("risk_score", 0)
    reasoning_list = decision.get("reasoning", [])

    return {
        "decision": dec_str,
        "confidence": decision.get("confidence", 0),
        "risk_score": risk,
        "summary": decision.get("summary", ""),
        "reasoning": reasoning_list,
        "style": DECISION_STYLES.get(dec_str, {}),
        "scenario_id": trace.get("detected_scenario"),
        "trace_hash": trace.get("trace_hash", ""),
        "agents": agent_cards,
        # Visual enrichment (4.1+)
        "short_reasoning": short_reasoning(reasoning_list),
        "headline_summary": headline_summary(
            dec_str, risk, trace.get("detected_scenario"),
        ),
        "impact_level": impact_level_from_risk(risk),
    }


# ---------------------------------------------------------------------------
# Propagation panel content
# ---------------------------------------------------------------------------

def _build_propagation_panel(unified: dict) -> dict:
    """Shape propagation trace into a display-ready structure."""
    prop = unified.get("propagation_trace", {})
    graph = unified.get("graph_state", {})

    cause_effect = prop.get("cause_effect_chain", [])
    readable_path = prop.get("readable_path", [])

    return {
        "cause_effect_chain": cause_effect,
        "readable_path": readable_path,
        "traversal_steps": len(prop.get("traversal_path", [])),
        "active_nodes": graph.get("active_nodes", []),
        "active_node_count": len(graph.get("active_nodes", [])),
        "affected_countries": graph.get("affected_countries", []),
        "affected_sectors": graph.get("affected_sectors", []),
        "affected_insurance_lines": graph.get("affected_insurance_lines", []),
        "pressure_summary": prop.get("final_pressure_summary", {}),
    }


# ---------------------------------------------------------------------------
# Executive brief
# ---------------------------------------------------------------------------

def _build_executive_brief(unified: dict) -> dict:
    """Shape executive brief for display."""
    text = unified.get("executive_brief", "")
    risk = unified.get("decision", {}).get("risk_score", 0)
    return {
        "text": text,
        "decision": unified.get("decision", {}).get("decision", "UNKNOWN"),
        "confidence": unified.get("decision", {}).get("confidence", 0),
        # Visual enrichment (4.1+)
        "headline_summary": brief_headline(text),
        "impact_level": impact_level_from_risk(risk),
    }


# ---------------------------------------------------------------------------
# Graph summary
# ---------------------------------------------------------------------------

def _build_graph_summary(unified: dict) -> dict:
    """Shape graph state for the globe/canvas display."""
    graph = unified.get("graph_state", {})
    prop = unified.get("propagation_trace", {})
    pressures = graph.get("weighted_impacts", {})
    active = graph.get("active_nodes", [])
    cause_effect = prop.get("cause_effect_chain", [])

    # Build visual enrichment metadata
    nd = build_node_details(active, pressures)
    ed = build_edge_details(cause_effect)
    max_int = max((e["intensity"] for e in ed), default=0) if ed else 0

    return {
        "active_nodes": active,
        "total_active": len(active),
        "affected_countries": graph.get("affected_countries", []),
        "affected_sectors": graph.get("affected_sectors", []),
        "affected_insurance_lines": graph.get("affected_insurance_lines", []),
        "node_pressures": pressures,
        "max_pressure": max((abs(v) for v in pressures.values()), default=0),
        # Visual enrichment (4.1+)
        "node_details": nd,
        "edge_details": ed,
        "max_intensity": max_int,
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def build_ui_payload(unified_output: dict, locale: str = "en") -> dict:
    """Transform unified_engine.run() output into a UI-consumable payload.

    Args:
        unified_output: The dict returned by unified_engine.run().
        locale: 'en' or 'ar' for label selection.

    Returns:
        UI-ready dict with shaped panels + raw data preserved.
    """
    return {
        "version": "4.1.1",
        "locale": locale,
        "timestamp": datetime.now(timezone.utc).isoformat(),

        # Shaped panel payloads
        "top_bar": _build_top_bar(unified_output),
        "signal_rail": _build_signal_rail(unified_output),
        "decision_rail": _build_decision_rail(unified_output),
        "propagation_panel": _build_propagation_panel(unified_output),
        "executive_brief": _build_executive_brief(unified_output),
        "graph_summary": _build_graph_summary(unified_output),

        # Raw data preserved for deep-dive / debug
        "raw": unified_output,
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from core.unified_engine import run as engine_run

    result = engine_run(write_outputs=False)
    payload = build_ui_payload(result, locale="en")

    out_path = os.path.join(_project_root(), "output", "ui_payload_example.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2)

    print(f"UI payload written to {out_path}")
    print(f"Signal rail items: {len(payload['signal_rail'])}")
    print(f"Decision: {payload['decision_rail']['decision']}")
    print(f"Propagation steps: {payload['propagation_panel']['traversal_steps']}")
