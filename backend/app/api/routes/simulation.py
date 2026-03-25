"""
DEEVO Cortex - Simulation API Routes
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from datetime import datetime

from ...models import (
    Signal, Scenario, ScenarioType, SimulationResult,
    SignalOverride, SensitivityAnalysis
)
from ...engine.decision.engine import DecisionEngine
from ...engine.simulation.simulator import SimulationEngine

router = APIRouter(prefix="/simulation", tags=["Simulation"])

# Global instances
decision_engine = DecisionEngine()
simulation_engine = SimulationEngine(decision_engine)

# In-memory stores
scenario_store: Dict[str, Scenario] = {}
result_store: Dict[str, SimulationResult] = {}


@router.post("/scenarios", response_model=Scenario)
async def create_scenario(scenario: Scenario):
    """
    Create a new simulation scenario.
    """
    scenario_store[scenario.scenario_id] = scenario
    return scenario


@router.get("/scenarios", response_model=List[Scenario])
async def list_scenarios():
    """
    List all scenarios.
    """
    return list(scenario_store.values())


@router.get("/scenarios/{scenario_id}", response_model=Scenario)
async def get_scenario(scenario_id: str):
    """
    Get a specific scenario.
    """
    if scenario_id not in scenario_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario_store[scenario_id]


@router.post("/run/{scenario_id}", response_model=SimulationResult)
async def run_scenario(scenario_id: str, baseline_signals: List[Signal]):
    """
    Run a scenario simulation.
    """
    if scenario_id not in scenario_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    scenario = scenario_store[scenario_id]
    
    try:
        result = simulation_engine.run_scenario(scenario, baseline_signals)
        result_store[result.result_id] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/monte-carlo/{scenario_id}", response_model=SimulationResult)
async def run_monte_carlo(
    scenario_id: str, 
    baseline_signals: List[Signal],
    iterations: int = 1000
):
    """
    Run Monte Carlo simulation.
    """
    if scenario_id not in scenario_store:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    scenario = scenario_store[scenario_id]
    
    try:
        result = simulation_engine.run_monte_carlo(
            scenario, 
            baseline_signals, 
            iterations
        )
        result_store[result.result_id] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/stress-test", response_model=SimulationResult)
async def run_stress_test(
    baseline_signals: List[Signal],
    stress_multipliers: Dict[str, float]
):
    """
    Run a stress test with signal shocks.
    """
    try:
        result = simulation_engine.run_stress_test(
            baseline_signals,
            stress_multipliers
        )
        result_store[result.result_id] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/sensitivity", response_model=List[SimulationResult])
async def run_sensitivity_analysis(
    baseline_signals: List[Signal],
    signal_id: str,
    variation_min: float = -0.5,
    variation_max: float = 0.5,
    steps: int = 10
):
    """
    Run sensitivity analysis on a specific signal.
    """
    try:
        results = simulation_engine.run_sensitivity_analysis(
            baseline_signals,
            signal_id,
            (variation_min, variation_max),
            steps
        )
        for result in results:
            result_store[result.result_id] = result
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/results/{result_id}", response_model=SimulationResult)
async def get_result(result_id: str):
    """
    Get a specific simulation result.
    """
    if result_id not in result_store:
        raise HTTPException(status_code=404, detail="Result not found")
    return result_store[result_id]


@router.get("/results", response_model=List[SimulationResult])
async def list_results(limit: int = 50):
    """
    List recent simulation results.
    """
    results = list(result_store.values())
    return sorted(results, key=lambda r: r.timestamp, reverse=True)[:limit]
