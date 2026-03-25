"""Tests for the decision engine pipeline.

Covers all three decision paths, VERCEPT contract signatures,
and output contract compliance.
"""

import json
import os
import sys
import unittest

# Ensure project root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.rules import evaluate, evaluate_signal_risk
from core.simulation_engine import simulate
from core.agents import analyze, observe, weighted_risk
from core.engine import run
from core.contracts import validate_engine_output, validate_signals


# ---------------------------------------------------------------------------
# Signal fixtures
# ---------------------------------------------------------------------------

LOW_SIGNALS = {
    "oil_price": 80,
    "inflation": 2.5,
    "claims_rate": 0.3,
    "fraud_index": 0.2,
    "repair_cost_index": 0.9,
    "currency_volatility": 0.03,
    "region": "GCC",
    "timestamp": "2026-03-25T00:00:00Z",
}

MID_SIGNALS = {
    "oil_price": 96,
    "inflation": 3.6,
    "claims_rate": 0.45,
    "fraud_index": 0.3,
    "repair_cost_index": 1.0,
    "currency_volatility": 0.05,
    "region": "GCC",
    "timestamp": "2026-03-25T00:00:00Z",
}

HIGH_SIGNALS = {
    "oil_price": 120,
    "inflation": 5.5,
    "claims_rate": 0.8,
    "fraud_index": 0.9,
    "repair_cost_index": 1.8,
    "currency_volatility": 0.12,
    "region": "GCC",
    "timestamp": "2026-03-25T00:00:00Z",
}


# ---------------------------------------------------------------------------
# VERCEPT Signature Tests
# ---------------------------------------------------------------------------

class TestEvaluateSignature(unittest.TestCase):
    """VERCEPT contract: evaluate(signals: dict) -> float"""

    def test_returns_float(self):
        result = evaluate(LOW_SIGNALS)
        self.assertIsInstance(result, float)

    def test_low_signals_low_risk(self):
        self.assertLess(evaluate(LOW_SIGNALS), 0.3)

    def test_high_signals_high_risk(self):
        self.assertGreater(evaluate(HIGH_SIGNALS), 0.6)

    def test_score_capped_at_one(self):
        self.assertLessEqual(evaluate(HIGH_SIGNALS), 1.0)

    def test_backward_compat_alias(self):
        """evaluate_signal_risk should still work as alias."""
        self.assertEqual(evaluate(LOW_SIGNALS), evaluate_signal_risk(LOW_SIGNALS))


class TestSimulateSignature(unittest.TestCase):
    """VERCEPT contract: simulate(scenario: str, signals: dict) -> dict"""

    def test_accepts_string_scenario(self):
        result = simulate("oil_spike", HIGH_SIGNALS)
        self.assertEqual(result["active_scenario"], "oil_spike")

    def test_accepts_dict_scenario_backward_compat(self):
        scenario_dict = {
            "id": "oil_spike",
            "trigger_conditions": {"oil_price": {"operator": ">", "threshold": 95}},
            "severity_weights": {"oil_price_factor": 0.4, "inflation_factor": 0.3, "claims_factor": 0.3},
        }
        result = simulate(scenario_dict, HIGH_SIGNALS)
        self.assertEqual(result["active_scenario"], "oil_spike")

    def test_returns_required_keys(self):
        result = simulate("fraud_surge", HIGH_SIGNALS)
        for key in ("active_scenario", "impacted_domains", "severity", "simulated_changes"):
            self.assertIn(key, result)

    def test_unknown_scenario_raises(self):
        with self.assertRaises(ValueError):
            simulate("nonexistent_scenario", HIGH_SIGNALS)

    def test_all_scenarios_work(self):
        for sid in ("oil_spike", "fraud_surge", "repair_cost_inflation"):
            result = simulate(sid, HIGH_SIGNALS)
            self.assertEqual(result["active_scenario"], sid)


class TestAnalyzeSignature(unittest.TestCase):
    """VERCEPT contract: analyze(context: dict) -> dict"""

    def test_returns_dict(self):
        sim = simulate("oil_spike", HIGH_SIGNALS)
        result = analyze({"simulation_result": sim})
        self.assertIsInstance(result, dict)

    def test_has_observations_and_risk(self):
        sim = simulate("fraud_surge", HIGH_SIGNALS)
        result = analyze({"simulation_result": sim})
        self.assertIn("observations", result)
        self.assertIn("weighted_risk", result)

    def test_observations_are_list(self):
        sim = simulate("oil_spike", HIGH_SIGNALS)
        result = analyze({"simulation_result": sim})
        self.assertIsInstance(result["observations"], list)
        self.assertEqual(len(result["observations"]), 3)  # 3 agents

    def test_weighted_risk_is_float(self):
        sim = simulate("oil_spike", HIGH_SIGNALS)
        result = analyze({"simulation_result": sim})
        self.assertIsInstance(result["weighted_risk"], float)

    def test_accepts_flat_sim_result(self):
        """analyze() should also accept the sim result directly."""
        sim = simulate("oil_spike", HIGH_SIGNALS)
        result = analyze(sim)
        self.assertIn("observations", result)


# ---------------------------------------------------------------------------
# Engine run() Tests
# ---------------------------------------------------------------------------

class TestDecisionPaths(unittest.TestCase):
    """Verify APPROVE / REVIEW / ESCALATE paths."""

    def test_low_signals_approve(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "APPROVE")

    def test_mid_signals_review(self):
        result = run(signals=MID_SIGNALS, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "REVIEW")

    def test_high_signals_escalate(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "ESCALATE")


class TestRunSignature(unittest.TestCase):
    """VERCEPT contract: run(signals, input_path) -> dict"""

    def test_run_with_signals_dict(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("decision", result)

    def test_run_with_input_path(self):
        project = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path = os.path.join(project, "data", "signals.json")
        result = run(input_path=path, write_outputs=False)
        self.assertIn("decision", result)

    def test_run_canonical_default(self):
        result = run(write_outputs=False)
        self.assertIn("decision", result)

    def test_signals_takes_priority_over_path(self):
        """When both signals and input_path are given, signals wins."""
        project = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path = os.path.join(project, "data", "signals.json")
        result = run(signals=LOW_SIGNALS, input_path=path, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "APPROVE")


class TestOutputStructure(unittest.TestCase):
    """Verify output keys and contract compliance."""

    def setUp(self):
        self.result = run(signals=HIGH_SIGNALS, write_outputs=False)

    def test_top_level_keys(self):
        self.assertIn("simulation_result", self.result)
        self.assertIn("decision_trace", self.result)
        self.assertIn("decision", self.result)

    def test_simulation_result_keys(self):
        sr = self.result["simulation_result"]
        for key in ("active_scenario", "impacted_domains", "severity", "simulated_changes"):
            self.assertIn(key, sr)

    def test_decision_trace_keys(self):
        dt = self.result["decision_trace"]
        for key in ("input_signals", "detected_scenario", "graph_links_used",
                     "agent_observations", "final_risk_score", "final_decision", "confidence"):
            self.assertIn(key, dt)

    def test_decision_keys(self):
        d = self.result["decision"]
        for key in ("decision", "confidence", "summary"):
            self.assertIn(key, d)

    def test_contract_validation_passes(self):
        ok, errors = validate_engine_output(self.result)
        self.assertTrue(ok, f"Contract errors: {errors}")

    def test_decision_value_in_allowed_set(self):
        self.assertIn(
            self.result["decision"]["decision"],
            {"APPROVE", "REVIEW", "ESCALATE"},
        )


class TestCanonicalSignals(unittest.TestCase):
    """Verify canonical data/signals.json loads correctly."""

    def test_canonical_file_exists(self):
        project = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path = os.path.join(project, "data", "signals.json")
        self.assertTrue(os.path.isfile(path), "data/signals.json must exist")

    def test_canonical_file_valid(self):
        project = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path = os.path.join(project, "data", "signals.json")
        with open(path) as f:
            data = json.load(f)
        ok, errors = validate_signals(data)
        self.assertTrue(ok, f"Canonical signals invalid: {errors}")

    def test_engine_runs_from_canonical_file(self):
        """Engine should run with no args (reads canonical file)."""
        result = run(write_outputs=False)
        ok, errors = validate_engine_output(result)
        self.assertTrue(ok, f"Contract errors: {errors}")


class TestNoScenarioPath(unittest.TestCase):
    """Verify graceful handling when no scenario triggers."""

    def test_no_scenario_returns_valid_output(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        self.assertIsNone(result["simulation_result"]["active_scenario"])
        self.assertEqual(result["simulation_result"]["impacted_domains"], [])
        ok, errors = validate_engine_output(result)
        self.assertTrue(ok, f"Contract errors: {errors}")


if __name__ == "__main__":
    unittest.main()
