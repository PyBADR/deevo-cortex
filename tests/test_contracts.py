"""Tests for contract validation logic.

Ensures schema validators catch bad data and pass good data.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.contracts import (
    validate_signals,
    validate_simulation_result,
    validate_decision_trace,
    validate_decision,
    validate_engine_output,
)


class TestSignalSchema(unittest.TestCase):

    def test_valid_signals(self):
        data = {
            "oil_price": 100, "inflation": 3.5, "claims_rate": 0.5,
            "fraud_index": 0.6, "repair_cost_index": 1.2,
        }
        ok, errs = validate_signals(data)
        self.assertTrue(ok, errs)

    def test_missing_key(self):
        data = {"oil_price": 100, "inflation": 3.5}
        ok, errs = validate_signals(data)
        self.assertFalse(ok)
        self.assertTrue(any("claims_rate" in e for e in errs))

    def test_non_numeric_value(self):
        data = {
            "oil_price": "high", "inflation": 3.5, "claims_rate": 0.5,
            "fraud_index": 0.6, "repair_cost_index": 1.2,
        }
        ok, errs = validate_signals(data)
        self.assertFalse(ok)
        self.assertTrue(any("numeric" in e for e in errs))


class TestSimulationResultSchema(unittest.TestCase):

    def test_valid(self):
        data = {
            "active_scenario": "oil_spike",
            "impacted_domains": ["inflation", "claims"],
            "severity": 0.7,
            "simulated_changes": {"inflation": {"direction": "increase"}},
        }
        ok, errs = validate_simulation_result(data)
        self.assertTrue(ok, errs)

    def test_missing_severity(self):
        data = {
            "active_scenario": "oil_spike",
            "impacted_domains": [],
            "simulated_changes": {},
        }
        ok, errs = validate_simulation_result(data)
        self.assertFalse(ok)

    def test_wrong_type_domains(self):
        data = {
            "active_scenario": "oil_spike",
            "impacted_domains": "not_a_list",
            "severity": 0.5,
            "simulated_changes": {},
        }
        ok, errs = validate_simulation_result(data)
        self.assertFalse(ok)


class TestDecisionTraceSchema(unittest.TestCase):

    def test_valid(self):
        data = {
            "timestamp": "2026-03-25T00:00:00Z",
            "input_signals": {"oil_price": 100},
            "detected_scenario": "oil_spike",
            "graph_links_used": ["oil_price -> inflation"],
            "agent_observations": [],
            "final_risk_score": 0.7,
            "final_decision": "ESCALATE",
            "confidence": 0.9,
        }
        ok, errs = validate_decision_trace(data)
        self.assertTrue(ok, errs)

    def test_invalid_decision_value(self):
        data = {
            "timestamp": "2026-03-25T00:00:00Z",
            "input_signals": {},
            "detected_scenario": None,
            "graph_links_used": [],
            "agent_observations": [],
            "final_risk_score": 0.1,
            "final_decision": "REJECT",
            "confidence": 0.8,
        }
        ok, errs = validate_decision_trace(data)
        self.assertFalse(ok)
        self.assertTrue(any("APPROVE|REVIEW|ESCALATE" in e for e in errs))


class TestDecisionSchema(unittest.TestCase):

    def test_valid_approve(self):
        ok, errs = validate_decision({
            "decision": "APPROVE", "confidence": 0.9, "summary": "All clear."
        })
        self.assertTrue(ok, errs)

    def test_valid_review(self):
        ok, errs = validate_decision({
            "decision": "REVIEW", "confidence": 0.7, "summary": "Needs review."
        })
        self.assertTrue(ok, errs)

    def test_valid_escalate(self):
        ok, errs = validate_decision({
            "decision": "ESCALATE", "confidence": 0.95, "summary": "Critical."
        })
        self.assertTrue(ok, errs)

    def test_invalid_decision_string(self):
        ok, errs = validate_decision({
            "decision": "DENY", "confidence": 0.5, "summary": "Nope."
        })
        self.assertFalse(ok)

    def test_missing_summary(self):
        ok, errs = validate_decision({"decision": "APPROVE", "confidence": 0.9})
        self.assertFalse(ok)


class TestFullOutputValidation(unittest.TestCase):

    def test_valid_full_output(self):
        data = {
            "simulation_result": {
                "active_scenario": None,
                "impacted_domains": [],
                "severity": 0.0,
                "simulated_changes": {},
            },
            "decision_trace": {
                "timestamp": "2026-03-25T00:00:00Z",
                "input_signals": {"oil_price": 80},
                "detected_scenario": None,
                "graph_links_used": [],
                "agent_observations": [],
                "final_risk_score": 0.0,
                "final_decision": "APPROVE",
                "confidence": 0.95,
            },
            "decision": {
                "decision": "APPROVE",
                "confidence": 0.95,
                "summary": "No risk.",
            },
        }
        ok, errs = validate_engine_output(data)
        self.assertTrue(ok, errs)

    def test_missing_top_key(self):
        ok, errs = validate_engine_output({"decision": {}, "decision_trace": {}})
        self.assertFalse(ok)


if __name__ == "__main__":
    unittest.main()
