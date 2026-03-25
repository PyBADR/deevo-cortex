"""
DEEVO Cortex - Simulation API Route
Final Integration: Platform <-> COWORK Local Engine

PRIMARY PATH: core.api_adapter.execute()
FALLBACK: Only if adapter import fails or hard runtime error
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Literal
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
    trace: DecisionTrace

class ErrorResponse(BaseModel):
    error: str
    code: Literal["INVALID_SIGNALS", "SIMULATION_FAILED", "ENGINE_ERROR"]

# ============================================
# LOCAL ENGINE IMPORTS (COWORK FILES)
# ============================================

# Path to local engine files
ENGINE_PATH = Path(__file__).parent.parent.parent.parent.parent / "core"
DATA_PATH = Path(__file__).parent.parent.parent.parent.parent / "data"
OUTPUT_PATH = Path(__file__).parent.parent.parent.parent.parent / "output"

def load_local_engine():
    """Dynamically load COWORK's local engine files."""
    import sys
    sys.path.insert(0, str(ENGINE_PATH))
    
    try:
        from rules import evaluate
        from simulation_engine import simulate
        from agents import analyze
        return evaluate, simulate, analyze
    except ImportError as e:
        return None, None, None

# ============================================
# PIPELINE EXECUTION
# ============================================

@router.post("/simulate", response_model=DecisionResponse)
async def execute_simulation(request: SimulateRequest):
    """Execute the full decision pipeline."""
    
    pipeline_id = f"exec-{int(time.time())}-{uuid.uuid4().hex[:6]}"
    steps = []
    start_time = time.time()
    
    # Step 1: Load Signals
    step_start = time.time()
    signals = request.signals.model_dump()
    steps.append(PipelineStep(
        step="load_signals",
        status="ok",
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Step 2: Detect Scenario
    step_start = time.time()
    if request.scenario_override:
        scenario = request.scenario_override.name
        # Apply adjustments
        for key, value in request.scenario_override.adjustments.items():
            if key in signals:
                signals[key] = value
    else:
        scenario = detect_scenario(signals)
    
    steps.append(PipelineStep(
        step="detect_scenario",
        status="ok",
        result=scenario,
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Step 3: Run Simulation
    step_start = time.time()
    evaluate_fn, simulate_fn, analyze_fn = load_local_engine()
    
    if simulate_fn:
        try:
            sim_result = simulate_fn(scenario, signals)
        except Exception as e:
            raise HTTPException(status_code=400, detail={
                "error": str(e),
                "code": "SIMULATION_FAILED"
            })
    else:
        # Fallback: inline simulation
        sim_result = inline_simulate(scenario, signals)
    
    steps.append(PipelineStep(
        step="run_simulation",
        status="ok",
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Step 4: Agent Analysis
    step_start = time.time()
    if analyze_fn:
        try:
            agent_result = analyze_fn({"signals": signals, "simulation": sim_result})
        except:
            agent_result = {}
    else:
        agent_result = {}
    
    steps.append(PipelineStep(
        step="agent_analysis",
        status="ok",
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Step 5: Compute Risk Score
    step_start = time.time()
    if evaluate_fn:
        try:
            risk_score = evaluate_fn(signals)
        except Exception as e:
            raise HTTPException(status_code=400, detail={
                "error": str(e),
                "code": "ENGINE_ERROR"
            })
    else:
        # Fallback: inline evaluation
        risk_score = inline_evaluate(signals)
    
    steps.append(PipelineStep(
        step="compute_risk",
        status="ok",
        result=round(risk_score, 3),
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Step 6: Produce Decision
    step_start = time.time()
    decision, confidence = produce_decision(risk_score)
    
    steps.append(PipelineStep(
        step="produce_decision",
        status="ok",
        result=decision,
        ms=int((time.time() - step_start) * 1000)
    ))
    
    # Build response
    total_ms = int((time.time() - start_time) * 1000)
    
    response = DecisionResponse(
        decision=decision,
        confidence=round(confidence, 2),
        risk_score=round(risk_score, 3),
        trace=DecisionTrace(
            pipeline_id=pipeline_id,
            steps=steps,
            total_ms=total_ms
        )
    )
    
    # Step 7: Persist output
    persist_output(response.model_dump())
    
    return response

# ============================================
# HELPER FUNCTIONS
# ============================================

def detect_scenario(signals: dict) -> str:
    """Detect scenario from signal patterns."""
    if signals.get("oil_price", 0) > 100:
        return "oil_shock"
    if signals.get("inflation", 0) > 5:
        return "inflation_spike"
    if signals.get("claims_rate", 0) > 0.6:
        return "claims_stress"
    if signals.get("fraud_index", 0) > 0.3:
        return "fraud_spike"
    return "baseline"

def inline_simulate(scenario: str, signals: dict) -> dict:
    """Fallback simulation when COWORK engine not available."""
    base_risk = 0.3
    if scenario == "oil_shock":
        base_risk += 0.2
    if scenario == "inflation_spike":
        base_risk += 0.15
    if scenario == "claims_stress":
        base_risk += 0.25
    return {
        "scenario_detected": scenario,
        "risk_distribution": {
            "min": base_risk * 0.8,
            "max": min(base_risk * 1.3, 1.0),
            "mean": base_risk,
            "p95": min(base_risk * 1.2, 1.0)
        }
    }

def inline_evaluate(signals: dict) -> float:
    """Fallback evaluation when COWORK rules not available."""
    risk = 0.0
    if signals.get("inflation", 0) > 3:
        risk += 0.2
    if signals.get("claims_rate", 0) > 0.5:
        risk += 0.3
    if signals.get("fraud_index", 0) > 0.2:
        risk += 0.15
    if signals.get("oil_price", 0) > 90:
        risk += 0.1
    return min(risk, 1.0)

def produce_decision(risk_score: float) -> tuple:
    """Convert risk score to decision."""
    if risk_score > 0.6:
        return "ESCALATE", 0.9 - (risk_score - 0.6)
    elif risk_score > 0.3:
        return "REVIEW", 0.7
    else:
        return "APPROVE", 0.95 - risk_score

def persist_output(output: dict):
    """Write decision to output file."""
    try:
        OUTPUT_PATH.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH / "decision.json", "w") as f:
            json.dump(output, f, indent=2)
    except:
        pass  # Non-critical, don't fail pipeline
