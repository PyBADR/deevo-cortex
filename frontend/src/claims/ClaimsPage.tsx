// ============================================================================
// DEEVO Claims Decision Control Room — Main Page
// Palantir-style 3-column layout with audit timeline.
// TOP:    Claim ID · Claimant · Policy · Amount · Risk · Status · SLA
// LEFT:   Entity Graph + Claim Metadata + Evidence
// CENTER: Risk Breakdown + Time Series + Anomaly Detection
// RIGHT:  AI Recommendation + Confidence + Reasoning + Actions
// BOTTOM: Audit Trail (SHA-256 traced)
// ============================================================================

import { useState, useMemo } from 'react';
import { getClaimsState } from './engine/mockData';
import type { AIDecision } from './engine/types';

import { ClaimsTopBar } from './components/ClaimsTopBar';
import { EntityGraphPanel } from './components/EntityGraphPanel';
import { ClaimMetadataPanel } from './components/ClaimMetadataPanel';
import { EvidencePanel } from './components/EvidencePanel';
import { RiskBreakdownPanel } from './components/RiskBreakdownPanel';
import { TimeSeriesPanel } from './components/TimeSeriesPanel';
import { AIRecommendationPanel } from './components/AIRecommendationPanel';
import { AuditTimeline } from './components/AuditTimeline';

export function ClaimsPage() {
  const state = useMemo(() => getClaimsState(), []);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const handleAction = (action: AIDecision | 'ASSIGN') => {
    // In production: POST to /api/claims/{id}/action with audit trail
    console.log(`[CLAIMS] Action: ${action} on claim ${state.claim.id}`);
  };

  return (
    <div className="h-screen w-screen bg-d-bg text-d-text flex flex-col overflow-hidden">

      {/* ===== TOP BAR: Claim Identity + KPIs ===== */}
      <ClaimsTopBar
        claim={state.claim}
        sla={state.sla}
        risk={state.risk}
      />

      {/* ===== MAIN CONTENT: 3-column ===== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* LEFT COLUMN: Context (Entity Graph + Metadata + Evidence) */}
        <div className="w-72 flex-shrink-0 border-r border-d-border/30 flex flex-col overflow-hidden">
          {/* Entity Graph — upper portion */}
          <div className="flex-shrink-0 h-64 p-2">
            <EntityGraphPanel
              graph={state.entityGraph}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          </div>

          {/* Claim Metadata + Evidence — scrollable lower */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <ClaimMetadataPanel
              claim={state.claim}
              location={state.location}
            />
            <EvidencePanel
              evidence={state.evidence}
            />
          </div>
        </div>

        {/* CENTER COLUMN: Signals (Risk + Time Series + Anomalies) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar label */}
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-d-border/20 bg-d-shell/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-d-danger animate-pulse" />
              <span className="text-[9px] font-mono text-d-muted tracking-widest">RISK ANALYSIS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-d-muted">
                CLAIM {state.claim.id}
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-d-border/30 bg-d-surface text-d-muted">
                {state.claim.lossType.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Risk + Charts area */}
          <div className="flex-1 min-h-0 p-2 overflow-y-auto space-y-2">
            <RiskBreakdownPanel risk={state.risk} />
            <TimeSeriesPanel
              timeSeries={state.timeSeries}
              anomalies={state.anomalies}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Decision Panel */}
        <div className="w-80 flex-shrink-0 border-l border-d-border/30 bg-d-shell/30 overflow-hidden">
          <div className="h-full p-2">
            <AIRecommendationPanel
              recommendation={state.recommendation}
              onAction={handleAction}
            />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM: Audit Trail ===== */}
      <div className="flex-shrink-0 border-t border-d-border/30 bg-d-shell px-3 py-2">
        <AuditTimeline entries={state.auditTrail} />
      </div>
    </div>
  );
}
