// ============================================================================
// Risk Summary — COMPACT. Only what serves the decision.
// 4 metric cards + fraud badge + top factors (no full breakdown)
// ============================================================================

import type { RiskAssessment } from '../engine/types';

interface Props {
  risk: RiskAssessment;
}

function riskColor(s: number): string {
  if (s > 70) return 'text-d-danger';
  if (s > 40) return 'text-d-amber';
  return 'text-d-success';
}

function riskBarColor(s: number): string {
  if (s > 70) return 'bg-d-danger';
  if (s > 40) return 'bg-d-amber';
  return 'bg-d-success';
}

function fraudBadge(level: string): { bg: string; text: string } {
  switch (level) {
    case 'confirmed': return { bg: 'bg-d-danger', text: 'text-white' };
    case 'high':      return { bg: 'bg-d-danger/80', text: 'text-white' };
    case 'medium':    return { bg: 'bg-d-amber/80', text: 'text-d-bg' };
    case 'low':       return { bg: 'bg-d-amber/30', text: 'text-d-amber' };
    default:          return { bg: 'bg-d-success/30', text: 'text-d-success' };
  }
}

function catColor(c: string): string {
  switch (c) {
    case 'fraud': return 'bg-d-danger';
    case 'severity': return 'bg-d-amber';
    case 'complexity': return 'bg-[#8B85C2]';
    case 'compliance': return 'bg-d-blue';
    case 'financial': return 'bg-d-cyan';
    default: return 'bg-d-muted';
  }
}

export function RiskBreakdownPanel({ risk }: Props) {
  const conf = Math.round(risk.confidence * 100);
  const fraud = Math.round(risk.fraudProbability * 100);
  const fb = fraudBadge(risk.fraudIndicator);

  // Top 5 factors by weighted impact
  const topFactors = [...risk.factors]
    .sort((a, b) => (b.score * b.weight) - (a.score * a.weight))
    .slice(0, 5);

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-2.5">
      {/* Header + fraud badge inline */}
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-d-muted tracking-widest">RISK SUMMARY</span>
        <span className={`text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded ${fb.bg} ${fb.text}`}>
          FRAUD: {risk.fraudIndicator.toUpperCase()}
        </span>
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-4 gap-1.5">
        <div className="rounded border border-d-border/25 bg-d-bg/50 p-2 flex flex-col gap-0.5">
          <div className="text-[7px] font-mono text-d-muted tracking-wider">RISK SCORE</div>
          <div className={`text-xl font-mono font-bold ${riskColor(risk.overallScore)}`}>{Math.round(risk.overallScore)}</div>
          <div className="h-1 rounded-full bg-d-panel overflow-hidden">
            <div className={`h-full rounded-full ${riskBarColor(risk.overallScore)}`} style={{ width: `${risk.overallScore}%` }} />
          </div>
        </div>
        <div className="rounded border border-d-border/25 bg-d-bg/50 p-2 flex flex-col gap-0.5">
          <div className="text-[7px] font-mono text-d-muted tracking-wider">CONFIDENCE</div>
          <div className="text-xl font-mono font-bold text-d-blue">{conf}%</div>
          <div className="h-1 rounded-full bg-d-panel overflow-hidden">
            <div className="h-full rounded-full bg-d-blue" style={{ width: `${conf}%` }} />
          </div>
        </div>
        <div className="rounded border border-d-border/25 bg-d-bg/50 p-2 flex flex-col gap-0.5">
          <div className="text-[7px] font-mono text-d-muted tracking-wider">FRAUD PROB</div>
          <div className={`text-xl font-mono font-bold ${fraud > 50 ? 'text-d-danger' : fraud > 25 ? 'text-d-amber' : 'text-d-success'}`}>{fraud}%</div>
          <div className="h-1 rounded-full bg-d-panel overflow-hidden">
            <div className={`h-full rounded-full ${fraud > 50 ? 'bg-d-danger' : fraud > 25 ? 'bg-d-amber' : 'bg-d-success'}`} style={{ width: `${fraud}%` }} />
          </div>
        </div>
        <div className="rounded border border-d-border/25 bg-d-bg/50 p-2 flex flex-col gap-0.5">
          <div className="text-[7px] font-mono text-d-muted tracking-wider">ANOMALIES</div>
          <div className="text-xl font-mono font-bold text-d-text">{risk.anomalyCount}</div>
          <div className="text-[7px] font-mono text-d-muted">{risk.historicalComparison}th pctl</div>
        </div>
      </div>

      {/* Top factors — compact rows */}
      <div className="flex flex-col gap-1">
        {topFactors.map(f => (
          <div key={f.id} className="flex items-center gap-2 px-1.5 py-1">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${catColor(f.category)}`} />
            <span className="text-[10px] text-d-text flex-1 truncate">{f.label}</span>
            <div className="w-20 flex-shrink-0">
              <div className="h-1 rounded-full bg-d-panel overflow-hidden">
                <div className={`h-full rounded-full ${catColor(f.category)}`} style={{ width: `${f.score}%` }} />
              </div>
            </div>
            <span className="text-[9px] font-mono text-d-sub w-6 text-right flex-shrink-0">{f.score}</span>
            <span className={`text-[8px] flex-shrink-0 ${f.trend === 'up' ? 'text-d-danger' : f.trend === 'down' ? 'text-d-success' : 'text-d-muted'}`}>
              {f.trend === 'up' ? '▲' : f.trend === 'down' ? '▼' : '→'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
