// ============================================================================
// DEEVO Monitor — Layer Control Panel (LEFT)
// Toggleable intelligence layers + scenario switcher.
// ============================================================================

import type { Layer, LayerId, Scenario, ScenarioId } from '../engine/types';
import { LAYERS, SCENARIOS } from '../engine/scenarios';

interface Props {
  activeLayers: LayerId[];
  activeScenario: ScenarioId;
  onToggleLayer: (id: LayerId) => void;
  onSetScenario: (id: ScenarioId) => void;
}

export function LayerPanel({ activeLayers, activeScenario, onToggleLayer, onSetScenario }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Scenarios */}
      <div>
        <div className="text-[10px] font-mono text-deevo-muted tracking-widest mb-2">SCENARIOS</div>
        <div className="flex flex-col gap-1.5">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => onSetScenario(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded border transition-all ${
                activeScenario === s.id
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                  : 'border-deevo-border bg-deevo-surface/50 text-deevo-text/70 hover:border-deevo-border hover:bg-deevo-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold truncate">{s.name}</div>
                  <div className="text-[9px] text-deevo-muted mt-0.5 line-clamp-2 leading-tight">{s.description}</div>
                </div>
              </div>
              {activeScenario === s.id && (
                <div className="mt-1.5 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-mono text-cyan-400 tracking-wider">ACTIVE</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-deevo-border/50" />

      {/* Layers */}
      <div>
        <div className="text-[10px] font-mono text-deevo-muted tracking-widest mb-2">INTELLIGENCE LAYERS</div>
        <div className="flex flex-col gap-1">
          {LAYERS.map(layer => {
            const isActive = activeLayers.includes(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => onToggleLayer(layer.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded border transition-all ${
                  isActive
                    ? 'border-opacity-30 bg-opacity-10 text-white'
                    : 'border-deevo-border/30 bg-transparent text-deevo-muted hover:text-deevo-text/70'
                }`}
                style={{
                  borderColor: isActive ? layer.color + '4d' : undefined,
                  backgroundColor: isActive ? layer.color + '15' : undefined,
                }}
              >
                <span className="text-sm">{layer.icon}</span>
                <span className="text-xs font-mono flex-1 text-left">{layer.label}</span>
                <div
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: isActive ? layer.color : '#334155' }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-deevo-border/50" />

      {/* Legend */}
      <div>
        <div className="text-[10px] font-mono text-deevo-muted tracking-widest mb-2">RISK LEVELS</div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Critical', color: '#ef4444', range: '75–100%' },
            { label: 'High', color: '#f59e0b', range: '50–75%' },
            { label: 'Moderate', color: '#06b6d4', range: '30–50%' },
            { label: 'Low', color: '#22c55e', range: '0–30%' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] font-mono text-deevo-muted flex-1">{l.label}</span>
              <span className="text-[9px] font-mono text-deevo-muted/60">{l.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
