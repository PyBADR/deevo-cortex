// ============================================================================
// DEEVO Monitor — Scenario Definitions
// ============================================================================

import type { Scenario, Layer } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'oil_spike',
    name: 'Oil Price Spike',
    description: 'Brent crude surges past $130/bbl — OPEC+ production cuts tighten global supply. GCC insurance markets face cascading inflation pressure.',
    icon: '🛢️',
    signalOverrides: {
      oil: { value: 135, change: 59 },
      inflation: { value: 6.2, change: 94 },
      claims: { value: 0.62, change: 48 },
      fraud: { value: 0.35, change: 94 },
    },
    expectedDecision: 'ESCALATE',
  },
  {
    id: 'fraud_ring',
    name: 'Organized Fraud Ring',
    description: 'Cross-border fraud network detected across UAE, Bahrain, and Qatar. Staged accidents and inflated claims targeting motor and medical lines.',
    icon: '🕵️',
    signalOverrides: {
      fraud: { value: 0.52, change: 189 },
      claims: { value: 0.58, change: 38 },
      regulatory: { value: 0.60, change: 100 },
    },
    expectedDecision: 'ESCALATE',
  },
  {
    id: 'supply_disruption',
    name: 'Supply Chain Disruption',
    description: 'Red Sea shipping delays and Gulf port congestion drive repair cost inflation. Parts shortages extend claim resolution timelines across GCC.',
    icon: '🚢',
    signalOverrides: {
      supply_chain: { value: 1.65, change: 65 },
      claims: { value: 0.52, change: 24 },
      oil: { value: 98, change: 15 },
      currency: { value: 0.14, change: 75 },
    },
    expectedDecision: 'REVIEW',
  },
];

export const LAYERS: Layer[] = [
  { id: 'oil',            label: 'Oil & Energy',    color: '#f59e0b', enabled: true,  icon: '🛢️' },
  { id: 'inflation',      label: 'Inflation',       color: '#ef4444', enabled: true,  icon: '📈' },
  { id: 'claims',         label: 'Claims',          color: '#06b6d4', enabled: true,  icon: '📋' },
  { id: 'fraud',          label: 'Fraud',           color: '#f43f5e', enabled: true,  icon: '🔍' },
  { id: 'supply_chain',   label: 'Supply Chain',    color: '#8b5cf6', enabled: true,  icon: '🚢' },
  { id: 'interest_rates', label: 'Interest Rates',  color: '#22c55e', enabled: false, icon: '🏦' },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}
