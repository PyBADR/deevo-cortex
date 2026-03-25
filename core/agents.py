"""DEEVO Cortex — Analyst Agents

Three analyst roles observe simulation results and produce
independent assessments that feed into the final decision.
"""

from typing import Dict, List


# ---------------------------------------------------------------------------
# Agent definitions
# ---------------------------------------------------------------------------

AGENTS = {
    "risk_analyst": {
        "role": "risk_analyst",
        "focus_domains": ["loss_ratio", "reserves", "pricing"],
        "weight": 0.40,
    },
    "claims_analyst": {
        "role": "claims_analyst",
        "focus_domains": ["claims", "repair_cost", "reserves"],
        "weight": 0.35,
    },
    "fraud_analyst": {
        "role": "fraud_analyst",
        "focus_domains": ["fraud", "investigation"],
        "weight": 0.25,
    },
}


# ---------------------------------------------------------------------------
# Observation logic
# ---------------------------------------------------------------------------

def _domain_risk(sim_changes: dict, focus_domains: List[str]) -> float:
    """Average magnitude across an agent's focus domains."""
    relevant = [
        sim_changes[d]["magnitude"]
        for d in focus_domains
        if d in sim_changes
    ]
    if not relevant:
        return 0.0
    return round(sum(relevant) / len(relevant), 4)


def _generate_note(role: str, scenario_id: str, risk: float) -> str:
    """Produce a short analyst observation string."""
    level = "HIGH" if risk > 0.7 else "MODERATE" if risk > 0.4 else "LOW"
    templates = {
        "risk_analyst": f"Portfolio risk {level} under {scenario_id}. Simulated magnitude {risk:.2f}. "
                        f"{'Reserve adequacy review recommended.' if risk > 0.5 else 'Within risk appetite.'}",
        "claims_analyst": f"Claims impact {level}. Expected cost movement {risk:.2f}. "
                          f"{'Recommend claims triage escalation.' if risk > 0.5 else 'Standard processing.'}",
        "fraud_analyst": f"Fraud exposure {level}. Indicator strength {risk:.2f}. "
                         f"{'Flag for SIU review.' if risk > 0.5 else 'Routine monitoring sufficient.'}",
    }
    return templates.get(role, f"Agent {role}: risk={risk:.2f}")


def observe(simulation_result: dict) -> List[dict]:
    """Each agent observes the simulation and returns an assessment."""
    sim_changes = simulation_result.get("simulated_changes", {})
    scenario_id = simulation_result.get("active_scenario", "unknown")
    observations = []

    for agent_id, agent_def in AGENTS.items():
        risk = _domain_risk(sim_changes, agent_def["focus_domains"])
        note = _generate_note(agent_def["role"], scenario_id, risk)
        observations.append({
            "agent": agent_def["role"],
            "focus_domains": agent_def["focus_domains"],
            "assessed_risk": risk,
            "weight": agent_def["weight"],
            "observation": note,
        })

    return observations


def weighted_risk(observations: List[dict]) -> float:
    """Combine agent observations into a single weighted risk score."""
    total_weight = sum(o["weight"] for o in observations)
    if total_weight == 0:
        return 0.0
    score = sum(o["assessed_risk"] * o["weight"] for o in observations) / total_weight
    return round(score, 4)


# ---------------------------------------------------------------------------
# VERCEPT integration interface
# ---------------------------------------------------------------------------

def analyze(context: dict) -> dict:
    """Run all analyst agents on a simulation context and return combined result.

    VERCEPT contract: analyze(context: dict) -> dict

    Args:
        context: Must contain a "simulation_result" key with the output
                 of simulation_engine.simulate().

    Returns:
        dict with keys:
            - observations: list of per-agent assessments
            - weighted_risk: combined risk score (0..1)
    """
    simulation_result = context.get("simulation_result", context)
    observations = observe(simulation_result)
    combined_risk = weighted_risk(observations)
    return {
        "observations": observations,
        "weighted_risk": combined_risk,
    }
