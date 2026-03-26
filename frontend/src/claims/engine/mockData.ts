// ============================================================================
// DEEVO Claims — Mock Data Generator
// Production-realistic insurance claims data for the Decision Control Room.
// All values calibrated to GCC insurance market norms.
// ============================================================================

import type {
  ClaimsState, Claim, RiskAssessment, RiskFactor, EntityGraph,
  TimeSeriesPoint, AnomalyAlert, AIRecommendation, AuditEntry,
  Evidence, IncidentLocation, SLAStatus,
} from './types';

// ---------------------------------------------------------------------------
// Deterministic seed-based random
// ---------------------------------------------------------------------------
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function generateHash(): string {
  const chars = 'abcdef0123456789';
  let h = '';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(seededRandom() * chars.length)];
  return h;
}

// ---------------------------------------------------------------------------
// Core Claim
// ---------------------------------------------------------------------------
const NOW = Date.now();
const DAY = 86400000;

const claim: Claim = {
  id: 'CLM-2026-48721',
  policyNumber: 'POL-GCC-SA-7291',
  claimant: 'Abdullah Al-Rashid',
  claimantId: 'CID-SA-90412',
  insuredName: 'Al-Rashid Trading Co.',
  lossType: 'property',
  lossDate: NOW - 12 * DAY,
  reportDate: NOW - 10 * DAY,
  claimAmount: 2_450_000,
  reserveAmount: 1_800_000,
  settledAmount: 0,
  currency: 'SAR',
  status: 'UNDER_REVIEW',
  priority: 'P1',
  slaDeadline: NOW + 2 * DAY,
  assignedAdjuster: 'Fatima Al-Dosari',
  country: 'SA',
  region: 'Riyadh',
  lossDescription: 'Warehouse fire — total loss of inventory and structural damage to facility B-7.',
  policyType: 'Commercial Property',
  policyStartDate: NOW - 180 * DAY,
  policyEndDate: NOW + 185 * DAY,
  coverageLimit: 5_000_000,
  deductible: 50_000,
};

// ---------------------------------------------------------------------------
// Risk Assessment
// ---------------------------------------------------------------------------
const riskFactors: RiskFactor[] = [
  { id: 'rf-1', label: 'Claim Amount vs. Policy Average', score: 78, weight: 0.20, trend: 'up', category: 'financial' },
  { id: 'rf-2', label: 'Reporting Delay (Days)', score: 42, weight: 0.10, trend: 'stable', category: 'complexity' },
  { id: 'rf-3', label: 'Provider Network Deviation', score: 65, weight: 0.15, trend: 'up', category: 'fraud' },
  { id: 'rf-4', label: 'Claimant History Score', score: 55, weight: 0.15, trend: 'stable', category: 'fraud' },
  { id: 'rf-5', label: 'Document Consistency', score: 38, weight: 0.10, trend: 'down', category: 'compliance' },
  { id: 'rf-6', label: 'Geographic Risk Zone', score: 71, weight: 0.10, trend: 'up', category: 'severity' },
  { id: 'rf-7', label: 'Loss Event Complexity', score: 82, weight: 0.12, trend: 'up', category: 'complexity' },
  { id: 'rf-8', label: 'Regulatory Exposure (PDPL)', score: 45, weight: 0.08, trend: 'stable', category: 'compliance' },
];

const risk: RiskAssessment = {
  overallScore: 68,
  confidence: 0.87,
  factors: riskFactors,
  fraudIndicator: 'medium',
  fraudProbability: 0.34,
  anomalyCount: 3,
  historicalComparison: 82,
};

// ---------------------------------------------------------------------------
// Entity Graph
// ---------------------------------------------------------------------------
const entityGraph: EntityGraph = {
  entities: [
    { id: 'e-1', type: 'claimant', name: 'Abdullah Al-Rashid', role: 'Policyholder / Claimant', riskScore: 0.35, flagged: false, metadata: { claims_history: 3, years_insured: 4 } },
    { id: 'e-2', type: 'provider', name: 'Saudi Fire Restoration LLC', role: 'Loss Assessor', riskScore: 0.62, flagged: true, metadata: { assessments_ytd: 47, avg_payout: 1_200_000 } },
    { id: 'e-3', type: 'policy', name: 'POL-GCC-SA-7291', role: 'Commercial Property Policy', riskScore: 0.28, flagged: false, metadata: { premium: 125_000, coverage: 5_000_000 } },
    { id: 'e-4', type: 'adjuster', name: 'Fatima Al-Dosari', role: 'Senior Claims Adjuster', riskScore: 0.08, flagged: false, metadata: { cases_active: 12, avg_resolution_days: 18 } },
    { id: 'e-5', type: 'witness', name: 'Mohammed K. Hasan', role: 'Security Guard — Facility B', riskScore: 0.45, flagged: true, metadata: { statement_inconsistencies: 2 } },
    { id: 'e-6', type: 'broker', name: 'GCC Insurance Partners', role: 'Placing Broker', riskScore: 0.15, flagged: false, metadata: { portfolio_size: 340, loss_ratio: 0.62 } },
    { id: 'e-7', type: 'reinsurer', name: 'Swiss Re (Treaty)', role: 'Reinsurance Coverage', riskScore: 0.05, flagged: false, metadata: { treaty_retention: 500_000, treaty_limit: 4_500_000 } },
  ],
  links: [
    { source: 'e-1', target: 'e-3', relationship: 'insured_under', strength: 1.0, suspicious: false },
    { source: 'e-1', target: 'e-2', relationship: 'engaged_assessor', strength: 0.7, suspicious: true },
    { source: 'e-2', target: 'e-5', relationship: 'referenced_in_statement', strength: 0.5, suspicious: true },
    { source: 'e-3', target: 'e-6', relationship: 'placed_by', strength: 0.9, suspicious: false },
    { source: 'e-3', target: 'e-7', relationship: 'reinsured_by', strength: 0.8, suspicious: false },
    { source: 'e-4', target: 'e-1', relationship: 'assigned_to', strength: 1.0, suspicious: false },
    { source: 'e-4', target: 'e-2', relationship: 'reviewing_assessment', strength: 0.6, suspicious: false },
  ],
};

// ---------------------------------------------------------------------------
// Time Series (claim amount trends for similar property claims, 30 days)
// ---------------------------------------------------------------------------
function generateTimeSeries(): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const baseValue = 1_800_000;
  for (let i = 0; i < 30; i++) {
    const t = NOW - (30 - i) * DAY;
    const noise = (seededRandom() - 0.5) * 400_000;
    const trend = i * 15_000;
    const value = baseValue + trend + noise;
    const predicted = baseValue + trend;
    const deviation = Math.abs(value - predicted) / 200_000;
    points.push({
      timestamp: t,
      value: Math.round(value),
      predicted: Math.round(predicted),
      anomaly: deviation > 1.5,
      label: i === 18 ? 'Loss Event' : i === 20 ? 'Claim Filed' : undefined,
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Anomaly Alerts
// ---------------------------------------------------------------------------
const anomalies: AnomalyAlert[] = [
  {
    id: 'an-1', type: 'CLAIM_AMOUNT', severity: 'high',
    description: 'Claim amount exceeds 92nd percentile for similar property losses in Riyadh region.',
    detectedAt: NOW - 8 * DAY, metric: 'claim_amount',
    actualValue: 2_450_000, expectedValue: 1_600_000, deviation: 2.4,
  },
  {
    id: 'an-2', type: 'PROVIDER_PATTERN', severity: 'moderate',
    description: 'Loss assessor Saudi Fire Restoration LLC has 3x average engagement rate with this claimant.',
    detectedAt: NOW - 6 * DAY, metric: 'provider_frequency',
    actualValue: 3, expectedValue: 1, deviation: 1.8,
  },
  {
    id: 'an-3', type: 'STATEMENT_MISMATCH', severity: 'high',
    description: 'Witness statement timeline conflicts with security camera metadata by 47 minutes.',
    detectedAt: NOW - 4 * DAY, metric: 'statement_consistency',
    actualValue: 47, expectedValue: 0, deviation: 3.1,
  },
];

// ---------------------------------------------------------------------------
// AI Recommendation
// ---------------------------------------------------------------------------
const recommendation: AIRecommendation = {
  decision: 'ESCALATE',
  confidence: 0.82,
  reasoning: [
    'Claim amount significantly above regional average for commercial property losses (92nd percentile)',
    'Loss assessor (Saudi Fire Restoration LLC) flagged for elevated engagement frequency with claimant',
    'Witness statement contains 47-minute timeline discrepancy vs. facility security logs',
    'Policy is 6 months old — within first-year heightened scrutiny window',
    'Document consistency score (38/100) below threshold for auto-approval',
    'Reinsurance treaty retention of SAR 500K triggers mandatory senior review',
  ],
  financialImpact: {
    approvalCost: 2_450_000,
    rejectionSaving: 2_450_000,
    litigationRisk: 0.23,
    reinsuranceRecovery: 1_950_000,
  },
  similarClaims: {
    total: 142,
    approvedRate: 0.67,
    avgSettlement: 1_420_000,
    avgDuration: 32,
  },
  escalationReason: 'Multiple fraud indicators + reinsurance treaty threshold exceeded',
};

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------
const auditTrail: AuditEntry[] = [
  { id: 'au-1', timestamp: NOW - 10 * DAY, actor: 'SYSTEM', action: 'CLAIM_REGISTERED', detail: 'Claim CLM-2026-48721 registered via broker portal', hash: generateHash(), category: 'status' },
  { id: 'au-2', timestamp: NOW - 10 * DAY, actor: 'SYSTEM', action: 'AUTO_TRIAGE', detail: 'Auto-triaged as P1 — amount exceeds SAR 2M threshold', hash: generateHash(), category: 'system' },
  { id: 'au-3', timestamp: NOW - 9 * DAY, actor: 'AI_ENGINE', action: 'RISK_SCORED', detail: 'Initial risk score: 68/100 (confidence: 0.87)', hash: generateHash(), category: 'decision' },
  { id: 'au-4', timestamp: NOW - 9 * DAY, actor: 'SYSTEM', action: 'ASSIGNED', detail: 'Assigned to Fatima Al-Dosari (Senior Claims Adjuster)', hash: generateHash(), category: 'assignment' },
  { id: 'au-5', timestamp: NOW - 8 * DAY, actor: 'AI_ENGINE', action: 'ANOMALY_DETECTED', detail: 'Claim amount anomaly: 92nd percentile for region', hash: generateHash(), category: 'system' },
  { id: 'au-6', timestamp: NOW - 7 * DAY, actor: 'Fatima Al-Dosari', action: 'DOC_REQUESTED', detail: 'Requested: fire investigation report, inventory manifest', hash: generateHash(), category: 'document' },
  { id: 'au-7', timestamp: NOW - 6 * DAY, actor: 'AI_ENGINE', action: 'PATTERN_FLAGGED', detail: 'Provider frequency anomaly detected for Saudi Fire Restoration LLC', hash: generateHash(), category: 'system' },
  { id: 'au-8', timestamp: NOW - 5 * DAY, actor: 'Abdullah Al-Rashid', action: 'DOC_UPLOADED', detail: 'Uploaded: fire_investigation_report.pdf (12 pages)', hash: generateHash(), category: 'document' },
  { id: 'au-9', timestamp: NOW - 4 * DAY, actor: 'AI_ENGINE', action: 'ANOMALY_DETECTED', detail: 'Witness statement timeline mismatch: 47 min discrepancy', hash: generateHash(), category: 'system' },
  { id: 'au-10', timestamp: NOW - 3 * DAY, actor: 'Fatima Al-Dosari', action: 'NOTE_ADDED', detail: 'Scheduling on-site inspection for facility B-7', hash: generateHash(), category: 'note' },
  { id: 'au-11', timestamp: NOW - 1 * DAY, actor: 'AI_ENGINE', action: 'RECOMMENDATION', detail: 'AI recommends ESCALATE — multiple fraud indicators + reinsurance threshold', hash: generateHash(), category: 'decision' },
];

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------
const evidence: Evidence[] = [
  { id: 'ev-1', type: 'document', label: 'Policy Certificate', status: 'verified', uploadedAt: NOW - 10 * DAY, verifiedBy: 'SYSTEM' },
  { id: 'ev-2', type: 'report', label: 'Fire Investigation Report', status: 'received', uploadedAt: NOW - 5 * DAY },
  { id: 'ev-3', type: 'photo', label: 'Damage Photos (42 images)', status: 'verified', uploadedAt: NOW - 8 * DAY, verifiedBy: 'Fatima Al-Dosari' },
  { id: 'ev-4', type: 'statement', label: 'Claimant Statement', status: 'verified', uploadedAt: NOW - 9 * DAY, verifiedBy: 'Fatima Al-Dosari' },
  { id: 'ev-5', type: 'statement', label: 'Witness Statement (M. Hasan)', status: 'received', uploadedAt: NOW - 7 * DAY },
  { id: 'ev-6', type: 'document', label: 'Inventory Manifest', status: 'pending', uploadedAt: 0 },
  { id: 'ev-7', type: 'police', label: 'Police Report', status: 'pending', uploadedAt: 0 },
  { id: 'ev-8', type: 'medical', label: 'Injury Assessment (2 workers)', status: 'received', uploadedAt: NOW - 6 * DAY },
];

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
const location: IncidentLocation = {
  lat: 24.7136,
  lng: 46.6753,
  address: 'Industrial Area, Block 7, Warehouse B-7',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  riskZone: 'high',
  nearbyClaimsCount: 8,
};

// ---------------------------------------------------------------------------
// SLA
// ---------------------------------------------------------------------------
const sla: SLAStatus = {
  targetHours: 288, // 12 days
  elapsedHours: 240, // 10 days
  remainingHours: 48,
  status: 'at_risk',
  nextMilestone: 'Senior Review Deadline',
};

// ---------------------------------------------------------------------------
// Export complete state
// ---------------------------------------------------------------------------
export function getClaimsState(): ClaimsState {
  _seed = 42; // reset for deterministic output
  return {
    claim,
    risk,
    entityGraph,
    timeSeries: generateTimeSeries(),
    anomalies,
    recommendation,
    auditTrail,
    evidence,
    location,
    sla,
  };
}
