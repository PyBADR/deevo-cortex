"""
DEEVO Cortex - Graph Propagator
Causal graph traversal and impact propagation
"""

from typing import List, Dict, Set, Optional, Tuple
from collections import defaultdict, deque
import math

from ...models import (
    Graph, GraphNode, GraphEdge, NodeType, EdgeType,
    NodeImpact, PathAnalysis, GraphStats
)


class GraphPropagator:
    """
    Propagates changes through the causal graph.
    Calculates impact, finds paths, and analyzes graph structure.
    """

    def __init__(self, graph: Graph):
        self.graph = graph
        self._node_map: Dict[str, GraphNode] = {n.id: n for n in graph.nodes}
        self._edge_map: Dict[str, GraphEdge] = {e.id: e for e in graph.edges}
        self._adjacency: Dict[str, List[str]] = defaultdict(list)  # node -> outgoing edges
        self._reverse_adjacency: Dict[str, List[str]] = defaultdict(list)  # node -> incoming edges
        
        self._build_adjacency()

    def _build_adjacency(self):
        """Build adjacency lists for efficient traversal."""
        for edge in self.graph.edges:
            self._adjacency[edge.source].append(edge.id)
            self._reverse_adjacency[edge.target].append(edge.id)

    def propagate_change(
        self, 
        node_id: str, 
        delta: float,
        max_depth: int = 10
    ) -> Dict[str, float]:
        """
        Propagate a value change through the graph.
        Returns map of affected node IDs to their value changes.
        """
        affected: Dict[str, float] = {node_id: delta}
        visited: Set[str] = set()
        queue: deque = deque([(node_id, delta, 0)])
        
        while queue:
            current_node, current_delta, depth = queue.popleft()
            
            if depth >= max_depth or current_node in visited:
                continue
            
            visited.add(current_node)
            
            # Get outgoing edges
            for edge_id in self._adjacency.get(current_node, []):
                edge = self._edge_map[edge_id]
                target = edge.target
                
                # Calculate propagated impact
                strength = edge.strength or 0.5
                propagated_delta = current_delta * strength
                
                # Apply edge type modifiers
                if edge.type == EdgeType.MITIGATES:
                    propagated_delta *= -0.5
                elif edge.type == EdgeType.AMPLIFIES:
                    propagated_delta *= 1.5
                elif edge.type == EdgeType.BLOCKS:
                    propagated_delta = 0
                
                if abs(propagated_delta) > 0.001:  # Threshold for significance
                    if target in affected:
                        affected[target] += propagated_delta
                    else:
                        affected[target] = propagated_delta
                    
                    queue.append((target, propagated_delta, depth + 1))
        
        return affected

    def calculate_node_impact(self, node_id: str) -> NodeImpact:
        """
        Calculate the total impact potential of a node.
        """
        # Direct impact: immediate connections
        direct_edges = self._adjacency.get(node_id, [])
        direct_impact = sum(
            abs(self._edge_map[e].strength or 0.5) 
            for e in direct_edges
        )
        
        # Indirect impact: propagated effects
        propagation = self.propagate_change(node_id, 1.0)
        indirect_impact = sum(
            abs(v) for k, v in propagation.items() 
            if k != node_id
        )
        
        affected_nodes = [k for k in propagation.keys() if k != node_id]
        
        return NodeImpact(
            node_id=node_id,
            direct_impact=direct_impact,
            indirect_impact=indirect_impact,
            total_impact=direct_impact + indirect_impact,
            affected_nodes=affected_nodes
        )

    def find_paths(
        self, 
        source: str, 
        target: str, 
        max_paths: int = 5
    ) -> PathAnalysis:
        """
        Find all paths between two nodes.
        """
        paths: List[List[str]] = []
        
        def dfs(current: str, path: List[str], visited: Set[str]):
            if len(paths) >= max_paths:
                return
            
            if current == target:
                paths.append(path.copy())
                return
            
            for edge_id in self._adjacency.get(current, []):
                edge = self._edge_map[edge_id]
                if edge.target not in visited:
                    visited.add(edge.target)
                    path.append(edge_id)
                    dfs(edge.target, path, visited)
                    path.pop()
                    visited.remove(edge.target)
        
        dfs(source, [], {source})
        
        # Calculate total strength of shortest path
        shortest_length = min(len(p) for p in paths) if paths else 0
        total_strength = 0.0
        
        if paths:
            shortest_path = min(paths, key=len)
            total_strength = 1.0
            for edge_id in shortest_path:
                total_strength *= (self._edge_map[edge_id].strength or 0.5)
        
        return PathAnalysis(
            source_node=source,
            target_node=target,
            paths=paths,
            shortest_path_length=shortest_length,
            total_strength=total_strength
        )

    def get_upstream_nodes(self, node_id: str) -> List[str]:
        """
        Get all nodes that influence this node.
        """
        upstream: Set[str] = set()
        queue: deque = deque([node_id])
        
        while queue:
            current = queue.popleft()
            for edge_id in self._reverse_adjacency.get(current, []):
                edge = self._edge_map[edge_id]
                if edge.source not in upstream:
                    upstream.add(edge.source)
                    queue.append(edge.source)
        
        return list(upstream)

    def get_downstream_nodes(self, node_id: str) -> List[str]:
        """
        Get all nodes influenced by this node.
        """
        downstream: Set[str] = set()
        queue: deque = deque([node_id])
        
        while queue:
            current = queue.popleft()
            for edge_id in self._adjacency.get(current, []):
                edge = self._edge_map[edge_id]
                if edge.target not in downstream:
                    downstream.add(edge.target)
                    queue.append(edge.target)
        
        return list(downstream)

    def calculate_stats(self) -> GraphStats:
        """
        Calculate graph statistics.
        """
        node_count = len(self.graph.nodes)
        edge_count = len(self.graph.edges)
        
        # Density
        max_edges = node_count * (node_count - 1)
        density = edge_count / max_edges if max_edges > 0 else 0
        
        # Average degree
        degrees = []
        for node in self.graph.nodes:
            out_degree = len(self._adjacency.get(node.id, []))
            in_degree = len(self._reverse_adjacency.get(node.id, []))
            degrees.append(out_degree + in_degree)
        
        avg_degree = sum(degrees) / len(degrees) if degrees else 0
        
        # Simple clustering (connected components)
        clusters = self._find_clusters()
        
        return GraphStats(
            node_count=node_count,
            edge_count=edge_count,
            density=density,
            avg_degree=avg_degree,
            clusters=clusters
        )

    def _find_clusters(self) -> List[List[str]]:
        """
        Find connected components in the graph.
        """
        visited: Set[str] = set()
        clusters: List[List[str]] = []
        
        for node in self.graph.nodes:
            if node.id not in visited:
                cluster: List[str] = []
                queue: deque = deque([node.id])
                
                while queue:
                    current = queue.popleft()
                    if current in visited:
                        continue
                    
                    visited.add(current)
                    cluster.append(current)
                    
                    # Add neighbors (both directions)
                    for edge_id in self._adjacency.get(current, []):
                        queue.append(self._edge_map[edge_id].target)
                    for edge_id in self._reverse_adjacency.get(current, []):
                        queue.append(self._edge_map[edge_id].source)
                
                if cluster:
                    clusters.append(cluster)
        
        return clusters
