"""DEEVO Cortex — Demo Runner

Executes curated demo scenarios through the integration layer
and produces polished, UI-ready payloads with narrative overlays.

Each demo payload includes:
  - Full UI payload (top_bar, signal_rail, decision_rail, etc.)
  - Demo metadata (title, narrative, talking points, country highlight)
  - Country highlight card for the focal country

No core logic changes. This is a shaping and orchestration layer only.

Phase 4.3 — Demo Data + Narrative Control
"""

import json
import os
from typing import Optional

from core.integration import build_ui_payload_from_engine
from core.visual_enrichment import (
    headline_summary as _raw_headline,
    short_reasoning as _raw_short_reasoning,
)


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _data_path(name: str) -> str:
    return os.path.join(_project_root(), "data", name)


def _output_path(name: str) -> str:
    return os.path.join(_project_root(), "output", name)


def _load_json(path: str) -> dict:
    with open(path, "r") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Data loaders
# ---------------------------------------------------------------------------

def load_demo_scenarios() -> dict:
    return _load_json(_data_path("demo_scenarios.json"))


def load_country_highlights() -> dict:
    return _load_json(_data_path("country_highlights.json"))


# ---------------------------------------------------------------------------
# Country highlight card
# ---------------------------------------------------------------------------

def _country_card(country_id: str, locale: str = "en", demo_id: str = "") -> dict:
    """Build a display-ready country highlight card.

    If demo_id is provided, includes scenario-specific cues from
    the country's scenario_cues dict.
    """
    highlights = load_country_highlights().get("highlights", {})
    country = highlights.get(country_id)
    if not country:
        return {"id": country_id, "available": False}

    name_key = f"display_name_{locale}"
    role_key = f"strategic_role_{locale}"
    risk_key = f"risk_role_{locale}"
    demo_key = f"demo_highlight_{locale}"
    sig_key = f"risk_signature_{locale}"
    metric_key = f"key_metric_{locale}"

    card = {
        "id": country_id,
        "display_name": country.get(name_key, country_id),
        "flag_emoji": country.get("flag_emoji", ""),
        "strategic_role": country.get(role_key, ""),
        "risk_role": country.get(risk_key, ""),
        "risk_signature": country.get(sig_key, ""),
        "key_metric": country.get(metric_key, ""),
        "insurance_market_gwp": country.get("insurance_market_gwp", ""),
        "sector_emphasis": country.get("sector_emphasis", []),
        "oil_dependency": country.get("oil_dependency", 0),
        "demo_highlight": country.get(demo_key, ""),
        "available": True,
    }

    # Attach scenario-specific cue if available
    cues = country.get("scenario_cues", {})
    if demo_id and demo_id in cues:
        card["scenario_cue"] = cues[demo_id]

    return card


# ---------------------------------------------------------------------------
# Narrative overlay
# ---------------------------------------------------------------------------

def _build_demo_narrative(demo: dict, locale: str = "en") -> dict:
    """Shape the demo-specific narrative overlay."""
    title_key = f"title_{locale}"
    narrative_key = f"narrative_{locale}"
    headline_key = f"headline_summary" if locale == "en" else "headline_summary_ar"

    result = {
        "title": demo.get(title_key, demo.get("id", "")),
        "headline": demo.get(headline_key, ""),
        "narrative": demo.get(narrative_key, ""),
        "expected_decision": demo.get("expected_decision", ""),
        "dominant_signals": demo.get("dominant_signals", []),
        "country_focus": demo.get("country_focus", ""),
        "country_focus_label": demo.get("country_focus_label", ""),
        "talking_points": demo.get("demo_talking_points", []),
    }

    # Attach demo KPIs if available (before/after snapshots for presenters)
    if "demo_kpi" in demo:
        result["kpi"] = demo["demo_kpi"]

    return result


# ---------------------------------------------------------------------------
# Demo headline override
# ---------------------------------------------------------------------------

def _override_headline(ui_payload: dict, demo: dict, locale: str = "en") -> dict:
    """Replace generic headlines with curated demo headlines for maximum
    presentation impact. Applies to top_bar and decision_rail.

    This is additive — original fields are preserved alongside overrides.
    """
    headline_key = "headline_summary" if locale == "en" else "headline_summary_ar"
    curated_headline = demo.get(headline_key, "")

    if curated_headline:
        # Top bar
        ui_payload["top_bar"]["demo_headline"] = curated_headline
        # Decision rail
        ui_payload["decision_rail"]["demo_headline"] = curated_headline

    # Strengthen short_reasoning with narrative first sentence
    narrative_key = f"narrative_{locale}"
    narrative = demo.get(narrative_key, "")
    if narrative:
        # Extract first sentence as demo-quality short reasoning
        first_sentence = narrative.split(". ")[0] + "." if ". " in narrative else narrative
        if len(first_sentence) > 140:
            first_sentence = first_sentence[:137] + "..."
        ui_payload["decision_rail"]["demo_short_reasoning"] = first_sentence

    return ui_payload


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_demo(
    demo_id: str,
    locale: str = "en",
    country_id: Optional[str] = None,
) -> dict:
    """Execute a curated demo scenario and produce a presentation-ready payload.

    Args:
        demo_id:    Key from data/demo_scenarios.json (e.g., 'oil_spike').
        locale:     'en' or 'ar'.
        country_id: Override for country filter. If None, uses demo's country_focus.

    Returns:
        dict with keys:
            - demo_meta: narrative overlay, talking points, country highlight
            - ui_payload: full shaped UI payload from integration layer
            - country_card: focal country highlight card
    """
    demos = load_demo_scenarios().get("demos", {})
    demo = demos.get(demo_id)
    if not demo:
        available = sorted(demos.keys())
        raise ValueError(f"Unknown demo_id '{demo_id}'. Available: {available}")

    # Resolve country focus
    focus_country = country_id or demo.get("country_focus")

    # Run through integration layer with curated signal overrides
    ui_payload = build_ui_payload_from_engine(
        signals=demo["signal_overrides"],
        country_id=focus_country,
        locale=locale,
    )

    # Apply narrative overlays (additive)
    ui_payload = _override_headline(ui_payload, demo, locale)

    # Build demo metadata
    demo_meta = _build_demo_narrative(demo, locale)

    # Build country highlight card with scenario-specific cue
    country_card = _country_card(focus_country, locale, demo_id=demo_id) if focus_country else {}

    return {
        "version": "4.3.1",
        "demo_id": demo_id,
        "locale": locale,
        "demo_meta": demo_meta,
        "country_card": country_card,
        "ui_payload": ui_payload,
    }


def list_demos(locale: str = "en") -> list:
    """List available demo scenarios with title and headline."""
    demos = load_demo_scenarios().get("demos", {})
    title_key = f"title_{locale}"
    headline_key = "headline_summary" if locale == "en" else "headline_summary_ar"

    return [
        {
            "id": did,
            "title": d.get(title_key, did),
            "headline": d.get(headline_key, ""),
            "expected_decision": d.get("expected_decision", ""),
            "country_focus": d.get("country_focus", ""),
        }
        for did, d in demos.items()
    ]


# ---------------------------------------------------------------------------
# CLI — generate demo payload outputs
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    os.makedirs(_output_path(""), exist_ok=True)

    targets = ["oil_spike", "fraud_surge", "supply_chain_break", "repair_cost_inflation", "geopolitical_escalation"]

    for demo_id in targets:
        print(f"\n=== Running demo: {demo_id} ===")
        result = run_demo(demo_id, locale="en")

        filename = f"demo_payload_{demo_id}.json"
        path = _output_path(filename)
        with open(path, "w") as f:
            json.dump(result, f, indent=2)

        ui = result["ui_payload"]
        meta = result["demo_meta"]
        card = result["country_card"]

        print(f"  Written: {filename}")
        print(f"  Title: {meta['title']}")
        print(f"  Decision: {ui['top_bar']['decision']}")
        print(f"  Expected: {meta['expected_decision']}")
        print(f"  Risk: {ui['top_bar']['risk_score']}")
        print(f"  Signals: {len(ui['signal_rail'])}")
        print(f"  Country: {card.get('display_name', 'N/A')}")
        print(f"  Headline: {meta['headline'][:80]}...")
        if "kpi" in meta:
            kpi_keys = list(meta["kpi"].keys())[:3]
            kpi_str = ", ".join(f"{k}: {meta['kpi'][k]['delta_pct']}" for k in kpi_keys)
            print(f"  KPIs: {kpi_str}")
        if card.get("risk_signature"):
            print(f"  Signature: {card['risk_signature'][:60]}...")
        if card.get("scenario_cue"):
            print(f"  Cue: {card['scenario_cue'][:60]}...")

    print(f"\nAll {len(targets)} demo payloads generated.")
