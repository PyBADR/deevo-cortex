import React from 'react';
import { CountryCardData, Locale } from '../../types/ui';

interface CountryCardProps {
  data: CountryCardData;
  locale: Locale;
}

export const CountryCard: React.FC<CountryCardProps> = ({ data, locale }) => {
  return (
    <div className="h-full p-5 bg-[#080c14] border border-white/[0.06] rounded-xl">
      {/* Header: Flag + Name */}
      <div className="flex items-center gap-3 mb-4">
        {data.flag_emoji && (
          <span className="text-3xl">{data.flag_emoji}</span>
        )}
        <div>
          <h3 className="text-lg font-bold text-white">{data.display_name}</h3>
          {data.insurance_market_gwp && (
            <span className="text-[10px] font-mono text-cyan-500">
              GWP {data.insurance_market_gwp}
            </span>
          )}
        </div>
      </div>

      {/* Risk Signature */}
      {data.risk_signature && (
        <p className="text-sm text-gray-400 italic mb-4 leading-relaxed border-l-2 border-cyan-500/30 pl-3">
          &ldquo;{data.risk_signature}&rdquo;
        </p>
      )}

      {/* Key Metric */}
      {data.key_metric && (
        <div className="bg-gray-900/40 border border-gray-800/50 rounded-lg p-3 mb-3">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1">Key Metric</div>
          <div className="text-sm text-gray-200">{data.key_metric}</div>
        </div>
      )}

      {/* Scenario Cue */}
      {data.scenario_cue && (
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 mb-3">
          <div className="text-[10px] font-mono text-amber-600 uppercase tracking-wider mb-1">Scenario Cue</div>
          <div className="text-sm text-amber-200">{data.scenario_cue}</div>
        </div>
      )}

      {/* Strategic Role */}
      {data.strategic_role && (
        <div className="pt-3 border-t border-white/5 mt-auto">
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Role: </span>
          <span className="text-xs text-cyan-400">{data.strategic_role}</span>
        </div>
      )}
    </div>
  );
};
