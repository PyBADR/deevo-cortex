// ============================================================================
// DEEVO Monitor — Cognitive Scenario Engine
// Generates multiple competing causal futures, scores them, selects dominant.
// This is the REASONING layer — not reactive, but predictive.
// ============================================================================

import type { Signal, SignalType, ScenarioId, DecisionType } from './types';

// ---------------------------------------------------------------------------
// Core Types
// ---------------------------------------------------------------------------

export interface PathNode {
  nodeId: string;
  label: string;
  type: SignalType | 'intervention' | 'stabilization';
  activation: number;    // 0–1, predicted activation at this step
  delta: number;         // change from previous node
  step: number;          // position in sequence
}

export interface CausalPath {
  id: string;
  name: string;
  sequence: PathNode[];
  probability: number;   // 0–1
  impactScore: number;   // 0–1, cumulative effect
  riskScore: number;     // 0–1, normalized output
  explanation: string;
  decision: DecisionType;
  color: string;
  isDominant: boolean;
  tags: string[];
}

export interface CognitiveState {
  paths: CausalPath[];
  dominantPath: CausalPath | null;
  alternativePaths: CausalPath[];
  selectedPathId: string | null;
  convergenceScore: number;   // 0–1, how much paths agree
  uncertaintyIndex: number;   // 0–1, spread of outcomes
  reasoning: CognitiveReasoning;
  timestamp: number;
}

export interface CognitiveReasoning {
  selectedBecause: string;
  alternativeOutcomes: string[];
  keyDrivers: string[];
  confidenceFactors: string[];
  uncertaintyFactors: string[];
  recommendation: string;
}

// ---------------------------------------------------------------------------
// Causal Graph Definition (shared with graph.ts but extended)
// ---------------------------------------------------------------------------

interface CausalEdge {
  source: string;
  target: string;
  weight: number;          // base propagation strength
  label: string;
  type: 'propagation' | 'intervention' | 'feedback';
}

const FULL_GRAPH: CausalEdge[] = [
  // Primary propagation chains
  { source: 'oil_price',      target: 'inflation',        weight: 0.85, label: 'Oil drives CPI',                  type: 'propagation' },
  { source: 'oil_price',      target: 'supply_chain',     weight: 0.60, label: 'Oil disrupts supply',             type: 'propagation' },
  { source: 'inflation',      target: 'claims_cost',      weight: 0.75, label: 'Inflation raises claims',         type: 'propagation' },
  { source: 'inflation',      target: 'interest_rates',   weight: 0.55, label: 'Inflation triggers rates',        type: 'propagation' },
  { source: 'claims_cost',    target: 'fraud_activity',   weight: 0.70, label: 'Claims attract fraud',            type: 'propagation' },
  { source: 'claims_cost',    target: 'reserves',         weight: 0.65, label: 'Claims erode reserves',           type: 'propagation' },
  { source: 'supply_chain',   target: 'claims_cost',      weight: 0.50, label: 'Supply delays increase claims',   type: 'propagation' },
  { source: 'fraud_activity', target: 'investigation',    weight: 0.80, label: 'Fraud triggers investigation',    type: 'propagation' },
  { source: 'interest_rates', target: 'reserves',         weight: 0.40, label: 'Rates affect reserves',           type: 'propagation' },

  // Intervention/stabilization paths (system responses)
  { source: 'oil_price',      target: 'policy_response',  weight: 0.45, label: 'Policy intervention triggered',   type: 'intervention' },
  { source: 'policy_response', target: 'inflation',       weight: -0.30, label: 'Policy stabilizes inflation',    type: 'intervention' },
  { source: 'investigation',  target: 'fraud_activity',   weight: -0.35, label: 'Investigation deters fraud',     type: 'feedback' },
  { source: 'interest_rates', target: 'inflation',        weight: -0.20, label: 'Rate hikes cool inflation',      type: 'feedback' },
  { source: 'reserves',       target: 'claims_cost',      weight: -0.15, label: 'Reserve stress limits payouts',  type: 'feedback' },
  { source: 'fraud_activity', target: 'regulatory',       weight: 0.60,  label: 'Fraud escalates regulation',     type: 'propagation' },
  { source: 'regulatory',     target: 'fraud_activity',   weight: -0.40, label: 'Regulation suppresses fraud',    type: 'feedback' },
  { source: 'supply_chain',   target: 'logistics',        weight: 0.70,  label: 'Supply disrupts logistics',      type: 'propagation' },
  { source: 'logistics',      target: 'claims_cost',      weight: 0.55,  label: 'Logistics delays raise claims',  type: 'propagation' },
];

const NODE_LABELS: Record<string, string> = {
  oil_price: 'Oil Price',
  inflation: 'Inflation',
  claims_cost: 'Claims Cost',
  fraud_activity: 'Fraud Activity',
  supply_chain: 'Supply Chain',
  interest_rates: 'Interest Rates',
  investigation: 'Investigation',
  reserves: 'Reserve Pressure',
  policy_response: 'Policy Response',
  regulatory: 'Regulatory Action',
  logistics: 'Logistics Strain',
};

const NODE_TYPES: Record<string, SignalType | 'intervention' | 'stabilization'> = {
  oil_price: 'oil',
  inflation: 'inflation',
  claims_cost: 'claims',
  fraud_activity: 'fraud',
  supply_chain: 'supply_chain',
  interest_rates: 'interest_rates',
  investigation: 'regulatory',
  reserves: 'claims',
  policy_response: 'intervention',
  regulatory: 'regulatory',
  logistics: 'supply_chain',
};

// Path templates per scenario — defines the branching exploration space
interface PathTemplate {
  name: string;
  startNode: string;
  explorationBias: 'worst_case' | 'intervention' | 'feedback' | 'cascade' | 'mixed';
  color: string;
  tags: string[];
}

const SCENARIO_PATHS: Record<ScenarioId, PathTemplate[]> = {
  oil_spike: [
    { name: 'Full Cascade',              startNode: 'oil_price', explorationBias: 'worst_case',    color: '#ef4444', tags: ['cascade', 'high-risk'] },
    { name: 'Policy Intervention',       startNode: 'oil_price', explorationBias: 'intervention',  color: '#22c55e', tags: ['intervention', 'mitigation'] },
    { name: 'Supply Chain Shock',        startNode: 'oil_price', explorationBias: 'cascade',       color: '#f59e0b', tags: ['supply', 'secondary'] },
    { name: 'Rate Tightening Response',  startNode: 'oil_price', explorationBias: 'feedback',      color: '#8b5cf6', tags: ['monetary', 'stabilization'] },
    { name: 'Fraud Amplification',       startNode: 'oil_price', explorationBias: 'mixed',         color: '#f43f5e', tags: ['fraud', 'compound'] },
  ],
  fraud_ring: [
    { name: 'Unchecked Fraud Spread',    startNode: 'fraud_activity', explorationBias: 'worst_case',   color: '#ef4444', tags: ['cascade', 'high-risk'] },
    { name: 'Investigation Containment', startNode: 'fraud_activity', explorationBias: 'feedback',     color: '#22c55e', tags: ['containment', 'response'] },
    { name: 'Regulatory Crackdown',      startNode: 'fraud_activity', explorationBias: 'intervention', color: '#06b6d4', tags: ['regulatory', 'systemic'] },
    { name: 'Claims Spiral',             startNode: 'fraud_activity', explorationBias: 'cascade',      color: '#f59e0b', tags: ['claims', 'secondary'] },
  ],
  supply_disruption: [
    { name: 'Prolonged Disruption',      startNode: 'supply_chain', explorationBias: 'worst_case',   color: '#ef4444', tags: ['prolonged', 'high-risk'] },
    { name: 'Logistics Recovery',        startNode: 'supply_chain', explorationBias: 'feedback',     color: '#22c55e', tags: ['recovery', 'stabilization'] },
    { name: 'Cost Inflation Cascade',    startNode: 'supply_chain', explorationBias: 'cascade',      color: '#f59e0b', tags: ['inflation', 'secondary'] },
    { name: 'Oil-Driven Amplification',  startNode: 'supply_chain', explorationBias: 'mixed',        color: '#8b5cf6', tags: ['oil', 'compound'] },
    { name: 'Fraud Exploitation',        startNode: 'supply_chain', explorationBias: 'worst_case',   color: '#f43f5e', tags: ['fraud', 'opportunistic'] },
  ],
};

// ---------------------------------------------------------------------------
// Cognitive Engine
// ---------------------------------------------------------------------------

export class CognitiveEngine {
  private scenario: ScenarioId = 'oil_spike';
  private cachedState: CognitiveState | null = null;

  setScenario(scenario: ScenarioId): void {
    this.scenario = scenario;
    this.cachedState = null;
  }

  /**
   * Generate all causal paths, score them, select dominant.
   * Called when signals update.
   */
  compute(signals: Signal[]): CognitiveState {
    const templates = SCENARIO_PATHS[this.scenario] ?? SCENARIO_PATHS.oil_spike;
    const signalMap = new Map(signals.map(s => [s.type, s]));

    // 1. Generate paths
    const paths = templates.map((template, idx) =>
      this.generatePath(template, signalMap, idx)
    );

    // 2. Normalize probabilities to sum to 1
    const totalProb = paths.reduce((s, p) => s + p.probability, 0);
    if (totalProb > 0) {
      for (const p of paths) {
        p.probability = round(p.probability / totalProb);
      }
    }

    // 3. Select dominant (highest probability × impact)
    const scored = paths.map(p => ({
      path: p,
      score: p.probability * p.impactScore * (1 + p.riskScore),
    })).sort((a, b) => b.score - a.score);

    const dominant = scored[0]?.path ?? null;
    if (dominant) dominant.isDominant = true;

    const alternatives = scored.slice(1).map(s => s.path);

    // 4. Compute convergence (how much paths agree on outcome)
    const decisions = paths.map(p => p.decision);
    const decisionCounts: Record<string, number> = {};
    for (const d of decisions) decisionCounts[d] = (decisionCounts[d] ?? 0) + 1;
    const maxAgree = Math.max(...Object.values(decisionCounts));
    const convergenceScore = round(maxAgree / paths.length);

    // 5. Uncertainty index
    const riskSpread = paths.length > 1
      ? Math.max(...paths.map(p => p.riskScore)) - Math.min(...paths.map(p => p.riskScore))
      : 0;
    const uncertaintyIndex = round(1 - convergenceScore + riskSpread * 0.3);

    // 6. Generate reasoning
    const reasoning = this.generateReasoning(dominant, alternatives, convergenceScore, uncertaintyIndex, signals);

    const state: CognitiveState = {
      paths,
      dominantPath: dominant,
      alternativePaths: alternatives,
      selectedPathId: dominant?.id ?? null,
      convergenceScore,
      uncertaintyIndex,
      reasoning,
      timestamp: Date.now(),
    };

    this.cachedState = state;
    return state;
  }

  private generatePath(template: PathTemplate, signalMap: Map<string, Signal>, idx: number): CausalPath {
    const sequence: PathNode[] = [];
    const visited = new Set<string>();
    let currentNode = template.startNode;
    let cumulativeActivation = this.getSignalActivation(currentNode, signalMap);
    let cumulativeImpact = 0;
    let step = 0;

    // Add start node
    sequence.push({
      nodeId: currentNode,
      label: NODE_LABELS[currentNode] ?? currentNode,
      type: NODE_TYPES[currentNode] ?? 'oil',
      activation: round(cumulativeActivation),
      delta: 0,
      step,
    });
    visited.add(currentNode);

    // Walk the graph using exploration bias
    const maxSteps = 7;
    while (step < maxSteps) {
      const outEdges = FULL_GRAPH.filter(e => e.source === currentNode && !visited.has(e.target));
      if (outEdges.length === 0) break;

      // Select next edge based on exploration bias
      const nextEdge = this.selectEdge(outEdges, template.explorationBias, cumulativeActivation);
      if (!nextEdge) break;

      visited.add(nextEdge.target);
      step++;

      // Compute activation at this node
      const edgeEffect = nextEdge.weight * cumulativeActivation;
      const signalBoost = this.getSignalActivation(nextEdge.target, signalMap) * 0.3;
      const decay = 0.85; // activation decays per step
      cumulativeActivation = clamp(Math.abs(edgeEffect) * decay + signalBoost, 0, 1);
      cumulativeImpact += Math.abs(edgeEffect);

      sequence.push({
        nodeId: nextEdge.target,
        label: NODE_LABELS[nextEdge.target] ?? nextEdge.target,
        type: NODE_TYPES[nextEdge.target] ?? 'claims',
        activation: round(cumulativeActivation),
        delta: round(edgeEffect),
        step,
      });

      currentNode = nextEdge.target;
    }

    // Score the path
    const avgActivation = sequence.reduce((s, n) => s + n.activation, 0) / sequence.length;
    const pathLength = sequence.length;
    const hasIntervention = sequence.some(n => n.type === 'intervention' || n.type === 'stabilization');
    const hasNegativeDelta = sequence.some(n => n.delta < 0);

    // Probability: longer chains with strong weights are more probable in worst-case
    // Intervention paths have lower base probability unless signals are extreme
    let probability = avgActivation * 0.5 + (pathLength / maxSteps) * 0.3;
    if (template.explorationBias === 'worst_case') probability *= 1.2;
    if (template.explorationBias === 'intervention') probability *= 0.6;
    if (template.explorationBias === 'feedback') probability *= 0.7;
    if (hasIntervention) probability *= 0.75;

    // Impact: cumulative effect of all edges traversed
    const impactScore = clamp(cumulativeImpact / pathLength, 0, 1);

    // Risk: final activation level
    const riskScore = sequence[sequence.length - 1]?.activation ?? 0;

    // Decision based on risk score
    let decision: DecisionType;
    if (riskScore >= 0.65 || (impactScore >= 0.7 && !hasNegativeDelta)) {
      decision = 'ESCALATE';
    } else if (riskScore >= 0.35 || impactScore >= 0.4) {
      decision = 'REVIEW';
    } else {
      decision = 'APPROVE';
    }

    // Explanation
    const explanation = this.explainPath(template, sequence, probability, impactScore, riskScore, decision);

    return {
      id: `path_${this.scenario}_${idx}`,
      name: template.name,
      sequence,
      probability: round(probability),
      impactScore: round(impactScore),
      riskScore: round(riskScore),
      explanation,
      decision,
      color: template.color,
      isDominant: false,
      tags: template.tags,
    };
  }

  private selectEdge(
    edges: CausalEdge[],
    bias: PathTemplate['explorationBias'],
    currentActivation: number,
  ): CausalEdge | null {
    if (edges.length === 0) return null;

    // Score each edge based on bias
    const scored = edges.map(e => {
      let score = Math.abs(e.weight);

      switch (bias) {
        case 'worst_case':
          // Prefer high-weight propagation edges
          if (e.type === 'propagation') score *= 1.5;
          if (e.type === 'intervention') score *= 0.2;
          if (e.type === 'feedback' && e.weight < 0) score *= 0.3;
          break;
        case 'intervention':
          // Prefer intervention and negative-feedback edges
          if (e.type === 'intervention') score *= 2.0;
          if (e.type === 'feedback' && e.weight < 0) score *= 1.8;
          if (e.type === 'propagation') score *= 0.5;
          break;
        case 'feedback':
          // Prefer feedback loops
          if (e.type === 'feedback') score *= 2.0;
          if (e.type === 'intervention') score *= 1.3;
          break;
        case 'cascade':
          // Prefer lateral/secondary propagation
          if (e.type === 'propagation' && e.weight < 0.65) score *= 1.8;
          if (e.type === 'propagation' && e.weight >= 0.65) score *= 0.8;
          break;
        case 'mixed':
          // Balanced — slight preference for high-impact
          score *= (0.5 + currentActivation * 0.5);
          break;
      }

      return { edge: e, score };
    }).sort((a, b) => b.score - a.score);

    // Add some randomness to avoid deterministic paths
    const topN = scored.slice(0, Math.min(3, scored.length));
    const totalScore = topN.reduce((s, t) => s + t.score, 0);
    let rand = Math.random() * totalScore;
    for (const item of topN) {
      rand -= item.score;
      if (rand <= 0) return item.edge;
    }
    return topN[0]?.edge ?? null;
  }

  private getSignalActivation(nodeId: string, signalMap: Map<string, Signal>): number {
    const nodeType = NODE_TYPES[nodeId];
    if (!nodeType || nodeType === 'intervention' || nodeType === 'stabilization') return 0.3;

    const signal = signalMap.get(nodeType as string);
    if (!signal) return 0.3;

    const sevMap: Record<string, number> = { critical: 0.95, high: 0.7, moderate: 0.45, low: 0.2 };
    return sevMap[signal.severity] ?? 0.3;
  }

  private explainPath(
    template: PathTemplate,
    sequence: PathNode[],
    probability: number,
    impact: number,
    risk: number,
    decision: DecisionType,
  ): string {
    const chain = sequence.map(n => n.label).join(' → ');
    const pct = (probability * 100).toFixed(0);
    const riskPct = (risk * 100).toFixed(0);

    const biasDescriptions: Record<string, string> = {
      worst_case: 'unmitigated propagation through all causal channels',
      intervention: 'policy and regulatory intervention dampening the cascade',
      feedback: 'system feedback loops activating self-correction',
      cascade: 'secondary and lateral propagation channels amplifying effects',
      mixed: 'mixed propagation with partial mitigation',
    };

    const biasDesc = biasDescriptions[template.explorationBias] ?? 'standard propagation';
    return `${template.name}: ${chain}. Probability ${pct}% via ${biasDesc}. Terminal risk at ${riskPct}%, recommending ${decision}.`;
  }

  private generateReasoning(
    dominant: CausalPath | null,
    alternatives: CausalPath[],
    convergence: number,
    uncertainty: number,
    signals: Signal[],
  ): CognitiveReasoning {
    if (!dominant) {
      return {
        selectedBecause: 'No viable paths computed',
        alternativeOutcomes: [],
        keyDrivers: [],
        confidenceFactors: [],
        uncertaintyFactors: ['Insufficient data for path generation'],
        recommendation: 'Continue monitoring — insufficient data for cognitive analysis',
      };
    }

    const topSignals = [...signals]
      .sort((a, b) => {
        const sev: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
        return (sev[b.severity] ?? 0) - (sev[a.severity] ?? 0);
      })
      .slice(0, 3);

    const keyDrivers = topSignals.map(s => `${s.label} at ${s.value} ${s.unit} (${s.severity})`);

    const selectedBecause = [
      `"${dominant.name}" selected as dominant path with ${(dominant.probability * 100).toFixed(0)}% probability.`,
      `This path traces ${dominant.sequence.map(n => n.label).join(' → ')}.`,
      `Terminal risk score: ${(dominant.riskScore * 100).toFixed(0)}%.`,
      convergence > 0.7
        ? `High path convergence (${(convergence * 100).toFixed(0)}%) — most futures agree on ${dominant.decision}.`
        : `Low convergence (${(convergence * 100).toFixed(0)}%) — significant disagreement across futures.`,
    ].join(' ');

    const alternativeOutcomes = alternatives.slice(0, 3).map(p =>
      `${p.name}: ${(p.probability * 100).toFixed(0)}% probability → ${p.decision} (risk ${(p.riskScore * 100).toFixed(0)}%)`
    );

    const confidenceFactors: string[] = [];
    if (dominant.probability > 0.4) confidenceFactors.push('Dominant path has strong probability weight');
    if (convergence > 0.6) confidenceFactors.push('Multiple paths converge on same decision');
    if (topSignals.some(s => s.severity === 'critical')) confidenceFactors.push('Critical signals provide clear directional input');

    const uncertaintyFactors: string[] = [];
    if (uncertainty > 0.5) uncertaintyFactors.push('High spread across path outcomes');
    if (convergence < 0.5) uncertaintyFactors.push('Paths disagree on recommended action');
    if (alternatives.some(p => p.decision !== dominant.decision)) {
      uncertaintyFactors.push('Alternative paths suggest different decisions');
    }

    const escalateCount = [dominant, ...alternatives].filter(p => p.decision === 'ESCALATE').length;
    const total = 1 + alternatives.length;
    let recommendation: string;
    if (escalateCount === total) {
      recommendation = 'All futures converge on ESCALATE — immediate action required across all GCC markets.';
    } else if (escalateCount > total / 2) {
      recommendation = `Majority of futures (${escalateCount}/${total}) recommend ESCALATE. Proceed with escalation while monitoring intervention paths.`;
    } else if (dominant.decision === 'ESCALATE') {
      recommendation = 'Dominant path recommends ESCALATE, but alternative futures show mitigation potential. Consider targeted escalation.';
    } else if (dominant.decision === 'REVIEW') {
      recommendation = 'Dominant path recommends REVIEW. Monitor signal evolution and reassess if severity increases.';
    } else {
      recommendation = 'Current signals within acceptable range. Continue standard monitoring.';
    }

    return {
      selectedBecause,
      alternativeOutcomes,
      keyDrivers,
      confidenceFactors,
      uncertaintyFactors,
      recommendation,
    };
  }

  getCachedState(): CognitiveState | null {
    return this.cachedState;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
