"""
DEEVO Cortex - Graph Models
Pydantic models for causal relationship graphs
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field


class NodeType(str, Enum):
    SIGNAL = "SIGNAL"
    FACTOR = "FACTOR"
    RISK = "RISK"
    OUTCOME = "OUTCOME"
    DECISION = "DECISION"
    CONSTRAINT = "CONSTRAINT"


class EdgeType(str, Enum):
    CAUSES = "CAUSES"
    CORRELATES = "CORRELATES"
    AMPLIFIES = "AMPLIFIES"
    MITIGATES = "MITIGATES"
    TRIGGERS = "TRIGGERS"
    BLOCKS = "BLOCKS"


class DomainType(str, Enum):
    MACRO = "MACRO"
    INSURANCE = "INSURANCE"
    FRAUD = "FRAUD"
    CLAIMS = "CLAIMS"
    UNDERWRITING = "UNDERWRITING"
    REGULATORY = "REGULATORY"


class GraphNode(BaseModel):
    id: str = Field(..., pattern=r"^NODE-[A-Z]{3}-[0-9]{4}$")
    type: NodeType
    label: str
    description: Optional[str] = None
    domain: Optional[DomainType] = None
    weight: Optional[float] = Field(None, ge=0, le=1)
    current_value: Optional[float] = None
    threshold_low: Optional[float] = None
    threshold_high: Optional[float] = None
    linked_signal_id: Optional[str] = None


class GraphEdge(BaseModel):
    id: str = Field(..., pattern=r"^EDGE-[0-9]{6}$")
    source: str  # Node ID
    target: str  # Node ID
    type: EdgeType
    strength: Optional[float] = Field(None, ge=-1, le=1)
    lag_days: Optional[int] = Field(None, ge=0)
    confidence: Optional[float] = Field(None, ge=0, le=1)
    evidence: Optional[List[str]] = None


class GraphMetadata(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    author: Optional[str] = None


class Graph(BaseModel):
    graph_id: str
    name: Optional[str] = None
    version: Optional[str] = None
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []
    metadata: Optional[GraphMetadata] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class NodeImpact(BaseModel):
    node_id: str
    direct_impact: float
    indirect_impact: float
    total_impact: float
    affected_nodes: List[str]


class PathAnalysis(BaseModel):
    source_node: str
    target_node: str
    paths: List[List[str]]  # List of edge IDs
    shortest_path_length: int
    total_strength: float


class GraphStats(BaseModel):
    node_count: int
    edge_count: int
    density: float
    avg_degree: float
    clusters: List[List[str]]
