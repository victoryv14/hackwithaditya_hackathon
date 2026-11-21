/**
 * LRSS Type Contracts matching docs/CONTRACT.md
 */

export type RiskTier = 
  | "VERY_LOW"
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "VERY_HIGH";

export type ActionAudience = 
  | "POLICE" 
  | "PWD_BRO" 
  | "DISTRICT_MAGISTRATE" 
  | "PUBLIC";

export interface RiskDriver {
  label: string;
  value: string | number;
  threshold: string | number;
  status?: "NORMAL" | "ELEVATED" | "CRITICAL";
}

export interface SOPAction {
  audience: ActionAudience;
  text: string;
  is_dispatched?: boolean;
  dispatched_at?: string | null;
}

export interface SegmentGeometry {
  type: "LineString";
  /** GeoJSON coordinates in [longitude, latitude] format */
  coordinates: [number, number][];
}

export interface RoadSegment {
  id: string;
  name: string;
  chainage_start: number;
  chainage_end: number;
  geometry: SegmentGeometry;
  hazard: number;
  consequence: number;
  score: number;
  tier: RiskTier;
  drivers: RiskDriver[];
  actions: SOPAction[];
}

export interface RainfallInput {
  rainfall_48h_mm: number;
  scenario_preset?: "DRY" | "MONSOON_SURGE" | "CLOUDBURST" | "CUSTOM";
}
