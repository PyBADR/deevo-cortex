// ============================================================================
// DEEVO Monitor — Central State Hook
// Connects all engines and drives the real-time update loop.
// ============================================================================

import { useReducer, useEffect, useRef, useCallback } from 'react';
import type {
  SystemState, MonitorAction, ScenarioId, LayerId, CountryCode,
} from '../engine/types';
import { SignalEngine } from '../engine/signals';
import { GraphEngine } from '../engine/graph';
import { DecisionEngine, computeCountries, computeBlocks, computeAlerts, computeAIBrief } from '../engine/decision';
import { LAYERS } from '../engine/scenarios';

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
function reducer(state: SystemState, action: MonitorAction): SystemState {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, activeScenario: action.payload, selectedCountry: null, selectedEdge: null };
    case 'TOGGLE_LAYER': {
      const layers = state.activeLayers.includes(action.payload)
        ? state.activeLayers.filter(l => l !== action.payload)
        : [...state.activeLayers, action.payload];
      return { ...state, activeLayers: layers };
    }
    case 'SELECT_COUNTRY':
      return { ...state, selectedCountry: action.payload };
    case 'SELECT_EDGE':
      return { ...state, selectedEdge: action.payload };
    case 'TICK':
      return {
        ...state,
        signals: action.payload.signals,
        graph: action.payload.graph,
        decision: action.payload.decision,
        aiBrief: action.payload.aiBrief,
        alerts: action.payload.alerts,
        countries: action.payload.countries,
        blocks: action.payload.blocks,
        lastUpdate: Date.now(),
        tickCount: state.tickCount + 1,
      };
    case 'TOGGLE_LIVE':
      return { ...state, isLive: !state.isLive };
    case 'SET_DEMO':
      return { ...state, isDemo: action.payload };
    case 'DISMISS_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a => a.id === action.payload ? { ...a, dismissed: true } : a),
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------
const INITIAL_STATE: SystemState = {
  activeScenario: 'oil_spike',
  activeLayers: LAYERS.filter(l => l.enabled).map(l => l.id),
  selectedCountry: null,
  selectedEdge: null,
  signals: [],
  graph: { nodes: [], edges: [] },
  decision: {
    type: 'APPROVE',
    riskScore: 0,
    confidence: 0,
    reasoning: '',
    timestamp: Date.now(),
    drivers: [],
  },
  aiBrief: {
    headline: '',
    summary: '',
    drivers: [],
    impact: '',
    recommendation: '',
    timestamp: Date.now(),
  },
  alerts: [],
  countries: [],
  blocks: [],
  isLive: true,
  isDemo: true,
  lastUpdate: Date.now(),
  tickCount: 0,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useMonitor() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const signalEngine = useRef(new SignalEngine());
  const graphEngine = useRef(new GraphEngine());
  const decisionEngine = useRef(new DecisionEngine());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Run a single tick — signal → graph → decision → brief → countries → blocks → alerts
  const tick = useCallback(() => {
    const signals = signalEngine.current.tick();
    const graph = graphEngine.current.propagate(signals, state.activeLayers);
    const decision = decisionEngine.current.compute(signals, graph, state.activeScenario);
    const aiBrief = computeAIBrief(signals, decision, state.activeScenario);
    const countries = computeCountries(signals, decision);
    const blocks = computeBlocks(signals);
    const alerts = computeAlerts(signals, decision, state.alerts);

    dispatch({
      type: 'TICK',
      payload: { signals, graph, decision, aiBrief, alerts, countries, blocks },
    });
  }, [state.activeScenario, state.activeLayers, state.alerts]);

  // Scenario change → reset engines
  useEffect(() => {
    signalEngine.current.setScenario(state.activeScenario);
    graphEngine.current.reset();
    // Run initial tick immediately
    const signals = signalEngine.current.tick();
    const graph = graphEngine.current.propagate(signals, state.activeLayers);
    const decision = decisionEngine.current.compute(signals, graph, state.activeScenario);
    const aiBrief = computeAIBrief(signals, decision, state.activeScenario);
    const countries = computeCountries(signals, decision);
    const blocks = computeBlocks(signals);
    const alerts = computeAlerts(signals, decision, []);

    dispatch({
      type: 'TICK',
      payload: { signals, graph, decision, aiBrief, alerts, countries, blocks },
    });
  }, [state.activeScenario]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live update loop
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (state.isLive) {
      intervalRef.current = setInterval(tick, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isLive, tick]);

  // Actions
  const setScenario = useCallback((id: ScenarioId) => dispatch({ type: 'SET_SCENARIO', payload: id }), []);
  const toggleLayer = useCallback((id: LayerId) => dispatch({ type: 'TOGGLE_LAYER', payload: id }), []);
  const selectCountry = useCallback((code: CountryCode | null) => dispatch({ type: 'SELECT_COUNTRY', payload: code }), []);
  const selectEdge = useCallback((edge: { source: string; target: string } | null) => dispatch({ type: 'SELECT_EDGE', payload: edge }), []);
  const toggleLive = useCallback(() => dispatch({ type: 'TOGGLE_LIVE' }), []);
  const dismissAlert = useCallback((id: string) => dispatch({ type: 'DISMISS_ALERT', payload: id }), []);

  return {
    state,
    actions: {
      setScenario,
      toggleLayer,
      selectCountry,
      selectEdge,
      toggleLive,
      dismissAlert,
    },
  };
}
