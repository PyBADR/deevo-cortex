// ============================================================================
// DEEVO Monitor — Decision Panel (RIGHT)
// Palantir-style: every piece of information in a card.
// Recommendation → Confidence → Impact → Entities → Alerts
// No paragraphs. Only metrics, short insights, structured panels.
// ============================================================================

import type { Decision, AIBrief, Alert, CountryIntel } from '../engine/types';

interface Props {
  decision: Decision;
  aiBrief: AIBrief;
  alerts: Alert[];
  countries: CountryIntel[];
  selectedCountry?: string | null;
  onDismissAlert: (id: string) => void;
}

const SEVERITY_DOT: Record<string, string> = {
  critical: '#C96A6A',
  high: '#D6A24A',
  moderate: '#4DB6D6',
  low: '#67B58A',
};

export function AlertsRail({ decision, aiBrief, alerts, countries, onDismissAlert }: Props) {
  const activeAlerts = alerts.filter(a => !a.dismissed);
  const affectedCountries = countries
    .filter(c => c.riskScore > 0.3)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const decisionColor = decision.type === 'ESCALATE' ? '#C96A6A'
    : decision.type === 'REVIEW' ? '#D6A24A' : '#67B58A';

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">

      {/* ===== DECISION CARD: Visually dominant ===== */}
      <div
        className="rounded-lg border-2 p-4"
        style={{ borderColor: decisionColor + '60', backgroundColor: decisionColor + '08' }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-mono text-d-muted tracking-widest">DECISION</span>
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: decisionColor }}
          />
        </div>
        <div
          className="text-3xl font-mono font-black tracking-wider mb-3"
          style={{ color: decisionColor }}
        >
          {decision.type}
        </div>
        {/* Confidence + Risk as metric pair */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">CONFIDENCE</div>
            <div className="text-xl font-mono font-bold text-d-blue mt-0.5">
              {(decision.confidence * 100).toFixed(0)}%
            </div>
          </div>
          <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5">
            <div className="text-[8px] font-mono text-d-muted tracking-wider">RISK SCORE</div>
            <div className="text-xl font-mono font-bold mt-0.5" style={{ color: decisionColor }}>
              {(decision.riskScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        {/* Risk bar */}
        <div className="mt-3 h-1.5 bg-d-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${decision.riskScore * 100}%`, backgroundColor: decisionColor }}
          />
        </div>
      </div>

      {/* ===== KEY DRIVERS ===== */}
      {decision.drivers.length > 0 && (
        <div className="rounded-lg border border-d-border bg-d-surface p-3">
          <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">KEY DRIVERS</div>
          <div className="space-y-1.5">
            {decision.drivers.map((driver, i) => (
              <div key={i} className="flex items-start gap-2 rounded border border-d-border/20 bg-d-panel/50 px-2.5 py-2">
                <span className="text-d-cyan flex-shrink-0 text-xs mt-px">›</span>
                <span className="text-[11px] text-d-text leading-snug">{driver}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SIGNAL BRIEF: headline + recommendation ===== */}
      <div className="rounded-lg border border-d-border bg-d-surface p-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">SIGNAL BRIEF</div>
        <div className="text-sm font-mono font-semibold text-d-text mb-2 leading-snug">
          {aiBrief.headline}
        </div>
        <div className="rounded border border-d-border/20 bg-d-panel/50 p-2.5 mb-2">
          <div className="text-[8px] font-mono text-d-muted tracking-wider mb-1">RECOMMENDATION</div>
          <div className="text-[11px] text-d-text leading-snug">{aiBrief.recommendation}</div>
        </div>
      </div>

      {/* ===== PROJECTED IMPACT ===== */}
      <div className="rounded-lg border border-d-border bg-d-surface p-3">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">PROJECTED IMPACT</div>
        <div className="text-[11px] text-d-sub leading-snug mb-3">{aiBrief.impact}</div>

        {affectedCountries.length > 0 && (
          <div>
            <div className="text-[8px] font-mono text-d-muted tracking-widest mb-2">AFFECTED ENTITIES</div>
            <div className="space-y-1">
              {affectedCountries.map(country => (
                <div
                  key={country.code}
                  className="flex items-center justify-between rounded border border-d-border/20 bg-d-panel/50 px-2.5 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{country.flag}</span>
                    <span className="text-xs font-mono text-d-text font-semibold">{country.code}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[11px] font-mono font-bold" style={{ color: '#C96A6A' }}>
                        {(country.riskScore * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-mono font-bold text-d-cyan">
                        ${country.exposure.toFixed(1)}B
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== ACTIVE ALERTS ===== */}
      {activeAlerts.length > 0 && (
        <div className="rounded-lg border border-d-border bg-d-surface p-3">
          <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">
            ALERTS ({activeAlerts.length})
          </div>
          <div className="space-y-1.5">
            {activeAlerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className="flex items-start gap-2 rounded border border-d-border/30 bg-d-panel/50 p-2.5 group hover:border-d-border/60 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: SEVERITY_DOT[alert.severity] ?? '#4DB6D6' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-semibold text-d-text truncate">
                    {alert.title}
                  </div>
                  <div className="text-[8px] text-d-muted/60 mt-0.5">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-d-muted/30 hover:text-d-muted text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
