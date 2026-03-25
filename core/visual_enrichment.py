"""DEEVO Cortex — Visual Enrichment

Lightweight helpers that add animation-ready metadata to payloads
without touching core decision/graph logic.

All functions are pure, deterministic when seeded, and produce
JSON-serializable output.

Capabilities:
  - Signal sparklines (deterministic micro-delta history)
  - Impact level mapping (severity/risk → UI tier)
  - Graph node severity scoring
  - Graph edge intensity computation
  - Headline / short reasoning condensation

Phase 4.1+ — Visual Enrichment Layer
"""

import hashlib
import math
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Impact level mapping
# ---------------------------------------------------------------------------

# Maps risk_score (0..1) to a 4-tier UI impact level
_IMPACT_THRESHOLDS: List[Tuple[float, str]] = [
    (0.80, "critical"),
    (0.60, "high"),
    (0.35, "medium"),
    (0.00, "low"),
]


def impact_level_from_risk(risk_score: float) -> str:
    """Map a 0..1 risk score to a UI impact level string."""
    for threshold, level in _IMPACT_THRESHOLDS:
        if risk_score >= threshold:
            return level
    return "low"


def impact_level_from_severity(severity: str) -> str:
    """Map enriched signal severity to impact level."""
    return {
        "critical": "critical",
        "high": "high",
        "moderate": "medium",
        "low": "low",
    }.get(severity, "low")


# ---------------------------------------------------------------------------
# Signal sparklines
# ---------------------------------------------------------------------------

def _seeded_float(seed_str: str, index: int) -> float:
    """Deterministic pseudo-random float in [-1, 1] from a string seed + index.

    Uses SHA-256 truncation — no stdlib random state pollution.
    """
    h = hashlib.sha256(f"{seed_str}:{index}".encode()).hexdigest()
    # Take 8 hex chars → 32-bit integer → normalise to [-1, 1]
    raw = int(h[:8], 16) / 0xFFFFFFFF  # 0..1
    return (raw * 2) - 1  # -1..1


def build_sparkline(
    signal_id: str,
    current_value: float,
    baseline: float,
    volatility: float = 0.02,
    points: int = 12,
    seed: str = "cortex",
) -> List[float]:
    """Generate a deterministic sparkline (micro-delta history) for a signal.

    Returns `points` values representing recent signal movement
    as fractional deltas from baseline (e.g., [0.03, 0.05, 0.04, ...]).
    The last value always equals the actual current delta.

    Args:
        signal_id:     Unique signal key (used as part of seed).
        current_value: Current signal value.
        baseline:      Signal baseline for delta computation.
        volatility:    Amplitude of micro-variations (fraction of baseline).
        points:        Number of sparkline data points.
        seed:          Global seed for determinism.

    Returns:
        List of floats — fractional deltas from baseline, length == points.
    """
    if baseline == 0:
        baseline = 1.0  # avoid division by zero

    current_delta = (current_value - baseline) / abs(baseline)
    compound_seed = f"{seed}:{signal_id}"

    # Build a path that converges on the current delta
    sparkline = []
    for i in range(points):
        # Progress toward current value: 0.0 at start → 1.0 at end
        progress = i / max(points - 1, 1)
        # Deterministic jitter that decays as we approach current
        jitter = _seeded_float(compound_seed, i) * volatility * (1 - progress * 0.7)
        # Interpolate from zero-delta toward current delta
        value = current_delta * progress + jitter
        sparkline.append(round(value, 4))

    # Pin last point to actual delta
    sparkline[-1] = round(current_delta, 4)
    return sparkline


def signal_movement(sparkline: List[float]) -> str:
    """Classify signal movement from sparkline data.

    Returns: 'accelerating', 'decelerating', or 'steady'.
    """
    if len(sparkline) < 3:
        return "steady"

    # Compare second-half average magnitude to first-half
    mid = len(sparkline) // 2
    first_half = sum(abs(v) for v in sparkline[:mid]) / max(mid, 1)
    second_half = sum(abs(v) for v in sparkline[mid:]) / max(len(sparkline) - mid, 1)

    ratio = second_half / max(first_half, 0.001)
    if ratio > 1.3:
        return "accelerating"
    elif ratio < 0.7:
        return "decelerating"
    return "steady"


# ---------------------------------------------------------------------------
# Graph node severity
# ---------------------------------------------------------------------------

def node_severity_score(pressure: float) -> float:
    """Compute a 0..1 severity score from a node's propagation pressure.

    Uses a sigmoid-like curve: low pressures stay near 0,
    pressures above 1.0 approach 1.0 rapidly.
    """
    # Clamp to non-negative
    p = max(abs(pressure), 0)
    # Sigmoid: 2/(1+e^{-2p}) - 1, maps [0,∞) → [0,1)
    score = 2.0 / (1.0 + math.exp(-2.0 * p)) - 1.0
    return round(score, 3)


def node_impact_level(pressure: float) -> str:
    """Map node pressure to an impact level string."""
    score = node_severity_score(pressure)
    return impact_level_from_risk(score)


# ---------------------------------------------------------------------------
# Graph edge intensity
# ---------------------------------------------------------------------------

def edge_intensity(weight: float, max_weight: float = 1.0) -> float:
    """Normalise an edge weight to a 0..1 intensity for visual rendering.

    Args:
        weight:     The edge's propagation weight.
        max_weight: The maximum weight in the current graph traversal.

    Returns:
        Float in [0, 1].
    """
    if max_weight <= 0:
        return 0.0
    return round(min(abs(weight) / abs(max_weight), 1.0), 3)


# ---------------------------------------------------------------------------
# Graph metadata assembly
# ---------------------------------------------------------------------------

def build_node_details(
    active_nodes: List[str],
    pressures: Dict[str, float],
) -> List[dict]:
    """Build node-level visual metadata for the graph canvas.

    Returns a list sorted by severity (highest first).
    """
    details = []
    for nid in active_nodes:
        p = pressures.get(nid, 0)
        details.append({
            "id": nid,
            "pressure": round(p, 4),
            "severity_score": node_severity_score(p),
            "impact_level": node_impact_level(p),
        })

    details.sort(key=lambda x: x["severity_score"], reverse=True)
    return details


def build_edge_details(
    cause_effect_chain: List[dict],
) -> List[dict]:
    """Build edge-level visual metadata from the propagation cause-effect chain.

    Each edge gets a normalised intensity for line-thickness / glow rendering.
    """
    if not cause_effect_chain:
        return []

    max_w = max((abs(e.get("weight", 0)) for e in cause_effect_chain), default=1.0)
    if max_w == 0:
        max_w = 1.0

    edges = []
    for entry in cause_effect_chain:
        w = entry.get("weight", 0)
        edges.append({
            "from": entry.get("from", ""),
            "to": entry.get("to", ""),
            "relation": entry.get("relation", ""),
            "weight": round(w, 4),
            "intensity": edge_intensity(w, max_w),
        })
    return edges


# ---------------------------------------------------------------------------
# Scenario display labels (demo-quality)
# ---------------------------------------------------------------------------

_SCENARIO_LABELS = {
    "oil_spike": "Oil Price Surge",
    "fraud_surge": "Fraud Activity Surge",
    "repair_cost_inflation": "Repair Cost Inflation",
    "supply_chain_break": "Supply Chain Disruption",
    "geopolitical_escalation": "Geopolitical Escalation",
}

_DECISION_VERBS = {
    "ESCALATE": "requires immediate action",
    "REVIEW": "flagged for review",
    "APPROVE": "within normal parameters",
}


# ---------------------------------------------------------------------------
# Headline / short reasoning condensation
# ---------------------------------------------------------------------------

def headline_summary(
    decision: str,
    risk_score: float,
    scenario_id: Optional[str],
    elevated_count: int = 0,
) -> str:
    """Generate a presentation-quality one-line headline.

    Uses scenario-specific labels and urgency-tiered language
    for clear demo storytelling.

    Examples:
        "ESCALATE — Oil Price Surge detected · 4 elevated signals · risk 0.95"
        "REVIEW — Repair Cost Inflation flagged · 2 elevated signals · risk 0.52"
        "APPROVE — Monitoring · risk 0.18"
    """
    scenario_label = _SCENARIO_LABELS.get(
        scenario_id, (scenario_id or "monitoring").replace("_", " ").title()
    )
    verb = _DECISION_VERBS.get(decision, "detected")

    if scenario_id:
        headline = f"{decision} — {scenario_label} {verb}"
    else:
        headline = f"{decision} — Monitoring · {verb}"

    if elevated_count > 0:
        headline += f" · {elevated_count} elevated signal{'s' if elevated_count != 1 else ''}"

    headline += f" · risk {risk_score:.2f}"
    return headline


def short_reasoning(reasoning_list: List[str], max_chars: int = 140) -> str:
    """Condense the reasoning array into a clear, demo-ready single string.

    Prioritises the first reasoning item. If it's a scenario-detection
    boilerplate line and a second item exists with richer content,
    uses the second instead.
    """
    if not reasoning_list:
        return "No active scenario detected. All signals within normal parameters."

    # If the first item is a short scenario-detection header and there's
    # a meatier second item, prefer the second for demo clarity
    first = reasoning_list[0]
    if len(reasoning_list) > 1 and len(first) < 60 and len(reasoning_list[1]) > len(first):
        candidate = reasoning_list[1]
    else:
        candidate = first

    if len(candidate) <= max_chars:
        return candidate
    # Truncate at word boundary
    truncated = candidate[:max_chars - 3]
    if " " in truncated:
        truncated = truncated.rsplit(" ", 1)[0]
    return truncated + "..."


def brief_headline(executive_brief: str) -> str:
    """Extract the first sentence from the executive brief as a headline.

    Ensures clean sentence extraction even with complex punctuation.
    """
    if not executive_brief:
        return ""
    # Split on period followed by space, newline, or end of string
    for sep in [". ", ".\n"]:
        if sep in executive_brief:
            return executive_brief.split(sep, 1)[0] + "."
    # If single sentence (no period+space), return as-is
    if executive_brief.endswith("."):
        return executive_brief
    return executive_brief + "."
