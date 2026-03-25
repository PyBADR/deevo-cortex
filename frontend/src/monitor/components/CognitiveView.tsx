// ============================================================================
// DEEVO Monitor — Cognitive View
// Renders multiple competing causal paths with dominant path highlighted.
// Users can click paths to switch, compare, and replay.
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { CognitiveEngine } from '../engine/cognitive';
import type { CognitiveState, CausalPath, PathNode } from '../engine/cognitive';
import type { Signal, ScenarioId, DecisionType } from '../engine/types';

interface Props {
  signals: Signal[];
  scenario: ScenarioId;
  isLive: boolean;
}

// Node positions for the cognitive graph (wider layout for paths)
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  oil_price:       { x: 60,  y: 175 },
  inflation:       { x: 200, y: 80 },
  interest_rates:  { x: 370, y: 45 },
  supply_chain:    { x: 200, y: 270 },
  logistics:       { x: 370, y: 290 },
  claims_cost:     { x: 370, y: 175 },
  fraud_activity:  { x: 520, y: 110 },
  investigation:   { x: 630, y: 65 },
  reserves:        { x: 520, y: 240 },
  policy_response: { x: 120, y: 45 },
  regulatory:      { x: 630, y: 175 },
};

const DECISION_COLORS: Record<DecisionType, string> = {
  ESCALATE: '#ef4444',
  REVIEW: '#f59e0b',
  APPROVE: '#22c55e',
};

export function CognitiveView({ signals, scenario, isLive }: Props) {
  const engineRef = useRef(new CognitiveEngine());
  const [cogState, setCogState] = useState<CognitiveState | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const rafRef = useRef<number>(0);

  // Recompute when signals or scenario change
  useEffect(() => {
    engineRef.current.setScenario(scenario);
  }, [scenario]);

  useEffect(() => {
    if (signals.length > 0) {
      const state = engineRef.current.compute(signals);
      setCogState(state);
      if (!selectedPathId && state.dominantPath) {
        setSelectedPathId(state.dominantPath.id);
      }
    }
  }, [signals, scenario]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animation loop for path pulse effects
  const animate = useCallback((time: number) => {
    setAnimationPhase(time / 1000);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isLive) {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isLive, animate]);

  if (!cogState || cogState.paths.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-deevo-muted font-mono text-sm">Computing causal futures...</div>
      </div>
    );
  }

  const { paths, dominantPath, reasoning } = cogState;
  const activePath = paths.find(p => p.id === selectedPathId) ?? dominantPath;
  const displayedPath = paths.find(p => p.id === hoveredPathId) ?? activePath;

  return (
    <div className="flex flex-col h-full">
      {/* Top: Path selector */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 border-b border-deevo-border/20 overflow-x-auto">
        {paths.map(path => {
          const isActive = path.id === selectedPathId;
          const isDom = path.isDominant;
          return (
            <button
              key={path.id}
              onClick={() => { setSelectedPathId(path.id); setShowComparison(false); }}
              onMouseEnter={() => setHoveredPathId(path.id)}
              onMouseLeave={() => setHoveredPathId(null)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono transition-all ${
                isActive
                  ? 'bg-opacity-15 border-opacity-40 text-white'
                  : 'border-deevo-border/30 text-deevo-muted hover:text-deevo-text bg-transparent'
              }`}
              style={{
                borderColor: isActive ? path.color + '66' : undefined,
                backgroundColor: isActive ? path.color + '18' : undefined,
                color: isActive ? path.color : undefined,
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: path.color, opacity: isActive ? 1 : 0.4 }} />
              <span className="whitespace-nowrap">{path.name}</span>
              <span className="text-[8px] opacity-60">{(path.probability * 100).toFixed(0)}%</span>
              {isDom && <span className="text-[7px] px-1 py-0 rounded bg-white/10 text-white/70">DOM</span>}
            </button>
          );
        })}
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`flex-shrink-0 px-2.5 py-1 rounded-md border text-[10px] font-mono transition-all ${
            showComparison
              ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
              : 'border-deevo-border/30 text-deevo-muted hover:text-deevo-text'
          }`}
        >
          COMPARE
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Path graph */}
        <div className={`${showComparison ? 'w-1/2' : 'flex-1'} min-h-0 relative`}>
          <svg viewBox="0 0 720 350" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.05))' }}>
            <defs>
              <filter id="cogGlow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="cogStrongGlow">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <text x="360" y="18" textAnchor="middle" fill="#06b6d4" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.4">
              COGNITIVE FUTURE PATHS
            </text>

            {/* Render ALL path edges (dimmed) */}
            {paths.filter(p => p.id !== displayedPath?.id).map(path => (
              <g key={`bg-${path.id}`} opacity={0.08}>
                {renderPathEdges(path, NODE_POSITIONS, path.color, false, 0)}
              </g>
            ))}

            {/* Render selected path edges (bright) */}
            {displayedPath && (
              <g opacity={1}>
                {renderPathEdges(displayedPath, NODE_POSITIONS, displayedPath.color, true, animationPhase)}
              </g>
            )}

            {/* Render all nodes */}
            {Object.entries(NODE_POSITIONS).map(([id, pos]) => {
              const inPath = displayedPath?.sequence.some(n => n.nodeId === id);
              const pathNode = displayedPath?.sequence.find(n => n.nodeId === id);
              const activation = pathNode?.activation ?? 0;
              const nodeColor = inPath ? (displayedPath?.color ?? '#06b6d4') : '#1e293b';

              return (
                <g key={id} opacity={inPath ? 1 : 0.2}>
                  {/* Glow */}
                  {inPath && activation > 0.3 && (
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={20 + Math.sin(animationPhase * 2 + (pathNode?.step ?? 0)) * 4}
                      fill={nodeColor} opacity={activation * 0.1}
                      filter="url(#cogStrongGlow)"
                    />
                  )}
                  {/* Ring */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={16}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth={inPath ? 2 : 0.5}
                    opacity={inPath ? 0.8 : 0.3}
                  />
                  {/* Fill */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={13}
                    fill={nodeColor}
                    opacity={inPath ? 0.12 + activation * 0.15 : 0.05}
                  />
                  {/* Step number */}
                  {inPath && pathNode && (
                    <text
                      x={pos.x} y={pos.y + 4}
                      textAnchor="middle" fill={nodeColor}
                      fontSize="12" fontFamily="monospace" fontWeight="bold"
                    >
                      {pathNode.step + 1}
                    </text>
                  )}
                  {/* Label */}
                  <text
                    x={pos.x} y={pos.y - 22}
                    textAnchor="middle"
                    fill={inPath ? '#e2e8f0' : '#475569'}
                    fontSize="8" fontFamily="monospace"
                    fontWeight={inPath ? 'bold' : 'normal'}
                  >
                    {NODE_LABELS_SHORT[id] ?? id}
                  </text>
                  {/* Activation % */}
                  {inPath && activation > 0 && (
                    <text
                      x={pos.x} y={pos.y + 28}
                      textAnchor="middle" fill={nodeColor}
                      fontSize="8" fontFamily="monospace" opacity="0.7"
                    >
                      {(activation * 100).toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Decision badge */}
            {displayedPath && (
              <g>
                <rect x="590" y="290" width="110" height="40" rx="6"
                  fill={DECISION_COLORS[displayedPath.decision] + '15'}
                  stroke={DECISION_COLORS[displayedPath.decision] + '40'}
                  strokeWidth="1"
                />
                <text x="645" y="307" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                  PATH DECISION
                </text>
                <text x="645" y="323" textAnchor="middle"
                  fill={DECISION_COLORS[displayedPath.decision]}
                  fontSize="13" fontFamily="monospace" fontWeight="bold"
                >
                  {displayedPath.decision}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Right: Comparison panel (conditional) */}
        {showComparison && (
          <div className="w-1/2 border-l border-deevo-border/30 p-3 overflow-y-auto">
            <div className="text-[9px] font-mono text-cyan-400 tracking-widest mb-2">PATH COMPARISON</div>
            <div className="space-y-2">
              {paths.map(path => (
                <div
                  key={path.id}
                  className={`rounded-lg border p-2.5 cursor-pointer transition-all ${
                    path.id === selectedPathId ? 'border-opacity-40' : 'border-deevo-border/20 hover:border-deevo-border/40'
                  }`}
                  style={{
                    borderColor: path.id === selectedPathId ? path.color + '66' : undefined,
                    backgroundColor: path.id === selectedPathId ? path.color + '08' : undefined,
                  }}
                  onClick={() => { setSelectedPathId(path.id); }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: path.color }} />
                      <span className="text-[10px] font-mono font-semibold" style={{ color: path.color }}>
                        {path.name}
                      </span>
                      {path.isDominant && (
                        <span className="text-[7px] px-1 py-0 rounded bg-white/10 text-white/60 font-mono">DOMINANT</span>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{ color: DECISION_COLORS[path.decision], backgroundColor: DECISION_COLORS[path.decision] + '15' }}
                    >
                      {path.decision}
                    </span>
                  </div>

                  {/* Metrics row */}
                  <div className="grid grid-cols-3 gap-2 mb-1.5">
                    <div>
                      <div className="text-[7px] font-mono text-deevo-muted">PROBABILITY</div>
                      <div className="text-xs font-mono font-bold" style={{ color: path.color }}>
                        {(path.probability * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[7px] font-mono text-deevo-muted">IMPACT</div>
                      <div className="text-xs font-mono font-bold text-deevo-text">
                        {(path.impactScore * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[7px] font-mono text-deevo-muted">RISK</div>
                      <div className="text-xs font-mono font-bold" style={{ color: DECISION_COLORS[path.decision] }}>
                        {(path.riskScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Path chain */}
                  <div className="flex items-center gap-0.5 flex-wrap">
                    {path.sequence.map((node, i) => (
                      <span key={i} className="flex items-center gap-0.5">
                        <span className="text-[8px] font-mono text-deevo-text/70">{node.label}</span>
                        {i < path.sequence.length - 1 && <span className="text-[8px] text-deevo-muted">→</span>}
                      </span>
                    ))}
                  </div>

                  {/* Probability bar */}
                  <div className="mt-1.5 h-1 bg-deevo-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${path.probability * 100}%`, backgroundColor: path.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Convergence metrics */}
            <div className="mt-3 rounded-lg border border-deevo-border/20 p-2.5">
              <div className="text-[8px] font-mono text-deevo-muted tracking-wider mb-1.5">SYSTEM METRICS</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[7px] font-mono text-deevo-muted">CONVERGENCE</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">
                    {(cogState.convergenceScore * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[7px] font-mono text-deevo-muted">UNCERTAINTY</div>
                  <div className="text-lg font-mono font-bold text-amber-400">
                    {(cogState.uncertaintyIndex * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Reasoning panel */}
      <div className="flex-shrink-0 border-t border-deevo-border/30 bg-deevo-bg/80 px-4 py-2 max-h-28 overflow-y-auto">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-mono text-cyan-400/60 tracking-widest mb-0.5">COGNITIVE REASONING</div>
            <div className="text-[10px] font-mono text-deevo-text/80 leading-relaxed">
              {reasoning.selectedBecause}
            </div>
            {reasoning.uncertaintyFactors.length > 0 && (
              <div className="mt-1 text-[9px] font-mono text-amber-400/70">
                Uncertainty: {reasoning.uncertaintyFactors.join('. ')}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 w-64">
            <div className="text-[8px] font-mono text-cyan-400/60 tracking-widest mb-0.5">RECOMMENDATION</div>
            <div className="text-[10px] font-mono text-deevo-text/90 leading-relaxed">
              {reasoning.recommendation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG Helpers
// ---------------------------------------------------------------------------

const NODE_LABELS_SHORT: Record<string, string> = {
  oil_price: 'Oil Price',
  inflation: 'Inflation',
  claims_cost: 'Claims',
  fraud_activity: 'Fraud',
  supply_chain: 'Supply Chain',
  interest_rates: 'Rates',
  investigation: 'Investigation',
  reserves: 'Reserves',
  policy_response: 'Policy',
  regulatory: 'Regulatory',
  logistics: 'Logistics',
};

function renderPathEdges(
  path: CausalPath,
  positions: Record<string, { x: number; y: number }>,
  color: string,
  animated: boolean,
  phase: number,
): JSX.Element[] {
  const elements: JSX.Element[] = [];
  const seq = path.sequence;

  for (let i = 0; i < seq.length - 1; i++) {
    const from = positions[seq[i].nodeId];
    const to = positions[seq[i + 1].nodeId];
    if (!from || !to) continue;

    const key = `${path.id}-${i}`;
    const activation = seq[i + 1].activation;

    // Edge line
    elements.push(
      <line
        key={`${key}-line`}
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={color}
        strokeWidth={animated ? 2 + activation * 2 : 1}
        opacity={animated ? 0.4 + activation * 0.4 : 0.3}
        strokeDasharray={animated ? 'none' : '3 5'}
        filter={animated && activation > 0.3 ? 'url(#cogGlow)' : undefined}
      />
    );

    // Animated particle
    if (animated) {
      const speed = 2 + i * 0.3;
      const progress = ((phase * speed + i * 1.5) % 3) / 3;
      const px = from.x + (to.x - from.x) * progress;
      const py = from.y + (to.y - from.y) * progress;

      elements.push(
        <g key={`${key}-particle`}>
          <circle cx={px} cy={py} r={3 + activation * 3} fill={color} opacity={activation * 0.3} filter="url(#cogGlow)" />
          <circle cx={px} cy={py} r={1.5 + activation} fill="#ffffff" opacity={0.8} />
        </g>
      );
    }

    // Arrow at midpoint
    if (animated) {
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / len;
      const ny = dy / len;
      const px = -ny;
      const py = nx;
      const sz = 3;

      elements.push(
        <polygon
          key={`${key}-arrow`}
          points={`${mx + nx * sz},${my + ny * sz} ${mx + px * sz * 0.6},${my + py * sz * 0.6} ${mx - px * sz * 0.6},${my - py * sz * 0.6}`}
          fill={color}
          opacity={0.5}
        />
      );
    }
  }

  return elements;
}
