// ============================================================================
// DEEVO Monitor — Signal Metric Cards (Bottom Strip)
// No paragraphs. Only: metric + direction + severity + action cue.
// Each card is a bordered, padded decision-support unit.
// ============================================================================

import type { IntelBlock, LayerId, Severity } from '../engine/types';

interface Props {
  blocks: IntelBlock[];
  activeLayers: LayerId[];
  onToggleLayer: (id: LayerId) => void;
}

const BLOCK_COLORS: Record<string, string> = {
  oil: '#D6A24A',
  inflation: '#C96A6A',
  claims: '#4DB6D6',
  fraud: '#C96A6A',
  supply_chain: '#8B85C2',
  interest_rates: '#5D8BFF',
};

function getActionCue(severity: Severity): { label: string; color: string } {
  const cues: Record<Severity, { label: string; color: string }> = {
    critical: { label: 'ESCALATE', color: '#C96A6A' },
    high: { label: 'REVIEW', color: '#D6A24A' },
    moderate: { label: 'MONITOR', color: '#4DB6D6' },
    low: { label: 'CLEAR', color: '#67B58A' },
  };
  return cues[severity];
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 24;
  const w = 60;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IntelBlocks({ blocks, activeLayers, onToggleLayer }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {blocks.map(block => {
        const accent = BLOCK_COLORS[block.type] ?? '#4DB6D6';
        const isActive = activeLayers.includes(block.type as LayerId);
        const layerId = block.type as LayerId;
        const cue = getActionCue(block.severity);

        return (
          <button
            key={block.id}
            onClick={() => onToggleLayer(layerId)}
            className="text-left rounded-lg border p-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col"
            style={{
              borderColor: isActive ? accent + '60' : '#39414C',
              backgroundColor: isActive ? '#2E353F' : '#2A3038',
            }}
          >
            {/* Header: name + severity */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: accent }}>
                {block.title.toUpperCase()}
              </span>
              <span
                className="text-[7px] font-mono px-1 py-0.5 rounded"
                style={{ color: accent, backgroundColor: accent + '15', border: `1px solid ${accent}30` }}
              >
                {block.severity.toUpperCase()}
              </span>
            </div>

            {/* Metric + change + sparkline */}
            <div className="flex items-end justify-between mb-1">
              <div className="text-lg font-mono font-bold text-d-text leading-none">
                {block.value.toFixed(block.unit === 'USD/barrel' ? 0 : 2)}
              </div>
              <MiniSparkline data={block.sparkline} color={accent} />
            </div>
            <div
              className="text-[10px] font-mono font-semibold mb-1.5"
              style={{ color: block.change >= 0 ? '#C96A6A' : '#67B58A' }}
            >
              {block.change >= 0 ? '▲' : '▼'} {Math.abs(block.change).toFixed(1)}%
            </div>

            {/* Action cue bar */}
            <div className="mt-auto pt-1.5 border-t border-d-border/30">
              <div className="h-1 rounded-full mb-1" style={{ backgroundColor: cue.color }} />
              <div className="text-[7px] font-mono font-bold tracking-wider" style={{ color: cue.color }}>
                {cue.label}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
