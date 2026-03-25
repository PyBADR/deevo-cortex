import React, { useMemo } from 'react';
import { SignalItem, Locale } from '../../types/ui';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SignalRailProps {
  data: SignalItem[];
  locale: Locale;
}

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return { border: 'border-l-red-500', text: 'text-red-400', bg: 'bg-red-950/20' };
    case 'high':
      return { border: 'border-l-orange-500', text: 'text-orange-400', bg: 'bg-orange-950/20' };
    case 'moderate':
      return { border: 'border-l-amber-500', text: 'text-amber-400', bg: 'bg-amber-950/20' };
    case 'low':
      return { border: 'border-l-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-950/20' };
    default:
      return { border: 'border-l-gray-500', text: 'text-gray-400', bg: 'bg-gray-950/20' };
  }
};

const SignalSparkline: React.FC<{ values: number[] }> = ({ values }) => {
  if (values.length < 2) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 60;
      const y = 20 - ((v - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="60" height="20" className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const SignalRail: React.FC<SignalRailProps> = ({ data, locale }) => {
  const sortedSignals = useMemo(() => {
    const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
    return [...data].sort(
      (a, b) =>
        (severityOrder[a.severity?.toLowerCase() as keyof typeof severityOrder] ?? 999) -
        (severityOrder[b.severity?.toLowerCase() as keyof typeof severityOrder] ?? 999)
    );
  }, [data]);

  const isDeltaUp = (delta?: number) => delta !== undefined && delta > 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#080c14] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
          {locale === 'ar' ? 'الإشارات' : 'Signals'}
        </span>
        <span className="text-xs font-mono text-gray-600 bg-gray-900/50 px-2 py-1 rounded">
          {sortedSignals.length}
        </span>
      </div>

      {/* Signals Container */}
      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        {sortedSignals.map((signal, idx) => {
          const colors = getSeverityColor(signal.severity);
          const sparklineValues = signal.sparkline || [signal.value];

          return (
            <div
              key={idx}
              className={`border-l-2 ${colors.border} ${colors.bg} rounded px-3 py-2 space-y-1`}
            >
              {/* Label */}
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                  {signal.label}
                </span>
                {signal.sparkline && signal.sparkline.length > 0 && (
                  <div className={`text-cyan-400`}>
                    <SignalSparkline values={sparklineValues} />
                  </div>
                )}
              </div>

              {/* Value & Delta */}
              <div className="flex items-baseline justify-between">
                <span className={`text-lg font-bold font-mono ${colors.text}`}>
                  {typeof signal.value === 'number' ? signal.value.toFixed(2) : signal.value}
                </span>
                {signal.delta !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {isDeltaUp(signal.delta) ? (
                      <TrendingUp className="w-3 h-3 text-red-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="font-mono">
                      {Math.abs(signal.delta).toFixed(2)}
                    </span>
                    {signal.unit && <span>{signal.unit}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sortedSignals.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">
            {locale === 'ar' ? 'لا توجد إشارات' : 'No signals'}
          </div>
        )}
      </div>
    </div>
  );
};
