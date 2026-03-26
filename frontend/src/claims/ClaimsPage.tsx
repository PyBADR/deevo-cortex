// ============================================================================
// DEEVO Claims Decision Control Room — Main Page
// Palantir-style 3-column layout with forensic audit log.
// RIGHT panel is the COMMAND CENTER — user decides there.
// CENTER is compressed: risk summary + drivers + single chart
// ============================================================================

import { useState, useMemo } from 'react';
import { getClaimsState } from './engine/mockData';
import type { AIDecision } from './engine/types';

import { ClaimsTopBar } from './components/ClaimsTopBar';
import { EntityGraphPanel } from './components/EntityGraphPanel';
import { ClaimMetadataPanel } from './components/ClaimMetadataPanel';
import { EvidencePanel } from './components/EvidencePanel';
import { RiskBreakdownPanel } from './components/RiskBreakdownPanel';
import { DecisionDriversPanel, deriveDrivers } from './components/DecisionDriversPanel';
import { TimeSeriesPanel } from './components/TimeSeriesPanel';
import { AIRecommendationPanel } from './components/AIRecommendationPanel';
import { AuditTimeline } from './components/AuditTimeline';

export function ClaimsPage() {
  const state = useMemo(() => getClaimsState(), []);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const drivers = useMemo(() => deriveDrivers(state.risk.factors), [state.risk.factors]);

  const handleAction = (action: AIDecision | 'ASSIGN') => {
    console.log(`[CLAIMS] Action: ${action} on claim ${state.claim.id}`);
  };

  return (
    <div className="h-screen w-screen bg-d-bg text-d-text flex flex-col overflow-hidden">

      {/* ===== TOP BAR: Claim Identity + KPIs ===== */}
      <ClaimsTopBar claim={state.claim} sla={state.sla} risk={state.risk} />

      {/* ===== MAIN CONTENT: 3-column ===== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* LEFT COLUMN: Context */}
        <div className="w-72 flex-shrink-0 border-r border-d-border/30 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 h-64 p-2">
            <EntityGraphPanel
              graph={state.entityGraph}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <ClaimMetadataPanel claim={state.claim} location={state.location} />
            <EvidencePanel evidence={state.evidence} />
          </div>
        </div>

        {/* CENTER COLUMN: Compressed Signals */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-d-border/20 bg-d-shell/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-d-danger animate-pulse" />
              <span className="text-[9px] font-mono text-d-muted tracking-widest">RISK ANALYSIS</span>
            </div>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-d-border/30 bg-d-surface text-d-muted">
              {state.claim.lossType.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-h-0 p-2 overflow-y-auto space-y-2">
            {/* 1. Risk Summary (compact) */}
            <RiskBreakdownPanel risk={state.risk} />
            {/* 2. Decision Drivers (signal → decision bridge) */}
            <DecisionDriversPanel drivers={drivers} />
            {/* 3. Single Time Series + Top 3 Anomalies */}
            <TimeSeriesPanel timeSeries={state.timeSeries} anomalies={state.anomalies} />
          </div>
        </div>

        {/* RIGHT COLUMN: DECISION COMMAND CENTER */}
        <div className="w-[340px] flex-shrink-0 border-l border-d-border/30 bg-d-shell/30 overflow-hidden">
          <div className="h-full p-3">
            <AIRecommendationPanel recommendation={state.recommendation} onAction={handleAction} />
          </div>
        </div>
      </div>

      {/* ===== BOTTOM: Forensic Audit Log ===== */}
      <div className="flex-shrink-0 border-t border-d-border/30 bg-d-shell px-3 py-1.5">
        <AuditTimeline entries={state.auditTrail} />
      </div>
    </div>
  );
}
