import React from 'react';
import type { RiskAssessment, RiskFactor } from '../engine/types';

interface Props {
  risk: RiskAssessment;
}

function getRiskColor(score: number): string {
  if (score > 70) return 'text-d-danger';
  if (score > 40) return 'text-d-amber';
  return 'text-d-success';
}

function getFraudColor(level: string): string {
  if (level === 'confirmed') return 'bg-d-danger text-white';
  if (level === 'high') return 'bg-d-danger/80 text-white';
  if (level === 'medium') return 'bg-d-amber text-d-bg';
  if (level === 'low') return 'bg-d-amber/40 text-d-amber';
  return 'bg-d-success/40 text-d-success';
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'fraud':
      return 'bg-d-danger';
    case 'severity':
      return 'bg-d-amber';
    case 'complexity':
      return 'bg-purple';
    case 'compliance':
      return 'bg-d-blue';
    case 'financial':
      return 'bg-d-cyan';
    default:
      return 'bg-d-muted';
  }
}

function getCategoryDotColor(category: string): string {
  switch (category) {
    case 'fraud':
      return 'bg-d-danger';
    case 'severity':
      return 'bg-d-amber';
    case 'complexity':
      return 'bg-purple';
    case 'compliance':
      return 'bg-d-blue';
    case 'financial':
      return 'bg-d-cyan';
    default:
      return 'bg-d-muted';
  }
}

function getTrendArrow(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return '▲';
  if (trend === 'down') return '▼';
  return '→';
}

function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return 'text-d-danger';
  if (trend === 'down') return 'text-d-success';
  return 'text-d-muted';
}

function groupFactorsByCategory(factors: RiskFactor[]): Record<string, RiskFactor[]> {
  const groups: Record<string, RiskFactor[]> = {
    fraud: [],
    severity: [],
    complexity: [],
    compliance: [],
    financial: [],
  };

  factors.forEach((factor) => {
    if (groups[factor.category]) {
      groups[factor.category].push(factor);
    }
  });

  return groups;
}

export function RiskBreakdownPanel(props: Props) {
  const { risk } = props;
  const confidencePercent = Math.round(risk.confidence * 100);
  const fraudProbabilityPercent = Math.round(risk.fraudProbability * 100);
  const groupedFactors = groupFactorsByCategory(risk.factors);

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 flex flex-col gap-3">
      {/* HEADER */}
      <div className="text-[9px] font-mono text-d-muted tracking-[0.15em]">RISK ASSESSMENT</div>

      {/* TOP ROW - METRIC CARDS */}
      <div className="grid grid-cols-4 gap-2">
        {/* OVERALL RISK */}
        <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">OVERALL RISK</div>
          <div className={`text-2xl font-mono font-bold ${getRiskColor(risk.overallScore)}`}>
            {Math.round(risk.overallScore)}
          </div>
        </div>

        {/* CONFIDENCE */}
        <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">CONFIDENCE</div>
          <div className="text-xl font-mono font-bold text-d-blue">{confidencePercent}%</div>
        </div>

        {/* FRAUD PROBABILITY */}
        <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">FRAUD PROB</div>
          <div
            className={`text-xl font-mono font-bold ${
              fraudProbabilityPercent > 70
                ? 'text-d-danger'
                : fraudProbabilityPercent > 40
                  ? 'text-d-amber'
                  : 'text-d-success'
            }`}
          >
            {fraudProbabilityPercent}%
          </div>
        </div>

        {/* ANOMALIES */}
        <div className="rounded border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">ANOMALIES</div>
          <div className="text-xl font-mono font-bold text-d-text">{risk.anomalyCount}</div>
          <div className="text-[8px] font-mono text-d-muted">
            {Math.round(risk.historicalComparison)}th percentile
          </div>
        </div>
      </div>

      {/* FRAUD INDICATOR BADGE */}
      <div className="flex items-center gap-2">
        <div className={`rounded px-2 py-1 ${getFraudColor(risk.fraudIndicator)}`}>
          <span className="text-[9px] font-mono font-bold tracking-wider">
            {risk.fraudIndicator.toUpperCase()}
          </span>
        </div>
      </div>

      {/* FACTOR BREAKDOWN */}
      <div className="flex flex-col gap-2">
        {Object.entries(groupedFactors).map(([category, factors]) => {
          if (factors.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-1.5">
              {/* CATEGORY HEADER */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getCategoryDotColor(category)}`} />
                <span className="text-[9px] font-mono text-d-muted tracking-wider uppercase">
                  {category}
                </span>
              </div>

              {/* FACTORS IN CATEGORY */}
              {factors.map((factor) => (
                <div
                  key={factor.id}
                  className="rounded border border-d-border/30 bg-d-bg/30 p-2 flex items-center gap-3"
                >
                  {/* LABEL */}
                  <div className="min-w-fit">
                    <span className="text-[11px] text-d-text">{factor.label}</span>
                  </div>

                  {/* BAR */}
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-d-panel overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getCategoryColor(factor.category)}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>

                  {/* SCORE + TREND */}
                  <div className="flex items-center gap-1.5 min-w-fit">
                    <span className="text-[10px] font-mono text-d-text">{Math.round(factor.score)}</span>
                    <span className={`text-[9px] ${getTrendColor(factor.trend)}`}>
                      {getTrendArrow(factor.trend)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
