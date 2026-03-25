// ============================================================================
// DEEVO Monitor — Alerts & AI Rail (RIGHT)
// Decision badge + AI brief + live alerts feed.
// ============================================================================

import type { Decision, AIBrief, Alert, CountryIntel, CountryCode } from '../engine/types';

interface Props {
  decision: Decision;
  aiBrief: AIBrief;
  alerts: Alert[];
  countries: CountryIntel[];
  selectedCountry: CountryCode | null;
  onDismissAlert: (id: string) => void;
}

const DECISION_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  ESCALATE: { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  REVIEW: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
  APPROVE: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  moderate: 'bg-cyan-500',
  low: 'bg-emerald-500',
};

export function AlertsRail({ decision, aiBrief, alerts, countries, selectedCountry, onDismissAlert }: Props) {
  const ds = DECISION_STYLES[decision.type] ?? DECISION_STYLES.APPROVE;
  const selectedCtry = selectedCountry ? countries.find(c => c.code === selectedCountry) : null;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1">
      {/* Decision Badge */}
      <div className={`rounded-lg border p-4 ${ds.bg} ${ds.border} ${ds.glow}`}>
        <div className="text-[9px] font-mono text-deevo-muted tracking-widest mb-1">SYSTEM DECISION</div>
        <div className={`text-3xl font-mono font-bold tracking-wider ${ds.text}`}>
          {decision.type}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] font-mono text-deevo-muted">RISK SCORE</div>
            <div className={`text-xl font-mono font-bold ${ds.text}`}>
              {(decision.riskScore * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-deevo-muted">CONFIDENCE</div>
            <div className="text-xl font-mono font-bold text-cyan-400">
              {(decision.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-deevo-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${decision.riskScore * 100}%`,
              backgroundColor: decision.type === 'ESCALATE' ? '#ef4444' : decision.type === 'REVIEW' ? '#f59e0b' : '#22c55e',
            }}
          />
        </div>
      </div>

      {/* AI Brief */}
      <div className="rounded-lg border border-deevo-border bg-deevo-surface/50 p-3">
        <div className="text-[9px] font-mono text-cyan-400 tracking-widest mb-1.5">AI INTELLIGENCE BRIEF</div>
        <div className="text-sm font-mono text-deevo-text font-semibold leading-tight mb-2">
          {aiBrief.headline}
        </div>
        <div className="text-[11px] text-deevo-muted leading-relaxed mb-2">
          {aiBrief.summary}
        </div>
        {aiBrief.drivers.length > 0 && (
          <div className="space-y-1 mb-2">
            {aiBrief.drivers.map((d, i) => (
              <div key={i} className="text-[10px] font-mono text-deevo-text/60 flex items-start gap-1.5">
                <span className="text-cyan-500 mt-0.5">›</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-[10px] text-deevo-muted italic">{aiBrief.impact}</div>
      </div>

      {/* Selected Country */}
      {selectedCtry && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{selectedCtry.flag}</span>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-300">{selectedCtry.name}</div>
              <div className="text-[9px] font-mono text-deevo-muted">
                GDP: ${selectedCtry.gdp}B · GWP: ${selectedCtry.insuranceGwp}B
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[8px] font-mono text-deevo-muted">RISK</div>
              <div className="text-sm font-mono font-bold text-red-400">{(selectedCtry.riskScore * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-[8px] font-mono text-deevo-muted">OIL DEP</div>
              <div className="text-sm font-mono font-bold text-amber-400">{(selectedCtry.oilDependency * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-[8px] font-mono text-deevo-muted">FRAUD</div>
              <div className="text-sm font-mono font-bold text-rose-400">{selectedCtry.fraudIndex.toFixed(2)}</div>
            </div>
          </div>
          {selectedCtry.alerts.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedCtry.alerts.map((a, i) => (
                <div key={i} className="text-[9px] font-mono text-amber-400/80">⚠ {a}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Alerts Feed */}
      <div>
        <div className="text-[9px] font-mono text-deevo-muted tracking-widest mb-1.5">
          ALERTS ({alerts.filter(a => !a.dismissed).length})
        </div>
        <div className="space-y-1.5">
          {alerts.filter(a => !a.dismissed).slice(0, 8).map(alert => (
            <div
              key={alert.id}
              className="rounded border border-deevo-border/50 bg-deevo-surface/30 p-2 group"
            >
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${SEVERITY_DOT[alert.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-semibold text-deevo-text truncate">
                    {alert.title}
                  </div>
                  <div className="text-[9px] text-deevo-muted mt-0.5 line-clamp-2">{alert.message}</div>
                  <div className="text-[8px] text-deevo-muted/50 mt-0.5 font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-deevo-muted/30 hover:text-deevo-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {alerts.filter(a => !a.dismissed).length === 0 && (
            <div className="text-[10px] font-mono text-deevo-muted/40 text-center py-4">
              No active alerts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
