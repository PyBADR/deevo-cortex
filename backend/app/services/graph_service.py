"""
DEEVO Cortex - Graph Service
Service layer wrapping COWORK's local graph engine.

This service does NOT implement graph logic.
It wraps and exposes the local graph engine from COWORK.
"""

import sys
from pathlib import Path
from typing import Optional, Dict, Any, List
from dataclasses import dataclass

# ============================================
# PATH SETUP FOR COWORK ENGINE
# ============================================

CORE_PATH = Path(__file__).parent.parent.parent.parent / "core"
sys.path.insert(0, str(CORE_PATH))

# ============================================
# SERVICE RESPONSE TYPES
# ============================================

@dataclass
class GraphState:
    """Graph state from COWORK engine."""
    graph_id: str
    timestamp: str
    node_count: int
    edge_count: int
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    metadata: Dict[str, Any]

@dataclass
class PropagationResult:
    """Propagation result from COWORK engine."""
    propagation_id: str
    source_node: str
    impulse: float
    affected_nodes: List[Dict[str, Any]]
    propagation_trace: Optional[List[Dict[str, Any]]]
    summary: Dict[str, Any]

@dataclass
class ServiceHealth:
    """Service health status."""
    ready: bool
    adapter_available: bool
    graph_loaded: bool
    version: Optional[str]

# ============================================
# GRAPH SERVICE
# ============================================

class GraphService:
    """
    Service layer for GCC decision graph.
    
    Wraps COWORK's local graph engine.
    Does NOT implement graph logic inline.
    """
    
    def __init__(self):
        self._adapter = None
        self._load_adapter()
    
    def _load_adapter(self):
        """Load COWORK's graph adapter."""
        try:
            from graph_adapter import (
                get_graph_state,
                propagate,
                health as graph_health
            )
            self._adapter = {
                'get_state': get_graph_state,
                'propagate': propagate,
                'health': graph_health
            }
        except ImportError as e:
            print(f"[WARN] COWORK graph adapter not available: {e}")
            self._adapter = None
    
    @property
    def is_available(self) -> bool:
        """Check if COWORK adapter is loaded."""
        return self._adapter is not None
    
    # ============================================
    # PRIMARY METHODS
    # ============================================
    
    def get_state(self) -> GraphState:
        """
        Get current graph state from COWORK engine.
        
        Returns:
            GraphState with nodes, edges, and metadata
        
        Raises:
            RuntimeError if adapter unavailable
        """
        if not self.is_available:
            raise RuntimeError("Graph adapter not available")
        
        try:
            result = self._adapter['get_state']()
            return GraphState(
                graph_id=result.get('graph_id', 'gcc-graph'),
                timestamp=result.get('timestamp', ''),
                node_count=result.get('node_count', 0),
                edge_count=result.get('edge_count', 0),
                nodes=result.get('nodes', []),
                edges=result.get('edges', []),
                metadata=result.get('metadata', {})
            )
        except Exception as e:
            raise RuntimeError(f"Failed to get graph state: {e}")
    
    def propagate(
        self,
        source_node: str,
        impulse: float,
        max_depth: int = 5,
        decay_factor: float = 0.8,
        include_trace: bool = True
    ) -> PropagationResult:
        """
        Run propagation through the graph from COWORK engine.
        
        Args:
            source_node: Node ID to start propagation
            impulse: Change magnitude (-1 to 1)
            max_depth: Maximum propagation depth
            decay_factor: Weight decay per hop
            include_trace: Include step-by-step trace
        
        Returns:
            PropagationResult with affected nodes and trace
        
        Raises:
            RuntimeError if adapter unavailable or propagation fails
        """
        if not self.is_available:
            raise RuntimeError("Graph adapter not available")
        
        # Validate impulse
        if impulse < -1 or impulse > 1:
            raise ValueError("Impulse must be between -1 and 1")
        
        try:
            result = self._adapter['propagate'](
                source_node=source_node,
                impulse=impulse,
                max_depth=max_depth,
                decay_factor=decay_factor,
                include_trace=include_trace
            )
            return PropagationResult(
                propagation_id=result.get('propagation_id', ''),
                source_node=source_node,
                impulse=impulse,
                affected_nodes=result.get('affected_nodes', []),
                propagation_trace=result.get('propagation_trace') if include_trace else None,
                summary=result.get('summary', {})
            )
        except Exception as e:
            raise RuntimeError(f"Propagation failed: {e}")
    
    def health(self) -> ServiceHealth:
        """
        Check graph service health.
        
        Returns:
            ServiceHealth with readiness status
        """
        if not self.is_available:
            return ServiceHealth(
                ready=False,
                adapter_available=False,
                graph_loaded=False,
                version=None
            )
        
        try:
            result = self._adapter['health']()
            return ServiceHealth(
                ready=result.get('ready', False),
                adapter_available=True,
                graph_loaded=result.get('graph_loaded', False),
                version=result.get('version')
            )
        except Exception:
            return ServiceHealth(
                ready=False,
                adapter_available=True,
                graph_loaded=False,
                version=None
            )

# ============================================
# SINGLETON INSTANCE
# ============================================

_graph_service: Optional[GraphService] = None

def get_graph_service() -> GraphService:
    """Get singleton graph service instance."""
    global _graph_service
    if _graph_service is None:
        _graph_service = GraphService()
    return _graph_service
