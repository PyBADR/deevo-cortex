// ============================================================================
// DEEVO Monitor — Main Page (Enterprise redesign)
// Layout: Header → Signals → [Left: Layers | Center: Views | Right: AI+Alerts] → Blocks
// Five view modes: GCC Map, Wave Sim, Cognitive, Pre-Causal, Video Engine
// Design system: d-* classes, i18n integration
// ============================================================================

import { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import { useLocale } from '../lib/i18n';
import { MonitorHeader } from './components/MonitorHeader';
import { SignalBar } from './components/SignalBar';
import { LayerPanel } from './components/LayerPanel';
import { GCCMap } from './components/GCCMap';
import { WaveGraph } from './components/WaveGraph';
import { CognitiveView } from './components/CognitiveView';
import { PreCausalView } from './components/PreCausalView';
import { VideoEngine } from './components/VideoEngine';
import { AlertsRail } from './components/AlertsRail';
import { IntelBlocks } from './components/IntelBlocks';
import { SettingsModal } from './components/SettingsModal';

type ViewMode = 'map' | 'wave' | 'cognitive' | 'precausal' | 'video';

export function MonitorPage() {
  const { state, actions } = useMonitor();
  const { locale, toggle: toggleLocale } = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>('cognitive');
  const [waveSpeed, setWaveSpeed] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const VIEW_TABS: { id: ViewMode; label: string }[] = [
    { id: 'map', label: 'GCC MAP' },
    { id: 'wave', label: 'WAVE SIM' },
    { id: 'cognitive', label: 'COGNITIVE' },
    { id: 'precausal', label: 'PRE-CAUSAL' },
    { id: 'video', label: 'VIDEO' },
  ];

  const getTabActiveStyles = (tabId: ViewMode) => {
    if (tabId === 'cognitive') {
      return 'border border-[#8B85C2]/30 bg-[#8B85C2]/12 text-[#8B85C2]';
    }
    if (tabId === 'precausal') {
      return 'bg-d-danger/12 text-d-danger border border-d-danger/30';
    }
    if (tabId === 'video') {
      return 'bg-d-amber/12 text-d-amber border border-d-amber/30';
    }
    // map & wave
    return 'bg-d-blue/12 text-d-blue border border-d-blue/30';
  };

  const getIndicatorColor = (tabId: ViewMode) => {
    if (tabId === 'cognitive') return 'bg-[#8B85C2] text-[#8B85C2]';
    if (tabId === 'precausal') return 'bg-d-danger text-d-danger';
    if (tabId === 'video') return 'bg-d-amber text-d-amber';
    return 'bg-d-blue text-d-blue';
  };

  return (
    <div className="h-screen w-screen bg-d-bg text-d-text flex flex-col overflow-hidden">
      {/* Top: Header */}
      <MonitorHeader
        signals={state.signals}
        decision={state.decision}
        isLive={state.isLive}
        tickCount={state.tickCount}
        onToggleLive={actions.toggleLive}
        locale={locale}
        onToggleLocale={toggleLocale}
      />

      {/* Signal Ticker Bar */}
      <div className="flex-shrink-0 border-b border-d-border/30 bg-d-bg/50 flex items-center">
        <div className="flex-1 min-w-0">
          <SignalBar signals={state.signals} />
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex-shrink-0 px-2.5 py-1.5 mr-2 rounded text-d-muted hover:text-d-text hover:bg-d-panel/50 transition-all"
          title="Settings"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        locale={locale}
        onToggleLocale={toggleLocale}
        activeScenario={state.activeScenario}
        onSetScenario={actions.setScenario}
      />

      {/* Main Content: 3-column layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT: Layers + Scenarios */}
        <div className="w-56 flex-shrink-0 border-r border-d-border/30 p-3 overflow-y-auto">
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
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-d-border/20">
            <div className="flex items-center gap-1">
              {VIEW_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                    viewMode === tab.id
                      ? getTabActiveStyles(tab.id)
                      : 'text-d-muted hover:text-d-text border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Speed controls (wave mode only) */}
            {viewMode === 'wave' && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-d-muted mr-1">SPEED</span>
                {[1, 2, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setWaveSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                      waveSpeed === s
                        ? 'bg-d-amber/15 text-d-amber border border-d-amber/30'
                        : 'text-d-muted hover:text-d-text border border-d-border/30'
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
                <div className="w-1.5 h-1.5 rounded-full bg-[#8B85C2] animate-pulse" />
                <span className="text-[9px] font-mono text-[#8B85C2] tracking-wider">REASONING</span>
              </div>
            )}

            {/* Pre-causal mode indicator */}
            {viewMode === 'precausal' && (
              <div className={`flex items-center gap-1.5`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor('precausal')} animate-pulse`} />
                <span className={`text-[9px] font-mono ${getIndicatorColor('precausal')} tracking-wider`}>
                  EARLY WARNING
                </span>
              </div>
            )}

            {/* Video mode indicator */}
            {viewMode === 'video' && (
              <div className={`flex items-center gap-1.5`}>
                <div className={`w-1.5 h-1.5 rounded-full ${getIndicatorColor('video')} animate-pulse`} />
                <span className={`text-[9px] font-mono ${getIndicatorColor('video')} tracking-wider`}>
                  VIDEO ENGINE
                </span>
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
            {viewMode === 'video' && (
              <VideoEngine isLive={state.isLive} />
            )}
          </div>

          {/* Bottom: Intel Blocks */}
          <div className="flex-shrink-0 border-t border-d-border/30 p-3">
            <IntelBlocks
              blocks={state.blocks}
              activeLayers={state.activeLayers}
              onToggleLayer={actions.toggleLayer}
            />
          </div>
        </div>

        {/* RIGHT: Decision + AI + Alerts */}
        <div className="w-72 flex-shrink-0 border-l border-d-border/30 p-3 overflow-y-auto">
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
