import type { Evidence } from '../engine/types';

interface Props {
  evidence: Evidence[];
}

const statusColors = {
  verified: '#67B58A',
  received: '#4DB6D6',
  pending: '#D6A24A',
  rejected: '#C96A6A',
} as const;

const typeIcons = {
  document: '📄',
  photo: '📸',
  report: '📋',
  statement: '💬',
  medical: '🏥',
  police: '🚔',
} as const;

const getStatusColor = (status: string): string => {
  return statusColors[status as keyof typeof statusColors] || '#818B97';
};

const getTypeIcon = (type: string): string => {
  return typeIcons[type as keyof typeof typeIcons] || '📄';
};

const formatDate = (date: number | Date | null | undefined): string => {
  if (!date) return 'Pending';
  const d = typeof date === 'number' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit',
  });
};

export function EvidencePanel(props: Props) {
  const { evidence } = props;

  const verifiedCount = evidence.filter(
    (e) => e.status === 'verified'
  ).length;
  const totalCount = evidence.length;
  const completionPercent = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-mono text-d-muted tracking-widest">
          SUPPORTING EVIDENCE
        </span>
        <span className="text-[9px] font-mono text-d-muted">
          {verifiedCount}/{totalCount} verified
        </span>
      </div>

      {/* Evidence Items */}
      <div className="space-y-2">
        {evidence.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-2.5 rounded border border-d-border/30 bg-d-panel/50 px-2.5 py-2"
          >
            {/* Type Icon */}
            <span className="flex-shrink-0 text-base leading-none">
              {getTypeIcon(item.type)}
            </span>

            {/* Content Container */}
            <div className="min-w-0 flex-1">
              {/* Label */}
              <div className="mb-1 truncate text-[11px] font-mono text-d-text">
                {item.label}
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span
                  className="inline-block flex-shrink-0 rounded px-1.5 py-0.5 text-[8px] font-mono font-semibold uppercase"
                  style={{ backgroundColor: getStatusColor(item.status) + '20', color: getStatusColor(item.status) }}
                >
                  {item.status}
                </span>

                {/* Date */}
                <span className="flex-shrink-0 text-[8px] text-d-muted">
                  {formatDate(item.uploadedAt)}
                </span>

                {/* Verified By */}
                {item.verifiedBy && (
                  <>
                    <span className="text-[8px] text-d-muted/40">•</span>
                    <span className="truncate text-[8px] text-d-muted">
                      {item.verifiedBy}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {evidence.length === 0 && (
        <div className="flex h-20 items-center justify-center text-[9px] text-d-muted">
          No evidence items
        </div>
      )}

      {/* Progress Bar */}
      {evidence.length > 0 && (
        <div className="mt-3 pt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-d-border/30">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${completionPercent}%`,
                backgroundColor: '#67B58A',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
