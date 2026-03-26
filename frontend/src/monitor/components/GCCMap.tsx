// ============================================================================
// DEEVO Monitor — Interactive GCC Map (HERO COMPONENT)
// SVG-based network visualization of 6 GCC countries with causal edges.
// Every element is interactive and state-driven.
// ============================================================================

import { useState } from 'react';
import type { CountryCode, CountryIntel, CausalGraph } from '../engine/types';

interface Props {
  countries: CountryIntel[];
  graph: CausalGraph;
  selectedCountry: CountryCode | null;
  selectedEdge: { source: string; target: string } | null;
  onSelectCountry: (code: CountryCode | null) => void;
  onSelectEdge: (edge: { source: string; target: string } | null) => void;
}

// GCC country positions on the map (Arabian Peninsula layout)
const COUNTRY_POSITIONS: Record<CountryCode, { x: number; y: number }> = {
  KW: { x: 195, y: 85 },
  BH: { x: 255, y: 135 },
  QA: { x: 280, y: 170 },
  SA: { x: 160, y: 210 },
  AE: { x: 320, y: 220 },
  OM: { x: 370, y: 290 },
};

// Edges between countries (trade/risk corridors)
const COUNTRY_EDGES: { from: CountryCode; to: CountryCode }[] = [
  { from: 'SA', to: 'AE' },
  { from: 'SA', to: 'KW' },
  { from: 'SA', to: 'QA' },
  { from: 'SA', to: 'BH' },
  { from: 'AE', to: 'QA' },
  { from: 'AE', to: 'OM' },
  { from: 'KW', to: 'BH' },
  { from: 'QA', to: 'BH' },
];

function riskColor(score: number): string {
  if (score >= 0.75) return '#C96A6A';
  if (score >= 0.5) return '#D6A24A';
  if (score >= 0.3) return '#4DB6D6';
  return '#67B58A';
}

export function GCCMap({ countries, graph, selectedCountry, selectedEdge, onSelectCountry, onSelectEdge }: Props) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryCode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const getCountry = (code: CountryCode) => countries.find(c => c.code === code);

  // Map graph node intensities to edge widths
  const getEdgeIntensity = (from: CountryCode, to: CountryCode): number => {
    const c1 = getCountry(from);
    const c2 = getCountry(to);
    if (!c1 || !c2) return 0.3;
    return (c1.riskScore + c2.riskScore) / 2;
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Background glow — subtle radial gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-800/5 via-transparent to-transparent" />

      <svg
        viewBox="0 0 520 400"
        className="w-full h-full max-h-[500px]"
        style={{ filter: 'drop-shadow(0 0 40px rgba(93,139,255,0.06))' }}
      >
        <defs>
          {/* Pulse animation */}
          <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5D8BFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5D8BFF" stopOpacity="0" />
          </radialGradient>
          {/* Edge gradient */}
          <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5D8BFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5D8BFF" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="edgeGradDim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#39414C" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#39414C" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="260" y="28" textAnchor="middle" fill="#5D8BFF" fontSize="11" fontFamily="monospace" letterSpacing="3" opacity="0.7">
          GCC INTELLIGENCE NETWORK
        </text>

        {/* Edges */}
        {COUNTRY_EDGES.map(({ from, to }) => {
          const p1 = COUNTRY_POSITIONS[from];
          const p2 = COUNTRY_POSITIONS[to];
          const intensity = getEdgeIntensity(from, to);
          const isSelected = selectedEdge?.source === from && selectedEdge?.target === to;
          const isHovered = hoveredEdge === `${from}-${to}`;
          const active = intensity > 0.35;
          const edgeKey = `${from}-${to}`;

          return (
            <g key={edgeKey}>
              {/* Clickable hit area */}
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="transparent" strokeWidth="16"
                className="cursor-pointer"
                onClick={() => onSelectEdge(isSelected ? null : { source: from, target: to })}
                onMouseEnter={() => setHoveredEdge(edgeKey)}
                onMouseLeave={() => setHoveredEdge(null)}
              />
              {/* Visible edge */}
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={isSelected || isHovered ? '#5D8BFF' : active ? 'url(#edgeGradActive)' : 'url(#edgeGradDim)'}
                strokeWidth={isSelected ? 3 : isHovered ? 2.5 : active ? 1.5 : 0.8}
                strokeDasharray={active ? 'none' : '4 4'}
                opacity={isSelected ? 1 : isHovered ? 0.9 : active ? 0.6 : 0.25}
              />
              {/* Data flow particles on active edges */}
              {active && (
                <circle r="2.5" fill="#5D8BFF" opacity="0.8">
                  <animateMotion
                    dur={`${3 - intensity * 1.5}s`}
                    repeatCount="indefinite"
                    path={`M${p1.x},${p1.y} L${p2.x},${p2.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Country nodes */}
        {Object.entries(COUNTRY_POSITIONS).map(([code, pos]) => {
          const country = getCountry(code as CountryCode);
          const risk = country?.riskScore ?? 0.3;
          const isSelected = selectedCountry === code;
          const isHovered = hoveredCountry === code;
          const radius = 18 + risk * 14;
          const color = riskColor(risk);

          return (
            <g
              key={code}
              className="cursor-pointer"
              onClick={() => onSelectCountry(isSelected ? null : code as CountryCode)}
              onMouseEnter={() => setHoveredCountry(code as CountryCode)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {/* Pulse ring */}
              <circle cx={pos.x} cy={pos.y} r={radius + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.2">
                <animate attributeName="r" values={`${radius + 4};${radius + 16};${radius + 4}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Outer ring */}
              <circle
                cx={pos.x} cy={pos.y} r={radius}
                fill="none"
                stroke={color}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={isSelected || isHovered ? 0.9 : 0.5}
              />

              {/* Inner fill */}
              <circle
                cx={pos.x} cy={pos.y} r={radius - 3}
                fill={color}
                opacity={isSelected ? 0.25 : isHovered ? 0.18 : 0.1}
              />

              {/* Country code — brighter outline when selected/hovered */}
              <text
                x={pos.x} y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected || isHovered ? '#ffffff' : color}
                fontSize={isSelected ? "15" : "13"}
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="1"
                style={isSelected || isHovered ? { filter: 'drop-shadow(0 0 4px rgba(93,139,255,0.6))' } : undefined}
              >
                {code}
              </text>

              {/* Risk score badge */}
              <text
                x={pos.x} y={pos.y + radius + 14}
                textAnchor="middle"
                fill={color}
                fontSize="9"
                fontFamily="monospace"
                opacity={isSelected || isHovered ? 1 : 0.6}
              >
                {(risk * 100).toFixed(0)}%
              </text>

              {/* Hover tooltip */}
              {isHovered && country && (
                <g>
                  <rect
                    x={pos.x - 75} y={pos.y - radius - 50}
                    width="150" height="40" rx="4"
                    fill="#232830" stroke="#39414C" strokeWidth="1"
                    opacity="0.95"
                  />
                  <text x={pos.x} y={pos.y - radius - 36} textAnchor="middle" fill="#E5EAF0" fontSize="10" fontFamily="monospace">
                    {country.name}
                  </text>
                  <text x={pos.x} y={pos.y - radius - 22} textAnchor="middle" fill="#818B97" fontSize="9" fontFamily="monospace">
                    GWP: ${country.insuranceGwp}B · Risk: {(country.riskScore * 100).toFixed(0)}%
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Causal graph overlay — smaller nodes in background */}
        <g opacity="0.3">
          {graph.nodes.map(node => (
            <circle
              key={node.id}
              cx={node.x + 20} cy={node.y + 30}
              r={3 + node.intensity * 4}
              fill={node.intensity > 0.6 ? '#C96A6A' : node.intensity > 0.3 ? '#D6A24A' : '#4DB6D6'}
              opacity={node.intensity * 0.6}
            />
          ))}
        </g>

        {/* Edge info tooltip */}
        {selectedEdge && (
          <g>
            <rect x="160" y="355" width="200" height="30" rx="4" fill="#232830" stroke="#5D8BFF" strokeWidth="1" opacity="0.9" />
            <text x="260" y="374" textAnchor="middle" fill="#5D8BFF" fontSize="10" fontFamily="monospace">
              {selectedEdge.source} → {selectedEdge.target} | Intensity: {(getEdgeIntensity(selectedEdge.source as CountryCode, selectedEdge.target as CountryCode) * 100).toFixed(0)}%
            </text>
          </g>
        )}
      </svg>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-d-success animate-pulse" />
        <span className="text-[10px] font-mono text-d-success/70 tracking-wider">LIVE</span>
      </div>
    </div>
  );
}
