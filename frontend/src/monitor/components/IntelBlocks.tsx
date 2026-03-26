// ============================================================================
// DEEVO Monitor — Decision-Supporting Signal Cards
// NOT a data dashboard. A DECISION SYSTEM.
// Each card answers: WHAT (signal) → WHY (detail) → ACTION (cue)
// ============================================================================

import type { IntelBlock, SignalType, LayerId, Severity } from '../engine/types';

interface Props {
  blocks: IntelBlock[];
  activeLayers: LayerId[];
  onToggleLayer: (id: LayerId) => void;
}

// Design system colors (d-* tokens)
const BLOCK_COLORS: Record<string, string> = {
  oil: '#F5B942',           // d-amber
  inflation: '#FF5C6C',     // d-danger
  claims: '#37C5F3',        // d-cyan
  fraud: '#FF5C6C',         // d-danger
  supply_chain: '#9B8AFF',  // custom purple
  interest_rates: '#4DA3FF', // d-blue
};

// Severity → impact sentence
function getImpactSentence(severity: Severity): string {
  const sentences: Record<Severity, string> = {
    critical: 'Immediate action required',
    high: 'Monitor closely — escalation threshold approaching',
    moderate: 'Within tolerance — tracking',
    low: 'Normal operating range',
  };
  return sentences[severity];
}

// Severity → action cue (label + bar color)
function getActionCue(severity: Severity): { label: string; color: string } {
  const cues: Record<Severity, { label: string; color: string }> = {
    critical: { label: 'ESCALATE', color: '#FF5C6C' }, // d-danger
    high: { label: 'REVIEW', color: '#F5B942' },       // d-amber
    moderate: { label: 'MONITOR', color: '#37C5F3' },  // d-cyan
    low: { label: 'CLEAR', color: '#3CCB7F' },         // d-success
  };
  return cues[severity];
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 80;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function IntelBlocks({ blocks, activeLayers, onToggleLayer }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {blocks.map(block => {
        const accentColor = BLOCK_COLORS[block.type] ?? BLOCK_COLORS.claims;
        const isActive = activeLayers.includes(block.type as LayerId);
        const layerId = block.type as LayerId;
        const actionCue = getActionCue(block.severity);
        const impactSentence = getImpactSentence(block.severity);

        return (
          <button
            key={block.id}
            onClick={() => onToggleLayer(layerId)}
            className="relative text-left rounded-lg border p-3 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col h-full"
            style={{
              borderColor: isActive ? accentColor : '#273140',
              backgroundColor: isActive ? '#161C24' : 'rgba(17,22,29,0.5)',
            }}
          >
            {/* WHAT: Signal name + Severity badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[9px] font-mono font-semibold tracking-wider"
                style={{ color: accentColor }}
              >
                {block.title.toUpperCase()}
              </span>
              <span
                className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  color: accentColor,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: `1px solid ${accentColor}`,
                }}
              >
                {block.severity.toUpperCase()}
              </span>
            </div>

            {/* VALUE: Current number + direction + sparkline */}
            <div className="flex items-end justify-between mb-1">
              <div className="text-xl font-mono font-bold text-d-text">
                {block.value.toFixed(block.unit === 'USD/barrel' ? 0 : 2)}
              </div>
              <div
                className="text-[10px] font-mono"
                style={{
                  color: block.change >= 0 ? '#FF5C6C' : '#3CCB7F', // d-danger / d-success
                }}
              >
                {block.change >= 0 ? '↑' : '↓'} {Math.abs(block.change).toFixed(1)}%
              </div>
            </div>

            <div className="mb-2">
              <MiniSparkline data={block.sparkline} color={accentColor} />
            </div>

            {/* WHY IT MATTERS: Original detail + impact sentence */}
            <div className="flex-grow">
              <div className="text-[8px] text-d-muted leading-tight mb-1">
                {block.detail}
              </div>
              <div
                className="text-[8px] font-semibold leading-tight"
                style={{ color: accentColor }}
              >
                {impactSentence}
              </div>
            </div>

            {/* ACTION CUE: Tiny colored bar + label at bottom */}
            <div className="mt-2 pt-2 border-t border-d-border">
              <div
                className="h-1 rounded mb-1"
                style={{ backgroundColor: actionCue.color }}
              />
              <div
                className="text-[7px] font-mono font-semibold tracking-wide"
                style={{ color: actionCue.color }}
              >
                {actionCue.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
