"""DEEVO Cortex-v2 Rules Engine

This module contains the evaluation and decision logic for the
decision intelligence system.
"""

import json


def evaluate(signals: dict) -> float:
    """Evaluate risk based on input signals.
    
    Args:
        signals: Dictionary containing signal values
                 (inflation, claims_rate, etc.)
    
    Returns:
        Risk score between 0 and 1
    """
    risk = 0.0

    if signals.get("inflation", 0) > 3:
        risk += 0.2

    if signals.get("claims_rate", 0) > 0.5:
        risk += 0.3

    if signals.get("oil_price", 0) > 90:
        risk += 0.15

    return min(risk, 1.0)  # Cap at 1.0


def decide(risk: float) -> dict:
    """Make a decision based on risk score.
    
    Args:
        risk: Risk score between 0 and 1
    
    Returns:
        Decision dictionary with action and confidence
    """
    if risk > 0.6:
        decision = "ESCALATE"
        confidence = 0.9
    elif risk > 0.3:
        decision = "REVIEW"
        confidence = 0.75
    else:
        decision = "APPROVE"
        confidence = 0.85
    
    return {
        "decision": decision,
        "confidence": round(confidence, 2),
        "risk_score": round(risk, 2)
    }


def run_decision_engine(signals_path: str = "data/signals.json") -> dict:
    """Run the complete decision engine pipeline.
    
    Args:
        signals_path: Path to signals JSON file
    
    Returns:
        Final decision output
    """
    # Load signals
    with open(signals_path, 'r') as f:
        signals = json.load(f)
    
    # Evaluate risk
    risk = evaluate(signals)
    
    # Make decision
    output = decide(risk)
    output["input_signals"] = signals
    
    return output


if __name__ == "__main__":
    import os
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    signals_path = os.path.join(project_dir, "data", "signals.json")
    
    result = run_decision_engine(signals_path)
    print(json.dumps(result, indent=2))
