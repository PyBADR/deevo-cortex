// ============================================================================
// DEEVO Monitor — Intelligence Blocks Grid (BOTTOM)
// Clickable blocks that update when state changes.
// ============================================================================

import type { IntelBlock, SignalType, LayerId } from '../engine/types';

interface Props {
  blocks: IntelBlock[];
  activeLayers: LayerId[];
  onToggleLayer: (id: LayerId) => void;
}

const BLOCK_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  oil: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
  inflation: { accent: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)' },
  claims: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.2)' },
  fraud: { accent: '#f43f5e', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.2)' },
  supply_chain: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.2)' },
  interest_rates: { accent: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)' },
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  moderate: 'MODERATE',
  low: 'LOW',
};

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
        const colors = BLOCK_COLORS[block.type] ?? BLOCK_COLORS.claims;
        const isActive = activeLayers.includes(block.type as LayerId);
        const layerId = block.type as LayerId;

        return (
          <button
            key={block.id}
            onClick={() => onToggleLayer(layerId)}
            className="text-left rounded-lg border p-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: isActive ? colors.border : 'rgba(26,31,46,0.5)',
              backgroundColor: isActive ? colors.bg : 'rgba(10,14,23,0.3)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[9px] font-mono font-semibold tracking-wider"
                style={{ color: colors.accent }}
              >
                {block.title.toUpperCase()}
              </span>
              <span
                className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  color: colors.accent,
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {SEVERITY_LABELS[block.severity]}
              </span>
            </div>

            {/* Value + Change */}
            <div className="flex items-end justify-between mb-1">
              <div className="text-xl font-mono font-bold text-deevo-text">
                {block.value.toFixed(block.unit === 'USD/barrel' ? 0 : 2)}
              </div>
              <div className={`text-[10px] font-mono ${block.change >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {block.change >= 0 ? '↑' : '↓'} {Math.abs(block.change).toFixed(1)}%
              </div>
            </div>

            {/* Sparkline */}
            <MiniSparkline data={block.sparkline} color={colors.accent} />

            {/* Detail */}
            <div className="text-[9px] text-deevo-muted mt-1.5 leading-tight line-clamp-2">
              {block.detail}
            </div>
          </button>
        );
      })}
    </div>
  );
}
