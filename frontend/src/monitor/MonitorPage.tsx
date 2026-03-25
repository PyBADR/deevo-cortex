// ============================================================================
// DEEVO Monitor — Main Page
// Layout: Header → Signals → [Left: Layers | Center: Map/Wave | Right: AI+Alerts] → Blocks
// ============================================================================

import { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import { MonitorHeader } from './components/MonitorHeader';
import { SignalBar } from './components/SignalBar';
import { LayerPanel } from './components/LayerPanel';
import { GCCMap } from './components/GCCMap';
import { WaveGraph } from './components/WaveGraph';
import { AlertsRail } from './components/AlertsRail';
import { IntelBlocks } from './components/IntelBlocks';

type ViewMode = 'map' | 'wave';

export function MonitorPage() {
  const { state, actions } = useMonitor();
  const [viewMode, setViewMode] = useState<ViewMode>('wave');
  const [waveSpeed, setWaveSpeed] = useState(1);

  return (
    <div className="h-screen w-screen bg-deevo-bg text-deevo-text flex flex-col overflow-hidden">
      {/* Top: Header */}
      <MonitorHeader
        signals={state.signals}
        decision={state.decision}
        isLive={state.isLive}
        tickCount={state.tickCount}
        onToggleLive={actions.toggleLive}
      />

      {/* Signal Ticker Bar */}
      <div className="flex-shrink-0 border-b border-deevo-border/30 bg-deevo-bg/50">
        <SignalBar signals={state.signals} />
      </div>

      {/* Main Content: 3-column layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT: Layers + Scenarios */}
        <div className="w-56 flex-shrink-0 border-r border-deevo-border/30 p-3 overflow-y-auto">
          <LayerPanel
            activeLayers={state.activeLayers}
            activeScenario={state.activeScenario}
            onToggleLayer={actions.toggleLayer}
            onSetScenario={actions.setScenario}
          />
        </div>

        {/* CENTER: Map or Wave Simulation (HERO) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View mode toggle + speed controls */}
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-deevo-border/20">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                  viewMode === 'map'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-deevo-muted hover:text-deevo-text border border-transparent'
                }`}
              >
                GCC MAP
              </button>
              <button
                onClick={() => setViewMode('wave')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                  viewMode === 'wave'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-deevo-muted hover:text-deevo-text border border-transparent'
                }`}
              >
                WAVE SIM
              </button>
            </div>

            {/* Speed controls (only for wave mode) */}
            {viewMode === 'wave' && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-deevo-muted mr-1">SPEED</span>
                {[1, 2, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setWaveSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      waveSpeed === s
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'text-deevo-muted hover:text-deevo-text border border-deevo-border/30'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View content */}
          <div className="flex-1 min-h-0 p-2">
            {viewMode === 'map' ? (
              <GCCMap
                countries={state.countries}
                graph={state.graph}
                selectedCountry={state.selectedCountry}
                selectedEdge={state.selectedEdge}
                onSelectCountry={actions.selectCountry}
                onSelectEdge={actions.selectEdge}
              />
            ) : (
              <WaveGraph
                scenario={state.activeScenario}
                isLive={state.isLive}
                speed={waveSpeed}
              />
            )}
          </div>

          {/* Bottom: Intel Blocks */}
          <div className="flex-shrink-0 border-t border-deevo-border/30 p-3">
            <IntelBlocks
              blocks={state.blocks}
              activeLayers={state.activeLayers}
              onToggleLayer={actions.toggleLayer}
            />
          </div>
        </div>

        {/* RIGHT: Decision + AI + Alerts */}
        <div className="w-72 flex-shrink-0 border-l border-deevo-border/30 p-3 overflow-y-auto">
          <AlertsRail
            decision={state.decision}
            aiBrief={state.aiBrief}
            alerts={state.alerts}
            countries={state.countries}
            selectedCountry={state.selectedCountry}
            onDismissAlert={actions.dismissAlert}
          />
        </div>
      </div>
    </div>
  );
}
