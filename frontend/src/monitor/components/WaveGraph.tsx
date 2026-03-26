// ============================================================================
// DEEVO Monitor — Causal Wave Graph (Animated)
// Renders the causal network with live wave propagation using rAF.
// Replaces/overlays on top of the GCC map as a simulation layer.
// ============================================================================

import { useEffect, useRef, useCallback, useState } from 'react';
import { WaveEngine } from '../engine/wave';
import type { WaveState, NodeActivation, EdgeFlow } from '../engine/wave';
import type { ScenarioId } from '../engine/types';

interface Props {
  scenario: ScenarioId;
  isLive: boolean;
  speed: number;           // 1, 2, or 5
  onNodeClick?: (nodeId: string) => void;
}

// Node positions in SVG space
const NODE_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  oil_price:      { x: 110, y: 70,  label: 'Oil Price' },
  inflation:      { x: 300, y: 50,  label: 'Inflation' },
  interest_rates: { x: 470, y: 90,  label: 'Interest Rates' },
  supply_chain:   { x: 420, y: 190, label: 'Supply Chain' },
  claims_cost:    { x: 220, y: 200, label: 'Claims Cost' },
  fraud_activity: { x: 120, y: 320, label: 'Fraud Activity' },
  investigation:  { x: 350, y: 310, label: 'Investigation' },
  reserves:       { x: 500, y: 280, label: 'Reserve Pressure' },
};

const EDGE_DEFS = [
  { source: 'oil_price',      target: 'inflation' },
  { source: 'oil_price',      target: 'supply_chain' },
  { source: 'inflation',      target: 'claims_cost' },
  { source: 'inflation',      target: 'interest_rates' },
  { source: 'claims_cost',    target: 'fraud_activity' },
  { source: 'claims_cost',    target: 'reserves' },
  { source: 'supply_chain',   target: 'claims_cost' },
  { source: 'fraud_activity', target: 'investigation' },
  { source: 'interest_rates', target: 'reserves' },
];

function nodeColor(level: number): string {
  if (level > 0.7) return '#C96A6A';
  if (level > 0.4) return '#D6A24A';
  if (level > 0.15) return '#4DB6D6';
  return '#39414C';
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function WaveGraph({ scenario, isLive, speed, onNodeClick }: Props) {
  const engineRef = useRef(new WaveEngine());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [waveState, setWaveState] = useState<WaveState | null>(null);
  const [highlightPath, setHighlightPath] = useState<string | null>(null);

  // Scenario change → reset
  useEffect(() => {
    engineRef.current.setScenario(scenario);
  }, [scenario]);

  // Speed change
  useEffect(() => {
    engineRef.current.setSpeed(speed);
  }, [speed]);

  // Animation loop using requestAnimationFrame
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = Math.min(time - lastTimeRef.current, 100); // cap at 100ms
    lastTimeRef.current = time;

    const state = engineRef.current.update(delta);
    setWaveState(state);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isLive) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLive, animate]);

  // Compute downstream path from a node
  const getDownstream = (nodeId: string): Set<string> => {
    const visited = new Set<string>();
    const queue = [nodeId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      for (const e of EDGE_DEFS) {
        if (e.source === current && !visited.has(e.target)) {
          queue.push(e.target);
        }
      }
    }
    return visited;
  };

  const handleNodeClick = (nodeId: string) => {
    setHighlightPath(prev => prev === nodeId ? null : nodeId);
    onNodeClick?.(nodeId);
  };

  const highlightedNodes = highlightPath ? getDownstream(highlightPath) : null;

  const nodeActivations = waveState?.nodeActivations ?? new Map<string, NodeActivation>();
  const edgeFlows = waveState?.edgeFlows ?? new Map<string, EdgeFlow>();
  const timeline = waveState?.timeline ?? [];

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Main SVG canvas */}
      <div className="flex-1 relative min-h-0">
        <svg viewBox="0 0 600 400" className="w-full h-full">
          <defs>
            {/* Glow filter */}
            <filter id="waveGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Title */}
          <text x="300" y="22" textAnchor="middle" fill="#5D8BFF" fontSize="10" fontFamily="monospace" letterSpacing="3" opacity="0.5">
            CAUSAL PROPAGATION ENGINE
          </text>

          {/* Edges */}
          {EDGE_DEFS.map(({ source, target }) => {
            const p1 = NODE_POSITIONS[source];
            const p2 = NODE_POSITIONS[target];
            if (!p1 || !p2) return null;
            const key = `${source}->${target}`;
            const flow = edgeFlows.get(key);
            const intensity = flow?.intensity ?? 0;
            const isHighlighted = highlightedNodes?.has(source) && highlightedNodes?.has(target);
            const dimmed = highlightedNodes && !isHighlighted;

            return (
              <g key={key} opacity={dimmed ? 0.15 : 1}>
                {/* Base edge */}
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={intensity > 0.3 ? '#4DB6D6' : '#39414C'}
                  strokeWidth={1 + intensity * 2.5}
                  opacity={0.2 + intensity * 0.6}
                  strokeDasharray={intensity < 0.1 ? '4 6' : 'none'}
                />

                {/* Active glow edge */}
                {intensity > 0.2 && (
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    stroke={intensity > 0.5 ? '#D6A24A' : '#4DB6D6'}
                    strokeWidth={intensity * 4}
                    opacity={intensity * 0.3}
                  />
                )}

                {/* Wave particles traveling along edge */}
                {flow?.particles.map(particle => {
                  const px = lerp(p1.x, p2.x, particle.progress);
                  const py = lerp(p1.y, p2.y, particle.progress);
                  return (
                    <g key={particle.id}>
                      {/* Trail */}
                      <circle
                        cx={px} cy={py}
                        r={3 + particle.strength * 5}
                        fill={particle.strength > 0.5 ? '#D6A24A' : '#4DB6D6'}
                        opacity={particle.strength * 0.4}
                      />
                      {/* Core */}
                      <circle
                        cx={px} cy={py}
                        r={2 + particle.strength * 2}
                        fill="#ffffff"
                        opacity={particle.strength * 0.9}
                      />
                    </g>
                  );
                })}

                {/* Direction arrow at midpoint */}
                {intensity > 0.1 && (
                  <polygon
                    points={arrowPoints(p1, p2)}
                    fill={intensity > 0.5 ? '#D6A24A' : '#4DB6D6'}
                    opacity={0.4 + intensity * 0.4}
                  />
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {Object.entries(NODE_POSITIONS).map(([id, pos]) => {
            const activation = nodeActivations.get(id);
            const level = activation?.level ?? 0;
            const peak = activation?.peakLevel ?? 0;
            const phase = activation?.pulsePhase ?? 0;
            const color = nodeColor(level);
            const isHighlighted = !highlightedNodes || highlightedNodes.has(id);
            const dimmed = highlightedNodes && !isHighlighted;
            const baseRadius = 18;
            const pulseRadius = baseRadius + Math.sin(phase) * level * 6;

            return (
              <g
                key={id}
                className="cursor-pointer"
                onClick={() => handleNodeClick(id)}
                opacity={dimmed ? 0.2 : 1}
              >
                {/* Activation burst ring */}
                {level > 0.3 && (
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={pulseRadius + 15}
                    fill="none"
                    stroke={color}
                    strokeWidth="1"
                    opacity={level * 0.3 * (0.5 + 0.5 * Math.sin(phase * 2))}
                  />
                )}

                {/* Glow halo */}
                {level > 0.15 && (
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={pulseRadius + 8}
                    fill={color}
                    opacity={level * 0.12}
                  />
                )}

                {/* Outer ring */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={pulseRadius}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5 + level}
                  opacity={0.5 + level * 0.5}
                />

                {/* Inner fill */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={pulseRadius - 3}
                  fill={color}
                  opacity={0.08 + level * 0.2}
                />

                {/* Center dot */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={3 + level * 4}
                  fill={color}
                  opacity={0.6 + level * 0.4}
                />

                {/* Label */}
                <text
                  x={pos.x} y={pos.y - pulseRadius - 6}
                  textAnchor="middle"
                  fill={level > 0.3 ? '#ffffff' : '#AAB3BF'}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight={level > 0.3 ? 'bold' : 'normal'}
                >
                  {pos.label}
                </text>

                {/* Activation level badge */}
                {level > 0.05 && (
                  <text
                    x={pos.x} y={pos.y + 5}
                    textAnchor="middle"
                    fill={color}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {(level * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Timeline bar at bottom */}
      <div className="flex-shrink-0 h-16 border-t border-d-border/30 bg-d-bg/80 px-3 py-1 overflow-hidden">
        <div className="text-[8px] font-mono text-d-muted tracking-widest mb-1">PROPAGATION TIMELINE</div>
        <div className="flex gap-1 overflow-x-auto items-center h-8">
          {timeline.slice(-15).map((evt, i) => {
            const color = nodeColor(evt.strength);
            return (
              <div
                key={`${evt.tick}-${evt.nodeId}-${i}`}
                className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded border"
                style={{ borderColor: color + '40', backgroundColor: color + '10' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[8px] font-mono whitespace-nowrap" style={{ color }}>
                  t+{evt.tick} {evt.label}
                </span>
              </div>
            );
          })}
          {timeline.length === 0 && (
            <span className="text-[9px] font-mono text-d-muted/40">Awaiting propagation...</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: compute arrow points at midpoint of an edge
function arrowPoints(p1: { x: number; y: number }, p2: { x: number; y: number }): string {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const px = -ny;
  const py = nx;
  const size = 4;
  return `${mx + nx * size},${my + ny * size} ${mx + px * size * 0.6},${my + py * size * 0.6} ${mx - px * size * 0.6},${my - py * size * 0.6}`;
}
