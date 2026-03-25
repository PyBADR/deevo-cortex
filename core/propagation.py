"""DEEVO Cortex — Weighted Propagation Engine

Performs weighted BFS propagation through the GCC decision graph.
Replaces the flat (unweighted) propagation in simulation_engine.py
with context-aware, sector-adjusted impact propagation.
"""

import json
import os
from collections import deque
from typing import Dict, List, Optional, Set

from core.gcc_graph import load_gcc_graph, GCCGraph
from core.graph_weights import compute_dynamic_weight


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _output_path(name: str) -> str:
    return os.path.join(_project_root(), "output", name)


# ---------------------------------------------------------------------------
# Propagation result
# ---------------------------------------------------------------------------

class PropagationResult:
    """Container for a completed propagation run."""

    def __init__(self):
        self.root_signals: List[str] = []
        self.traversal_path: List[dict] = []
        self.impacted_nodes: List[str] = []
        self.node_pressures: Dict[str, float] = {}
        self.affected_countries: List[str] = []
        self.affected_sectors: List[str] = []
        self.affected_lines: List[str] = []

    def to_graph_state(self) -> dict:
        return {
            "active_nodes": self.impacted_nodes,
            "affected_countries": self.affected_countries,
            "affected_sectors": self.affected_sectors,
            "affected_insurance_lines": self.affected_lines,
            "weighted_impacts": self.node_pressures,
        }

    def to_propagation_trace(self) -> dict:
        return {
            "root_signal": self.root_signals,
            "traversal_path": self.traversal_path,
            "edge_weights_used": [
                {
                    "from": step["from"],
                    "to": step["to"],
                    "weight": step["weight"],
                }
                for step in self.traversal_path
            ],
            "impacted_nodes_in_order": self.impacted_nodes,
            "final_pressure_summary": self.node_pressures,
        }


# ---------------------------------------------------------------------------
# Propagation engine
# ---------------------------------------------------------------------------

MIN_PROPAGATION_THRESHOLD = 0.05


def propagate_weighted(
    entry_signals: Dict[str, float],
    graph: GCCGraph,
    signals: dict,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
) -> PropagationResult:
    """Weighted BFS propagation from entry signal nodes.

    Args:
        entry_signals: {node_id: initial_pressure} for root nodes.
        graph: Loaded GCCGraph instance.
        signals: Current signal values dict.
        country_id: Optional GCC country for weight adjustment.
        lob: Optional insurance line for sector sensitivity.

    Returns:
        PropagationResult with full trace.
    """
    result = PropagationResult()
    result.root_signals = list(entry_signals.keys())

    # Node pressures accumulate
    pressures: Dict[str, float] = dict(entry_signals)
    visited_edges: Set[str] = set()

    # BFS queue: (node_id, incoming_pressure)
    queue = deque()
    for node_id, pressure in entry_signals.items():
        queue.append((node_id, pressure))

    visited_nodes: Set[str] = set(entry_signals.keys())

    while queue:
        current, incoming_pressure = queue.popleft()

        for edge in graph.outgoing_edges(current):
            target = edge["target"]
            edge_key = f"{current}->{target}"

            # Compute dynamic weight
            dw = compute_dynamic_weight(
                base_weight=edge["weight"],
                source_id=current,
                signals=signals,
                entities=graph.entities,
                country_id=country_id,
                lob=lob,
                sector_profiles=graph.sector_profiles,
            )

            # Transmitted pressure
            transmitted = round(incoming_pressure * dw, 4)

            # Record traversal step (even for revisited edges with new pressure)
            if edge_key not in visited_edges:
                result.traversal_path.append({
                    "from": current,
                    "to": target,
                    "weight": dw,
                    "transmitted_pressure": transmitted,
                    "relation_type": edge.get("relation_type", "unknown"),
                })
                visited_edges.add(edge_key)

            # Accumulate pressure at target
            prev = pressures.get(target, 0.0)
            pressures[target] = round(prev + transmitted, 4)

            # Continue propagation if above threshold and not yet queued
            if abs(transmitted) >= MIN_PROPAGATION_THRESHOLD and target not in visited_nodes:
                visited_nodes.add(target)
                queue.append((target, transmitted))

    # Build result
    result.node_pressures = {k: round(v, 4) for k, v in pressures.items()}
    result.impacted_nodes = [
        n for n in pressures
        if n not in entry_signals and abs(pressures[n]) >= MIN_PROPAGATION_THRESHOLD
    ]

    # Determine affected countries/sectors/lines
    _resolve_affected_dimensions(result, graph, pressures)

    return result


# ---------------------------------------------------------------------------
# Dimension resolution
# ---------------------------------------------------------------------------

def _resolve_affected_dimensions(
    result: PropagationResult,
    graph: GCCGraph,
    pressures: Dict[str, float],
) -> None:
    """Determine which countries, sectors, and lines are affected."""
    # Countries: all GCC countries affected proportionally to oil dependency
    # if any macro variable has significant pressure
    macro_ids = set(graph.entities.get("macro_variables", {}).keys())
    macro_pressure = sum(abs(pressures.get(m, 0)) for m in macro_ids)

    if macro_pressure > 0.1:
        countries = graph.countries()
        result.affected_countries = sorted(countries.keys())
    else:
        result.affected_countries = []

    # Sectors: affected if any node in their domain has pressure
    sector_map = graph.sectors()
    oil_nodes = {"oil_price", "supply_chain_stress", "repair_cost_index"}
    insurance_nodes = {"claims", "fraud", "loss_ratio", "reserves", "pricing",
                       "investigation", "reinsurance_cost"}
    finance_nodes = {"interest_rate", "inflation"}

    active = {n for n, p in pressures.items() if abs(p) >= MIN_PROPAGATION_THRESHOLD}
    affected_sectors = set()

    if active & oil_nodes:
        affected_sectors.update(["energy", "logistics"])
    if active & insurance_nodes:
        affected_sectors.add("insurance")
    if active & finance_nodes:
        affected_sectors.update(["banking", "retail"])
    if "inflation" in active:
        affected_sectors.add("healthcare")

    result.affected_sectors = sorted(affected_sectors & set(sector_map.keys()))

    # Insurance lines: all lines affected if any insurance node is active
    if "insurance" in affected_sectors:
        result.affected_lines = sorted(graph.insurance_lines().keys())
    else:
        result.affected_lines = []


# ---------------------------------------------------------------------------
# High-level runner (standalone use)
# ---------------------------------------------------------------------------

def run_propagation(
    signals: dict,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
    write_outputs: bool = True,
) -> PropagationResult:
    """Load graph, detect entry pressures from signals, propagate, write outputs.

    Args:
        signals: Current signal values dict.
        country_id: Optional GCC country code (SA, AE, KW, QA, BH, OM).
        lob: Optional insurance line (motor, medical, property, marine).
        write_outputs: If True, writes graph_state.json and propagation_trace.json.

    Returns:
        PropagationResult.
    """
    graph = load_gcc_graph()

    # Build entry pressures from signals that deviate above baseline
    macro_vars = graph.entities.get("macro_variables", {})
    entry_signals: Dict[str, float] = {}

    for node_id, meta in macro_vars.items():
        signal_key = meta.get("signal_key", node_id)
        baseline = meta.get("baseline", 0)
        current = signals.get(signal_key)
        if current is None:
            continue
        if baseline == 0:
            deviation = min(abs(current), 2.0)
        else:
            deviation = (current - baseline) / abs(baseline)
        if deviation > 0.05:
            entry_signals[node_id] = round(min(deviation, 2.0), 4)

    if not entry_signals:
        # No significant signal deviation — return empty result
        result = PropagationResult()
        if write_outputs:
            _write_outputs(result)
        return result

    result = propagate_weighted(
        entry_signals=entry_signals,
        graph=graph,
        signals=signals,
        country_id=country_id,
        lob=lob,
    )

    if write_outputs:
        _write_outputs(result)

    return result


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def _write_outputs(result: PropagationResult) -> None:
    os.makedirs(os.path.dirname(_output_path("graph_state.json")), exist_ok=True)
    with open(_output_path("graph_state.json"), "w") as f:
        json.dump(result.to_graph_state(), f, indent=2)
    with open(_output_path("propagation_trace.json"), "w") as f:
        json.dump(result.to_propagation_trace(), f, indent=2)
