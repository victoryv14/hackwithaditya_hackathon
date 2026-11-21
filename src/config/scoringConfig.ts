import type { ScoringWeightsConfig } from '../types/scoring.ts';

/**
 * LRSS Mathematical Scoring Engine Configuration
 * 
 * Section 2.3 of docs/PRD.pdf specifies the equations for Dynamic Hazard (H),
 * Consequence Impact (C), and Composite Operational Risk, but intentionally
 * omits hardcoded weights to allow calibration.
 * 
 * SENSIBLE DEFAULTS RATIONALE:
 * 
 * 1. Dynamic Hazard Weights:
 *    - ws = 0.65 (Baseline Susceptibility): Geological slope angle, lithological shearing,
 *      and morphology form the primary foundation of slope failure probability.
 *    - wh = 0.35 (Historical Recurrence): Past landslide events provide empirical evidence
 *      of active shear zones and recurring structural instability.
 *    - Sum: 0.65 + 0.35 = 1.00.
 * 
 * 2. Consequence Impact Weights & The Zero-Factor Trap:
 *    - wp = 0.30 (Population Exposure): Protects human settlements, pilgrim clusters, and schools.
 *    - wi = 0.52 (Infrastructure / Transit Traffic): Reflects the immense economic and strategic
 *      lifeline significance of high-volume mountain corridors (e.g., NH-7 carrying military,
 *      pilgrim, and freight traffic).
 *    - wv = 0.45 (Isolation Vulnerability / Detour Penalty): Accounts for single-access gorge
 *      corridors where no alternate bypass exists for tens of kilometers.
 *    - WHY wi (0.52) + wv (0.45) = 0.97:
 *      Crucially, when an arterial highway is uninhabited (wp * E_pop = 0), a congested transit
 *      artery (E_infra = 85) with no bypass for 40 km (V_iso = 80) still yields:
 *        C = min(100, 0.52 * 85 + 0.45 * 80) = min(100, 44.2 + 36.0) = 80.2.
 *      This completely resolves the "Zero-Factor Suppression Trap" noted in PRD section 2.3,
 *      ensuring vital unpopulated bottlenecks are never under-scored.
 * 
 * 3. Composite Operational Risk Weights:
 *    - wH = 0.55 (Hazard Weight): Slightly elevated weight ensures immediate operational
 *      responsiveness to dynamic rainfall spikes and live cloudburst triggers.
 *    - wC = 0.45 (Consequence Weight): Strong consequence weight anchors prioritization
 *      so emergency authorities focus resources on critical bottlenecks first.
 *    - Sum: 0.55 + 0.45 = 1.00.
 * 
 * 4. Normalization Standards (Himalayan Corridor Engineering):
 *    - slope_reference_deg = 50: In Himalayan rock cuts, 35°–45° cut-slopes represent steep,
 *      unstable shear zones. A 39° slope normalizes to 78/100 baseline susceptibility.
 *    - historical_event_multiplier = 30: 2 past catastrophic events contribute 60/100 to H_hist.
 *    - traffic_capacity_vph = 1000: IRC mountain highway design service capacity is ~800-1000 vph;
 *      850 vph normalizes to 85/100.
 *    - isolation_detour_reference_km = 50: A 40 km detour absence normalizes to 80/100.
 *    - trigger_min_multiplier = 0.0: At 0 mm rainfall, Phi(T) collapses to 0, dropping hazard
 *      and score dramatically during dry weather.
 * 
 * 5. Tier Boundaries:
 *    - Tier I   (VERY_LOW):   0 to 20
 *    - Tier II  (LOW):        20.1 to 40
 *    - Tier III (MODERATE):   40.1 to 60
 *    - Tier IV  (HIGH):       60.1 to 80
 *    - Tier V   (VERY_HIGH):  80.1 to 100
 */
export const DEFAULT_SCORING_CONFIG: ScoringWeightsConfig = {
  weights: {
    // Hazard formula: H = (ws * S + wh * H_hist) * Phi(T)
    susceptibility_weight: 0.65,
    historical_weight: 0.35,

    // Consequence formula: C = min(100, wp * E_pop + wi * E_infra + wv * V_iso) * (1 - delta_prep)
    population_weight: 0.30,
    infrastructure_weight: 0.52,
    isolation_weight: 0.45,

    // Composite risk: Score = round(wH * H + wC * C)
    hazard_weight: 0.55,
    consequence_weight: 0.45,
  },

  normalization: {
    slope_reference_deg: 50,
    historical_event_multiplier: 30,
    traffic_capacity_vph: 1000,
    isolation_detour_reference_km: 50,
    population_scale: 1.0,
    trigger_min_multiplier: 0.0,
  },

  tier_boundaries: {
    very_low_max: 20,
    low_max: 40,
    moderate_max: 60,
    high_max: 80,
    very_high_max: 100,
  },
};
