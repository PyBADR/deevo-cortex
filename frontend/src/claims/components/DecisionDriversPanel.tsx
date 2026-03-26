// ============================================================================
// Decision Drivers — Signal-to-Decision Bridge
// Every chart/signal must reflect here. This is the WHY layer.
// ============================================================================

import type { RiskFactor } from '../engine/types';

export interface Driver {
  label: string;
  weight: number;       // 0–100
  impact: 'positive' | 'negative';
  source: string;       // which panel generated this
}

interface Props {
  drivers: Driver[];
}

export function deriveDrivers(factors: RiskFactor[]): Driver[] {
  return factors
    .sort((a, b) => b.score * b.weight - a.score * a.weight)
    .slice(0, 6)
    .map(f => ({
      label: f.label,
      weight: Math.round(f.score * f.weight * 100) / 100,
      impact: f.score > 60 ? 'negative' as const : 'positive' as const,
      source: f.category,
    }));
}

export function DecisionDriversPanel({ drivers }: Props) {
  const maxWeight = Math.max(...drivers.map(d => d.weight), 1);

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-2">
      <div className="text-[9px] font-mono text-d-muted tracking-widest">DECISION DRIVERS</div>

      <div className="flex flex-col gap-1.5">
        {drivers.map((d, i) => (
          <div key={i} className="flex items-center gap-2 rounded border border-d-border/20 bg-d-bg/40 px-2 py-1.5">
            {/* Impact indicator */}
            <div className={`w-1 h-4 rounded-full flex-shrink-0 ${d.impact === 'negative' ? 'bg-d-danger' : 'bg-d-cyan'}`} />

            {/* Label */}
            <span className="text-[10px] text-d-text flex-1 min-w-0 truncate">{d.label}</span>

            {/* Weight bar */}
            <div className="w-16 flex-shrink-0">
              <div className="h-1 rounded-full bg-d-panel overflow-hidden">
                <div
                  className={`h-full rounded-full ${d.impact === 'negative' ? 'bg-d-danger' : 'bg-d-cyan'}`}
                  style={{ width: `${(d.weight / maxWeight) * 100}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <span className={`text-[10px] font-mono w-8 text-right flex-shrink-0 ${d.impact === 'negative' ? 'text-d-danger' : 'text-d-cyan'}`}>
              {d.weight.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
