import React from 'react';
import { Locale } from '../../types/ui';

interface ScenarioOption {
  id: string;
  title: string;
  expected_decision?: string;
  country_focus?: string;
}

interface ScenarioSwitcherProps {
  value: string;
  onChange: (id: string) => void;
  scenarios: ScenarioOption[];
  locale: Locale;
}

const getDecisionBadgeColor = (decision?: string) => {
  switch (decision?.toUpperCase()) {
    case 'ESCALATE':
      return 'bg-red-950/30 border-red-500/50 text-red-400';
    case 'REVIEW':
      return 'bg-amber-950/30 border-amber-500/50 text-amber-400';
    case 'APPROVE':
      return 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400';
    default:
      return 'bg-gray-950/30 border-gray-500/50 text-d-sub';
  }
};

export const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({
  value,
  onChange,
  scenarios,
  locale,
}) => {
  return (
    <div className="w-full space-y-3 p-6 bg-d-shell border border-d-border/30 rounded-lg">
      {/* Header */}
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
        {locale === 'ar' ? 'السيناريو' : 'Scenario'}
      </h2>

      {/* Scenario List */}
      <div className="flex flex-col gap-2">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === value;
          const borderClass = isActive
            ? 'border-d-cyan/50 bg-cyan-950/20'
            : 'border-gray-700/30 bg-gray-950/20 hover:border-gray-600/50';
          const textClass = isActive ? 'text-d-blue' : 'text-d-sub hover:text-gray-300';

          return (
            <button
              key={scenario.id}
              onClick={() => onChange(scenario.id)}
              className={`w-full text-left px-4 py-3 rounded border transition-colors space-y-1 ${borderClass} ${textClass}`}
              style={
                isActive
                  ? {
                      boxShadow: '0 0 16px rgba(34, 211, 238, 0.2)',
                    }
                  : undefined
              }
            >
              {/* Title */}
              <div className="text-sm font-mono font-bold">
                {scenario.title}
              </div>

              {/* Expected Decision Badge & Country */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {scenario.expected_decision && (
                  <span
                    className={`${getDecisionBadgeColor(scenario.expected_decision)} border rounded px-2 py-0.5 font-mono font-bold uppercase tracking-wider`}
                  >
                    {scenario.expected_decision}
                  </span>
                )}
                {scenario.country_focus && (
                  <span className="text-d-muted font-mono">
                    {scenario.country_focus}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {scenarios.length === 0 && (
          <div className="text-xs text-d-muted text-center py-4">
            {locale === 'ar' ? 'لا توجد سيناريوهات' : 'No scenarios available'}
          </div>
        )}
      </div>
    </div>
  );
};
