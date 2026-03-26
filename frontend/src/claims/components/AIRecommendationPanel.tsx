// ============================================================================
// AI Decision Command Center — The user decides HERE without looking elsewhere.
// DECISION → WHY → IMPACT → ACTIONS (self-contained)
// ============================================================================

import type { AIRecommendation, AIDecision } from '../engine/types';

interface Props {
  recommendation: AIRecommendation;
  onAction: (action: AIDecision | 'ASSIGN') => void;
}

const decisionStyles: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  APPROVE:      { border: 'border-d-success',  bg: 'bg-d-success/10', text: 'text-d-success',  glow: '#67B58A' },
  REJECT:       { border: 'border-d-danger',   bg: 'bg-d-danger/10',  text: 'text-d-danger',   glow: '#C96A6A' },
  ESCALATE:     { border: 'border-d-amber',    bg: 'bg-d-amber/10',   text: 'text-d-amber',    glow: '#D6A24A' },
  REQUEST_DOCS: { border: 'border-d-blue',     bg: 'bg-d-blue/10',    text: 'text-d-blue',     glow: '#5D8BFF' },
};

function fmt(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

export function AIRecommendationPanel({ recommendation, onAction }: Props) {
  const s = decisionStyles[recommendation.decision] || decisionStyles.ESCALATE;
  const conf = Math.round(recommendation.confidence * 100);
  const litRisk = Math.round(recommendation.financialImpact.litigationRisk * 100);
  const fi = recommendation.financialImpact;
  const sim = recommendation.similarClaims;

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ===== DECISION CARD — DOMINANT ===== */}
      <div className={`border-2 ${s.border} ${s.bg} rounded-lg p-5 flex flex-col gap-3 min-h-[180px]`}>
        {/* Live indicator + label */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-d-muted tracking-widest">AI RECOMMENDATION</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.glow }} />
            <span className="text-[8px] font-mono text-d-muted">LIVE</span>
          </div>
        </div>

        {/* THE DECISION — largest text on screen */}
        <div className={`${s.text} text-4xl font-mono font-black tracking-wider leading-none`}>
          {recommendation.decision.replace('_', ' ')}
        </div>

        {/* Confidence + Litigation Risk as sub-cards */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="rounded border border-d-border/20 bg-d-bg/40 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">CONFIDENCE</div>
            <div className="text-xl font-mono font-bold text-d-blue">{conf}%</div>
            <div className="h-1 rounded-full bg-d-panel mt-1 overflow-hidden">
              <div className="h-full rounded-full bg-d-blue" style={{ width: `${conf}%` }} />
            </div>
          </div>
          <div className="rounded border border-d-border/20 bg-d-bg/40 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">LITIGATION RISK</div>
            <div className={`text-xl font-mono font-bold ${litRisk > 50 ? 'text-d-danger' : litRisk > 25 ? 'text-d-amber' : 'text-d-success'}`}>
              {litRisk}%
            </div>
            <div className="h-1 rounded-full bg-d-panel mt-1 overflow-hidden">
              <div className={`h-full rounded-full ${litRisk > 50 ? 'bg-d-danger' : litRisk > 25 ? 'bg-d-amber' : 'bg-d-success'}`} style={{ width: `${litRisk}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== WHY — Top Signals ===== */}
      <div className="mt-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">WHY</div>
        <div className="flex flex-col gap-1.5">
          {recommendation.reasoning.slice(0, 4).map((r, i) => (
            <div key={i} className="flex items-start gap-2 rounded border border-d-border/20 bg-d-shell/60 px-2.5 py-1.5">
              <span className="text-d-danger font-mono text-[10px] mt-px flex-shrink-0">{'•'}</span>
              <span className="text-[10px] text-d-text leading-snug">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== IMPACT — Financial ===== */}
      <div className="mt-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">IMPACT</div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded border border-d-border/20 bg-d-bg/50 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">IF APPROVED</div>
            <div className="text-sm font-mono font-bold text-d-danger mt-0.5">-SAR {fmt(fi.approvalCost)}</div>
          </div>
          <div className="rounded border border-d-border/20 bg-d-bg/50 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">IF REJECTED</div>
            <div className="text-sm font-mono font-bold text-d-success mt-0.5">+SAR {fmt(fi.rejectionSaving)}</div>
          </div>
          <div className="rounded border border-d-border/20 bg-d-bg/50 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">REINSURANCE</div>
            <div className="text-sm font-mono font-bold text-d-cyan mt-0.5">SAR {fmt(fi.reinsuranceRecovery)}</div>
          </div>
          <div className="rounded border border-d-border/20 bg-d-bg/50 p-2">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">SIMILAR ({sim.total})</div>
            <div className="text-sm font-mono font-bold text-d-blue mt-0.5">{Math.round(sim.approvedRate * 100)}% approved</div>
          </div>
        </div>
      </div>

      {/* ===== ESCALATION REASON (if applicable) ===== */}
      {recommendation.escalationReason && (
        <div className="mt-3 rounded border border-d-amber/30 bg-d-amber/5 px-2.5 py-2">
          <div className="text-[8px] font-mono text-d-amber tracking-wider mb-1">ESCALATION REASON</div>
          <div className="text-[10px] text-d-text">{recommendation.escalationReason}</div>
        </div>
      )}

      {/* ===== ACTIONS — Always visible at bottom ===== */}
      <div className="mt-auto pt-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">ACTIONS</div>
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => onAction('APPROVE')}
            className="rounded border border-d-success/40 bg-d-success/10 px-3 py-2.5 text-[10px] font-mono font-bold tracking-wider text-d-success hover:bg-d-success/20 transition-colors">
            APPROVE
          </button>
          <button onClick={() => onAction('REJECT')}
            className="rounded border border-d-danger/40 bg-d-danger/10 px-3 py-2.5 text-[10px] font-mono font-bold tracking-wider text-d-danger hover:bg-d-danger/20 transition-colors">
            REJECT
          </button>
          <button onClick={() => onAction('ESCALATE')}
            className="rounded border border-d-amber/40 bg-d-amber/10 px-3 py-2.5 text-[10px] font-mono font-bold tracking-wider text-d-amber hover:bg-d-amber/20 transition-colors">
            ESCALATE
          </button>
          <button onClick={() => onAction('REQUEST_DOCS')}
            className="rounded border border-d-blue/40 bg-d-blue/10 px-3 py-2.5 text-[10px] font-mono font-bold tracking-wider text-d-blue hover:bg-d-blue/20 transition-colors">
            REQUEST DOCS
          </button>
        </div>
        <button onClick={() => onAction('ASSIGN')}
          className="w-full mt-1.5 rounded border border-d-border/40 bg-d-surface px-3 py-2 text-[9px] font-mono font-bold tracking-wider text-d-muted hover:bg-d-panel transition-colors">
          ASSIGN TO ANALYST
        </button>
      </div>
    </div>
  );
}
