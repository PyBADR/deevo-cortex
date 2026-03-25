// ============================================
// DEEVO CORTEX V2 - Graph API Response Schema
// ============================================

import { GraphNode } from './node-schema';
import { GraphEdge } from './edge-schema';

// ============================================
// GRAPH STATE RESPONSE
// ============================================

/**
 * GET /api/graph/state response
 */
export interface GraphStateResponse {
  graph_id: string;                // Graph instance identifier
  timestamp: string;               // ISO 8601 timestamp
  node_count: number;
  edge_count: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphMetadata {
  version: string;                 // Graph schema version
  last_updated: string;            // Last modification timestamp
  source: 'cowork' | 'api';        // Origin of graph data
  region: 'gcc';                   // Always 'gcc' for this system
}

// ============================================
// PROPAGATION REQUEST/RESPONSE
// ============================================

/**
 * POST /api/graph/propagate request
 */
export interface PropagateRequest {
  source_node: string;             // Node ID to start propagation
  impulse: number;                 // Change magnitude (-1 to 1)
  max_depth?: number;              // Max propagation depth (default: 5)
  decay_factor?: number;           // Weight decay per hop (default: 0.8)
  include_trace?: boolean;         // Include propagation trace (default: true)
}

/**
 * POST /api/graph/propagate response
 */
export interface PropagateResponse {
  propagation_id: string;          // Unique propagation run ID
  source_node: string;
  impulse: number;
  affected_nodes: AffectedNode[];
  propagation_trace?: PropagationStep[];
  summary: PropagationSummary;
}

/**
 * Node affected by propagation
 */
export interface AffectedNode {
  node_id: string;
  node_type: string;
  original_value: number;
  new_value: number;
  delta: number;                   // Change amount
  depth: number;                   // Hops from source
  path: string[];                  // Node IDs in path from source
}

/**
 * Single propagation step
 */
export interface PropagationStep {
  step: number;
  from_node: string;
  to_node: string;
  edge_weight: number;
  impulse_in: number;
  impulse_out: number;             // After decay
  cumulative_decay: number;
}

/**
 * Propagation summary
 */
export interface PropagationSummary {
  total_affected: number;
  max_depth_reached: number;
  total_delta: number;             // Sum of all deltas
  most_affected: {
    node_id: string;
    delta: number;
  };
  by_type: Record<string, number>; // Count by node type
}

// ============================================
// ERROR RESPONSES
// ============================================

export interface GraphErrorResponse {
  error: string;
  code: GraphErrorCode;
  details?: Record<string, any>;
}

export type GraphErrorCode =
  | 'GRAPH_NOT_LOADED'
  | 'NODE_NOT_FOUND'
  | 'INVALID_IMPULSE'
  | 'PROPAGATION_FAILED'
  | 'ADAPTER_UNAVAILABLE';

// ============================================
// CONVENIENCE TYPES
// ============================================

/**
 * Minimal node reference (for lists)
 */
export interface NodeRef {
  id: string;
  type: string;
  label: string;
}

/**
 * Graph statistics
 */
export interface GraphStats {
  node_count: number;
  edge_count: number;
  avg_degree: number;              // Average edges per node
  density: number;                 // Edge density (0-1)
  by_node_type: Record<string, number>;
  by_edge_type: Record<string, number>;
}

/**
 * GET /api/graph/stats response
 */
export interface GraphStatsResponse {
  graph_id: string;
  timestamp: string;
  stats: GraphStats;
}
