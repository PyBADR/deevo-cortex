// ============================================
// DEEVO CORTEX V2 - Integration Type Contracts
// ============================================

// --- INPUT SCHEMAS ---

export interface SignalSchema {
  oil_price: number;           // USD per barrel
  inflation: number;           // percentage (e.g., 3.1 = 3.1%)
  claims_rate: number;         // ratio 0.0 - 1.0
  fraud_index: number;         // ratio 0.0 - 1.0
  gdp_growth?: number;         // optional, percentage
  unemployment?: number;       // optional, percentage
  timestamp?: string;          // ISO 8601
}

export interface ScenarioOverride {
  name: string;                // e.g., "oil_shock", "recession", "fraud_spike"
  adjustments: Partial<SignalSchema>;
}

export interface SimulateRequest {
  signals: SignalSchema;
  scenario_override?: ScenarioOverride;
}

// --- OUTPUT SCHEMAS ---

export type DecisionType = 'APPROVE' | 'REVIEW' | 'ESCALATE';

export interface PipelineStep {
  step: string;
  status: 'ok' | 'error';
  result?: string | number;
  ms: number;
}

export interface DecisionTraceSchema {
  pipeline_id: string;
  steps: PipelineStep[];
  total_ms: number;
}

export interface SimulationResultSchema {
  scenario_detected: string;
  iterations?: number;
  risk_distribution?: {
    min: number;
    max: number;
    mean: number;
    p95: number;
  };
}

export interface DecisionSchema {
  decision: DecisionType;
  confidence: number;          // 0.0 - 1.0
  risk_score: number;          // 0.0 - 1.0
  trace: DecisionTraceSchema;
  simulation?: SimulationResultSchema;
}

export interface ErrorResponse {
  error: string;
  code: 'INVALID_SIGNALS' | 'SIMULATION_FAILED' | 'ENGINE_ERROR';
}
