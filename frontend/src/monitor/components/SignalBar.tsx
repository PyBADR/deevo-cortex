// ============================================================================
// DEEVO Monitor — Signal Bar
// Horizontal signal cards between header and main content.
// ============================================================================

import type { Signal } from '../engine/types';

interface Props {
  signals: Signal[];
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 20;
  const w = 50;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const SEV_COLORS: Record<string, string> = {
  critical: '#FF5C6C',
  high: '#F5B942',
  moderate: '#37C5F3',
  low: '#3CCB7F',
};

export function SignalBar({ signals }: Props) {
  // Sort by severity
  const sorted = [...signals].sort((a, b) => {
    const order: Record<string, number> = { critical: 0, high: 1, moderate: 2, low: 3 };
    return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
  });

  return (
    <div className="flex gap-2 overflow-x-auto px-1 py-1 scrollbar-thin">
      {sorted.map(signal => {
        const color = SEV_COLORS[signal.severity] ?? '#37C5F3';
        return (
          <div
            key={signal.id}
            className="flex-shrink-0 rounded-lg border border-d-border/40 bg-d-panel/30 px-3 py-2 min-w-[150px]"
            style={{ borderLeftColor: color, borderLeftWidth: 2 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[8px] font-mono text-d-muted tracking-wider truncate">
                  {signal.label.toUpperCase()}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-mono font-bold text-d-text">{signal.value}</span>
                  <span className={`text-[10px] font-mono ${signal.change >= 0 ? 'text-d-danger' : 'text-d-success'}`}>
                    {signal.change >= 0 ? '↑' : '↓'}{Math.abs(signal.change).toFixed(1)}%
                  </span>
                </div>
                <div className="text-[8px] font-mono text-d-muted/50">{signal.unit}</div>
              </div>
              <MiniSparkline data={signal.sparkline} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
