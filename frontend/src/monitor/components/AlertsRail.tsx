// ============================================================================
// DEEVO Monitor — Decision Panel (RIGHT)
// A decision system, not a dashboard. Guides users through:
// Signal → Why → What to do → Expected impact.
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

const DECISION_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  ESCALATE: { bg: 'bg-d-danger/8', border: 'border-d-danger/30', text: 'text-d-danger' },
  REVIEW: { bg: 'bg-d-amber/8', border: 'border-d-amber/30', text: 'text-d-amber' },
  APPROVE: { bg: 'bg-d-success/8', border: 'border-d-success/30', text: 'text-d-success' },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-d-danger',
  high: 'bg-d-amber',
  moderate: 'bg-d-cyan',
  low: 'bg-d-success',
};

export function AlertsRail({ decision, aiBrief, alerts, countries, onDismissAlert }: Props) {
  const ds = DECISION_STYLES[decision.type] ?? DECISION_STYLES.APPROVE;
  const activeAlerts = alerts.filter(a => !a.dismissed);

  // Affected entities: countries with risk > 0.3, sorted by risk descending
  const affectedCountries = countries
    .filter(c => c.riskScore > 0.3)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">

      {/* ===== 1. RECOMMENDATION: What should we do? ===== */}
      <div className={`rounded-lg border p-4 ${ds.bg} ${ds.border}`}>
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">RECOMMENDATION</div>
        <div className={`text-2xl font-mono font-bold tracking-wider ${ds.text} mb-2`}>
          {decision.type}
        </div>
        <div className="text-xs text-d-text leading-snug">
          {decision.reasoning}
        </div>
      </div>

      {/* ===== 2. CONFIDENCE + RISK: How sure are we? ===== */}
      <div className="rounded-lg border border-d-border bg-d-surface/30 p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[9px] font-mono text-d-muted tracking-widest mb-1">CONFIDENCE</div>
            <div className="text-2xl font-mono font-bold text-d-blue">
              {(decision.confidence * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-d-muted tracking-widest mb-1">RISK SCORE</div>
            <div className={`text-2xl font-mono font-bold ${ds.text}`}>
              {(decision.riskScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="h-2 bg-d-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${decision.riskScore * 100}%`,
              backgroundColor: decision.type === 'ESCALATE' ? '#C96A6A' : decision.type === 'REVIEW' ? '#D6A24A' : '#67B58A',
            }}
          />
        </div>
      </div>

      {/* ===== 3. WHY: Key drivers — Why is this happening? ===== */}
      {decision.drivers.length > 0 && (
        <div className="rounded-lg border border-d-border bg-d-panel/40 p-4">
          <div className="text-[9px] font-mono text-d-muted tracking-widest mb-3">KEY DRIVERS</div>
          <div className="space-y-2">
            {decision.drivers.map((driver, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-d-blue flex-shrink-0 mt-0.5">›</span>
                <span className="text-xs text-d-text leading-snug">{driver}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 4. IMPACT ESTIMATE: What is the expected impact? ===== */}
      <div className="rounded-lg border border-d-border bg-d-panel/40 p-4">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">PROJECTED IMPACT</div>
        <div className="text-xs text-d-text leading-snug mb-4">
          {aiBrief.impact}
        </div>

        {affectedCountries.length > 0 && (
          <div>
            <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">AFFECTED ENTITIES</div>
            <div className="space-y-2">
              {affectedCountries.map(country => (
                <div key={country.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{country.flag}</span>
                    <span className="text-xs font-mono text-d-text">{country.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-d-danger font-bold">
                        {(country.riskScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-[8px] text-d-muted">risk</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-d-cyan font-bold">
                        ${country.exposure.toFixed(1)}B
                      </div>
                      <div className="text-[8px] text-d-muted">exposure</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== 5. AI BRIEF: What is happening? ===== */}
      <div className="rounded-lg border border-d-border bg-d-panel/40 p-4">
        <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">SIGNAL BRIEF</div>
        <div className="text-sm font-mono text-d-text font-semibold mb-2">
          {aiBrief.headline}
        </div>
        <div className="text-[11px] text-d-muted leading-relaxed mb-3">
          {aiBrief.summary}
        </div>
        <div className="border-t border-d-border/30 pt-2">
          <div className="text-[9px] font-mono text-d-muted mb-1">RECOMMENDATION</div>
          <div className="text-[10px] text-d-text">{aiBrief.recommendation}</div>
        </div>
      </div>

      {/* ===== 6. ACTIVE ALERTS: What needs attention right now? ===== */}
      {activeAlerts.length > 0 && (
        <div>
          <div className="text-[9px] font-mono text-d-muted tracking-widest mb-2">
            ACTIVE ALERTS ({activeAlerts.length})
          </div>
          <div className="space-y-1.5">
            {activeAlerts.slice(0, 5).map(alert => (
              <div
                key={alert.id}
                className="rounded border border-d-border/40 bg-d-panel/50 p-2.5 group flex items-start gap-2 hover:border-d-border/60 transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${SEVERITY_DOT[alert.severity]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono font-semibold text-d-text truncate">
                    {alert.title}
                  </div>
                  <div className="text-[8px] text-d-muted/70 mt-0.5">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-d-muted/30 hover:text-d-muted text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Dismiss alert"
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
