import React from 'react';
import { PropagationPanelData, Locale } from '../../types/ui';
import { ChevronRight } from 'lucide-react';

interface PropagationPanelProps {
  data: PropagationPanelData;
  locale: Locale;
}

export const PropagationPanel: React.FC<PropagationPanelProps> = ({ data, locale }) => {
  const chain = data.cause_effect_chain || [];
  const countries = data.affected_countries || [];
  const sectors = data.affected_sectors || [];

  return (
    <div className="h-full flex flex-col gap-4 p-5 bg-[#080c14] border border-white/[0.06] rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
          {locale === 'ar' ? 'سلسلة الانتشار' : 'Propagation Chain'}
        </h2>
        {data.edges_traversed !== undefined && (
          <span className="text-[10px] font-mono text-gray-600">{data.edges_traversed} edges</span>
        )}
      </div>

      {/* Readable path summary */}
      {data.readable_path && (
        <div className="px-3 py-2 bg-cyan-950/10 border border-cyan-900/20 rounded text-xs text-cyan-300 font-mono">
          {data.readable_path}
        </div>
      )}

      {/* Cause-Effect Chain */}
      {chain.length > 0 ? (
        <div className="flex-1 space-y-2 overflow-y-auto">
          {chain.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-900/50 border border-gray-800/50 rounded text-[11px] font-mono text-gray-300 whitespace-nowrap">
                {step.from}
              </span>
              <ChevronRight size={12} className="text-gray-700 flex-shrink-0" />
              <span className="px-2 py-1 bg-gray-900/50 border border-gray-800/50 rounded text-[11px] font-mono text-gray-300 whitespace-nowrap">
                {step.to}
              </span>
              {step.weight !== undefined && (
                <span className="ml-auto text-[10px] font-mono text-gray-600 tabular-nums">
                  {(step.weight * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-600">
          {locale === 'ar' ? 'لا توجد سلسلة' : 'No propagation chain'}
        </div>
      )}

      {/* Affected Countries & Sectors */}
      {(countries.length > 0 || sectors.length > 0) && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
          <div>
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2">
              {locale === 'ar' ? 'الدول' : 'Countries'}
            </p>
            <div className="flex flex-wrap gap-1">
              {countries.map((c) => (
                <span key={c} className="px-2 py-0.5 bg-cyan-950/20 border border-cyan-900/20 rounded text-[10px] font-mono text-cyan-400">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2">
              {locale === 'ar' ? 'القطاعات' : 'Sectors'}
            </p>
            <div className="flex flex-wrap gap-1">
              {sectors.map((s) => (
                <span key={s} className="px-2 py-0.5 bg-amber-950/20 border border-amber-900/20 rounded text-[10px] font-mono text-amber-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
