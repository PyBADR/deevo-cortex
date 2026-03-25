"""
DEEVO Cortex - Graph API Routes
API layer for GCC decision graph.

Routes:
    GET  /api/graph/state     - Get current graph state
    POST /api/graph/propagate - Run propagation
    GET  /api/graph/health    - Check graph service health

This route layer wraps the GraphService.
It does NOT implement graph logic.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.graph_service import get_graph_service

router = APIRouter(prefix="/graph", tags=["graph"])

# ============================================
# REQUEST SCHEMAS
# ============================================

class PropagateRequest(BaseModel):
    """POST /api/graph/propagate request body."""
    source_node: str = Field(..., description="Node ID to start propagation")
    impulse: float = Field(..., ge=-1, le=1, description="Change magnitude (-1 to 1)")
    max_depth: int = Field(5, ge=1, le=10, description="Max propagation depth")
    decay_factor: float = Field(0.8, ge=0, le=1, description="Weight decay per hop")
    include_trace: bool = Field(True, description="Include propagation trace")

# ============================================
# RESPONSE SCHEMAS
# ============================================

class NodeResponse(BaseModel):
    """Graph node in response."""
    id: str
    type: str
    label: str
    value: float
    weight: float
    metadata: Optional[Dict[str, Any]] = None

class EdgeResponse(BaseModel):
    """Graph edge in response."""
    id: str
    source: str
    target: str
    type: str
    weight: float
    direction: str
    metadata: Optional[Dict[str, Any]] = None

class GraphMetadataResponse(BaseModel):
    """Graph metadata."""
    version: str
    last_updated: str
    source: str
    region: str

class GraphStateResponse(BaseModel):
    """GET /api/graph/state response."""
    graph_id: str
    timestamp: str
    node_count: int
    edge_count: int
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    metadata: Dict[str, Any]

class AffectedNodeResponse(BaseModel):
    """Node affected by propagation."""
    node_id: str
    node_type: str
    original_value: float
    new_value: float
    delta: float
    depth: int
    path: List[str]

class PropagationStepResponse(BaseModel):
    """Single propagation step."""
    step: int
    from_node: str
    to_node: str
    edge_weight: float
    impulse_in: float
    impulse_out: float
    cumulative_decay: float

class PropagationSummaryResponse(BaseModel):
    """Propagation summary."""
    total_affected: int
    max_depth_reached: int
    total_delta: float
    most_affected: Dict[str, Any]
    by_type: Dict[str, int]

class PropagateResponse(BaseModel):
    """POST /api/graph/propagate response."""
    propagation_id: str
    source_node: str
    impulse: float
    affected_nodes: List[Dict[str, Any]]
    propagation_trace: Optional[List[Dict[str, Any]]] = None
    summary: Dict[str, Any]

class GraphHealthResponse(BaseModel):
    """GET /api/graph/health response."""
    status: str
    ready: bool
    adapter_available: bool
    graph_loaded: bool
    version: Optional[str] = None

class GraphErrorResponse(BaseModel):
    """Error response."""
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None

# ============================================
# ROUTES
# ============================================

@router.get("/state", response_model=GraphStateResponse)
async def get_graph_state():
    """
    Get current graph state.
    
    Returns the full graph with all nodes and edges.
    Data comes from COWORK's local graph engine.
    """
    service = get_graph_service()
    
    if not service.is_available:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Graph adapter not available",
                "code": "ADAPTER_UNAVAILABLE"
            }
        )
    
    try:
        state = service.get_state()
        return GraphStateResponse(
            graph_id=state.graph_id,
            timestamp=state.timestamp,
            node_count=state.node_count,
            edge_count=state.edge_count,
            nodes=state.nodes,
            edges=state.edges,
            metadata=state.metadata
        )
    except RuntimeError as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "code": "GRAPH_NOT_LOADED"
            }
        )

@router.post("/propagate", response_model=PropagateResponse)
async def propagate(request: PropagateRequest):
    """
    Run propagation through the graph.
    
    Starts from source_node and propagates the impulse
    through connected nodes based on edge weights.
    
    Data comes from COWORK's local graph engine.
    """
    service = get_graph_service()
    
    if not service.is_available:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Graph adapter not available",
                "code": "ADAPTER_UNAVAILABLE"
            }
        )
    
    try:
        result = service.propagate(
            source_node=request.source_node,
            impulse=request.impulse,
            max_depth=request.max_depth,
            decay_factor=request.decay_factor,
            include_trace=request.include_trace
        )
        return PropagateResponse(
            propagation_id=result.propagation_id,
            source_node=result.source_node,
            impulse=result.impulse,
            affected_nodes=result.affected_nodes,
            propagation_trace=result.propagation_trace,
            summary=result.summary
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": str(e),
                "code": "INVALID_IMPULSE"
            }
        )
    except RuntimeError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=404,
                detail={
                    "error": str(e),
                    "code": "NODE_NOT_FOUND"
                }
            )
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "code": "PROPAGATION_FAILED"
            }
        )

@router.get("/health", response_model=GraphHealthResponse)
async def check_health():
    """
    Check graph service health.
    
    Returns readiness status of the graph engine.
    """
    service = get_graph_service()
    health = service.health()
    
    status = "ok" if health.ready else "degraded"
    if not health.adapter_available:
        status = "unavailable"
    
    return GraphHealthResponse(
        status=status,
        ready=health.ready,
        adapter_available=health.adapter_available,
        graph_loaded=health.graph_loaded,
        version=health.version
    )
