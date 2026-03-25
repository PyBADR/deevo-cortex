"""
DEEVO Cortex - Simulation Models
Pydantic models for scenario simulation
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

from .decision import Decision


class ScenarioType(str, Enum):
    STRESS_TEST = "STRESS_TEST"
    WHAT_IF = "WHAT_IF"
    MONTE_CARLO = "MONTE_CARLO"
    SENSITIVITY = "SENSITIVITY"
    HISTORICAL_REPLAY = "HISTORICAL_REPLAY"


class ScenarioStatus(str, Enum):
    DRAFT = "DRAFT"
    READY = "READY"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ChangeType(str, Enum):
    ABSOLUTE = "ABSOLUTE"
    PERCENTAGE = "PERCENTAGE"
    DELTA = "DELTA"


class SignalOverride(BaseModel):
    signal_id: str
    original_value: Optional[float] = None
    new_value: float
    change_type: Optional[ChangeType] = ChangeType.ABSOLUTE


class SimulationParameters(BaseModel):
    iterations: Optional[int] = Field(1000, ge=1, le=100000)
    time_horizon_days: Optional[int] = Field(30, ge=1)
    confidence_interval: Optional[float] = Field(0.95, ge=0.5, le=0.99)
    random_seed: Optional[int] = None


class Scenario(BaseModel):
    scenario_id: str = Field(..., pattern=r"^SCN-[A-Z]{3}-[0-9]{4}$")
    name: str
    description: Optional[str] = None
    type: ScenarioType
    status: Optional[ScenarioStatus] = ScenarioStatus.DRAFT
    overrides: List[SignalOverride] = []
    parameters: Optional[SimulationParameters] = None
    baseline_snapshot_id: Optional[str] = None
    tags: Optional[List[str]] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class AffectedNode(BaseModel):
    node_id: str
    original_value: float
    simulated_value: float
    impact: float


class Distribution(BaseModel):
    mean: float
    std_dev: float
    percentiles: Optional[Dict[str, float]] = None  # p5, p25, p50, p75, p95


class SimulationResult(BaseModel):
    result_id: str
    scenario_id: str
    timestamp: datetime
    duration_ms: Optional[int] = None
    baseline_decision: Optional[Decision] = None
    simulated_decision: Optional[Decision] = None
    risk_delta: Optional[float] = None
    affected_nodes: Optional[List[AffectedNode]] = None
    distribution: Optional[Distribution] = None
    insights: Optional[List[str]] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ScenarioComparison(BaseModel):
    scenarios: List[Scenario]
    results: List[SimulationResult]
    risk_range: Dict[str, float]  # min, max
    most_impactful_signals: List[str]


class SensitivityAnalysis(BaseModel):
    signal_id: str
    signal_name: str
    sensitivity_score: float
    risk_impact_per_unit: float
    threshold_to_escalate: float
