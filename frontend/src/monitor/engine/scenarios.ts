// ============================================================================
// DEEVO Monitor — Scenario & Layer Definitions (Enterprise Redesign)
// ============================================================================

import type { Scenario, Layer } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'oil_spike',
    name: 'Oil Price Spike',
    description: 'Brent crude surges past $130/bbl — OPEC+ production cuts tighten global supply. GCC insurance markets face cascading inflation pressure.',
    icon: '⚡',
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
    icon: '🔒',
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
    icon: '📦',
    signalOverrides: {
      supply_chain: { value: 1.65, change: 65 },
      claims: { value: 0.52, change: 24 },
      oil: { value: 98, change: 15 },
      currency: { value: 0.14, change: 75 },
    },
    expectedDecision: 'REVIEW',
  },
];

// Core engine layers (mapped to SignalType and used by all engines)
export const LAYERS: Layer[] = [
  { id: 'oil',            label: 'Macro Risk',          color: '#F5B942', enabled: true,  icon: '◆' },
  { id: 'inflation',      label: 'Rates & Inflation',   color: '#FF5C6C', enabled: true,  icon: '◆' },
  { id: 'claims',         label: 'Claims Stress',       color: '#37C5F3', enabled: true,  icon: '◆' },
  { id: 'fraud',          label: 'Fraud Signals',       color: '#FF5C6C', enabled: true,  icon: '◆' },
  { id: 'supply_chain',   label: 'Supply Chain',        color: '#9B8AFF', enabled: true,  icon: '◆' },
  { id: 'interest_rates', label: 'Regulatory',          color: '#4DA3FF', enabled: false, icon: '◆' },
];

// Extended display-only layers (shown in UI panel but not tied to engine signals)
export interface DisplayLayer {
  id: string;
  label: string;
  color: string;
  group: string;
  enabled: boolean;
}

export const DISPLAY_LAYERS: DisplayLayer[] = [
  { id: 'insurance_pressure', label: 'Insurance Pressure', color: '#37C5F3', group: 'Insurance', enabled: true },
  { id: 'gcc_exposure',       label: 'GCC Exposure',       color: '#4DA3FF', group: 'Regional',  enabled: true },
  { id: 'country_focus',      label: 'Country Focus',      color: '#3CCB7F', group: 'Regional',  enabled: false },
  { id: 'scenario_paths',     label: 'Scenario Paths',     color: '#9B8AFF', group: 'Analysis',  enabled: true },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}
