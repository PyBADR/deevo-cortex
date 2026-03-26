import React from 'react';
import type { AIRecommendation, AIDecision } from '../engine/types';

interface Props {
  recommendation: AIRecommendation;
  onAction: (action: AIDecision | 'ASSIGN') => void;
}

export function AIRecommendationPanel(props: Props) {
  const { recommendation, onAction } = props;

  // Determine decision color based on recommendation type
  const getDecisionColor = (decision: AIDecision) => {
    switch (decision) {
      case 'APPROVE':
        return {
          border: 'd-success',
          bg: 'bg-d-success/8',
          text: 'text-d-success',
          light: 'd-success/30',
        };
      case 'REJECT':
      case 'ESCALATE':
        return {
          border: 'd-danger',
          bg: 'bg-d-danger/8',
          text: 'text-d-danger',
          light: 'd-danger/30',
        };
      case 'REQUEST_DOCS':
        return {
          border: 'd-amber',
          bg: 'bg-d-amber/8',
          text: 'text-d-amber',
          light: 'd-amber/30',
        };
      default:
        return {
          border: 'd-blue',
          bg: 'bg-d-blue/8',
          text: 'text-d-blue',
          light: 'd-blue/30',
        };
    }
  };

  const colorScheme = getDecisionColor(recommendation.decision);
  const confidencePercent = Math.round(recommendation.confidence * 100);
  const litigationRiskPercent = Math.round(recommendation.financialImpact.litigationRisk * 100);

  // Determine litigation risk color
  const getLitigationRiskColor = (risk: number) => {
    if (risk >= 0.7) return 'text-d-danger';
    if (risk >= 0.4) return 'text-d-amber';
    return 'text-d-success';
  };

  // Format currency (SAR)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const approvalCost = recommendation.financialImpact?.approvalCost || 0;
  const rejectionSaving = recommendation.financialImpact?.rejectionSaving || 0;
  const reinsuranceRecovery = recommendation.financialImpact?.reinsuranceRecovery || 0;
  const similarClaims = recommendation.similarClaims || {};

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto bg-d-bg p-4 rounded-lg">
      {/* Decision Card - Visually Dominant */}
      <div
        className={`border-2 border-${colorScheme.border} ${colorScheme.bg} rounded-lg p-4 flex flex-col gap-4`}
      >
        {/* Header with Label and Pulsing Indicator */}
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono font-bold tracking-widest text-d-muted uppercase">
            AI Recommendation
          </div>
          <div className="relative">
            <div className="h-2 w-2 bg-d-cyan rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Decision Type - Large and Bold */}
        <div className={`${colorScheme.text} text-3xl font-mono font-black tracking-wider`}>
          {recommendation.decision}
        </div>

        {/* Confidence and Litigation Risk Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-mono text-d-muted uppercase tracking-wider">
              Confidence
            </div>
            <div className="text-xl font-mono font-bold text-d-blue">
              {confidencePercent}%
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-mono text-d-muted uppercase tracking-wider">
              Litigation Risk
            </div>
            <div className={`text-xl font-mono font-bold ${getLitigationRiskColor(recommendation.financialImpact.litigationRisk)}`}>
              {litigationRiskPercent}%
            </div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full h-1.5 bg-d-surface rounded-full overflow-hidden">
          <div
            className={`h-full bg-d-blue rounded-full transition-all duration-500`}
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>

      {/* Key Reasoning Section */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-mono font-bold text-d-muted uppercase tracking-wider">
          Key Reasoning
        </div>
        <div className="flex flex-col gap-2">
          {recommendation.reasoning.map((reason, idx) => (
            <div
              key={idx}
              className="border border-d-border/30 bg-d-shell rounded-lg p-2.5 flex items-start gap-2"
            >
              <span className="text-d-cyan font-mono text-sm mt-0.5 flex-shrink-0">›</span>
              <span className="text-[11px] text-d-text leading-snug">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Impact Section */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-mono font-bold text-d-muted uppercase tracking-wider">
          Financial Impact
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Approval Cost
            </div>
            <div className="text-[13px] font-mono font-bold text-d-text">
              {formatCurrency(approvalCost)}
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Rejection Saving
            </div>
            <div className="text-[13px] font-mono font-bold text-d-success">
              {formatCurrency(rejectionSaving)}
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Litigation Risk
            </div>
            <div className={`text-[13px] font-mono font-bold ${getLitigationRiskColor(recommendation.financialImpact.litigationRisk)}`}>
              {litigationRiskPercent}%
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-bg/50 p-2.5 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Reinsurance Recovery
            </div>
            <div className="text-[13px] font-mono font-bold text-d-cyan">
              {formatCurrency(reinsuranceRecovery)}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Claims Analysis Section */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-mono font-bold text-d-muted uppercase tracking-wider">
          Similar Claims Analysis
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-d-border/30 bg-d-shell p-2 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Total Claims
            </div>
            <div className="text-sm font-mono font-bold text-d-cyan">
              {similarClaims.total || 0}
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-shell p-2 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Approval Rate
            </div>
            <div className="text-sm font-mono font-bold text-d-blue">
              {Math.round((similarClaims.approvedRate || 0) * 100)}%
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-shell p-2 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Avg Settlement
            </div>
            <div className="text-sm font-mono font-bold text-d-text">
              {formatCurrency(similarClaims.avgSettlement || 0)}
            </div>
          </div>
          <div className="rounded-lg border border-d-border/30 bg-d-shell p-2 flex flex-col gap-1">
            <div className="text-[9px] font-mono text-d-muted uppercase tracking-wider">
              Avg Duration
            </div>
            <div className="text-sm font-mono font-bold text-d-text">
              {similarClaims.avgDuration || 0}d
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Sticky at Bottom */}
      <div className="mt-auto pt-3 grid grid-cols-2 gap-2 border-t border-d-border/20">
        <button
          onClick={() => onAction('APPROVE')}
          className="rounded-lg border border-d-success/30 bg-d-success/12 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-d-success hover:scale-[1.01] transition-all duration-200"
        >
          APPROVE
        </button>
        <button
          onClick={() => onAction('REJECT')}
          className="rounded-lg border border-d-danger/30 bg-d-danger/12 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-d-danger hover:scale-[1.01] transition-all duration-200"
        >
          REJECT
        </button>
        <button
          onClick={() => onAction('ESCALATE')}
          className="rounded-lg border border-d-amber/30 bg-d-amber/12 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-d-amber hover:scale-[1.01] transition-all duration-200"
        >
          ESCALATE
        </button>
        <button
          onClick={() => onAction('REQUEST_DOCS')}
          className="rounded-lg border border-d-blue/30 bg-d-blue/12 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-d-blue hover:scale-[1.01] transition-all duration-200"
        >
          REQUEST DOCS
        </button>
        <button
          onClick={() => onAction('ASSIGN')}
          className="col-span-2 rounded-lg border border-d-border bg-d-surface px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-d-muted hover:scale-[1.01] transition-all duration-200"
        >
          ASSIGN TO ANALYST
        </button>
      </div>
    </div>
  );
}
