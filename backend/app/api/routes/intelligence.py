"""VERCEPT Unified Intelligence API Route

Phase 3.6: API Unification

Canonical platform endpoint for the DEEVO Cortex decision intelligence system.
This route wraps the COWORK unified_engine and returns the complete intelligence response.

Endpoint: POST /api/intelligence/run

This is the PRIMARY route for all intelligence operations.
Older routes (simulate, simulate_v2, graph/*) remain available as specialized/legacy endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import sys
import os

# Add core to path for COWORK integration
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'core'))

router = APIRouter(prefix="/api/intelligence", tags=["intelligence"])


# =============================================================================
# REQUEST/RESPONSE SCHEMAS
# =============================================================================

class SignalInput(BaseModel):
    """Signal input for intelligence run"""
    oil_price: Optional[float] = Field(None, description="Oil price signal")
    inflation: Optional[float] = Field(None, description="Inflation rate")
    claims_rate: Optional[float] = Field(None, description="Claims rate")
    interest_rate: Optional[float] = Field(None, description="Interest rate")
    gdp_growth: Optional[float] = Field(None, description="GDP growth rate")
    fraud_index: Optional[float] = Field(None, description="Fraud index")
    supply_chain_stress: Optional[float] = Field(None, description="Supply chain stress")
    # Allow additional signals
    class Config:
        extra = "allow"


class IntelligenceRequest(BaseModel):
    """Request body for POST /api/intelligence/run"""
    signals: Optional[Dict[str, Any]] = Field(
        None, 
        description="Signal overrides. If None, uses canonical data/signals.json"
    )
    context: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional context overrides (country, sector, lob)"
    )


class SimulationResult(BaseModel):
    """Simulation result structure"""
    scenario: str
    risk_score: float
    confidence: float
    factors: Dict[str, Any]
    class Config:
        extra = "allow"


class DecisionTrace(BaseModel):
    """Decision trace structure"""
    rules_triggered: List[str]
    risk_contributions: Dict[str, float]
    agent_observations: List[str]
    class Config:
        extra = "allow"


class PropagationTrace(BaseModel):
    """Graph propagation trace"""
    source_node: str
    nodes_affected: int
    edges_traversed: int
    propagation_path: List[Dict[str, Any]]
    class Config:
        extra = "allow"


class GraphState(BaseModel):
    """Graph state structure"""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    active_nodes: int
    class Config:
        extra = "allow"


class IntelligenceResponse(BaseModel):
    """Unified intelligence response
    
    Contains all five canonical output keys from the unified engine.
    """
    simulation_result: Dict[str, Any] = Field(..., description="Simulation output")
    decision_trace: Dict[str, Any] = Field(..., description="Decision audit trail")
    decision: str = Field(..., description="Final decision: APPROVE | REVIEW | ESCALATE")
    graph_state: Dict[str, Any] = Field(..., description="Current graph state")
    propagation_trace: Dict[str, Any] = Field(..., description="Graph propagation trace")
    
    # Convenience fields (derived)
    confidence: Optional[float] = Field(None, description="Decision confidence score")
    risk_score: Optional[float] = Field(None, description="Computed risk score")
    scenario: Optional[str] = Field(None, description="Detected scenario")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    engine: str
    version: str


# =============================================================================
# ROUTES
# =============================================================================

@router.post("/run", response_model=IntelligenceResponse)
async def run_intelligence(request: IntelligenceRequest = None):
    """Execute the unified intelligence pipeline.
    
    This is the CANONICAL endpoint for DEEVO Cortex.
    
    Flow:
    1. Load signals (from request or canonical file)
    2. Detect scenario
    3. Run GCC graph propagation
    4. Execute simulation
    5. Run agent analysis
    6. Evaluate rules
    7. Produce decision
    
    Returns all five output keys:
    - simulation_result
    - decision_trace  
    - decision
    - graph_state
    - propagation_trace
    """
    try:
        # Import COWORK unified engine
        from unified_engine import run as unified_run
        
        # Prepare signals (None = use canonical file)
        signals = None
        if request and request.signals:
            signals = dict(request.signals)
        
        # Execute unified engine
        result = unified_run(signals=signals)
        
        # Build response with convenience fields
        response = IntelligenceResponse(
            simulation_result=result.get("simulation_result", {}),
            decision_trace=result.get("decision_trace", {}),
            decision=result.get("decision", "REVIEW"),
            graph_state=result.get("graph_state", {}),
            propagation_trace=result.get("propagation_trace", {}),
            # Derived convenience fields
            confidence=result.get("simulation_result", {}).get("confidence"),
            risk_score=result.get("simulation_result", {}).get("risk_score"),
            scenario=result.get("simulation_result", {}).get("scenario")
        )
        
        return response
        
    except ImportError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Unified engine not available: {str(e)}. Ensure COWORK unified_engine.py exists."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Intelligence execution failed: {str(e)}"
        )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check unified intelligence engine health."""
    try:
        from unified_engine import health
        
        health_result = health()
        return HealthResponse(
            status=health_result.get("status", "unknown"),
            engine=health_result.get("engine", "unified_engine"),
            version=health_result.get("version", "1.0.0")
        )
    except ImportError:
        return HealthResponse(
            status="unavailable",
            engine="unified_engine",
            version="unknown"
        )
    except Exception as e:
        return HealthResponse(
            status=f"error: {str(e)}",
            engine="unified_engine",
            version="unknown"
        )


# =============================================================================
# LEGACY ROUTE DOCUMENTATION
# =============================================================================
"""
LEGACY/SPECIALIZED ROUTES (still available):

1. POST /api/simulate (simulate.py)
   - Original simulation endpoint
   - Returns: simulation_result, decision_trace, decision
   - Missing: graph_state, propagation_trace
   - Status: LEGACY - use /api/intelligence/run instead

2. POST /api/simulate (simulate_v2.py)  
   - COWORK-integrated simulation
   - Returns: simulation_result, decision_trace, decision
   - Missing: graph_state, propagation_trace
   - Status: LEGACY - use /api/intelligence/run instead

3. GET /api/graph/state (graph.py)
   - Graph state only
   - Status: SPECIALIZED - use when only graph state needed

4. POST /api/graph/propagate (graph.py)
   - Graph propagation only
   - Status: SPECIALIZED - use when only propagation needed

5. GET/POST /api/signals (signals.py)
   - Signal CRUD operations
   - Status: ACTIVE - complementary to intelligence

6. GET /api/decisions (decisions.py)
   - Decision history/log
   - Status: ACTIVE - complementary to intelligence

MIGRATION PATH:
- Replace POST /api/simulate calls with POST /api/intelligence/run
- Response structure is backward compatible (same keys + additional keys)
- graph_state and propagation_trace are new additions
"""
