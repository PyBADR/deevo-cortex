// ============================================================================
// DEEVO Monitor — Core Type System
// Every type is purpose-built for a live decision intelligence engine.
// ============================================================================

export type CountryCode = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM';

export type SignalType =
  | 'oil'
  | 'inflation'
  | 'claims'
  | 'fraud'
  | 'supply_chain'
  | 'interest_rates'
  | 'currency'
  | 'regulatory';

export type LayerId =
  | 'oil'
  | 'inflation'
  | 'claims'
  | 'fraud'
  | 'supply_chain'
  | 'interest_rates';

export type ScenarioId = 'oil_spike' | 'fraud_ring' | 'supply_disruption';

export type DecisionType = 'APPROVE' | 'REVIEW' | 'ESCALATE';

export type Severity = 'critical' | 'high' | 'moderate' | 'low';

// ---------------------------------------------------------------------------
// Signal — a single data point from the real world
// ---------------------------------------------------------------------------
export interface Signal {
  id: string;
  type: SignalType;
  label: string;
  value: number;
  previousValue: number;
  change: number;       // percentage change
  unit: string;
  timestamp: number;
  weight: number;       // 0–1, importance in risk calc
  severity: Severity;
  sparkline: number[];  // last 20 ticks
}

// ---------------------------------------------------------------------------
// Graph — causal network
// ---------------------------------------------------------------------------
export interface GraphNode {
  id: string;
  type: SignalType;
  label: string;
  value: number;         // normalized 0–1
  intensity: number;     // visual intensity 0–1
  x: number;
  y: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;        // 0–1 propagation strength
  active: boolean;
  label: string;
}

export interface CausalGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ---------------------------------------------------------------------------
// Country — GCC intelligence node
// ---------------------------------------------------------------------------
export interface CountryIntel {
  code: CountryCode;
  name: string;
  flag: string;
  riskScore: number;
  exposure: number;
  gdp: number;           // USD billions
  insuranceGwp: number;  // USD billions
  oilDependency: number; // 0–1
  claimsRatio: number;
  fraudIndex: number;
  alerts: string[];
}

// ---------------------------------------------------------------------------
// Decision — system output
// ---------------------------------------------------------------------------
export interface Decision {
  type: DecisionType;
  riskScore: number;     // 0–1
  confidence: number;    // 0–1
  reasoning: string;
  timestamp: number;
  drivers: string[];
}

// ---------------------------------------------------------------------------
// AI Brief
// ---------------------------------------------------------------------------
export interface AIBrief {
  headline: string;
  summary: string;
  drivers: string[];
  impact: string;
  recommendation: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export interface Alert {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  timestamp: number;
  source: SignalType;
  dismissed: boolean;
}

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------
export interface Scenario {
  id: ScenarioId;
  name: string;
  description: string;
  icon: string;
  signalOverrides: Partial<Record<SignalType, { value: number; change: number }>>;
  expectedDecision: DecisionType;
}

// ---------------------------------------------------------------------------
// Layer
// ---------------------------------------------------------------------------
export interface Layer {
  id: LayerId;
  label: string;
  color: string;
  enabled: boolean;
  icon: string;
}

// ---------------------------------------------------------------------------
// Intel Block
// ---------------------------------------------------------------------------
export interface IntelBlock {
  id: string;
  title: string;
  type: SignalType;
  value: number;
  change: number;
  unit: string;
  severity: Severity;
  detail: string;
  sparkline: number[];
}

// ---------------------------------------------------------------------------
// SYSTEM STATE — the single source of truth
// ---------------------------------------------------------------------------
export interface SystemState {
  // Core
  activeScenario: ScenarioId;
  activeLayers: LayerId[];
  selectedCountry: CountryCode | null;
  selectedEdge: { source: string; target: string } | null;

  // Data
  signals: Signal[];
  graph: CausalGraph;
  decision: Decision;
  aiBrief: AIBrief;
  alerts: Alert[];
  countries: CountryIntel[];
  blocks: IntelBlock[];

  // Meta
  isLive: boolean;
  isDemo: boolean;
  lastUpdate: number;
  tickCount: number;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export type MonitorAction =
  | { type: 'SET_SCENARIO'; payload: ScenarioId }
  | { type: 'TOGGLE_LAYER'; payload: LayerId }
  | { type: 'SELECT_COUNTRY'; payload: CountryCode | null }
  | { type: 'SELECT_EDGE'; payload: { source: string; target: string } | null }
  | { type: 'TICK'; payload: { signals: Signal[]; graph: CausalGraph; decision: Decision; aiBrief: AIBrief; alerts: Alert[]; countries: CountryIntel[]; blocks: IntelBlock[] } }
  | { type: 'TOGGLE_LIVE' }
  | { type: 'SET_DEMO'; payload: boolean }
  | { type: 'DISMISS_ALERT'; payload: string };
