'use client';

import React, { useState, useMemo } from 'react';
import type { EntityGraph, ClaimEntity, EntityLink } from '../engine/types';

interface Props {
  graph: EntityGraph;
  selectedEntity: string | null;
  onSelectEntity: (id: string | null) => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  entity: ClaimEntity;
}

/**
 * Calculate circular layout positions for entities
 */
function calculateLayout(entities: ClaimEntity[], width: number, height: number): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 60;

  entities.forEach((entity, index) => {
    const angle = (index / entities.length) * Math.PI * 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.set(entity.id, {
      id: entity.id,
      x,
      y,
      entity,
    });
  });

  return positions;
}

/**
 * Get color for entity type
 */
function getEntityColor(type: string): string {
  const colors: Record<string, string> = {
    claimant: '#4DB6D6',      // d-cyan
    provider: '#C96A6A',      // d-danger
    policy: '#5D8BFF',        // d-blue
    adjuster: '#67B58A',      // d-success
    witness: '#D6A24A',       // d-amber
    broker: '#8B85C2',        // purple
    reinsurer: '#818B97',     // d-muted
  };
  return colors[type] || '#818B97';
}

/**
 * Entity node circle component
 */
function EntityNode({
  position,
  isSelected,
  isFlagged,
  onHover,
  onLeave,
  onClick,
}: {
  position: NodePosition;
  isSelected: boolean;
  isFlagged: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const color = getEntityColor(position.entity.type);
  const nodeRadius = 24;

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulsing ring for flagged entities */}
      {isFlagged && (
        <>
          <defs>
            <style>{`
              @keyframes pulse {
                0%, 100% { r: 30px; opacity: 0.8; }
                50% { r: 36px; opacity: 0.3; }
              }
            `}</style>
          </defs>
          <circle
            cx={position.x}
            cy={position.y}
            r="30"
            fill="none"
            stroke="#C96A6A"
            strokeWidth="1.5"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={position.x}
          cy={position.y}
          r={nodeRadius + 6}
          fill="none"
          stroke="#4DB6D6"
          strokeWidth="2"
        />
      )}

      {/* Main node */}
      <circle
        cx={position.x}
        cy={position.y}
        r={nodeRadius}
        fill={color}
        opacity={isSelected ? 1 : 0.85}
      />

      {/* Label */}
      <text
        x={position.x}
        y={position.y + nodeRadius + 16}
        textAnchor="middle"
        fontSize="9"
        fontFamily="monospace"
        fill="#AAB3BF"
        className="pointer-events-none"
      >
        {position.entity.name}
      </text>
    </g>
  );
}

/**
 * Entity link/edge line component
 */
function EntityLink({
  link,
  positions,
}: {
  link: EntityLink;
  positions: Map<string, NodePosition>;
}) {
  const sourcePos = positions.get(link.source);
  const targetPos = positions.get(link.target);

  if (!sourcePos || !targetPos) return null;

  const strokeDasharray = link.suspicious ? '4,4' : '0';
  const opacity = 0.3 + link.strength * 0.5; // 0.3–0.8

  return (
    <line
      x1={sourcePos.x}
      y1={sourcePos.y}
      x2={targetPos.x}
      y2={targetPos.y}
      stroke="#39414C"
      strokeWidth="1.5"
      strokeDasharray={strokeDasharray}
      opacity={opacity}
      pointerEvents="none"
    />
  );
}

/**
 * Detail card for selected entity
 */
function EntityDetailCard({ entity }: { entity: ClaimEntity }) {
  return (
    <div className="border-t border-d-border pt-3 mt-3">
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        <div>
          <div className="text-d-muted uppercase tracking-widest font-mono">Name</div>
          <div className="text-d-text font-mono mt-1">{entity.name}</div>
        </div>
        <div>
          <div className="text-d-muted uppercase tracking-widest font-mono">Type</div>
          <div className="text-d-text font-mono mt-1">{entity.type}</div>
        </div>
        <div>
          <div className="text-d-muted uppercase tracking-widest font-mono">Role</div>
          <div className="text-d-text font-mono mt-1">{entity.role}</div>
        </div>
        <div>
          <div className="text-d-muted uppercase tracking-widest font-mono">Risk Score</div>
          <div className="text-d-text font-mono mt-1">
            {(entity.riskScore * 100).toFixed(0)}%
          </div>
        </div>
        {entity.flagged && (
          <div className="col-span-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-d-danger" />
              <span className="text-d-danger uppercase tracking-widest font-mono">Flagged</span>
            </div>
          </div>
        )}
        {Object.keys(entity.metadata).length > 0 && (
          <div className="col-span-2 border-t border-d-border pt-2 mt-2">
            <div className="text-d-muted uppercase tracking-widest font-mono mb-2">
              Metadata
            </div>
            <div className="space-y-1">
              {Object.entries(entity.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-2">
                  <span className="text-d-sub">{key}:</span>
                  <span className="text-d-text font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Entity Graph Panel Component
 */
export function EntityGraphPanel(props: Props) {
  const { graph, selectedEntity, onSelectEntity } = props;
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);

  const svgWidth = 600;
  const svgHeight = 400;

  const positions = useMemo(
    () => calculateLayout(graph.entities, svgWidth, svgHeight),
    [graph.entities, svgWidth, svgHeight]
  );

  const selectedEntityData = selectedEntity
    ? graph.entities.find((e) => e.id === selectedEntity)
    : null;

  return (
    <div className="rounded-lg border border-d-border bg-d-surface p-3 h-full flex flex-col">
      {/* Header */}
      <div className="text-[9px] font-mono text-d-muted tracking-widest uppercase mb-3">
        Entity Network
      </div>

      {/* SVG Graph Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden rounded">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full bg-d-bg"
          style={{ maxHeight: selectedEntityData ? '300px' : 'auto' }}
        >
          {/* Links (drawn first, behind nodes) */}
          <g>
            {graph.links.map((link, idx) => (
              <EntityLink key={idx} link={link} positions={positions} />
            ))}
          </g>

          {/* Entities (drawn on top) */}
          <g>
            {graph.entities.map((entity) => {
              const position = positions.get(entity.id);
              if (!position) return null;

              return (
                <EntityNode
                  key={entity.id}
                  position={position}
                  isSelected={selectedEntity === entity.id}
                  isFlagged={entity.flagged}
                  onHover={() => setHoveredEntity(entity.id)}
                  onLeave={() => setHoveredEntity(null)}
                  onClick={() =>
                    onSelectEntity(selectedEntity === entity.id ? null : entity.id)
                  }
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Entity Detail Card */}
      {selectedEntityData && (
        <EntityDetailCard entity={selectedEntityData} />
      )}
    </div>
  );
}
