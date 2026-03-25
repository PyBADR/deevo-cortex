"""
DEEVO Cortex - Rules Models
Pydantic models for decision rules
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Union, Dict, Any
from pydantic import BaseModel, Field


class Operator(str, Enum):
    GT = "GT"      # Greater than
    GTE = "GTE"    # Greater than or equal
    LT = "LT"      # Less than
    LTE = "LTE"    # Less than or equal
    EQ = "EQ"      # Equal
    NEQ = "NEQ"    # Not equal
    BETWEEN = "BETWEEN"
    IN = "IN"
    NOT_IN = "NOT_IN"


class LogicalOperator(str, Enum):
    AND = "AND"
    OR = "OR"
    NOT = "NOT"
    XOR = "XOR"


class RuleCategory(str, Enum):
    RISK_THRESHOLD = "RISK_THRESHOLD"
    FRAUD_DETECTION = "FRAUD_DETECTION"
    CLAIMS_TRIGGER = "CLAIMS_TRIGGER"
    UNDERWRITING = "UNDERWRITING"
    COMPLIANCE = "COMPLIANCE"
    ESCALATION = "ESCALATION"


class ActionType(str, Enum):
    SET_RISK = "SET_RISK"
    ESCALATE = "ESCALATE"
    APPROVE = "APPROVE"
    REJECT = "REJECT"
    REVIEW = "REVIEW"
    FLAG = "FLAG"
    NOTIFY = "NOTIFY"
    SIMULATE = "SIMULATE"


class Condition(BaseModel):
    field: str  # Signal or node ID
    operator: Operator
    value: Union[float, str, List[Union[float, str]]]
    value_end: Optional[float] = None  # For BETWEEN operator


class ConditionGroup(BaseModel):
    operator: LogicalOperator
    conditions: List[Union['Condition', 'ConditionGroup']]


# Enable forward references
ConditionGroup.model_rebuild()


class RuleAction(BaseModel):
    type: ActionType
    params: Optional[Dict[str, Any]] = None


class RuleMetadata(BaseModel):
    author: Optional[str] = None
    created_at: Optional[datetime] = None
    last_triggered: Optional[datetime] = None
    trigger_count: Optional[int] = 0


class Rule(BaseModel):
    id: str = Field(..., pattern=r"^RULE-[A-Z]{3}-[0-9]{4}$")
    name: str
    description: Optional[str] = None
    category: RuleCategory
    priority: Optional[int] = Field(50, ge=1, le=100)
    enabled: Optional[bool] = True
    conditions: ConditionGroup
    actions: List[RuleAction]
    risk_contribution: Optional[float] = Field(None, ge=0, le=1)
    metadata: Optional[RuleMetadata] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class RuleSet(BaseModel):
    ruleset_id: str
    name: Optional[str] = None
    version: Optional[str] = None
    rules: List[Rule] = []


class RuleEvaluationResult(BaseModel):
    rule_id: str
    triggered: bool
    conditions_met: List[str] = []
    conditions_failed: List[str] = []
    risk_contribution: float = 0.0
    actions_executed: List[ActionType] = []


class RuleSetEvaluationResult(BaseModel):
    ruleset_id: str
    timestamp: datetime
    rules_evaluated: int
    rules_triggered: int
    total_risk: float
    results: List[RuleEvaluationResult] = []
