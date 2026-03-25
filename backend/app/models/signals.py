"""
DEEVO Cortex - Signal Models
Pydantic models for signal data structures
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator


class SignalSource(str, Enum):
    MACRO = "MACRO"
    MARKET = "MARKET"
    INSURANCE = "INSURANCE"
    FRAUD = "FRAUD"
    CLAIMS = "CLAIMS"
    REGULATORY = "REGULATORY"
    GEOPOLITICAL = "GEOPOLITICAL"


class SignalSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class SignalTrend(str, Enum):
    RISING = "RISING"
    STABLE = "STABLE"
    FALLING = "FALLING"
    VOLATILE = "VOLATILE"


class GCCRegion(str, Enum):
    UAE = "UAE"
    KSA = "KSA"
    QATAR = "QATAR"
    KUWAIT = "KUWAIT"
    BAHRAIN = "BAHRAIN"
    OMAN = "OMAN"
    GCC_WIDE = "GCC_WIDE"


class SignalMetadata(BaseModel):
    source_url: Optional[str] = None
    last_updated: Optional[datetime] = None
    data_quality: Optional[float] = Field(None, ge=0, le=1)


class Signal(BaseModel):
    id: str = Field(..., pattern=r"^SIG-[A-Z]{3}-[0-9]{6}$")
    name: str = Field(..., min_length=3, max_length=100)
    source: SignalSource
    value: float
    unit: Optional[str] = None
    timestamp: datetime
    region: Optional[GCCRegion] = None
    severity: Optional[SignalSeverity] = None
    trend: Optional[SignalTrend] = None
    confidence: Optional[float] = Field(None, ge=0, le=1)
    metadata: Optional[SignalMetadata] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class SignalGroup(BaseModel):
    group_id: str
    name: str
    description: Optional[str] = None
    signals: List[Signal] = []
    aggregate_severity: Optional[SignalSeverity] = None


class SignalSnapshot(BaseModel):
    signals: List[Signal] = []
    groups: List[SignalGroup] = []
    snapshot_timestamp: datetime


class SignalFilter(BaseModel):
    sources: Optional[List[SignalSource]] = None
    regions: Optional[List[GCCRegion]] = None
    severities: Optional[List[SignalSeverity]] = None
    trends: Optional[List[SignalTrend]] = None
    min_confidence: Optional[float] = Field(None, ge=0, le=1)
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


class SignalAggregation(BaseModel):
    by_source: Dict[SignalSource, int]
    by_region: Dict[GCCRegion, int]
    by_severity: Dict[SignalSeverity, int]
    total_count: int
    critical_count: int
