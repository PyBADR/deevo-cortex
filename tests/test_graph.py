"""Tests for graph engine, adapter, and canonical graph.json.

Verifies VERCEPT integration surface for the GCC graph layer.
"""

import json
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.graph_engine import get_graph_state, propagate
from core import graph_adapter


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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

LOW_SIGNALS = {
    "oil_price": 84,
    "inflation": 2.4,
    "claims_rate": 0.3,
    "fraud_index": 0.2,
    "repair_cost_index": 0.95,
    "interest_rate": 5.0,
    "supply_chain_stress": 0.25,
}


# ---------------------------------------------------------------------------
# Canonical graph.json
# ---------------------------------------------------------------------------

class TestCanonicalGraph(unittest.TestCase):

    def test_file_exists(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        self.assertTrue(os.path.isfile(path))

    def test_loads_valid_json(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        with open(path) as f:
            data = json.load(f)
        self.assertIn("nodes", data)
        self.assertIn("edges", data)

    def test_node_count(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        with open(path) as f:
            data = json.load(f)
        self.assertEqual(len(data["nodes"]), 14)

    def test_edge_count(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        with open(path) as f:
            data = json.load(f)
        self.assertEqual(len(data["edges"]), 25)

    def test_node_structure(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        with open(path) as f:
            data = json.load(f)
        node = data["nodes"][0]
        self.assertIn("id", node)
        self.assertIn("label", node)
        self.assertIn("type", node)

    def test_edge_structure(self):
        path = os.path.join(PROJECT_ROOT, "data", "graph.json")
        with open(path) as f:
            data = json.load(f)
        edge = data["edges"][0]
        for key in ("source", "target", "weight", "relation_type", "direction"):
            self.assertIn(key, edge)


# ---------------------------------------------------------------------------
# graph_engine.get_graph_state
# ---------------------------------------------------------------------------

class TestGetGraphState(unittest.TestCase):

    def test_returns_dict(self):
        result = get_graph_state(signals=HIGH_SIGNALS)
        self.assertIsInstance(result, dict)

    def test_has_required_keys(self):
        result = get_graph_state(signals=HIGH_SIGNALS)
        for key in ("active_nodes", "affected_countries", "affected_sectors",
                     "affected_insurance_lines", "weighted_impacts"):
            self.assertIn(key, result)

    def test_active_nodes_are_list(self):
        result = get_graph_state(signals=HIGH_SIGNALS)
        self.assertIsInstance(result["active_nodes"], list)

    def test_high_signals_produce_impacts(self):
        result = get_graph_state(signals=HIGH_SIGNALS)
        self.assertGreater(len(result["active_nodes"]), 0)
        self.assertGreater(len(result["weighted_impacts"]), 0)

    def test_low_signals_produce_no_impacts(self):
        result = get_graph_state(signals=LOW_SIGNALS)
        self.assertEqual(len(result["active_nodes"]), 0)

    def test_country_filter(self):
        result = get_graph_state(signals=HIGH_SIGNALS, country_id="SA")
        self.assertIsInstance(result, dict)

    def test_lob_filter(self):
        result = get_graph_state(signals=HIGH_SIGNALS, lob="motor")
        self.assertIsInstance(result, dict)

    def test_defaults_to_canonical_signals(self):
        """get_graph_state() with no args should not raise."""
        result = get_graph_state()
        self.assertIn("active_nodes", result)


# ---------------------------------------------------------------------------
# graph_engine.propagate
# ---------------------------------------------------------------------------

class TestPropagate(unittest.TestCase):

    def test_oil_price_returns_dict(self):
        result = propagate("oil_price", signals=HIGH_SIGNALS)
        self.assertIsInstance(result, dict)

    def test_returns_both_keys(self):
        result = propagate("oil_price", signals=HIGH_SIGNALS)
        self.assertIn("graph_state", result)
        self.assertIn("propagation_trace", result)

    def test_graph_state_structure(self):
        result = propagate("oil_price", signals=HIGH_SIGNALS)
        gs = result["graph_state"]
        for key in ("active_nodes", "affected_countries", "affected_sectors",
                     "affected_insurance_lines", "weighted_impacts"):
            self.assertIn(key, gs)

    def test_propagation_trace_structure(self):
        result = propagate("oil_price", signals=HIGH_SIGNALS)
        pt = result["propagation_trace"]
        for key in ("root_signal", "traversal_path", "edge_weights_used",
                     "impacted_nodes_in_order", "final_pressure_summary"):
            self.assertIn(key, pt)

    def test_explicit_value(self):
        result = propagate("oil_price", value=1.5, signals=HIGH_SIGNALS)
        self.assertIn("oil_price", result["propagation_trace"]["root_signal"])

    def test_fraud_source(self):
        result = propagate("fraud_alerts", signals=HIGH_SIGNALS)
        self.assertGreater(len(result["graph_state"]["active_nodes"]), 0)

    def test_all_source_nodes(self):
        for src in ("oil_price", "inflation", "interest_rate",
                     "supply_chain_stress", "fraud_alerts", "repair_cost_index"):
            result = propagate(src, value=1.0, signals=HIGH_SIGNALS)
            self.assertIn("graph_state", result, f"Failed for source: {src}")


# ---------------------------------------------------------------------------
# graph_adapter (VERCEPT integration surface)
# ---------------------------------------------------------------------------

class TestGraphAdapter(unittest.TestCase):

    def test_get_graph_state_matches_engine(self):
        from core.graph_engine import get_graph_state as eng_fn
        eng = eng_fn(signals=HIGH_SIGNALS)
        adp = graph_adapter.get_graph_state(signals=HIGH_SIGNALS)
        self.assertEqual(eng, adp)

    def test_propagate_matches_engine(self):
        from core.graph_engine import propagate as eng_fn
        eng = eng_fn("oil_price", value=1.0, signals=HIGH_SIGNALS)
        adp = graph_adapter.propagate("oil_price", value=1.0, signals=HIGH_SIGNALS)
        self.assertEqual(eng, adp)

    def test_adapter_returns_serializable(self):
        """Ensure adapter output survives JSON round-trip."""
        result = graph_adapter.propagate("oil_price", signals=HIGH_SIGNALS)
        roundtripped = json.loads(json.dumps(result))
        self.assertEqual(result, roundtripped)

    def test_adapter_get_graph_state_serializable(self):
        result = graph_adapter.get_graph_state(signals=HIGH_SIGNALS)
        roundtripped = json.loads(json.dumps(result))
        self.assertEqual(result, roundtripped)


if __name__ == "__main__":
    unittest.main()
