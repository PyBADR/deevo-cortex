// ============================================================================
// DEEVO Claims Decision Control Room — Type System
// Production-grade insurance claims decision intelligence types.
// Every type maps to a specific panel in the control room.
// ============================================================================

export type ClaimStatus = 'OPEN' | 'UNDER_REVIEW' | 'PENDING_DOCS' | 'ESCALATED' | 'APPROVED' | 'REJECTED';
export type ClaimPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type LossType = 'motor' | 'property' | 'health' | 'marine' | 'liability' | 'engineering';
export type FraudIndicator = 'none' | 'low' | 'medium' | 'high' | 'confirmed';
export type AIDecision = 'APPROVE' | 'REJECT' | 'ESCALATE' | 'REQUEST_DOCS';
export type Severity = 'critical' | 'high' | 'moderate' | 'low';
export type EntityType = 'claimant' | 'provider' | 'policy' | 'adjuster' | 'witness' | 'broker' | 'reinsurer';

// ---------------------------------------------------------------------------
// Core Claim
// ---------------------------------------------------------------------------
export interface Claim {
  id: string;               // CLM-2026-XXXXX
  policyNumber: string;     // POL-GCC-XXXX
  claimant: string;
  claimantId: string;
  insuredName: string;
  lossType: LossType;
  lossDate: number;         // unix ms
  reportDate: number;
  claimAmount: number;      // requested USD
  reserveAmount: number;    // reserved USD
  settledAmount: number;    // settled USD (0 if open)
  currency: string;
  status: ClaimStatus;
  priority: ClaimPriority;
  slaDeadline: number;      // unix ms
  assignedAdjuster: string;
  country: string;           // GCC country code
  region: string;
  lossDescription: string;
  policyType: string;
  policyStartDate: number;
  policyEndDate: number;
  coverageLimit: number;
  deductible: number;
}

// ---------------------------------------------------------------------------
// Risk Score Breakdown
// ---------------------------------------------------------------------------
export interface RiskFactor {
  id: string;
  label: string;
  score: number;           // 0–100
  weight: number;          // 0–1
  trend: 'up' | 'down' | 'stable';
  category: 'fraud' | 'severity' | 'complexity' | 'compliance' | 'financial';
}

export interface RiskAssessment {
  overallScore: number;    // 0–100
  confidence: number;      // 0–1
  factors: RiskFactor[];
  fraudIndicator: FraudIndicator;
  fraudProbability: number; // 0–1
  anomalyCount: number;
  historicalComparison: number; // percentile vs similar claims
}

// ---------------------------------------------------------------------------
// Entity Relationship Graph
// ---------------------------------------------------------------------------
export interface ClaimEntity {
  id: string;
  type: EntityType;
  name: string;
  role: string;
  riskScore: number;       // 0–1
  flagged: boolean;
  metadata: Record<string, string | number>;
}

export interface EntityLink {
  source: string;
  target: string;
  relationship: string;    // "filed_by", "treated_at", "insured_under", "adjusted_by", etc.
  strength: number;        // 0–1
  suspicious: boolean;
}

export interface EntityGraph {
  entities: ClaimEntity[];
  links: EntityLink[];
}

// ---------------------------------------------------------------------------
// Time Series / Anomaly Detection
// ---------------------------------------------------------------------------
export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  predicted: number;
  anomaly: boolean;
  label?: string;
}

export interface AnomalyAlert {
  id: string;
  type: string;
  severity: Severity;
  description: string;
  detectedAt: number;
  metric: string;
  actualValue: number;
  expectedValue: number;
  deviation: number;       // standard deviations
}

// ---------------------------------------------------------------------------
// AI Recommendation
// ---------------------------------------------------------------------------
export interface AIRecommendation {
  decision: AIDecision;
  confidence: number;      // 0–1
  reasoning: string[];
  financialImpact: {
    approvalCost: number;
    rejectionSaving: number;
    litigationRisk: number;  // 0–1
    reinsuranceRecovery: number;
  };
  similarClaims: {
    total: number;
    approvedRate: number;
    avgSettlement: number;
    avgDuration: number;    // days
  };
  requiredDocuments?: string[];
  escalationReason?: string;
}

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------
export interface AuditEntry {
  id: string;
  timestamp: number;
  actor: string;           // user or "SYSTEM" or "AI_ENGINE"
  action: string;
  detail: string;
  hash: string;            // SHA-256 audit hash
  category: 'decision' | 'document' | 'assignment' | 'status' | 'note' | 'system';
}

// ---------------------------------------------------------------------------
// Supporting Evidence
// ---------------------------------------------------------------------------
export interface Evidence {
  id: string;
  type: 'document' | 'photo' | 'report' | 'statement' | 'medical' | 'police';
  label: string;
  status: 'received' | 'pending' | 'verified' | 'rejected';
  uploadedAt: number;
  verifiedBy?: string;
}

// ---------------------------------------------------------------------------
// Location / Geo
// ---------------------------------------------------------------------------
export interface IncidentLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  riskZone: 'low' | 'medium' | 'high';
  nearbyClaimsCount: number;
}

// ---------------------------------------------------------------------------
// SLA Tracking
// ---------------------------------------------------------------------------
export interface SLAStatus {
  targetHours: number;
  elapsedHours: number;
  remainingHours: number;
  status: 'on_track' | 'at_risk' | 'breached';
  nextMilestone: string;
}

// ---------------------------------------------------------------------------
// Complete Claims State
// ---------------------------------------------------------------------------
export interface ClaimsState {
  claim: Claim;
  risk: RiskAssessment;
  entityGraph: EntityGraph;
  timeSeries: TimeSeriesPoint[];
  anomalies: AnomalyAlert[];
  recommendation: AIRecommendation;
  auditTrail: AuditEntry[];
  evidence: Evidence[];
  location: IncidentLocation;
  sla: SLAStatus;
}
