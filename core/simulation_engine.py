"""DEEVO Cortex — Simulation Engine

Propagates the active scenario through the causal graph
and produces simulated impact changes.
"""

import json
import os
from collections import deque
from typing import Dict, List, Set, Union


def load_graph(path: str) -> dict:
    """Load the causal propagation graph."""
    with open(path, "r") as f:
        return json.load(f)


def propagate(graph: dict, entry_nodes: List[str]) -> List[str]:
    """BFS walk from entry nodes through graph edges.
    Returns ordered list of all impacted nodes (excluding entry)."""
    edges = graph.get("edges", {})
    visited: Set[str] = set(entry_nodes)
    queue = deque(entry_nodes)
    impact_order: List[str] = []

    while queue:
        node = queue.popleft()
        for neighbour in edges.get(node, []):
            if neighbour not in visited:
                visited.add(neighbour)
                impact_order.append(neighbour)
                queue.append(neighbour)

    return impact_order


def compute_simulated_changes(
    scenario: dict,
    signals: dict,
    impacted_domains: List[str],
) -> Dict[str, dict]:
    """For each impacted domain, estimate direction and magnitude."""
    changes: Dict[str, dict] = {}

    base_magnitude = _scenario_intensity(scenario, signals)

    depth = 0
    for domain in impacted_domains:
        depth += 1
        decay = max(0.1, 1.0 - 0.2 * depth)
        magnitude = round(base_magnitude * decay, 4)
        changes[domain] = {
            "direction": "increase",
            "magnitude": magnitude,
            "propagation_depth": depth,
        }

    return changes


def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _default_graph_path() -> str:
    return os.path.join(_project_root(), "core", "graph.json")


def _default_scenarios_path() -> str:
    return os.path.join(_project_root(), "data", "scenarios.json")


def _resolve_scenario(scenario: Union[str, dict]) -> dict:
    """Accept a scenario ID string or a scenario dict. Returns dict."""
    if isinstance(scenario, dict):
        return scenario
    # Load from registry by ID
    with open(_default_scenarios_path(), "r") as f:
        scenarios = json.load(f)
    if scenario not in scenarios:
        raise ValueError(f"Unknown scenario ID: '{scenario}'. "
                         f"Available: {sorted(scenarios.keys())}")
    return scenarios[scenario]


def simulate(scenario: Union[str, dict], signals: dict,
             graph_path: str = None) -> dict:
    """Run full simulation for a scenario. Returns simulation result dict.

    VERCEPT contract: simulate(scenario: str, signals: dict) -> dict
    Also accepts scenario as dict and optional graph_path for backward compat.
    """
    scenario_def = _resolve_scenario(scenario)
    if graph_path is None:
        graph_path = _default_graph_path()
    graph = load_graph(graph_path)

    # Entry nodes are the signal keys that triggered the scenario
    entry_nodes = list(scenario_def.get("trigger_conditions", {}).keys())

    # Map signal keys to graph node names
    node_alias = {
        "oil_price": "oil_price",
        "fraud_index": "fraud",
        "repair_cost_index": "repair_cost",
        "inflation": "inflation",
        "claims_rate": "claims",
    }
    entry_graph_nodes = [node_alias.get(k, k) for k in entry_nodes]

    impacted = propagate(graph, entry_graph_nodes)
    simulated_changes = compute_simulated_changes(scenario_def, signals, impacted)

    from core.rules import compute_scenario_severity
    severity = compute_scenario_severity(scenario_def, signals)

    all_domains = entry_graph_nodes + impacted
    graph_links_used = []
    edges = graph.get("edges", {})
    for node in all_domains:
        for target in edges.get(node, []):
            if target in all_domains:
                graph_links_used.append(f"{node} -> {target}")

    return {
        "active_scenario": scenario_def["id"],
        "impacted_domains": all_domains,
        "severity": severity,
        "simulated_changes": simulated_changes,
        "graph_links_used": graph_links_used,
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _scenario_intensity(scenario: dict, signals: dict) -> float:
    """Rough intensity based on how far signals exceed thresholds."""
    conditions = scenario.get("trigger_conditions", {})
    intensities = []
    for key, rule in conditions.items():
        value = signals.get(key, 0)
        threshold = rule["threshold"]
        if threshold != 0:
            ratio = value / threshold
            intensities.append(min(ratio, 2.0))
    return round(sum(intensities) / max(len(intensities), 1), 4)
