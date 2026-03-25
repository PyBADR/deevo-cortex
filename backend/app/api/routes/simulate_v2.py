"""
DEEVO Cortex - Simulation API Route
Final Integration: Platform <-> COWORK Local Engine

PRIMARY PATH: core.api_adapter.execute()
FALLBACK: Only if adapter import fails or hard runtime error
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
import sys
from pathlib import Path

router = APIRouter()

# ============================================
# PATH SETUP FOR COWORK ENGINE
# ============================================

CORE_PATH = Path(__file__).parent.parent.parent.parent.parent / "core"
sys.path.insert(0, str(CORE_PATH))

# ============================================
# REQUEST SCHEMA
# ============================================

class SignalSchema(BaseModel):
    oil_price: float = Field(..., ge=0)
    inflation: float
    claims_rate: float = Field(..., ge=0, le=1)
    fraud_index: float = Field(0.0, ge=0, le=1)
    gdp_growth: Optional[float] = None
    unemployment: Optional[float] = None

class ScenarioOverride(BaseModel):
    name: str
    adjustments: Dict[str, float]

class SimulateRequest(BaseModel):
    signals: Optional[SignalSchema] = None
    scenario_override: Optional[ScenarioOverride] = None

# ============================================
# RESPONSE SCHEMA (Aligned with COWORK output)
# ============================================

class SimulateResponse(BaseModel):
    """Direct mapping to COWORK adapter output."""
    simulation_result: Dict[str, Any]
    decision_trace: Dict[str, Any]
    decision: Dict[str, Any]
    # Convenience fields derived from decision payload
    confidence: Optional[float] = None
    risk_score: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    engine_ready: bool
    adapter_version: Optional[str] = None

# ============================================
# ADAPTER LOADING
# ============================================

def load_adapter():
    """
    Load COWORK's api_adapter module.
    Returns (execute_fn, health_fn) or (None, None) if unavailable.
    """
    try:
        from api_adapter import execute, health
        return execute, health
    except ImportError as e:
        print(f"[WARN] COWORK adapter not available: {e}")
        return None, None

# ============================================
# PRIMARY ROUTE: POST /api/simulate
# ============================================

@router.post("/simulate", response_model=SimulateResponse)
async def execute_simulation(request: SimulateRequest):
    """
    Execute decision pipeline via COWORK adapter.
    
    PRIMARY PATH: core.api_adapter.execute()
    FALLBACK: Only if adapter unavailable or hard error
    """
    
    # Load COWORK adapter
    execute_fn, _ = load_adapter()
    
    # PRIMARY PATH: Use real adapter
    if execute_fn is not None:
        try:
            # Prepare signals
            if request.signals:
                signals_dict = request.signals.model_dump()
                # Apply scenario override if present
                if request.scenario_override:
                    for key, value in request.scenario_override.adjustments.items():
                        if key in signals_dict:
                            signals_dict[key] = value
                # Execute with provided signals
                result = execute_fn(signals=signals_dict)
            else:
                # Execute with canonical file (data/signals.json)
                result = execute_fn()
            
            # Build response from COWORK output
            return SimulateResponse(
                simulation_result=result.get("simulation_result", {}),
                decision_trace=result.get("decision_trace", {}),
                decision=result.get("decision", {}),
                # Derive convenience fields from decision payload
                confidence=extract_confidence(result),
                risk_score=extract_risk_score(result)
            )
            
        except Exception as e:
            # Hard runtime error - try fallback
            print(f"[ERROR] Adapter execution failed: {e}")
            return execute_fallback(request, error_context=str(e))
    
    # FALLBACK PATH: Adapter not available
    return execute_fallback(request, error_context="Adapter import failed")

# ============================================
# HEALTH ROUTE: GET /api/health
# ============================================

@router.get("/health", response_model=HealthResponse)
async def check_health():
    """
    Check engine readiness via COWORK adapter.
    """
    _, health_fn = load_adapter()
    
    if health_fn is not None:
        try:
            health_result = health_fn()
            return HealthResponse(
                status="ok",
                engine_ready=health_result.get("ready", True),
                adapter_version=health_result.get("version", "1.0.0")
            )
        except Exception:
            return HealthResponse(
                status="degraded",
                engine_ready=False,
                adapter_version=None
            )
    
    return HealthResponse(
        status="fallback",
        engine_ready=False,
        adapter_version=None
    )

# ============================================
# HELPER FUNCTIONS
# ============================================

def extract_confidence(result: dict) -> Optional[float]:
    """Extract confidence from COWORK decision payload."""
    decision = result.get("decision", {})
    return decision.get("confidence")

def extract_risk_score(result: dict) -> Optional[float]:
    """Extract risk_score from COWORK decision payload."""
    decision = result.get("decision", {})
    return decision.get("risk_score")

# ============================================
# FALLBACK (Safety mechanism only)
# ============================================

def execute_fallback(request: SimulateRequest, error_context: str) -> SimulateResponse:
    """
    FALLBACK ONLY - Used when:
    1. Adapter import fails
    2. Adapter execution raises hard runtime error
    
    This is NOT the primary path.
    """
    print(f"[WARN] Using fallback execution. Reason: {error_context}")
    
    # Minimal fallback logic
    if request.signals:
        signals = request.signals.model_dump()
    else:
        signals = {
            "oil_price": 80,
            "inflation": 2.5,
            "claims_rate": 0.3,
            "fraud_index": 0.1
        }
    
    # Simple risk calculation
    risk = 0.0
    if signals.get("inflation", 0) > 3:
        risk += 0.2
    if signals.get("claims_rate", 0) > 0.5:
        risk += 0.3
    if signals.get("fraud_index", 0) > 0.2:
        risk += 0.15
    if signals.get("oil_price", 0) > 90:
        risk += 0.1
    risk = min(risk, 1.0)
    
    # Decision threshold
    if risk > 0.6:
        decision_type = "ESCALATE"
        confidence = 0.7
    elif risk > 0.3:
        decision_type = "REVIEW"
        confidence = 0.6
    else:
        decision_type = "APPROVE"
        confidence = 0.8
    
    return SimulateResponse(
        simulation_result={
            "scenario": "fallback",
            "fallback_reason": error_context
        },
        decision_trace={
            "pipeline": "fallback",
            "steps": ["fallback_execution"]
        },
        decision={
            "type": decision_type,
            "confidence": confidence,
            "risk_score": risk
        },
        confidence=confidence,
        risk_score=risk
    )
