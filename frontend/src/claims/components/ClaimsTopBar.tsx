import React from 'react';
import type { Claim, SLAStatus, RiskAssessment } from '../engine/types';

interface Props {
  claim: Claim;
  sla: SLAStatus;
  risk: RiskAssessment;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getRiskColor(score: number): string {
  if (score > 70) return 'text-d-danger';
  if (score > 40) return 'text-d-amber';
  return 'text-d-success';
}

function getStatusColor(status: string): string {
  if (status === 'UNDER_REVIEW') return 'bg-d-amber/20 text-d-amber border-d-amber/50';
  if (status === 'ESCALATED') return 'bg-d-danger/20 text-d-danger border-d-danger/50';
  if (status === 'APPROVED') return 'bg-d-success/20 text-d-success border-d-success/50';
  if (status === 'REJECTED') return 'bg-d-danger/20 text-d-danger border-d-danger/50';
  if (status === 'PENDING_DOCS') return 'bg-d-amber/20 text-d-amber border-d-amber/50';
  return 'bg-d-blue/20 text-d-blue border-d-blue/50';
}

function getSLAColor(status: string): string {
  if (status === 'breached') return 'text-d-danger';
  if (status === 'at_risk') return 'text-d-amber';
  return 'text-d-success';
}

function getSLAProgressColor(status: string): string {
  if (status === 'breached') return 'bg-d-danger';
  if (status === 'at_risk') return 'bg-d-amber';
  return 'bg-d-success';
}

export function ClaimsTopBar(props: Props) {
  const { claim, sla, risk } = props;

  const slaProgress = Math.max(0, Math.min(100, (sla.elapsedHours / sla.targetHours) * 100));
  const statusDisplay = claim.status.replace(/_/g, ' ');
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="h-14 bg-d-bg/95 backdrop-blur-md border-b border-d-border/30 flex items-center justify-between px-4">
      {/* LEFT: HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-d-success animate-pulse" />
          <span className="text-sm font-bold font-mono text-d-cyan">DEEVO</span>
        </div>
        <div className="w-px h-4 bg-d-border/40" />
        <span className="text-[8px] font-mono text-d-muted tracking-[0.2em]">CLAIMS CONTROL</span>
      </div>

      {/* CENTER: METRIC CARDS */}
      <div className="flex items-center gap-2 flex-1 mx-6 justify-center">
        {/* CLAIM ID */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">CLAIM ID</div>
          <div className="text-sm font-mono font-bold text-d-text">{claim.id}</div>
        </div>

        {/* CLAIMANT */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">CLAIMANT</div>
          <div className="text-sm font-mono font-bold text-d-text truncate max-w-[120px]">{claim.claimant}</div>
        </div>

        {/* POLICY */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">POLICY</div>
          <div className="text-sm font-mono font-bold text-d-text">{claim.policyNumber}</div>
        </div>

        {/* AMOUNT */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">AMOUNT</div>
          <div className={`text-sm font-mono font-bold ${claim.claimAmount > 10000 ? 'text-d-amber' : 'text-d-text'}`}>
            {formatCurrency(claim.claimAmount, claim.currency)}
          </div>
        </div>

        {/* RISK SCORE */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">RISK</div>
          <div className={`text-sm font-mono font-bold ${getRiskColor(risk.overallScore)}`}>
            {risk.overallScore}/100
          </div>
        </div>

        {/* STATUS */}
        <div className={`rounded border px-3 py-1.5 min-w-fit ${getStatusColor(claim.status)}`}>
          <div className="text-[8px] font-mono text-current/60 tracking-wider">STATUS</div>
          <div className="text-sm font-mono font-bold text-current">{statusDisplay}</div>
        </div>

        {/* SLA */}
        <div className="rounded border border-d-border/40 bg-d-surface px-3 py-1.5 min-w-fit">
          <div className="text-[8px] font-mono text-d-muted tracking-wider">SLA</div>
          <div className="flex flex-col gap-1">
            <div className={`text-sm font-mono font-bold ${getSLAColor(sla.status)}`}>
              {Math.ceil(sla.remainingHours)}h
            </div>
            <div className="w-24 h-1 bg-d-panel rounded-full overflow-hidden">
              <div
                className={`h-full ${getSLAProgressColor(sla.status)} transition-all`}
                style={{ width: `${slaProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: NAVIGATION & TIMESTAMP */}
      <div className="flex items-center gap-4">
        <a
          href="/monitor"
          className="text-[8px] font-mono text-d-muted hover:text-d-text transition-colors tracking-wider"
        >
          MONITOR
        </a>
        <span className="text-[8px] font-mono text-d-muted tracking-wider">{timestamp}</span>
      </div>
    </div>
  );
}
