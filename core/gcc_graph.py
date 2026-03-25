"""DEEVO Cortex — GCC Graph Builder

Loads GCC entities, edges, and sector profiles into an in-memory
weighted directed graph. Provides lookup and traversal primitives.
"""

import json
import os
from typing import Dict, List, Optional, Set


# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _data_path(name: str) -> str:
    return os.path.join(_project_root(), "data", name)


# ---------------------------------------------------------------------------
# Graph structure
# ---------------------------------------------------------------------------

class GCCGraph:
    """In-memory weighted directed graph for DEEVO Decision Intelligence."""

    def __init__(self, entities: dict, edges: list, sector_profiles: dict):
        self.entities = entities
        self.edges = edges
        self.sector_profiles = sector_profiles

        # Build adjacency: source -> list of edge dicts
        self._adjacency: Dict[str, List[dict]] = {}
        for edge in edges:
            src = edge["source"]
            self._adjacency.setdefault(src, []).append(edge)

        # Collect all node IDs
        self._all_nodes: Set[str] = set()
        for section in ("macro_variables", "derived_nodes"):
            if section in entities:
                self._all_nodes.update(entities[section].keys())
        for edge in edges:
            self._all_nodes.add(edge["source"])
            self._all_nodes.add(edge["target"])

    # -- Accessors ----------------------------------------------------------

    def all_node_ids(self) -> List[str]:
        return sorted(self._all_nodes)

    def outgoing_edges(self, node_id: str) -> List[dict]:
        return self._adjacency.get(node_id, [])

    def neighbors(self, node_id: str) -> List[str]:
        return [e["target"] for e in self.outgoing_edges(node_id)]

    def edge_weight(self, source: str, target: str) -> float:
        for e in self.outgoing_edges(source):
            if e["target"] == target:
                return e["weight"]
        return 0.0

    def countries(self) -> dict:
        return self.entities.get("countries", {})

    def sectors(self) -> dict:
        return self.entities.get("sectors", {})

    def insurance_lines(self) -> dict:
        return self.entities.get("insurance_lines", {})

    def get_sector_sensitivity(self, lob: str, node_id: str) -> float:
        """Return the LoB sensitivity multiplier for a node."""
        profile = self.sector_profiles.get(lob, {})
        return profile.get("sensitivity", {}).get(node_id, 1.0)

    # -- Compatibility bridge -----------------------------------------------

    def to_legacy_graph(self) -> dict:
        """Export to the format expected by simulation_engine.py."""
        nodes = sorted(self._all_nodes)
        edges_map: Dict[str, List[str]] = {}
        for edge in self.edges:
            src = edge["source"]
            tgt = edge["target"]
            edges_map.setdefault(src, [])
            if tgt not in edges_map[src]:
                edges_map[src].append(tgt)
        return {"nodes": nodes, "edges": edges_map}


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

def load_gcc_graph(
    entities_path: str = None,
    edges_path: str = None,
    profiles_path: str = None,
) -> GCCGraph:
    """Load and return a GCCGraph from JSON data files."""
    entities_path = entities_path or _data_path("gcc_entities.json")
    edges_path = edges_path or _data_path("gcc_edges.json")
    profiles_path = profiles_path or _data_path("sector_profiles.json")

    with open(entities_path) as f:
        entities = json.load(f)
    with open(edges_path) as f:
        edges_data = json.load(f)
    with open(profiles_path) as f:
        profiles = json.load(f)

    return GCCGraph(
        entities=entities,
        edges=edges_data.get("edges", edges_data),
        sector_profiles=profiles,
    )
