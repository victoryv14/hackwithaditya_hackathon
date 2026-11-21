import { DEFAULT_SCORING_CONFIG } from '../config/scoringConfig.ts';
import type {
  RiskTier,
  RoadSegment,
  RoadSegmentBaseline,
  RainfallInput,
  RawSegmentInputs,
  RiskDriver,
  SOPAction,
  ScoringWeightsConfig,
} from '../types/scoring.ts';

/**
 * Normalizes slope angle in degrees to a [0, 100] susceptibility index.
 * In Himalayan cut-slopes, 0° is 0, and reference angle (default 50°) scales to 100.
 */
export function normalizeSlope(
  slopeAngleDeg: number,
  referenceDeg: number = DEFAULT_SCORING_CONFIG.normalization.slope_reference_deg
): number {
  if (slopeAngleDeg <= 0) return 0;
  return Math.min(100, Math.max(0, (slopeAngleDeg / referenceDeg) * 100));
}

/**
 * Normalizes historical event counts to a [0, 100] recurrence index.
 */
export function normalizeHistoricalEvents(
  eventCount: number,
  multiplier: number = DEFAULT_SCORING_CONFIG.normalization.historical_event_multiplier
): number {
  if (eventCount <= 0) return 0;
  return Math.min(100, Math.max(0, eventCount * multiplier));
}

/**
 * Normalizes transit traffic volume (vph) to a [0, 100] infrastructure significance index.
 */
export function normalizeTraffic(
  transitTrafficVph: number,
  capacityVph: number = DEFAULT_SCORING_CONFIG.normalization.traffic_capacity_vph
): number {
  if (transitTrafficVph <= 0) return 0;
  return Math.min(100, Math.max(0, (transitTrafficVph / capacityVph) * 100));
}

/**
 * Normalizes bypass / detour distance (km) to a [0, 100] isolation vulnerability index.
 */
export function normalizeBypassDistance(
  bypassDistanceKm: number,
  referenceKm: number = DEFAULT_SCORING_CONFIG.normalization.isolation_detour_reference_km
): number {
  if (bypassDistanceKm <= 0) return 0;
  return Math.min(100, Math.max(0, (bypassDistanceKm / referenceKm) * 100));
}

/**
 * Computes Dynamic Trigger Multiplier Phi(T).
 * Phi(T) = rainfall_48h / tipping_threshold
 * When rainfall exceeds threshold, Phi(T) > 1.0, rapidly escalating hazard.
 * When rainfall is 0, Phi(T) collapses to 0.
 */
export function calculateTriggerMultiplier(
  rainfall48hMm: number,
  tippingThresholdMm: number,
  minMultiplier: number = DEFAULT_SCORING_CONFIG.normalization.trigger_min_multiplier
): number {
  if (rainfall48hMm <= 0) return minMultiplier;
  const safeThreshold = Math.max(1, tippingThresholdMm);
  const ratio = rainfall48hMm / safeThreshold;
  return Math.max(minMultiplier, ratio);
}

/**
 * Calculates Dynamic Hazard Score (H in [0, 100])
 * Formula from PRD Section 2.3:
 * H = (ws * S + wh * H_hist) * Phi(T)
 */
export function calculateHazardScore(
  susceptibilityIndex: number,
  historicalRecurrenceIndex: number,
  rainfall48hMm: number,
  tippingThresholdMm: number,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): number {
  const ws = config.weights.susceptibility_weight;
  const wh = config.weights.historical_weight;

  const S = Math.min(100, Math.max(0, susceptibilityIndex));
  const H_hist = Math.min(100, Math.max(0, historicalRecurrenceIndex));

  const baselineHazard = ws * S + wh * H_hist;
  const phi = calculateTriggerMultiplier(
    rainfall48hMm,
    tippingThresholdMm,
    config.normalization.trigger_min_multiplier
  );

  const rawHazard = baselineHazard * phi;
  return Math.min(100, Math.max(0, Number(rawHazard.toFixed(2))));
}

/**
 * Calculates Consequence Impact Score (C in [0, 100])
 * Formula from PRD Section 2.3:
 * C = min(100, wp * E_pop + wi * E_infra + wv * V_isolation) * (1 - delta_prep)
 * 
 * Crucially avoids the "zero-factor suppression trap" by using additive combination.
 */
export function calculateConsequenceScore(
  populationExposure: number,
  infrastructureSignificance: number,
  isolationVulnerability: number,
  mitigationOffset: number = 0,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): number {
  const wp = config.weights.population_weight;
  const wi = config.weights.infrastructure_weight;
  const wv = config.weights.isolation_weight;

  const E_pop = Math.min(100, Math.max(0, populationExposure));
  const E_infra = Math.min(100, Math.max(0, infrastructureSignificance));
  const V_iso = Math.min(100, Math.max(0, isolationVulnerability));

  const rawConsequence = wp * E_pop + wi * E_infra + wv * V_iso;
  const clampedConsequence = Math.min(100, Math.max(0, rawConsequence));

  const delta_prep = Math.min(0.5, Math.max(0, mitigationOffset));
  const mitigatedConsequence = clampedConsequence * (1.0 - delta_prep);

  return Math.min(100, Math.max(0, Number(mitigatedConsequence.toFixed(2))));
}

/**
 * Calculates Composite Operational Risk Score (0–100)
 * Weighted projection from PRD Section 2.3 / SPEC Section 4.3:
 * Score = round(wH * H + wC * C)
 */
export function calculateCompositeScore(
  hazardScore: number,
  consequenceScore: number,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): number {
  const wH = config.weights.hazard_weight;
  const wC = config.weights.consequence_weight;

  const composite = wH * hazardScore + wC * consequenceScore;
  const clamped = Math.min(100, Math.max(0, composite));
  return Math.round(clamped);
}

/**
 * Maps an operational risk score (0–100) into 5 actionable tiers.
 * Tier boundaries at 20 / 40 / 60 / 80:
 *   0–20:   VERY_LOW
 *   21–40:  LOW
 *   41–60:  MODERATE
 *   61–80:  HIGH
 *   81–100: VERY_HIGH
 */
export function getRiskTier(
  score: number,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): RiskTier {
  const clamped = Math.min(100, Math.max(0, score));
  const boundaries = config.tier_boundaries;

  if (clamped <= boundaries.very_low_max) {
    return 'VERY_LOW';
  }
  if (clamped <= boundaries.low_max) {
    return 'LOW';
  }
  if (clamped <= boundaries.moderate_max) {
    return 'MODERATE';
  }
  if (clamped <= boundaries.high_max) {
    return 'HIGH';
  }
  return 'VERY_HIGH';
}

/**
 * Generates transparent scientific diagnostic drivers for the "Explain Why" drawer.
 */
export function generateDrivers(
  rainfall48hMm: number,
  tippingThresholdMm: number,
  slopeAngleDeg: number,
  historicalEventsCount: number,
  transitTrafficVph: number,
  bypassDistanceKm: number
): RiskDriver[] {
  const rainDeltaPct = Math.round(((rainfall48hMm - tippingThresholdMm) / tippingThresholdMm) * 100);
  const rainStatus: 'NORMAL' | 'ELEVATED' | 'CRITICAL' =
    rainfall48hMm > tippingThresholdMm ? 'CRITICAL' : rainfall48hMm >= tippingThresholdMm * 0.75 ? 'ELEVATED' : 'NORMAL';

  const slopeStatus: 'NORMAL' | 'ELEVATED' | 'CRITICAL' =
    slopeAngleDeg >= 38 ? 'CRITICAL' : slopeAngleDeg >= 30 ? 'ELEVATED' : 'NORMAL';

  const trafficStatus: 'NORMAL' | 'ELEVATED' | 'CRITICAL' =
    transitTrafficVph >= 700 ? 'CRITICAL' : transitTrafficVph >= 400 ? 'ELEVATED' : 'NORMAL';

  const isolationStatus: 'NORMAL' | 'ELEVATED' | 'CRITICAL' =
    bypassDistanceKm >= 30 ? 'CRITICAL' : bypassDistanceKm >= 15 ? 'ELEVATED' : 'NORMAL';

  return [
    {
      label: '48h Cumulative Rainfall',
      value: `${rainfall48hMm} mm${rainDeltaPct > 0 ? ` (+${rainDeltaPct}% above tipping threshold)` : ''}`,
      threshold: `${tippingThresholdMm} mm`,
      status: rainStatus,
    },
    {
      label: 'Slope Gradient',
      value: `${slopeAngleDeg}° cut-slope`,
      threshold: '35° critical shear threshold',
      status: slopeStatus,
    },
    {
      label: 'Historical Landslide Scars',
      value: `${historicalEventsCount} catastrophic blockage${historicalEventsCount === 1 ? '' : 's'} recorded`,
      threshold: '>= 2 recurring events',
      status: historicalEventsCount >= 2 ? 'CRITICAL' : historicalEventsCount === 1 ? 'ELEVATED' : 'NORMAL',
    },
    {
      label: 'Transit Bottleneck Vulnerability',
      value: `${transitTrafficVph} vph; no alternate bypass within ${bypassDistanceKm} km`,
      threshold: 'Primary Highway Lifeline (> 700 vph)',
      status: trafficStatus === 'CRITICAL' || isolationStatus === 'CRITICAL' ? 'CRITICAL' : 'ELEVATED',
    },
  ];
}

/**
 * Generates prescriptive Standard Operating Procedure (SOP) action cards for all 4 audiences.
 */
export function generateSOPActions(
  tier: RiskTier,
  segmentName: string,
  chainageStart: number
): SOPAction[] {
  switch (tier) {
    case 'VERY_HIGH':
      return [
        {
          audience: 'POLICE',
          text: `EMERGENCY CLOSURE: Halt all uphill commercial and pilgrim traffic at Checkpost prior to ${segmentName} (Km ${chainageStart.toFixed(1)}). Divert passenger light vehicles to designated bypass.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PWD_BRO',
          text: `TACTICAL MOBILIZATION: Pre-position heavy wheel-loader and excavator squad on immediate standby near Km ${chainageStart.toFixed(1)}. Clear drainage culvert chutes.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'DISTRICT_MAGISTRATE',
          text: `PUBLIC SAFETY ALERT: Broadcast SACHET / CAP Red Emergency SMS alert to local panchayats and transiting mobile subscribers in corridor sector.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PUBLIC',
          text: `ROAD CLOSED at Km ${chainageStart.toFixed(1)} due to imminent slope failure. Do not proceed. Head to nearest certified relief shelter.`,
          is_dispatched: false,
          dispatched_at: null,
        },
      ];
    case 'HIGH':
      return [
        {
          audience: 'POLICE',
          text: `TACTICAL CONVOYING: Enforce single-lane regulated convoy traffic across Km ${chainageStart.toFixed(1)}. Restrict multi-axle freight vehicles.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PWD_BRO',
          text: `EQUIPMENT STANDBY: Stage JCB machine at nearest highway maintenance depot. Monitor active rockfall chutes.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'DISTRICT_MAGISTRATE',
          text: `ADVISORY NOTICE: Issue Yellow Alert bulletin via DDMA portal and highway VMS display boards.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PUBLIC',
          text: `Caution advised between Km ${chainageStart.toFixed(1)} and Km ${(chainageStart + 0.5).toFixed(1)}. Avoid night transit and watch for shooting stones.`,
          is_dispatched: false,
          dispatched_at: null,
        },
      ];
    case 'MODERATE':
      return [
        {
          audience: 'POLICE',
          text: `Maintain regular patrol along Km ${chainageStart.toFixed(1)}. Report any gravel/rock fragments on carriageway.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PWD_BRO',
          text: `Drainage patrol squad to inspect catch-pits and clear hillside drains of loose debris.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'DISTRICT_MAGISTRATE',
          text: `Maintain internal watch status at DEOC. Log precipitation telemetry every 3 hours.`,
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PUBLIC',
          text: `Corridor open with caution. Drive within speed limits and observe roadside warning signage.`,
          is_dispatched: false,
          dispatched_at: null,
        },
      ];
    case 'LOW':
    case 'VERY_LOW':
    default:
      return [
        {
          audience: 'POLICE',
          text: 'Maintain normal traffic flow. No restrictions required.',
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PWD_BRO',
          text: 'Routine highway patrol. Ensure culvert grates remain free of loose vegetation.',
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'DISTRICT_MAGISTRATE',
          text: 'Green status. Routine monitoring active at DEOC.',
          is_dispatched: false,
          dispatched_at: null,
        },
        {
          audience: 'PUBLIC',
          text: 'Corridor clear. Normal mountain driving precautions apply.',
          is_dispatched: false,
          dispatched_at: null,
        },
      ];
  }
}

/**
 * Evaluates a segment from direct raw engineering inputs.
 * Convenient for standalone calculations, unit tests, and the Km 58.2 test case.
 */
export function evaluateSegmentFromRaw(
  inputs: RawSegmentInputs,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): {
  hazard: number;
  consequence: number;
  score: number;
  tier: RiskTier;
  drivers: RiskDriver[];
} {
  // Normalize or extract susceptibility S
  const susceptibilityIndex =
    inputs.susceptibility_index !== undefined
      ? inputs.susceptibility_index
      : normalizeSlope(inputs.slope_angle_deg, config.normalization.slope_reference_deg);

  // Normalize historical events
  const historicalIndex = normalizeHistoricalEvents(
    inputs.historical_events_count,
    config.normalization.historical_event_multiplier
  );

  // Normalize consequence factors
  const populationExposure = inputs.population_in_runout ?? 0;
  const infrastructureSignificance = normalizeTraffic(
    inputs.transit_traffic_vph,
    config.normalization.traffic_capacity_vph
  );
  const isolationVulnerability = normalizeBypassDistance(
    inputs.bypass_distance_km,
    config.normalization.isolation_detour_reference_km
  );

  const hazard = calculateHazardScore(
    susceptibilityIndex,
    historicalIndex,
    inputs.rainfall_48h_mm,
    inputs.rainfall_tipping_threshold_mm,
    config
  );

  const consequence = calculateConsequenceScore(
    populationExposure,
    infrastructureSignificance,
    isolationVulnerability,
    inputs.mitigation_offset ?? 0,
    config
  );

  const score = calculateCompositeScore(hazard, consequence, config);
  const tier = getRiskTier(score, config);

  const drivers = generateDrivers(
    inputs.rainfall_48h_mm,
    inputs.rainfall_tipping_threshold_mm,
    inputs.slope_angle_deg,
    inputs.historical_events_count,
    inputs.transit_traffic_vph,
    inputs.bypass_distance_km
  );

  return {
    hazard,
    consequence,
    score,
    tier,
    drivers,
  };
}

/**
 * Evaluates a segment against the formal RoadSegmentBaseline contract and RainfallInput.
 * Directly fulfills docs/CONTRACT.md ScoringEngineContract.
 */
export function evaluateSegment(
  baseline: RoadSegmentBaseline,
  rainfallInput: RainfallInput,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): RoadSegment {
  const susceptibilityIndex = baseline.susceptibility_index;
  const historicalIndex = normalizeHistoricalEvents(
    baseline.historical_events_count,
    config.normalization.historical_event_multiplier
  );

  const populationExposure = baseline.population_in_runout;
  const infrastructureSignificance = normalizeTraffic(
    baseline.transit_traffic_vph,
    config.normalization.traffic_capacity_vph
  );
  // isolation_penalty in baseline is 0.0 to 1.0 (or detour km)
  const isolationVulnerability =
    baseline.isolation_penalty <= 1.0
      ? baseline.isolation_penalty * 100
      : baseline.isolation_penalty;

  const hazard = calculateHazardScore(
    susceptibilityIndex,
    historicalIndex,
    rainfallInput.rainfall_48h_mm,
    baseline.rainfall_tipping_threshold_mm,
    config
  );

  const consequence = calculateConsequenceScore(
    populationExposure,
    infrastructureSignificance,
    isolationVulnerability,
    baseline.mitigation_offset,
    config
  );

  const score = calculateCompositeScore(hazard, consequence, config);
  const tier = getRiskTier(score, config);

  const bypassDistanceKm = Math.round(
    (isolationVulnerability / 100) * config.normalization.isolation_detour_reference_km
  );

  const drivers = generateDrivers(
    rainfallInput.rainfall_48h_mm,
    baseline.rainfall_tipping_threshold_mm,
    baseline.slope_angle_deg,
    baseline.historical_events_count,
    baseline.transit_traffic_vph,
    bypassDistanceKm
  );

  const actions = generateSOPActions(tier, baseline.name, baseline.chainage_start);

  return {
    id: baseline.id,
    name: baseline.name,
    chainage_start: baseline.chainage_start,
    chainage_end: baseline.chainage_end,
    geometry: baseline.geometry,
    hazard,
    consequence,
    score,
    tier,
    drivers,
    actions,
  };
}

/**
 * Evaluates the entire corridor across all discrete segments.
 */
export function evaluateCorridor(
  corridorBaselines: RoadSegmentBaseline[],
  rainfallInput: RainfallInput,
  config: ScoringWeightsConfig = DEFAULT_SCORING_CONFIG
): RoadSegment[] {
  return corridorBaselines.map((baseline) => evaluateSegment(baseline, rainfallInput, config));
}
