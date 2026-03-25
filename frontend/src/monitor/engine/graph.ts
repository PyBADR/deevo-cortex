// ============================================================================
// DEEVO Monitor — Causal Graph Engine
// Models the GCC insurance risk propagation network.
// oil → inflation → claims → fraud → investigation
// ============================================================================

import type { CausalGraph, GraphNode, GraphEdge, Signal, SignalType, LayerId } from './types';

// ---------------------------------------------------------------------------
// Node definitions — positions for center-panel graph visualization
// ---------------------------------------------------------------------------
const NODE_DEFS: { id: string; type: SignalType; label: string; x: number; y: number }[] = [
  { id: 'oil_price',      type: 'oil',            label: 'Oil Price',         x: 100, y: 60 },
  { id: 'inflation',      type: 'inflation',      label: 'Inflation',         x: 280, y: 40 },
  { id: 'interest_rates', type: 'interest_rates',  label: 'Interest Rates',    x: 440, y: 80 },
  { id: 'claims_cost',    type: 'claims',          label: 'Claims Cost',       x: 200, y: 180 },
  { id: 'supply_chain',   type: 'supply_chain',    label: 'Supply Chain',      x: 380, y: 170 },
  { id: 'fraud_activity', type: 'fraud',           label: 'Fraud Activity',    x: 140, y: 300 },
  { id: 'investigation',  type: 'regulatory',      label: 'Investigation',     x: 340, y: 290 },
  { id: 'reserves',       type: 'claims',          label: 'Reserve Pressure',  x: 480, y: 260 },
];

// ---------------------------------------------------------------------------
// Edge definitions — causal relationships with base weights
// ---------------------------------------------------------------------------
const EDGE_DEFS: { source: string; target: string; baseWeight: number; label: string }[] = [
  { source: 'oil_price',      target: 'inflation',      baseWeight: 0.85, label: 'Oil drives CPI' },
  { source: 'oil_price',      target: 'supply_chain',   baseWeight: 0.60, label: 'Oil disrupts supply' },
  { source: 'inflation',      target: 'claims_cost',    baseWeight: 0.75, label: 'Inflation raises claims' },
  { source: 'inflation',      target: 'interest_rates', baseWeight: 0.55, label: 'Inflation triggers rates' },
  { source: 'claims_cost',    target: 'fraud_activity', baseWeight: 0.70, label: 'Claims attract fraud' },
  { source: 'claims_cost',    target: 'reserves',       baseWeight: 0.65, label: 'Claims erode reserves' },
  { source: 'supply_chain',   target: 'claims_cost',    baseWeight: 0.50, label: 'Supply delays increase claims' },
  { source: 'fraud_activity', target: 'investigation',  baseWeight: 0.80, label: 'Fraud triggers investigation' },
  { source: 'interest_rates', target: 'reserves',       baseWeight: 0.40, label: 'Rates affect reserves' },
  { source: 'investigation',  target: 'fraud_activity', baseWeight: -0.30, label: 'Investigation deters fraud' },
];

// ---------------------------------------------------------------------------
// Signal-type to node-id mapping
// ---------------------------------------------------------------------------
const TYPE_TO_NODE: Partial<Record<SignalType, string>> = {
  oil: 'oil_price',
  inflation: 'inflation',
  claims: 'claims_cost',
  fraud: 'fraud_activity',
  supply_chain: 'supply_chain',
  interest_rates: 'interest_rates',
  regulatory: 'investigation',
};

// ---------------------------------------------------------------------------
// Graph Engine
// ---------------------------------------------------------------------------
export class GraphEngine {
  private nodeValues: Map<string, number> = new Map();

  constructor() {
    for (const def of NODE_DEFS) {
      this.nodeValues.set(def.id, 0.3);
    }
  }

  /**
   * Propagate signals through the causal graph.
   * 1. Seed node values from live signals
   * 2. Run propagation iterations
   * 3. Return updated graph
   */
  propagate(signals: Signal[], activeLayers: LayerId[]): CausalGraph {
    // Step 1: Seed from signals
    for (const signal of signals) {
      const nodeId = TYPE_TO_NODE[signal.type];
      if (nodeId) {
        // Normalize signal to 0–1 based on severity
        const intensity = severityToIntensity(signal.severity, signal.change);
        this.nodeValues.set(nodeId, clamp(intensity, 0, 1));
      }
    }

    // Step 2: Propagation — 3 iterations of weighted influence
    for (let iter = 0; iter < 3; iter++) {
      const updates = new Map<string, number>();

      for (const edge of EDGE_DEFS) {
        const sourceVal = this.nodeValues.get(edge.source) ?? 0;
        const targetVal = this.nodeValues.get(edge.target) ?? 0;

        // Only propagate positive influence (negative = dampening)
        const influence = sourceVal * Math.abs(edge.baseWeight) * (edge.baseWeight > 0 ? 0.3 : -0.15);
        const current = updates.get(edge.target) ?? targetVal;
        updates.set(edge.target, clamp(current + influence, 0, 1));
      }

      for (const [id, val] of updates) {
        // Blend: 70% current + 30% propagated
        const prev = this.nodeValues.get(id) ?? 0;
        this.nodeValues.set(id, clamp(prev * 0.7 + val * 0.3, 0, 1));
      }
    }

    // Step 3: Build output graph, filtering by active layers
    const activeTypes = new Set<SignalType>(activeLayers as SignalType[]);
    // Always show regulatory/claims
    activeTypes.add('claims');
    activeTypes.add('regulatory');

    const nodes: GraphNode[] = NODE_DEFS.map(def => ({
      id: def.id,
      type: def.type,
      label: def.label,
      value: this.nodeValues.get(def.id) ?? 0,
      intensity: this.nodeValues.get(def.id) ?? 0,
      x: def.x,
      y: def.y,
    }));

    const edges: GraphEdge[] = EDGE_DEFS.map(e => {
      const sourceVal = this.nodeValues.get(e.source) ?? 0;
      const targetVal = this.nodeValues.get(e.target) ?? 0;
      const avgIntensity = (sourceVal + targetVal) / 2;

      return {
        source: e.source,
        target: e.target,
        weight: clamp(Math.abs(e.baseWeight) * avgIntensity * 2, 0, 1),
        active: avgIntensity > 0.3,
        label: e.label,
      };
    });

    return { nodes, edges };
  }

  getNodeValue(id: string): number {
    return this.nodeValues.get(id) ?? 0;
  }

  reset(): void {
    for (const def of NODE_DEFS) {
      this.nodeValues.set(def.id, 0.3);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function severityToIntensity(severity: string, change: number): number {
  const base: Record<string, number> = {
    critical: 0.9,
    high: 0.7,
    moderate: 0.45,
    low: 0.2,
  };
  const b = base[severity] ?? 0.3;
  // Add some variation based on change magnitude
  const changeFactor = Math.min(Math.abs(change) / 100, 0.2);
  return clamp(b + changeFactor, 0, 1);
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
