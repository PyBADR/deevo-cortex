"""
DEEVO Cortex - Decision Models
Pydantic models for decision outputs
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class DecisionType(str, Enum):
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REVIEW = "REVIEW"
    ESCALATE = "ESCALATE"
    DEFER = "DEFER"
    CONDITIONAL_APPROVE = "CONDITIONAL_APPROVE"


class ConfidenceLevel(str, Enum):
    VERY_LOW = "VERY_LOW"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    VERY_HIGH = "VERY_HIGH"


class RiskLevel(str, Enum):
    MINIMAL = "MINIMAL"
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"
    CRITICAL = "CRITICAL"


class EvidenceDirection(str, Enum):
    SUPPORTS = "SUPPORTS"
    OPPOSES = "OPPOSES"
    NEUTRAL = "NEUTRAL"


class RecommendationPriority(str, Enum):
    IMMEDIATE = "IMMEDIATE"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class EvidenceItem(BaseModel):
    source: str  # Signal ID, Rule ID, or Node ID
    description: str
    weight: float = Field(..., ge=0, le=1)
    direction: Optional[EvidenceDirection] = None


class Recommendation(BaseModel):
    action: str
    rationale: str
    priority: Optional[RecommendationPriority] = None
    owner: Optional[str] = None
    deadline: Optional[datetime] = None


class DecisionContext(BaseModel):
    domain: Optional[str] = None
    region: Optional[str] = None
    entity_id: Optional[str] = None
    scenario_id: Optional[str] = None


class AuditStep(BaseModel):
    step: str
    timestamp: datetime
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None


class Decision(BaseModel):
    decision_id: str = Field(..., pattern=r"^DEC-[0-9]{8}-[A-Z]{4}$")
    type: DecisionType
    risk_score: float = Field(..., ge=0, le=1)
    risk_level: Optional[RiskLevel] = None
    confidence: float = Field(..., ge=0, le=1)
    confidence_level: Optional[ConfidenceLevel] = None
    timestamp: datetime
    context: Optional[DecisionContext] = None
    evidence: Optional[List[EvidenceItem]] = None
    rules_triggered: Optional[List[str]] = None
    recommendations: Optional[List[Recommendation]] = None
    executive_summary: Optional[str] = Field(None, max_length=500)
    detailed_analysis: Optional[str] = None
    audit_trail: Optional[List[AuditStep]] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

    @staticmethod
    def calculate_risk_level(risk_score: float) -> RiskLevel:
        """Convert numeric risk score to categorical level"""
        if risk_score < 0.1:
            return RiskLevel.MINIMAL
        elif risk_score < 0.25:
            return RiskLevel.LOW
        elif risk_score < 0.45:
            return RiskLevel.MODERATE
        elif risk_score < 0.65:
            return RiskLevel.HIGH
        elif risk_score < 0.85:
            return RiskLevel.SEVERE
        else:
            return RiskLevel.CRITICAL

    @staticmethod
    def calculate_confidence_level(confidence: float) -> ConfidenceLevel:
        """Convert numeric confidence to categorical level"""
        if confidence < 0.2:
            return ConfidenceLevel.VERY_LOW
        elif confidence < 0.4:
            return ConfidenceLevel.LOW
        elif confidence < 0.6:
            return ConfidenceLevel.MEDIUM
        elif confidence < 0.8:
            return ConfidenceLevel.HIGH
        else:
            return ConfidenceLevel.VERY_HIGH


class DecisionStats(BaseModel):
    total_decisions: int
    by_type: Dict[DecisionType, int]
    by_risk_level: Dict[RiskLevel, int]
    avg_confidence: float
    avg_risk_score: float
