import type { AuditEntry } from '../engine/types';

interface Props {
  entries: AuditEntry[];
}

const categoryColors = {
  decision: '#C96A6A',
  document: '#4DB6D6',
  assignment: '#5D8BFF',
  status: '#D6A24A',
  note: '#67B58A',
  system: '#818B97',
} as const;

const categoryDots = {
  decision: '●',
  document: '●',
  assignment: '●',
  status: '●',
  note: '●',
  system: '●',
} as const;

export function AuditTimeline(props: Props) {
  const { entries } = props;

  const formatTimestamp = (timestamp: number | Date): string => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatHash = (hash: string): string => {
    return hash.substring(0, 16) + '...';
  };

  const getCategoryColor = (category: string): string => {
    return categoryColors[category as keyof typeof categoryColors] || '#818B97';
  };

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-mono text-d-muted tracking-widest">
          AUDIT TRAIL
        </span>
        <span className="text-[9px] font-mono text-d-muted">
          {entries.length} {entries.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Timeline Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-row gap-2.5 pb-2">
          {entries.map((entry, index) => (
            <div key={`${entry.timestamp}-${index}`} className="flex items-center">
              {/* Entry Card */}
              <div
                className="min-w-[200px] flex-shrink-0 rounded border border-d-border/30 bg-d-panel/50 p-2.5"
              >
                {/* Category Indicator */}
                <div className="mb-2 flex items-center gap-1.5">
                  <span
                    style={{ color: getCategoryColor(entry.category) }}
                    className="text-xs leading-none"
                  >
                    {categoryDots[entry.category as keyof typeof categoryDots]}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-d-muted">
                    {entry.category}
                  </span>
                </div>

                {/* Action */}
                <div className="mb-1 text-[10px] font-mono font-semibold text-d-text">
                  {entry.action}
                </div>

                {/* Detail */}
                <div className="mb-2 line-clamp-2 text-[10px] text-d-sub">
                  {entry.detail}
                </div>

                {/* Actor */}
                <div className="mb-0.5 text-[8px] text-d-muted">
                  by {entry.actor}
                </div>

                {/* Timestamp */}
                <div className="mb-1.5 text-[8px] text-d-muted">
                  {formatTimestamp(entry.timestamp)}
                </div>

                {/* SHA-256 Hash */}
                <div className="font-mono text-[7px] text-d-muted/50">
                  {formatHash(entry.hash)}
                </div>
              </div>

              {/* Connector Line (between entries) */}
              {index < entries.length - 1 && (
                <div className="h-0.5 w-2.5 flex-shrink-0 bg-d-border/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="flex h-20 items-center justify-center text-[9px] text-d-muted">
          No audit entries
        </div>
      )}
    </div>
  );
}
