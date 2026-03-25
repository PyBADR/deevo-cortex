"""
DEEVO Cortex - Decision Engine
Core decision-making logic that integrates all layers
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import random
import string

from ...models import (
    Decision, DecisionType, RiskLevel, ConfidenceLevel,
    EvidenceItem, EvidenceDirection, Recommendation, RecommendationPriority,
    DecisionContext, AuditStep,
    Signal, SignalSnapshot, SignalSeverity,
    Graph,
    RuleSet, RuleSetEvaluationResult,
    Scenario, SimulationResult
)
from ..signals.processor import SignalProcessor
from ..graph.propagator import GraphPropagator
from ..rules.evaluator import RulesEvaluator


class DecisionEngine:
    """
    The core decision engine that orchestrates:
    Signals → Graph → Rules → Decision
    """

    def __init__(
        self,
        graph: Optional[Graph] = None,
        ruleset: Optional[RuleSet] = None
    ):
        self.signal_processor = SignalProcessor()
        self.graph_propagator = GraphPropagator(graph) if graph else None
        self.rules_evaluator = RulesEvaluator()
        self.ruleset = ruleset
        self._audit_trail: List[AuditStep] = []

    def process_signals(self, signals: List[Signal]) -> SignalSnapshot:
        """
        Step 1: Process incoming signals.
        """
        self._log_audit_step(
            "SIGNAL_PROCESSING",
            {"signal_count": len(signals)},
            None
        )
        
        snapshot = self.signal_processor.ingest_batch(signals)
        
        self._log_audit_step(
            "SIGNAL_PROCESSING",
            None,
            {
                "processed_count": len(snapshot.signals),
                "critical_count": len(self.signal_processor.get_critical_signals(snapshot.signals))
            }
        )
        
        return snapshot

    def propagate_through_graph(
        self, 
        snapshot: SignalSnapshot
    ) -> Dict[str, float]:
        """
        Step 2: Propagate signal changes through the causal graph.
        """
        if not self.graph_propagator:
            return {}
        
        self._log_audit_step("GRAPH_PROPAGATION", {"snapshot_id": str(snapshot.snapshot_timestamp)}, None)
        
        all_impacts: Dict[str, float] = {}
        
        # For each critical signal, propagate its impact
        critical_signals = self.signal_processor.get_critical_signals(snapshot.signals)
        
        for signal in critical_signals:
            if signal.linked_signal_id:
                # Assume signal value change of 10% as delta
                delta = signal.value * 0.1
                impacts = self.graph_propagator.propagate_change(
                    signal.linked_signal_id, 
                    delta
                )
                
                for node_id, impact in impacts.items():
                    if node_id in all_impacts:
                        all_impacts[node_id] += impact
                    else:
                        all_impacts[node_id] = impact
        
        self._log_audit_step(
            "GRAPH_PROPAGATION",
            None,
            {"affected_nodes": len(all_impacts)}
        )
        
        return all_impacts

    def evaluate_rules(
        self, 
        context: Dict[str, Any]
    ) -> RuleSetEvaluationResult:
        """
        Step 3: Evaluate rules against the current context.
        """
        if not self.ruleset:
            return RuleSetEvaluationResult(
                ruleset_id="EMPTY",
                timestamp=datetime.utcnow(),
                rules_evaluated=0,
                rules_triggered=0,
                total_risk=0.0,
                results=[]
            )
        
        self._log_audit_step(
            "RULE_EVALUATION",
            {"context_keys": list(context.keys())},
            None
        )
        
        result = self.rules_evaluator.evaluate_ruleset(self.ruleset, context)
        
        self._log_audit_step(
            "RULE_EVALUATION",
            None,
            {
                "rules_triggered": result.rules_triggered,
                "total_risk": result.total_risk
            }
        )
        
        return result

    def make_decision(
        self,
        signals: List[Signal],
        context: Optional[DecisionContext] = None
    ) -> Decision:
        """
        Main entry point: Process signals and generate a decision.
        """
        self._audit_trail = []  # Reset audit trail
        
        # Step 1: Process signals
        snapshot = self.process_signals(signals)
        
        # Build context from signals
        signal_context: Dict[str, Any] = {}
        for signal in snapshot.signals:
            signal_context[signal.name.lower().replace(" ", "_")] = signal.value
            signal_context[signal.id] = signal.value
        
        # Step 2: Propagate through graph
        graph_impacts = self.propagate_through_graph(snapshot)
        signal_context.update({f"impact_{k}": v for k, v in graph_impacts.items()})
        
        # Step 3: Evaluate rules
        rule_result = self.evaluate_rules(signal_context)
        
        # Step 4: Calculate final risk score
        risk_score = self._calculate_risk_score(snapshot, rule_result, graph_impacts)
        
        # Step 5: Determine decision type
        decision_type = self._determine_decision_type(risk_score, rule_result)
        
        # Step 6: Calculate confidence
        confidence = self._calculate_confidence(snapshot, rule_result)
        
        # Step 7: Build evidence
        evidence = self._build_evidence(snapshot, rule_result, graph_impacts)
        
        # Step 8: Generate recommendations
        recommendations = self._generate_recommendations(decision_type, risk_score, evidence)
        
        # Step 9: Create decision
        decision = Decision(
            decision_id=self._generate_decision_id(),
            type=decision_type,
            risk_score=risk_score,
            risk_level=Decision.calculate_risk_level(risk_score),
            confidence=confidence,
            confidence_level=Decision.calculate_confidence_level(confidence),
            timestamp=datetime.utcnow(),
            context=context,
            evidence=evidence,
            rules_triggered=[r.rule_id for r in rule_result.results if r.triggered],
            recommendations=recommendations,
            executive_summary=self._generate_executive_summary(decision_type, risk_score, confidence),
            audit_trail=self._audit_trail
        )
        
        self._log_audit_step(
            "DECISION_OUTPUT",
            None,
            {
                "decision_id": decision.decision_id,
                "type": decision.type.value,
                "risk_score": decision.risk_score
            }
        )
        
        return decision

    def _calculate_risk_score(
        self,
        snapshot: SignalSnapshot,
        rule_result: RuleSetEvaluationResult,
        graph_impacts: Dict[str, float]
    ) -> float:
        """
        Calculate composite risk score from all inputs.
        """
        # Base risk from rules
        rule_risk = rule_result.total_risk
        
        # Signal severity contribution
        critical_signals = self.signal_processor.get_critical_signals(snapshot.signals)
        signal_risk = len(critical_signals) * 0.1
        
        # Graph impact contribution
        graph_risk = sum(abs(v) for v in graph_impacts.values()) * 0.05 if graph_impacts else 0
        
        # Weighted combination
        total_risk = (rule_risk * 0.5) + (signal_risk * 0.3) + (graph_risk * 0.2)
        
        return min(max(total_risk, 0.0), 1.0)

    def _determine_decision_type(
        self,
        risk_score: float,
        rule_result: RuleSetEvaluationResult
    ) -> DecisionType:
        """
        Determine the decision type based on risk and rules.
        """
        # Check for explicit escalation from rules
        for result in rule_result.results:
            if result.triggered and "ESCALATE" in [a.value for a in result.actions_executed]:
                return DecisionType.ESCALATE
        
        # Risk-based decision
        if risk_score >= 0.8:
            return DecisionType.REJECT
        elif risk_score >= 0.6:
            return DecisionType.ESCALATE
        elif risk_score >= 0.4:
            return DecisionType.REVIEW
        elif risk_score >= 0.2:
            return DecisionType.CONDITIONAL_APPROVE
        else:
            return DecisionType.APPROVE

    def _calculate_confidence(
        self,
        snapshot: SignalSnapshot,
        rule_result: RuleSetEvaluationResult
    ) -> float:
        """
        Calculate confidence in the decision.
        """
        # Base confidence from signal quality
        signal_confidences = [
            s.confidence for s in snapshot.signals 
            if s.confidence is not None
        ]
        avg_signal_confidence = sum(signal_confidences) / len(signal_confidences) if signal_confidences else 0.5
        
        # Rule coverage factor
        rule_coverage = rule_result.rules_triggered / max(rule_result.rules_evaluated, 1)
        
        # More rules triggered = more confident in assessment
        confidence = (avg_signal_confidence * 0.6) + (rule_coverage * 0.4)
        
        return min(max(confidence, 0.0), 1.0)

    def _build_evidence(
        self,
        snapshot: SignalSnapshot,
        rule_result: RuleSetEvaluationResult,
        graph_impacts: Dict[str, float]
    ) -> List[EvidenceItem]:
        """
        Build evidence items supporting the decision.
        """
        evidence: List[EvidenceItem] = []
        
        # Add critical signals as evidence
        for signal in self.signal_processor.get_critical_signals(snapshot.signals):
            evidence.append(EvidenceItem(
                source=signal.id,
                description=f"{signal.name}: {signal.value} ({signal.severity.value if signal.severity else 'N/A'})",
                weight=0.8 if signal.severity == SignalSeverity.CRITICAL else 0.6,
                direction=EvidenceDirection.SUPPORTS
            ))
        
        # Add triggered rules as evidence
        for result in rule_result.results:
            if result.triggered:
                evidence.append(EvidenceItem(
                    source=result.rule_id,
                    description=f"Rule triggered: {', '.join(result.conditions_met)}",
                    weight=result.risk_contribution,
                    direction=EvidenceDirection.SUPPORTS
                ))
        
        return evidence

    def _generate_recommendations(
        self,
        decision_type: DecisionType,
        risk_score: float,
        evidence: List[EvidenceItem]
    ) -> List[Recommendation]:
        """
        Generate actionable recommendations.
        """
        recommendations: List[Recommendation] = []
        
        if decision_type == DecisionType.ESCALATE:
            recommendations.append(Recommendation(
                action="Escalate to senior risk committee",
                rationale=f"Risk score of {risk_score:.2f} exceeds escalation threshold",
                priority=RecommendationPriority.IMMEDIATE,
                owner="Risk Committee"
            ))
        
        if decision_type == DecisionType.REVIEW:
            recommendations.append(Recommendation(
                action="Conduct detailed review",
                rationale="Multiple risk indicators require human assessment",
                priority=RecommendationPriority.HIGH,
                owner="Underwriting Team"
            ))
        
        if risk_score > 0.5:
            recommendations.append(Recommendation(
                action="Monitor signals closely",
                rationale="Elevated risk requires ongoing surveillance",
                priority=RecommendationPriority.MEDIUM,
                owner="Risk Monitoring"
            ))
        
        return recommendations

    def _generate_executive_summary(
        self,
        decision_type: DecisionType,
        risk_score: float,
        confidence: float
    ) -> str:
        """
        Generate a brief executive summary.
        """
        risk_level = Decision.calculate_risk_level(risk_score)
        confidence_level = Decision.calculate_confidence_level(confidence)
        
        return (
            f"Decision: {decision_type.value}. "
            f"Risk assessment: {risk_level.value} ({risk_score:.0%}). "
            f"Confidence: {confidence_level.value} ({confidence:.0%})."
        )

    def _generate_decision_id(self) -> str:
        """
        Generate a unique decision ID.
        """
        date_part = datetime.utcnow().strftime("%Y%m%d")
        random_part = ''.join(random.choices(string.ascii_uppercase, k=4))
        return f"DEC-{date_part}-{random_part}"

    def _log_audit_step(
        self,
        step: str,
        input_data: Optional[Dict[str, Any]],
        output_data: Optional[Dict[str, Any]]
    ) -> None:
        """
        Log an audit step.
        """
        self._audit_trail.append(AuditStep(
            step=step,
            timestamp=datetime.utcnow(),
            input=input_data,
            output=output_data
        ))
