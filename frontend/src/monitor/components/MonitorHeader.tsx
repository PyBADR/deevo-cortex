// ============================================================================
// DEEVO Monitor — Header Bar (Enterprise redesign)
// Live ticker + status + controls + locale toggle
// ============================================================================

import type { Signal, Decision } from '../engine/types';
import { t } from '../../lib/i18n';

interface Props {
  signals: Signal[];
  decision: Decision;
  isLive: boolean;
  tickCount: number;
  onToggleLive: () => void;
  locale: 'en' | 'ar';
  onToggleLocale: () => void;
}

export function MonitorHeader({
  signals,
  decision,
  isLive,
  tickCount,
  onToggleLive,
  locale,
  onToggleLocale,
}: Props) {
  const decisionColor = decision.type === 'ESCALATE'
    ? 'text-d-danger border-d-danger/40'
    : decision.type === 'REVIEW'
      ? 'text-d-amber border-d-amber/40'
      : 'text-d-success border-d-success/40';

  const now = new Date();
  const time = now.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', { hour12: false });

  return (
    <div className="h-11 flex items-center justify-between px-4 border-b border-d-border/40 bg-d-bg flex-shrink-0">
      {/* Left: Logo + Monitor label + Decision */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-d-blue" />
          <span className="text-xs font-mono font-bold text-d-blue tracking-wider">DEEVO</span>
        </div>
        <span className="text-[10px] font-mono text-d-muted tracking-widest">MONITOR</span>
        <div className="w-px h-4 bg-d-border/30" />
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${decisionColor}`}>
          {decision.type}
        </span>
      </div>

      {/* Center: Signal ticker */}
      <div className="flex-1 mx-4 overflow-hidden">
        <div className="flex items-center gap-4 text-[10px] font-mono">
          {signals.slice(0, 5).map(s => (
            <span key={s.id} className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-d-muted">{s.label.split(' ')[0]}:</span>
              <span className="text-d-text">{s.value}</span>
              <span className={s.change >= 0 ? 'text-d-danger' : 'text-d-success'}>
                {s.change >= 0 ? '▲' : '▼'}{Math.abs(s.change).toFixed(1)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right: Live/Paused + Language toggle + Clock */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border transition-all ${
            isLive
              ? 'border-d-success/30 text-d-success bg-d-success/10'
              : 'border-d-border text-d-muted bg-d-surface/50'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isLive ? 'bg-d-success animate-pulse' : 'bg-d-muted'
            }`}
          />
          {t(isLive ? 'status.live' : 'status.paused', locale)}
        </button>

        <button
          onClick={onToggleLocale}
          className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-d-border text-d-muted hover:text-d-text transition-colors"
          title={locale === 'en' ? 'Switch to العربية' : 'Switch to English'}
        >
          {locale === 'en' ? 'EN' : 'AR'}
        </button>

        <span className="text-[10px] font-mono text-d-muted/60">{time}</span>
      </div>
    </div>
  );
}
