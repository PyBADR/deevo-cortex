// ============================================================================
// DEEVO Monitor — Decision Engine
// Computes risk scores and decisions from signals + graph state.
// Supports configurable rules and multi-client thresholds.
// ============================================================================

import type {
  Decision, DecisionType, Signal, CausalGraph, ScenarioId,
  Alert, Severity, CountryCode, CountryIntel, IntelBlock, AIBrief,
} from './types';

// ---------------------------------------------------------------------------
// Client profiles — different thresholds per client
// ---------------------------------------------------------------------------
export interface ClientProfile {
  id: string;
  name: string;
  escalateThreshold: number;
  reviewThreshold: number;
  weights: Record<string, number>;
}

const DEFAULT_CLIENT: ClientProfile = {
  id: 'default',
  name: 'DEEVO',
  escalateThreshold: 0.75,
  reviewThreshold: 0.45,
  weights: {
    oil: 0.25,
    inflation: 0.15,
    claims: 0.20,
    fraud: 0.20,
    supply_chain: 0.10,
    interest_rates: 0.05,
    currency: 0.03,
    regulatory: 0.02,
  },
};

// ---------------------------------------------------------------------------
// Rule engine — configurable business rules
// ---------------------------------------------------------------------------
interface Rule {
  id: string;
  condition: (signals: Signal[], graphIntensity: number) => boolean;
  action: DecisionType;
  reason: string;
  priority: number; // higher = checked first
}

const RULES: Rule[] = [
  {
    id: 'fraud_critical',
    condition: (signals) => {
      const fraud = signals.find(s => s.type === 'fraud');
      return !!fraud && fraud.severity === 'critical';
    },
    action: 'ESCALATE',
    reason: 'Fraud activity has reached critical levels — immediate escalation required',
    priority: 100,
  },
  {
    id: 'oil_crisis',
    condition: (signals) => {
      const oil = signals.find(s => s.type === 'oil');
      return !!oil && oil.value > 120;
    },
    action: 'ESCALATE',
    reason: 'Oil price exceeds $120/bbl — systemic risk to GCC insurance market',
    priority: 90,
  },
  {
    id: 'multi_signal_stress',
    condition: (signals) => {
      const critical = signals.filter(s => s.severity === 'critical' || s.severity === 'high');
      return critical.length >= 3;
    },
    action: 'ESCALATE',
    reason: 'Multiple signals in critical/high state — cascading risk detected',
    priority: 85,
  },
  {
    id: 'claims_inflation_compound',
    condition: (signals) => {
      const claims = signals.find(s => s.type === 'claims');
      const inflation = signals.find(s => s.type === 'inflation');
      return !!claims && !!inflation && claims.severity !== 'low' && inflation.severity !== 'low';
    },
    action: 'REVIEW',
    reason: 'Claims frequency elevated alongside rising inflation — compound pressure',
    priority: 70,
  },
  {
    id: 'supply_chain_stress',
    condition: (signals) => {
      const sc = signals.find(s => s.type === 'supply_chain');
      return !!sc && (sc.severity === 'high' || sc.severity === 'critical');
    },
    action: 'REVIEW',
    reason: 'Supply chain disruption detected — repair costs and claim delays rising',
    priority: 60,
  },
  {
    id: 'graph_propagation_high',
    condition: (_signals, graphIntensity) => graphIntensity > 0.6,
    action: 'REVIEW',
    reason: 'Causal graph propagation intensity elevated — interconnected risks spreading',
    priority: 55,
  },
];

// ---------------------------------------------------------------------------
// Decision Engine
// ---------------------------------------------------------------------------
export class DecisionEngine {
  private client: ClientProfile;
  private auditLog: DecisionAuditEntry[] = [];

  constructor(client?: ClientProfile) {
    this.client = client ?? DEFAULT_CLIENT;
  }

  compute(signals: Signal[], graph: CausalGraph, scenario: ScenarioId): Decision {
    const now = Date.now();

    // 1. Compute weighted risk score
    const riskScore = this.computeRiskScore(signals);

    // 2. Compute graph intensity
    const graphIntensity = this.computeGraphIntensity(graph);

    // 3. Run rule engine
    const triggeredRules = RULES
      .filter(r => r.condition(signals, graphIntensity))
      .sort((a, b) => b.priority - a.priority);

    // 4. Determine decision
    let type: DecisionType;
    const drivers: string[] = [];

    if (triggeredRules.length > 0 && triggeredRules[0].action === 'ESCALATE') {
      type = 'ESCALATE';
      drivers.push(...triggeredRules.filter(r => r.action === 'ESCALATE').map(r => r.reason));
    } else if (riskScore >= this.client.escalateThreshold) {
      type = 'ESCALATE';
      drivers.push(`Composite risk score ${(riskScore * 100).toFixed(0)}% exceeds escalation threshold`);
    } else if (triggeredRules.some(r => r.action === 'REVIEW') || riskScore >= this.client.reviewThreshold) {
      type = 'REVIEW';
      drivers.push(...triggeredRules.filter(r => r.action === 'REVIEW').map(r => r.reason));
      if (riskScore >= this.client.reviewThreshold && drivers.length === 0) {
        drivers.push(`Composite risk score ${(riskScore * 100).toFixed(0)}% requires review`);
      }
    } else {
      type = 'APPROVE';
      drivers.push('All signals within acceptable thresholds — standard processing');
    }

    // 5. Compute confidence
    const confidence = this.computeConfidence(signals, triggeredRules.length);

    const reasoning = this.generateReasoning(type, riskScore, drivers, scenario);

    const decision: Decision = {
      type,
      riskScore: round(riskScore),
      confidence: round(confidence),
      reasoning,
      timestamp: now,
      drivers,
    };

    // 6. Audit log
    this.auditLog.push({
      timestamp: now,
      scenario,
      riskScore: decision.riskScore,
      decision: decision.type,
      signals: signals.map(s => ({ id: s.id, value: s.value, severity: s.severity })),
      rulesTriggered: triggeredRules.map(r => r.id),
    });

    return decision;
  }

  private computeRiskScore(signals: Signal[]): number {
    let totalWeight = 0;
    let weightedSum = 0;

    for (const signal of signals) {
      const w = this.client.weights[signal.type] ?? 0.05;
      const severityVal: Record<string, number> = { critical: 1.0, high: 0.75, moderate: 0.45, low: 0.15 };
      weightedSum += (severityVal[signal.severity] ?? 0.2) * w;
      totalWeight += w;
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private computeGraphIntensity(graph: CausalGraph): number {
    if (graph.nodes.length === 0) return 0;
    const avg = graph.nodes.reduce((sum, n) => sum + n.intensity, 0) / graph.nodes.length;
    return avg;
  }

  private computeConfidence(signals: Signal[], rulesTriggered: number): number {
    // More data points + more rules = higher confidence
    const signalCoverage = Math.min(signals.length / 8, 1);
    const ruleSignal = Math.min(rulesTriggered / 3, 1);
    return 0.6 + signalCoverage * 0.25 + ruleSignal * 0.15;
  }

  private generateReasoning(type: DecisionType, riskScore: number, drivers: string[], scenario: ScenarioId): string {
    const scenarioNames: Record<ScenarioId, string> = {
      oil_spike: 'Oil Price Spike',
      fraud_ring: 'Organized Fraud Ring',
      supply_disruption: 'Supply Chain Disruption',
    };
    const pct = (riskScore * 100).toFixed(0);
    return `${scenarioNames[scenario]} scenario — composite risk at ${pct}%. ${type}: ${drivers[0] ?? 'System recommendation based on weighted signal analysis.'}`;
  }

  getAuditLog(): DecisionAuditEntry[] {
    return [...this.auditLog];
  }

  setClient(client: ClientProfile): void {
    this.client = client;
  }
}

// ---------------------------------------------------------------------------
// Audit entry type
// ---------------------------------------------------------------------------
interface DecisionAuditEntry {
  timestamp: number;
  scenario: ScenarioId;
  riskScore: number;
  decision: DecisionType;
  signals: { id: string; value: number; severity: Severity }[];
  rulesTriggered: string[];
}

// ---------------------------------------------------------------------------
// Country Intelligence Generator
// ---------------------------------------------------------------------------
const COUNTRY_DATA: Record<string, Omit<CountryIntel, 'riskScore' | 'exposure' | 'alerts'>> = {
  SA: { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', gdp: 1061, insuranceGwp: 12.5, oilDependency: 0.65, claimsRatio: 0.42, fraudIndex: 0.18 },
  AE: { code: 'AE', name: 'UAE', flag: '🇦🇪', gdp: 507, insuranceGwp: 14.2, oilDependency: 0.30, claimsRatio: 0.38, fraudIndex: 0.22 },
  KW: { code: 'KW', name: 'Kuwait', flag: '🇰🇼', gdp: 164, insuranceGwp: 2.1, oilDependency: 0.85, claimsRatio: 0.35, fraudIndex: 0.15 },
  QA: { code: 'QA', name: 'Qatar', flag: '🇶🇦', gdp: 219, insuranceGwp: 3.8, oilDependency: 0.55, claimsRatio: 0.33, fraudIndex: 0.12 },
  BH: { code: 'BH', name: 'Bahrain', flag: '🇧🇭', gdp: 44, insuranceGwp: 1.2, oilDependency: 0.70, claimsRatio: 0.45, fraudIndex: 0.20 },
  OM: { code: 'OM', name: 'Oman', flag: '🇴🇲', gdp: 104, insuranceGwp: 1.8, oilDependency: 0.75, claimsRatio: 0.40, fraudIndex: 0.17 },
};

export function computeCountries(signals: Signal[], decision: Decision): CountryIntel[] {
  const oilSignal = signals.find(s => s.type === 'oil');
  const fraudSignal = signals.find(s => s.type === 'fraud');

  return Object.values(COUNTRY_DATA).map(c => {
    const oilImpact = (oilSignal?.change ?? 0) / 100 * c.oilDependency;
    const fraudImpact = (fraudSignal?.change ?? 0) / 100 * 0.5;
    const riskScore = round(Math.min(1, Math.max(0, decision.riskScore * (0.7 + c.oilDependency * 0.3) + oilImpact * 0.2)));
    const exposure = round(c.insuranceGwp * riskScore);

    const alerts: string[] = [];
    if (riskScore > 0.7) alerts.push(`High risk exposure: ${c.name}`);
    if (c.oilDependency > 0.6 && oilSignal && oilSignal.severity !== 'low') {
      alerts.push(`Oil-dependent economy under pressure`);
    }
    if (fraudImpact > 0.05) alerts.push(`Fraud activity elevated`);

    return { ...c, riskScore, exposure, alerts } as CountryIntel;
  });
}

// ---------------------------------------------------------------------------
// Intel Blocks Generator
// ---------------------------------------------------------------------------
export function computeBlocks(signals: Signal[]): IntelBlock[] {
  const blockDefs: { id: string; title: string; type: string }[] = [
    { id: 'risk_overview', title: 'Risk Overview', type: 'claims' },
    { id: 'claims_pressure', title: 'Claims Pressure', type: 'claims' },
    { id: 'fraud_monitor', title: 'Fraud Monitor', type: 'fraud' },
    { id: 'oil_energy', title: 'Oil & Energy', type: 'oil' },
    { id: 'inflation_tracker', title: 'Inflation', type: 'inflation' },
    { id: 'supply_chain', title: 'Supply Chain', type: 'supply_chain' },
  ];

  return blockDefs.map(def => {
    const signal = signals.find(s => s.type === def.type);
    if (!signal) {
      return {
        id: def.id, title: def.title, type: def.type as any,
        value: 0, change: 0, unit: '', severity: 'low' as Severity,
        detail: 'No data', sparkline: [],
      };
    }
    const details: Record<string, string> = {
      risk_overview: `Composite risk driven by ${signal.severity} ${signal.type} signals`,
      claims_pressure: `Claims frequency at ${signal.value} — ${signal.severity} severity`,
      fraud_monitor: `Fraud index ${signal.value} — ${signal.change > 0 ? 'rising' : 'stable'}`,
      oil_energy: `Brent crude at $${signal.value}/bbl — ${signal.severity} impact`,
      inflation_tracker: `CPI at ${signal.value}% — ${signal.change > 0 ? 'accelerating' : 'decelerating'}`,
      supply_chain: `Repair cost index ${signal.value} — ${signal.severity} disruption`,
    };
    return {
      id: def.id,
      title: def.title,
      type: signal.type,
      value: signal.value,
      change: signal.change,
      unit: signal.unit,
      severity: signal.severity,
      detail: details[def.id] ?? '',
      sparkline: signal.sparkline,
    };
  });
}

// ---------------------------------------------------------------------------
// Alert Generator
// ---------------------------------------------------------------------------
let alertCounter = 0;
export function computeAlerts(signals: Signal[], decision: Decision, prevAlerts: Alert[]): Alert[] {
  const newAlerts: Alert[] = [];

  for (const signal of signals) {
    if (signal.severity === 'critical') {
      const exists = prevAlerts.some(a => a.source === signal.type && !a.dismissed && Date.now() - a.timestamp < 30000);
      if (!exists) {
        newAlerts.push({
          id: `alert_${++alertCounter}`,
          severity: 'critical',
          title: `${signal.label} CRITICAL`,
          message: `${signal.label} at ${signal.value} ${signal.unit} — immediate attention required`,
          timestamp: Date.now(),
          source: signal.type,
          dismissed: false,
        });
      }
    }
  }

  if (decision.type === 'ESCALATE') {
    const exists = prevAlerts.some(a => a.title.includes('ESCALATE') && !a.dismissed && Date.now() - a.timestamp < 30000);
    if (!exists) {
      newAlerts.push({
        id: `alert_${++alertCounter}`,
        severity: 'critical',
        title: 'System Decision: ESCALATE',
        message: decision.reasoning,
        timestamp: Date.now(),
        source: 'regulatory',
        dismissed: false,
      });
    }
  }

  // Keep last 20 alerts, newest first
  const combined = [...newAlerts, ...prevAlerts.filter(a => !a.dismissed)];
  return combined.slice(0, 20);
}

// ---------------------------------------------------------------------------
// AI Brief Generator
// ---------------------------------------------------------------------------
export function computeAIBrief(signals: Signal[], decision: Decision, scenario: ScenarioId): AIBrief {
  const scenarioNames: Record<ScenarioId, string> = {
    oil_spike: 'Brent Crude Surge',
    fraud_ring: 'Organized Fraud Network',
    supply_disruption: 'Supply Chain Breakdown',
  };

  const topSignals = [...signals].sort((a, b) => {
    const sev: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
    return (sev[b.severity] ?? 0) - (sev[a.severity] ?? 0);
  }).slice(0, 3);

  const drivers = topSignals.map(s => `${s.label}: ${s.value} ${s.unit} (${s.change > 0 ? '+' : ''}${s.change}%)`);

  const headlines: Record<ScenarioId, string> = {
    oil_spike: `Oil at $${signals.find(s => s.type === 'oil')?.value ?? '?'}/bbl — GCC-wide cascade in progress`,
    fraud_ring: `Fraud index at ${signals.find(s => s.type === 'fraud')?.value ?? '?'} — cross-border pattern detected`,
    supply_disruption: `Supply chain index at ${signals.find(s => s.type === 'supply_chain')?.value ?? '?'} — claims pipeline impacted`,
  };

  const summaries: Record<ScenarioId, string> = {
    oil_spike: `Brent crude surge is propagating through inflation → claims → fraud chain. ${decision.type === 'ESCALATE' ? 'System recommends immediate escalation across all GCC markets.' : 'Monitoring for threshold breach.'}`,
    fraud_ring: `Organized fraud patterns detected across multiple GCC jurisdictions. Claims frequency elevated alongside fraud index. ${decision.type === 'ESCALATE' ? 'Cross-border investigation recommended.' : 'Enhanced monitoring activated.'}`,
    supply_disruption: `Supply chain disruption driving repair cost inflation and claims delays. Secondary effects on fraud activity as opportunistic claims increase. ${decision.type === 'ESCALATE' ? 'Reserve adequacy review recommended.' : 'Tracking disruption timeline.'}`,
  };

  const impacts: Record<ScenarioId, string> = {
    oil_spike: `Projected impact: ${(decision.riskScore * 100).toFixed(0)}% risk across $35.6B GCC insurance market. Oil-dependent economies (KW, OM, BH) face highest exposure.`,
    fraud_ring: `Projected impact: Fraud losses could reach ${(decision.riskScore * 2.5).toFixed(1)}% of GWP. UAE and Bahrain flagged as primary vectors.`,
    supply_disruption: `Projected impact: Claims cost increase of ${(decision.riskScore * 30).toFixed(0)}% in motor and property lines. Repair backlogs extending 4-8 weeks.`,
  };

  return {
    headline: headlines[scenario],
    summary: summaries[scenario],
    drivers,
    impact: impacts[scenario],
    recommendation: decision.drivers[0] ?? 'Continue monitoring',
    timestamp: Date.now(),
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
