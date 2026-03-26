// ============================================================================
// DEEVO Monitor — Palantir-Style Enterprise Layout
// TOP: Compact header + KPI metric strip
// LEFT: Context (map/entities + layers)
// CENTER: Signals (charts/views)
// RIGHT: Decision panel (recommendation + confidence + impact)
// ============================================================================

import { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import { useLocale } from '../lib/i18n';
import { MonitorHeader } from './components/MonitorHeader';
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
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [waveSpeed, setWaveSpeed] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const VIEW_TABS: { id: ViewMode; label: string }[] = [
    { id: 'map', label: 'GCC MAP' },
    { id: 'wave', label: 'WAVE SIM' },
    { id: 'cognitive', label: 'COGNITIVE' },
    { id: 'precausal', label: 'PRE-CAUSAL' },
    { id: 'video', label: 'VIDEO' },
  ];

  const getTabColor = (tabId: ViewMode) => {
    if (tabId === 'cognitive') return { active: 'border-[#8B85C2]/40 bg-[#8B85C2]/10 text-[#8B85C2]', dot: '#8B85C2' };
    if (tabId === 'precausal') return { active: 'border-d-danger/40 bg-d-danger/10 text-d-danger', dot: '#C96A6A' };
    if (tabId === 'video') return { active: 'border-d-amber/40 bg-d-amber/10 text-d-amber', dot: '#D6A24A' };
    return { active: 'border-d-cyan/40 bg-d-cyan/10 text-d-cyan', dot: '#4DB6D6' };
  };

  // KPI metrics from signals
  const topSignals = state.signals.slice(0, 6);

  return (
    <div className="h-screen w-screen bg-d-bg text-d-text flex flex-col overflow-hidden">
      {/* ===== TOP BAR: Brand + Controls ===== */}
      <MonitorHeader
        signals={state.signals}
        decision={state.decision}
        isLive={state.isLive}
        tickCount={state.tickCount}
        onToggleLive={actions.toggleLive}
        locale={locale}
        onToggleLocale={toggleLocale}
      />

      {/* ===== KPI STRIP: Metric cards across top ===== */}
      <div className="flex-shrink-0 border-b border-d-border/30 bg-d-shell px-3 py-2">
        <div className="flex items-center gap-2">
          {topSignals.map(signal => {
            const sevColor = signal.severity === 'critical' ? '#C96A6A'
              : signal.severity === 'high' ? '#D6A24A'
              : signal.severity === 'moderate' ? '#4DB6D6'
              : '#67B58A';
            return (
              <div
                key={signal.id}
                className="flex-1 min-w-0 rounded border border-d-border/40 bg-d-surface px-3 py-2"
              >
                <div className="text-[8px] font-mono text-d-muted tracking-wider truncate mb-1">
                  {signal.label.toUpperCase()}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-mono font-bold text-d-text">{signal.value}</span>
                  <span
                    className="text-[10px] font-mono font-semibold"
                    style={{ color: signal.change >= 0 ? '#C96A6A' : '#67B58A' }}
                  >
                    {signal.change >= 0 ? '▲' : '▼'}{Math.abs(signal.change).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sevColor }}
                  />
                  <span className="text-[7px] font-mono uppercase tracking-wider" style={{ color: sevColor }}>
                    {signal.severity}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Settings gear */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex-shrink-0 p-2 rounded border border-d-border/30 bg-d-surface text-d-muted hover:text-d-text hover:bg-d-panel transition-all"
            title="Settings"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== SETTINGS MODAL ===== */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        locale={locale}
        onToggleLocale={toggleLocale}
        activeScenario={state.activeScenario}
        onSetScenario={actions.setScenario}
      />

      {/* ===== MAIN CONTENT: 3-column ===== */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* LEFT COLUMN: Context (Map + Layers) */}
        <div className="w-60 flex-shrink-0 border-r border-d-border/30 flex flex-col overflow-hidden">
          {/* Mini map always visible on left */}
          <div className="flex-shrink-0 border-b border-d-border/20 h-52">
            <GCCMap
              countries={state.countries}
              graph={state.graph}
              selectedCountry={state.selectedCountry}
              selectedEdge={state.selectedEdge}
              onSelectCountry={actions.selectCountry}
              onSelectEdge={actions.selectEdge}
            />
          </div>
          {/* Layers + scenarios below */}
          <div className="flex-1 overflow-y-auto p-3">
            <LayerPanel
              activeLayers={state.activeLayers}
              activeScenario={state.activeScenario}
              onToggleLayer={actions.toggleLayer}
              onSetScenario={actions.setScenario}
            />
          </div>
        </div>

        {/* CENTER COLUMN: Signals (Charts + Views) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* View tab bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-d-border/20 bg-d-shell/50">
            <div className="flex items-center gap-1">
              {VIEW_TABS.map(tab => {
                const colors = getTabColor(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setViewMode(tab.id)}
                    className={`px-3 py-1 rounded text-[10px] font-mono tracking-wider transition-all border ${
                      viewMode === tab.id
                        ? colors.active
                        : 'text-d-muted border-transparent hover:text-d-text hover:border-d-border/30'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Speed controls (wave mode) */}
            {viewMode === 'wave' && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-d-muted mr-1">SPEED</span>
                {[1, 2, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setWaveSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      waveSpeed === s
                        ? 'bg-d-amber/12 text-d-amber border-d-amber/30'
                        : 'text-d-muted border-d-border/30 hover:text-d-text'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}

            {/* Mode indicators */}
            {viewMode !== 'wave' && viewMode !== 'map' && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: getTabColor(viewMode).dot }}
                />
                <span
                  className="text-[9px] font-mono tracking-wider"
                  style={{ color: getTabColor(viewMode).dot }}
                >
                  {viewMode === 'cognitive' ? 'REASONING' : viewMode === 'precausal' ? 'EARLY WARNING' : 'VIDEO ENGINE'}
                </span>
              </div>
            )}
          </div>

          {/* View content — bordered card container */}
          <div className="flex-1 min-h-0 p-2">
            <div className="h-full rounded-lg border border-d-border/30 bg-d-surface/30 overflow-hidden">
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
          </div>

          {/* Bottom: Intel signal cards */}
          <div className="flex-shrink-0 border-t border-d-border/30 px-3 py-2">
            <IntelBlocks
              blocks={state.blocks}
              activeLayers={state.activeLayers}
              onToggleLayer={actions.toggleLayer}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Decision Panel */}
        <div className="w-80 flex-shrink-0 border-l border-d-border/30 bg-d-shell/30 overflow-y-auto">
          <div className="p-3">
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
    </div>
  );
}
