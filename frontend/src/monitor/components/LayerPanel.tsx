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
        <div className="text-[10px] font-mono text-d-muted tracking-widest mb-2">SCENARIOS</div>
        <div className="flex flex-col gap-1.5">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => onSetScenario(s.id)}
              className={`w-full text-left px-3 py-2.5 rounded border transition-all ${
                activeScenario === s.id
                  ? 'border-d-blue/50 bg-d-blue/10 text-d-blue'
                  : 'border-d-border bg-d-surface/50 text-d-text/70 hover:border-d-border hover:bg-d-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold truncate">{s.name}</div>
                  <div className="text-[9px] text-d-muted mt-0.5 line-clamp-2 leading-tight">{s.description}</div>
                </div>
              </div>
              {activeScenario === s.id && (
                <div className="mt-1.5 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-d-blue" />
                  <span className="text-[8px] font-mono text-d-blue tracking-wider">ACTIVE</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-d-border/30" />

      {/* Layers */}
      <div>
        <div className="text-[10px] font-mono text-d-muted tracking-widest mb-2">INTELLIGENCE LAYERS</div>
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
                    : 'border-d-border/30 bg-transparent text-d-muted hover:text-d-text/70'
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
                  style={{ backgroundColor: isActive ? layer.color : '#39414C' }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-d-border/30" />

      {/* Legend */}
      <div>
        <div className="text-[10px] font-mono text-d-muted tracking-widest mb-2">RISK LEVELS</div>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Critical', color: '#C96A6A', range: '75–100%' },
            { label: 'High', color: '#D6A24A', range: '50–75%' },
            { label: 'Moderate', color: '#4DB6D6', range: '30–50%' },
            { label: 'Low', color: '#67B58A', range: '0–30%' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2 px-3 py-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] font-mono text-d-muted flex-1">{l.label}</span>
              <span className="text-[9px] font-mono text-d-muted/60">{l.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
