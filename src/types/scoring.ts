/**
 * LRSS Data Contracts & Scoring Type Definitions
 * Aligned with docs/CONTRACT.md, docs/SPEC.md, and docs/PRD.pdf (Section 2.3)
 */

/**
 * Asymmetric 5-Tier Operational Risk Classification
 * Boundaries at 20 / 40 / 60 / 80
 */
export type RiskTier =
  | 'VERY_LOW'   // Tier I   (0–20):   Routine monitoring conditions
  | 'LOW'        // Tier II  (21–40):  Advisory state, standard drainage checks
  | 'MODERATE'   // Tier III (41–60):  Pre-activation, inspect chronic trouble spots
  | 'HIGH'       // Tier IV  (61–80):  Tactical alert, pre-position machinery, convoy traffic
  | 'VERY_HIGH'; // Tier V   (81–100): Emergency action, road closure, evacuation advisories

/**
 * Standard Operating Procedure (SOP) Action Audience
 */
export type ActionAudience =
  | 'POLICE'
  | 'PWD_BRO'
  | 'DISTRICT_MAGISTRATE'
  | 'PUBLIC';

/**
 * Explanatory Diagnostic Driver for the "Explain Why" Drawer
 */
export interface RiskDriver {
  /** Short descriptive label (e.g. "48h Cumulative Rainfall", "Slope Gradient") */
  label: string;
  /** Observed or calculated current value formatted for human readability */
  value: string | number;
  /** Critical tipping threshold above which hazard spikes */
  threshold: string | number;
  /** Qualitative breach status for visual badges */
  status?: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
}

/**
 * Prescriptive Action Item linked to an Executing Agency
 */
export interface SOPAction {
  /** Target agency or audience responsible for execution */
  audience: ActionAudience;
  /** Specific, actionable tactical order */
  text: string;
  /** Dispatch execution state for simulation */
  is_dispatched?: boolean;
  /** Timestamp of dispatch if triggered */
  dispatched_at?: string | null;
}

/**
 * GeoJSON LineString Geometry for Map Rendering
 */
export interface SegmentGeometry {
  type: 'LineString';
  /** Array of [longitude, latitude] coordinates conforming to GeoJSON standard */
  coordinates: [number, number][];
}

/**
 * Public Road Segment JSON Contract
 * Output of the scoring engine, consumed directly by the geospatial frontend.
 */
export interface RoadSegment {
  /** Unique segment identifier (e.g., "seg-nh7-km58.2") */
  id: string;
  /** Human-readable location description */
  name: string;
  /** Beginning kilometer chainage marker */
  chainage_start: number;
  /** Ending kilometer chainage marker */
  chainage_end: number;
  /** Spatial polyline geometry */
  geometry: SegmentGeometry;
  /** Dynamic Hazard Score (H in [0, 100]) */
  hazard: number;
  /** Consequence Impact Score (C in [0, 100]) */
  consequence: number;
  /** Composite Operational Risk Score (0–100) */
  score: number;
  /** Color-blind-safe risk tier classification */
  tier: RiskTier;
  /** Plain-English diagnostic drivers powering the "Explain Why" drawer */
  drivers: RiskDriver[];
  /** Prescriptive agency directives powering the SOP action cards */
  actions: SOPAction[];
}

/**
 * Dynamic Rainfall Slider & Scenario Controller Input Contract
 */
export interface RainfallInput {
  /** Current 48-hour cumulative precipitation across the corridor in millimeters */
  rainfall_48h_mm: number;
  /** Optional scenario preset identifier */
  scenario_preset?: 'DRY' | 'MONSOON_SURGE' | 'CLOUDBURST' | 'CUSTOM';
}

/**
 * Static Geological & Exposure Parameters (Internal Model Input)
 * Strictly matches docs/CONTRACT.md
 */
export interface RoadSegmentBaseline {
  id: string;
  name: string;
  chainage_start: number;
  chainage_end: number;
  geometry: SegmentGeometry;

  // Geological & Morphological Baseline (Static)
  slope_angle_deg: number;
  lithology: string;
  susceptibility_index: number; // S in [0, 100]
  historical_events_count: number; // H_hist
  rainfall_tipping_threshold_mm: number; // Critical 48h limit

  // Exposure & Vulnerability Baseline (Static)
  population_in_runout: number; // E_pop
  transit_traffic_vph: number; // E_infra
  isolation_penalty: number; // V_isolation (0.0 to 1.0)
  mitigation_offset: number; // delta_prep (0.0 to 0.5)
}

/**
 * Direct Raw Inputs for Engineering Scenarios & Ad-hoc Calculations
 */
export interface RawSegmentInputs {
  /** 48-hour cumulative rainfall in mm */
  rainfall_48h_mm: number;
  /** Geological tipping threshold in mm */
  rainfall_tipping_threshold_mm: number;
  /** Cut-slope angle in degrees */
  slope_angle_deg: number;
  /** Historical catastrophic failures recorded at this chainage */
  historical_events_count: number;
  /** Peak transit traffic volume in vehicles per hour */
  transit_traffic_vph: number;
  /** Distance in kilometers to nearest alternative detour bypass */
  bypass_distance_km: number;
  /** Population count in direct debris flow runout path */
  population_in_runout?: number;
  /** Mitigation offset delta_prep in [0, 0.5] (gabions, loaders, catch nets) */
  mitigation_offset?: number;
  /** Optional pre-computed susceptibility index in [0, 100] */
  susceptibility_index?: number;
}

/**
 * Configurable Mathematical Weights & Normalization Parameters
 */
export interface ScoringWeightsConfig {
  weights: {
    // Hazard Component Weights (ws * S + wh * H_hist)
    susceptibility_weight: number; // ws (default: 0.65)
    historical_weight: number;     // wh (default: 0.35)

    // Consequence Component Weights (wp * E_pop + wi * E_infra + wv * V_iso)
    population_weight: number;     // wp (default: 0.30)
    infrastructure_weight: number; // wi (default: 0.52)
    isolation_weight: number;      // wv (default: 0.45)

    // Composite Operational Risk Weights (wH * H + wC * C)
    hazard_weight: number;         // wH (default: 0.55)
    consequence_weight: number;    // wC (default: 0.45)
  };

  normalization: {
    /** Slope angle in degrees corresponding to baseline susceptibility scaling */
    slope_reference_deg: number; // 50 deg
    /** Scaling factor per historical landslide event */
    historical_event_multiplier: number; // 30 points per event
    /** Traffic saturation capacity in vehicles/hour */
    traffic_capacity_vph: number; // 1000 vph
    /** Bypass detour distance in km corresponding to maximum isolation penalty */
    isolation_detour_reference_km: number; // 50 km
    /** Population normalization divisor (e.g. 100 people -> 100 index) */
    population_scale: number; // 1.0 (or direct count)
    /** Minimum trigger multiplier floor for Phi(T) when rainfall is 0 */
    trigger_min_multiplier: number; // 0.0
  };

  tier_boundaries: {
    very_low_max: number; // 20
    low_max: number;      // 40
    moderate_max: number; // 60
    high_max: number;     // 80
    very_high_max: number;// 100
  };
}
