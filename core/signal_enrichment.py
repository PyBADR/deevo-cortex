"""DEEVO Cortex — Signal Enrichment

Transforms raw flat signal values into enriched signal objects with:
  - value (current reading)
  - baseline (expected normal)
  - delta (signed change from baseline)
  - direction (up / down / stable)
  - deviation (normalised 0..2)
  - category (macro / insurance / risk / context)
  - severity (low / moderate / high / critical)
  - timestamp

Phase 4 — Live Intelligence Layer
"""

from datetime import datetime, timezone
from typing import Dict, Optional


# ---------------------------------------------------------------------------
# Signal metadata registry
# ---------------------------------------------------------------------------

SIGNAL_REGISTRY = {
    # Macro-economic signals
    "oil_price": {
        "label": "Oil Price (Brent)",
        "unit": "USD/barrel",
        "baseline": 85.0,
        "category": "macro",
        "thresholds": {"moderate": 95, "high": 110, "critical": 130},
    },
    "inflation": {
        "label": "CPI Inflation Rate",
        "unit": "percent",
        "baseline": 2.5,
        "category": "macro",
        "thresholds": {"moderate": 3.5, "high": 5.0, "critical": 7.0},
    },
    "interest_rate": {
        "label": "Central Bank Rate",
        "unit": "percent",
        "baseline": 5.0,
        "category": "macro",
        "thresholds": {"moderate": 6.0, "high": 7.5, "critical": 9.0},
    },
    "supply_chain_stress": {
        "label": "Supply Chain Stress Index",
        "unit": "index",
        "baseline": 0.3,
        "category": "macro",
        "thresholds": {"moderate": 0.5, "high": 0.7, "critical": 0.9},
    },
    # Insurance signals
    "claims_rate": {
        "label": "Claims Frequency",
        "unit": "ratio",
        "baseline": 0.35,
        "category": "insurance",
        "thresholds": {"moderate": 0.5, "high": 0.7, "critical": 0.85},
    },
    "repair_cost_index": {
        "label": "Repair Cost Index",
        "unit": "index",
        "baseline": 1.0,
        "category": "insurance",
        "thresholds": {"moderate": 1.2, "high": 1.5, "critical": 1.8},
    },
    # Risk signals
    "fraud_index": {
        "label": "Fraud Alert Index",
        "unit": "index",
        "baseline": 0.3,
        "category": "risk",
        "thresholds": {"moderate": 0.5, "high": 0.7, "critical": 0.85},
    },
    # Context signals (non-numeric, pass-through)
    "currency_volatility": {
        "label": "Currency Volatility",
        "unit": "index",
        "baseline": 0.05,
        "category": "context",
        "thresholds": {"moderate": 0.08, "high": 0.12, "critical": 0.20},
    },
}

# Non-numeric keys to skip enrichment
_PASSTHROUGH_KEYS = {"region", "timestamp", "currency", "source"}


# ---------------------------------------------------------------------------
# Core enrichment
# ---------------------------------------------------------------------------

def _compute_deviation(value: float, baseline: float) -> float:
    """Normalised deviation from baseline (0..2, capped)."""
    if baseline == 0:
        return min(abs(value), 2.0)
    ratio = (value - baseline) / abs(baseline)
    return round(max(0.0, min(ratio, 2.0)), 4)


def _compute_severity(value: float, thresholds: dict) -> str:
    """Map value to severity level using threshold ladder."""
    if value >= thresholds.get("critical", float("inf")):
        return "critical"
    if value >= thresholds.get("high", float("inf")):
        return "high"
    if value >= thresholds.get("moderate", float("inf")):
        return "moderate"
    return "low"


def _direction(delta: float) -> str:
    if delta > 0.001:
        return "up"
    elif delta < -0.001:
        return "down"
    return "stable"


def enrich_signal(
    key: str,
    value: float,
    previous_value: Optional[float] = None,
    ts: Optional[str] = None,
) -> dict:
    """Enrich a single signal value into a full signal object.

    Args:
        key: Signal key name.
        value: Current signal value.
        previous_value: Previous reading (for delta). Defaults to baseline.
        ts: ISO timestamp string. Defaults to now.

    Returns:
        Enriched signal dict.
    """
    meta = SIGNAL_REGISTRY.get(key, {})
    baseline = meta.get("baseline", 0)
    label = meta.get("label", key)
    unit = meta.get("unit", "")
    category = meta.get("category", "unknown")
    thresholds = meta.get("thresholds", {})

    ref = previous_value if previous_value is not None else baseline
    delta = round(value - ref, 4)
    deviation = _compute_deviation(value, baseline)
    severity = _compute_severity(value, thresholds)

    return {
        "value": value,
        "baseline": baseline,
        "delta": delta,
        "direction": _direction(delta),
        "deviation": deviation,
        "category": category,
        "severity": severity,
        "label": label,
        "unit": unit,
        "timestamp": ts or datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Batch enrichment
# ---------------------------------------------------------------------------

def enrich_signals(
    signals: dict,
    previous_signals: Optional[dict] = None,
    ts: Optional[str] = None,
) -> dict:
    """Enrich all numeric signals in a signal dict.

    Non-numeric keys (region, timestamp) are preserved as-is
    under a 'metadata' wrapper.

    Args:
        signals: Raw signal dict (flat key→value).
        previous_signals: Previous signal dict for delta computation.
        ts: ISO timestamp to stamp on each enriched signal.

    Returns:
        dict keyed by signal name → enriched signal object,
        plus a '_metadata' key for pass-through fields.
    """
    ts = ts or datetime.now(timezone.utc).isoformat()
    prev = previous_signals or {}
    enriched = {}

    for key, value in signals.items():
        if key in _PASSTHROUGH_KEYS or not isinstance(value, (int, float)):
            continue
        prev_val = prev.get(key)
        enriched[key] = enrich_signal(key, value, previous_value=prev_val, ts=ts)

    # Attach metadata for non-numeric pass-through fields
    metadata = {k: v for k, v in signals.items() if k in _PASSTHROUGH_KEYS}
    if metadata:
        enriched["_metadata"] = metadata

    return enriched


# ---------------------------------------------------------------------------
# Signal summary (for brief generation)
# ---------------------------------------------------------------------------

def signal_summary(enriched: dict) -> dict:
    """Produce a compact summary of enriched signals.

    Returns:
        {
            "elevated_count": int,
            "critical_signals": [str],
            "high_signals": [str],
            "top_movers": [{key, delta, direction}],
        }
    """
    critical = []
    high = []
    movers = []

    for key, sig in enriched.items():
        if key.startswith("_"):
            continue
        sev = sig.get("severity", "low")
        if sev == "critical":
            critical.append(key)
        elif sev == "high":
            high.append(key)

        movers.append({
            "key": key,
            "label": sig.get("label", key),
            "delta": sig.get("delta", 0),
            "direction": sig.get("direction", "stable"),
            "severity": sev,
        })

    # Sort by absolute delta descending
    movers.sort(key=lambda m: abs(m["delta"]), reverse=True)

    return {
        "elevated_count": len(critical) + len(high),
        "critical_signals": critical,
        "high_signals": high,
        "top_movers": movers[:5],
    }
