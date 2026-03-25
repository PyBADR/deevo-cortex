// ============================================
// DEEVO CORTEX V2 - GCC Graph Node Schema
// ============================================

/**
 * Node types in the GCC decision graph
 */
export type NodeType = 
  | 'country'        // GCC country (UAE, KSA, Kuwait, etc.)
  | 'sector'         // Economic sector (oil, finance, real_estate)
  | 'insurance_line' // Insurance product line (motor, health, property)
  | 'macro_variable' // Macro indicator (inflation, gdp, unemployment)
  | 'risk_factor'    // Derived risk factor
  | 'decision';      // Terminal decision node

/**
 * Base node interface
 */
export interface GraphNode {
  id: string;                    // Unique identifier (e.g., "uae", "oil_sector")
  type: NodeType;
  label: string;                 // Display name
  value: number;                 // Current value (normalized 0-1 or raw)
  weight: number;                // Node importance weight (0-1)
  metadata?: NodeMetadata;
}

/**
 * Node metadata by type
 */
export interface NodeMetadata {
  // Country nodes
  iso_code?: string;             // ISO 3166-1 alpha-2
  region?: 'gcc';                // Always 'gcc' for this system
  
  // Sector nodes
  sector_code?: string;          // ISIC code
  gdp_contribution?: number;     // % of GDP
  
  // Insurance line nodes
  line_code?: string;            // LOB code
  premium_volume?: number;       // Annual premium
  loss_ratio?: number;           // Historical loss ratio
  
  // Macro variable nodes
  unit?: string;                 // e.g., "percent", "usd", "index"
  source?: string;               // Data source
  last_updated?: string;         // ISO 8601 timestamp
  
  // Risk factor nodes
  risk_category?: string;        // e.g., "operational", "market", "credit"
  threshold?: number;            // Alert threshold
}

// ============================================
// GCC-SPECIFIC NODE DEFINITIONS
// ============================================

/**
 * GCC Country Node
 */
export interface CountryNode extends GraphNode {
  type: 'country';
  metadata: {
    iso_code: string;
    region: 'gcc';
  };
}

/**
 * Sector Node
 */
export interface SectorNode extends GraphNode {
  type: 'sector';
  metadata: {
    sector_code: string;
    gdp_contribution: number;
  };
}

/**
 * Insurance Line Node
 */
export interface InsuranceLineNode extends GraphNode {
  type: 'insurance_line';
  metadata: {
    line_code: string;
    premium_volume?: number;
    loss_ratio?: number;
  };
}

/**
 * Macro Variable Node
 */
export interface MacroVariableNode extends GraphNode {
  type: 'macro_variable';
  metadata: {
    unit: string;
    source?: string;
    last_updated?: string;
  };
}

// ============================================
// PREDEFINED GCC NODES
// ============================================

export const GCC_COUNTRIES = [
  'uae', 'ksa', 'kuwait', 'qatar', 'bahrain', 'oman'
] as const;

export const GCC_SECTORS = [
  'oil_gas', 'finance', 'real_estate', 'tourism', 'construction', 'retail'
] as const;

export const INSURANCE_LINES = [
  'motor', 'health', 'property', 'marine', 'liability', 'life'
] as const;

export const MACRO_VARIABLES = [
  'oil_price', 'inflation', 'gdp_growth', 'unemployment', 
  'interest_rate', 'exchange_rate', 'credit_growth'
] as const;

export type GCCCountry = typeof GCC_COUNTRIES[number];
export type GCCSector = typeof GCC_SECTORS[number];
export type InsuranceLine = typeof INSURANCE_LINES[number];
export type MacroVariable = typeof MACRO_VARIABLES[number];
