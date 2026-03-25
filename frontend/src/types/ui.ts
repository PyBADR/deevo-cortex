export type ImpactLevel = "low" | "medium" | "high" | "critical";
export type Locale = "en" | "ar";
export type Decision = "APPROVE" | "REVIEW" | "ESCALATE";

export interface TopBarData {
  scenario_id?: string;
  scenario_label?: string;
  decision: Decision;
  decision_style?: { color: string; urgency: string; icon: string };
  risk_score: number;
  confidence: number;
  elevated_count?: number;
  critical_signals?: string[];
  high_signals?: string[];
  timestamp?: string;
  headline_summary?: string;
  impact_level?: ImpactLevel;
  demo_headline?: string;
}

export interface SignalItem {
  id: string;
  label: string;
  value: number;
  unit?: string;
  delta: number;
  direction: "up" | "down" | "stable";
  category: string;
  severity: "low" | "moderate" | "high" | "critical";
  severity_style?: { color: string; priority: number };
  deviation?: number;
  baseline?: number;
  timestamp?: string;
  sparkline?: number[];
  movement?: string;
  impact_level?: ImpactLevel;
}

export interface DecisionRailData {
  decision: Decision;
  confidence: number;
  risk_score: number;
  short_reasoning?: string;
  demo_short_reasoning?: string;
  headline_summary?: string;
  demo_headline?: string;
  impact_level?: ImpactLevel;
  scenario_id?: string;
  scenario_label?: string;
  reasoning?: string[];
  decision_trace?: { scenario_detected?: string; severity?: number };
}

export interface ExecutiveBriefData {
  text?: string;
  brief_headline?: string;
  generated_at?: string;
}

export interface PropagationStep {
  from: string;
  to: string;
  relation?: string;
  weight: number;
  intensity?: number;
}

export interface PropagationPanelData {
  cause_effect_chain?: PropagationStep[];
  readable_path?: string;
  affected_countries?: string[];
  affected_sectors?: string[];
  affected_lines?: string[];
  active_nodes?: string[];
  edges_traversed?: number;
}

export interface GraphSummaryData {
  active_nodes: number;
  traversed_edges: number;
  max_intensity?: number;
  node_details?: { id: string; pressure: number; severity_score: number; impact_level: ImpactLevel }[];
  edge_details?: { from: string; to: string; weight: number; intensity: number }[];
}

export interface CountryCardData {
  id: string;
  display_name: string;
  flag_emoji?: string;
  strategic_role?: string;
  risk_role?: string;
  risk_signature?: string;
  key_metric?: string;
  insurance_market_gwp?: string;
  sector_emphasis?: string[];
  oil_dependency?: number;
  demo_highlight?: string;
  scenario_cue?: string;
  available?: boolean;
}

export interface CommandCenterPayload {
  version?: string;
  locale?: string;
  timestamp?: string;
  top_bar: TopBarData;
  signal_rail: SignalItem[];
  decision_rail: DecisionRailData;
  executive_brief: ExecutiveBriefData;
  propagation_panel: PropagationPanelData;
  graph_summary: GraphSummaryData;
  country_card?: CountryCardData;
}

export interface DemoPayload {
  version: string;
  demo_id: string;
  locale: string;
  demo_meta: {
    title: string;
    headline: string;
    narrative: string;
    expected_decision: string;
    dominant_signals: string[];
    country_focus: string;
    country_focus_label: string;
    talking_points: string[];
    kpi?: Record<string, { baseline: number; demo: number; delta_pct: string; severity: string }>;
  };
  country_card: CountryCardData;
  ui_payload: CommandCenterPayload;
}
