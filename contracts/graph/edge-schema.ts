// ============================================
// DEEVO CORTEX V2 - GCC Graph Edge Schema
// ============================================

import { NodeType } from './node-schema';

/**
 * Edge relationship types
 */
export type EdgeType =
  | 'causal'          // A causes B (directional)
  | 'correlation'     // A correlates with B
  | 'dependency'      // A depends on B
  | 'exposure'        // A is exposed to B (risk)
  | 'contains'        // A contains B (hierarchical)
  | 'influences';     // A influences B (weighted)

/**
 * Propagation direction
 */
export type PropagationDirection = 'forward' | 'backward' | 'bidirectional';

/**
 * Graph edge definition
 */
export interface GraphEdge {
  id: string;                      // Unique edge ID
  source: string;                  // Source node ID
  target: string;                  // Target node ID
  type: EdgeType;
  weight: number;                  // Edge weight (0-1), affects propagation
  direction: PropagationDirection;
  metadata?: EdgeMetadata;
}

/**
 * Edge metadata
 */
export interface EdgeMetadata {
  lag?: number;                    // Time lag in days (for causal edges)
  confidence?: number;             // Statistical confidence (0-1)
  source_data?: string;            // Data source for this relationship
  last_validated?: string;         // ISO 8601 timestamp
  notes?: string;                  // Human-readable notes
}

// ============================================
// EDGE WEIGHT INTERPRETATION
// ============================================

/**
 * Weight interpretation:
 * - 0.0 - 0.2: Weak relationship
 * - 0.2 - 0.4: Moderate relationship
 * - 0.4 - 0.6: Significant relationship
 * - 0.6 - 0.8: Strong relationship
 * - 0.8 - 1.0: Very strong relationship
 */
export interface WeightInterpretation {
  weight: number;
  strength: 'weak' | 'moderate' | 'significant' | 'strong' | 'very_strong';
}

export function interpretWeight(weight: number): WeightInterpretation {
  if (weight < 0.2) return { weight, strength: 'weak' };
  if (weight < 0.4) return { weight, strength: 'moderate' };
  if (weight < 0.6) return { weight, strength: 'significant' };
  if (weight < 0.8) return { weight, strength: 'strong' };
  return { weight, strength: 'very_strong' };
}

// ============================================
// GCC-SPECIFIC EDGE PATTERNS
// ============================================

/**
 * Common GCC graph edge patterns
 */
export const GCC_EDGE_PATTERNS = {
  // Oil price affects all GCC economies
  OIL_TO_COUNTRY: {
    source_type: 'macro_variable' as NodeType,
    target_type: 'country' as NodeType,
    type: 'influences' as EdgeType,
    typical_weight: 0.7
  },
  
  // Country economy affects sectors
  COUNTRY_TO_SECTOR: {
    source_type: 'country' as NodeType,
    target_type: 'sector' as NodeType,
    type: 'contains' as EdgeType,
    typical_weight: 0.8
  },
  
  // Sector affects insurance lines
  SECTOR_TO_INSURANCE: {
    source_type: 'sector' as NodeType,
    target_type: 'insurance_line' as NodeType,
    type: 'exposure' as EdgeType,
    typical_weight: 0.6
  },
  
  // Macro variables affect insurance
  MACRO_TO_INSURANCE: {
    source_type: 'macro_variable' as NodeType,
    target_type: 'insurance_line' as NodeType,
    type: 'causal' as EdgeType,
    typical_weight: 0.5
  },
  
  // Insurance lines affect risk factors
  INSURANCE_TO_RISK: {
    source_type: 'insurance_line' as NodeType,
    target_type: 'risk_factor' as NodeType,
    type: 'causal' as EdgeType,
    typical_weight: 0.7
  }
} as const;

// ============================================
// EDGE VALIDATION
// ============================================

export interface EdgeValidation {
  valid: boolean;
  errors: string[];
}

export function validateEdge(edge: GraphEdge): EdgeValidation {
  const errors: string[] = [];
  
  if (!edge.id) errors.push('Edge ID required');
  if (!edge.source) errors.push('Source node required');
  if (!edge.target) errors.push('Target node required');
  if (edge.source === edge.target) errors.push('Self-loops not allowed');
  if (edge.weight < 0 || edge.weight > 1) errors.push('Weight must be 0-1');
  
  return {
    valid: errors.length === 0,
    errors
  };
}
