import React from 'react';
import type { Claim, IncidentLocation } from '../engine/types';

interface Props {
  claim: Claim;
  location: IncidentLocation;
}

/**
 * ClaimMetadataPanel
 * LEFT COLUMN: Claim metadata and incident location
 * Vertical stack of sub-cards with metrics, no paragraphs
 */
export function ClaimMetadataPanel(props: Props) {
  const { claim, location } = props;

  // Format dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency (SAR)
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} SAR`;
  };

  // Calculate utilization percentage
  const utilizationPercent = Math.min(
    (claim.claimAmount / claim.coverageLimit) * 100,
    100
  );

  // Map risk zone to badge color
  const getRiskZoneBadgeColor = (zone: string) => {
    switch (zone) {
      case 'low':
        return 'bg-d-success/20 text-d-success border-d-success/40';
      case 'medium':
        return 'bg-d-amber/20 text-d-amber border-d-amber/40';
      case 'high':
        return 'bg-d-danger/20 text-d-danger border-d-danger/40';
      default:
        return 'bg-d-muted/20 text-d-muted border-d-muted/40';
    }
  };

  // Map loss type to display label
  const getLossTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      motor: 'Motor',
      property: 'Property',
      health: 'Health',
      marine: 'Marine',
      liability: 'Liability',
      engineering: 'Engineering',
    };
    return labels[type] || type.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto px-4 py-3">
      {/* ===== CLAIM DETAILS ===== */}
      <div className="flex items-center">
        <h3 className="text-xs font-bold tracking-wider text-d-text">
          CLAIM DETAILS
        </h3>
      </div>

      {/* Claim Metadata Card */}
      <div className="border border-d-border rounded bg-d-panel divide-y divide-d-border">
        {/* Loss Type */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Loss Type</span>
          <span className="inline-block px-2 py-1 text-xs font-mono font-semibold rounded bg-d-cyan/20 text-d-cyan border border-d-cyan/40">
            {getLossTypeLabel(claim.lossType)}
          </span>
        </div>

        {/* Loss Date */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Loss Date</span>
          <span className="text-xs font-mono text-d-text">
            {formatDate(claim.lossDate)}
          </span>
        </div>

        {/* Report Date */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Report Date</span>
          <span className="text-xs font-mono text-d-text">
            {formatDate(claim.reportDate)}
          </span>
        </div>

        {/* Region */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Region</span>
          <span className="text-xs font-mono text-d-text">
            {claim.region}, {claim.country}
          </span>
        </div>

        {/* Assigned To */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Assigned To</span>
          <span className="text-xs font-mono text-d-text">
            {claim.assignedAdjuster}
          </span>
        </div>

        {/* Policy Type */}
        <div className="flex justify-between items-center px-3 py-2">
          <span className="text-xs font-mono text-d-muted">Policy Type</span>
          <span className="text-xs font-mono text-d-text">
            {claim.policyType}
          </span>
        </div>
      </div>

      {/* ===== POLICY COVERAGE ===== */}
      <div className="flex items-center pt-2">
        <h3 className="text-xs font-bold tracking-wider text-d-text">
          POLICY COVERAGE
        </h3>
      </div>

      {/* Policy Metrics Card */}
      <div className="border border-d-border rounded bg-d-panel p-3 space-y-3">
        {/* Coverage Limit */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-d-muted">Coverage Limit</span>
          <span className="text-xs font-mono text-d-text font-semibold">
            {formatCurrency(claim.coverageLimit)}
          </span>
        </div>

        {/* Deductible */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-d-muted">Deductible</span>
          <span className="text-xs font-mono text-d-text">
            {formatCurrency(claim.deductible)}
          </span>
        </div>

        {/* Policy Start */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-d-muted">Policy Start</span>
          <span className="text-xs font-mono text-d-text">
            {formatDate(claim.policyStartDate)}
          </span>
        </div>

        {/* Policy End */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono text-d-muted">Policy End</span>
          <span className="text-xs font-mono text-d-text">
            {formatDate(claim.policyEndDate)}
          </span>
        </div>

        {/* Utilization Bar */}
        <div className="pt-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-d-muted">Utilization</span>
            <span className="text-xs font-mono text-d-text">
              {utilizationPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 rounded bg-d-surface overflow-hidden border border-d-border/50">
            <div
              className={`h-full rounded transition-all ${
                utilizationPercent > 90
                  ? 'bg-d-danger'
                  : utilizationPercent > 70
                    ? 'bg-d-amber'
                    : 'bg-d-cyan'
              }`}
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== INCIDENT LOCATION ===== */}
      <div className="flex items-center pt-2">
        <h3 className="text-xs font-bold tracking-wider text-d-text">
          INCIDENT LOCATION
        </h3>
      </div>

      {/* Location Card */}
      <div className="border border-d-border rounded bg-d-panel p-3 space-y-2">
        {/* Address */}
        <div className="text-xs text-d-text leading-snug">
          {location.address}
        </div>

        {/* City, Country */}
        <div className="text-xs text-d-sub">
          {location.city}, {location.country}
        </div>

        {/* Risk Zone Badge + Nearby Claims */}
        <div className="flex justify-between items-center pt-1">
          <span
            className={`inline-block px-2 py-1 text-xs font-mono font-semibold rounded border ${getRiskZoneBadgeColor(location.riskZone)}`}
          >
            {location.riskZone.toUpperCase()}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono text-d-muted">
              {location.nearbyClaimsCount} nearby
            </span>
          </div>
        </div>

        {/* Coordinates */}
        <div className="pt-1 text-xs font-mono text-d-muted">
          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </div>
      </div>
    </div>
  );
}
