"""Tests for the unified intelligence engine.

Verifies that the single orchestrator produces all five output keys
and that the GCC graph propagation influences the decision path.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.unified_engine import run, _resolve_signals, SIGNAL_DEFAULTS


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

HIGH_SIGNALS = {
    "oil_price": 120,
    "inflation": 5.5,
    "claims_rate": 0.8,
    "fraud_index": 0.9,
    "repair_cost_index": 1.8,
    "interest_rate": 6.0,
    "supply_chain_stress": 0.7,
    "currency_volatility": 0.12,
}

MEDIUM_SIGNALS = {
    "oil_price": 105,
    "inflation": 4.2,
    "claims_rate": 0.62,
    "fraud_index": 0.74,
    "repair_cost_index": 1.35,
    "currency_volatility": 0.08,
}

LOW_SIGNALS = {
    "oil_price": 84,
    "inflation": 2.4,
    "claims_rate": 0.3,
    "fraud_index": 0.2,
    "repair_cost_index": 0.95,
    "interest_rate": 5.0,
    "supply_chain_stress": 0.25,
}

REQUIRED_TOP_KEYS = [
    "simulation_result",
    "decision_trace",
    "decision",
    "graph_state",
    "propagation_trace",
]


# ---------------------------------------------------------------------------
# Signal resolution
# ---------------------------------------------------------------------------

class TestSignalResolution(unittest.TestCase):

    def test_defaults_injected_for_missing_keys(self):
        minimal = {"oil_price": 90, "inflation": 3.0}
        resolved = _resolve_signals(minimal)
        self.assertIn("interest_rate", resolved)
        self.assertIn("supply_chain_stress", resolved)
        self.assertEqual(resolved["interest_rate"], SIGNAL_DEFAULTS["interest_rate"])

    def test_explicit_values_not_overridden(self):
        signals = {"interest_rate": 7.0, "supply_chain_stress": 0.9}
        resolved = _resolve_signals(signals)
        self.assertEqual(resolved["interest_rate"], 7.0)
        self.assertEqual(resolved["supply_chain_stress"], 0.9)

    def test_canonical_file_loads(self):
        resolved = _resolve_signals()
        self.assertIn("oil_price", resolved)

    def test_input_dict_not_mutated(self):
        original = {"oil_price": 100}
        _resolve_signals(original)
        self.assertNotIn("interest_rate", original)


# ---------------------------------------------------------------------------
# Unified output structure
# ---------------------------------------------------------------------------

class TestUnifiedOutputStructure(unittest.TestCase):

    def test_high_signals_returns_all_keys(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result, f"Missing top-level key: {key}")

    def test_medium_signals_returns_all_keys(self):
        result = run(signals=MEDIUM_SIGNALS, write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result, f"Missing top-level key: {key}")

    def test_low_signals_returns_all_keys(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result, f"Missing top-level key: {key}")

    def test_canonical_signals_returns_all_keys(self):
        result = run(write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result, f"Missing top-level key: {key}")


# ---------------------------------------------------------------------------
# Decision paths
# ---------------------------------------------------------------------------

class TestDecisionPaths(unittest.TestCase):

    def test_high_signals_escalate(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "ESCALATE")

    def test_low_signals_approve(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        self.assertEqual(result["decision"]["decision"], "APPROVE")

    def test_medium_signals_review_or_escalate(self):
        result = run(signals=MEDIUM_SIGNALS, write_outputs=False)
        self.assertIn(result["decision"]["decision"], ("REVIEW", "ESCALATE"))

    def test_decision_has_confidence(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("confidence", result["decision"])
        self.assertGreater(result["decision"]["confidence"], 0)

    def test_decision_has_summary(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("summary", result["decision"])
        self.assertIsInstance(result["decision"]["summary"], str)


# ---------------------------------------------------------------------------
# Simulation result structure
# ---------------------------------------------------------------------------

class TestSimulationResult(unittest.TestCase):

    def test_has_active_scenario(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        sr = result["simulation_result"]
        self.assertIn("active_scenario", sr)

    def test_high_signals_trigger_scenario(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIsNotNone(result["simulation_result"]["active_scenario"])

    def test_low_signals_no_scenario(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        self.assertIsNone(result["simulation_result"]["active_scenario"])

    def test_simulated_changes_from_propagation(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        changes = result["simulation_result"]["simulated_changes"]
        # Changes should be derived from propagation, not empty
        self.assertGreater(len(changes), 0)

    def test_impacted_domains_populated(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        domains = result["simulation_result"]["impacted_domains"]
        self.assertGreater(len(domains), 0)


# ---------------------------------------------------------------------------
# Decision trace
# ---------------------------------------------------------------------------

class TestDecisionTrace(unittest.TestCase):

    def test_has_trace_hash(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("trace_hash", result["decision_trace"])
        self.assertEqual(len(result["decision_trace"]["trace_hash"]), 64)

    def test_has_agent_observations(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        obs = result["decision_trace"]["agent_observations"]
        self.assertIsInstance(obs, list)
        # Should have observations when a scenario is active
        self.assertGreater(len(obs), 0)

    def test_has_final_risk_score(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("final_risk_score", result["decision_trace"])

    def test_has_timestamp(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("timestamp", result["decision_trace"])

    def test_input_signals_recorded(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        recorded = result["decision_trace"]["input_signals"]
        self.assertEqual(recorded["oil_price"], 120)


# ---------------------------------------------------------------------------
# Graph state
# ---------------------------------------------------------------------------

class TestGraphState(unittest.TestCase):

    def test_high_signals_produce_active_nodes(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        gs = result["graph_state"]
        self.assertGreater(len(gs["active_nodes"]), 0)

    def test_low_signals_produce_no_active_nodes(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        gs = result["graph_state"]
        self.assertEqual(len(gs["active_nodes"]), 0)

    def test_graph_state_has_required_keys(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        gs = result["graph_state"]
        for key in ("active_nodes", "affected_countries", "affected_sectors",
                     "affected_insurance_lines", "weighted_impacts"):
            self.assertIn(key, gs, f"Missing graph_state key: {key}")

    def test_all_gcc_countries_affected_for_high(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        countries = result["graph_state"]["affected_countries"]
        self.assertEqual(len(countries), 6)

    def test_insurance_lines_affected_for_high(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        lines = result["graph_state"]["affected_insurance_lines"]
        self.assertGreater(len(lines), 0)


# ---------------------------------------------------------------------------
# Propagation trace
# ---------------------------------------------------------------------------

class TestPropagationTrace(unittest.TestCase):

    def test_has_traversal_path(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertIn("traversal_path", pt)
        self.assertGreater(len(pt["traversal_path"]), 0)

    def test_has_edge_weights(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertIn("edge_weights_used", pt)
        self.assertGreater(len(pt["edge_weights_used"]), 0)

    def test_has_pressure_summary(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertIn("final_pressure_summary", pt)

    def test_low_signals_empty_traversal(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertEqual(len(pt["traversal_path"]), 0)


# ---------------------------------------------------------------------------
# Graph propagation influences decision
# ---------------------------------------------------------------------------

class TestGraphInfluencesDecision(unittest.TestCase):

    def test_graph_boost_increases_risk(self):
        """When propagation produces extreme pressure (>1.5), the graph
        boost should amplify the final risk score."""
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        risk = result["decision_trace"]["final_risk_score"]
        # High signals should produce risk well above the review threshold
        self.assertGreater(risk, 0.65)

    def test_propagation_domains_appear_in_simulation(self):
        """Impacted domains in simulation_result should come from
        propagation, not from the legacy flat graph."""
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        sim_domains = set(result["simulation_result"]["impacted_domains"])
        graph_nodes = set(result["graph_state"]["active_nodes"])
        # Graph active nodes should be a subset of simulation domains
        # (active_nodes are non-root impacted; simulation includes roots)
        self.assertTrue(
            graph_nodes.issubset(sim_domains),
            f"Graph nodes {graph_nodes - sim_domains} missing from simulation domains"
        )

    def test_graph_links_from_weighted_traversal(self):
        """graph_links_used in simulation_result should come from the
        weighted GCC traversal, not the legacy flat graph."""
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        links = result["simulation_result"]["graph_links_used"]
        self.assertGreater(len(links), 0)
        # Should contain edges from the 14-node graph, not just 9-node legacy
        link_set = set(links)
        # The weighted graph has edges like "supply_chain_stress -> repair_cost_index"
        # which don't exist in the legacy flat graph
        self.assertTrue(
            any("supply_chain_stress" in l for l in links),
            "Expected weighted graph edges (supply_chain_stress) in links"
        )


# ---------------------------------------------------------------------------
# Country / LoB filtering
# ---------------------------------------------------------------------------

class TestFiltering(unittest.TestCase):

    def test_country_filter_accepted(self):
        result = run(signals=HIGH_SIGNALS, country_id="SA", write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result)

    def test_lob_filter_accepted(self):
        result = run(signals=HIGH_SIGNALS, lob="motor", write_outputs=False)
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result)

    def test_country_and_lob_combined(self):
        result = run(
            signals=HIGH_SIGNALS, country_id="AE", lob="property",
            write_outputs=False,
        )
        for key in REQUIRED_TOP_KEYS:
            self.assertIn(key, result)


# ---------------------------------------------------------------------------
# JSON serialisability
# ---------------------------------------------------------------------------

class TestSerialisability(unittest.TestCase):

    def test_full_output_serialisable(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        roundtripped = json.loads(json.dumps(result))
        self.assertEqual(result, roundtripped)

    def test_low_output_serialisable(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        roundtripped = json.loads(json.dumps(result))
        self.assertEqual(result, roundtripped)


if __name__ == "__main__":
    unittest.main()
