// ============================================================================
// DEEVO Claims — Demo Data (Calibrated for investor/client walkthrough)
// Motor claim · $12,400 · Risk 78 · REJECT 92% · Flagged repair shop
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
// Core Claim — Motor / $12,400
// ---------------------------------------------------------------------------
const NOW = Date.now();
const DAY = 86400000;

const claim: Claim = {
  id: 'CLM-2026-09182',
  policyNumber: 'POL-GCC-KW-4417',
  claimant: 'Nasser Al-Mutairi',
  claimantId: 'CID-KW-30821',
  insuredName: 'Nasser Al-Mutairi',
  lossType: 'motor',
  lossDate: NOW - 6 * DAY,
  reportDate: NOW - 5 * DAY,
  claimAmount: 12_400,
  reserveAmount: 10_000,
  settledAmount: 0,
  currency: 'USD',
  status: 'UNDER_REVIEW',
  priority: 'P2',
  slaDeadline: NOW + 3 * DAY,
  assignedAdjuster: 'Fatima Al-Dosari',
  country: 'KW',
  region: 'Kuwait City',
  lossDescription: 'Rear-end collision on Fifth Ring Road — bumper, tail lights, and rear quarter panel damage.',
  policyType: 'Comprehensive Motor',
  policyStartDate: NOW - 90 * DAY,
  policyEndDate: NOW + 275 * DAY,
  coverageLimit: 50_000,
  deductible: 500,
};

// ---------------------------------------------------------------------------
// Risk Assessment — Score: 78 (high)
// ---------------------------------------------------------------------------
const riskFactors: RiskFactor[] = [
  { id: 'rf-1', label: 'Claim Amount Anomaly', score: 84, weight: 0.20, trend: 'up', category: 'financial' },
  { id: 'rf-2', label: 'Duplicate Repair Pattern', score: 88, weight: 0.18, trend: 'up', category: 'fraud' },
  { id: 'rf-3', label: 'Linked Fraud Network', score: 76, weight: 0.16, trend: 'up', category: 'fraud' },
  { id: 'rf-4', label: 'Claim Frequency Spike', score: 82, weight: 0.14, trend: 'up', category: 'fraud' },
  { id: 'rf-5', label: 'Behavioral Deviation', score: 71, weight: 0.12, trend: 'up', category: 'complexity' },
  { id: 'rf-6', label: 'Provider Risk Index', score: 69, weight: 0.10, trend: 'stable', category: 'severity' },
  { id: 'rf-7', label: 'Document Consistency', score: 42, weight: 0.05, trend: 'down', category: 'compliance' },
  { id: 'rf-8', label: 'Geographic Risk Zone', score: 55, weight: 0.05, trend: 'stable', category: 'severity' },
];

const risk: RiskAssessment = {
  overallScore: 78,
  confidence: 0.92,
  factors: riskFactors,
  fraudIndicator: 'high',
  fraudProbability: 0.74,
  anomalyCount: 3,
  historicalComparison: 91,
};

// ---------------------------------------------------------------------------
// Entity Graph — Flagged repair shop + suspicious previous claim
// ---------------------------------------------------------------------------
const entityGraph: EntityGraph = {
  entities: [
    { id: 'e-1', type: 'claimant', name: 'Nasser Al-Mutairi', role: 'Policyholder / Claimant', riskScore: 0.58, flagged: false, metadata: { claims_12mo: 3, years_insured: 1 } },
    { id: 'e-2', type: 'provider', name: 'Quick Fix Auto Workshop', role: 'Repair Shop', riskScore: 0.81, flagged: true, metadata: { fraud_flags: 4, claims_routed: 23 } },
    { id: 'e-3', type: 'policy', name: 'CLM-2026-07455', role: 'Previous Claim (3 mo ago)', riskScore: 0.72, flagged: true, metadata: { amount: 8_900, status: 'SUSPICIOUS' } },
    { id: 'e-4', type: 'adjuster', name: 'Fatima Al-Dosari', role: 'Claims Adjuster', riskScore: 0.05, flagged: false, metadata: { cases_active: 14 } },
    { id: 'e-5', type: 'policy', name: 'POL-GCC-KW-4417', role: 'Current Motor Policy', riskScore: 0.22, flagged: false, metadata: { premium: 1_800, coverage: 50_000 } },
    { id: 'e-6', type: 'witness', name: 'Shared Phone: +965-XXX-4412', role: 'Contact Link', riskScore: 0.68, flagged: true, metadata: { linked_entities: 3 } },
  ],
  links: [
    { source: 'e-1', target: 'e-2', relationship: 'repair_at', strength: 0.9, suspicious: true },
    { source: 'e-1', target: 'e-3', relationship: 'previous_claim', strength: 0.8, suspicious: true },
    { source: 'e-1', target: 'e-5', relationship: 'insured_under', strength: 1.0, suspicious: false },
    { source: 'e-4', target: 'e-1', relationship: 'assigned_to', strength: 1.0, suspicious: false },
    { source: 'e-2', target: 'e-6', relationship: 'shared_contact', strength: 0.7, suspicious: true },
    { source: 'e-1', target: 'e-6', relationship: 'shared_contact', strength: 0.6, suspicious: true },
  ],
};

// ---------------------------------------------------------------------------
// Time Series — Claim frequency for this claimant (12 months)
// ---------------------------------------------------------------------------
function generateTimeSeries(): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const baseValue = 3_200;
  for (let i = 0; i < 30; i++) {
    const t = NOW - (30 - i) * DAY;
    const noise = (seededRandom() - 0.5) * 2_000;
    const trend = i * 120;
    const value = baseValue + trend + noise;
    const predicted = baseValue + trend;
    const deviation = Math.abs(value - predicted) / 1_000;
    points.push({
      timestamp: t,
      value: Math.round(value),
      predicted: Math.round(predicted),
      anomaly: deviation > 1.5,
      label: i === 20 ? 'Previous Claim' : i === 26 ? 'This Claim' : undefined,
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
    description: 'Claim amount $12,400 exceeds 91st percentile for motor claims in Kuwait City.',
    detectedAt: NOW - 4 * DAY, metric: 'claim_amount',
    actualValue: 12_400, expectedValue: 4_800, deviation: 2.6,
  },
  {
    id: 'an-2', type: 'CLAIM_FREQUENCY', severity: 'high',
    description: '3 claims in 12 months — 4.2x the portfolio average for this segment.',
    detectedAt: NOW - 3 * DAY, metric: 'claim_frequency',
    actualValue: 3, expectedValue: 0.7, deviation: 3.1,
  },
  {
    id: 'an-3', type: 'BEHAVIORAL_DEVIATION', severity: 'moderate',
    description: 'Same repair shop used across all 3 claims — workshop flagged in fraud network.',
    detectedAt: NOW - 2 * DAY, metric: 'provider_pattern',
    actualValue: 3, expectedValue: 0, deviation: 2.1,
  },
];

// ---------------------------------------------------------------------------
// AI Recommendation — REJECT · 92% confidence · $8,200 saved
// ---------------------------------------------------------------------------
const recommendation: AIRecommendation = {
  decision: 'REJECT',
  confidence: 0.92,
  reasoning: [
    'Duplicate repair pattern detected — same workshop across all 3 claims in 12 months',
    'Linked fraud network — repair shop shares phone contact with claimant',
    'Claim frequency spike — 4.2x portfolio average, 91st percentile claim amount',
    'Behavioral deviation — all claims filed within 48 hours of incident, identical damage pattern',
  ],
  financialImpact: {
    approvalCost: 12_400,
    rejectionSaving: 8_200,
    litigationRisk: 0.12,
    reinsuranceRecovery: 0,
  },
  similarClaims: {
    total: 87,
    approvedRate: 0.31,
    avgSettlement: 4_200,
    avgDuration: 14,
  },
};

// ---------------------------------------------------------------------------
// Audit Trail
// ---------------------------------------------------------------------------
const auditTrail: AuditEntry[] = [
  { id: 'au-1', timestamp: NOW - 5 * DAY, actor: 'SYSTEM', action: 'CLAIM_REGISTERED', detail: 'Claim CLM-2026-09182 registered via mobile app', hash: generateHash(), category: 'status' },
  { id: 'au-2', timestamp: NOW - 5 * DAY, actor: 'SYSTEM', action: 'AUTO_TRIAGE', detail: 'Auto-triaged as P2 — motor claim, elevated frequency flag', hash: generateHash(), category: 'system' },
  { id: 'au-3', timestamp: NOW - 4 * DAY, actor: 'AI_ENGINE', action: 'ANOMALY_DETECTED', detail: 'Claim amount anomaly: 91st percentile for Kuwait motor', hash: generateHash(), category: 'system' },
  { id: 'au-4', timestamp: NOW - 4 * DAY, actor: 'AI_ENGINE', action: 'RISK_SCORED', detail: 'Risk score: 78/100 (confidence: 0.92) — HIGH', hash: generateHash(), category: 'decision' },
  { id: 'au-5', timestamp: NOW - 4 * DAY, actor: 'SYSTEM', action: 'ASSIGNED', detail: 'Assigned to Fatima Al-Dosari (Claims Adjuster)', hash: generateHash(), category: 'assignment' },
  { id: 'au-6', timestamp: NOW - 3 * DAY, actor: 'AI_ENGINE', action: 'FRAUD_RULE_TRIGGERED', detail: 'Rule: FREQ_SPIKE — 3 claims in 12mo from same claimant', hash: generateHash(), category: 'system' },
  { id: 'au-7', timestamp: NOW - 3 * DAY, actor: 'AI_ENGINE', action: 'NETWORK_FLAGGED', detail: 'Shared phone link between claimant and Quick Fix Auto Workshop', hash: generateHash(), category: 'system' },
  { id: 'au-8', timestamp: NOW - 2 * DAY, actor: 'Fatima Al-Dosari', action: 'REVIEWED', detail: 'Manual review — confirms workshop flagged in 4 prior fraud cases', hash: generateHash(), category: 'decision' },
  { id: 'au-9', timestamp: NOW - 1 * DAY, actor: 'AI_ENGINE', action: 'RECOMMENDATION', detail: 'AI recommends REJECT — 92% confidence, $8,200 estimated saving', hash: generateHash(), category: 'decision' },
];

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------
const evidence: Evidence[] = [
  { id: 'ev-1', type: 'document', label: 'Motor Policy Certificate', status: 'verified', uploadedAt: NOW - 5 * DAY, verifiedBy: 'SYSTEM' },
  { id: 'ev-2', type: 'photo', label: 'Damage Photos (12 images)', status: 'verified', uploadedAt: NOW - 5 * DAY, verifiedBy: 'Fatima Al-Dosari' },
  { id: 'ev-3', type: 'report', label: 'Workshop Repair Estimate', status: 'received', uploadedAt: NOW - 4 * DAY },
  { id: 'ev-4', type: 'police', label: 'Traffic Incident Report', status: 'verified', uploadedAt: NOW - 4 * DAY, verifiedBy: 'SYSTEM' },
  { id: 'ev-5', type: 'statement', label: 'Claimant Statement', status: 'verified', uploadedAt: NOW - 5 * DAY, verifiedBy: 'Fatima Al-Dosari' },
  { id: 'ev-6', type: 'document', label: 'Previous Claim File (CLM-07455)', status: 'received', uploadedAt: NOW - 3 * DAY },
];

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
const location: IncidentLocation = {
  lat: 29.3759,
  lng: 47.9774,
  address: 'Fifth Ring Road, near Al-Rai exit',
  city: 'Kuwait City',
  country: 'Kuwait',
  riskZone: 'medium',
  nearbyClaimsCount: 14,
};

// ---------------------------------------------------------------------------
// SLA
// ---------------------------------------------------------------------------
const sla: SLAStatus = {
  targetHours: 192, // 8 days
  elapsedHours: 120, // 5 days
  remainingHours: 72,
  status: 'on_track',
  nextMilestone: 'Decision Deadline',
};

// ---------------------------------------------------------------------------
// Export complete state
// ---------------------------------------------------------------------------
export function getClaimsState(): ClaimsState {
  _seed = 42;
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
