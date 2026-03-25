// ============================================================================
// DEEVO Monitor — Main Page
// Layout: Header → Signals → [Left: Layers | Center: Map/Wave/Cognitive/PreCausal | Right: AI+Alerts] → Blocks
// Four view modes: GCC Map, Wave Simulation, Cognitive Futures, Pre-Causal Intelligence
// ============================================================================

import { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import { MonitorHeader } from './components/MonitorHeader';
import { SignalBar } from './components/SignalBar';
import { LayerPanel } from './components/LayerPanel';
import { GCCMap } from './components/GCCMap';
import { WaveGraph } from './components/WaveGraph';
import { CognitiveView } from './components/CognitiveView';
import { PreCausalView } from './components/PreCausalView';
import { AlertsRail } from './components/AlertsRail';
import { IntelBlocks } from './components/IntelBlocks';

type ViewMode = 'map' | 'wave' | 'cognitive' | 'precausal';

export function MonitorPage() {
  const { state, actions } = useMonitor();
  const [viewMode, setViewMode] = useState<ViewMode>('cognitive');
  const [waveSpeed, setWaveSpeed] = useState(1);

  const VIEW_TABS: { id: ViewMode; label: string }[] = [
    { id: 'map', label: 'GCC MAP' },
    { id: 'wave', label: 'WAVE SIM' },
    { id: 'cognitive', label: 'COGNITIVE' },
    { id: 'precausal', label: 'PRE-CAUSAL' },
  ];

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

        {/* CENTER: Map / Wave / Cognitive (HERO) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View mode toggle + speed controls */}
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-deevo-border/20">
            <div className="flex items-center gap-1">
              {VIEW_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                    viewMode === tab.id
                      ? tab.id === 'cognitive'
                        ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                        : tab.id === 'precausal'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-deevo-muted hover:text-deevo-text border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Speed controls (wave mode only) */}
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

            {/* Cognitive mode indicator */}
            {viewMode === 'cognitive' && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[9px] font-mono text-violet-400 tracking-wider">REASONING</span>
              </div>
            )}

            {/* Pre-causal mode indicator */}
            {viewMode === 'precausal' && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-[9px] font-mono text-rose-400 tracking-wider">EARLY WARNING</span>
              </div>
            )}
          </div>

          {/* View content */}
          <div className="flex-1 min-h-0 p-2">
            {viewMode === 'map' && (
              <GCCMap
                countries={state.countries}
                graph={state.graph}
                selectedCountry={state.selectedCountry}
                selectedEdge={state.selectedEdge}
                onSelectCountry={actions.selectCountry}
                onSelectEdge={actions.selectEdge}
              />
            )}
            {viewMode === 'wave' && (
              <WaveGraph
                scenario={state.activeScenario}
                isLive={state.isLive}
                speed={waveSpeed}
              />
            )}
            {viewMode === 'cognitive' && (
              <CognitiveView
                signals={state.signals}
                scenario={state.activeScenario}
                isLive={state.isLive}
              />
            )}
            {viewMode === 'precausal' && (
              <PreCausalView
                signals={state.signals}
                scenario={state.activeScenario}
                isLive={state.isLive}
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
