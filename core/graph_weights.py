"""DEEVO Cortex — Graph Weight Engine

Computes dynamic edge weights based on:
  - base graph weight
  - signal deviation from baseline
  - country oil dependency
  - sector sensitivity (per LoB)
"""

from typing import Dict, Optional


# ---------------------------------------------------------------------------
# Signal deviation
# ---------------------------------------------------------------------------

def signal_deviation(value: float, baseline: float) -> float:
    """How far a signal has deviated from its baseline (0..2 capped).

    Returns 0.0 if at or below baseline, up to 2.0 for extreme deviation.
    """
    if baseline == 0:
        return min(abs(value), 2.0)
    ratio = (value - baseline) / abs(baseline)
    return max(0.0, min(ratio, 2.0))


# ---------------------------------------------------------------------------
# Dynamic weight computation
# ---------------------------------------------------------------------------

def compute_dynamic_weight(
    base_weight: float,
    source_id: str,
    signals: dict,
    entities: dict,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
    sector_profiles: Optional[dict] = None,
) -> float:
    """Compute a context-adjusted edge weight.

    Adjustments applied (multiplicative):
      1. Signal deviation amplifier (1.0 + 0.3 * deviation)
      2. Country oil dependency factor (if country provided)
      3. LoB sector sensitivity (if lob provided)

    Returns adjusted weight capped at [-1.0, 1.0].
    """
    weight = base_weight

    # 1. Signal deviation amplifier
    macro_vars = entities.get("macro_variables", {})
    if source_id in macro_vars:
        meta = macro_vars[source_id]
        signal_key = meta.get("signal_key", source_id)
        baseline = meta.get("baseline", 0)
        current = signals.get(signal_key, baseline)
        dev = signal_deviation(current, baseline)
        weight *= (1.0 + 0.3 * dev)

    # 2. Country oil dependency
    if country_id:
        countries = entities.get("countries", {})
        country = countries.get(country_id, {})
        oil_dep = country.get("oil_dependency", 0.5)
        # Amplify for oil-dependent nations when source is oil-linked
        if source_id in ("oil_price", "supply_chain_stress"):
            weight *= (0.7 + 0.6 * oil_dep)

    # 3. LoB sector sensitivity
    if lob and sector_profiles:
        profile = sector_profiles.get(lob, {})
        sensitivity = profile.get("sensitivity", {}).get(source_id, 1.0)
        weight *= sensitivity

    # Cap
    return max(-1.0, min(1.0, round(weight, 4)))


# ---------------------------------------------------------------------------
# Batch: compute all edge weights for a scenario
# ---------------------------------------------------------------------------

def compute_all_weights(
    edges: list,
    signals: dict,
    entities: dict,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
    sector_profiles: Optional[dict] = None,
) -> Dict[str, Dict[str, float]]:
    """Return {source: {target: dynamic_weight}} for all edges."""
    result: Dict[str, Dict[str, float]] = {}
    for edge in edges:
        src = edge["source"]
        tgt = edge["target"]
        dw = compute_dynamic_weight(
            base_weight=edge["weight"],
            source_id=src,
            signals=signals,
            entities=entities,
            country_id=country_id,
            lob=lob,
            sector_profiles=sector_profiles,
        )
        result.setdefault(src, {})[tgt] = dw
    return result
