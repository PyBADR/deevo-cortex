"""DEEVO Cortex — Settings Builder

Assembles a complete settings payload from:
  - data/settings_schema.json
  - data/source_taxonomy.json
  - data/language_labels.json
  - data/scenario_presets.json
  - data/gcc_country_profiles.json

Returns a single JSON-serializable dict that the frontend settings
modal can consume without any further data loading.

Phase 4.1 — Intelligence Payload Layer
"""

import json
import os
from typing import Optional


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
# Loaders
# ---------------------------------------------------------------------------

def load_settings_schema() -> dict:
    return _load_json(_data_path("settings_schema.json"))


def load_source_taxonomy() -> dict:
    return _load_json(_data_path("source_taxonomy.json"))


def load_language_labels() -> dict:
    return _load_json(_data_path("language_labels.json"))


def load_scenario_presets() -> dict:
    return _load_json(_data_path("scenario_presets.json"))


def load_country_profiles() -> dict:
    return _load_json(_data_path("gcc_country_profiles.json"))


# ---------------------------------------------------------------------------
# Scenario options builder
# ---------------------------------------------------------------------------

def _build_scenario_options(presets: dict, locale: str) -> list:
    """Build scenario selector options from presets."""
    options = [{"value": None, "label": "Auto-detect" if locale == "en" else "اكتشاف تلقائي"}]
    for pid, preset in presets.get("presets", {}).items():
        label_key = f"title_{locale}"
        options.append({
            "value": pid,
            "label": preset.get(label_key, pid),
            "description": preset.get(f"description_{locale}", ""),
            "severity": preset.get("severity_range", ""),
        })
    return options


# ---------------------------------------------------------------------------
# Country options builder
# ---------------------------------------------------------------------------

def _build_country_options(profiles: dict, locale: str) -> list:
    """Build country selector options from profiles."""
    name_key = f"display_name_{locale}"
    options = [{"value": None, "label": "All GCC" if locale == "en" else "جميع دول الخليج"}]
    for cid, country in profiles.get("countries", {}).items():
        options.append({
            "value": cid,
            "label": country.get(name_key, cid),
            "oil_dependency": country.get("oil_dependency", 0),
        })
    return options


# ---------------------------------------------------------------------------
# Source options builder
# ---------------------------------------------------------------------------

def _build_source_options(taxonomy: dict, locale: str) -> list:
    """Build source selector grouped by category."""
    label_key = f"label_{locale}"
    groups = []
    for cat_id, cat in taxonomy.get("categories", {}).items():
        sources = []
        for src in cat.get("sources", []):
            sources.append({
                "id": src["id"],
                "label": src.get(label_key, src["id"]),
                "enabled": src.get("enabled_default", False),
            })
        groups.append({
            "category_id": cat_id,
            "category_label": cat.get(label_key, cat_id),
            "sources": sources,
        })
    return groups


# ---------------------------------------------------------------------------
# Defaults builder
# ---------------------------------------------------------------------------

def _extract_defaults(schema: dict) -> dict:
    """Extract default values from all settings sections."""
    defaults = {}
    for section_id, section in schema.get("sections", {}).items():
        section_defaults = {}
        fields = section.get("fields", {})
        for field_id, field in fields.items():
            if "default" in field:
                section_defaults[field_id] = field["default"]
        if section_defaults:
            defaults[section_id] = section_defaults
    return defaults


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def build_settings_payload(locale: str = "en") -> dict:
    """Build the complete settings payload for the DEEVO GCC Command Center UI.

    Args:
        locale: 'en' or 'ar'.

    Returns:
        JSON-serializable dict with:
            - schema (full settings structure)
            - labels (locale-specific UI labels)
            - scenario_options (preset list)
            - country_options (GCC country list)
            - source_options (grouped source list)
            - country_profiles (full profile data)
            - defaults (extracted default values)
    """
    schema = load_settings_schema()
    labels = load_language_labels()
    presets = load_scenario_presets()
    profiles = load_country_profiles()
    taxonomy = load_source_taxonomy()

    locale_labels = labels.get(locale, labels.get("en", {}))

    return {
        "version": "4.1.0",
        "locale": locale,
        "schema": schema,
        "labels": locale_labels,
        "scenario_options": _build_scenario_options(presets, locale),
        "country_options": _build_country_options(profiles, locale),
        "source_options": _build_source_options(taxonomy, locale),
        "country_profiles": profiles.get("countries", {}),
        "scenario_presets": presets.get("presets", {}),
        "defaults": _extract_defaults(schema),
    }


def build_settings_payload_bilingual() -> dict:
    """Build settings payload with both EN and AR labels included."""
    en = build_settings_payload("en")
    ar_labels = load_language_labels().get("ar", {})

    en["labels_ar"] = ar_labels
    en["scenario_options_ar"] = _build_scenario_options(
        load_scenario_presets(), "ar"
    )
    en["country_options_ar"] = _build_country_options(
        load_country_profiles(), "ar"
    )
    en["source_options_ar"] = _build_source_options(
        load_source_taxonomy(), "ar"
    )

    return en


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    payload = build_settings_payload_bilingual()

    out_path = os.path.join(_project_root(), "output", "settings_payload_example.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"Settings payload written to {out_path}")
    print(f"Sections: {list(payload['schema']['sections'].keys())}")
    print(f"Scenario options: {len(payload['scenario_options'])}")
    print(f"Country options: {len(payload['country_options'])}")
    print(f"Source groups: {len(payload['source_options'])}")
