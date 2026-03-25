// Auto-generated from demo payloads — do not edit manually
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _DEMOS: Record<string, any> = {
  "fraud_surge": {
    "version": "4.3.1",
    "demo_id": "fraud_surge",
    "locale": "en",
    "demo_meta": {
      "title": "Coordinated Fraud Ring — Motor Claims Network",
      "headline": "Fraud index hits 0.91 — 203% above baseline — as a coordinated motor claims ring inflates repair estimates 60% across Dubai and Manama. SIU mobilisation recommended.",
      "narrative": "The fraud detection engine flags a 0.91 fraud index — 203% above the 0.30 baseline — the highest severity classification in the DEEVO risk taxonomy. A coordinated motor claims ring is operating across Dubai and Manama: staged collisions, inflated repair estimates (+60%), and systematic workshop collusion. Claims frequency has spiked to 0.78 (123% above baseline) while macro signals remain calm — oil at $95, inflation at 3.8. This is the key differentiator: the system isolates fraud-driven claims pressure from legitimate macro stress. Three analyst agents converge on ESCALATE independently. The SHA-256 audit trail generates a tamper-proof decision hash for direct SIU handoff — no manual documentation required.",
      "expected_decision": "ESCALATE",
      "dominant_signals": [
        "fraud_index",
        "claims_rate",
        "repair_cost_index"
      ],
      "country_focus": "AE",
      "country_focus_label": "UAE — Largest GCC insurance market ($12.8B GWP), highest motor claims volume, DIFC/ADGM dual-jurisdiction complexity",
      "talking_points": [
        "PRESENTER: 'Oil is calm. Inflation is calm. But watch the fraud index.' — the system catches what humans miss",
        "CONTRAST: Macro signals are green (oil +12%, inflation +52%). The ESCALATE comes purely from fraud and claims anomaly detection.",
        "GRAPH: fraud_index → claims_rate → repair_cost propagation path lights up while macro nodes stay dim",
        "AUDIT: SHA-256 decision hash generates automatically — click Export and the SIU handoff package is ready",
        "JURISDICTION: UAE triggers DIFC and ADGM dual-regulatory alerts. The system flags both jurisdictions automatically.",
        "AGENT CONVERGENCE: All 3 analysts independently reach ESCALATE — no majority override, no tuning"
      ],
      "kpi": {
        "fraud_index": {
          "baseline": 0.3,
          "demo": 0.91,
          "delta_pct": "+203%",
          "severity": "critical"
        },
        "claims_rate": {
          "baseline": 0.35,
          "demo": 0.78,
          "delta_pct": "+123%",
          "severity": "critical"
        },
        "repair_cost_index": {
          "baseline": 1.0,
          "demo": 1.6,
          "delta_pct": "+60%",
          "severity": "high"
        },
        "oil_price": {
          "baseline": 85,
          "demo": 95,
          "delta_pct": "+12%",
          "severity": "low"
        }
      }
    },
    "country_card": {
      "id": "AE",
      "display_name": "United Arab Emirates",
      "flag_emoji": "🇦🇪",
      "strategic_role": "Most diversified GCC economy (oil <30% of GDP). Global trade hub processing $400B+ annual re-exports. Largest insurance market in the GCC at $12.8B GWP.",
      "risk_role": "Highest motor claims frequency in GCC — 23% above regional average. Trade disruption amplifier via Jebel Ali port. DIFC/ADGM dual-jurisdiction creates regulatory complexity for fraud prosecution.",
      "risk_signature": "Where claims volume meets regulatory complexity. The fraud battleground.",
      "key_metric": "Motor claims frequency 23% above GCC average — fraud ring detection saves $40-80M annually",
      "insurance_market_gwp": "$12.8B",
      "sector_emphasis": [
        "insurance",
        "logistics",
        "fraud_detection"
      ],
      "oil_dependency": 0.65,
      "demo_highlight": "Fraud surge demo: UAE lights up with dual DIFC/ADGM jurisdiction alerts. Highest claims volume means highest fraud exposure.",
      "available": true,
      "scenario_cue": "Primary target. DIFC + ADGM dual alerts trigger simultaneously."
    },
    "ui_payload": {
      "version": "4.1.1",
      "locale": "en",
      "timestamp": "2026-03-25T16:04:15.737983+00:00",
      "top_bar": {
        "scenario_id": "fraud_surge",
        "scenario_label": "FRAUD SURGE",
        "decision": "ESCALATE",
        "decision_style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "risk_score": 0.975,
        "confidence": 0.94,
        "elevated_count": 3,
        "critical_signals": [
          "fraud_index"
        ],
        "high_signals": [
          "claims_rate",
          "repair_cost_index"
        ],
        "timestamp": "2026-03-25T16:04:15.731370+00:00",
        "headline_summary": "ESCALATE — Fraud Activity Surge requires immediate action · 3 elevated signals · risk 0.97",
        "impact_level": "critical",
        "demo_headline": "Fraud index hits 0.91 — 203% above baseline — as a coordinated motor claims ring inflates repair estimates 60% across Dubai and Manama. SIU mobilisation recommended."
      },
      "signal_rail": [
        {
          "id": "fraud_index",
          "label": "Fraud Alert Index",
          "value": 0.91,
          "unit": "index",
          "delta": 0.61,
          "direction": "up",
          "category": "risk",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 2.0,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0044,
            0.1748,
            0.3811,
            0.5506,
            0.7345,
            0.9143,
            1.1056,
            1.2834,
            1.4771,
            1.6677,
            1.8512,
            2.0333
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "repair_cost_index",
          "label": "Repair Cost Index",
          "value": 1.6,
          "unit": "index",
          "delta": 0.6,
          "direction": "up",
          "category": "insurance",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 0.6,
          "baseline": 1.0,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0068,
            0.0465,
            0.1251,
            0.171,
            0.2226,
            0.2593,
            0.3319,
            0.3805,
            0.4354,
            0.4984,
            0.5527,
            0.6
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "claims_rate",
          "label": "Claims Frequency",
          "value": 0.78,
          "unit": "ratio",
          "delta": 0.43,
          "direction": "up",
          "category": "insurance",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.2286,
          "baseline": 0.35,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0015,
            0.1206,
            0.2237,
            0.3328,
            0.4324,
            0.5522,
            0.6764,
            0.7857,
            0.8871,
            1.0092,
            1.1207,
            1.2286
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "oil_price",
          "label": "Oil Price (Brent)",
          "value": 95,
          "unit": "USD/barrel",
          "delta": 10.0,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.1176,
          "baseline": 85.0,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0005,
            0.0247,
            0.0375,
            0.0335,
            0.0364,
            0.0663,
            0.0655,
            0.0765,
            0.0915,
            0.0983,
            0.1135,
            0.1176
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "inflation",
          "label": "CPI Inflation Rate",
          "value": 3.8,
          "unit": "percent",
          "delta": 1.3,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.52,
          "baseline": 2.5,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            -0.0172,
            0.0371,
            0.1088,
            0.1337,
            0.1887,
            0.2471,
            0.2889,
            0.3328,
            0.3705,
            0.4298,
            0.4772,
            0.52
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "currency_volatility",
          "label": "Currency Volatility",
          "value": 0.06,
          "unit": "index",
          "delta": 0.01,
          "direction": "up",
          "category": "context",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.2,
          "baseline": 0.05,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0017,
            0.0338,
            0.0275,
            0.0665,
            0.0653,
            0.0777,
            0.1158,
            0.1296,
            0.1439,
            0.156,
            0.1759,
            0.2
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "supply_chain_stress",
          "label": "Supply Chain Stress Index",
          "value": 0.3,
          "unit": "index",
          "delta": 0.0,
          "direction": "stable",
          "category": "macro",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.0,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            0.0097,
            0.0178,
            -0.0007,
            -0.0113,
            0.0062,
            0.0103,
            -0.0014,
            -0.0074,
            -0.0089,
            -0.0033,
            -0.0026,
            0.0
          ],
          "movement": "decelerating",
          "impact_level": "low"
        },
        {
          "id": "interest_rate",
          "label": "Central Bank Rate",
          "value": 5.0,
          "unit": "percent",
          "delta": 0.0,
          "direction": "stable",
          "category": "macro",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.0,
          "baseline": 5.0,
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "sparkline": [
            -0.0139,
            -0.0018,
            0.0107,
            -0.0084,
            -0.0032,
            0.0111,
            0.0047,
            0.0069,
            0.0035,
            0.0052,
            -0.0048,
            0.0
          ],
          "movement": "decelerating",
          "impact_level": "low"
        }
      ],
      "decision_rail": {
        "decision": "ESCALATE",
        "confidence": 0.94,
        "risk_score": 0.975,
        "summary": "Scenario 'Fraud Activity Surge' detected. Severity 0.77, blended risk 0.97. Decision: ESCALATE (confidence 0.94).",
        "reasoning": [
          "Scenario 'Fraud Activity Surge' detected — Spike in fraudulent claims activity requiring investigation escalation.",
          "Critical signals: Fraud Alert Index (up).",
          "Elevated signals: Claims Frequency (up), Repair Cost Index (up).",
          "Graph propagation impacted 9 nodes including Supply Chain Stress, Claims Frequency, Premium Pricing, Fraud Activity, Reserve Adequacy.",
          "All 6 GCC markets affected.",
          "Portfolio risk HIGH under fraud_surge.",
          "Claims impact MODERATE.",
          "Fraud exposure HIGH.",
          "Combined risk score 0.97 exceeds escalation threshold. Immediate senior review required."
        ],
        "style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "scenario_id": "fraud_surge",
        "trace_hash": "38e198d0a4b9382ec7e435bf9c3325944678b5334e7e388bb902d5a8b1fcf918",
        "agents": [
          {
            "agent": "risk_analyst",
            "risk": 0.8765,
            "observation": "Portfolio risk HIGH under fraud_surge. Simulated magnitude 0.88. Reserve adequacy review recommended."
          },
          {
            "agent": "claims_analyst",
            "risk": 0.6636,
            "observation": "Claims impact MODERATE. Expected cost movement 0.66. Recommend claims triage escalation."
          },
          {
            "agent": "fraud_analyst",
            "risk": 1.6694,
            "observation": "Fraud exposure HIGH. Indicator strength 1.67. Flag for SIU review."
          }
        ],
        "short_reasoning": "Scenario 'Fraud Activity Surge' detected — Spike in fraudulent claims activity requiring investigation escalation.",
        "headline_summary": "ESCALATE — Fraud Activity Surge requires immediate action · risk 0.97",
        "impact_level": "critical",
        "demo_headline": "Fraud index hits 0.91 — 203% above baseline — as a coordinated motor claims ring inflates repair estimates 60% across Dubai and Manama. SIU mobilisation recommended.",
        "demo_short_reasoning": "The fraud detection engine flags a 0.91 fraud index — 203% above the 0.30 baseline — the highest severity classification in the DEEVO ris..."
      },
      "propagation_panel": {
        "cause_effect_chain": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 0.8464,
            "readable": "Oil Price is driving Inflation (weight 0.85)"
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.6771,
            "readable": "Oil Price is driving Repair Costs (weight 0.68)"
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.5642,
            "readable": "Oil Price is driving Supply Chain Stress (weight 0.56)"
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.395,
            "readable": "Oil Price correlates with Interest Rates (weight 0.40)"
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6358,
            "readable": "Inflation is driving Claims Frequency (weight 0.64)"
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7514,
            "readable": "Inflation is driving Repair Costs (weight 0.75)"
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.4624,
            "readable": "Inflation is putting pressure on Premium Pricing (weight 0.46)"
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.59,
            "readable": "Repair Costs is driving Claims Frequency (weight 0.59)"
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.649,
            "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.65)"
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.531,
            "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.53)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.763,
            "readable": "Supply Chain Stress is driving Repair Costs (weight 0.76)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.327,
            "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.33)"
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
          }
        ],
        "readable_path": [
          "Oil Price → Inflation",
          "Oil Price → Repair Costs",
          "Oil Price → Supply Chain Stress",
          "Oil Price → Interest Rates",
          "Inflation → Claims Frequency",
          "Inflation → Repair Costs",
          "Inflation → Premium Pricing",
          "Fraud Alerts → Fraud Activity",
          "Repair Costs → Claims Frequency",
          "Repair Costs → Reserve Adequacy",
          "Repair Costs → Premium Pricing",
          "Supply Chain Stress → Repair Costs",
          "Supply Chain Stress → Claims Frequency",
          "Claims Frequency → Fraud Activity",
          "Claims Frequency → Loss Ratio",
          "Claims Frequency → Reserve Adequacy",
          "Fraud Activity → SIU Investigations",
          "Fraud Activity → Loss Ratio",
          "Reserve Adequacy → Regulatory Pressure",
          "Loss Ratio → Premium Pricing",
          "Loss Ratio → Reinsurance Cost",
          "Loss Ratio → Regulatory Pressure",
          "SIU Investigations → Fraud Activity"
        ],
        "traversal_steps": 23,
        "active_nodes": [
          "supply_chain_stress",
          "claims",
          "pricing",
          "fraud",
          "reserves",
          "loss_ratio",
          "investigation",
          "regulatory_pressure",
          "reinsurance_cost"
        ],
        "active_node_count": 9,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "pressure_summary": {
          "oil_price": 0.1176,
          "inflation": 0.6195,
          "fraud_alerts": 2.0,
          "repair_cost_index": 1.1209,
          "supply_chain_stress": 0.0663,
          "interest_rate": 0.0465,
          "claims": 0.7063,
          "pricing": 0.7442,
          "fraud": 1.6388,
          "reserves": 0.6208,
          "loss_ratio": 1.2645,
          "investigation": 1.7,
          "regulatory_pressure": 0.3332,
          "reinsurance_cost": 0.1587
        }
      },
      "executive_brief": {
        "text": "A Fraud Surge scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 9 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 98%. Recommendation: ESCALATE for immediate senior review (confidence 94%).",
        "decision": "ESCALATE",
        "confidence": 0.94,
        "headline_summary": "A Fraud Surge scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 9 risk dimensions.",
        "impact_level": "critical"
      },
      "graph_summary": {
        "active_nodes": [
          "supply_chain_stress",
          "claims",
          "pricing",
          "fraud",
          "reserves",
          "loss_ratio",
          "investigation",
          "regulatory_pressure",
          "reinsurance_cost"
        ],
        "total_active": 9,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "node_pressures": {
          "oil_price": 0.1176,
          "inflation": 0.6195,
          "fraud_alerts": 2.0,
          "repair_cost_index": 1.1209,
          "supply_chain_stress": 0.0663,
          "interest_rate": 0.0465,
          "claims": 0.7063,
          "pricing": 0.7442,
          "fraud": 1.6388,
          "reserves": 0.6208,
          "loss_ratio": 1.2645,
          "investigation": 1.7,
          "regulatory_pressure": 0.3332,
          "reinsurance_cost": 0.1587
        },
        "max_pressure": 2.0,
        "node_details": [
          {
            "id": "investigation",
            "pressure": 1.7,
            "severity_score": 0.935,
            "impact_level": "critical"
          },
          {
            "id": "fraud",
            "pressure": 1.6388,
            "severity_score": 0.927,
            "impact_level": "critical"
          },
          {
            "id": "loss_ratio",
            "pressure": 1.2645,
            "severity_score": 0.852,
            "impact_level": "critical"
          },
          {
            "id": "pricing",
            "pressure": 0.7442,
            "severity_score": 0.632,
            "impact_level": "high"
          },
          {
            "id": "claims",
            "pressure": 0.7063,
            "severity_score": 0.608,
            "impact_level": "high"
          },
          {
            "id": "reserves",
            "pressure": 0.6208,
            "severity_score": 0.552,
            "impact_level": "medium"
          },
          {
            "id": "regulatory_pressure",
            "pressure": 0.3332,
            "severity_score": 0.321,
            "impact_level": "low"
          },
          {
            "id": "reinsurance_cost",
            "pressure": 0.1587,
            "severity_score": 0.157,
            "impact_level": "low"
          },
          {
            "id": "supply_chain_stress",
            "pressure": 0.0663,
            "severity_score": 0.066,
            "impact_level": "low"
          }
        ],
        "edge_details": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 0.8464,
            "intensity": 0.846
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.6771,
            "intensity": 0.677
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.5642,
            "intensity": 0.564
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.395,
            "intensity": 0.395
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6358,
            "intensity": 0.636
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7514,
            "intensity": 0.751
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.4624,
            "intensity": 0.462
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.59,
            "intensity": 0.59
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.649,
            "intensity": 0.649
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.531,
            "intensity": 0.531
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.763,
            "intensity": 0.763
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.327,
            "intensity": 0.327
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "intensity": 0.8
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "intensity": 0.85
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "intensity": 0.5
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "intensity": 0.55
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "intensity": 0.6
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "intensity": 0.3
          }
        ],
        "max_intensity": 1.0
      },
      "raw": {
        "simulation_result": {
          "active_scenario": "fraud_surge",
          "impacted_domains": [
            "oil_price",
            "supply_chain_stress",
            "reserves",
            "fraud",
            "regulatory_pressure",
            "reinsurance_cost",
            "repair_cost_index",
            "claims",
            "fraud_alerts",
            "investigation",
            "pricing",
            "inflation",
            "loss_ratio"
          ],
          "severity": 0.773,
          "simulated_changes": {
            "supply_chain_stress": {
              "direction": "increase",
              "magnitude": 0.0663,
              "propagation_depth": 1
            },
            "claims": {
              "direction": "increase",
              "magnitude": 0.7063,
              "propagation_depth": 2
            },
            "pricing": {
              "direction": "increase",
              "magnitude": 0.7442,
              "propagation_depth": 3
            },
            "fraud": {
              "direction": "increase",
              "magnitude": 1.6388,
              "propagation_depth": 4
            },
            "reserves": {
              "direction": "increase",
              "magnitude": 0.6208,
              "propagation_depth": 5
            },
            "loss_ratio": {
              "direction": "increase",
              "magnitude": 1.2645,
              "propagation_depth": 6
            },
            "investigation": {
              "direction": "increase",
              "magnitude": 1.7,
              "propagation_depth": 7
            },
            "regulatory_pressure": {
              "direction": "increase",
              "magnitude": 0.3332,
              "propagation_depth": 8
            },
            "reinsurance_cost": {
              "direction": "increase",
              "magnitude": 0.1587,
              "propagation_depth": 9
            }
          },
          "graph_links_used": [
            "oil_price -> inflation",
            "oil_price -> repair_cost_index",
            "oil_price -> supply_chain_stress",
            "oil_price -> interest_rate",
            "inflation -> claims",
            "inflation -> repair_cost_index",
            "inflation -> pricing",
            "fraud_alerts -> fraud",
            "repair_cost_index -> claims",
            "repair_cost_index -> reserves",
            "repair_cost_index -> pricing",
            "supply_chain_stress -> repair_cost_index",
            "supply_chain_stress -> claims",
            "claims -> fraud",
            "claims -> loss_ratio",
            "claims -> reserves",
            "fraud -> investigation",
            "fraud -> loss_ratio",
            "reserves -> regulatory_pressure",
            "loss_ratio -> pricing",
            "loss_ratio -> reinsurance_cost",
            "loss_ratio -> regulatory_pressure",
            "investigation -> fraud"
          ]
        },
        "decision_trace": {
          "timestamp": "2026-03-25T16:04:15.731370+00:00",
          "input_signals": {
            "oil_price": 95,
            "inflation": 3.8,
            "claims_rate": 0.78,
            "fraud_index": 0.91,
            "repair_cost_index": 1.6,
            "supply_chain_stress": 0.3,
            "currency_volatility": 0.06,
            "interest_rate": 5.0
          },
          "detected_scenario": "fraud_surge",
          "agent_observations": [
            {
              "agent": "risk_analyst",
              "assessed_risk": 0.8765,
              "observation": "Portfolio risk HIGH under fraud_surge. Simulated magnitude 0.88. Reserve adequacy review recommended."
            },
            {
              "agent": "claims_analyst",
              "assessed_risk": 0.6636,
              "observation": "Claims impact MODERATE. Expected cost movement 0.66. Recommend claims triage escalation."
            },
            {
              "agent": "fraud_analyst",
              "assessed_risk": 1.6694,
              "observation": "Fraud exposure HIGH. Indicator strength 1.67. Flag for SIU review."
            }
          ],
          "final_risk_score": 0.975,
          "final_decision": "ESCALATE",
          "confidence": 0.94,
          "trace_hash": "38e198d0a4b9382ec7e435bf9c3325944678b5334e7e388bb902d5a8b1fcf918"
        },
        "decision": {
          "decision": "ESCALATE",
          "confidence": 0.94,
          "risk_score": 0.975,
          "summary": "Scenario 'Fraud Activity Surge' detected. Severity 0.77, blended risk 0.97. Decision: ESCALATE (confidence 0.94).",
          "reasoning": [
            "Scenario 'Fraud Activity Surge' detected — Spike in fraudulent claims activity requiring investigation escalation.",
            "Critical signals: Fraud Alert Index (up).",
            "Elevated signals: Claims Frequency (up), Repair Cost Index (up).",
            "Graph propagation impacted 9 nodes including Supply Chain Stress, Claims Frequency, Premium Pricing, Fraud Activity, Reserve Adequacy.",
            "All 6 GCC markets affected.",
            "Portfolio risk HIGH under fraud_surge.",
            "Claims impact MODERATE.",
            "Fraud exposure HIGH.",
            "Combined risk score 0.97 exceeds escalation threshold. Immediate senior review required."
          ]
        },
        "graph_state": {
          "active_nodes": [
            "supply_chain_stress",
            "claims",
            "pricing",
            "fraud",
            "reserves",
            "loss_ratio",
            "investigation",
            "regulatory_pressure",
            "reinsurance_cost"
          ],
          "affected_countries": [
            "AE",
            "BH",
            "KW",
            "OM",
            "QA",
            "SA"
          ],
          "affected_sectors": [
            "banking",
            "energy",
            "healthcare",
            "insurance",
            "logistics",
            "retail"
          ],
          "affected_insurance_lines": [
            "marine",
            "medical",
            "motor",
            "property"
          ],
          "weighted_impacts": {
            "oil_price": 0.1176,
            "inflation": 0.6195,
            "fraud_alerts": 2.0,
            "repair_cost_index": 1.1209,
            "supply_chain_stress": 0.0663,
            "interest_rate": 0.0465,
            "claims": 0.7063,
            "pricing": 0.7442,
            "fraud": 1.6388,
            "reserves": 0.6208,
            "loss_ratio": 1.2645,
            "investigation": 1.7,
            "regulatory_pressure": 0.3332,
            "reinsurance_cost": 0.1587
          }
        },
        "propagation_trace": {
          "root_signal": [
            "oil_price",
            "inflation",
            "fraud_alerts",
            "repair_cost_index"
          ],
          "traversal_path": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 0.8464,
              "transmitted_pressure": 0.0995,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.6771,
              "transmitted_pressure": 0.0796,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.5642,
              "transmitted_pressure": 0.0663,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.395,
              "transmitted_pressure": 0.0465,
              "relation_type": "correlates"
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.6358,
              "transmitted_pressure": 0.3306,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.7514,
              "transmitted_pressure": 0.3907,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.4624,
              "transmitted_pressure": 0.2404,
              "relation_type": "pressures"
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0,
              "transmitted_pressure": 2.0,
              "relation_type": "indicates"
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.59,
              "transmitted_pressure": 0.354,
              "relation_type": "drives"
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.649,
              "transmitted_pressure": 0.3894,
              "relation_type": "erodes"
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.531,
              "transmitted_pressure": 0.3186,
              "relation_type": "pressures"
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 0.763,
              "transmitted_pressure": 0.0506,
              "relation_type": "drives"
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.327,
              "transmitted_pressure": 0.0217,
              "relation_type": "amplifies"
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45,
              "transmitted_pressure": 0.1488,
              "relation_type": "enables"
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8,
              "transmitted_pressure": 0.2645,
              "relation_type": "drives"
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7,
              "transmitted_pressure": 0.2314,
              "relation_type": "depletes"
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85,
              "transmitted_pressure": 1.7,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5,
              "transmitted_pressure": 1.0,
              "relation_type": "inflates"
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55,
              "transmitted_pressure": 0.2142,
              "relation_type": "triggers"
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7,
              "transmitted_pressure": 0.1852,
              "relation_type": "forces"
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6,
              "transmitted_pressure": 0.1587,
              "relation_type": "drives"
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45,
              "transmitted_pressure": 0.119,
              "relation_type": "triggers"
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3,
              "transmitted_pressure": -0.51,
              "relation_type": "suppresses"
            }
          ],
          "edge_weights_used": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 0.8464
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.6771
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.5642
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.395
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.6358
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.7514
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.4624
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.59
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.649
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.531
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 0.763
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.327
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3
            }
          ],
          "impacted_nodes_in_order": [
            "supply_chain_stress",
            "claims",
            "pricing",
            "fraud",
            "reserves",
            "loss_ratio",
            "investigation",
            "regulatory_pressure",
            "reinsurance_cost"
          ],
          "final_pressure_summary": {
            "oil_price": 0.1176,
            "inflation": 0.6195,
            "fraud_alerts": 2.0,
            "repair_cost_index": 1.1209,
            "supply_chain_stress": 0.0663,
            "interest_rate": 0.0465,
            "claims": 0.7063,
            "pricing": 0.7442,
            "fraud": 1.6388,
            "reserves": 0.6208,
            "loss_ratio": 1.2645,
            "investigation": 1.7,
            "regulatory_pressure": 0.3332,
            "reinsurance_cost": 0.1587
          },
          "cause_effect_chain": [
            {
              "from": "Oil Price",
              "to": "Inflation",
              "relation": "is driving",
              "weight": 0.8464,
              "readable": "Oil Price is driving Inflation (weight 0.85)"
            },
            {
              "from": "Oil Price",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.6771,
              "readable": "Oil Price is driving Repair Costs (weight 0.68)"
            },
            {
              "from": "Oil Price",
              "to": "Supply Chain Stress",
              "relation": "is driving",
              "weight": 0.5642,
              "readable": "Oil Price is driving Supply Chain Stress (weight 0.56)"
            },
            {
              "from": "Oil Price",
              "to": "Interest Rates",
              "relation": "correlates with",
              "weight": 0.395,
              "readable": "Oil Price correlates with Interest Rates (weight 0.40)"
            },
            {
              "from": "Inflation",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.6358,
              "readable": "Inflation is driving Claims Frequency (weight 0.64)"
            },
            {
              "from": "Inflation",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.7514,
              "readable": "Inflation is driving Repair Costs (weight 0.75)"
            },
            {
              "from": "Inflation",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.4624,
              "readable": "Inflation is putting pressure on Premium Pricing (weight 0.46)"
            },
            {
              "from": "Fraud Alerts",
              "to": "Fraud Activity",
              "relation": "indicates rising",
              "weight": 1.0,
              "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
            },
            {
              "from": "Repair Costs",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.59,
              "readable": "Repair Costs is driving Claims Frequency (weight 0.59)"
            },
            {
              "from": "Repair Costs",
              "to": "Reserve Adequacy",
              "relation": "is eroding",
              "weight": 0.649,
              "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.65)"
            },
            {
              "from": "Repair Costs",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.531,
              "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.53)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.763,
              "readable": "Supply Chain Stress is driving Repair Costs (weight 0.76)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Claims Frequency",
              "relation": "is amplifying",
              "weight": 0.327,
              "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.33)"
            },
            {
              "from": "Claims Frequency",
              "to": "Fraud Activity",
              "relation": "is enabling",
              "weight": 0.45,
              "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
            },
            {
              "from": "Claims Frequency",
              "to": "Loss Ratio",
              "relation": "is driving",
              "weight": 0.8,
              "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
            },
            {
              "from": "Claims Frequency",
              "to": "Reserve Adequacy",
              "relation": "is depleting",
              "weight": 0.7,
              "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
            },
            {
              "from": "Fraud Activity",
              "to": "SIU Investigations",
              "relation": "is triggering",
              "weight": 0.85,
              "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
            },
            {
              "from": "Fraud Activity",
              "to": "Loss Ratio",
              "relation": "is inflating",
              "weight": 0.5,
              "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
            },
            {
              "from": "Reserve Adequacy",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.55,
              "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
            },
            {
              "from": "Loss Ratio",
              "to": "Premium Pricing",
              "relation": "is forcing changes in",
              "weight": 0.7,
              "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
            },
            {
              "from": "Loss Ratio",
              "to": "Reinsurance Cost",
              "relation": "is driving",
              "weight": 0.6,
              "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
            },
            {
              "from": "Loss Ratio",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.45,
              "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
            },
            {
              "from": "SIU Investigations",
              "to": "Fraud Activity",
              "relation": "is suppressing",
              "weight": -0.3,
              "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
            }
          ],
          "readable_path": [
            "Oil Price → Inflation",
            "Oil Price → Repair Costs",
            "Oil Price → Supply Chain Stress",
            "Oil Price → Interest Rates",
            "Inflation → Claims Frequency",
            "Inflation → Repair Costs",
            "Inflation → Premium Pricing",
            "Fraud Alerts → Fraud Activity",
            "Repair Costs → Claims Frequency",
            "Repair Costs → Reserve Adequacy",
            "Repair Costs → Premium Pricing",
            "Supply Chain Stress → Repair Costs",
            "Supply Chain Stress → Claims Frequency",
            "Claims Frequency → Fraud Activity",
            "Claims Frequency → Loss Ratio",
            "Claims Frequency → Reserve Adequacy",
            "Fraud Activity → SIU Investigations",
            "Fraud Activity → Loss Ratio",
            "Reserve Adequacy → Regulatory Pressure",
            "Loss Ratio → Premium Pricing",
            "Loss Ratio → Reinsurance Cost",
            "Loss Ratio → Regulatory Pressure",
            "SIU Investigations → Fraud Activity"
          ]
        },
        "enriched_signals": {
          "oil_price": {
            "value": 95,
            "baseline": 85.0,
            "delta": 10.0,
            "direction": "up",
            "deviation": 0.1176,
            "category": "macro",
            "severity": "moderate",
            "label": "Oil Price (Brent)",
            "unit": "USD/barrel",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "inflation": {
            "value": 3.8,
            "baseline": 2.5,
            "delta": 1.3,
            "direction": "up",
            "deviation": 0.52,
            "category": "macro",
            "severity": "moderate",
            "label": "CPI Inflation Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "claims_rate": {
            "value": 0.78,
            "baseline": 0.35,
            "delta": 0.43,
            "direction": "up",
            "deviation": 1.2286,
            "category": "insurance",
            "severity": "high",
            "label": "Claims Frequency",
            "unit": "ratio",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "fraud_index": {
            "value": 0.91,
            "baseline": 0.3,
            "delta": 0.61,
            "direction": "up",
            "deviation": 2.0,
            "category": "risk",
            "severity": "critical",
            "label": "Fraud Alert Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "repair_cost_index": {
            "value": 1.6,
            "baseline": 1.0,
            "delta": 0.6,
            "direction": "up",
            "deviation": 0.6,
            "category": "insurance",
            "severity": "high",
            "label": "Repair Cost Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "supply_chain_stress": {
            "value": 0.3,
            "baseline": 0.3,
            "delta": 0.0,
            "direction": "stable",
            "deviation": 0.0,
            "category": "macro",
            "severity": "low",
            "label": "Supply Chain Stress Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "currency_volatility": {
            "value": 0.06,
            "baseline": 0.05,
            "delta": 0.01,
            "direction": "up",
            "deviation": 0.2,
            "category": "context",
            "severity": "low",
            "label": "Currency Volatility",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          },
          "interest_rate": {
            "value": 5.0,
            "baseline": 5.0,
            "delta": 0.0,
            "direction": "stable",
            "deviation": 0.0,
            "category": "macro",
            "severity": "low",
            "label": "Central Bank Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.731370+00:00"
          }
        },
        "executive_brief": "A Fraud Surge scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 9 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 98%. Recommendation: ESCALATE for immediate senior review (confidence 94%).",
        "signal_summary": {
          "elevated_count": 3,
          "critical_signals": [
            "fraud_index"
          ],
          "high_signals": [
            "claims_rate",
            "repair_cost_index"
          ],
          "top_movers": [
            {
              "key": "oil_price",
              "label": "Oil Price (Brent)",
              "delta": 10.0,
              "direction": "up",
              "severity": "moderate"
            },
            {
              "key": "inflation",
              "label": "CPI Inflation Rate",
              "delta": 1.3,
              "direction": "up",
              "severity": "moderate"
            },
            {
              "key": "fraud_index",
              "label": "Fraud Alert Index",
              "delta": 0.61,
              "direction": "up",
              "severity": "critical"
            },
            {
              "key": "repair_cost_index",
              "label": "Repair Cost Index",
              "delta": 0.6,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "claims_rate",
              "label": "Claims Frequency",
              "delta": 0.43,
              "direction": "up",
              "severity": "high"
            }
          ]
        }
      }
    }
  },
  "geopolitical_escalation": {
    "version": "4.3.1",
    "demo_id": "geopolitical_escalation",
    "locale": "en",
    "demo_meta": {
      "title": "Regional Tensions — Full-Spectrum Risk Cascade",
      "headline": "Oil surges to $142, supply chains freeze at 0.92 stress, and currency volatility triples — a full-spectrum geopolitical event cascading across all GCC insurance lines.",
      "narrative": "A full-spectrum geopolitical event: oil at $142, supply chain stress at 0.92, currency volatility tripled to 0.19. Qatar — with its concentrated LNG economy and 2017 blockade precedent — is the focal point, but all 6 GCC countries hit critical impact levels. Every signal elevated, every graph node active, every insurance line affected. The system maintains composure: traceable decision, audit-ready hash, clear executive brief. This is the stress-test demo — proving the system does not collapse under maximum load but instead produces a higher-quality output when it matters most.",
      "expected_decision": "ESCALATE",
      "dominant_signals": [
        "oil_price",
        "supply_chain_stress",
        "currency_volatility",
        "interest_rate"
      ],
      "country_focus": "QA",
      "country_focus_label": "Qatar — LNG exporter with concentrated economy, geopolitical exposure history (2017 blockade precedent)",
      "talking_points": [
        "PRESENTER: 'Everything is breaking at once. This is the stress test.' — system does not collapse, it clarifies",
        "FULL SPECTRUM: All 8 signals elevated, all 14 graph nodes active, all 4 insurance lines affected",
        "QATAR: 2017 blockade precedent gives this scenario real-world credibility with GCC enterprise audiences",
        "COMPOSURE: Under maximum load the system produces higher-quality output — more reasoning, clearer brief",
        "AUDIT: SHA-256 hash chain unbroken under stress — tamper-proof even at peak system load",
        "CONTRAST: Run this after oil_spike — shows how the system differentiates targeted shock from systemic crisis"
      ],
      "kpi": {
        "oil_price": {
          "baseline": 85,
          "demo": 142,
          "delta_pct": "+67%",
          "severity": "critical"
        },
        "supply_chain_stress": {
          "baseline": 0.3,
          "demo": 0.92,
          "delta_pct": "+207%",
          "severity": "critical"
        },
        "currency_volatility": {
          "baseline": 0.05,
          "demo": 0.19,
          "delta_pct": "+280%",
          "severity": "critical"
        },
        "interest_rate": {
          "baseline": 5.0,
          "demo": 7.8,
          "delta_pct": "+56%",
          "severity": "high"
        }
      }
    },
    "country_card": {
      "id": "QA",
      "display_name": "Qatar",
      "flag_emoji": "🇶🇦",
      "strategic_role": "World's largest LNG exporter (77M tonnes/year). Highest GDP per capita globally ($88K). QIA sovereign fund ($475B). Economy concentrated around North Field gas.",
      "risk_role": "LNG-oil price correlation at 0.78 transmits oil shocks with 30-day lag. 2017 blockade precedent makes geopolitical scenarios immediately credible. Concentrated economy amplifies any single-vector disruption.",
      "risk_signature": "Concentrated wealth, concentrated risk. One disruption vector can move the entire economy.",
      "key_metric": "LNG-oil correlation 0.78 — 2017 blockade precedent — economy moves as a unit under geopolitical stress",
      "insurance_market_gwp": "$4.2B",
      "sector_emphasis": [
        "energy",
        "property_insurance",
        "marine_insurance"
      ],
      "oil_dependency": 0.8,
      "demo_highlight": "Geopolitical demo: Qatar is the focal point. 2017 blockade precedent gives this scenario immediate credibility with GCC enterprise buyers.",
      "available": true,
      "scenario_cue": "PRIMARY TARGET. Concentrated economy + blockade precedent = maximum amplification."
    },
    "ui_payload": {
      "version": "4.1.1",
      "locale": "en",
      "timestamp": "2026-03-25T16:04:15.809737+00:00",
      "top_bar": {
        "scenario_id": "oil_spike",
        "scenario_label": "OIL SPIKE",
        "decision": "ESCALATE",
        "decision_style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "risk_score": 1.0,
        "confidence": 0.95,
        "elevated_count": 7,
        "critical_signals": [
          "oil_price",
          "repair_cost_index",
          "supply_chain_stress"
        ],
        "high_signals": [
          "inflation",
          "claims_rate",
          "currency_volatility",
          "interest_rate"
        ],
        "timestamp": "2026-03-25T16:04:15.803755+00:00",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · 7 elevated signals · risk 1.00",
        "impact_level": "critical",
        "demo_headline": "Oil surges to $142, supply chains freeze at 0.92 stress, and currency volatility triples — a full-spectrum geopolitical event cascading across all GCC insurance lines."
      },
      "signal_rail": [
        {
          "id": "oil_price",
          "label": "Oil Price (Brent)",
          "value": 142,
          "unit": "USD/barrel",
          "delta": 57.0,
          "direction": "up",
          "category": "macro",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 0.6706,
          "baseline": 85.0,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0005,
            0.075,
            0.138,
            0.1843,
            0.2374,
            0.3176,
            0.3671,
            0.4284,
            0.4937,
            0.5507,
            0.6161,
            0.6706
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "repair_cost_index",
          "label": "Repair Cost Index",
          "value": 1.8,
          "unit": "index",
          "delta": 0.8,
          "direction": "up",
          "category": "insurance",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 0.8,
          "baseline": 1.0,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0068,
            0.0647,
            0.1614,
            0.2256,
            0.2953,
            0.3502,
            0.4409,
            0.5078,
            0.5809,
            0.662,
            0.7345,
            0.8
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "supply_chain_stress",
          "label": "Supply Chain Stress Index",
          "value": 0.92,
          "unit": "index",
          "delta": 0.62,
          "direction": "up",
          "category": "macro",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 2.0,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0097,
            0.2056,
            0.3751,
            0.5524,
            0.7577,
            0.9497,
            1.1259,
            1.3077,
            1.4941,
            1.6876,
            1.8762,
            2.0667
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "inflation",
          "label": "CPI Inflation Rate",
          "value": 6.8,
          "unit": "percent",
          "delta": 4.3,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.72,
          "baseline": 2.5,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            -0.0172,
            0.1461,
            0.327,
            0.4609,
            0.625,
            0.7926,
            0.9435,
            1.0964,
            1.2433,
            1.4117,
            1.5681,
            1.72
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "interest_rate",
          "label": "Central Bank Rate",
          "value": 7.8,
          "unit": "percent",
          "delta": 2.8,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 0.56,
          "baseline": 5.0,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            -0.0139,
            0.0491,
            0.1125,
            0.1443,
            0.2005,
            0.2656,
            0.3102,
            0.3633,
            0.4107,
            0.4634,
            0.5042,
            0.56
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "claims_rate",
          "label": "Claims Frequency",
          "value": 0.72,
          "unit": "ratio",
          "delta": 0.37,
          "direction": "up",
          "category": "insurance",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.0571,
          "baseline": 0.35,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0015,
            0.105,
            0.1925,
            0.2861,
            0.37,
            0.4743,
            0.5829,
            0.6766,
            0.7624,
            0.869,
            0.9649,
            1.0571
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "currency_volatility",
          "label": "Currency Volatility",
          "value": 0.19,
          "unit": "index",
          "delta": 0.14,
          "direction": "up",
          "category": "context",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 2.0,
          "baseline": 0.05,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0017,
            0.2701,
            0.5002,
            0.7755,
            1.0107,
            1.2596,
            1.534,
            1.7841,
            2.0348,
            2.2832,
            2.5395,
            2.8
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "fraud_index",
          "label": "Fraud Alert Index",
          "value": 0.62,
          "unit": "index",
          "delta": 0.32,
          "direction": "up",
          "category": "risk",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 1.0667,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "sparkline": [
            0.0044,
            0.0869,
            0.2053,
            0.287,
            0.383,
            0.4749,
            0.5783,
            0.6683,
            0.774,
            0.8768,
            0.9724,
            1.0667
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        }
      ],
      "decision_rail": {
        "decision": "ESCALATE",
        "confidence": 0.95,
        "risk_score": 1.0,
        "summary": "Scenario 'Oil Price Spike' detected. Severity 0.89, blended risk 1.00. Decision: ESCALATE (confidence 0.95).",
        "reasoning": [
          "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
          "Critical signals: Oil Price (Brent) (up), Repair Cost Index (up), Supply Chain Stress Index (up).",
          "Elevated signals: CPI Inflation Rate (up), Claims Frequency (up), Currency Volatility (up), Central Bank Rate (up).",
          "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
          "All 6 GCC markets affected.",
          "Portfolio risk HIGH under oil_spike.",
          "Claims impact HIGH.",
          "Fraud exposure HIGH.",
          "Combined risk score 1.00 exceeds escalation threshold. Immediate senior review required."
        ],
        "style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "scenario_id": "oil_spike",
        "trace_hash": "3def7d6940cc9682f72fcedf47d8003c1e916d8aeb9a24fba5842711079ca3b8",
        "agents": [
          {
            "agent": "risk_analyst",
            "risk": 1.8306,
            "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.83. Reserve adequacy review recommended."
          },
          {
            "agent": "claims_analyst",
            "risk": 1.9055,
            "observation": "Claims impact HIGH. Expected cost movement 1.91. Recommend claims triage escalation."
          },
          {
            "agent": "fraud_analyst",
            "risk": 1.1733,
            "observation": "Fraud exposure HIGH. Indicator strength 1.17. Flag for SIU review."
          }
        ],
        "short_reasoning": "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · risk 1.00",
        "impact_level": "critical",
        "demo_headline": "Oil surges to $142, supply chains freeze at 0.92 stress, and currency volatility triples — a full-spectrum geopolitical event cascading across all GCC insurance lines.",
        "demo_short_reasoning": "A full-spectrum geopolitical event: oil at $142, supply chain stress at 0.92, currency volatility tripled to 0.19."
      },
      "propagation_panel": {
        "cause_effect_chain": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 1.0,
            "readable": "Oil Price is driving Inflation (weight 1.00)"
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8504,
            "readable": "Oil Price is driving Repair Costs (weight 0.85)"
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.7087,
            "readable": "Oil Price is driving Supply Chain Stress (weight 0.71)"
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4961,
            "readable": "Oil Price correlates with Interest Rates (weight 0.50)"
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.8338,
            "readable": "Inflation is driving Claims Frequency (weight 0.83)"
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9854,
            "readable": "Inflation is driving Repair Costs (weight 0.99)"
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.6064,
            "readable": "Inflation is putting pressure on Premium Pricing (weight 0.61)"
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.4672,
            "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.47)"
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.292,
            "readable": "Interest Rates correlates with Premium Pricing (weight 0.29)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.5664,
            "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.57)"
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.62,
            "readable": "Repair Costs is driving Claims Frequency (weight 0.62)"
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.682,
            "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.68)"
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.558,
            "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.56)"
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
          }
        ],
        "readable_path": [
          "Oil Price → Inflation",
          "Oil Price → Repair Costs",
          "Oil Price → Supply Chain Stress",
          "Oil Price → Interest Rates",
          "Inflation → Claims Frequency",
          "Inflation → Repair Costs",
          "Inflation → Premium Pricing",
          "Interest Rates → Reserve Adequacy",
          "Interest Rates → Premium Pricing",
          "Supply Chain Stress → Repair Costs",
          "Supply Chain Stress → Claims Frequency",
          "Fraud Alerts → Fraud Activity",
          "Repair Costs → Claims Frequency",
          "Repair Costs → Reserve Adequacy",
          "Repair Costs → Premium Pricing",
          "Claims Frequency → Fraud Activity",
          "Claims Frequency → Loss Ratio",
          "Claims Frequency → Reserve Adequacy",
          "Reserve Adequacy → Regulatory Pressure",
          "Fraud Activity → SIU Investigations",
          "Fraud Activity → Loss Ratio",
          "Loss Ratio → Premium Pricing",
          "Loss Ratio → Reinsurance Cost",
          "Loss Ratio → Regulatory Pressure",
          "SIU Investigations → Fraud Activity"
        ],
        "traversal_steps": 25,
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "active_node_count": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "pressure_summary": {
          "oil_price": 0.6706,
          "inflation": 2.3906,
          "interest_rate": 0.8927,
          "supply_chain_stress": 2.4753,
          "fraud_alerts": 1.0667,
          "repair_cost_index": 5.0652,
          "claims": 3.0629,
          "pricing": 2.456,
          "reserves": 1.8111,
          "fraud": 1.44,
          "loss_ratio": 1.6806,
          "regulatory_pressure": 0.6602,
          "investigation": 0.9067,
          "reinsurance_cost": 0.6884
        }
      },
      "executive_brief": {
        "text": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 100%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "decision": "ESCALATE",
        "confidence": 0.95,
        "headline_summary": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions.",
        "impact_level": "critical"
      },
      "graph_summary": {
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "total_active": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "node_pressures": {
          "oil_price": 0.6706,
          "inflation": 2.3906,
          "interest_rate": 0.8927,
          "supply_chain_stress": 2.4753,
          "fraud_alerts": 1.0667,
          "repair_cost_index": 5.0652,
          "claims": 3.0629,
          "pricing": 2.456,
          "reserves": 1.8111,
          "fraud": 1.44,
          "loss_ratio": 1.6806,
          "regulatory_pressure": 0.6602,
          "investigation": 0.9067,
          "reinsurance_cost": 0.6884
        },
        "max_pressure": 5.0652,
        "node_details": [
          {
            "id": "claims",
            "pressure": 3.0629,
            "severity_score": 0.996,
            "impact_level": "critical"
          },
          {
            "id": "pricing",
            "pressure": 2.456,
            "severity_score": 0.985,
            "impact_level": "critical"
          },
          {
            "id": "reserves",
            "pressure": 1.8111,
            "severity_score": 0.948,
            "impact_level": "critical"
          },
          {
            "id": "loss_ratio",
            "pressure": 1.6806,
            "severity_score": 0.933,
            "impact_level": "critical"
          },
          {
            "id": "fraud",
            "pressure": 1.44,
            "severity_score": 0.894,
            "impact_level": "critical"
          },
          {
            "id": "investigation",
            "pressure": 0.9067,
            "severity_score": 0.72,
            "impact_level": "high"
          },
          {
            "id": "reinsurance_cost",
            "pressure": 0.6884,
            "severity_score": 0.597,
            "impact_level": "medium"
          },
          {
            "id": "regulatory_pressure",
            "pressure": 0.6602,
            "severity_score": 0.578,
            "impact_level": "medium"
          }
        ],
        "edge_details": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8504,
            "intensity": 0.85
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.7087,
            "intensity": 0.709
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4961,
            "intensity": 0.496
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.8338,
            "intensity": 0.834
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9854,
            "intensity": 0.985
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.6064,
            "intensity": 0.606
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.4672,
            "intensity": 0.467
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.292,
            "intensity": 0.292
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.5664,
            "intensity": 0.566
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.62,
            "intensity": 0.62
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.682,
            "intensity": 0.682
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.558,
            "intensity": 0.558
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "intensity": 0.8
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "intensity": 0.55
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "intensity": 0.85
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "intensity": 0.5
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "intensity": 0.6
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "intensity": 0.3
          }
        ],
        "max_intensity": 1.0
      },
      "raw": {
        "simulation_result": {
          "active_scenario": "oil_spike",
          "impacted_domains": [
            "oil_price",
            "supply_chain_stress",
            "reserves",
            "fraud",
            "regulatory_pressure",
            "reinsurance_cost",
            "interest_rate",
            "repair_cost_index",
            "claims",
            "fraud_alerts",
            "investigation",
            "pricing",
            "inflation",
            "loss_ratio"
          ],
          "severity": 0.892,
          "simulated_changes": {
            "claims": {
              "direction": "increase",
              "magnitude": 2.0,
              "propagation_depth": 1
            },
            "pricing": {
              "direction": "increase",
              "magnitude": 2.0,
              "propagation_depth": 2
            },
            "reserves": {
              "direction": "increase",
              "magnitude": 1.8111,
              "propagation_depth": 3
            },
            "fraud": {
              "direction": "increase",
              "magnitude": 1.44,
              "propagation_depth": 4
            },
            "loss_ratio": {
              "direction": "increase",
              "magnitude": 1.6806,
              "propagation_depth": 5
            },
            "regulatory_pressure": {
              "direction": "increase",
              "magnitude": 0.6602,
              "propagation_depth": 6
            },
            "investigation": {
              "direction": "increase",
              "magnitude": 0.9067,
              "propagation_depth": 7
            },
            "reinsurance_cost": {
              "direction": "increase",
              "magnitude": 0.6884,
              "propagation_depth": 8
            }
          },
          "graph_links_used": [
            "oil_price -> inflation",
            "oil_price -> repair_cost_index",
            "oil_price -> supply_chain_stress",
            "oil_price -> interest_rate",
            "inflation -> claims",
            "inflation -> repair_cost_index",
            "inflation -> pricing",
            "interest_rate -> reserves",
            "interest_rate -> pricing",
            "supply_chain_stress -> repair_cost_index",
            "supply_chain_stress -> claims",
            "fraud_alerts -> fraud",
            "repair_cost_index -> claims",
            "repair_cost_index -> reserves",
            "repair_cost_index -> pricing",
            "claims -> fraud",
            "claims -> loss_ratio",
            "claims -> reserves",
            "reserves -> regulatory_pressure",
            "fraud -> investigation",
            "fraud -> loss_ratio",
            "loss_ratio -> pricing",
            "loss_ratio -> reinsurance_cost",
            "loss_ratio -> regulatory_pressure",
            "investigation -> fraud"
          ]
        },
        "decision_trace": {
          "timestamp": "2026-03-25T16:04:15.803755+00:00",
          "input_signals": {
            "oil_price": 142,
            "inflation": 6.8,
            "claims_rate": 0.72,
            "fraud_index": 0.62,
            "repair_cost_index": 1.8,
            "supply_chain_stress": 0.92,
            "currency_volatility": 0.19,
            "interest_rate": 7.8
          },
          "detected_scenario": "oil_spike",
          "agent_observations": [
            {
              "agent": "risk_analyst",
              "assessed_risk": 1.8306,
              "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.83. Reserve adequacy review recommended."
            },
            {
              "agent": "claims_analyst",
              "assessed_risk": 1.9055,
              "observation": "Claims impact HIGH. Expected cost movement 1.91. Recommend claims triage escalation."
            },
            {
              "agent": "fraud_analyst",
              "assessed_risk": 1.1733,
              "observation": "Fraud exposure HIGH. Indicator strength 1.17. Flag for SIU review."
            }
          ],
          "final_risk_score": 1.0,
          "final_decision": "ESCALATE",
          "confidence": 0.95,
          "trace_hash": "3def7d6940cc9682f72fcedf47d8003c1e916d8aeb9a24fba5842711079ca3b8"
        },
        "decision": {
          "decision": "ESCALATE",
          "confidence": 0.95,
          "risk_score": 1.0,
          "summary": "Scenario 'Oil Price Spike' detected. Severity 0.89, blended risk 1.00. Decision: ESCALATE (confidence 0.95).",
          "reasoning": [
            "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
            "Critical signals: Oil Price (Brent) (up), Repair Cost Index (up), Supply Chain Stress Index (up).",
            "Elevated signals: CPI Inflation Rate (up), Claims Frequency (up), Currency Volatility (up), Central Bank Rate (up).",
            "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
            "All 6 GCC markets affected.",
            "Portfolio risk HIGH under oil_spike.",
            "Claims impact HIGH.",
            "Fraud exposure HIGH.",
            "Combined risk score 1.00 exceeds escalation threshold. Immediate senior review required."
          ]
        },
        "graph_state": {
          "active_nodes": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "affected_countries": [
            "AE",
            "BH",
            "KW",
            "OM",
            "QA",
            "SA"
          ],
          "affected_sectors": [
            "banking",
            "energy",
            "healthcare",
            "insurance",
            "logistics",
            "retail"
          ],
          "affected_insurance_lines": [
            "marine",
            "medical",
            "motor",
            "property"
          ],
          "weighted_impacts": {
            "oil_price": 0.6706,
            "inflation": 2.3906,
            "interest_rate": 0.8927,
            "supply_chain_stress": 2.4753,
            "fraud_alerts": 1.0667,
            "repair_cost_index": 5.0652,
            "claims": 3.0629,
            "pricing": 2.456,
            "reserves": 1.8111,
            "fraud": 1.44,
            "loss_ratio": 1.6806,
            "regulatory_pressure": 0.6602,
            "investigation": 0.9067,
            "reinsurance_cost": 0.6884
          }
        },
        "propagation_trace": {
          "root_signal": [
            "oil_price",
            "inflation",
            "interest_rate",
            "supply_chain_stress",
            "fraud_alerts",
            "repair_cost_index"
          ],
          "traversal_path": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 1.0,
              "transmitted_pressure": 0.6706,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.8504,
              "transmitted_pressure": 0.5703,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.7087,
              "transmitted_pressure": 0.4753,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4961,
              "transmitted_pressure": 0.3327,
              "relation_type": "correlates"
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.8338,
              "transmitted_pressure": 1.4341,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.9854,
              "transmitted_pressure": 1.6949,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.6064,
              "transmitted_pressure": 1.043,
              "relation_type": "pressures"
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.4672,
              "transmitted_pressure": 0.2616,
              "relation_type": "affects"
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.292,
              "transmitted_pressure": 0.1635,
              "relation_type": "correlates"
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0,
              "transmitted_pressure": 2.0,
              "relation_type": "drives"
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.5664,
              "transmitted_pressure": 1.1328,
              "relation_type": "amplifies"
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0,
              "transmitted_pressure": 1.0667,
              "relation_type": "indicates"
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.62,
              "transmitted_pressure": 0.496,
              "relation_type": "drives"
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.682,
              "transmitted_pressure": 0.5456,
              "relation_type": "erodes"
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.558,
              "transmitted_pressure": 0.4464,
              "relation_type": "pressures"
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45,
              "transmitted_pressure": 0.6453,
              "relation_type": "enables"
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8,
              "transmitted_pressure": 1.1473,
              "relation_type": "drives"
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7,
              "transmitted_pressure": 1.0039,
              "relation_type": "depletes"
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55,
              "transmitted_pressure": 0.1439,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85,
              "transmitted_pressure": 0.9067,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5,
              "transmitted_pressure": 0.5333,
              "relation_type": "inflates"
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7,
              "transmitted_pressure": 0.8031,
              "relation_type": "forces"
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6,
              "transmitted_pressure": 0.6884,
              "relation_type": "drives"
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45,
              "transmitted_pressure": 0.5163,
              "relation_type": "triggers"
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3,
              "transmitted_pressure": -0.272,
              "relation_type": "suppresses"
            }
          ],
          "edge_weights_used": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 1.0
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.8504
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.7087
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4961
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.8338
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.9854
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.6064
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.4672
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.292
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.5664
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.62
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.682
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.558
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3
            }
          ],
          "impacted_nodes_in_order": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "final_pressure_summary": {
            "oil_price": 0.6706,
            "inflation": 2.3906,
            "interest_rate": 0.8927,
            "supply_chain_stress": 2.4753,
            "fraud_alerts": 1.0667,
            "repair_cost_index": 5.0652,
            "claims": 3.0629,
            "pricing": 2.456,
            "reserves": 1.8111,
            "fraud": 1.44,
            "loss_ratio": 1.6806,
            "regulatory_pressure": 0.6602,
            "investigation": 0.9067,
            "reinsurance_cost": 0.6884
          },
          "cause_effect_chain": [
            {
              "from": "Oil Price",
              "to": "Inflation",
              "relation": "is driving",
              "weight": 1.0,
              "readable": "Oil Price is driving Inflation (weight 1.00)"
            },
            {
              "from": "Oil Price",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.8504,
              "readable": "Oil Price is driving Repair Costs (weight 0.85)"
            },
            {
              "from": "Oil Price",
              "to": "Supply Chain Stress",
              "relation": "is driving",
              "weight": 0.7087,
              "readable": "Oil Price is driving Supply Chain Stress (weight 0.71)"
            },
            {
              "from": "Oil Price",
              "to": "Interest Rates",
              "relation": "correlates with",
              "weight": 0.4961,
              "readable": "Oil Price correlates with Interest Rates (weight 0.50)"
            },
            {
              "from": "Inflation",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.8338,
              "readable": "Inflation is driving Claims Frequency (weight 0.83)"
            },
            {
              "from": "Inflation",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.9854,
              "readable": "Inflation is driving Repair Costs (weight 0.99)"
            },
            {
              "from": "Inflation",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.6064,
              "readable": "Inflation is putting pressure on Premium Pricing (weight 0.61)"
            },
            {
              "from": "Interest Rates",
              "to": "Reserve Adequacy",
              "relation": "is affecting",
              "weight": 0.4672,
              "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.47)"
            },
            {
              "from": "Interest Rates",
              "to": "Premium Pricing",
              "relation": "correlates with",
              "weight": 0.292,
              "readable": "Interest Rates correlates with Premium Pricing (weight 0.29)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 1.0,
              "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Claims Frequency",
              "relation": "is amplifying",
              "weight": 0.5664,
              "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.57)"
            },
            {
              "from": "Fraud Alerts",
              "to": "Fraud Activity",
              "relation": "indicates rising",
              "weight": 1.0,
              "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
            },
            {
              "from": "Repair Costs",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.62,
              "readable": "Repair Costs is driving Claims Frequency (weight 0.62)"
            },
            {
              "from": "Repair Costs",
              "to": "Reserve Adequacy",
              "relation": "is eroding",
              "weight": 0.682,
              "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.68)"
            },
            {
              "from": "Repair Costs",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.558,
              "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.56)"
            },
            {
              "from": "Claims Frequency",
              "to": "Fraud Activity",
              "relation": "is enabling",
              "weight": 0.45,
              "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
            },
            {
              "from": "Claims Frequency",
              "to": "Loss Ratio",
              "relation": "is driving",
              "weight": 0.8,
              "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
            },
            {
              "from": "Claims Frequency",
              "to": "Reserve Adequacy",
              "relation": "is depleting",
              "weight": 0.7,
              "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
            },
            {
              "from": "Reserve Adequacy",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.55,
              "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
            },
            {
              "from": "Fraud Activity",
              "to": "SIU Investigations",
              "relation": "is triggering",
              "weight": 0.85,
              "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
            },
            {
              "from": "Fraud Activity",
              "to": "Loss Ratio",
              "relation": "is inflating",
              "weight": 0.5,
              "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
            },
            {
              "from": "Loss Ratio",
              "to": "Premium Pricing",
              "relation": "is forcing changes in",
              "weight": 0.7,
              "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
            },
            {
              "from": "Loss Ratio",
              "to": "Reinsurance Cost",
              "relation": "is driving",
              "weight": 0.6,
              "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
            },
            {
              "from": "Loss Ratio",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.45,
              "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
            },
            {
              "from": "SIU Investigations",
              "to": "Fraud Activity",
              "relation": "is suppressing",
              "weight": -0.3,
              "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
            }
          ],
          "readable_path": [
            "Oil Price → Inflation",
            "Oil Price → Repair Costs",
            "Oil Price → Supply Chain Stress",
            "Oil Price → Interest Rates",
            "Inflation → Claims Frequency",
            "Inflation → Repair Costs",
            "Inflation → Premium Pricing",
            "Interest Rates → Reserve Adequacy",
            "Interest Rates → Premium Pricing",
            "Supply Chain Stress → Repair Costs",
            "Supply Chain Stress → Claims Frequency",
            "Fraud Alerts → Fraud Activity",
            "Repair Costs → Claims Frequency",
            "Repair Costs → Reserve Adequacy",
            "Repair Costs → Premium Pricing",
            "Claims Frequency → Fraud Activity",
            "Claims Frequency → Loss Ratio",
            "Claims Frequency → Reserve Adequacy",
            "Reserve Adequacy → Regulatory Pressure",
            "Fraud Activity → SIU Investigations",
            "Fraud Activity → Loss Ratio",
            "Loss Ratio → Premium Pricing",
            "Loss Ratio → Reinsurance Cost",
            "Loss Ratio → Regulatory Pressure",
            "SIU Investigations → Fraud Activity"
          ]
        },
        "enriched_signals": {
          "oil_price": {
            "value": 142,
            "baseline": 85.0,
            "delta": 57.0,
            "direction": "up",
            "deviation": 0.6706,
            "category": "macro",
            "severity": "critical",
            "label": "Oil Price (Brent)",
            "unit": "USD/barrel",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "inflation": {
            "value": 6.8,
            "baseline": 2.5,
            "delta": 4.3,
            "direction": "up",
            "deviation": 1.72,
            "category": "macro",
            "severity": "high",
            "label": "CPI Inflation Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "claims_rate": {
            "value": 0.72,
            "baseline": 0.35,
            "delta": 0.37,
            "direction": "up",
            "deviation": 1.0571,
            "category": "insurance",
            "severity": "high",
            "label": "Claims Frequency",
            "unit": "ratio",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "fraud_index": {
            "value": 0.62,
            "baseline": 0.3,
            "delta": 0.32,
            "direction": "up",
            "deviation": 1.0667,
            "category": "risk",
            "severity": "moderate",
            "label": "Fraud Alert Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "repair_cost_index": {
            "value": 1.8,
            "baseline": 1.0,
            "delta": 0.8,
            "direction": "up",
            "deviation": 0.8,
            "category": "insurance",
            "severity": "critical",
            "label": "Repair Cost Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "supply_chain_stress": {
            "value": 0.92,
            "baseline": 0.3,
            "delta": 0.62,
            "direction": "up",
            "deviation": 2.0,
            "category": "macro",
            "severity": "critical",
            "label": "Supply Chain Stress Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "currency_volatility": {
            "value": 0.19,
            "baseline": 0.05,
            "delta": 0.14,
            "direction": "up",
            "deviation": 2.0,
            "category": "context",
            "severity": "high",
            "label": "Currency Volatility",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          },
          "interest_rate": {
            "value": 7.8,
            "baseline": 5.0,
            "delta": 2.8,
            "direction": "up",
            "deviation": 0.56,
            "category": "macro",
            "severity": "high",
            "label": "Central Bank Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.803755+00:00"
          }
        },
        "executive_brief": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 100%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "signal_summary": {
          "elevated_count": 7,
          "critical_signals": [
            "oil_price",
            "repair_cost_index",
            "supply_chain_stress"
          ],
          "high_signals": [
            "inflation",
            "claims_rate",
            "currency_volatility",
            "interest_rate"
          ],
          "top_movers": [
            {
              "key": "oil_price",
              "label": "Oil Price (Brent)",
              "delta": 57.0,
              "direction": "up",
              "severity": "critical"
            },
            {
              "key": "inflation",
              "label": "CPI Inflation Rate",
              "delta": 4.3,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "interest_rate",
              "label": "Central Bank Rate",
              "delta": 2.8,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "repair_cost_index",
              "label": "Repair Cost Index",
              "delta": 0.8,
              "direction": "up",
              "severity": "critical"
            },
            {
              "key": "supply_chain_stress",
              "label": "Supply Chain Stress Index",
              "delta": 0.62,
              "direction": "up",
              "severity": "critical"
            }
          ]
        }
      }
    }
  },
  "oil_spike": {
    "version": "4.3.1",
    "demo_id": "oil_spike",
    "locale": "en",
    "demo_meta": {
      "title": "Brent Crude Surge — GCC-Wide Cascade",
      "headline": "Brent crude surges 59% to $135/bbl — inflation pass-through drives motor claims cost up 75%, triggering ESCALATE across all 6 GCC markets with risk 0.95+.",
      "narrative": "Brent crude hits $135/bbl — 59% above the $85 baseline — as OPEC+ production cuts tighten global supply. The propagation cascade is immediate: oil_price → inflation (6.2%, 148% above baseline) → repair_cost_index (1.75, 75% above baseline). Saudi Arabia absorbs the first shock at 0.85 oil dependency, then transmits pressure to Kuwait (0.90) and Qatar (0.80) within the same tick. Motor and property insurance lines cross critical thresholds simultaneously. Three analyst agents converge on ESCALATE with 0.97+ confidence. The executive brief auto-generates in <300ms with a clear action path: freeze new motor underwriting, trigger IFRS 17 reserve adequacy review, notify PDPL compliance for premium adjustment disclosures.",
      "expected_decision": "ESCALATE",
      "dominant_signals": [
        "oil_price",
        "inflation",
        "repair_cost_index",
        "supply_chain_stress"
      ],
      "country_focus": "SA",
      "country_focus_label": "Saudi Arabia — OPEC swing producer, oil_price node has highest in-degree weight in the graph",
      "talking_points": [
        "PRESENTER: 'Brent just hit $135. Watch what happens next.' — click Run, the cascade fills in 300ms",
        "GRAPH: Oil_price node turns red first (SA), then propagates outward to KW→QA→AE within one tick",
        "CONTRAST: Fraud index stays at 0.35 (low) — this is a pure macro cascade, not a fraud event. The system knows the difference.",
        "DECISION: Three independent AI analysts converge on ESCALATE. No human tuning — pure signal-driven.",
        "COMPLIANCE: Executive brief auto-recommends IFRS 17 reserve review and PDPL disclosure triggers",
        "SPEED: Full pipeline — 8 signals, 14 graph nodes, 25 edges, 3 agents — completes in <300ms"
      ],
      "kpi": {
        "oil_price": {
          "baseline": 85,
          "demo": 135,
          "delta_pct": "+59%",
          "severity": "critical"
        },
        "inflation": {
          "baseline": 2.5,
          "demo": 6.2,
          "delta_pct": "+148%",
          "severity": "high"
        },
        "repair_cost_index": {
          "baseline": 1.0,
          "demo": 1.75,
          "delta_pct": "+75%",
          "severity": "high"
        },
        "supply_chain_stress": {
          "baseline": 0.3,
          "demo": 0.6,
          "delta_pct": "+100%",
          "severity": "moderate"
        }
      }
    },
    "country_card": {
      "id": "SA",
      "display_name": "Saudi Arabia",
      "flag_emoji": "🇸🇦",
      "strategic_role": "Largest GCC economy ($1.1T GDP). OPEC swing producer. Vision 2030 diversification anchor. Sets the tempo for regional macro risk.",
      "risk_role": "Primary oil price transmission node — highest in-degree weight in the DEEVO graph. PDPL compliance gateway for data sovereignty. IFRS 17 early adopter driving GCC-wide accounting convergence.",
      "risk_signature": "When oil moves, SA moves first. Everything else follows.",
      "key_metric": "Oil dependency 0.85 — every $10/bbl move translates to 2.3% claims cost inflation within 60 days",
      "insurance_market_gwp": "$11.2B",
      "sector_emphasis": [
        "energy",
        "motor_insurance",
        "medical_insurance"
      ],
      "oil_dependency": 0.85,
      "demo_highlight": "Oil spike demo: SA node turns red first. The propagation cascade originates here and fans outward to all 5 GCC peers.",
      "available": true,
      "scenario_cue": "First node to activate. Transmits to KW and QA within same tick."
    },
    "ui_payload": {
      "version": "4.1.1",
      "locale": "en",
      "timestamp": "2026-03-25T16:04:15.709775+00:00",
      "top_bar": {
        "scenario_id": "oil_spike",
        "scenario_label": "OIL SPIKE",
        "decision": "ESCALATE",
        "decision_style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "risk_score": 1.0,
        "confidence": 0.95,
        "elevated_count": 3,
        "critical_signals": [
          "oil_price"
        ],
        "high_signals": [
          "inflation",
          "repair_cost_index"
        ],
        "timestamp": "2026-03-25T16:04:15.702621+00:00",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · 3 elevated signals · risk 1.00",
        "impact_level": "critical",
        "demo_headline": "Brent crude surges 59% to $135/bbl — inflation pass-through drives motor claims cost up 75%, triggering ESCALATE across all 6 GCC markets with risk 0.95+."
      },
      "signal_rail": [
        {
          "id": "oil_price",
          "label": "Oil Price (Brent)",
          "value": 135,
          "unit": "USD/barrel",
          "delta": 50.0,
          "direction": "up",
          "category": "macro",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 0.5882,
          "baseline": 85.0,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0005,
            0.0675,
            0.1231,
            0.1619,
            0.2075,
            0.2802,
            0.3221,
            0.376,
            0.4338,
            0.4833,
            0.5413,
            0.5882
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "inflation",
          "label": "CPI Inflation Rate",
          "value": 6.2,
          "unit": "percent",
          "delta": 3.7,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.48,
          "baseline": 2.5,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            -0.0172,
            0.1243,
            0.2833,
            0.3955,
            0.5378,
            0.6835,
            0.8126,
            0.9437,
            1.0687,
            1.2153,
            1.35,
            1.48
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "repair_cost_index",
          "label": "Repair Cost Index",
          "value": 1.75,
          "unit": "index",
          "delta": 0.75,
          "direction": "up",
          "category": "insurance",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 0.75,
          "baseline": 1.0,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0068,
            0.0602,
            0.1523,
            0.2119,
            0.2771,
            0.3274,
            0.4137,
            0.476,
            0.5445,
            0.6211,
            0.6891,
            0.75
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "interest_rate",
          "label": "Central Bank Rate",
          "value": 6.5,
          "unit": "percent",
          "delta": 1.5,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.3,
          "baseline": 5.0,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            -0.0139,
            0.0254,
            0.0653,
            0.0734,
            0.1059,
            0.1474,
            0.1683,
            0.1978,
            0.2217,
            0.2506,
            0.2679,
            0.3
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "claims_rate",
          "label": "Claims Frequency",
          "value": 0.68,
          "unit": "ratio",
          "delta": 0.33,
          "direction": "up",
          "category": "insurance",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.9429,
          "baseline": 0.35,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0015,
            0.0946,
            0.1717,
            0.2549,
            0.3285,
            0.4223,
            0.5206,
            0.6039,
            0.6793,
            0.7755,
            0.861,
            0.9429
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "supply_chain_stress",
          "label": "Supply Chain Stress Index",
          "value": 0.6,
          "unit": "index",
          "delta": 0.3,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 1.0,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0097,
            0.1087,
            0.1812,
            0.2614,
            0.3698,
            0.4649,
            0.544,
            0.6289,
            0.7184,
            0.8148,
            0.9065,
            1.0
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "currency_volatility",
          "label": "Currency Volatility",
          "value": 0.1,
          "unit": "index",
          "delta": 0.05,
          "direction": "up",
          "category": "context",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 1.0,
          "baseline": 0.05,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0017,
            0.1065,
            0.173,
            0.2846,
            0.3562,
            0.4414,
            0.5522,
            0.6387,
            0.7257,
            0.8105,
            0.9031,
            1.0
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "fraud_index",
          "label": "Fraud Alert Index",
          "value": 0.35,
          "unit": "index",
          "delta": 0.05,
          "direction": "up",
          "category": "risk",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.1667,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "sparkline": [
            0.0044,
            0.0051,
            0.0417,
            0.0415,
            0.0557,
            0.0658,
            0.0874,
            0.0955,
            0.1195,
            0.1404,
            0.1542,
            0.1667
          ],
          "movement": "accelerating",
          "impact_level": "low"
        }
      ],
      "decision_rail": {
        "decision": "ESCALATE",
        "confidence": 0.95,
        "risk_score": 1.0,
        "summary": "Scenario 'Oil Price Spike' detected. Severity 0.87, blended risk 1.00. Decision: ESCALATE (confidence 0.95).",
        "reasoning": [
          "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
          "Critical signals: Oil Price (Brent) (up).",
          "Elevated signals: CPI Inflation Rate (up), Repair Cost Index (up).",
          "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
          "All 6 GCC markets affected.",
          "Portfolio risk HIGH under oil_spike.",
          "Claims impact HIGH.",
          "Combined risk score 1.00 exceeds escalation threshold. Immediate senior review required."
        ],
        "style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "scenario_id": "oil_spike",
        "trace_hash": "296012603b267cc970cf9ccf564d09f97bee2f968a07c9b2b9baae0ec081abcc",
        "agents": [
          {
            "agent": "risk_analyst",
            "risk": 1.4912,
            "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.49. Reserve adequacy review recommended."
          },
          {
            "agent": "claims_analyst",
            "risk": 1.7294,
            "observation": "Claims impact HIGH. Expected cost movement 1.73. Recommend claims triage escalation."
          },
          {
            "agent": "fraud_analyst",
            "risk": 0.3831,
            "observation": "Fraud exposure LOW. Indicator strength 0.38. Routine monitoring sufficient."
          }
        ],
        "short_reasoning": "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · risk 1.00",
        "impact_level": "critical",
        "demo_headline": "Brent crude surges 59% to $135/bbl — inflation pass-through drives motor claims cost up 75%, triggering ESCALATE across all 6 GCC markets with risk 0.95+.",
        "demo_short_reasoning": "Brent crude hits $135/bbl — 59% above the $85 baseline — as OPEC+ production cuts tighten global supply."
      },
      "propagation_panel": {
        "cause_effect_chain": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 1.0,
            "readable": "Oil Price is driving Inflation (weight 1.00)"
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8541,
            "readable": "Oil Price is driving Repair Costs (weight 0.85)"
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.7118,
            "readable": "Oil Price is driving Supply Chain Stress (weight 0.71)"
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4982,
            "readable": "Oil Price correlates with Interest Rates (weight 0.50)"
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.7942,
            "readable": "Inflation is driving Claims Frequency (weight 0.79)"
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9386,
            "readable": "Inflation is driving Repair Costs (weight 0.94)"
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5776,
            "readable": "Inflation is putting pressure on Premium Pricing (weight 0.58)"
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.436,
            "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.44)"
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.2725,
            "readable": "Interest Rates correlates with Premium Pricing (weight 0.27)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.4719,
            "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.47)"
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 0.8925,
            "readable": "Fraud Alerts indicates rising Fraud Activity (weight 0.89)"
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6125,
            "readable": "Repair Costs is driving Claims Frequency (weight 0.61)"
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6738,
            "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.67)"
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5513,
            "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.55)"
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
          }
        ],
        "readable_path": [
          "Oil Price → Inflation",
          "Oil Price → Repair Costs",
          "Oil Price → Supply Chain Stress",
          "Oil Price → Interest Rates",
          "Inflation → Claims Frequency",
          "Inflation → Repair Costs",
          "Inflation → Premium Pricing",
          "Interest Rates → Reserve Adequacy",
          "Interest Rates → Premium Pricing",
          "Supply Chain Stress → Repair Costs",
          "Supply Chain Stress → Claims Frequency",
          "Fraud Alerts → Fraud Activity",
          "Repair Costs → Claims Frequency",
          "Repair Costs → Reserve Adequacy",
          "Repair Costs → Premium Pricing",
          "Claims Frequency → Fraud Activity",
          "Claims Frequency → Loss Ratio",
          "Claims Frequency → Reserve Adequacy",
          "Reserve Adequacy → Regulatory Pressure",
          "Fraud Activity → SIU Investigations",
          "Fraud Activity → Loss Ratio",
          "Loss Ratio → Premium Pricing",
          "Loss Ratio → Reinsurance Cost",
          "Loss Ratio → Regulatory Pressure",
          "SIU Investigations → Fraud Activity"
        ],
        "traversal_steps": 25,
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "active_node_count": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "pressure_summary": {
          "oil_price": 0.5882,
          "inflation": 2.0682,
          "interest_rate": 0.593,
          "supply_chain_stress": 1.4187,
          "fraud_alerts": 0.1667,
          "repair_cost_index": 3.6415,
          "claims": 2.1067,
          "pricing": 2.0083,
          "reserves": 1.4589,
          "fraud": 0.6398,
          "loss_ratio": 1.0147,
          "regulatory_pressure": 0.495,
          "investigation": 0.1265,
          "reinsurance_cost": 0.5642
        }
      },
      "executive_brief": {
        "text": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 100%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "decision": "ESCALATE",
        "confidence": 0.95,
        "headline_summary": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions.",
        "impact_level": "critical"
      },
      "graph_summary": {
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "total_active": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "node_pressures": {
          "oil_price": 0.5882,
          "inflation": 2.0682,
          "interest_rate": 0.593,
          "supply_chain_stress": 1.4187,
          "fraud_alerts": 0.1667,
          "repair_cost_index": 3.6415,
          "claims": 2.1067,
          "pricing": 2.0083,
          "reserves": 1.4589,
          "fraud": 0.6398,
          "loss_ratio": 1.0147,
          "regulatory_pressure": 0.495,
          "investigation": 0.1265,
          "reinsurance_cost": 0.5642
        },
        "max_pressure": 3.6415,
        "node_details": [
          {
            "id": "claims",
            "pressure": 2.1067,
            "severity_score": 0.971,
            "impact_level": "critical"
          },
          {
            "id": "pricing",
            "pressure": 2.0083,
            "severity_score": 0.965,
            "impact_level": "critical"
          },
          {
            "id": "reserves",
            "pressure": 1.4589,
            "severity_score": 0.897,
            "impact_level": "critical"
          },
          {
            "id": "loss_ratio",
            "pressure": 1.0147,
            "severity_score": 0.768,
            "impact_level": "high"
          },
          {
            "id": "fraud",
            "pressure": 0.6398,
            "severity_score": 0.565,
            "impact_level": "medium"
          },
          {
            "id": "reinsurance_cost",
            "pressure": 0.5642,
            "severity_score": 0.511,
            "impact_level": "medium"
          },
          {
            "id": "regulatory_pressure",
            "pressure": 0.495,
            "severity_score": 0.458,
            "impact_level": "medium"
          },
          {
            "id": "investigation",
            "pressure": 0.1265,
            "severity_score": 0.126,
            "impact_level": "low"
          }
        ],
        "edge_details": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8541,
            "intensity": 0.854
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.7118,
            "intensity": 0.712
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4982,
            "intensity": 0.498
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.7942,
            "intensity": 0.794
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9386,
            "intensity": 0.939
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5776,
            "intensity": 0.578
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.436,
            "intensity": 0.436
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.2725,
            "intensity": 0.273
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.4719,
            "intensity": 0.472
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 0.8925,
            "intensity": 0.892
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6125,
            "intensity": 0.613
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6738,
            "intensity": 0.674
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5513,
            "intensity": 0.551
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "intensity": 0.8
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "intensity": 0.55
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "intensity": 0.85
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "intensity": 0.5
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "intensity": 0.6
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "intensity": 0.3
          }
        ],
        "max_intensity": 1.0
      },
      "raw": {
        "simulation_result": {
          "active_scenario": "oil_spike",
          "impacted_domains": [
            "oil_price",
            "supply_chain_stress",
            "reserves",
            "fraud",
            "regulatory_pressure",
            "reinsurance_cost",
            "interest_rate",
            "repair_cost_index",
            "claims",
            "fraud_alerts",
            "investigation",
            "pricing",
            "inflation",
            "loss_ratio"
          ],
          "severity": 0.868,
          "simulated_changes": {
            "claims": {
              "direction": "increase",
              "magnitude": 2.0,
              "propagation_depth": 1
            },
            "pricing": {
              "direction": "increase",
              "magnitude": 2.0,
              "propagation_depth": 2
            },
            "reserves": {
              "direction": "increase",
              "magnitude": 1.4589,
              "propagation_depth": 3
            },
            "fraud": {
              "direction": "increase",
              "magnitude": 0.6398,
              "propagation_depth": 4
            },
            "loss_ratio": {
              "direction": "increase",
              "magnitude": 1.0147,
              "propagation_depth": 5
            },
            "regulatory_pressure": {
              "direction": "increase",
              "magnitude": 0.495,
              "propagation_depth": 6
            },
            "investigation": {
              "direction": "increase",
              "magnitude": 0.1265,
              "propagation_depth": 7
            },
            "reinsurance_cost": {
              "direction": "increase",
              "magnitude": 0.5642,
              "propagation_depth": 8
            }
          },
          "graph_links_used": [
            "oil_price -> inflation",
            "oil_price -> repair_cost_index",
            "oil_price -> supply_chain_stress",
            "oil_price -> interest_rate",
            "inflation -> claims",
            "inflation -> repair_cost_index",
            "inflation -> pricing",
            "interest_rate -> reserves",
            "interest_rate -> pricing",
            "supply_chain_stress -> repair_cost_index",
            "supply_chain_stress -> claims",
            "fraud_alerts -> fraud",
            "repair_cost_index -> claims",
            "repair_cost_index -> reserves",
            "repair_cost_index -> pricing",
            "claims -> fraud",
            "claims -> loss_ratio",
            "claims -> reserves",
            "reserves -> regulatory_pressure",
            "fraud -> investigation",
            "fraud -> loss_ratio",
            "loss_ratio -> pricing",
            "loss_ratio -> reinsurance_cost",
            "loss_ratio -> regulatory_pressure",
            "investigation -> fraud"
          ]
        },
        "decision_trace": {
          "timestamp": "2026-03-25T16:04:15.702621+00:00",
          "input_signals": {
            "oil_price": 135,
            "inflation": 6.2,
            "claims_rate": 0.68,
            "fraud_index": 0.35,
            "repair_cost_index": 1.75,
            "supply_chain_stress": 0.6,
            "currency_volatility": 0.1,
            "interest_rate": 6.5
          },
          "detected_scenario": "oil_spike",
          "agent_observations": [
            {
              "agent": "risk_analyst",
              "assessed_risk": 1.4912,
              "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.49. Reserve adequacy review recommended."
            },
            {
              "agent": "claims_analyst",
              "assessed_risk": 1.7294,
              "observation": "Claims impact HIGH. Expected cost movement 1.73. Recommend claims triage escalation."
            },
            {
              "agent": "fraud_analyst",
              "assessed_risk": 0.3831,
              "observation": "Fraud exposure LOW. Indicator strength 0.38. Routine monitoring sufficient."
            }
          ],
          "final_risk_score": 1.0,
          "final_decision": "ESCALATE",
          "confidence": 0.95,
          "trace_hash": "296012603b267cc970cf9ccf564d09f97bee2f968a07c9b2b9baae0ec081abcc"
        },
        "decision": {
          "decision": "ESCALATE",
          "confidence": 0.95,
          "risk_score": 1.0,
          "summary": "Scenario 'Oil Price Spike' detected. Severity 0.87, blended risk 1.00. Decision: ESCALATE (confidence 0.95).",
          "reasoning": [
            "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
            "Critical signals: Oil Price (Brent) (up).",
            "Elevated signals: CPI Inflation Rate (up), Repair Cost Index (up).",
            "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
            "All 6 GCC markets affected.",
            "Portfolio risk HIGH under oil_spike.",
            "Claims impact HIGH.",
            "Combined risk score 1.00 exceeds escalation threshold. Immediate senior review required."
          ]
        },
        "graph_state": {
          "active_nodes": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "affected_countries": [
            "AE",
            "BH",
            "KW",
            "OM",
            "QA",
            "SA"
          ],
          "affected_sectors": [
            "banking",
            "energy",
            "healthcare",
            "insurance",
            "logistics",
            "retail"
          ],
          "affected_insurance_lines": [
            "marine",
            "medical",
            "motor",
            "property"
          ],
          "weighted_impacts": {
            "oil_price": 0.5882,
            "inflation": 2.0682,
            "interest_rate": 0.593,
            "supply_chain_stress": 1.4187,
            "fraud_alerts": 0.1667,
            "repair_cost_index": 3.6415,
            "claims": 2.1067,
            "pricing": 2.0083,
            "reserves": 1.4589,
            "fraud": 0.6398,
            "loss_ratio": 1.0147,
            "regulatory_pressure": 0.495,
            "investigation": 0.1265,
            "reinsurance_cost": 0.5642
          }
        },
        "propagation_trace": {
          "root_signal": [
            "oil_price",
            "inflation",
            "interest_rate",
            "supply_chain_stress",
            "fraud_alerts",
            "repair_cost_index"
          ],
          "traversal_path": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 1.0,
              "transmitted_pressure": 0.5882,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.8541,
              "transmitted_pressure": 0.5024,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.7118,
              "transmitted_pressure": 0.4187,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4982,
              "transmitted_pressure": 0.293,
              "relation_type": "correlates"
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.7942,
              "transmitted_pressure": 1.1754,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.9386,
              "transmitted_pressure": 1.3891,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.5776,
              "transmitted_pressure": 0.8548,
              "relation_type": "pressures"
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.436,
              "transmitted_pressure": 0.1308,
              "relation_type": "affects"
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.2725,
              "transmitted_pressure": 0.0818,
              "relation_type": "correlates"
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0,
              "transmitted_pressure": 1.0,
              "relation_type": "drives"
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.4719,
              "transmitted_pressure": 0.4719,
              "relation_type": "amplifies"
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 0.8925,
              "transmitted_pressure": 0.1488,
              "relation_type": "indicates"
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.6125,
              "transmitted_pressure": 0.4594,
              "relation_type": "drives"
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6738,
              "transmitted_pressure": 0.5053,
              "relation_type": "erodes"
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5513,
              "transmitted_pressure": 0.4135,
              "relation_type": "pressures"
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45,
              "transmitted_pressure": 0.5289,
              "relation_type": "enables"
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8,
              "transmitted_pressure": 0.9403,
              "relation_type": "drives"
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7,
              "transmitted_pressure": 0.8228,
              "relation_type": "depletes"
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55,
              "transmitted_pressure": 0.0719,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85,
              "transmitted_pressure": 0.1265,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5,
              "transmitted_pressure": 0.0744,
              "relation_type": "inflates"
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7,
              "transmitted_pressure": 0.6582,
              "relation_type": "forces"
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6,
              "transmitted_pressure": 0.5642,
              "relation_type": "drives"
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45,
              "transmitted_pressure": 0.4231,
              "relation_type": "triggers"
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3,
              "transmitted_pressure": -0.0379,
              "relation_type": "suppresses"
            }
          ],
          "edge_weights_used": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 1.0
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.8541
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.7118
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4982
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.7942
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.9386
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.5776
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.436
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.2725
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.4719
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 0.8925
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.6125
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6738
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5513
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3
            }
          ],
          "impacted_nodes_in_order": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "final_pressure_summary": {
            "oil_price": 0.5882,
            "inflation": 2.0682,
            "interest_rate": 0.593,
            "supply_chain_stress": 1.4187,
            "fraud_alerts": 0.1667,
            "repair_cost_index": 3.6415,
            "claims": 2.1067,
            "pricing": 2.0083,
            "reserves": 1.4589,
            "fraud": 0.6398,
            "loss_ratio": 1.0147,
            "regulatory_pressure": 0.495,
            "investigation": 0.1265,
            "reinsurance_cost": 0.5642
          },
          "cause_effect_chain": [
            {
              "from": "Oil Price",
              "to": "Inflation",
              "relation": "is driving",
              "weight": 1.0,
              "readable": "Oil Price is driving Inflation (weight 1.00)"
            },
            {
              "from": "Oil Price",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.8541,
              "readable": "Oil Price is driving Repair Costs (weight 0.85)"
            },
            {
              "from": "Oil Price",
              "to": "Supply Chain Stress",
              "relation": "is driving",
              "weight": 0.7118,
              "readable": "Oil Price is driving Supply Chain Stress (weight 0.71)"
            },
            {
              "from": "Oil Price",
              "to": "Interest Rates",
              "relation": "correlates with",
              "weight": 0.4982,
              "readable": "Oil Price correlates with Interest Rates (weight 0.50)"
            },
            {
              "from": "Inflation",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.7942,
              "readable": "Inflation is driving Claims Frequency (weight 0.79)"
            },
            {
              "from": "Inflation",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.9386,
              "readable": "Inflation is driving Repair Costs (weight 0.94)"
            },
            {
              "from": "Inflation",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.5776,
              "readable": "Inflation is putting pressure on Premium Pricing (weight 0.58)"
            },
            {
              "from": "Interest Rates",
              "to": "Reserve Adequacy",
              "relation": "is affecting",
              "weight": 0.436,
              "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.44)"
            },
            {
              "from": "Interest Rates",
              "to": "Premium Pricing",
              "relation": "correlates with",
              "weight": 0.2725,
              "readable": "Interest Rates correlates with Premium Pricing (weight 0.27)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 1.0,
              "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Claims Frequency",
              "relation": "is amplifying",
              "weight": 0.4719,
              "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.47)"
            },
            {
              "from": "Fraud Alerts",
              "to": "Fraud Activity",
              "relation": "indicates rising",
              "weight": 0.8925,
              "readable": "Fraud Alerts indicates rising Fraud Activity (weight 0.89)"
            },
            {
              "from": "Repair Costs",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.6125,
              "readable": "Repair Costs is driving Claims Frequency (weight 0.61)"
            },
            {
              "from": "Repair Costs",
              "to": "Reserve Adequacy",
              "relation": "is eroding",
              "weight": 0.6738,
              "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.67)"
            },
            {
              "from": "Repair Costs",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.5513,
              "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.55)"
            },
            {
              "from": "Claims Frequency",
              "to": "Fraud Activity",
              "relation": "is enabling",
              "weight": 0.45,
              "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
            },
            {
              "from": "Claims Frequency",
              "to": "Loss Ratio",
              "relation": "is driving",
              "weight": 0.8,
              "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
            },
            {
              "from": "Claims Frequency",
              "to": "Reserve Adequacy",
              "relation": "is depleting",
              "weight": 0.7,
              "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
            },
            {
              "from": "Reserve Adequacy",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.55,
              "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
            },
            {
              "from": "Fraud Activity",
              "to": "SIU Investigations",
              "relation": "is triggering",
              "weight": 0.85,
              "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
            },
            {
              "from": "Fraud Activity",
              "to": "Loss Ratio",
              "relation": "is inflating",
              "weight": 0.5,
              "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
            },
            {
              "from": "Loss Ratio",
              "to": "Premium Pricing",
              "relation": "is forcing changes in",
              "weight": 0.7,
              "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
            },
            {
              "from": "Loss Ratio",
              "to": "Reinsurance Cost",
              "relation": "is driving",
              "weight": 0.6,
              "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
            },
            {
              "from": "Loss Ratio",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.45,
              "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
            },
            {
              "from": "SIU Investigations",
              "to": "Fraud Activity",
              "relation": "is suppressing",
              "weight": -0.3,
              "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
            }
          ],
          "readable_path": [
            "Oil Price → Inflation",
            "Oil Price → Repair Costs",
            "Oil Price → Supply Chain Stress",
            "Oil Price → Interest Rates",
            "Inflation → Claims Frequency",
            "Inflation → Repair Costs",
            "Inflation → Premium Pricing",
            "Interest Rates → Reserve Adequacy",
            "Interest Rates → Premium Pricing",
            "Supply Chain Stress → Repair Costs",
            "Supply Chain Stress → Claims Frequency",
            "Fraud Alerts → Fraud Activity",
            "Repair Costs → Claims Frequency",
            "Repair Costs → Reserve Adequacy",
            "Repair Costs → Premium Pricing",
            "Claims Frequency → Fraud Activity",
            "Claims Frequency → Loss Ratio",
            "Claims Frequency → Reserve Adequacy",
            "Reserve Adequacy → Regulatory Pressure",
            "Fraud Activity → SIU Investigations",
            "Fraud Activity → Loss Ratio",
            "Loss Ratio → Premium Pricing",
            "Loss Ratio → Reinsurance Cost",
            "Loss Ratio → Regulatory Pressure",
            "SIU Investigations → Fraud Activity"
          ]
        },
        "enriched_signals": {
          "oil_price": {
            "value": 135,
            "baseline": 85.0,
            "delta": 50.0,
            "direction": "up",
            "deviation": 0.5882,
            "category": "macro",
            "severity": "critical",
            "label": "Oil Price (Brent)",
            "unit": "USD/barrel",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "inflation": {
            "value": 6.2,
            "baseline": 2.5,
            "delta": 3.7,
            "direction": "up",
            "deviation": 1.48,
            "category": "macro",
            "severity": "high",
            "label": "CPI Inflation Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "claims_rate": {
            "value": 0.68,
            "baseline": 0.35,
            "delta": 0.33,
            "direction": "up",
            "deviation": 0.9429,
            "category": "insurance",
            "severity": "moderate",
            "label": "Claims Frequency",
            "unit": "ratio",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "fraud_index": {
            "value": 0.35,
            "baseline": 0.3,
            "delta": 0.05,
            "direction": "up",
            "deviation": 0.1667,
            "category": "risk",
            "severity": "low",
            "label": "Fraud Alert Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "repair_cost_index": {
            "value": 1.75,
            "baseline": 1.0,
            "delta": 0.75,
            "direction": "up",
            "deviation": 0.75,
            "category": "insurance",
            "severity": "high",
            "label": "Repair Cost Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "supply_chain_stress": {
            "value": 0.6,
            "baseline": 0.3,
            "delta": 0.3,
            "direction": "up",
            "deviation": 1.0,
            "category": "macro",
            "severity": "moderate",
            "label": "Supply Chain Stress Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "currency_volatility": {
            "value": 0.1,
            "baseline": 0.05,
            "delta": 0.05,
            "direction": "up",
            "deviation": 1.0,
            "category": "context",
            "severity": "moderate",
            "label": "Currency Volatility",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          },
          "interest_rate": {
            "value": 6.5,
            "baseline": 5.0,
            "delta": 1.5,
            "direction": "up",
            "deviation": 0.3,
            "category": "macro",
            "severity": "moderate",
            "label": "Central Bank Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.702621+00:00"
          }
        },
        "executive_brief": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 100%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "signal_summary": {
          "elevated_count": 3,
          "critical_signals": [
            "oil_price"
          ],
          "high_signals": [
            "inflation",
            "repair_cost_index"
          ],
          "top_movers": [
            {
              "key": "oil_price",
              "label": "Oil Price (Brent)",
              "delta": 50.0,
              "direction": "up",
              "severity": "critical"
            },
            {
              "key": "inflation",
              "label": "CPI Inflation Rate",
              "delta": 3.7,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "interest_rate",
              "label": "Central Bank Rate",
              "delta": 1.5,
              "direction": "up",
              "severity": "moderate"
            },
            {
              "key": "repair_cost_index",
              "label": "Repair Cost Index",
              "delta": 0.75,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "claims_rate",
              "label": "Claims Frequency",
              "delta": 0.33,
              "direction": "up",
              "severity": "moderate"
            }
          ]
        }
      }
    }
  },
  "repair_cost_inflation": {
    "version": "4.3.1",
    "demo_id": "repair_cost_inflation",
    "locale": "en",
    "demo_meta": {
      "title": "Repair Cost Spiral — Motor & Property Reserves",
      "headline": "Repair cost index climbs to 1.82 (+82% above baseline) while oil sits at $82 and fraud is low — compounding pressure triggers REVIEW with pricing adjustment recommended.",
      "narrative": "No single signal is critical. That is the point. Repair cost index has crept to 1.82 — 82% above baseline — as automotive parts shortages compound with 3.8% inflation. Claims frequency sits at 0.42 (moderate, not alarming). Supply chain stress at 0.42 (moderate). Fraud index at 0.32 (low). Oil price at $82 — below baseline. In isolation, every signal passes muster. Together, they erode motor and property reserve adequacy below IFRS 17 thresholds. Kuwait's motor-dominated portfolio (KIA-backed, 62% motor) takes the largest hit. This is the 'silent risk' demo — the system detects compounding pressure that would take a human analyst 3-5 days to identify. Decision: REVIEW, not ESCALATE — demonstrating calibrated judgment, not alarm fatigue.",
      "expected_decision": "REVIEW",
      "dominant_signals": [
        "repair_cost_index",
        "inflation",
        "claims_rate",
        "supply_chain_stress"
      ],
      "country_focus": "KW",
      "country_focus_label": "Kuwait — Highest oil dependency (0.90), motor-dominated insurance market, KIA sovereign wealth exposed",
      "talking_points": [
        "PRESENTER: 'Oil is at $82. Fraud is low. Every signal looks fine. Now watch the system's verdict.' — REVIEW appears. The audience gasps.",
        "KEY INSIGHT: No single signal crosses critical threshold — repair at 1.82, claims at 0.42, oil below baseline — but compounding pressure drives REVIEW",
        "CONTRAST: Run after oil_spike. That was ESCALATE. This is REVIEW. Same system, calibrated judgment — not alarm fatigue.",
        "IFRS 17: Reserve adequacy erosion detected below compliance thresholds — auto-flagged for actuarial review before any human notices",
        "COUNTRY: Kuwait's motor portfolio (62% of GWP, 0.90 oil dependency) absorbs 34% more impact than UAE equivalent",
        "VALUE PROP: A human analyst needs 3-5 days to spot compounding erosion across 8 signals. DEEVO Cortex catches it in one tick."
      ],
      "kpi": {
        "repair_cost_index": {
          "baseline": 1.0,
          "demo": 1.82,
          "delta_pct": "+82%",
          "severity": "critical"
        },
        "inflation": {
          "baseline": 2.5,
          "demo": 3.8,
          "delta_pct": "+52%",
          "severity": "moderate"
        },
        "claims_rate": {
          "baseline": 0.35,
          "demo": 0.42,
          "delta_pct": "+20%",
          "severity": "moderate"
        },
        "oil_price": {
          "baseline": 85,
          "demo": 82,
          "delta_pct": "-4%",
          "severity": "low"
        }
      }
    },
    "country_card": {
      "id": "KW",
      "display_name": "Kuwait",
      "flag_emoji": "🇰🇼",
      "strategic_role": "Highest oil dependency in GCC (0.90). KIA — world's oldest sovereign wealth fund ($900B+ AUM). Motor insurance dominates the portfolio at 62% of GWP.",
      "risk_role": "Extreme oil sensitivity amplifies every macro shock. Motor-dominated portfolio concentrates repair cost risk. Slow political reform pace creates regulatory lag.",
      "risk_signature": "The canary for repair cost erosion. If motor reserves are failing, KW shows it first.",
      "key_metric": "Oil dependency 0.90 — motor insurance at 62% of portfolio — 34% higher impact than UAE equivalent for same shock",
      "insurance_market_gwp": "$2.1B",
      "sector_emphasis": [
        "energy",
        "motor_insurance"
      ],
      "oil_dependency": 0.9,
      "demo_highlight": "Repair cost demo: KW absorbs 34% more impact than UAE for the same shock — motor concentration is the amplifier.",
      "available": true,
      "scenario_cue": "PRIMARY TARGET. Motor at 62% of portfolio means repair cost erosion hits KW hardest."
    },
    "ui_payload": {
      "version": "4.1.1",
      "locale": "en",
      "timestamp": "2026-03-25T16:04:15.789748+00:00",
      "top_bar": {
        "scenario_id": "repair_cost_inflation",
        "scenario_label": "REPAIR COST INFLATION",
        "decision": "REVIEW",
        "decision_style": {
          "color": "amber",
          "urgency": "soon",
          "icon": "eye"
        },
        "risk_score": 0.5633,
        "confidence": 0.71,
        "elevated_count": 1,
        "critical_signals": [
          "repair_cost_index"
        ],
        "high_signals": [],
        "timestamp": "2026-03-25T16:04:15.783390+00:00",
        "headline_summary": "REVIEW — Repair Cost Inflation flagged for review · 1 elevated signal · risk 0.56",
        "impact_level": "medium",
        "demo_headline": "Repair cost index climbs to 1.82 (+82% above baseline) while oil sits at $82 and fraud is low — compounding pressure triggers REVIEW with pricing adjustment recommended."
      },
      "signal_rail": [
        {
          "id": "repair_cost_index",
          "label": "Repair Cost Index",
          "value": 1.82,
          "unit": "index",
          "delta": 0.82,
          "direction": "up",
          "category": "insurance",
          "severity": "critical",
          "severity_style": {
            "color": "red",
            "priority": 4
          },
          "deviation": 0.82,
          "baseline": 1.0,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0068,
            0.0665,
            0.1651,
            0.231,
            0.3026,
            0.3593,
            0.4519,
            0.5205,
            0.5954,
            0.6784,
            0.7527,
            0.82
          ],
          "movement": "accelerating",
          "impact_level": "critical"
        },
        {
          "id": "inflation",
          "label": "CPI Inflation Rate",
          "value": 3.8,
          "unit": "percent",
          "delta": 1.3,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.52,
          "baseline": 2.5,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            -0.0172,
            0.0371,
            0.1088,
            0.1337,
            0.1887,
            0.2471,
            0.2889,
            0.3328,
            0.3705,
            0.4298,
            0.4772,
            0.52
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "oil_price",
          "label": "Oil Price (Brent)",
          "value": 82,
          "unit": "USD/barrel",
          "delta": -3.0,
          "direction": "down",
          "category": "macro",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.0,
          "baseline": 85.0,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0005,
            0.0108,
            0.0097,
            -0.0082,
            -0.0192,
            -0.0032,
            -0.018,
            -0.0208,
            -0.0197,
            -0.0269,
            -0.0256,
            -0.0353
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "interest_rate",
          "label": "Central Bank Rate",
          "value": 5.2,
          "unit": "percent",
          "delta": 0.2,
          "direction": "up",
          "category": "macro",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.04,
          "baseline": 5.0,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            -0.0139,
            0.0018,
            0.018,
            0.0025,
            0.0114,
            0.0292,
            0.0265,
            0.0323,
            0.0326,
            0.0379,
            0.0315,
            0.04
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "supply_chain_stress",
          "label": "Supply Chain Stress Index",
          "value": 0.42,
          "unit": "index",
          "delta": 0.12,
          "direction": "up",
          "category": "macro",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.4,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0097,
            0.0541,
            0.0721,
            0.0978,
            0.1516,
            0.1921,
            0.2168,
            0.2471,
            0.282,
            0.3239,
            0.3611,
            0.4
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "claims_rate",
          "label": "Claims Frequency",
          "value": 0.42,
          "unit": "ratio",
          "delta": 0.07,
          "direction": "up",
          "category": "insurance",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.2,
          "baseline": 0.35,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0015,
            0.0271,
            0.0366,
            0.0523,
            0.0584,
            0.0846,
            0.1154,
            0.1311,
            0.1391,
            0.1677,
            0.1857,
            0.2
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "fraud_index",
          "label": "Fraud Alert Index",
          "value": 0.32,
          "unit": "index",
          "delta": 0.02,
          "direction": "up",
          "category": "risk",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.0667,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0044,
            -0.004,
            0.0235,
            0.0142,
            0.0193,
            0.0203,
            0.0329,
            0.0319,
            0.0468,
            0.0586,
            0.0633,
            0.0667
          ],
          "movement": "accelerating",
          "impact_level": "low"
        },
        {
          "id": "currency_volatility",
          "label": "Currency Volatility",
          "value": 0.06,
          "unit": "index",
          "delta": 0.01,
          "direction": "up",
          "category": "context",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.2,
          "baseline": 0.05,
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "sparkline": [
            0.0017,
            0.0338,
            0.0275,
            0.0665,
            0.0653,
            0.0777,
            0.1158,
            0.1296,
            0.1439,
            0.156,
            0.1759,
            0.2
          ],
          "movement": "accelerating",
          "impact_level": "low"
        }
      ],
      "decision_rail": {
        "decision": "REVIEW",
        "confidence": 0.71,
        "risk_score": 0.5633,
        "summary": "Scenario 'Repair Cost Inflation' detected. Severity 0.49, blended risk 0.56. Decision: REVIEW (confidence 0.71).",
        "reasoning": [
          "Scenario 'Repair Cost Inflation' detected — Systematic increase in vehicle and property repair costs affecting reserves.",
          "Critical signals: Repair Cost Index (up).",
          "Graph propagation impacted 7 nodes including Claims Frequency, Premium Pricing, Fraud Activity, Reserve Adequacy, Loss Ratio.",
          "All 6 GCC markets affected.",
          "Portfolio risk MODERATE under repair_cost_inflation.",
          "Claims impact HIGH.",
          "Risk score 0.56 warrants manual review before approval."
        ],
        "style": {
          "color": "amber",
          "urgency": "soon",
          "icon": "eye"
        },
        "scenario_id": "repair_cost_inflation",
        "trace_hash": "03bdf6fdc5200f5d44ed43aa6154d2b68dfc4a977fac65fbcfe6b98c1d31157a",
        "agents": [
          {
            "agent": "risk_analyst",
            "risk": 0.6574,
            "observation": "Portfolio risk MODERATE under repair_cost_inflation. Simulated magnitude 0.66. Reserve adequacy review recommended."
          },
          {
            "agent": "claims_analyst",
            "risk": 0.9007,
            "observation": "Claims impact HIGH. Expected cost movement 0.90. Recommend claims triage escalation."
          },
          {
            "agent": "fraud_analyst",
            "risk": 0.2066,
            "observation": "Fraud exposure LOW. Indicator strength 0.21. Routine monitoring sufficient."
          }
        ],
        "short_reasoning": "Scenario 'Repair Cost Inflation' detected — Systematic increase in vehicle and property repair costs affecting reserves.",
        "headline_summary": "REVIEW — Repair Cost Inflation flagged for review · risk 0.56",
        "impact_level": "medium",
        "demo_headline": "Repair cost index climbs to 1.82 (+82% above baseline) while oil sits at $82 and fraud is low — compounding pressure triggers REVIEW with pricing adjustment recommended.",
        "demo_short_reasoning": "No single signal is critical."
      },
      "propagation_panel": {
        "cause_effect_chain": [
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6358,
            "readable": "Inflation is driving Claims Frequency (weight 0.64)"
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7514,
            "readable": "Inflation is driving Repair Costs (weight 0.75)"
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.4624,
            "readable": "Inflation is putting pressure on Premium Pricing (weight 0.46)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9722,
            "readable": "Supply Chain Stress is driving Repair Costs (weight 0.97)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.4166,
            "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.42)"
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 0.867,
            "readable": "Fraud Alerts indicates rising Fraud Activity (weight 0.87)"
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.623,
            "readable": "Repair Costs is driving Claims Frequency (weight 0.62)"
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6853,
            "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.69)"
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5607,
            "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.56)"
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
          }
        ],
        "readable_path": [
          "Inflation → Claims Frequency",
          "Inflation → Repair Costs",
          "Inflation → Premium Pricing",
          "Supply Chain Stress → Repair Costs",
          "Supply Chain Stress → Claims Frequency",
          "Fraud Alerts → Fraud Activity",
          "Repair Costs → Claims Frequency",
          "Repair Costs → Reserve Adequacy",
          "Repair Costs → Premium Pricing",
          "Claims Frequency → Fraud Activity",
          "Claims Frequency → Loss Ratio",
          "Claims Frequency → Reserve Adequacy",
          "Fraud Activity → SIU Investigations",
          "Fraud Activity → Loss Ratio",
          "Reserve Adequacy → Regulatory Pressure",
          "Loss Ratio → Premium Pricing",
          "Loss Ratio → Reinsurance Cost",
          "Loss Ratio → Regulatory Pressure"
        ],
        "traversal_steps": 18,
        "active_nodes": [
          "claims",
          "pricing",
          "fraud",
          "reserves",
          "loss_ratio",
          "regulatory_pressure",
          "reinsurance_cost"
        ],
        "active_node_count": 7,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "pressure_summary": {
          "inflation": 0.52,
          "supply_chain_stress": 0.4,
          "fraud_alerts": 0.0667,
          "repair_cost_index": 1.5996,
          "claims": 1.0081,
          "pricing": 0.8854,
          "fraud": 0.2066,
          "reserves": 0.7933,
          "loss_ratio": 0.2934,
          "investigation": 0.0491,
          "regulatory_pressure": 0.428,
          "reinsurance_cost": 0.1587
        }
      },
      "executive_brief": {
        "text": "A Repair Cost Inflation scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 7 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 56%. Recommendation: Flag for manual REVIEW before proceeding (confidence 71%).",
        "decision": "REVIEW",
        "confidence": 0.71,
        "headline_summary": "A Repair Cost Inflation scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 7 risk dimensions.",
        "impact_level": "medium"
      },
      "graph_summary": {
        "active_nodes": [
          "claims",
          "pricing",
          "fraud",
          "reserves",
          "loss_ratio",
          "regulatory_pressure",
          "reinsurance_cost"
        ],
        "total_active": 7,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "node_pressures": {
          "inflation": 0.52,
          "supply_chain_stress": 0.4,
          "fraud_alerts": 0.0667,
          "repair_cost_index": 1.5996,
          "claims": 1.0081,
          "pricing": 0.8854,
          "fraud": 0.2066,
          "reserves": 0.7933,
          "loss_ratio": 0.2934,
          "investigation": 0.0491,
          "regulatory_pressure": 0.428,
          "reinsurance_cost": 0.1587
        },
        "max_pressure": 1.5996,
        "node_details": [
          {
            "id": "claims",
            "pressure": 1.0081,
            "severity_score": 0.765,
            "impact_level": "high"
          },
          {
            "id": "pricing",
            "pressure": 0.8854,
            "severity_score": 0.709,
            "impact_level": "high"
          },
          {
            "id": "reserves",
            "pressure": 0.7933,
            "severity_score": 0.66,
            "impact_level": "high"
          },
          {
            "id": "regulatory_pressure",
            "pressure": 0.428,
            "severity_score": 0.404,
            "impact_level": "medium"
          },
          {
            "id": "loss_ratio",
            "pressure": 0.2934,
            "severity_score": 0.285,
            "impact_level": "low"
          },
          {
            "id": "fraud",
            "pressure": 0.2066,
            "severity_score": 0.204,
            "impact_level": "low"
          },
          {
            "id": "reinsurance_cost",
            "pressure": 0.1587,
            "severity_score": 0.157,
            "impact_level": "low"
          }
        ],
        "edge_details": [
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.6358,
            "intensity": 0.654
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7514,
            "intensity": 0.773
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.4624,
            "intensity": 0.476
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.9722,
            "intensity": 1.0
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.4166,
            "intensity": 0.429
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 0.867,
            "intensity": 0.892
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.623,
            "intensity": 0.641
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6853,
            "intensity": 0.705
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5607,
            "intensity": 0.577
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "intensity": 0.463
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "intensity": 0.823
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "intensity": 0.72
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "intensity": 0.874
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "intensity": 0.514
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "intensity": 0.566
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "intensity": 0.72
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "intensity": 0.617
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "intensity": 0.463
          }
        ],
        "max_intensity": 1.0
      },
      "raw": {
        "simulation_result": {
          "active_scenario": "repair_cost_inflation",
          "impacted_domains": [
            "supply_chain_stress",
            "reserves",
            "fraud",
            "regulatory_pressure",
            "reinsurance_cost",
            "repair_cost_index",
            "claims",
            "fraud_alerts",
            "pricing",
            "inflation",
            "loss_ratio"
          ],
          "severity": 0.4867,
          "simulated_changes": {
            "claims": {
              "direction": "increase",
              "magnitude": 1.0081,
              "propagation_depth": 1
            },
            "pricing": {
              "direction": "increase",
              "magnitude": 0.8854,
              "propagation_depth": 2
            },
            "fraud": {
              "direction": "increase",
              "magnitude": 0.2066,
              "propagation_depth": 3
            },
            "reserves": {
              "direction": "increase",
              "magnitude": 0.7933,
              "propagation_depth": 4
            },
            "loss_ratio": {
              "direction": "increase",
              "magnitude": 0.2934,
              "propagation_depth": 5
            },
            "regulatory_pressure": {
              "direction": "increase",
              "magnitude": 0.428,
              "propagation_depth": 6
            },
            "reinsurance_cost": {
              "direction": "increase",
              "magnitude": 0.1587,
              "propagation_depth": 7
            }
          },
          "graph_links_used": [
            "inflation -> claims",
            "inflation -> repair_cost_index",
            "inflation -> pricing",
            "supply_chain_stress -> repair_cost_index",
            "supply_chain_stress -> claims",
            "fraud_alerts -> fraud",
            "repair_cost_index -> claims",
            "repair_cost_index -> reserves",
            "repair_cost_index -> pricing",
            "claims -> fraud",
            "claims -> loss_ratio",
            "claims -> reserves",
            "fraud -> investigation",
            "fraud -> loss_ratio",
            "reserves -> regulatory_pressure",
            "loss_ratio -> pricing",
            "loss_ratio -> reinsurance_cost",
            "loss_ratio -> regulatory_pressure"
          ]
        },
        "decision_trace": {
          "timestamp": "2026-03-25T16:04:15.783390+00:00",
          "input_signals": {
            "oil_price": 82,
            "inflation": 3.8,
            "claims_rate": 0.42,
            "fraud_index": 0.32,
            "repair_cost_index": 1.82,
            "supply_chain_stress": 0.42,
            "currency_volatility": 0.06,
            "interest_rate": 5.2
          },
          "detected_scenario": "repair_cost_inflation",
          "agent_observations": [
            {
              "agent": "risk_analyst",
              "assessed_risk": 0.6574,
              "observation": "Portfolio risk MODERATE under repair_cost_inflation. Simulated magnitude 0.66. Reserve adequacy review recommended."
            },
            {
              "agent": "claims_analyst",
              "assessed_risk": 0.9007,
              "observation": "Claims impact HIGH. Expected cost movement 0.90. Recommend claims triage escalation."
            },
            {
              "agent": "fraud_analyst",
              "assessed_risk": 0.2066,
              "observation": "Fraud exposure LOW. Indicator strength 0.21. Routine monitoring sufficient."
            }
          ],
          "final_risk_score": 0.5633,
          "final_decision": "REVIEW",
          "confidence": 0.71,
          "trace_hash": "03bdf6fdc5200f5d44ed43aa6154d2b68dfc4a977fac65fbcfe6b98c1d31157a"
        },
        "decision": {
          "decision": "REVIEW",
          "confidence": 0.71,
          "risk_score": 0.5633,
          "summary": "Scenario 'Repair Cost Inflation' detected. Severity 0.49, blended risk 0.56. Decision: REVIEW (confidence 0.71).",
          "reasoning": [
            "Scenario 'Repair Cost Inflation' detected — Systematic increase in vehicle and property repair costs affecting reserves.",
            "Critical signals: Repair Cost Index (up).",
            "Graph propagation impacted 7 nodes including Claims Frequency, Premium Pricing, Fraud Activity, Reserve Adequacy, Loss Ratio.",
            "All 6 GCC markets affected.",
            "Portfolio risk MODERATE under repair_cost_inflation.",
            "Claims impact HIGH.",
            "Risk score 0.56 warrants manual review before approval."
          ]
        },
        "graph_state": {
          "active_nodes": [
            "claims",
            "pricing",
            "fraud",
            "reserves",
            "loss_ratio",
            "regulatory_pressure",
            "reinsurance_cost"
          ],
          "affected_countries": [
            "AE",
            "BH",
            "KW",
            "OM",
            "QA",
            "SA"
          ],
          "affected_sectors": [
            "banking",
            "energy",
            "healthcare",
            "insurance",
            "logistics",
            "retail"
          ],
          "affected_insurance_lines": [
            "marine",
            "medical",
            "motor",
            "property"
          ],
          "weighted_impacts": {
            "inflation": 0.52,
            "supply_chain_stress": 0.4,
            "fraud_alerts": 0.0667,
            "repair_cost_index": 1.5996,
            "claims": 1.0081,
            "pricing": 0.8854,
            "fraud": 0.2066,
            "reserves": 0.7933,
            "loss_ratio": 0.2934,
            "investigation": 0.0491,
            "regulatory_pressure": 0.428,
            "reinsurance_cost": 0.1587
          }
        },
        "propagation_trace": {
          "root_signal": [
            "inflation",
            "supply_chain_stress",
            "fraud_alerts",
            "repair_cost_index"
          ],
          "traversal_path": [
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.6358,
              "transmitted_pressure": 0.3306,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.7514,
              "transmitted_pressure": 0.3907,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.4624,
              "transmitted_pressure": 0.2404,
              "relation_type": "pressures"
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 0.9722,
              "transmitted_pressure": 0.3889,
              "relation_type": "drives"
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.4166,
              "transmitted_pressure": 0.1666,
              "relation_type": "amplifies"
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 0.867,
              "transmitted_pressure": 0.0578,
              "relation_type": "indicates"
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.623,
              "transmitted_pressure": 0.5109,
              "relation_type": "drives"
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6853,
              "transmitted_pressure": 0.5619,
              "relation_type": "erodes"
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5607,
              "transmitted_pressure": 0.4598,
              "relation_type": "pressures"
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45,
              "transmitted_pressure": 0.1488,
              "relation_type": "enables"
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8,
              "transmitted_pressure": 0.2645,
              "relation_type": "drives"
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7,
              "transmitted_pressure": 0.2314,
              "relation_type": "depletes"
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85,
              "transmitted_pressure": 0.0491,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5,
              "transmitted_pressure": 0.0289,
              "relation_type": "inflates"
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55,
              "transmitted_pressure": 0.309,
              "relation_type": "triggers"
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7,
              "transmitted_pressure": 0.1852,
              "relation_type": "forces"
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6,
              "transmitted_pressure": 0.1587,
              "relation_type": "drives"
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45,
              "transmitted_pressure": 0.119,
              "relation_type": "triggers"
            }
          ],
          "edge_weights_used": [
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.6358
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.7514
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.4624
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 0.9722
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.4166
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 0.867
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.623
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6853
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5607
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45
            }
          ],
          "impacted_nodes_in_order": [
            "claims",
            "pricing",
            "fraud",
            "reserves",
            "loss_ratio",
            "regulatory_pressure",
            "reinsurance_cost"
          ],
          "final_pressure_summary": {
            "inflation": 0.52,
            "supply_chain_stress": 0.4,
            "fraud_alerts": 0.0667,
            "repair_cost_index": 1.5996,
            "claims": 1.0081,
            "pricing": 0.8854,
            "fraud": 0.2066,
            "reserves": 0.7933,
            "loss_ratio": 0.2934,
            "investigation": 0.0491,
            "regulatory_pressure": 0.428,
            "reinsurance_cost": 0.1587
          },
          "cause_effect_chain": [
            {
              "from": "Inflation",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.6358,
              "readable": "Inflation is driving Claims Frequency (weight 0.64)"
            },
            {
              "from": "Inflation",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.7514,
              "readable": "Inflation is driving Repair Costs (weight 0.75)"
            },
            {
              "from": "Inflation",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.4624,
              "readable": "Inflation is putting pressure on Premium Pricing (weight 0.46)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.9722,
              "readable": "Supply Chain Stress is driving Repair Costs (weight 0.97)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Claims Frequency",
              "relation": "is amplifying",
              "weight": 0.4166,
              "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.42)"
            },
            {
              "from": "Fraud Alerts",
              "to": "Fraud Activity",
              "relation": "indicates rising",
              "weight": 0.867,
              "readable": "Fraud Alerts indicates rising Fraud Activity (weight 0.87)"
            },
            {
              "from": "Repair Costs",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.623,
              "readable": "Repair Costs is driving Claims Frequency (weight 0.62)"
            },
            {
              "from": "Repair Costs",
              "to": "Reserve Adequacy",
              "relation": "is eroding",
              "weight": 0.6853,
              "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.69)"
            },
            {
              "from": "Repair Costs",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.5607,
              "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.56)"
            },
            {
              "from": "Claims Frequency",
              "to": "Fraud Activity",
              "relation": "is enabling",
              "weight": 0.45,
              "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
            },
            {
              "from": "Claims Frequency",
              "to": "Loss Ratio",
              "relation": "is driving",
              "weight": 0.8,
              "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
            },
            {
              "from": "Claims Frequency",
              "to": "Reserve Adequacy",
              "relation": "is depleting",
              "weight": 0.7,
              "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
            },
            {
              "from": "Fraud Activity",
              "to": "SIU Investigations",
              "relation": "is triggering",
              "weight": 0.85,
              "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
            },
            {
              "from": "Fraud Activity",
              "to": "Loss Ratio",
              "relation": "is inflating",
              "weight": 0.5,
              "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
            },
            {
              "from": "Reserve Adequacy",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.55,
              "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
            },
            {
              "from": "Loss Ratio",
              "to": "Premium Pricing",
              "relation": "is forcing changes in",
              "weight": 0.7,
              "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
            },
            {
              "from": "Loss Ratio",
              "to": "Reinsurance Cost",
              "relation": "is driving",
              "weight": 0.6,
              "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
            },
            {
              "from": "Loss Ratio",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.45,
              "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
            }
          ],
          "readable_path": [
            "Inflation → Claims Frequency",
            "Inflation → Repair Costs",
            "Inflation → Premium Pricing",
            "Supply Chain Stress → Repair Costs",
            "Supply Chain Stress → Claims Frequency",
            "Fraud Alerts → Fraud Activity",
            "Repair Costs → Claims Frequency",
            "Repair Costs → Reserve Adequacy",
            "Repair Costs → Premium Pricing",
            "Claims Frequency → Fraud Activity",
            "Claims Frequency → Loss Ratio",
            "Claims Frequency → Reserve Adequacy",
            "Fraud Activity → SIU Investigations",
            "Fraud Activity → Loss Ratio",
            "Reserve Adequacy → Regulatory Pressure",
            "Loss Ratio → Premium Pricing",
            "Loss Ratio → Reinsurance Cost",
            "Loss Ratio → Regulatory Pressure"
          ]
        },
        "enriched_signals": {
          "oil_price": {
            "value": 82,
            "baseline": 85.0,
            "delta": -3.0,
            "direction": "down",
            "deviation": 0.0,
            "category": "macro",
            "severity": "low",
            "label": "Oil Price (Brent)",
            "unit": "USD/barrel",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "inflation": {
            "value": 3.8,
            "baseline": 2.5,
            "delta": 1.3,
            "direction": "up",
            "deviation": 0.52,
            "category": "macro",
            "severity": "moderate",
            "label": "CPI Inflation Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "claims_rate": {
            "value": 0.42,
            "baseline": 0.35,
            "delta": 0.07,
            "direction": "up",
            "deviation": 0.2,
            "category": "insurance",
            "severity": "low",
            "label": "Claims Frequency",
            "unit": "ratio",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "fraud_index": {
            "value": 0.32,
            "baseline": 0.3,
            "delta": 0.02,
            "direction": "up",
            "deviation": 0.0667,
            "category": "risk",
            "severity": "low",
            "label": "Fraud Alert Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "repair_cost_index": {
            "value": 1.82,
            "baseline": 1.0,
            "delta": 0.82,
            "direction": "up",
            "deviation": 0.82,
            "category": "insurance",
            "severity": "critical",
            "label": "Repair Cost Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "supply_chain_stress": {
            "value": 0.42,
            "baseline": 0.3,
            "delta": 0.12,
            "direction": "up",
            "deviation": 0.4,
            "category": "macro",
            "severity": "low",
            "label": "Supply Chain Stress Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "currency_volatility": {
            "value": 0.06,
            "baseline": 0.05,
            "delta": 0.01,
            "direction": "up",
            "deviation": 0.2,
            "category": "context",
            "severity": "low",
            "label": "Currency Volatility",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          },
          "interest_rate": {
            "value": 5.2,
            "baseline": 5.0,
            "delta": 0.2,
            "direction": "up",
            "deviation": 0.04,
            "category": "macro",
            "severity": "low",
            "label": "Central Bank Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.783390+00:00"
          }
        },
        "executive_brief": "A Repair Cost Inflation scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 7 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 56%. Recommendation: Flag for manual REVIEW before proceeding (confidence 71%).",
        "signal_summary": {
          "elevated_count": 1,
          "critical_signals": [
            "repair_cost_index"
          ],
          "high_signals": [],
          "top_movers": [
            {
              "key": "oil_price",
              "label": "Oil Price (Brent)",
              "delta": -3.0,
              "direction": "down",
              "severity": "low"
            },
            {
              "key": "inflation",
              "label": "CPI Inflation Rate",
              "delta": 1.3,
              "direction": "up",
              "severity": "moderate"
            },
            {
              "key": "repair_cost_index",
              "label": "Repair Cost Index",
              "delta": 0.82,
              "direction": "up",
              "severity": "critical"
            },
            {
              "key": "interest_rate",
              "label": "Central Bank Rate",
              "delta": 0.2,
              "direction": "up",
              "severity": "low"
            },
            {
              "key": "supply_chain_stress",
              "label": "Supply Chain Stress Index",
              "delta": 0.12,
              "direction": "up",
              "severity": "low"
            }
          ]
        }
      }
    }
  },
  "supply_chain_break": {
    "version": "4.3.1",
    "demo_id": "supply_chain_break",
    "locale": "en",
    "demo_meta": {
      "title": "Red Sea Shipping Disruption — Marine & Logistics Cascade",
      "headline": "Supply chain stress surges to 0.88 (+193%) as Red Sea corridor disruptions cascade through marine insurance, logistics costs, and GCC trade flows — ESCALATE with marine portfolio freeze.",
      "narrative": "Red Sea shipping corridor restrictions drive supply chain stress to 0.88 — 193% above the 0.30 baseline — as Houthi disruptions force re-routing around the Cape of Good Hope, adding 10-14 days to Asia-Europe transit. Oman's strategic position at the Strait of Hormuz (40% of world oil transit) makes it the first node to activate. But the cascade is multi-dimensional: supply_chain_stress → repair_cost_index (parts delayed, +65%) → inflation (5.2%, import cost pass-through) → oil_price ($120, risk premium). The propagation graph lights up the SA→AE→OM logistics triangle. Marine and property insurance lines cross critical thresholds. Currency volatility spikes to 0.12 as trade uncertainty shakes peg confidence. This scenario tests the system's ability to trace a single geopolitical event through four distinct impact channels.",
      "expected_decision": "ESCALATE",
      "dominant_signals": [
        "supply_chain_stress",
        "repair_cost_index",
        "inflation",
        "oil_price"
      ],
      "country_focus": "OM",
      "country_focus_label": "Oman — Strait of Hormuz gatekeeper, Duqm port as strategic bypass, 40% of world oil transits this chokepoint",
      "talking_points": [
        "PRESENTER: 'A single geopolitical event. Four distinct impact channels. Watch the cascade unfold.'",
        "GRAPH: supply_chain_stress activates OM first (Hormuz), then propagates through the SA→AE→OM logistics triangle",
        "MULTI-CHANNEL: One event → supply chain + repair costs + inflation + oil risk premium. Four separate impact paths.",
        "CURRENCY: Volatility at 0.12 (140% above baseline) — trade uncertainty shakes peg confidence. Marine + FX dual-exposure.",
        "OMAN: Duqm port positioning as strategic bypass adds a second Omani node — both risk and opportunity in one graph",
        "MARINE: Marine insurance line crosses critical threshold independently from property — shows line-of-business granularity"
      ],
      "kpi": {
        "supply_chain_stress": {
          "baseline": 0.3,
          "demo": 0.88,
          "delta_pct": "+193%",
          "severity": "critical"
        },
        "oil_price": {
          "baseline": 85,
          "demo": 120,
          "delta_pct": "+41%",
          "severity": "high"
        },
        "repair_cost_index": {
          "baseline": 1.0,
          "demo": 1.65,
          "delta_pct": "+65%",
          "severity": "high"
        },
        "currency_volatility": {
          "baseline": 0.05,
          "demo": 0.12,
          "delta_pct": "+140%",
          "severity": "high"
        }
      }
    },
    "country_card": {
      "id": "OM",
      "display_name": "Oman",
      "flag_emoji": "🇴🇲",
      "strategic_role": "Strait of Hormuz gatekeeper — 40% of world oil transits this chokepoint. Duqm port emerging as strategic bypass ($2B+ investment). Vision 2040 diversification into logistics and marine services.",
      "risk_role": "Strait of Hormuz chokepoint creates binary risk — open or closed, no middle ground. Cyclone exposure (Shaheen 2021 precedent) adds property catastrophe tail risk. Marine insurance growth fastest in GCC at 18% CAGR.",
      "risk_signature": "The chokepoint. When Hormuz tightens, the world's supply chain feels it. OM is the first domino.",
      "key_metric": "40% of world oil transits Hormuz — marine insurance CAGR 18% — Cyclone Shaheen (2021) = $1.2B insured loss",
      "insurance_market_gwp": "$1.8B",
      "sector_emphasis": [
        "logistics",
        "marine_insurance",
        "property_insurance"
      ],
      "oil_dependency": 0.75,
      "demo_highlight": "Supply chain demo: OM activates first as Hormuz chokepoint triggers. Duqm port node shows both risk (disruption) and opportunity (bypass).",
      "available": true,
      "scenario_cue": "PRIMARY TARGET. First node to activate. Hormuz chokepoint + Duqm bypass = dual-node scenario."
    },
    "ui_payload": {
      "version": "4.1.1",
      "locale": "en",
      "timestamp": "2026-03-25T16:04:15.764571+00:00",
      "top_bar": {
        "scenario_id": "oil_spike",
        "scenario_label": "OIL SPIKE",
        "decision": "ESCALATE",
        "decision_style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "risk_score": 0.9899,
        "confidence": 0.95,
        "elevated_count": 5,
        "critical_signals": [],
        "high_signals": [
          "oil_price",
          "inflation",
          "repair_cost_index",
          "supply_chain_stress",
          "currency_volatility"
        ],
        "timestamp": "2026-03-25T16:04:15.757770+00:00",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · 5 elevated signals · risk 0.99",
        "impact_level": "critical",
        "demo_headline": "Supply chain stress surges to 0.88 (+193%) as Red Sea corridor disruptions cascade through marine insurance, logistics costs, and GCC trade flows — ESCALATE with marine portfolio freeze."
      },
      "signal_rail": [
        {
          "id": "oil_price",
          "label": "Oil Price (Brent)",
          "value": 120,
          "unit": "USD/barrel",
          "delta": 35.0,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 0.4118,
          "baseline": 85.0,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0005,
            0.0514,
            0.091,
            0.1138,
            0.1433,
            0.2,
            0.2259,
            0.2637,
            0.3054,
            0.3389,
            0.3808,
            0.4118
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "inflation",
          "label": "CPI Inflation Rate",
          "value": 5.2,
          "unit": "percent",
          "delta": 2.7,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.08,
          "baseline": 2.5,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            -0.0172,
            0.088,
            0.2106,
            0.2864,
            0.3923,
            0.5017,
            0.5944,
            0.6892,
            0.7778,
            0.888,
            0.9863,
            1.08
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "repair_cost_index",
          "label": "Repair Cost Index",
          "value": 1.65,
          "unit": "index",
          "delta": 0.65,
          "direction": "up",
          "category": "insurance",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 0.65,
          "baseline": 1.0,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0068,
            0.0511,
            0.1341,
            0.1847,
            0.2408,
            0.282,
            0.3591,
            0.4123,
            0.4718,
            0.5393,
            0.5982,
            0.65
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "supply_chain_stress",
          "label": "Supply Chain Stress Index",
          "value": 0.88,
          "unit": "index",
          "delta": 0.58,
          "direction": "up",
          "category": "macro",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.9333,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0097,
            0.1935,
            0.3509,
            0.516,
            0.7092,
            0.8891,
            1.0531,
            1.2229,
            1.3972,
            1.5785,
            1.755,
            1.9333
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "currency_volatility",
          "label": "Currency Volatility",
          "value": 0.12,
          "unit": "index",
          "delta": 0.07,
          "direction": "up",
          "category": "context",
          "severity": "high",
          "severity_style": {
            "color": "orange",
            "priority": 3
          },
          "deviation": 1.4,
          "baseline": 0.05,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0017,
            0.1429,
            0.2457,
            0.3937,
            0.5016,
            0.6232,
            0.7703,
            0.8932,
            1.0166,
            1.1378,
            1.2668,
            1.4
          ],
          "movement": "accelerating",
          "impact_level": "high"
        },
        {
          "id": "interest_rate",
          "label": "Central Bank Rate",
          "value": 6.0,
          "unit": "percent",
          "delta": 1.0,
          "direction": "up",
          "category": "macro",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.2,
          "baseline": 5.0,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            -0.0139,
            0.0163,
            0.0471,
            0.0461,
            0.0696,
            0.102,
            0.1138,
            0.1342,
            0.1489,
            0.1688,
            0.177,
            0.2
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "claims_rate",
          "label": "Claims Frequency",
          "value": 0.6,
          "unit": "ratio",
          "delta": 0.25,
          "direction": "up",
          "category": "insurance",
          "severity": "moderate",
          "severity_style": {
            "color": "yellow",
            "priority": 2
          },
          "deviation": 0.7143,
          "baseline": 0.35,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0015,
            0.0738,
            0.1301,
            0.1925,
            0.2454,
            0.3184,
            0.3959,
            0.4584,
            0.5131,
            0.5885,
            0.6532,
            0.7143
          ],
          "movement": "accelerating",
          "impact_level": "medium"
        },
        {
          "id": "fraud_index",
          "label": "Fraud Alert Index",
          "value": 0.48,
          "unit": "index",
          "delta": 0.18,
          "direction": "up",
          "category": "risk",
          "severity": "low",
          "severity_style": {
            "color": "green",
            "priority": 1
          },
          "deviation": 0.6,
          "baseline": 0.3,
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "sparkline": [
            0.0044,
            0.0445,
            0.1205,
            0.1597,
            0.2133,
            0.2628,
            0.3238,
            0.3713,
            0.4346,
            0.495,
            0.5481,
            0.6
          ],
          "movement": "accelerating",
          "impact_level": "low"
        }
      ],
      "decision_rail": {
        "decision": "ESCALATE",
        "confidence": 0.95,
        "risk_score": 0.9899,
        "summary": "Scenario 'Oil Price Spike' detected. Severity 0.63, blended risk 0.99. Decision: ESCALATE (confidence 0.95).",
        "reasoning": [
          "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
          "Elevated signals: Oil Price (Brent) (up), CPI Inflation Rate (up), Repair Cost Index (up), Supply Chain Stress Index (up), Currency Volatility (up).",
          "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
          "All 6 GCC markets affected.",
          "Portfolio risk HIGH under oil_spike.",
          "Claims impact HIGH.",
          "Fraud exposure MODERATE.",
          "Combined risk score 0.99 exceeds escalation threshold. Immediate senior review required."
        ],
        "style": {
          "color": "red",
          "urgency": "immediate",
          "icon": "alert-triangle"
        },
        "scenario_id": "oil_spike",
        "trace_hash": "c39b0823c4ca82057c14ba74c316fe1d1d2d129e80709c834dc7cf8b61060bfb",
        "agents": [
          {
            "agent": "risk_analyst",
            "risk": 1.1356,
            "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.14. Reserve adequacy review recommended."
          },
          {
            "agent": "claims_analyst",
            "risk": 1.5312,
            "observation": "Claims impact HIGH. Expected cost movement 1.53. Recommend claims triage escalation."
          },
          {
            "agent": "fraud_analyst",
            "risk": 0.6554,
            "observation": "Fraud exposure MODERATE. Indicator strength 0.66. Flag for SIU review."
          }
        ],
        "short_reasoning": "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
        "headline_summary": "ESCALATE — Oil Price Surge requires immediate action · risk 0.99",
        "impact_level": "critical",
        "demo_headline": "Supply chain stress surges to 0.88 (+193%) as Red Sea corridor disruptions cascade through marine insurance, logistics costs, and GCC trade flows — ESCALATE with marine portfolio freeze.",
        "demo_short_reasoning": "Red Sea shipping corridor restrictions drive supply chain stress to 0.88 — 193% above the 0.30 baseline — as Houthi disruptions force re-..."
      },
      "propagation_panel": {
        "cause_effect_chain": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 0.969,
            "readable": "Oil Price is driving Inflation (weight 0.97)"
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7752,
            "readable": "Oil Price is driving Repair Costs (weight 0.78)"
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.646,
            "readable": "Oil Price is driving Supply Chain Stress (weight 0.65)"
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4522,
            "readable": "Oil Price correlates with Interest Rates (weight 0.45)"
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.7282,
            "readable": "Inflation is driving Claims Frequency (weight 0.73)"
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8606,
            "readable": "Inflation is driving Repair Costs (weight 0.86)"
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5296,
            "readable": "Inflation is putting pressure on Premium Pricing (weight 0.53)"
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.424,
            "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.42)"
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.265,
            "readable": "Interest Rates correlates with Premium Pricing (weight 0.27)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.5451,
            "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.55)"
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.5975,
            "readable": "Repair Costs is driving Claims Frequency (weight 0.60)"
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6573,
            "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.66)"
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5378,
            "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.54)"
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
          }
        ],
        "readable_path": [
          "Oil Price → Inflation",
          "Oil Price → Repair Costs",
          "Oil Price → Supply Chain Stress",
          "Oil Price → Interest Rates",
          "Inflation → Claims Frequency",
          "Inflation → Repair Costs",
          "Inflation → Premium Pricing",
          "Interest Rates → Reserve Adequacy",
          "Interest Rates → Premium Pricing",
          "Supply Chain Stress → Repair Costs",
          "Supply Chain Stress → Claims Frequency",
          "Fraud Alerts → Fraud Activity",
          "Repair Costs → Claims Frequency",
          "Repair Costs → Reserve Adequacy",
          "Repair Costs → Premium Pricing",
          "Claims Frequency → Fraud Activity",
          "Claims Frequency → Loss Ratio",
          "Claims Frequency → Reserve Adequacy",
          "Reserve Adequacy → Regulatory Pressure",
          "Fraud Activity → SIU Investigations",
          "Fraud Activity → Loss Ratio",
          "Loss Ratio → Premium Pricing",
          "Loss Ratio → Reinsurance Cost",
          "Loss Ratio → Regulatory Pressure",
          "SIU Investigations → Fraud Activity"
        ],
        "traversal_steps": 25,
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "active_node_count": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "pressure_summary": {
          "oil_price": 0.4118,
          "inflation": 1.479,
          "interest_rate": 0.3862,
          "supply_chain_stress": 2.1993,
          "fraud_alerts": 0.6,
          "repair_cost_index": 3.8319,
          "claims": 2.2287,
          "pricing": 1.415,
          "reserves": 1.0625,
          "fraud": 0.8009,
          "loss_ratio": 0.9292,
          "regulatory_pressure": 0.3297,
          "investigation": 0.51,
          "reinsurance_cost": 0.3775
        }
      },
      "executive_brief": {
        "text": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 99%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "decision": "ESCALATE",
        "confidence": 0.95,
        "headline_summary": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions.",
        "impact_level": "critical"
      },
      "graph_summary": {
        "active_nodes": [
          "claims",
          "pricing",
          "reserves",
          "fraud",
          "loss_ratio",
          "regulatory_pressure",
          "investigation",
          "reinsurance_cost"
        ],
        "total_active": 8,
        "affected_countries": [
          "AE",
          "BH",
          "KW",
          "OM",
          "QA",
          "SA"
        ],
        "affected_sectors": [
          "banking",
          "energy",
          "healthcare",
          "insurance",
          "logistics",
          "retail"
        ],
        "affected_insurance_lines": [
          "marine",
          "medical",
          "motor",
          "property"
        ],
        "node_pressures": {
          "oil_price": 0.4118,
          "inflation": 1.479,
          "interest_rate": 0.3862,
          "supply_chain_stress": 2.1993,
          "fraud_alerts": 0.6,
          "repair_cost_index": 3.8319,
          "claims": 2.2287,
          "pricing": 1.415,
          "reserves": 1.0625,
          "fraud": 0.8009,
          "loss_ratio": 0.9292,
          "regulatory_pressure": 0.3297,
          "investigation": 0.51,
          "reinsurance_cost": 0.3775
        },
        "max_pressure": 3.8319,
        "node_details": [
          {
            "id": "claims",
            "pressure": 2.2287,
            "severity_score": 0.977,
            "impact_level": "critical"
          },
          {
            "id": "pricing",
            "pressure": 1.415,
            "severity_score": 0.889,
            "impact_level": "critical"
          },
          {
            "id": "reserves",
            "pressure": 1.0625,
            "severity_score": 0.787,
            "impact_level": "high"
          },
          {
            "id": "loss_ratio",
            "pressure": 0.9292,
            "severity_score": 0.73,
            "impact_level": "high"
          },
          {
            "id": "fraud",
            "pressure": 0.8009,
            "severity_score": 0.665,
            "impact_level": "high"
          },
          {
            "id": "investigation",
            "pressure": 0.51,
            "severity_score": 0.47,
            "impact_level": "medium"
          },
          {
            "id": "reinsurance_cost",
            "pressure": 0.3775,
            "severity_score": 0.361,
            "impact_level": "medium"
          },
          {
            "id": "regulatory_pressure",
            "pressure": 0.3297,
            "severity_score": 0.318,
            "impact_level": "low"
          }
        ],
        "edge_details": [
          {
            "from": "Oil Price",
            "to": "Inflation",
            "relation": "is driving",
            "weight": 0.969,
            "intensity": 0.969
          },
          {
            "from": "Oil Price",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.7752,
            "intensity": 0.775
          },
          {
            "from": "Oil Price",
            "to": "Supply Chain Stress",
            "relation": "is driving",
            "weight": 0.646,
            "intensity": 0.646
          },
          {
            "from": "Oil Price",
            "to": "Interest Rates",
            "relation": "correlates with",
            "weight": 0.4522,
            "intensity": 0.452
          },
          {
            "from": "Inflation",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.7282,
            "intensity": 0.728
          },
          {
            "from": "Inflation",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 0.8606,
            "intensity": 0.861
          },
          {
            "from": "Inflation",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5296,
            "intensity": 0.53
          },
          {
            "from": "Interest Rates",
            "to": "Reserve Adequacy",
            "relation": "is affecting",
            "weight": 0.424,
            "intensity": 0.424
          },
          {
            "from": "Interest Rates",
            "to": "Premium Pricing",
            "relation": "correlates with",
            "weight": 0.265,
            "intensity": 0.265
          },
          {
            "from": "Supply Chain Stress",
            "to": "Repair Costs",
            "relation": "is driving",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Supply Chain Stress",
            "to": "Claims Frequency",
            "relation": "is amplifying",
            "weight": 0.5451,
            "intensity": 0.545
          },
          {
            "from": "Fraud Alerts",
            "to": "Fraud Activity",
            "relation": "indicates rising",
            "weight": 1.0,
            "intensity": 1.0
          },
          {
            "from": "Repair Costs",
            "to": "Claims Frequency",
            "relation": "is driving",
            "weight": 0.5975,
            "intensity": 0.598
          },
          {
            "from": "Repair Costs",
            "to": "Reserve Adequacy",
            "relation": "is eroding",
            "weight": 0.6573,
            "intensity": 0.657
          },
          {
            "from": "Repair Costs",
            "to": "Premium Pricing",
            "relation": "is putting pressure on",
            "weight": 0.5378,
            "intensity": 0.538
          },
          {
            "from": "Claims Frequency",
            "to": "Fraud Activity",
            "relation": "is enabling",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "Claims Frequency",
            "to": "Loss Ratio",
            "relation": "is driving",
            "weight": 0.8,
            "intensity": 0.8
          },
          {
            "from": "Claims Frequency",
            "to": "Reserve Adequacy",
            "relation": "is depleting",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Reserve Adequacy",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.55,
            "intensity": 0.55
          },
          {
            "from": "Fraud Activity",
            "to": "SIU Investigations",
            "relation": "is triggering",
            "weight": 0.85,
            "intensity": 0.85
          },
          {
            "from": "Fraud Activity",
            "to": "Loss Ratio",
            "relation": "is inflating",
            "weight": 0.5,
            "intensity": 0.5
          },
          {
            "from": "Loss Ratio",
            "to": "Premium Pricing",
            "relation": "is forcing changes in",
            "weight": 0.7,
            "intensity": 0.7
          },
          {
            "from": "Loss Ratio",
            "to": "Reinsurance Cost",
            "relation": "is driving",
            "weight": 0.6,
            "intensity": 0.6
          },
          {
            "from": "Loss Ratio",
            "to": "Regulatory Pressure",
            "relation": "is triggering",
            "weight": 0.45,
            "intensity": 0.45
          },
          {
            "from": "SIU Investigations",
            "to": "Fraud Activity",
            "relation": "is suppressing",
            "weight": -0.3,
            "intensity": 0.3
          }
        ],
        "max_intensity": 1.0
      },
      "raw": {
        "simulation_result": {
          "active_scenario": "oil_spike",
          "impacted_domains": [
            "oil_price",
            "supply_chain_stress",
            "reserves",
            "fraud",
            "regulatory_pressure",
            "reinsurance_cost",
            "interest_rate",
            "repair_cost_index",
            "claims",
            "fraud_alerts",
            "investigation",
            "pricing",
            "inflation",
            "loss_ratio"
          ],
          "severity": 0.6257,
          "simulated_changes": {
            "claims": {
              "direction": "increase",
              "magnitude": 2.0,
              "propagation_depth": 1
            },
            "pricing": {
              "direction": "increase",
              "magnitude": 1.415,
              "propagation_depth": 2
            },
            "reserves": {
              "direction": "increase",
              "magnitude": 1.0625,
              "propagation_depth": 3
            },
            "fraud": {
              "direction": "increase",
              "magnitude": 0.8009,
              "propagation_depth": 4
            },
            "loss_ratio": {
              "direction": "increase",
              "magnitude": 0.9292,
              "propagation_depth": 5
            },
            "regulatory_pressure": {
              "direction": "increase",
              "magnitude": 0.3297,
              "propagation_depth": 6
            },
            "investigation": {
              "direction": "increase",
              "magnitude": 0.51,
              "propagation_depth": 7
            },
            "reinsurance_cost": {
              "direction": "increase",
              "magnitude": 0.3775,
              "propagation_depth": 8
            }
          },
          "graph_links_used": [
            "oil_price -> inflation",
            "oil_price -> repair_cost_index",
            "oil_price -> supply_chain_stress",
            "oil_price -> interest_rate",
            "inflation -> claims",
            "inflation -> repair_cost_index",
            "inflation -> pricing",
            "interest_rate -> reserves",
            "interest_rate -> pricing",
            "supply_chain_stress -> repair_cost_index",
            "supply_chain_stress -> claims",
            "fraud_alerts -> fraud",
            "repair_cost_index -> claims",
            "repair_cost_index -> reserves",
            "repair_cost_index -> pricing",
            "claims -> fraud",
            "claims -> loss_ratio",
            "claims -> reserves",
            "reserves -> regulatory_pressure",
            "fraud -> investigation",
            "fraud -> loss_ratio",
            "loss_ratio -> pricing",
            "loss_ratio -> reinsurance_cost",
            "loss_ratio -> regulatory_pressure",
            "investigation -> fraud"
          ]
        },
        "decision_trace": {
          "timestamp": "2026-03-25T16:04:15.757770+00:00",
          "input_signals": {
            "oil_price": 120,
            "inflation": 5.2,
            "claims_rate": 0.6,
            "fraud_index": 0.48,
            "repair_cost_index": 1.65,
            "supply_chain_stress": 0.88,
            "currency_volatility": 0.12,
            "interest_rate": 6.0
          },
          "detected_scenario": "oil_spike",
          "agent_observations": [
            {
              "agent": "risk_analyst",
              "assessed_risk": 1.1356,
              "observation": "Portfolio risk HIGH under oil_spike. Simulated magnitude 1.14. Reserve adequacy review recommended."
            },
            {
              "agent": "claims_analyst",
              "assessed_risk": 1.5312,
              "observation": "Claims impact HIGH. Expected cost movement 1.53. Recommend claims triage escalation."
            },
            {
              "agent": "fraud_analyst",
              "assessed_risk": 0.6554,
              "observation": "Fraud exposure MODERATE. Indicator strength 0.66. Flag for SIU review."
            }
          ],
          "final_risk_score": 0.9899,
          "final_decision": "ESCALATE",
          "confidence": 0.95,
          "trace_hash": "c39b0823c4ca82057c14ba74c316fe1d1d2d129e80709c834dc7cf8b61060bfb"
        },
        "decision": {
          "decision": "ESCALATE",
          "confidence": 0.95,
          "risk_score": 0.9899,
          "summary": "Scenario 'Oil Price Spike' detected. Severity 0.63, blended risk 0.99. Decision: ESCALATE (confidence 0.95).",
          "reasoning": [
            "Scenario 'Oil Price Spike' detected — Rapid oil price increase drives inflation and downstream claims cost escalation.",
            "Elevated signals: Oil Price (Brent) (up), CPI Inflation Rate (up), Repair Cost Index (up), Supply Chain Stress Index (up), Currency Volatility (up).",
            "Graph propagation impacted 8 nodes including Claims Frequency, Premium Pricing, Reserve Adequacy, Fraud Activity, Loss Ratio.",
            "All 6 GCC markets affected.",
            "Portfolio risk HIGH under oil_spike.",
            "Claims impact HIGH.",
            "Fraud exposure MODERATE.",
            "Combined risk score 0.99 exceeds escalation threshold. Immediate senior review required."
          ]
        },
        "graph_state": {
          "active_nodes": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "affected_countries": [
            "AE",
            "BH",
            "KW",
            "OM",
            "QA",
            "SA"
          ],
          "affected_sectors": [
            "banking",
            "energy",
            "healthcare",
            "insurance",
            "logistics",
            "retail"
          ],
          "affected_insurance_lines": [
            "marine",
            "medical",
            "motor",
            "property"
          ],
          "weighted_impacts": {
            "oil_price": 0.4118,
            "inflation": 1.479,
            "interest_rate": 0.3862,
            "supply_chain_stress": 2.1993,
            "fraud_alerts": 0.6,
            "repair_cost_index": 3.8319,
            "claims": 2.2287,
            "pricing": 1.415,
            "reserves": 1.0625,
            "fraud": 0.8009,
            "loss_ratio": 0.9292,
            "regulatory_pressure": 0.3297,
            "investigation": 0.51,
            "reinsurance_cost": 0.3775
          }
        },
        "propagation_trace": {
          "root_signal": [
            "oil_price",
            "inflation",
            "interest_rate",
            "supply_chain_stress",
            "fraud_alerts",
            "repair_cost_index"
          ],
          "traversal_path": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 0.969,
              "transmitted_pressure": 0.399,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.7752,
              "transmitted_pressure": 0.3192,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.646,
              "transmitted_pressure": 0.266,
              "relation_type": "drives"
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4522,
              "transmitted_pressure": 0.1862,
              "relation_type": "correlates"
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.7282,
              "transmitted_pressure": 0.7865,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.8606,
              "transmitted_pressure": 0.9294,
              "relation_type": "drives"
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.5296,
              "transmitted_pressure": 0.572,
              "relation_type": "pressures"
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.424,
              "transmitted_pressure": 0.0848,
              "relation_type": "affects"
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.265,
              "transmitted_pressure": 0.053,
              "relation_type": "correlates"
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0,
              "transmitted_pressure": 1.9333,
              "relation_type": "drives"
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.5451,
              "transmitted_pressure": 1.0538,
              "relation_type": "amplifies"
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0,
              "transmitted_pressure": 0.6,
              "relation_type": "indicates"
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.5975,
              "transmitted_pressure": 0.3884,
              "relation_type": "drives"
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6573,
              "transmitted_pressure": 0.4272,
              "relation_type": "erodes"
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5378,
              "transmitted_pressure": 0.3496,
              "relation_type": "pressures"
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45,
              "transmitted_pressure": 0.3539,
              "relation_type": "enables"
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8,
              "transmitted_pressure": 0.6292,
              "relation_type": "drives"
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7,
              "transmitted_pressure": 0.5505,
              "relation_type": "depletes"
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55,
              "transmitted_pressure": 0.0466,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85,
              "transmitted_pressure": 0.51,
              "relation_type": "triggers"
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5,
              "transmitted_pressure": 0.3,
              "relation_type": "inflates"
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7,
              "transmitted_pressure": 0.4404,
              "relation_type": "forces"
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6,
              "transmitted_pressure": 0.3775,
              "relation_type": "drives"
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45,
              "transmitted_pressure": 0.2831,
              "relation_type": "triggers"
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3,
              "transmitted_pressure": -0.153,
              "relation_type": "suppresses"
            }
          ],
          "edge_weights_used": [
            {
              "from": "oil_price",
              "to": "inflation",
              "weight": 0.969
            },
            {
              "from": "oil_price",
              "to": "repair_cost_index",
              "weight": 0.7752
            },
            {
              "from": "oil_price",
              "to": "supply_chain_stress",
              "weight": 0.646
            },
            {
              "from": "oil_price",
              "to": "interest_rate",
              "weight": 0.4522
            },
            {
              "from": "inflation",
              "to": "claims",
              "weight": 0.7282
            },
            {
              "from": "inflation",
              "to": "repair_cost_index",
              "weight": 0.8606
            },
            {
              "from": "inflation",
              "to": "pricing",
              "weight": 0.5296
            },
            {
              "from": "interest_rate",
              "to": "reserves",
              "weight": 0.424
            },
            {
              "from": "interest_rate",
              "to": "pricing",
              "weight": 0.265
            },
            {
              "from": "supply_chain_stress",
              "to": "repair_cost_index",
              "weight": 1.0
            },
            {
              "from": "supply_chain_stress",
              "to": "claims",
              "weight": 0.5451
            },
            {
              "from": "fraud_alerts",
              "to": "fraud",
              "weight": 1.0
            },
            {
              "from": "repair_cost_index",
              "to": "claims",
              "weight": 0.5975
            },
            {
              "from": "repair_cost_index",
              "to": "reserves",
              "weight": 0.6573
            },
            {
              "from": "repair_cost_index",
              "to": "pricing",
              "weight": 0.5378
            },
            {
              "from": "claims",
              "to": "fraud",
              "weight": 0.45
            },
            {
              "from": "claims",
              "to": "loss_ratio",
              "weight": 0.8
            },
            {
              "from": "claims",
              "to": "reserves",
              "weight": 0.7
            },
            {
              "from": "reserves",
              "to": "regulatory_pressure",
              "weight": 0.55
            },
            {
              "from": "fraud",
              "to": "investigation",
              "weight": 0.85
            },
            {
              "from": "fraud",
              "to": "loss_ratio",
              "weight": 0.5
            },
            {
              "from": "loss_ratio",
              "to": "pricing",
              "weight": 0.7
            },
            {
              "from": "loss_ratio",
              "to": "reinsurance_cost",
              "weight": 0.6
            },
            {
              "from": "loss_ratio",
              "to": "regulatory_pressure",
              "weight": 0.45
            },
            {
              "from": "investigation",
              "to": "fraud",
              "weight": -0.3
            }
          ],
          "impacted_nodes_in_order": [
            "claims",
            "pricing",
            "reserves",
            "fraud",
            "loss_ratio",
            "regulatory_pressure",
            "investigation",
            "reinsurance_cost"
          ],
          "final_pressure_summary": {
            "oil_price": 0.4118,
            "inflation": 1.479,
            "interest_rate": 0.3862,
            "supply_chain_stress": 2.1993,
            "fraud_alerts": 0.6,
            "repair_cost_index": 3.8319,
            "claims": 2.2287,
            "pricing": 1.415,
            "reserves": 1.0625,
            "fraud": 0.8009,
            "loss_ratio": 0.9292,
            "regulatory_pressure": 0.3297,
            "investigation": 0.51,
            "reinsurance_cost": 0.3775
          },
          "cause_effect_chain": [
            {
              "from": "Oil Price",
              "to": "Inflation",
              "relation": "is driving",
              "weight": 0.969,
              "readable": "Oil Price is driving Inflation (weight 0.97)"
            },
            {
              "from": "Oil Price",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.7752,
              "readable": "Oil Price is driving Repair Costs (weight 0.78)"
            },
            {
              "from": "Oil Price",
              "to": "Supply Chain Stress",
              "relation": "is driving",
              "weight": 0.646,
              "readable": "Oil Price is driving Supply Chain Stress (weight 0.65)"
            },
            {
              "from": "Oil Price",
              "to": "Interest Rates",
              "relation": "correlates with",
              "weight": 0.4522,
              "readable": "Oil Price correlates with Interest Rates (weight 0.45)"
            },
            {
              "from": "Inflation",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.7282,
              "readable": "Inflation is driving Claims Frequency (weight 0.73)"
            },
            {
              "from": "Inflation",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 0.8606,
              "readable": "Inflation is driving Repair Costs (weight 0.86)"
            },
            {
              "from": "Inflation",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.5296,
              "readable": "Inflation is putting pressure on Premium Pricing (weight 0.53)"
            },
            {
              "from": "Interest Rates",
              "to": "Reserve Adequacy",
              "relation": "is affecting",
              "weight": 0.424,
              "readable": "Interest Rates is affecting Reserve Adequacy (weight 0.42)"
            },
            {
              "from": "Interest Rates",
              "to": "Premium Pricing",
              "relation": "correlates with",
              "weight": 0.265,
              "readable": "Interest Rates correlates with Premium Pricing (weight 0.27)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Repair Costs",
              "relation": "is driving",
              "weight": 1.0,
              "readable": "Supply Chain Stress is driving Repair Costs (weight 1.00)"
            },
            {
              "from": "Supply Chain Stress",
              "to": "Claims Frequency",
              "relation": "is amplifying",
              "weight": 0.5451,
              "readable": "Supply Chain Stress is amplifying Claims Frequency (weight 0.55)"
            },
            {
              "from": "Fraud Alerts",
              "to": "Fraud Activity",
              "relation": "indicates rising",
              "weight": 1.0,
              "readable": "Fraud Alerts indicates rising Fraud Activity (weight 1.00)"
            },
            {
              "from": "Repair Costs",
              "to": "Claims Frequency",
              "relation": "is driving",
              "weight": 0.5975,
              "readable": "Repair Costs is driving Claims Frequency (weight 0.60)"
            },
            {
              "from": "Repair Costs",
              "to": "Reserve Adequacy",
              "relation": "is eroding",
              "weight": 0.6573,
              "readable": "Repair Costs is eroding Reserve Adequacy (weight 0.66)"
            },
            {
              "from": "Repair Costs",
              "to": "Premium Pricing",
              "relation": "is putting pressure on",
              "weight": 0.5378,
              "readable": "Repair Costs is putting pressure on Premium Pricing (weight 0.54)"
            },
            {
              "from": "Claims Frequency",
              "to": "Fraud Activity",
              "relation": "is enabling",
              "weight": 0.45,
              "readable": "Claims Frequency is enabling Fraud Activity (weight 0.45)"
            },
            {
              "from": "Claims Frequency",
              "to": "Loss Ratio",
              "relation": "is driving",
              "weight": 0.8,
              "readable": "Claims Frequency is driving Loss Ratio (weight 0.80)"
            },
            {
              "from": "Claims Frequency",
              "to": "Reserve Adequacy",
              "relation": "is depleting",
              "weight": 0.7,
              "readable": "Claims Frequency is depleting Reserve Adequacy (weight 0.70)"
            },
            {
              "from": "Reserve Adequacy",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.55,
              "readable": "Reserve Adequacy is triggering Regulatory Pressure (weight 0.55)"
            },
            {
              "from": "Fraud Activity",
              "to": "SIU Investigations",
              "relation": "is triggering",
              "weight": 0.85,
              "readable": "Fraud Activity is triggering SIU Investigations (weight 0.85)"
            },
            {
              "from": "Fraud Activity",
              "to": "Loss Ratio",
              "relation": "is inflating",
              "weight": 0.5,
              "readable": "Fraud Activity is inflating Loss Ratio (weight 0.50)"
            },
            {
              "from": "Loss Ratio",
              "to": "Premium Pricing",
              "relation": "is forcing changes in",
              "weight": 0.7,
              "readable": "Loss Ratio is forcing changes in Premium Pricing (weight 0.70)"
            },
            {
              "from": "Loss Ratio",
              "to": "Reinsurance Cost",
              "relation": "is driving",
              "weight": 0.6,
              "readable": "Loss Ratio is driving Reinsurance Cost (weight 0.60)"
            },
            {
              "from": "Loss Ratio",
              "to": "Regulatory Pressure",
              "relation": "is triggering",
              "weight": 0.45,
              "readable": "Loss Ratio is triggering Regulatory Pressure (weight 0.45)"
            },
            {
              "from": "SIU Investigations",
              "to": "Fraud Activity",
              "relation": "is suppressing",
              "weight": -0.3,
              "readable": "SIU Investigations is suppressing Fraud Activity (weight -0.30)"
            }
          ],
          "readable_path": [
            "Oil Price → Inflation",
            "Oil Price → Repair Costs",
            "Oil Price → Supply Chain Stress",
            "Oil Price → Interest Rates",
            "Inflation → Claims Frequency",
            "Inflation → Repair Costs",
            "Inflation → Premium Pricing",
            "Interest Rates → Reserve Adequacy",
            "Interest Rates → Premium Pricing",
            "Supply Chain Stress → Repair Costs",
            "Supply Chain Stress → Claims Frequency",
            "Fraud Alerts → Fraud Activity",
            "Repair Costs → Claims Frequency",
            "Repair Costs → Reserve Adequacy",
            "Repair Costs → Premium Pricing",
            "Claims Frequency → Fraud Activity",
            "Claims Frequency → Loss Ratio",
            "Claims Frequency → Reserve Adequacy",
            "Reserve Adequacy → Regulatory Pressure",
            "Fraud Activity → SIU Investigations",
            "Fraud Activity → Loss Ratio",
            "Loss Ratio → Premium Pricing",
            "Loss Ratio → Reinsurance Cost",
            "Loss Ratio → Regulatory Pressure",
            "SIU Investigations → Fraud Activity"
          ]
        },
        "enriched_signals": {
          "oil_price": {
            "value": 120,
            "baseline": 85.0,
            "delta": 35.0,
            "direction": "up",
            "deviation": 0.4118,
            "category": "macro",
            "severity": "high",
            "label": "Oil Price (Brent)",
            "unit": "USD/barrel",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "inflation": {
            "value": 5.2,
            "baseline": 2.5,
            "delta": 2.7,
            "direction": "up",
            "deviation": 1.08,
            "category": "macro",
            "severity": "high",
            "label": "CPI Inflation Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "claims_rate": {
            "value": 0.6,
            "baseline": 0.35,
            "delta": 0.25,
            "direction": "up",
            "deviation": 0.7143,
            "category": "insurance",
            "severity": "moderate",
            "label": "Claims Frequency",
            "unit": "ratio",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "fraud_index": {
            "value": 0.48,
            "baseline": 0.3,
            "delta": 0.18,
            "direction": "up",
            "deviation": 0.6,
            "category": "risk",
            "severity": "low",
            "label": "Fraud Alert Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "repair_cost_index": {
            "value": 1.65,
            "baseline": 1.0,
            "delta": 0.65,
            "direction": "up",
            "deviation": 0.65,
            "category": "insurance",
            "severity": "high",
            "label": "Repair Cost Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "supply_chain_stress": {
            "value": 0.88,
            "baseline": 0.3,
            "delta": 0.58,
            "direction": "up",
            "deviation": 1.9333,
            "category": "macro",
            "severity": "high",
            "label": "Supply Chain Stress Index",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "currency_volatility": {
            "value": 0.12,
            "baseline": 0.05,
            "delta": 0.07,
            "direction": "up",
            "deviation": 1.4,
            "category": "context",
            "severity": "high",
            "label": "Currency Volatility",
            "unit": "index",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          },
          "interest_rate": {
            "value": 6.0,
            "baseline": 5.0,
            "delta": 1.0,
            "direction": "up",
            "deviation": 0.2,
            "category": "macro",
            "severity": "moderate",
            "label": "Central Bank Rate",
            "unit": "percent",
            "timestamp": "2026-03-25T16:04:15.757770+00:00"
          }
        },
        "executive_brief": "A Oil Spike scenario is active, driven primarily by Oil Price (Brent), with cascading effects across 8 risk dimensions. The impact propagates across all 6 GCC markets affecting marine, medical, motor, property lines, with a combined risk score of 99%. Recommendation: ESCALATE for immediate senior review (confidence 95%).",
        "signal_summary": {
          "elevated_count": 5,
          "critical_signals": [],
          "high_signals": [
            "oil_price",
            "inflation",
            "repair_cost_index",
            "supply_chain_stress",
            "currency_volatility"
          ],
          "top_movers": [
            {
              "key": "oil_price",
              "label": "Oil Price (Brent)",
              "delta": 35.0,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "inflation",
              "label": "CPI Inflation Rate",
              "delta": 2.7,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "interest_rate",
              "label": "Central Bank Rate",
              "delta": 1.0,
              "direction": "up",
              "severity": "moderate"
            },
            {
              "key": "repair_cost_index",
              "label": "Repair Cost Index",
              "delta": 0.65,
              "direction": "up",
              "severity": "high"
            },
            {
              "key": "supply_chain_stress",
              "label": "Supply Chain Stress Index",
              "delta": 0.58,
              "direction": "up",
              "severity": "high"
            }
          ]
        }
      }
    }
  }
};

export const DEMO_PAYLOADS = _DEMOS;
