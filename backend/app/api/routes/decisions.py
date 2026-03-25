"""
DEEVO Cortex - Decisions API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime

from ...models import (
    Signal, Decision, DecisionContext, DecisionStats,
    Graph, RuleSet
)
from ...engine.decision.engine import DecisionEngine

router = APIRouter(prefix="/decisions", tags=["Decisions"])

# Global engine instance (in production, use dependency injection)
decision_engine = DecisionEngine()

# In-memory decision store
decision_store: List[Decision] = []


class DecisionRequest:
    signals: List[Signal]
    context: Optional[DecisionContext] = None


@router.post("/evaluate", response_model=Decision)
async def evaluate_decision(signals: List[Signal], context: Optional[DecisionContext] = None):
    """
    Evaluate signals and generate a decision.
    """
    try:
        decision = decision_engine.make_decision(signals, context)
        decision_store.append(decision)
        return decision
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{decision_id}", response_model=Decision)
async def get_decision(decision_id: str):
    """
    Get a specific decision by ID.
    """
    for decision in decision_store:
        if decision.decision_id == decision_id:
            return decision
    raise HTTPException(status_code=404, detail="Decision not found")


@router.get("/", response_model=List[Decision])
async def list_decisions(
    limit: int = 50,
    offset: int = 0,
    decision_type: Optional[str] = None
):
    """
    List recent decisions.
    """
    filtered = decision_store
    
    if decision_type:
        filtered = [d for d in filtered if d.type.value == decision_type]
    
    return filtered[offset:offset + limit]


@router.get("/stats", response_model=DecisionStats)
async def get_decision_stats():
    """
    Get decision statistics.
    """
    if not decision_store:
        return DecisionStats(
            total_decisions=0,
            by_type={},
            by_risk_level={},
            avg_confidence=0,
            avg_risk_score=0
        )
    
    by_type = {}
    by_risk_level = {}
    total_confidence = 0
    total_risk = 0
    
    for decision in decision_store:
        # Count by type
        type_key = decision.type
        by_type[type_key] = by_type.get(type_key, 0) + 1
        
        # Count by risk level
        if decision.risk_level:
            level_key = decision.risk_level
            by_risk_level[level_key] = by_risk_level.get(level_key, 0) + 1
        
        total_confidence += decision.confidence
        total_risk += decision.risk_score
    
    n = len(decision_store)
    
    return DecisionStats(
        total_decisions=n,
        by_type=by_type,
        by_risk_level=by_risk_level,
        avg_confidence=total_confidence / n,
        avg_risk_score=total_risk / n
    )


@router.post("/configure/graph")
async def configure_graph(graph: Graph):
    """
    Configure the decision engine with a causal graph.
    """
    global decision_engine
    from ...engine.graph.propagator import GraphPropagator
    decision_engine.graph_propagator = GraphPropagator(graph)
    return {"status": "Graph configured", "nodes": len(graph.nodes), "edges": len(graph.edges)}


@router.post("/configure/rules")
async def configure_rules(ruleset: RuleSet):
    """
    Configure the decision engine with a ruleset.
    """
    global decision_engine
    decision_engine.ruleset = ruleset
    return {"status": "Rules configured", "rules": len(ruleset.rules)}
