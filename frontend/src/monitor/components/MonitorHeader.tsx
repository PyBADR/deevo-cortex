// ============================================================================
// DEEVO Monitor — Header Bar
// Live ticker + status + controls
// ============================================================================

import type { Signal, Decision } from '../engine/types';

interface Props {
  signals: Signal[];
  decision: Decision;
  isLive: boolean;
  tickCount: number;
  onToggleLive: () => void;
}

export function MonitorHeader({ signals, decision, isLive, tickCount, onToggleLive }: Props) {
  const topSignal = [...signals].sort((a, b) => {
    const sev: Record<string, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
    return (sev[b.severity] ?? 0) - (sev[a.severity] ?? 0);
  })[0];

  const decisionColor = decision.type === 'ESCALATE' ? 'text-red-400 border-red-500/40'
    : decision.type === 'REVIEW' ? 'text-amber-400 border-amber-500/40'
    : 'text-emerald-400 border-emerald-500/40';

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });

  return (
    <div className="h-10 flex items-center justify-between px-4 border-b border-deevo-border/50 bg-deevo-bg/90 backdrop-blur-sm flex-shrink-0">
      {/* Left: Logo + Decision */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider">DEEVO</span>
        </div>
        <span className="text-[10px] font-mono text-deevo-muted tracking-widest">MONITOR</span>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${decisionColor}`}>
          {decision.type}
        </span>
      </div>

      {/* Center: Signal ticker */}
      <div className="flex-1 mx-4 overflow-hidden">
        <div className="flex items-center gap-4 text-[10px] font-mono">
          {signals.slice(0, 5).map(s => (
            <span key={s.id} className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-deevo-muted">{s.label.split(' ')[0]}:</span>
              <span className="text-deevo-text">{s.value}</span>
              <span className={s.change >= 0 ? 'text-red-400' : 'text-emerald-400'}>
                {s.change >= 0 ? '▲' : '▼'}{Math.abs(s.change).toFixed(1)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Status + Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border transition-all ${
            isLive
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
              : 'border-deevo-border text-deevo-muted bg-deevo-surface/50'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-deevo-muted'}`} />
          {isLive ? 'LIVE' : 'PAUSED'}
        </button>
        <span className="text-[10px] font-mono text-deevo-muted/50">{time}</span>
      </div>
    </div>
  );
}
