import React from 'react';
import { TopBarData, Locale } from '../../types/ui';

interface TopCommandBarProps {
  data: TopBarData;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  live: boolean;
  onLiveChange: (live: boolean) => void;
  scenario: string;
  isDemo: boolean;
}

const DECISION_COLORS: Record<string, string> = {
  ESCALATE: 'bg-red-950/30 border-red-500/50 text-red-400',
  REVIEW: 'bg-amber-950/30 border-amber-500/50 text-amber-400',
  APPROVE: 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400',
};

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  data, locale, onLocaleChange, live, onLiveChange, scenario, isDemo,
}) => {
  const decisionColor = DECISION_COLORS[data.decision] || DECISION_COLORS.REVIEW;
  const headline = data.demo_headline || data.headline_summary || '';

  return (
    <div className="h-12 bg-[#05070b]/95 backdrop-blur-md border-b border-white/5 flex items-center px-5 gap-6 font-mono">
      {/* Left: Branding */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-bold text-cyan-400">DEEVO</span>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
          {locale === 'ar' ? 'مركز القيادة' : 'Command Center'}
        </span>
      </div>

      {/* Center: Decision + Headline */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className={`${decisionColor} border rounded px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0`}>
          {data.decision}
        </div>
        <span className="text-xs text-gray-400 truncate">{headline}</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {isDemo && (
          <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/30 text-amber-400 text-[10px] rounded uppercase tracking-wider">
            DEMO
          </span>
        )}

        <button
          onClick={() => onLiveChange(!live)}
          className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border transition-colors ${
            live
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
              : 'bg-gray-950/30 border-gray-700 text-gray-500'
          }`}
        >
          {live ? (locale === 'ar' ? 'مباشر' : 'LIVE') : (locale === 'ar' ? 'متوقف' : 'PAUSED')}
        </button>

        <button
          onClick={() => onLocaleChange(locale === 'en' ? 'ar' : 'en')}
          className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border bg-gray-950/30 border-gray-700 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {locale === 'en' ? 'AR' : 'EN'}
        </button>

        <span className="text-[10px] text-gray-700">
          {data.timestamp ? new Date(data.timestamp).toLocaleTimeString('en-US', { hour12: false }) : ''}
        </span>
      </div>
    </div>
  );
};
