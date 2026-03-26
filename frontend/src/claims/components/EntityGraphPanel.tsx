// ============================================================================
// Entity Network — Hierarchical tree with colored edges
// Claimant at top → branching to related entities
// Red edges = suspicious, Cyan = normal
// ============================================================================

import { useState, useMemo } from 'react';
import type { EntityGraph, ClaimEntity } from '../engine/types';

interface Props {
  graph: EntityGraph;
  selectedEntity: string | null;
  onSelectEntity: (id: string | null) => void;
}

const entityColors: Record<string, string> = {
  claimant:  '#4DB6D6',
  provider:  '#C96A6A',
  policy:    '#5D8BFF',
  adjuster:  '#67B58A',
  witness:   '#D6A24A',
  broker:    '#8B85C2',
  reinsurer: '#818B97',
};

const entityIcons: Record<string, string> = {
  claimant:  '●',
  provider:  '◆',
  policy:    '■',
  adjuster:  '▲',
  witness:   '○',
  broker:    '◇',
  reinsurer: '□',
};

function shortName(name: string): string {
  const parts = name.split(' ');
  if (parts.length <= 2) return name;
  return parts[0] + ' ' + parts[parts.length - 1];
}

export function EntityGraphPanel({ graph, selectedEntity, onSelectEntity }: Props) {
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  // Build a tree: claimant at center top, others branch below
  const claimant = graph.entities.find(e => e.type === 'claimant');
  const others = graph.entities.filter(e => e.type !== 'claimant');

  // Layout: claimant at top center, others in a row below
  const W = 320;
  const H = 180;
  const topY = 30;
  const bottomY = 130;

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; entity: ClaimEntity }>();
    if (claimant) {
      map.set(claimant.id, { x: W / 2, y: topY, entity: claimant });
    }
    const spacing = W / (others.length + 1);
    others.forEach((e, i) => {
      map.set(e.id, { x: spacing * (i + 1), y: bottomY, entity: e });
    });
    return map;
  }, [graph.entities]);

  const selectedData = selectedEntity ? graph.entities.find(e => e.id === selectedEntity) : null;
  const activeId = hoveredEntity || selectedEntity;

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-2 h-full flex flex-col">
      <div className="text-[9px] font-mono text-d-muted tracking-widest mb-1">ENTITY NETWORK</div>

      {/* SVG Graph */}
      <div className="flex-1 min-h-0 overflow-hidden rounded bg-d-bg">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* EDGES — colored by suspicious flag */}
          {graph.links.map((link, i) => {
            const src = positions.get(link.source);
            const tgt = positions.get(link.target);
            if (!src || !tgt) return null;
            const isSuspicious = link.suspicious;
            const edgeColor = isSuspicious ? '#C96A6A' : '#4DB6D6';
            const isActive = activeId === link.source || activeId === link.target;
            return (
              <line key={i}
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={edgeColor}
                strokeWidth={isSuspicious ? 1.5 : 1}
                strokeDasharray={isSuspicious ? '3,2' : '0'}
                opacity={isActive ? 0.9 : 0.35}
              />
            );
          })}

          {/* ENTITY NODES */}
          {Array.from(positions.entries()).map(([id, pos]) => {
            const e = pos.entity;
            const color = entityColors[e.type] || '#818B97';
            const isSelected = selectedEntity === id;
            const isHovered = hoveredEntity === id;
            const r = e.type === 'claimant' ? 14 : 10;

            return (
              <g key={id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredEntity(id)}
                onMouseLeave={() => setHoveredEntity(null)}
                onClick={() => onSelectEntity(selectedEntity === id ? null : id)}>

                {/* Selection ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r={r + 4} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
                )}

                {/* Flagged pulse */}
                {e.flagged && (
                  <circle cx={pos.x} cy={pos.y} r={r + 3} fill="none" stroke="#C96A6A" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" values={`${r + 3};${r + 7};${r + 3}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node circle */}
                <circle cx={pos.x} cy={pos.y} r={r} fill={color} opacity={isHovered || isSelected ? 1 : 0.75} />

                {/* Label below */}
                <text x={pos.x} y={pos.y + r + 10} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#AAB3BF">
                  {shortName(e.name)}
                </text>

                {/* Type label */}
                <text x={pos.x} y={pos.y + r + 18} textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#818B97">
                  {e.type.toUpperCase()}
                </text>

                {/* FLAGGED badge */}
                {e.flagged && (
                  <text x={pos.x + r + 2} y={pos.y - r + 2} fontSize="6" fontFamily="monospace" fill="#C96A6A">!</text>
                )}
              </g>
            );
          })}

          {/* Legend */}
          <text x="4" y="10" fontSize="5" fontFamily="monospace" fill="#818B97">
            <tspan fill="#C96A6A">--- suspicious</tspan>
            <tspan dx="8" fill="#4DB6D6">— normal</tspan>
          </text>
        </svg>
      </div>

      {/* Selected entity detail — compact */}
      {selectedData && (
        <div className="border-t border-d-border/30 pt-2 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono" style={{ color: entityColors[selectedData.type] }}>
              {entityIcons[selectedData.type]}
            </span>
            <span className="text-[10px] font-mono text-d-text font-bold">{selectedData.name}</span>
            {selectedData.flagged && <span className="text-[8px] font-mono text-d-danger px-1 py-0.5 rounded bg-d-danger/10 border border-d-danger/20">FLAGGED</span>}
          </div>
          <div className="text-[9px] text-d-sub mb-1">{selectedData.role}</div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            <span className="text-[8px] text-d-muted">Risk: <span className={`font-mono ${selectedData.riskScore > 0.5 ? 'text-d-danger' : 'text-d-sub'}`}>{Math.round(selectedData.riskScore * 100)}%</span></span>
            {Object.entries(selectedData.metadata).slice(0, 3).map(([k, v]) => (
              <span key={k} className="text-[8px] text-d-muted">{k}: <span className="font-mono text-d-sub">{String(v)}</span></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
