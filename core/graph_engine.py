"""DEEVO Cortex — Graph Engine Wrapper

Thin wrapper exposing existing GCC graph modules through clean functions.
No new logic — delegates entirely to gcc_graph.py, graph_weights.py,
and propagation.py.

VERCEPT contract:
    get_graph_state(signals, country_id?, lob?) -> dict
    propagate(source, value?, signals?, country_id?, lob?) -> dict
"""

import json
import os
from typing import Optional

from core.gcc_graph import load_gcc_graph
from core.propagation import run_propagation, propagate_weighted, PropagationResult


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _data_path(name: str) -> str:
    return os.path.join(_project_root(), "data", name)


def _default_signals() -> dict:
    with open(_data_path("signals.json")) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# get_graph_state
# ---------------------------------------------------------------------------

def get_graph_state(
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
) -> dict:
    """Return the current graph state as a JSON-serializable dict.

    Runs full propagation from current signals and returns:
        - active_nodes
        - affected_countries
        - affected_sectors
        - affected_insurance_lines
        - weighted_impacts

    Args:
        signals: Optional signals dict. Defaults to canonical data/signals.json.
        country_id: Optional GCC country code.
        lob: Optional insurance line of business.
    """
    if signals is None:
        signals = _default_signals()

    result = run_propagation(
        signals=signals,
        country_id=country_id,
        lob=lob,
        write_outputs=False,
    )
    return result.to_graph_state()


# ---------------------------------------------------------------------------
# propagate
# ---------------------------------------------------------------------------

def propagate(
    source: str,
    value: Optional[float] = None,
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
) -> dict:
    """Propagate impact from a single source node.

    Args:
        source: Node ID to propagate from (e.g. "oil_price").
        value: Optional initial pressure value. If None, computed
               from signal deviation above baseline.
        signals: Optional signals dict. Defaults to canonical file.
        country_id: Optional GCC country code.
        lob: Optional insurance line of business.

    Returns:
        dict with keys: graph_state, propagation_trace
    """
    if signals is None:
        signals = _default_signals()

    graph = load_gcc_graph()

    # Determine initial pressure
    if value is not None:
        entry_pressure = value
    else:
        macro_vars = graph.entities.get("macro_variables", {})
        meta = macro_vars.get(source, {})
        signal_key = meta.get("signal_key", source)
        baseline = meta.get("baseline", 0)
        current = signals.get(signal_key, baseline)
        if baseline == 0:
            entry_pressure = min(abs(current), 2.0)
        else:
            entry_pressure = max(0.0, min((current - baseline) / abs(baseline), 2.0))

    entry_signals = {source: round(entry_pressure, 4)}

    result = propagate_weighted(
        entry_signals=entry_signals,
        graph=graph,
        signals=signals,
        country_id=country_id,
        lob=lob,
    )

    return {
        "graph_state": result.to_graph_state(),
        "propagation_trace": result.to_propagation_trace(),
    }
