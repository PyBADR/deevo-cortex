// ============================================================================
// Forensic Audit Log — Actor-typed event stream
// [AI] anomaly detected → [SYSTEM] rule triggered → [ANALYST] reviewed
// Vertical timeline, not horizontal cards.
// ============================================================================

import type { AuditEntry } from '../engine/types';

interface Props {
  entries: AuditEntry[];
}

const actorStyles: Record<string, { color: string; badge: string }> = {
  AI_ENGINE:  { color: '#4DB6D6', badge: 'AI' },
  SYSTEM:     { color: '#818B97', badge: 'SYS' },
};

function getActorStyle(actor: string): { color: string; badge: string } {
  if (actorStyles[actor]) return actorStyles[actor];
  // Human actors
  return { color: '#67B58A', badge: 'USR' };
}

const catColors: Record<string, string> = {
  decision:   '#C96A6A',
  document:   '#4DB6D6',
  assignment: '#5D8BFF',
  status:     '#D6A24A',
  note:       '#67B58A',
  system:     '#818B97',
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

export function AuditTimeline({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono text-d-muted tracking-widest">FORENSIC LOG</span>
        <span className="text-[8px] font-mono text-d-muted">{entries.length} events</span>
      </div>

      {/* Scrollable event stream */}
      <div className="flex flex-row gap-0 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {sorted.map((entry, i) => {
          const actor = getActorStyle(entry.actor);
          const catColor = catColors[entry.category] || '#818B97';

          return (
            <div key={entry.id} className="flex items-center flex-shrink-0">
              {/* Event card */}
              <div className="w-44 rounded border border-d-border/25 bg-d-panel/50 px-2 py-1.5 flex flex-col gap-0.5">
                {/* Actor badge + time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] font-mono font-bold tracking-wider px-1 py-px rounded"
                      style={{ backgroundColor: actor.color + '20', color: actor.color }}>
                      {actor.badge}
                    </span>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: catColor }} />
                  </div>
                  <span className="text-[7px] font-mono text-d-muted">{relativeTime(entry.timestamp)}</span>
                </div>

                {/* Action */}
                <div className="text-[9px] font-mono font-bold text-d-text truncate">{entry.action.replace(/_/g, ' ')}</div>

                {/* Detail */}
                <div className="text-[8px] text-d-sub line-clamp-1">{entry.detail}</div>

                {/* Actor name (for humans) */}
                {entry.actor !== 'SYSTEM' && entry.actor !== 'AI_ENGINE' && (
                  <div className="text-[7px] text-d-muted font-mono truncate">{entry.actor}</div>
                )}

                {/* Hash */}
                <div className="text-[6px] font-mono text-d-muted/40 truncate">{entry.hash.slice(0, 12)}</div>
              </div>

              {/* Connector */}
              {i < sorted.length - 1 && (
                <div className="w-1.5 h-px flex-shrink-0 bg-d-border/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
