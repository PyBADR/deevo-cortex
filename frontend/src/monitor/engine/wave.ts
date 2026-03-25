// ============================================================================
// DEEVO Monitor — Causal Wave Engine
// Simulates signal propagation as animated waves across the causal graph.
// Waves travel along edges with decay, creating cascading visual effects.
// ============================================================================

import type { CausalGraph, ScenarioId, SignalType } from './types';

// ---------------------------------------------------------------------------
// Wave — a single propagation pulse traveling through the graph
// ---------------------------------------------------------------------------
export interface Wave {
  id: number;
  originNode: string;
  currentEdge: { source: string; target: string } | null;
  targetNode: string;
  strength: number;      // 0–1, decays over time
  speed: number;         // edges per second
  decay: number;         // strength lost per edge traversal
  progress: number;      // 0–1 along current edge
  timestamp: number;
  color: string;
  generation: number;    // 0 = original, 1+ = child waves
  dead: boolean;
}

// ---------------------------------------------------------------------------
// Node activation state
// ---------------------------------------------------------------------------
export interface NodeActivation {
  nodeId: string;
  level: number;         // 0–1 activation level
  peakLevel: number;     // highest activation seen
  lastWaveTime: number;
  pulsePhase: number;    // for visual pulse animation
  incoming: number;      // number of incoming waves
}

// ---------------------------------------------------------------------------
// Edge flow state
// ---------------------------------------------------------------------------
export interface EdgeFlow {
  source: string;
  target: string;
  intensity: number;     // 0–1
  waveCount: number;
  particles: { progress: number; strength: number; id: number }[];
}

// ---------------------------------------------------------------------------
// Timeline event — for the cascading timeline display
// ---------------------------------------------------------------------------
export interface TimelineEvent {
  tick: number;
  nodeId: string;
  label: string;
  strength: number;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Wave engine state snapshot
// ---------------------------------------------------------------------------
export interface WaveState {
  waves: Wave[];
  nodeActivations: Map<string, NodeActivation>;
  edgeFlows: Map<string, EdgeFlow>;
  timeline: TimelineEvent[];
  tick: number;
  running: boolean;
  speed: number;         // 1, 2, or 5
}

// ---------------------------------------------------------------------------
// Graph edge definition for the wave engine
// ---------------------------------------------------------------------------
interface WaveEdge {
  source: string;
  target: string;
  weight: number;
  label: string;
}

// Causal edges with propagation weights
const CAUSAL_EDGES: WaveEdge[] = [
  { source: 'oil_price',      target: 'inflation',      weight: 0.85, label: 'Oil drives CPI' },
  { source: 'oil_price',      target: 'supply_chain',   weight: 0.60, label: 'Oil disrupts supply' },
  { source: 'inflation',      target: 'claims_cost',    weight: 0.75, label: 'Inflation raises claims' },
  { source: 'inflation',      target: 'interest_rates', weight: 0.55, label: 'Inflation triggers rates' },
  { source: 'claims_cost',    target: 'fraud_activity', weight: 0.70, label: 'Claims attract fraud' },
  { source: 'claims_cost',    target: 'reserves',       weight: 0.65, label: 'Claims erode reserves' },
  { source: 'supply_chain',   target: 'claims_cost',    weight: 0.50, label: 'Supply delays claims' },
  { source: 'fraud_activity', target: 'investigation',  weight: 0.80, label: 'Fraud triggers investigation' },
  { source: 'interest_rates', target: 'reserves',       weight: 0.40, label: 'Rates affect reserves' },
];

// Node labels
const NODE_LABELS: Record<string, string> = {
  oil_price: 'Oil Price',
  inflation: 'Inflation',
  claims_cost: 'Claims Cost',
  fraud_activity: 'Fraud Activity',
  supply_chain: 'Supply Chain',
  interest_rates: 'Interest Rates',
  investigation: 'Investigation',
  reserves: 'Reserve Pressure',
};

// Scenario origin nodes and strengths
const SCENARIO_ORIGINS: Record<ScenarioId, { node: string; strength: number; color: string }[]> = {
  oil_spike: [
    { node: 'oil_price', strength: 0.95, color: '#f59e0b' },
  ],
  fraud_ring: [
    { node: 'fraud_activity', strength: 0.90, color: '#f43f5e' },
    { node: 'claims_cost', strength: 0.60, color: '#06b6d4' },
  ],
  supply_disruption: [
    { node: 'supply_chain', strength: 0.85, color: '#8b5cf6' },
    { node: 'oil_price', strength: 0.50, color: '#f59e0b' },
  ],
};

// ---------------------------------------------------------------------------
// Wave Engine
// ---------------------------------------------------------------------------
let waveIdCounter = 0;

export class WaveEngine {
  private waves: Wave[] = [];
  private nodeActivations: Map<string, NodeActivation> = new Map();
  private edgeFlows: Map<string, EdgeFlow> = new Map();
  private timeline: TimelineEvent[] = [];
  private tick = 0;
  private speed = 1;
  private scenario: ScenarioId = 'oil_spike';
  private spawned = false;

  constructor() {
    this.initNodes();
    this.initEdges();
  }

  private initNodes(): void {
    const nodeIds = new Set<string>();
    for (const e of CAUSAL_EDGES) {
      nodeIds.add(e.source);
      nodeIds.add(e.target);
    }
    for (const id of nodeIds) {
      this.nodeActivations.set(id, {
        nodeId: id,
        level: 0,
        peakLevel: 0,
        lastWaveTime: 0,
        pulsePhase: 0,
        incoming: 0,
      });
    }
  }

  private initEdges(): void {
    for (const e of CAUSAL_EDGES) {
      const key = `${e.source}->${e.target}`;
      this.edgeFlows.set(key, {
        source: e.source,
        target: e.target,
        intensity: 0,
        waveCount: 0,
        particles: [],
      });
    }
  }

  setScenario(scenario: ScenarioId): void {
    this.scenario = scenario;
    this.reset();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  reset(): void {
    this.waves = [];
    this.timeline = [];
    this.tick = 0;
    this.spawned = false;
    waveIdCounter = 0;

    for (const [, node] of this.nodeActivations) {
      node.level = 0;
      node.peakLevel = 0;
      node.lastWaveTime = 0;
      node.pulsePhase = 0;
      node.incoming = 0;
    }
    for (const [, edge] of this.edgeFlows) {
      edge.intensity = 0;
      edge.waveCount = 0;
      edge.particles = [];
    }
  }

  /**
   * Called every animation frame (~16ms).
   * deltaMs = time since last call.
   */
  update(deltaMs: number): WaveState {
    const dt = (deltaMs / 1000) * this.speed;
    this.tick++;

    // Spawn initial waves from scenario origin nodes (once)
    if (!this.spawned) {
      this.spawnScenarioWaves();
      this.spawned = true;
    }

    // Respawn periodically to keep simulation alive
    if (this.tick % Math.round(180 / this.speed) === 0) {
      this.spawnScenarioWaves();
    }

    // Update existing waves
    for (const wave of this.waves) {
      if (wave.dead) continue;

      if (wave.currentEdge) {
        // Advance along edge
        wave.progress += dt * wave.speed;

        // Update edge flow particles
        const edgeKey = `${wave.currentEdge.source}->${wave.currentEdge.target}`;
        const flow = this.edgeFlows.get(edgeKey);
        if (flow) {
          // Update or add particle
          const existing = flow.particles.find(p => p.id === wave.id);
          if (existing) {
            existing.progress = wave.progress;
            existing.strength = wave.strength;
          } else {
            flow.particles.push({ progress: wave.progress, strength: wave.strength, id: wave.id });
          }
          flow.intensity = Math.min(1, flow.intensity + wave.strength * 0.02);
        }

        // Wave reached target node
        if (wave.progress >= 1) {
          this.activateNode(wave.targetNode, wave.strength, wave);

          // Remove particle from edge
          if (flow) {
            flow.particles = flow.particles.filter(p => p.id !== wave.id);
          }

          // Spawn child waves from target node
          if (wave.strength > 0.1 && wave.generation < 5) {
            this.spawnChildWaves(wave.targetNode, wave.strength * (1 - wave.decay), wave.color, wave.generation + 1);
          }

          wave.dead = true;
        }
      }
    }

    // Decay node activations
    for (const [, node] of this.nodeActivations) {
      node.level *= (1 - dt * 0.15);
      node.pulsePhase += dt * 3;
      if (node.level < 0.01) node.level = 0;
    }

    // Decay edge flows
    for (const [, edge] of this.edgeFlows) {
      edge.intensity *= (1 - dt * 0.2);
      if (edge.intensity < 0.01) edge.intensity = 0;
      // Clean dead particles
      edge.particles = edge.particles.filter(p => p.progress < 1);
    }

    // Clean dead waves
    this.waves = this.waves.filter(w => !w.dead);

    return this.getState();
  }

  private spawnScenarioWaves(): void {
    const origins = SCENARIO_ORIGINS[this.scenario] ?? [];
    for (const origin of origins) {
      // Activate origin node immediately
      this.activateNode(origin.node, origin.strength, null);

      // Spawn waves along outgoing edges
      this.spawnChildWaves(origin.node, origin.strength, origin.color, 0);
    }
  }

  private spawnChildWaves(fromNode: string, strength: number, color: string, generation: number): void {
    const outEdges = CAUSAL_EDGES.filter(e => e.source === fromNode);

    for (const edge of outEdges) {
      const waveStrength = strength * edge.weight;
      if (waveStrength < 0.05) continue;

      const wave: Wave = {
        id: ++waveIdCounter,
        originNode: fromNode,
        currentEdge: { source: edge.source, target: edge.target },
        targetNode: edge.target,
        strength: waveStrength,
        speed: 0.8 + Math.random() * 0.4,  // slight variation
        decay: 0.25,
        progress: 0,
        timestamp: Date.now(),
        color,
        generation,
        dead: false,
      };

      this.waves.push(wave);

      // Update edge flow
      const edgeKey = `${edge.source}->${edge.target}`;
      const flow = this.edgeFlows.get(edgeKey);
      if (flow) {
        flow.waveCount++;
      }
    }
  }

  private activateNode(nodeId: string, strength: number, wave: Wave | null): void {
    const node = this.nodeActivations.get(nodeId);
    if (!node) return;

    node.level = Math.min(1, node.level + strength * 0.6);
    node.peakLevel = Math.max(node.peakLevel, node.level);
    node.lastWaveTime = Date.now();
    node.incoming++;

    // Add timeline event
    if (strength > 0.15) {
      const label = NODE_LABELS[nodeId] ?? nodeId;
      // Avoid duplicate timeline events too close together
      const recent = this.timeline.find(t => t.nodeId === nodeId && this.tick - t.tick < 30);
      if (!recent) {
        this.timeline.push({
          tick: this.tick,
          nodeId,
          label,
          strength,
          timestamp: Date.now(),
        });
        // Keep timeline manageable
        if (this.timeline.length > 30) {
          this.timeline = this.timeline.slice(-30);
        }
      }
    }
  }

  getState(): WaveState {
    return {
      waves: [...this.waves],
      nodeActivations: new Map(this.nodeActivations),
      edgeFlows: new Map(this.edgeFlows),
      timeline: [...this.timeline],
      tick: this.tick,
      running: true,
      speed: this.speed,
    };
  }

  getNodeActivation(nodeId: string): NodeActivation | undefined {
    return this.nodeActivations.get(nodeId);
  }
}
