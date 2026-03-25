"""
DEEVO Cortex - Simulation Engine
Scenario simulation and stress testing
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
import uuid
import random
import copy

from ...models import (
    Scenario, ScenarioType, ScenarioStatus, SignalOverride, ChangeType,
    SimulationResult, AffectedNode, Distribution,
    Signal, SignalSnapshot,
    Decision, DecisionContext,
    Graph
)
from ..decision.engine import DecisionEngine


class SimulationEngine:
    """
    Runs scenario simulations and stress tests.
    """

    def __init__(self, decision_engine: DecisionEngine):
        self.decision_engine = decision_engine

    def run_scenario(
        self,
        scenario: Scenario,
        baseline_signals: List[Signal]
    ) -> SimulationResult:
        """
        Run a single scenario simulation.
        """
        start_time = datetime.utcnow()
        
        # Get baseline decision
        baseline_decision = self.decision_engine.make_decision(
            baseline_signals,
            DecisionContext(scenario_id=f"{scenario.scenario_id}_baseline")
        )
        
        # Apply overrides to create simulated signals
        simulated_signals = self._apply_overrides(baseline_signals, scenario.overrides)
        
        # Get simulated decision
        simulated_decision = self.decision_engine.make_decision(
            simulated_signals,
            DecisionContext(scenario_id=scenario.scenario_id)
        )
        
        # Calculate affected nodes
        affected_nodes = self._calculate_affected_nodes(
            baseline_signals, 
            simulated_signals
        )
        
        # Generate insights
        insights = self._generate_insights(
            baseline_decision, 
            simulated_decision, 
            scenario
        )
        
        end_time = datetime.utcnow()
        duration_ms = int((end_time - start_time).total_seconds() * 1000)
        
        return SimulationResult(
            result_id=str(uuid.uuid4()),
            scenario_id=scenario.scenario_id,
            timestamp=end_time,
            duration_ms=duration_ms,
            baseline_decision=baseline_decision,
            simulated_decision=simulated_decision,
            risk_delta=simulated_decision.risk_score - baseline_decision.risk_score,
            affected_nodes=affected_nodes,
            insights=insights
        )

    def run_monte_carlo(
        self,
        scenario: Scenario,
        baseline_signals: List[Signal],
        iterations: int = 1000
    ) -> SimulationResult:
        """
        Run Monte Carlo simulation with random variations.
        """
        start_time = datetime.utcnow()
        
        # Get baseline
        baseline_decision = self.decision_engine.make_decision(
            baseline_signals,
            DecisionContext(scenario_id=f"{scenario.scenario_id}_baseline")
        )
        
        # Run iterations
        risk_scores: List[float] = []
        
        for i in range(iterations):
            # Apply overrides with random variation
            varied_overrides = self._add_random_variation(scenario.overrides)
            simulated_signals = self._apply_overrides(baseline_signals, varied_overrides)
            
            decision = self.decision_engine.make_decision(
                simulated_signals,
                DecisionContext(scenario_id=f"{scenario.scenario_id}_iter_{i}")
            )
            
            risk_scores.append(decision.risk_score)
        
        # Calculate distribution
        distribution = self._calculate_distribution(risk_scores)
        
        # Get representative simulated decision (median case)
        median_idx = len(risk_scores) // 2
        sorted_scores = sorted(risk_scores)
        median_score = sorted_scores[median_idx]
        
        end_time = datetime.utcnow()
        duration_ms = int((end_time - start_time).total_seconds() * 1000)
        
        return SimulationResult(
            result_id=str(uuid.uuid4()),
            scenario_id=scenario.scenario_id,
            timestamp=end_time,
            duration_ms=duration_ms,
            baseline_decision=baseline_decision,
            risk_delta=distribution.mean - baseline_decision.risk_score,
            distribution=distribution,
            insights=[
                f"Monte Carlo simulation with {iterations} iterations",
                f"Mean risk: {distribution.mean:.2%}",
                f"95th percentile risk: {distribution.percentiles['p95']:.2%}" if distribution.percentiles else "",
                f"Risk increased by {(distribution.mean - baseline_decision.risk_score):.2%} on average"
            ]
        )

    def run_sensitivity_analysis(
        self,
        baseline_signals: List[Signal],
        signal_id: str,
        variation_range: tuple = (-0.5, 0.5),
        steps: int = 10
    ) -> List[SimulationResult]:
        """
        Analyze sensitivity of decisions to a specific signal.
        """
        results: List[SimulationResult] = []
        
        # Find the signal
        target_signal = next(
            (s for s in baseline_signals if s.id == signal_id), 
            None
        )
        
        if not target_signal:
            return results
        
        base_value = target_signal.value
        step_size = (variation_range[1] - variation_range[0]) / steps
        
        for i in range(steps + 1):
            variation = variation_range[0] + (step_size * i)
            new_value = base_value * (1 + variation)
            
            override = SignalOverride(
                signal_id=signal_id,
                original_value=base_value,
                new_value=new_value,
                change_type=ChangeType.ABSOLUTE
            )
            
            scenario = Scenario(
                scenario_id=f"SCN-SEN-{i:04d}",
                name=f"Sensitivity {signal_id} {variation:+.0%}",
                type=ScenarioType.SENSITIVITY,
                overrides=[override]
            )
            
            result = self.run_scenario(scenario, baseline_signals)
            results.append(result)
        
        return results

    def run_stress_test(
        self,
        baseline_signals: List[Signal],
        stress_multipliers: Dict[str, float]
    ) -> SimulationResult:
        """
        Run a stress test with multiple signal shocks.
        """
        overrides: List[SignalOverride] = []
        
        for signal in baseline_signals:
            if signal.id in stress_multipliers:
                multiplier = stress_multipliers[signal.id]
                overrides.append(SignalOverride(
                    signal_id=signal.id,
                    original_value=signal.value,
                    new_value=signal.value * multiplier,
                    change_type=ChangeType.ABSOLUTE
                ))
        
        scenario = Scenario(
            scenario_id=f"SCN-STR-{datetime.utcnow().strftime('%H%M')}",
            name="Stress Test",
            description=f"Stress test with {len(overrides)} signal shocks",
            type=ScenarioType.STRESS_TEST,
            overrides=overrides
        )
        
        return self.run_scenario(scenario, baseline_signals)

    def _apply_overrides(
        self,
        signals: List[Signal],
        overrides: List[SignalOverride]
    ) -> List[Signal]:
        """
        Apply signal overrides to create simulated signals.
        """
        override_map = {o.signal_id: o for o in overrides}
        simulated: List[Signal] = []
        
        for signal in signals:
            if signal.id in override_map:
                override = override_map[signal.id]
                new_signal = signal.model_copy()
                
                if override.change_type == ChangeType.ABSOLUTE:
                    new_signal.value = override.new_value
                elif override.change_type == ChangeType.PERCENTAGE:
                    new_signal.value = signal.value * (1 + override.new_value / 100)
                elif override.change_type == ChangeType.DELTA:
                    new_signal.value = signal.value + override.new_value
                
                simulated.append(new_signal)
            else:
                simulated.append(signal.model_copy())
        
        return simulated

    def _add_random_variation(
        self,
        overrides: List[SignalOverride],
        variation_pct: float = 0.1
    ) -> List[SignalOverride]:
        """
        Add random variation to overrides for Monte Carlo.
        """
        varied: List[SignalOverride] = []
        
        for override in overrides:
            variation = random.uniform(-variation_pct, variation_pct)
            new_value = override.new_value * (1 + variation)
            
            varied.append(SignalOverride(
                signal_id=override.signal_id,
                original_value=override.original_value,
                new_value=new_value,
                change_type=override.change_type
            ))
        
        return varied

    def _calculate_affected_nodes(
        self,
        baseline: List[Signal],
        simulated: List[Signal]
    ) -> List[AffectedNode]:
        """
        Calculate which nodes were affected by the simulation.
        """
        affected: List[AffectedNode] = []
        
        baseline_map = {s.id: s.value for s in baseline}
        simulated_map = {s.id: s.value for s in simulated}
        
        for signal_id, sim_value in simulated_map.items():
            base_value = baseline_map.get(signal_id, 0)
            if base_value != sim_value:
                impact = (sim_value - base_value) / base_value if base_value != 0 else 0
                affected.append(AffectedNode(
                    node_id=signal_id,
                    original_value=base_value,
                    simulated_value=sim_value,
                    impact=impact
                ))
        
        return affected

    def _calculate_distribution(self, values: List[float]) -> Distribution:
        """
        Calculate distribution statistics.
        """
        n = len(values)
        mean = sum(values) / n
        variance = sum((x - mean) ** 2 for x in values) / n
        std_dev = variance ** 0.5
        
        sorted_values = sorted(values)
        
        def percentile(p: float) -> float:
            idx = int(p * n)
            return sorted_values[min(idx, n - 1)]
        
        return Distribution(
            mean=mean,
            std_dev=std_dev,
            percentiles={
                "p5": percentile(0.05),
                "p25": percentile(0.25),
                "p50": percentile(0.50),
                "p75": percentile(0.75),
                "p95": percentile(0.95)
            }
        )

    def _generate_insights(
        self,
        baseline: Decision,
        simulated: Decision,
        scenario: Scenario
    ) -> List[str]:
        """
        Generate insights from simulation comparison.
        """
        insights: List[str] = []
        
        risk_delta = simulated.risk_score - baseline.risk_score
        
        if risk_delta > 0.2:
            insights.append(f"CRITICAL: Risk increased significantly by {risk_delta:.0%}")
        elif risk_delta > 0.1:
            insights.append(f"WARNING: Risk increased by {risk_delta:.0%}")
        elif risk_delta < -0.1:
            insights.append(f"POSITIVE: Risk decreased by {abs(risk_delta):.0%}")
        
        if baseline.type != simulated.type:
            insights.append(
                f"Decision changed from {baseline.type.value} to {simulated.type.value}"
            )
        
        # Analyze which overrides had most impact
        if scenario.overrides:
            insights.append(
                f"Scenario applied {len(scenario.overrides)} signal override(s)"
            )
        
        return insights
