import React from 'react';
import { DecisionRailData, Locale } from '../../types/ui';

interface DecisionRailProps {
  data: DecisionRailData;
  locale: Locale;
}

const DECISION_STYLES: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
  ESCALATE: {
    bg: 'bg-red-950/30',
    border: 'border-red-500/50',
    text: 'text-red-400',
    shadow: '0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)',
  },
  REVIEW: {
    bg: 'bg-amber-950/30',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    shadow: '0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.15)',
  },
  APPROVE: {
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    shadow: '0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.15)',
  },
};

export const DecisionRail: React.FC<DecisionRailProps> = ({ data, locale }) => {
  const s = DECISION_STYLES[data.decision] || DECISION_STYLES.REVIEW;
  const reasoning = data.demo_short_reasoning || data.short_reasoning || '';

  return (
    <div className="h-full flex flex-col gap-6 p-5 bg-[#080c14] border border-white/[0.06] rounded-xl">
      {/* HERO: Decision Badge */}
      <div
        className={`rounded-lg border ${s.bg} ${s.border} px-6 py-5 text-center`}
        style={{ boxShadow: s.shadow }}
      >
        <div className={`font-mono text-4xl font-black tracking-wide ${s.text}`}>
          {data.decision}
        </div>
        <div className="mt-1 text-[10px] font-mono text-gray-600 uppercase tracking-[0.25em]">
          {locale === 'ar' ? 'قرار النظام' : 'System Decision'}
        </div>
      </div>

      {/* Risk Score — big number */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-black font-mono text-white tabular-nums">
            {data.risk_score.toFixed(2)}
          </span>
          <span className="text-lg font-mono text-gray-600">/ 1.00</span>
        </div>
        <p className="mt-1 text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">
          {locale === 'ar' ? 'درجة المخاطر' : 'Risk Score'}
        </p>
      </div>

      {/* Confidence Bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
            {locale === 'ar' ? 'الثقة' : 'Confidence'}
          </span>
          <span className="text-sm font-mono font-bold text-cyan-400">
            {(data.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${data.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Reasoning */}
      {reasoning && (
        <div className="flex-1">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2">
            {locale === 'ar' ? 'التبرير' : 'Reasoning'}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {reasoning}
          </p>
        </div>
      )}

      {/* Scenario Label */}
      {data.scenario_id && (
        <div className="pt-3 border-t border-white/5">
          <span className="inline-block px-3 py-1 bg-gray-950 border border-gray-800 rounded text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            {data.scenario_label || data.scenario_id}
          </span>
        </div>
      )}
    </div>
  );
};
