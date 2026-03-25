"""DEEVO Cortex — Integration Layer

Stable callable entrypoints for the frontend to consume:
  - build_ui_payload_from_engine()   → shaped UI payload
  - build_settings()                 → bilingual settings payload
  - execute_unified()                → full 8-key unified engine output
  - execute_legacy()                 → legacy 3-key output (backward compat)

No framework dependency. No server logic. Pure Python callables
that the route layer (or VERCEPT adapter) can import directly.

Phase 4.1+ — Integration Layer
"""

import json
import os
from typing import Optional

from core.unified_engine import run as unified_run
from core.engine import run as legacy_run
from core.ui_payload_builder import build_ui_payload
from core.settings_builder import (
    build_settings_payload,
    build_settings_payload_bilingual,
)
from core.contracts import validate_signals


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _output_path(name: str) -> str:
    return os.path.join(_project_root(), "output", name)


# ---------------------------------------------------------------------------
# UI Payload — primary frontend entrypoint
# ---------------------------------------------------------------------------

def build_ui_payload_from_engine(
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
    locale: str = "en",
    previous_signals: Optional[dict] = None,
) -> dict:
    """Run the unified engine and shape the result for the DEEVO GCC Command Center UI.

    This is the single callable that backs POST /api/intelligence/ui.

    Args:
        signals:          Optional signal overrides. None = read canonical file.
        country_id:       GCC country filter (SA, AE, KW, QA, BH, OM, or None).
        lob:              Insurance line filter (motor, medical, property, marine, or None).
        locale:           'en' or 'ar' for label selection.
        previous_signals: Prior tick signals for delta computation.

    Returns:
        JSON-serializable dict with shaped panels:
            top_bar, signal_rail, decision_rail, propagation_panel,
            executive_brief, graph_summary, raw.
    """
    # Validate inbound signals if provided
    if signals is not None:
        ok, errors = validate_signals(signals)
        if not ok:
            raise ValueError(f"Input signal validation failed: {errors}")

    # Run unified engine (decision + graph + enrichment + brief)
    unified_output = unified_run(
        signals=signals,
        write_outputs=False,
        country_id=country_id,
        lob=lob,
        previous_signals=previous_signals,
    )

    # Shape for UI consumption
    return build_ui_payload(unified_output, locale=locale)


# ---------------------------------------------------------------------------
# Settings Payload — settings modal entrypoint
# ---------------------------------------------------------------------------

def build_settings(locale: str = "en") -> dict:
    """Build a locale-specific settings payload.

    Backs GET /api/settings?locale=en (or ar).
    """
    return build_settings_payload(locale=locale)


def build_settings_bilingual() -> dict:
    """Build the full bilingual settings payload (EN + AR in one response).

    Backs GET /api/settings when no locale is specified.
    """
    return build_settings_payload_bilingual()


# ---------------------------------------------------------------------------
# Unified Engine — full 8-key output
# ---------------------------------------------------------------------------

def execute_unified(
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
    previous_signals: Optional[dict] = None,
) -> dict:
    """Run the unified engine and return the full 8-key output.

    Backs POST /api/intelligence/run.

    Returns:
        dict with keys: simulation_result, decision_trace, decision,
        graph_state, propagation_trace, enriched_signals,
        executive_brief, signal_summary.
    """
    if signals is not None:
        ok, errors = validate_signals(signals)
        if not ok:
            raise ValueError(f"Input signal validation failed: {errors}")

    return unified_run(
        signals=signals,
        write_outputs=False,
        country_id=country_id,
        lob=lob,
        previous_signals=previous_signals,
    )


# ---------------------------------------------------------------------------
# Legacy Adapter — backward-compatible 3-key output
# ---------------------------------------------------------------------------

def execute_legacy(signals: Optional[dict] = None) -> dict:
    """Run the legacy decision engine (3-key output).

    Preserved for backward compatibility with existing VERCEPT integrations.

    Returns:
        dict with keys: simulation_result, decision_trace, decision.
    """
    if signals is not None:
        ok, errors = validate_signals(signals)
        if not ok:
            raise ValueError(f"Input signal validation failed: {errors}")

    if signals is not None:
        result = legacy_run(signals=signals, write_outputs=False)
    else:
        result = legacy_run(write_outputs=False)

    return {
        "simulation_result": result["simulation_result"],
        "decision_trace": result["decision_trace"],
        "decision": result["decision"],
    }


# ---------------------------------------------------------------------------
# Health / introspection
# ---------------------------------------------------------------------------

def health() -> dict:
    """System health check for platform integration."""
    from core.scenario_registry import detect_scenarios
    from core.settings_builder import load_scenario_presets, load_country_profiles

    presets = load_scenario_presets().get("presets", {})
    profiles = load_country_profiles().get("countries", {})

    return {
        "status": "ok",
        "version": "4.1.0",
        "entrypoints": {
            "ui_payload": "core.integration.build_ui_payload_from_engine",
            "settings": "core.integration.build_settings_bilingual",
            "unified_run": "core.integration.execute_unified",
            "legacy_run": "core.integration.execute_legacy",
        },
        "supported_decisions": ["APPROVE", "REVIEW", "ESCALATE"],
        "supported_scenarios": sorted(presets.keys()),
        "supported_countries": sorted(profiles.keys()),
        "supported_locales": ["en", "ar"],
    }


# ---------------------------------------------------------------------------
# CLI — generate runtime example outputs
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    # Generate UI payload runtime example
    ui = build_ui_payload_from_engine(locale="en")
    ui_path = _output_path("ui_payload_runtime.json")
    os.makedirs(os.path.dirname(ui_path), exist_ok=True)
    with open(ui_path, "w") as f:
        json.dump(ui, f, indent=2)
    print(f"UI payload runtime written to {ui_path}")
    print(f"  Decision: {ui['top_bar']['decision']}")
    print(f"  Signals:  {len(ui['signal_rail'])}")
    print(f"  Agents:   {len(ui['decision_rail']['agents'])}")

    # Generate settings payload runtime example
    settings = build_settings_bilingual()
    settings_path = _output_path("settings_payload_runtime.json")
    with open(settings_path, "w") as f:
        json.dump(settings, f, indent=2, ensure_ascii=False)
    print(f"Settings payload runtime written to {settings_path}")
    print(f"  Sections: {list(settings['schema']['sections'].keys())}")
    print(f"  Labels:   {len(settings['labels'])} EN / {len(settings['labels_ar'])} AR")

    # Health check
    h = health()
    print(f"Health: {h['status']} / v{h['version']}")
    print(f"  Scenarios: {h['supported_scenarios']}")
    print(f"  Countries: {h['supported_countries']}")
