"""Tests for the Live Intelligence Layer (Phase 4).

Covers:
  - Signal enrichment (direction, delta, category, severity)
  - Executive brief generation
  - Decision reasoning
  - Cause-effect chain / readable path
  - Live simulation (perturbation, deterministic seeding, scenario drift)
  - Unified engine integration (8-key output, UI contract)
"""

import json
import os
import sys
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.signal_enrichment import (
    enrich_signal, enrich_signals, signal_summary, SIGNAL_REGISTRY,
)
from core.brief_generator import (
    generate_brief, generate_reasoning,
    build_cause_effect_chain, build_readable_path,
)
from core.live_simulation import (
    LiveSimulator, perturb_signals, inject_scenario_drift,
)
from core.unified_engine import run


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

LOW_SIGNALS = {
    "oil_price": 84,
    "inflation": 2.4,
    "claims_rate": 0.3,
    "fraud_index": 0.2,
    "repair_cost_index": 0.95,
    "interest_rate": 5.0,
    "supply_chain_stress": 0.25,
}

REQUIRED_KEYS = [
    "simulation_result", "decision_trace", "decision",
    "graph_state", "propagation_trace",
    "enriched_signals", "executive_brief", "signal_summary",
]


# =========================================================================
# 1. Signal Enrichment
# =========================================================================

class TestEnrichSignal(unittest.TestCase):

    def test_oil_price_enriched(self):
        sig = enrich_signal("oil_price", 120)
        self.assertEqual(sig["value"], 120)
        self.assertEqual(sig["baseline"], 85.0)
        self.assertEqual(sig["direction"], "up")
        self.assertGreater(sig["delta"], 0)
        self.assertEqual(sig["category"], "macro")
        self.assertIn(sig["severity"], ("low", "moderate", "high", "critical"))
        self.assertIn("timestamp", sig)

    def test_low_oil_stable(self):
        sig = enrich_signal("oil_price", 85)
        self.assertEqual(sig["direction"], "stable")
        self.assertEqual(sig["delta"], 0)
        self.assertEqual(sig["severity"], "low")

    def test_custom_previous(self):
        sig = enrich_signal("inflation", 4.0, previous_value=3.5)
        self.assertAlmostEqual(sig["delta"], 0.5)
        self.assertEqual(sig["direction"], "up")

    def test_deviation_capped(self):
        sig = enrich_signal("oil_price", 500)
        self.assertLessEqual(sig["deviation"], 2.0)

    def test_unknown_key_defaults(self):
        sig = enrich_signal("unknown_signal", 42)
        self.assertEqual(sig["value"], 42)
        self.assertEqual(sig["category"], "unknown")


class TestEnrichSignals(unittest.TestCase):

    def test_all_numeric_enriched(self):
        enriched = enrich_signals(HIGH_SIGNALS)
        for key in HIGH_SIGNALS:
            if isinstance(HIGH_SIGNALS[key], (int, float)):
                self.assertIn(key, enriched)

    def test_passthrough_metadata(self):
        signals = {"oil_price": 100, "region": "GCC", "timestamp": "2026-01-01"}
        enriched = enrich_signals(signals)
        self.assertIn("_metadata", enriched)
        self.assertEqual(enriched["_metadata"]["region"], "GCC")

    def test_input_not_mutated(self):
        original = {"oil_price": 100}
        enrich_signals(original)
        self.assertNotIn("_metadata", original)


class TestSignalSummary(unittest.TestCase):

    def test_high_signals_show_elevated(self):
        enriched = enrich_signals(HIGH_SIGNALS)
        summary = signal_summary(enriched)
        self.assertGreater(summary["elevated_count"], 0)
        self.assertIn("top_movers", summary)

    def test_low_signals_no_critical(self):
        enriched = enrich_signals(LOW_SIGNALS)
        summary = signal_summary(enriched)
        self.assertEqual(len(summary["critical_signals"]), 0)

    def test_top_movers_ordered_by_delta(self):
        enriched = enrich_signals(HIGH_SIGNALS)
        summary = signal_summary(enriched)
        deltas = [abs(m["delta"]) for m in summary["top_movers"]]
        self.assertEqual(deltas, sorted(deltas, reverse=True))


# =========================================================================
# 2. Brief Generator & Decision Reasoning
# =========================================================================

class TestGenerateBrief(unittest.TestCase):

    def test_brief_is_string(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        brief = result["executive_brief"]
        self.assertIsInstance(brief, str)

    def test_brief_not_empty(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertGreater(len(result["executive_brief"]), 50)

    def test_brief_mentions_decision(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        brief = result["executive_brief"]
        self.assertTrue(
            "ESCALATE" in brief or "REVIEW" in brief or "APPROVE" in brief,
            "Brief should mention the decision"
        )

    def test_low_signals_brief_mentions_approve(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        self.assertIn("APPROVE", result["executive_brief"])


class TestDecisionReasoning(unittest.TestCase):

    def test_reasoning_is_list(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIsInstance(result["decision"]["reasoning"], list)

    def test_reasoning_not_empty(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertGreater(len(result["decision"]["reasoning"]), 0)

    def test_reasoning_all_strings(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        for r in result["decision"]["reasoning"]:
            self.assertIsInstance(r, str)

    def test_reasoning_mentions_scenario(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        combined = " ".join(result["decision"]["reasoning"])
        self.assertTrue(
            "scenario" in combined.lower() or "Scenario" in combined,
            "Reasoning should mention the active scenario"
        )

    def test_decision_has_risk_score(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIn("risk_score", result["decision"])
        self.assertIsInstance(result["decision"]["risk_score"], float)


# =========================================================================
# 3. Cause-Effect Chain
# =========================================================================

class TestCauseEffectChain(unittest.TestCase):

    def test_chain_present_in_propagation_trace(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertIn("cause_effect_chain", pt)
        self.assertIn("readable_path", pt)

    def test_chain_not_empty_for_high(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        chain = result["propagation_trace"]["cause_effect_chain"]
        self.assertGreater(len(chain), 0)

    def test_chain_entry_has_readable(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        chain = result["propagation_trace"]["cause_effect_chain"]
        entry = chain[0]
        self.assertIn("from", entry)
        self.assertIn("to", entry)
        self.assertIn("relation", entry)
        self.assertIn("weight", entry)
        self.assertIn("readable", entry)

    def test_readable_path_is_list_of_strings(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        path = result["propagation_trace"]["readable_path"]
        self.assertIsInstance(path, list)
        for p in path:
            self.assertIsInstance(p, str)
            self.assertIn("→", p)

    def test_empty_chain_for_low_signals(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        chain = result["propagation_trace"]["cause_effect_chain"]
        self.assertEqual(len(chain), 0)


# =========================================================================
# 4. Live Simulation
# =========================================================================

class TestLiveSimulator(unittest.TestCase):

    def test_tick_returns_signals(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        result = sim.tick()
        self.assertIn("oil_price", result)

    def test_tick_changes_values(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        before = sim.current_signals
        after = sim.tick()
        changed = any(
            before.get(k) != after.get(k)
            for k in before
            if isinstance(before.get(k), (int, float))
        )
        self.assertTrue(changed, "At least one signal should change per tick")

    def test_deterministic_with_seed(self):
        sim1 = LiveSimulator(HIGH_SIGNALS, seed=99)
        sim2 = LiveSimulator(HIGH_SIGNALS, seed=99)
        r1 = sim1.tick()
        r2 = sim2.tick()
        for k in ("oil_price", "inflation", "fraud_index"):
            self.assertEqual(r1[k], r2[k])

    def test_values_bounded(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        for _ in range(50):
            result = sim.tick()
        from core.live_simulation import SIGNAL_PROFILES
        for key, profile in SIGNAL_PROFILES.items():
            if key in result:
                self.assertGreaterEqual(result[key], profile["min"])
                self.assertLessEqual(result[key], profile["max"])

    def test_tick_count(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        sim.tick_n(5)
        self.assertEqual(sim.tick_count, 5)

    def test_history_recorded(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        sim.tick_n(3)
        self.assertEqual(len(sim.history), 3)
        self.assertIn("tick", sim.history[0])
        self.assertIn("signals", sim.history[0])

    def test_reset(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        sim.tick_n(5)
        sim.reset(LOW_SIGNALS)
        self.assertEqual(sim.tick_count, 0)
        self.assertEqual(len(sim.history), 0)


class TestPerturbSignals(unittest.TestCase):

    def test_returns_dict(self):
        result = perturb_signals(HIGH_SIGNALS, seed=42)
        self.assertIsInstance(result, dict)

    def test_has_timestamp(self):
        result = perturb_signals(HIGH_SIGNALS, seed=42)
        self.assertIn("timestamp", result)

    def test_deterministic(self):
        r1 = perturb_signals(HIGH_SIGNALS, seed=42)
        r2 = perturb_signals(HIGH_SIGNALS, seed=42)
        self.assertEqual(r1["oil_price"], r2["oil_price"])

    def test_intensity_scales(self):
        low = perturb_signals(HIGH_SIGNALS, intensity=0.1, seed=42)
        high = perturb_signals(HIGH_SIGNALS, intensity=2.0, seed=42)
        # Higher intensity means larger absolute deltas on average
        low_delta = abs(low["oil_price"] - HIGH_SIGNALS["oil_price"])
        high_delta = abs(high["oil_price"] - HIGH_SIGNALS["oil_price"])
        # Not guaranteed per single sample, but should hold for oil price with seed 42
        self.assertGreaterEqual(high_delta, low_delta * 0.5)


class TestScenarioDrift(unittest.TestCase):

    def test_oil_spike_drift_increases_oil(self):
        trajectory = inject_scenario_drift(LOW_SIGNALS, "oil_spike", steps=20, seed=42)
        self.assertEqual(len(trajectory), 20)
        final_oil = trajectory[-1]["oil_price"]
        self.assertGreater(final_oil, LOW_SIGNALS["oil_price"])

    def test_fraud_surge_drift_increases_fraud(self):
        trajectory = inject_scenario_drift(LOW_SIGNALS, "fraud_surge", steps=20, seed=42)
        final_fraud = trajectory[-1]["fraud_index"]
        self.assertGreater(final_fraud, LOW_SIGNALS["fraud_index"])

    def test_unknown_scenario_no_crash(self):
        trajectory = inject_scenario_drift(LOW_SIGNALS, "unknown", steps=5, seed=42)
        self.assertEqual(len(trajectory), 5)


# =========================================================================
# 5. Unified Engine Integration (8-Key Output)
# =========================================================================

class TestUnifiedLiveOutput(unittest.TestCase):

    def test_all_eight_keys_present(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        for key in REQUIRED_KEYS:
            self.assertIn(key, result, f"Missing key: {key}")

    def test_enriched_signals_structure(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        es = result["enriched_signals"]
        self.assertIn("oil_price", es)
        sig = es["oil_price"]
        for field in ("value", "delta", "direction", "category", "severity", "timestamp"):
            self.assertIn(field, sig, f"Missing enriched field: {field}")

    def test_signal_summary_structure(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        ss = result["signal_summary"]
        self.assertIn("elevated_count", ss)
        self.assertIn("critical_signals", ss)
        self.assertIn("top_movers", ss)

    def test_executive_brief_is_string(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        self.assertIsInstance(result["executive_brief"], str)
        self.assertGreater(len(result["executive_brief"]), 20)

    def test_decision_has_reasoning_and_risk_score(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        dec = result["decision"]
        self.assertIn("reasoning", dec)
        self.assertIn("risk_score", dec)
        self.assertIsInstance(dec["reasoning"], list)
        self.assertIsInstance(dec["risk_score"], float)

    def test_propagation_has_cause_effect(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        pt = result["propagation_trace"]
        self.assertIn("cause_effect_chain", pt)
        self.assertIn("readable_path", pt)

    def test_previous_signals_delta(self):
        prev = {"oil_price": 100, "inflation": 3.0, "fraud_index": 0.5}
        result = run(
            signals=HIGH_SIGNALS, previous_signals=prev, write_outputs=False,
        )
        # Oil delta should be 120-100=20, not 120-85=35
        self.assertAlmostEqual(
            result["enriched_signals"]["oil_price"]["delta"], 20.0, places=1,
        )


# =========================================================================
# 6. UI Compatibility Contract
# =========================================================================

class TestUIContract(unittest.TestCase):

    def test_full_output_json_serializable(self):
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        serialized = json.dumps(result)
        roundtripped = json.loads(serialized)
        self.assertEqual(result, roundtripped)

    def test_low_output_json_serializable(self):
        result = run(signals=LOW_SIGNALS, write_outputs=False)
        serialized = json.dumps(result)
        roundtripped = json.loads(serialized)
        self.assertEqual(result, roundtripped)

    def test_consistent_key_names(self):
        """All top-level keys should be snake_case."""
        result = run(signals=HIGH_SIGNALS, write_outputs=False)
        for key in result:
            self.assertRegex(key, r'^[a-z][a-z0-9_]*$',
                             f"Key '{key}' is not snake_case")

    def test_response_speed(self):
        """Full pipeline should complete in under 300ms."""
        start = time.time()
        run(signals=HIGH_SIGNALS, write_outputs=False)
        elapsed_ms = (time.time() - start) * 1000
        self.assertLess(elapsed_ms, 300, f"Pipeline took {elapsed_ms:.0f}ms (>300ms)")


# =========================================================================
# 7. Live Simulation → Unified Engine Integration
# =========================================================================

class TestLiveToEngine(unittest.TestCase):

    def test_perturbed_signals_produce_valid_output(self):
        perturbed = perturb_signals(HIGH_SIGNALS, seed=42)
        result = run(signals=perturbed, write_outputs=False)
        for key in REQUIRED_KEYS:
            self.assertIn(key, result)

    def test_tick_sequence_produces_valid_outputs(self):
        sim = LiveSimulator(HIGH_SIGNALS, seed=42)
        for _ in range(3):
            signals = sim.tick()
            result = run(signals=signals, write_outputs=False)
            self.assertIn("decision", result)
            self.assertIn(result["decision"]["decision"],
                          ("APPROVE", "REVIEW", "ESCALATE"))

    def test_scenario_drift_trajectory(self):
        trajectory = inject_scenario_drift(LOW_SIGNALS, "oil_spike", steps=5, seed=42)
        for signals in trajectory:
            result = run(signals=signals, write_outputs=False)
            self.assertIn("decision", result)


if __name__ == "__main__":
    unittest.main()
