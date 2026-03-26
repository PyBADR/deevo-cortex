// ============================================================================
// DEEVO Monitor — Pre-Causal View
// Visualizes pressure fields, emerging signals, and narrative events
// BEFORE they become actual signals. Early-warning intelligence.
// ============================================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { PreCausalEngine } from '../engine/precausal';
import type { PreCausalState, PressureField, EmergingSignal, NarrativeEvent, PressureDomain } from '../engine/precausal';
import type { Signal, ScenarioId } from '../engine/types';

interface Props {
  signals: Signal[];
  scenario: ScenarioId;
  isLive: boolean;
}

const DOMAIN_COLORS: Record<PressureDomain, string> = {
  oil_instability:     '#D6A24A',
  inflation_pressure:  '#C96A6A',
  claims_surge:        '#4DB6D6',
  fraud_emergence:     '#E97C7C',
  supply_stress:       '#8B85C2',
  regulatory_shift:    '#5D8BFF',
  geopolitical_tension: '#E85D5D',
  market_sentiment:    '#67B58A',
};

// Pressure field positions in a radial layout
const FIELD_POSITIONS: Record<PressureDomain, { x: number; y: number }> = {
  oil_instability:      { x: 180, y: 80 },
  inflation_pressure:   { x: 360, y: 60 },
  claims_surge:         { x: 510, y: 120 },
  fraud_emergence:      { x: 560, y: 260 },
  supply_stress:        { x: 460, y: 340 },
  regulatory_shift:     { x: 280, y: 350 },
  geopolitical_tension: { x: 100, y: 280 },
  market_sentiment:     { x: 80,  y: 160 },
};

export function PreCausalView({ signals, scenario, isLive }: Props) {
  const engineRef = useRef(new PreCausalEngine());
  const [pcState, setPcState] = useState<PreCausalState | null>(null);
  const [selectedField, setSelectedField] = useState<PressureDomain | null>(null);
  const [animPhase, setAnimPhase] = useState(0);
  const rafRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    engineRef.current.setScenario(scenario);
  }, [scenario]);

  // Tick the engine periodically
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isLive) {
      intervalRef.current = setInterval(() => {
        const state = engineRef.current.update(signals);
        setPcState(state);
      }, 2000);
      // Immediate first tick
      setPcState(engineRef.current.update(signals));
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLive, signals, scenario]);

  // Animation
  const animate = useCallback((t: number) => {
    setAnimPhase(t / 1000);
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isLive) rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isLive, animate]);

  if (!pcState) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-d-muted font-mono text-sm animate-pulse">Scanning for weak signals...</div>
      </div>
    );
  }

  const { pressureFields, emergingSignals, narrativeEvents, totalPressure, formingCount } = pcState;
  const selectedPF = selectedField ? pressureFields.find(f => f.domain === selectedField) : null;

  return (
    <div className="flex flex-col h-full">
      {/* Top metrics bar */}
      <div className="flex-shrink-0 flex items-center gap-4 px-3 py-1.5 border-b border-d-border/20">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#8B85C2] animate-pulse" />
          <span className="text-[9px] font-mono text-[#8B85C2] tracking-widest">PRE-CAUSAL SENSING</span>
        </div>
        <div className="text-[9px] font-mono text-d-muted">
          PRESSURE: <span className={`font-bold ${totalPressure > 0.3 ? 'text-[#D6A24A]' : 'text-d-text'}`}>
            {(totalPressure * 100).toFixed(0)}%
          </span>
        </div>
        <div className="text-[9px] font-mono text-d-muted">
          FORMING: <span className={`font-bold ${formingCount > 0 ? 'text-[#C96A6A]' : 'text-d-text'}`}>
            {formingCount}
          </span>
        </div>
        <div className="text-[9px] font-mono text-d-muted">
          SIGNALS: <span className="font-bold text-[#4DB6D6]">{emergingSignals.length}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Pressure field visualization */}
        <div className="flex-1 min-h-0 relative">
          <svg viewBox="0 0 650 420" className="w-full h-full">
            {/* No SVG filters — flat, clean rendering */}

            <text x="325" y="20" textAnchor="middle" fill="#8B85C2" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.4">
              PRESSURE FIELD MAP
            </text>

            {/* Connecting lines between related domains */}
            {renderPressureConnections(pressureFields, animPhase)}

            {/* Pressure fields */}
            {pressureFields.map(field => {
              const pos = FIELD_POSITIONS[field.domain];
              if (!pos) return null;
              const color = DOMAIN_COLORS[field.domain];
              const isSelected = selectedField === field.domain;
              const radius = 25 + field.intensity * 35;
              const pulseSize = field.forming
                ? radius + 15 + Math.sin(animPhase * 3) * 8
                : radius + 5;

              return (
                <g
                  key={field.domain}
                  className="cursor-pointer"
                  onClick={() => setSelectedField(isSelected ? null : field.domain)}
                >
                  {/* Outer pressure glow — the "forming risk" indicator */}
                  {field.forming && (
                    <>
                      <circle
                        cx={pos.x} cy={pos.y} r={pulseSize + 20}
                        fill={color} opacity={field.intensity * 0.04}
                      />
                      <circle
                        cx={pos.x} cy={pos.y} r={pulseSize}
                        fill="none" stroke={color}
                        strokeWidth="1" strokeDasharray="3 5"
                        opacity={0.3 + Math.sin(animPhase * 4) * 0.15}
                      />
                    </>
                  )}

                  {/* Pressure halo */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={radius + 8}
                    fill={color}
                    opacity={field.intensity * 0.06}
                  />

                  {/* Main ring */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={0.3 + field.intensity * 0.5}
                    strokeDasharray={field.forming ? 'none' : '4 4'}
                  />

                  {/* Inner fill */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={radius - 4}
                    fill={color}
                    opacity={0.03 + field.intensity * 0.08}
                  />

                  {/* Uncertainty ring (outer, dotted) */}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={radius + 2}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.5"
                    strokeDasharray={`${(1 - field.uncertainty) * 10} ${field.uncertainty * 10}`}
                    opacity="0.3"
                  />

                  {/* Domain label */}
                  <text
                    x={pos.x} y={pos.y - 5}
                    textAnchor="middle"
                    fill={field.intensity > 0.25 ? '#E5EAF0' : '#818B97'}
                    fontSize="8" fontFamily="monospace" fontWeight={field.forming ? 'bold' : 'normal'}
                  >
                    {field.label.toUpperCase()}
                  </text>

                  {/* Intensity */}
                  <text
                    x={pos.x} y={pos.y + 10}
                    textAnchor="middle" fill={color}
                    fontSize="14" fontFamily="monospace" fontWeight="bold"
                  >
                    {(field.intensity * 100).toFixed(0)}%
                  </text>

                  {/* Velocity indicator */}
                  {field.velocity > 0.02 && (
                    <text
                      x={pos.x} y={pos.y + 22}
                      textAnchor="middle" fill={color}
                      fontSize="8" fontFamily="monospace" opacity="0.7"
                    >
                      ↑ +{(field.velocity * 100).toFixed(0)}/s
                    </text>
                  )}

                  {/* Forming badge */}
                  {field.forming && (
                    <g>
                      <rect
                        x={pos.x - 22} y={pos.y + radius + 4}
                        width="44" height="14" rx="3"
                        fill={color + '25'} stroke={color + '50'}
                        strokeWidth="0.5"
                      />
                      <text
                        x={pos.x} y={pos.y + radius + 14}
                        textAnchor="middle" fill={color}
                        fontSize="7" fontFamily="monospace" fontWeight="bold"
                      >
                        FORMING
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Center label */}
            <text x="325" y="205" textAnchor="middle" fill="#818B97" fontSize="8" fontFamily="monospace">
              GCC RISK FIELD
            </text>
          </svg>
        </div>

        {/* Right: Detail panel */}
        <div className="w-72 flex-shrink-0 border-l border-d-border/30 p-3 overflow-y-auto">
          {/* Emerging Signals */}
          <div className="mb-3">
            <div className="text-[9px] font-mono text-[#8B85C2] tracking-widest mb-1.5">EMERGING SIGNALS</div>
            {emergingSignals.length === 0 ? (
              <div className="text-[9px] font-mono text-d-muted/40 py-2">No emerging signals detected</div>
            ) : (
              <div className="space-y-1.5">
                {emergingSignals.slice(0, 6).map(es => {
                  const color = DOMAIN_COLORS[es.type] ?? '#4DB6D6';
                  return (
                    <div
                      key={es.id}
                      className="rounded border p-2"
                      style={{ borderColor: color + '30', backgroundColor: color + '08' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold" style={{ color }}>{es.label}</span>
                        <span className="text-[8px] font-mono px-1 py-0 rounded" style={{ color, backgroundColor: color + '15' }}>
                          {(es.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      {/* Formation progress */}
                      <div className="h-1 bg-d-bg rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${es.formingPhase * 100}%`, backgroundColor: color }}
                        />
                      </div>
                      <div className="text-[8px] text-d-muted leading-tight">{es.explanation}</div>
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {es.feedsInto.map(f => (
                          <span key={f} className="text-[7px] font-mono px-1 py-0 rounded bg-white/5 text-d-muted/70">
                            → {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected field detail */}
          {selectedPF && (
            <div className="mb-3 rounded-lg border p-2.5" style={{ borderColor: DOMAIN_COLORS[selectedPF.domain] + '30' }}>
              <div className="text-[9px] font-mono tracking-widest mb-1" style={{ color: DOMAIN_COLORS[selectedPF.domain] }}>
                FIELD DETAIL
              </div>
              <div className="text-xs font-mono font-bold text-d-text mb-1">{selectedPF.label}</div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[7px] font-mono text-d-muted">INTENSITY</div>
                  <div className="text-sm font-mono font-bold" style={{ color: DOMAIN_COLORS[selectedPF.domain] }}>
                    {(selectedPF.intensity * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[7px] font-mono text-d-muted">VELOCITY</div>
                  <div className="text-sm font-mono font-bold text-[#D6A24A]">
                    {selectedPF.velocity > 0 ? '+' : ''}{(selectedPF.velocity * 100).toFixed(0)}
                  </div>
                </div>
                <div>
                  <div className="text-[7px] font-mono text-d-muted">UNCERTAIN</div>
                  <div className="text-sm font-mono font-bold text-d-muted">
                    {(selectedPF.uncertainty * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-d-muted leading-tight mb-2">{selectedPF.explanation}</div>
              {selectedPF.sources.length > 0 && (
                <div>
                  <div className="text-[7px] font-mono text-d-muted tracking-wider mb-1">SOURCES</div>
                  {selectedPF.sources.map((src, i) => (
                    <div key={i} className="flex items-start gap-1.5 mb-1">
                      <span className="text-[7px] font-mono px-1 rounded bg-white/5 text-d-muted/60 mt-0.5 flex-shrink-0">
                        {src.type}
                      </span>
                      <span className="text-[8px] text-d-muted leading-tight">{src.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Narrative Feed */}
          <div>
            <div className="text-[9px] font-mono text-d-muted tracking-widest mb-1.5">NARRATIVE FEED</div>
            <div className="space-y-1">
              {narrativeEvents.slice(-8).reverse().map(evt => {
                const color = DOMAIN_COLORS[evt.domain] ?? '#4DB6D6';
                return (
                  <div key={evt.id + evt.timestamp} className="flex items-start gap-1.5 py-1 border-b border-d-border/10">
                    <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: color }} />
                    <div className="min-w-0">
                      <div className="text-[9px] font-mono text-d-text/80 leading-tight">{evt.headline}</div>
                      <div className="text-[7px] font-mono text-d-muted/50 mt-0.5">
                        {evt.region} · sentiment: {evt.sentiment > 0 ? '+' : ''}{evt.sentiment.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {narrativeEvents.length === 0 && (
                <div className="text-[9px] font-mono text-d-muted/30 py-2">Monitoring narrative channels...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connection lines between related pressure fields
// ---------------------------------------------------------------------------
function renderPressureConnections(fields: PressureField[], phase: number): JSX.Element[] {
  const connections: [PressureDomain, PressureDomain][] = [
    ['oil_instability', 'inflation_pressure'],
    ['oil_instability', 'supply_stress'],
    ['inflation_pressure', 'claims_surge'],
    ['claims_surge', 'fraud_emergence'],
    ['supply_stress', 'claims_surge'],
    ['fraud_emergence', 'regulatory_shift'],
    ['geopolitical_tension', 'oil_instability'],
    ['market_sentiment', 'inflation_pressure'],
  ];

  return connections.map(([a, b], i) => {
    const pa = FIELD_POSITIONS[a];
    const pb = FIELD_POSITIONS[b];
    const fa = fields.find(f => f.domain === a);
    const fb = fields.find(f => f.domain === b);
    if (!pa || !pb || !fa || !fb) return <g key={i} />;

    const intensity = (fa.intensity + fb.intensity) / 2;
    const active = intensity > 0.2;

    return (
      <g key={i}>
        <line
          x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
          stroke={active ? '#8B85C2' : '#39414C'}
          strokeWidth={active ? 0.8 + intensity : 0.3}
          opacity={active ? 0.15 + intensity * 0.2 : 0.08}
          strokeDasharray={active ? 'none' : '2 6'}
        />
        {active && intensity > 0.3 && (
          <circle r="2" fill="#8B85C2" opacity={0.5}>
            <animateMotion
              dur={`${4 - intensity * 2}s`}
              repeatCount="indefinite"
              path={`M${pa.x},${pa.y} L${pb.x},${pb.y}`}
            />
          </circle>
        )}
      </g>
    );
  });
}
