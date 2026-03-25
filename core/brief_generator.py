"""DEEVO Cortex — Executive Brief & Decision Reasoning Generator

Transforms structured intelligence output into:
  1. Executive brief — 2-3 sentence business-language summary
  2. Decision reasoning — ordered list of causal justifications
  3. Cause-effect chain — readable propagation explanation

Phase 4 — Live Intelligence Layer
"""

from typing import Dict, List, Optional


# ---------------------------------------------------------------------------
# Node label registry (human-readable names)
# ---------------------------------------------------------------------------

NODE_LABELS = {
    "oil_price": "Oil Price",
    "inflation": "Inflation",
    "interest_rate": "Interest Rates",
    "supply_chain_stress": "Supply Chain Stress",
    "fraud_alerts": "Fraud Alerts",
    "repair_cost_index": "Repair Costs",
    "claims": "Claims Frequency",
    "loss_ratio": "Loss Ratio",
    "reserves": "Reserve Adequacy",
    "pricing": "Premium Pricing",
    "fraud": "Fraud Activity",
    "investigation": "SIU Investigations",
    "regulatory_pressure": "Regulatory Pressure",
    "reinsurance_cost": "Reinsurance Cost",
}

RELATION_VERBS = {
    "drives": "is driving",
    "pressures": "is putting pressure on",
    "amplifies": "is amplifying",
    "enables": "is enabling",
    "triggers": "is triggering",
    "correlates": "correlates with",
    "affects": "is affecting",
    "erodes": "is eroding",
    "depletes": "is depleting",
    "forces": "is forcing changes in",
    "indicates": "indicates rising",
    "inflates": "is inflating",
    "suppresses": "is suppressing",
}


def _label(node_id: str) -> str:
    return NODE_LABELS.get(node_id, node_id.replace("_", " ").title())


# ---------------------------------------------------------------------------
# Cause-effect chain
# ---------------------------------------------------------------------------

def build_cause_effect_chain(propagation_trace: dict) -> List[dict]:
    """Convert raw traversal path into a readable cause → effect chain.

    Returns list of:
        {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 0.75,
            "readable": "Oil Price is driving Inflation (weight 0.75)"
        }
    """
    chain = []
    for step in propagation_trace.get("traversal_path", []):
        src = step.get("from", "")
        tgt = step.get("to", "")
        rel = step.get("relation_type", "affects")
        weight = step.get("weight", 0)

        verb = RELATION_VERBS.get(rel, f"is linked to")
        readable = f"{_label(src)} {verb} {_label(tgt)} (weight {weight:.2f})"

        chain.append({
            "from": _label(src),
            "to": _label(tgt),
            "relation": verb,
            "weight": round(weight, 4),
            "readable": readable,
        })

    return chain


def build_readable_path(propagation_trace: dict) -> List[str]:
    """Build a flat list of 'A → B' strings for the propagation path."""
    seen = set()
    path = []
    for step in propagation_trace.get("traversal_path", []):
        src = _label(step.get("from", ""))
        tgt = _label(step.get("to", ""))
        arrow = f"{src} → {tgt}"
        if arrow not in seen:
            seen.add(arrow)
            path.append(arrow)
    return path


# ---------------------------------------------------------------------------
# Decision reasoning
# ---------------------------------------------------------------------------

def generate_reasoning(
    decision_str: str,
    risk_score: float,
    scenario: Optional[dict],
    enriched_signals: dict,
    observations: List[dict],
    graph_state: dict,
    propagation_trace: dict,
) -> List[str]:
    """Produce an ordered list of human-readable reasoning lines
    explaining why the decision was made.

    Each line is a standalone sentence suitable for display
    in a command-center reasoning panel.
    """
    reasons = []

    # 1. Scenario context
    if scenario:
        reasons.append(
            f"Scenario '{scenario['name']}' detected — "
            f"{scenario.get('description', 'elevated risk conditions')}."
        )
    else:
        reasons.append("No specific risk scenario triggered; evaluating signal levels directly.")

    # 2. Top signal drivers
    critical = []
    high = []
    for key, sig in enriched_signals.items():
        if key.startswith("_"):
            continue
        sev = sig.get("severity", "low")
        direction = sig.get("direction", "stable")
        label = sig.get("label", key)
        if sev == "critical":
            critical.append(f"{label} ({direction})")
        elif sev == "high":
            high.append(f"{label} ({direction})")

    if critical:
        reasons.append(f"Critical signals: {', '.join(critical)}.")
    if high:
        reasons.append(f"Elevated signals: {', '.join(high)}.")

    # 3. Propagation impact
    active_nodes = graph_state.get("active_nodes", [])
    if active_nodes:
        labeled = [_label(n) for n in active_nodes[:5]]
        reasons.append(
            f"Graph propagation impacted {len(active_nodes)} nodes "
            f"including {', '.join(labeled)}."
        )

    countries = graph_state.get("affected_countries", [])
    if countries:
        reasons.append(f"All {len(countries)} GCC markets affected.")

    # 4. Agent consensus
    for obs in observations:
        agent = obs.get("agent", "")
        risk = obs.get("assessed_risk", 0)
        if risk > 0.5:
            note = obs.get("observation", "")
            short = note.split(".")[0] + "." if note else f"{agent}: risk {risk:.2f}"
            reasons.append(short)

    # 5. Final verdict
    if decision_str == "ESCALATE":
        reasons.append(
            f"Combined risk score {risk_score:.2f} exceeds escalation threshold. "
            f"Immediate senior review required."
        )
    elif decision_str == "REVIEW":
        reasons.append(
            f"Risk score {risk_score:.2f} warrants manual review before approval."
        )
    else:
        reasons.append(
            f"Risk score {risk_score:.2f} within acceptable range. Auto-approval recommended."
        )

    return reasons


# ---------------------------------------------------------------------------
# Executive brief
# ---------------------------------------------------------------------------

def generate_brief(unified_output: dict) -> str:
    """Generate a 2-3 sentence executive brief from unified engine output.

    Written in business language for C-level / board consumption.
    No technical jargon. Clear cause → impact → action.
    """
    decision = unified_output.get("decision", {})
    sim = unified_output.get("simulation_result", {})
    graph = unified_output.get("graph_state", {})
    trace = unified_output.get("decision_trace", {})
    enriched = unified_output.get("enriched_signals", {})

    dec_str = decision.get("decision", "UNKNOWN")
    confidence = decision.get("confidence", 0)
    risk = trace.get("final_risk_score", 0)
    scenario_id = sim.get("active_scenario")

    active_nodes = graph.get("active_nodes", [])
    countries = graph.get("affected_countries", [])
    lines = graph.get("affected_insurance_lines", [])

    # Sentence 1: What is happening
    if scenario_id:
        scenario_name = sim.get("active_scenario", "").replace("_", " ").title()
        # Find the top mover from enriched signals
        top_signal = _find_top_mover(enriched)
        sentence1 = (
            f"A {scenario_name} scenario is active"
            f"{f', driven primarily by {top_signal}' if top_signal else ''}, "
            f"with cascading effects across {len(active_nodes)} risk dimensions."
        )
    else:
        sentence1 = (
            "No specific risk scenario is currently triggered. "
            "Market conditions are within normal operating parameters."
        )

    # Sentence 2: Impact scope
    if countries and lines:
        sentence2 = (
            f"The impact propagates across all {len(countries)} GCC markets "
            f"affecting {', '.join(lines)} lines, "
            f"with a combined risk score of {risk:.0%}."
        )
    elif active_nodes:
        sentence2 = f"Propagation analysis shows {len(active_nodes)} active risk nodes at {risk:.0%} combined risk."
    else:
        sentence2 = f"Overall risk remains low at {risk:.0%}."

    # Sentence 3: Action
    if dec_str == "ESCALATE":
        sentence3 = (
            f"Recommendation: ESCALATE for immediate senior review "
            f"(confidence {confidence:.0%})."
        )
    elif dec_str == "REVIEW":
        sentence3 = (
            f"Recommendation: Flag for manual REVIEW before proceeding "
            f"(confidence {confidence:.0%})."
        )
    else:
        sentence3 = (
            f"Recommendation: APPROVE — no action required "
            f"(confidence {confidence:.0%})."
        )

    return f"{sentence1} {sentence2} {sentence3}"


def _find_top_mover(enriched: dict) -> Optional[str]:
    """Find the signal with the largest absolute delta."""
    best_key = None
    best_delta = 0
    for key, sig in enriched.items():
        if key.startswith("_"):
            continue
        delta = abs(sig.get("delta", 0))
        if delta > best_delta:
            best_delta = delta
            best_key = sig.get("label", key)
    return best_key
