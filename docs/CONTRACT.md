# LRSS System Contract & Interface Specification

> **Document:** `docs/CONTRACT.md`  
> **Source:** Designed via `api-and-interface-design`  
> **Rule:** The frontend UI and the scoring engine **must strictly communicate through this contract only**. No component may access raw internal database tables or unvalidated properties.

---

## 1. TypeScript Type Definitions

```typescript
/**
 * Asymmetric 5-Tier Operational Risk Classification
 */
export type RiskTier = 
  | "VERY_LOW"   // Tier I   (0–20):   Routine monitoring
  | "LOW"        // Tier II  (21–40):  Advisory state, drainage patrol
  | "MODERATE"   // Tier III (41–60):  Pre-activation, inspect chronic spots
  | "HIGH"       // Tier IV  (61–80):  Tactical alert, convoying, equipment standby
  | "VERY_HIGH"; // Tier V   (81–100): Emergency action, road closure, evacuation

/**
 * Standard Operating Procedure (SOP) Action Audience
 */
export type ActionAudience = 
  | "POLICE" 
  | "PWD_BRO" 
  | "DISTRICT_MAGISTRATE" 
  | "PUBLIC";

/**
 * Explanatory Driver for the "Explain Why" Drawer
 */
export interface RiskDriver {
  /** Short descriptive label (e.g., "48h Cumulative Rainfall", "Cut-Slope Angle") */
  label: string;
  /** Observed or calculated current value */
  value: string | number;
  /** Critical tipping threshold above which failure probability spikes */
  threshold: string | number;
  /** Qualitative breach status for visual badges */
  status?: "NORMAL" | "ELEVATED" | "CRITICAL";
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
  type: "LineString";
  /** Array of [longitude, latitude] coordinates conforming to GeoJSON standards */
  coordinates: [number, number][];
}

/**
 * Public Road Segment JSON Contract
 * Output of the scoring engine, consumed directly by the geospatial frontend.
 */
export interface RoadSegment {
  /** Unique segment identifier */
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
  scenario_preset?: "DRY" | "MONSOON_SURGE" | "CLOUDBURST" | "CUSTOM";
}

/**
 * Mathematical Scoring Engine Boundary Contract
 */
export interface ScoringEngineContract {
  /**
   * Evaluates a segment against dynamic rainfall input and returns the complete RoadSegment contract.
   */
  evaluateSegment(segmentBaseline: RoadSegmentBaseline, input: RainfallInput): RoadSegment;
  
  /**
   * Evaluates the entire corridor across all discrete segments.
   */
  evaluateCorridor(corridorBaselines: RoadSegmentBaseline[], input: RainfallInput): RoadSegment[];
}

/**
 * Static Geological & Exposure Parameters (Internal Model Input)
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
```

---

## 2. Example Concrete Segment Contracts

### Example 1: Routine Conditions (Tier I — Very Low)
*Context: NH-7 Km 22.0 – Km 22.5 near Byasi during 25 mm light rainfall.*

```json
{
  "id": "seg-nh7-km22.0",
  "name": "Byasi Approach Flat Corridor",
  "chainage_start": 22.0,
  "chainage_end": 22.5,
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [78.4312, 30.1245],
      [78.4345, 30.1278],
      [78.4380, 30.1310]
    ]
  },
  "hazard": 14.5,
  "consequence": 22.0,
  "score": 18,
  "tier": "VERY_LOW",
  "drivers": [
    {
      "label": "48h Cumulative Rainfall",
      "value": "25 mm",
      "threshold": "140 mm",
      "status": "NORMAL"
    },
    {
      "label": "Slope Gradient",
      "value": "18° (gentle bench)",
      "threshold": "35°",
      "status": "NORMAL"
    },
    {
      "label": "Bedrock Lithology",
      "value": "Massive Dolomitic Limestone",
      "threshold": "Sheared Phyllite",
      "status": "NORMAL"
    },
    {
      "label": "Historical Slide Scars",
      "value": "0 recorded in 10 yrs",
      "threshold": ">= 2 events",
      "status": "NORMAL"
    }
  ],
  "actions": [
    {
      "audience": "POLICE",
      "text": "Maintain normal traffic flow. No restrictions required.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "PWD_BRO",
      "text": "Routine highway patrol. Ensure culvert grates remain free of loose vegetation.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "DISTRICT_MAGISTRATE",
      "text": "Green status. No public advisory required for Gram Panchayat Byasi.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "PUBLIC",
      "text": "Corridor clear. Normal mountain driving precautions apply.",
      "is_dispatched": false,
      "dispatched_at": null
    }
  ]
}
```

---

### Example 2: Emergency Action Tipping Point (Tier V — Very High)
*Context: NH-7 Km 58.0 – Km 58.5 Sirobagarh Chronic Zone during a 155 mm cloudburst.*

```json
{
  "id": "seg-nh7-km58.0",
  "name": "Sirobagarh Chronic Failure Chute",
  "chainage_start": 58.0,
  "chainage_end": 58.5,
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [78.6890, 30.2210],
      [78.6925, 30.2248],
      [78.6960, 30.2285]
    ]
  },
  "hazard": 92.4,
  "consequence": 84.0,
  "score": 89,
  "tier": "VERY_HIGH",
  "drivers": [
    {
      "label": "48h Cumulative Rainfall",
      "value": "155 mm (+29% above tipping limit)",
      "threshold": "120 mm",
      "status": "CRITICAL"
    },
    {
      "label": "Slope Gradient",
      "value": "42° steep cut-slope",
      "threshold": "35°",
      "status": "CRITICAL"
    },
    {
      "label": "Bedrock Lithology",
      "value": "Highly sheared phyllite with active water seepage",
      "threshold": "Sheared Fault Zone",
      "status": "CRITICAL"
    },
    {
      "label": "Transit Vulnerability",
      "value": "Primary National Highway lifeline (850 vph, no alternate bypass within 42 km)",
      "threshold": "Single access valley",
      "status": "CRITICAL"
    }
  ],
  "actions": [
    {
      "audience": "POLICE",
      "text": "EMERGENCY: Halt all uphill commercial and pilgrim convoy traffic at Checkpost Bravo (Km 52.0). Divert light passenger vehicles via Tehri bypass.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "PWD_BRO",
      "text": "TACTICAL MOBILIZATION: Dispatch heavy wheel-loader and JCB excavator squad on immediate standby at Depot 3 (Km 56.0). Inspect upstream drainage chutes.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "DISTRICT_MAGISTRATE",
      "text": "PUBLIC SAFETY ALERT: Broadcast SACHET / CAP Red Emergency SMS alert to Gram Panchayat Sirobagarh and transit mobile subscribers.",
      "is_dispatched": false,
      "dispatched_at": null
    },
    {
      "audience": "PUBLIC",
      "text": "ROAD CLOSED at Km 58.0 due to imminent debris flow. Proceed immediately to certified emergency shelter at Devprayag Relief Camp #2.",
      "is_dispatched": false,
      "dispatched_at": null
    }
  ]
}
```

---

## 3. Boundary & Validation Rules

1. **Strict Decoupling:** The Map, Explain-Why Drawer, and Action Cards must only consume the `RoadSegment` structure. They must never directly calculate formulas or reach into `RoadSegmentBaseline`.
2. **Deterministic Output:** For any given `RoadSegmentBaseline` and `RainfallInput`, `evaluateSegment()` must produce identical, pure-function outputs.
3. **No Missing Audience:** Every segment output must always provide actions for all four audiences (`POLICE`, `PWD_BRO`, `DISTRICT_MAGISTRATE`, `PUBLIC`), even if the action is routine.
4. **Coordinate Integrity:** Geometry coordinates must strictly follow `[longitude, latitude]` order (GeoJSON standard) rather than Leaflet's `[lat, lng]` order; adapters within the map component will invert coordinates for Leaflet.
