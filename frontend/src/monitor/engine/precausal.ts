// ============================================================================
// DEEVO Monitor — Pre-Causal Engine
// Detects emerging risks BEFORE they become signals.
// Converts weak signals, narrative shifts, anomalies into Pressure Fields.
// ============================================================================

import type { Signal, SignalType, ScenarioId } from './types';

// ---------------------------------------------------------------------------
// Core Types
// ---------------------------------------------------------------------------

export type PressureDomain =
  | 'oil_instability'
  | 'inflation_pressure'
  | 'claims_surge'
  | 'fraud_emergence'
  | 'supply_stress'
  | 'regulatory_shift'
  | 'geopolitical_tension'
  | 'market_sentiment';

export interface PressureField {
  id: string;
  domain: PressureDomain;
  label: string;
  region: string;           // 'GCC' | country code
  intensity: number;        // 0–1, raw pressure level
  velocity: number;         // rate of change: negative = decreasing, positive = increasing
  uncertainty: number;      // 0–1, how confident we are
  sources: PressureSource[];
  forming: boolean;         // true = this is a pre-signal forming
  eta: number;              // estimated ticks until it becomes a real signal
  explanation: string;
}

export interface PressureSource {
  type: 'headline' | 'pattern' | 'anomaly' | 'trend' | 'cluster';
  title: string;
  weight: number;           // 0–1 contribution
  timestamp: number;
}

export interface EmergingSignal {
  id: string;
  type: PressureDomain;
  label: string;
  confidence: number;       // 0–1
  pressureSources: PressureSource[];
  explanation: string;
  feedsInto: SignalType[];  // which real signals this will affect
  intensity: number;
  formingPhase: number;     // 0–1, how far along formation is
}

export interface NarrativeEvent {
  id: string;
  headline: string;
  domain: PressureDomain;
  sentiment: number;        // -1 to 1
  urgency: number;          // 0–1
  timestamp: number;
  region: string;
}

export interface PreCausalState {
  pressureFields: PressureField[];
  emergingSignals: EmergingSignal[];
  narrativeEvents: NarrativeEvent[];
  totalPressure: number;
  formingCount: number;
  tick: number;
}

// ---------------------------------------------------------------------------
// Simulated News/Narrative Headlines (realistic GCC insurance intelligence)
// ---------------------------------------------------------------------------

const NARRATIVE_POOL: Record<ScenarioId, NarrativeEvent[]> = {
  oil_spike: [
    { id: 'n1',  headline: 'OPEC+ signals further production cuts in Q3',                     domain: 'oil_instability',     sentiment: -0.7, urgency: 0.8, timestamp: 0, region: 'GCC' },
    { id: 'n2',  headline: 'Red Sea shipping insurance premiums spike 40%',                    domain: 'supply_stress',       sentiment: -0.6, urgency: 0.7, timestamp: 0, region: 'GCC' },
    { id: 'n3',  headline: 'Saudi Aramco warns of supply tightness through 2026',              domain: 'oil_instability',     sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'SA' },
    { id: 'n4',  headline: 'GCC central banks signal coordinated rate review',                 domain: 'inflation_pressure',  sentiment: -0.3, urgency: 0.5, timestamp: 0, region: 'GCC' },
    { id: 'n5',  headline: 'UAE motor repair costs up 18% — parts shortage cited',             domain: 'claims_surge',        sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'AE' },
    { id: 'n6',  headline: 'Kuwait reports unusual spike in property damage claims',           domain: 'claims_surge',        sentiment: -0.4, urgency: 0.5, timestamp: 0, region: 'KW' },
    { id: 'n7',  headline: 'Geopolitical tensions escalate in Strait of Hormuz',               domain: 'geopolitical_tension', sentiment: -0.8, urgency: 0.9, timestamp: 0, region: 'GCC' },
    { id: 'n8',  headline: 'Market analysts revise GCC inflation forecasts upward',            domain: 'inflation_pressure',  sentiment: -0.4, urgency: 0.5, timestamp: 0, region: 'GCC' },
    { id: 'n9',  headline: 'Bahrain fraud unit investigating cross-border claims ring',        domain: 'fraud_emergence',     sentiment: -0.6, urgency: 0.7, timestamp: 0, region: 'BH' },
    { id: 'n10', headline: 'Insurance regulator drafts new solvency requirements',             domain: 'regulatory_shift',    sentiment: -0.2, urgency: 0.4, timestamp: 0, region: 'GCC' },
  ],
  fraud_ring: [
    { id: 'n11', headline: 'Dubai police arrest 12 in staged accident ring',                   domain: 'fraud_emergence',     sentiment: -0.8, urgency: 0.9, timestamp: 0, region: 'AE' },
    { id: 'n12', headline: 'Suspicious claims cluster identified across 3 GCC states',         domain: 'fraud_emergence',     sentiment: -0.7, urgency: 0.8, timestamp: 0, region: 'GCC' },
    { id: 'n13', headline: 'Medical claims data shows anomalous billing patterns',             domain: 'fraud_emergence',     sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'AE' },
    { id: 'n14', headline: 'Qatar Insurance Authority warns of identity fraud spike',          domain: 'fraud_emergence',     sentiment: -0.6, urgency: 0.7, timestamp: 0, region: 'QA' },
    { id: 'n15', headline: 'Insurers report 30% rise in disputed motor claims',                domain: 'claims_surge',        sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'GCC' },
    { id: 'n16', headline: 'New regulatory framework for AI fraud detection announced',        domain: 'regulatory_shift',    sentiment: 0.3,  urgency: 0.4, timestamp: 0, region: 'GCC' },
    { id: 'n17', headline: 'Cross-border data sharing agreement under negotiation',            domain: 'regulatory_shift',    sentiment: 0.2,  urgency: 0.3, timestamp: 0, region: 'GCC' },
    { id: 'n18', headline: 'Social media reveals organized claim coaching networks',           domain: 'fraud_emergence',     sentiment: -0.7, urgency: 0.8, timestamp: 0, region: 'GCC' },
  ],
  supply_disruption: [
    { id: 'n19', headline: 'Major Gulf port reports 3-week cargo backlog',                     domain: 'supply_stress',       sentiment: -0.7, urgency: 0.8, timestamp: 0, region: 'AE' },
    { id: 'n20', headline: 'Auto parts shortage drives 25% cost increase in repairs',          domain: 'supply_stress',       sentiment: -0.6, urgency: 0.7, timestamp: 0, region: 'GCC' },
    { id: 'n21', headline: 'Global shipping index hits 18-month high',                         domain: 'supply_stress',       sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'GCC' },
    { id: 'n22', headline: 'Saudi logistics firms warn of extended delivery times',            domain: 'supply_stress',       sentiment: -0.4, urgency: 0.5, timestamp: 0, region: 'SA' },
    { id: 'n23', headline: 'Medical supply chain constraints affect health claims',            domain: 'claims_surge',        sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'GCC' },
    { id: 'n24', headline: 'Oil tanker insurance rates double on Red Sea route',               domain: 'oil_instability',     sentiment: -0.6, urgency: 0.7, timestamp: 0, region: 'GCC' },
    { id: 'n25', headline: 'Construction material costs spike — property claims expected',     domain: 'claims_surge',        sentiment: -0.5, urgency: 0.6, timestamp: 0, region: 'GCC' },
    { id: 'n26', headline: 'Oman ports operating at reduced capacity',                         domain: 'supply_stress',       sentiment: -0.4, urgency: 0.5, timestamp: 0, region: 'OM' },
  ],
};

// ---------------------------------------------------------------------------
// Pressure domain → signal type mapping
// ---------------------------------------------------------------------------
const DOMAIN_FEEDS: Record<PressureDomain, SignalType[]> = {
  oil_instability:     ['oil'],
  inflation_pressure:  ['inflation', 'interest_rates'],
  claims_surge:        ['claims'],
  fraud_emergence:     ['fraud'],
  supply_stress:       ['supply_chain'],
  regulatory_shift:    ['regulatory'],
  geopolitical_tension: ['oil', 'currency'],
  market_sentiment:    ['currency', 'interest_rates'],
};

const DOMAIN_LABELS: Record<PressureDomain, string> = {
  oil_instability:     'Oil Instability',
  inflation_pressure:  'Inflation Pressure',
  claims_surge:        'Claims Surge Forming',
  fraud_emergence:     'Fraud Pattern Emerging',
  supply_stress:       'Supply Chain Stress',
  regulatory_shift:    'Regulatory Shift',
  geopolitical_tension: 'Geopolitical Tension',
  market_sentiment:    'Market Sentiment Shift',
};

const DOMAIN_COLORS: Record<PressureDomain, string> = {
  oil_instability:     '#f59e0b',
  inflation_pressure:  '#ef4444',
  claims_surge:        '#06b6d4',
  fraud_emergence:     '#f43f5e',
  supply_stress:       '#8b5cf6',
  regulatory_shift:    '#3b82f6',
  geopolitical_tension: '#dc2626',
  market_sentiment:    '#22c55e',
};

// ---------------------------------------------------------------------------
// Pre-Causal Engine
// ---------------------------------------------------------------------------

export class PreCausalEngine {
  private scenario: ScenarioId = 'oil_spike';
  private tick = 0;
  private pressureFields: Map<PressureDomain, PressureField> = new Map();
  private activeNarratives: NarrativeEvent[] = [];
  private emergingSignals: EmergingSignal[] = [];
  private narrativeQueue: NarrativeEvent[] = [];

  constructor() {
    this.initPressureFields();
  }

  private initPressureFields(): void {
    const domains: PressureDomain[] = [
      'oil_instability', 'inflation_pressure', 'claims_surge',
      'fraud_emergence', 'supply_stress', 'regulatory_shift',
      'geopolitical_tension', 'market_sentiment',
    ];

    for (const domain of domains) {
      this.pressureFields.set(domain, {
        id: `pf_${domain}`,
        domain,
        label: DOMAIN_LABELS[domain],
        region: 'GCC',
        intensity: 0.05 + Math.random() * 0.1, // very low baseline
        velocity: 0,
        uncertainty: 0.8, // high uncertainty initially
        sources: [],
        forming: false,
        eta: 999,
        explanation: '',
      });
    }
  }

  setScenario(scenario: ScenarioId): void {
    this.scenario = scenario;
    this.tick = 0;
    this.activeNarratives = [];
    this.emergingSignals = [];
    this.initPressureFields();

    // Prepare narrative queue (shuffled with staggered timing)
    const pool = NARRATIVE_POOL[scenario] ?? [];
    this.narrativeQueue = pool.map((n, i) => ({
      ...n,
      timestamp: Date.now() + i * 2000 + Math.random() * 3000,
    }));
  }

  /**
   * Update — called every tick.
   * Ingests narratives, builds pressure, detects emerging signals.
   */
  update(signals: Signal[]): PreCausalState {
    this.tick++;
    const now = Date.now();

    // 1. Ingest new narratives (simulated — one every ~5 ticks)
    this.ingestNarratives(now);

    // 2. Process signal anomalies
    this.detectAnomalies(signals);

    // 3. Update pressure fields
    this.updatePressure(signals);

    // 4. Detect emerging signals
    this.detectEmergingSignals();

    // 5. Build state
    const fields = Array.from(this.pressureFields.values());
    const totalPressure = fields.reduce((s, f) => s + f.intensity, 0) / fields.length;
    const formingCount = fields.filter(f => f.forming).length;

    return {
      pressureFields: fields,
      emergingSignals: [...this.emergingSignals],
      narrativeEvents: [...this.activeNarratives].slice(-10),
      totalPressure: round(totalPressure),
      formingCount,
      tick: this.tick,
    };
  }

  private ingestNarratives(now: number): void {
    // Release narratives from queue based on timing
    const ready = this.narrativeQueue.filter(n => n.timestamp <= now);
    for (const narrative of ready) {
      this.activeNarratives.push({ ...narrative, timestamp: now });

      // Apply narrative to pressure field
      const field = this.pressureFields.get(narrative.domain);
      if (field) {
        const impact = Math.abs(narrative.sentiment) * narrative.urgency * 0.15;
        field.intensity = clamp(field.intensity + impact, 0, 1);
        field.velocity = clamp(field.velocity + impact * 0.5, -1, 1);
        field.uncertainty = clamp(field.uncertainty - narrative.urgency * 0.05, 0.1, 1);
        field.sources.push({
          type: 'headline',
          title: narrative.headline,
          weight: narrative.urgency,
          timestamp: now,
        });
        // Keep only last 5 sources
        if (field.sources.length > 5) field.sources = field.sources.slice(-5);
      }
    }
    // Remove released from queue
    this.narrativeQueue = this.narrativeQueue.filter(n => n.timestamp > now);
  }

  private detectAnomalies(signals: Signal[]): void {
    for (const signal of signals) {
      // Anomaly: rapid change detection
      if (Math.abs(signal.change) > 30) {
        const domain = this.signalTypeToDomain(signal.type);
        if (domain) {
          const field = this.pressureFields.get(domain);
          if (field) {
            const impact = Math.abs(signal.change) / 200;
            field.intensity = clamp(field.intensity + impact, 0, 1);
            field.velocity += impact * 0.3;

            // Check if not already tracked
            const exists = field.sources.some(s => s.type === 'anomaly' && Date.now() - s.timestamp < 10000);
            if (!exists) {
              field.sources.push({
                type: 'anomaly',
                title: `${signal.label} anomaly: ${signal.change > 0 ? '+' : ''}${signal.change.toFixed(1)}% rapid shift`,
                weight: Math.min(Math.abs(signal.change) / 100, 1),
                timestamp: Date.now(),
              });
              if (field.sources.length > 5) field.sources = field.sources.slice(-5);
            }
          }
        }
      }

      // Trend detection: sparkline slope analysis
      if (signal.sparkline.length >= 5) {
        const recent = signal.sparkline.slice(-5);
        const slope = (recent[recent.length - 1] - recent[0]) / recent[0];
        if (Math.abs(slope) > 0.05) {
          const domain = this.signalTypeToDomain(signal.type);
          if (domain) {
            const field = this.pressureFields.get(domain);
            if (field) {
              const trendImpact = Math.abs(slope) * 0.3;
              field.velocity = clamp(field.velocity + (slope > 0 ? trendImpact : -trendImpact), -1, 1);

              const exists = field.sources.some(s => s.type === 'trend' && Date.now() - s.timestamp < 15000);
              if (!exists) {
                field.sources.push({
                  type: 'trend',
                  title: `${signal.label}: sustained ${slope > 0 ? 'upward' : 'downward'} trend detected`,
                  weight: Math.min(Math.abs(slope) * 5, 1),
                  timestamp: Date.now(),
                });
                if (field.sources.length > 5) field.sources = field.sources.slice(-5);
              }
            }
          }
        }
      }
    }
  }

  private updatePressure(signals: Signal[]): void {
    for (const [domain, field] of this.pressureFields) {
      // Natural decay
      field.intensity *= 0.97;
      field.velocity *= 0.92;
      field.uncertainty = clamp(field.uncertainty + 0.002, 0, 0.95); // uncertainty grows without data

      // Cross-domain contagion (pressure in one domain feeds related domains)
      if (domain === 'oil_instability' && field.intensity > 0.3) {
        const inflation = this.pressureFields.get('inflation_pressure');
        if (inflation) {
          inflation.intensity = clamp(inflation.intensity + field.intensity * 0.02, 0, 1);
        }
        const supply = this.pressureFields.get('supply_stress');
        if (supply) {
          supply.intensity = clamp(supply.intensity + field.intensity * 0.015, 0, 1);
        }
      }
      if (domain === 'claims_surge' && field.intensity > 0.3) {
        const fraud = this.pressureFields.get('fraud_emergence');
        if (fraud) {
          fraud.intensity = clamp(fraud.intensity + field.intensity * 0.02, 0, 1);
        }
      }

      // Forming detection
      field.forming = field.intensity > 0.25 && field.velocity > 0.05;
      field.eta = field.forming
        ? Math.max(1, Math.round((0.6 - field.intensity) / Math.max(field.velocity * 0.1, 0.01)))
        : 999;

      // Generate explanation
      const topSource = field.sources.sort((a, b) => b.weight - a.weight)[0];
      if (field.forming) {
        field.explanation = `${DOMAIN_LABELS[domain]} building — intensity ${(field.intensity * 100).toFixed(0)}%, velocity +${(field.velocity * 100).toFixed(0)}%. ${topSource ? `Driven by: ${topSource.title}` : 'Multiple weak signals converging.'}`;
      } else if (field.intensity > 0.15) {
        field.explanation = `Low-level ${DOMAIN_LABELS[domain].toLowerCase()} detected. Monitoring ${field.sources.length} source(s).`;
      } else {
        field.explanation = `${DOMAIN_LABELS[domain]} within baseline range.`;
      }
    }
  }

  private detectEmergingSignals(): void {
    this.emergingSignals = [];

    for (const [domain, field] of this.pressureFields) {
      if (field.intensity > 0.2 && field.sources.length >= 2) {
        const confidence = clamp(
          field.intensity * 0.4 +
          (1 - field.uncertainty) * 0.3 +
          Math.min(field.sources.length / 5, 1) * 0.3,
          0, 1
        );

        if (confidence > 0.2) {
          this.emergingSignals.push({
            id: `es_${domain}`,
            type: domain,
            label: DOMAIN_LABELS[domain],
            confidence: round(confidence),
            pressureSources: [...field.sources],
            explanation: field.explanation,
            feedsInto: DOMAIN_FEEDS[domain] ?? [],
            intensity: round(field.intensity),
            formingPhase: clamp(field.intensity / 0.6, 0, 1),
          });
        }
      }
    }

    // Sort by confidence
    this.emergingSignals.sort((a, b) => b.confidence - a.confidence);
  }

  private signalTypeToDomain(type: SignalType): PressureDomain | null {
    const map: Partial<Record<SignalType, PressureDomain>> = {
      oil: 'oil_instability',
      inflation: 'inflation_pressure',
      claims: 'claims_surge',
      fraud: 'fraud_emergence',
      supply_chain: 'supply_stress',
      interest_rates: 'inflation_pressure',
      regulatory: 'regulatory_shift',
      currency: 'market_sentiment',
    };
    return map[type] ?? null;
  }

  getColors(): Record<PressureDomain, string> {
    return { ...DOMAIN_COLORS };
  }
}

// ---------------------------------------------------------------------------
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
