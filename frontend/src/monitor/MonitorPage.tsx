// ============================================================================
// DEEVO Monitor — Main Page
// Layout: Header → Signals → [Left: Layers | Center: Map | Right: AI+Alerts] → Blocks
// ============================================================================

import { useMonitor } from './hooks/useMonitor';
import { MonitorHeader } from './components/MonitorHeader';
import { SignalBar } from './components/SignalBar';
import { LayerPanel } from './components/LayerPanel';
import { GCCMap } from './components/GCCMap';
import { AlertsRail } from './components/AlertsRail';
import { IntelBlocks } from './components/IntelBlocks';

export function MonitorPage() {
  const { state, actions } = useMonitor();

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

        {/* CENTER: Map (HERO) */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0 p-2">
            <GCCMap
              countries={state.countries}
              graph={state.graph}
              selectedCountry={state.selectedCountry}
              selectedEdge={state.selectedEdge}
              onSelectCountry={actions.selectCountry}
              onSelectEdge={actions.selectEdge}
            />
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
