// ============================================================================
// DEEVO Monitor — Signal Ingestion Engine
// Generates and manages real-time market signals for GCC risk intelligence.
// Uses simulated market dynamics with realistic volatility models.
// ============================================================================

import type { Signal, SignalType, Severity, ScenarioId } from './types';

// ---------------------------------------------------------------------------
// Base signal definitions
// ---------------------------------------------------------------------------
interface SignalDef {
  id: string;
  type: SignalType;
  label: string;
  baseValue: number;
  unit: string;
  weight: number;
  volatility: number;     // % max random walk per tick
  thresholds: { critical: number; high: number; moderate: number };
  direction: 'up_bad' | 'down_bad';
}

const SIGNAL_DEFS: SignalDef[] = [
  {
    id: 'oil_brent',
    type: 'oil',
    label: 'Oil Price (Brent)',
    baseValue: 85.0,
    unit: 'USD/barrel',
    weight: 0.25,
    volatility: 2.5,
    thresholds: { critical: 120, high: 100, moderate: 90 },
    direction: 'up_bad',
  },
  {
    id: 'cpi_gcc',
    type: 'inflation',
    label: 'CPI Inflation Rate',
    baseValue: 3.2,
    unit: 'percent',
    weight: 0.15,
    volatility: 1.0,
    thresholds: { critical: 6.0, high: 4.5, moderate: 3.5 },
    direction: 'up_bad',
  },
  {
    id: 'claims_ratio',
    type: 'claims',
    label: 'Claims Frequency',
    baseValue: 0.42,
    unit: 'ratio',
    weight: 0.20,
    volatility: 3.0,
    thresholds: { critical: 0.65, high: 0.55, moderate: 0.48 },
    direction: 'up_bad',
  },
  {
    id: 'fraud_index',
    type: 'fraud',
    label: 'Fraud Activity Index',
    baseValue: 0.18,
    unit: 'index',
    weight: 0.20,
    volatility: 4.0,
    thresholds: { critical: 0.45, high: 0.35, moderate: 0.25 },
    direction: 'up_bad',
  },
  {
    id: 'repair_cost',
    type: 'supply_chain',
    label: 'Repair Cost Index',
    baseValue: 1.0,
    unit: 'index',
    weight: 0.10,
    volatility: 1.5,
    thresholds: { critical: 1.6, high: 1.35, moderate: 1.15 },
    direction: 'up_bad',
  },
  {
    id: 'central_bank_rate',
    type: 'interest_rates',
    label: 'Central Bank Rate',
    baseValue: 5.0,
    unit: 'percent',
    weight: 0.05,
    volatility: 0.3,
    thresholds: { critical: 7.0, high: 6.0, moderate: 5.5 },
    direction: 'up_bad',
  },
  {
    id: 'currency_vol',
    type: 'currency',
    label: 'Currency Volatility',
    baseValue: 0.08,
    unit: 'index',
    weight: 0.03,
    volatility: 5.0,
    thresholds: { critical: 0.20, high: 0.15, moderate: 0.10 },
    direction: 'up_bad',
  },
  {
    id: 'regulatory_pressure',
    type: 'regulatory',
    label: 'Regulatory Pressure',
    baseValue: 0.30,
    unit: 'index',
    weight: 0.02,
    volatility: 2.0,
    thresholds: { critical: 0.70, high: 0.55, moderate: 0.40 },
    direction: 'up_bad',
  },
];

// ---------------------------------------------------------------------------
// Scenario overrides — shift the market when a scenario is active
// ---------------------------------------------------------------------------
const SCENARIO_SHIFTS: Record<ScenarioId, Partial<Record<string, { bias: number; volMult: number }>>> = {
  oil_spike: {
    oil_brent: { bias: 45, volMult: 3.0 },
    cpi_gcc: { bias: 2.5, volMult: 2.0 },
    claims_ratio: { bias: 0.18, volMult: 1.5 },
    fraud_index: { bias: 0.12, volMult: 1.8 },
    repair_cost: { bias: 0.4, volMult: 1.5 },
  },
  fraud_ring: {
    fraud_index: { bias: 0.30, volMult: 4.0 },
    claims_ratio: { bias: 0.15, volMult: 2.5 },
    regulatory_pressure: { bias: 0.25, volMult: 2.0 },
  },
  supply_disruption: {
    repair_cost: { bias: 0.55, volMult: 3.0 },
    claims_ratio: { bias: 0.12, volMult: 2.0 },
    oil_brent: { bias: 15, volMult: 1.5 },
    currency_vol: { bias: 0.06, volMult: 2.0 },
  },
};

// ---------------------------------------------------------------------------
// Severity calculator
// ---------------------------------------------------------------------------
function calcSeverity(def: SignalDef, value: number): Severity {
  if (def.direction === 'up_bad') {
    if (value >= def.thresholds.critical) return 'critical';
    if (value >= def.thresholds.high) return 'high';
    if (value >= def.thresholds.moderate) return 'moderate';
    return 'low';
  }
  // down_bad would reverse thresholds — not used currently
  return 'low';
}

// ---------------------------------------------------------------------------
// Random walk with mean-reverting drift
// ---------------------------------------------------------------------------
function randomWalk(current: number, base: number, volatility: number, bias: number): number {
  const meanRevert = (base + bias - current) * 0.05;
  const noise = (Math.random() - 0.48) * volatility * 0.01 * current;
  return Math.max(0, current + meanRevert + noise);
}

// ---------------------------------------------------------------------------
// Signal Engine class
// ---------------------------------------------------------------------------
export class SignalEngine {
  private signals: Map<string, Signal> = new Map();
  private scenario: ScenarioId = 'oil_spike';

  constructor() {
    this.initSignals();
  }

  private initSignals(): void {
    const now = Date.now();
    for (const def of SIGNAL_DEFS) {
      const shift = SCENARIO_SHIFTS[this.scenario]?.[def.id];
      const value = def.baseValue + (shift?.bias ?? 0);
      const sparkline = Array.from({ length: 20 }, (_, i) => {
        const t = i / 20;
        return def.baseValue + (value - def.baseValue) * t + (Math.random() - 0.5) * def.volatility * 0.01 * def.baseValue;
      });

      this.signals.set(def.id, {
        id: def.id,
        type: def.type,
        label: def.label,
        value: round(value),
        previousValue: round(def.baseValue),
        change: round(((value - def.baseValue) / def.baseValue) * 100),
        unit: def.unit,
        timestamp: now,
        weight: def.weight,
        severity: calcSeverity(def, value),
        sparkline: sparkline.map(v => round(v)),
      });
    }
  }

  setScenario(scenario: ScenarioId): void {
    this.scenario = scenario;
    this.initSignals();
  }

  tick(): Signal[] {
    const now = Date.now();

    for (const def of SIGNAL_DEFS) {
      const prev = this.signals.get(def.id)!;
      const shift = SCENARIO_SHIFTS[this.scenario]?.[def.id];
      const bias = shift?.bias ?? 0;
      const volMult = shift?.volMult ?? 1.0;

      const newValue = round(randomWalk(prev.value, def.baseValue, def.volatility * volMult, bias));
      const change = round(((newValue - def.baseValue) / def.baseValue) * 100);
      const sparkline = [...prev.sparkline.slice(1), newValue];

      this.signals.set(def.id, {
        ...prev,
        previousValue: prev.value,
        value: newValue,
        change,
        timestamp: now,
        severity: calcSeverity(def, newValue),
        sparkline,
      });
    }

    return this.getSignals();
  }

  getSignals(): Signal[] {
    return Array.from(this.signals.values());
  }

  getSignal(id: string): Signal | undefined {
    return this.signals.get(id);
  }

  getByType(type: SignalType): Signal | undefined {
    return Array.from(this.signals.values()).find(s => s.type === type);
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
