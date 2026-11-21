import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHazardScore,
  calculateConsequenceScore,
  calculateCompositeScore,
  getRiskTier,
  evaluateSegmentFromRaw,
  evaluateSegment,
  evaluateCorridor,
} from './scoringEngine.ts';
import { DEFAULT_SCORING_CONFIG } from '../config/scoringConfig.ts';
import type { RoadSegmentBaseline, RainfallInput } from '../types/scoring.ts';

describe('LRSS Scoring Engine (Section 2.3 of docs/PRD.pdf)', () => {
  describe('Test Case (a): Km 58.2 Sirobagarh Example', () => {
    it('should land in the Very High tier around score 84 under 145mm rain, 39° slope, 2 past events, 850 vph, no bypass within 40 km', () => {
      const result = evaluateSegmentFromRaw({
        rainfall_48h_mm: 145,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 39,
        historical_events_count: 2,
        transit_traffic_vph: 850,
        bypass_distance_km: 40,
        population_in_runout: 0,
        mitigation_offset: 0,
      });

      // The PRD specifies score 84/100 in section 2.5 and Very High tier (81-100)
      assert.strictEqual(result.tier, 'VERY_HIGH');
      assert.ok(
        result.score >= 82 && result.score <= 86,
        `Expected score around 84, got ${result.score}`
      );
      assert.strictEqual(result.score, 84);

      // Verify intermediate components
      assert.ok(result.hazard >= 84 && result.hazard <= 90, `Hazard: ${result.hazard}`);
      assert.ok(result.consequence >= 78 && result.consequence <= 85, `Consequence: ${result.consequence}`);
    });

    it('evaluates Km 58.2 baseline contract format and produces matching scores', () => {
      const baseline: RoadSegmentBaseline = {
        id: 'seg-nh7-km58.2',
        name: 'NH-7 Chainage Km 58.2 Sirobagarh',
        chainage_start: 58.0,
        chainage_end: 58.5,
        geometry: {
          type: 'LineString',
          coordinates: [
            [78.6890, 30.2210],
            [78.6960, 30.2285],
          ],
        },
        slope_angle_deg: 39,
        lithology: 'Sheared phyllite / quartzite zone',
        susceptibility_index: 78,
        historical_events_count: 2,
        rainfall_tipping_threshold_mm: 120,
        population_in_runout: 0,
        transit_traffic_vph: 850,
        isolation_penalty: 0.8,
        mitigation_offset: 0,
      };

      const rainfallInput: RainfallInput = {
        rainfall_48h_mm: 145,
      };

      const evaluated = evaluateSegment(baseline, rainfallInput);

      assert.strictEqual(evaluated.tier, 'VERY_HIGH');
      assert.strictEqual(evaluated.score, 84);
      assert.ok(evaluated.drivers.length > 0, 'Drivers should be generated for Explain-Why drawer');
      assert.ok(evaluated.actions.length === 4, 'SOP actions must be provided for all 4 audiences');
    });
  });

  describe('Test Case (b): The Zero-Factor Trap (Uninhabited Critical Highway)', () => {
    it('prevents zero-population from collapsing consequence to zero on a critical arterial highway', () => {
      // Uninhabited highway: population = 0
      const uninhabitedResult = evaluateSegmentFromRaw({
        rainfall_48h_mm: 145,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 39,
        historical_events_count: 2,
        transit_traffic_vph: 850,
        bypass_distance_km: 40,
        population_in_runout: 0,
        mitigation_offset: 0,
      });

      // Consequence must NOT collapse to 0
      assert.ok(
        uninhabitedResult.consequence >= 75,
        `Consequence score collapsed to ${uninhabitedResult.consequence}! Zero-factor trap failed.`
      );

      // Contrast with naive multiplicative consequence model:
      // Naive: C = Pop * Infra * Isolation = 0 * 85 * 80 = 0
      const naiveMultiplicativeConsequence = 0 * 85 * 80;
      assert.strictEqual(naiveMultiplicativeConsequence, 0);

      // In LRSS additive two-tier matrix, score remains in Very High tier
      assert.strictEqual(uninhabitedResult.tier, 'VERY_HIGH');
      assert.strictEqual(uninhabitedResult.score, 84);
    });

    it('shows that adding population increases consequence up to the 100 cap without distorting baseline fragility', () => {
      const inhabitedResult = evaluateSegmentFromRaw({
        rainfall_48h_mm: 145,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 39,
        historical_events_count: 2,
        transit_traffic_vph: 850,
        bypass_distance_km: 40,
        population_in_runout: 100, // densely populated pilgrimage transit camp
        mitigation_offset: 0,
      });

      assert.ok(inhabitedResult.consequence >= 95, `Expected consequence near 100, got ${inhabitedResult.consequence}`);
      assert.ok(inhabitedResult.score >= 90, `Expected score >= 90, got ${inhabitedResult.score}`);
      assert.strictEqual(inhabitedResult.tier, 'VERY_HIGH');
    });
  });

  describe('Test Case (c): Rainfall Trigger Sensitivity (0 mm vs 145 mm)', () => {
    it('scores much lower for the same slope with 0 mm rain', () => {
      const rain145 = evaluateSegmentFromRaw({
        rainfall_48h_mm: 145,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 39,
        historical_events_count: 2,
        transit_traffic_vph: 850,
        bypass_distance_km: 40,
        population_in_runout: 0,
        mitigation_offset: 0,
      });

      const rain0 = evaluateSegmentFromRaw({
        rainfall_48h_mm: 0,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 39,
        historical_events_count: 2,
        transit_traffic_vph: 850,
        bypass_distance_km: 40,
        population_in_runout: 0,
        mitigation_offset: 0,
      });

      // At 0 mm rain, hazard should collapse to 0 (no meteorological trigger)
      assert.strictEqual(rain0.hazard, 0);

      // Score with 0mm rain must be substantially lower than score with 145mm rain
      assert.ok(
        rain0.score <= 40,
        `Expected score <= 40 with 0mm rain, got ${rain0.score}`
      );
      assert.ok(
        rain145.score - rain0.score >= 40,
        `Expected at least 40 point drop from 145mm to 0mm, drop was ${rain145.score - rain0.score}`
      );

      // Tier should drop from VERY_HIGH to LOW
      assert.strictEqual(rain145.tier, 'VERY_HIGH');
      assert.strictEqual(rain0.tier, 'LOW');
    });
  });

  describe('Test Case (d): Tier Boundaries at 20 / 40 / 60 / 80', () => {
    it('maps scores to the exact risk tiers based on 20/40/60/80 boundaries', () => {
      // Tier I: Very Low (0–20)
      assert.strictEqual(getRiskTier(0), 'VERY_LOW');
      assert.strictEqual(getRiskTier(10), 'VERY_LOW');
      assert.strictEqual(getRiskTier(20), 'VERY_LOW');

      // Tier II: Low (21–40)
      assert.strictEqual(getRiskTier(20.1), 'LOW');
      assert.strictEqual(getRiskTier(21), 'LOW');
      assert.strictEqual(getRiskTier(30), 'LOW');
      assert.strictEqual(getRiskTier(40), 'LOW');

      // Tier III: Moderate (41–60)
      assert.strictEqual(getRiskTier(40.1), 'MODERATE');
      assert.strictEqual(getRiskTier(41), 'MODERATE');
      assert.strictEqual(getRiskTier(50), 'MODERATE');
      assert.strictEqual(getRiskTier(60), 'MODERATE');

      // Tier IV: High (61–80)
      assert.strictEqual(getRiskTier(60.1), 'HIGH');
      assert.strictEqual(getRiskTier(61), 'HIGH');
      assert.strictEqual(getRiskTier(70), 'HIGH');
      assert.strictEqual(getRiskTier(80), 'HIGH');

      // Tier V: Very High (81–100)
      assert.strictEqual(getRiskTier(80.1), 'VERY_HIGH');
      assert.strictEqual(getRiskTier(81), 'VERY_HIGH');
      assert.strictEqual(getRiskTier(84), 'VERY_HIGH');
      assert.strictEqual(getRiskTier(100), 'VERY_HIGH');
    });

    it('clamps scores strictly to [0, 100]', () => {
      assert.strictEqual(getRiskTier(-5), 'VERY_LOW');
      assert.strictEqual(getRiskTier(105), 'VERY_HIGH');
    });
  });

  describe('Mathematical Boundary & Offset Properties', () => {
    it('applies mitigation offset delta_prep to reduce consequence score', () => {
      const unmitigated = evaluateSegmentFromRaw({
        rainfall_48h_mm: 100,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 35,
        historical_events_count: 1,
        transit_traffic_vph: 500,
        bypass_distance_km: 20,
        population_in_runout: 0,
        mitigation_offset: 0.0,
      });

      const mitigated = evaluateSegmentFromRaw({
        rainfall_48h_mm: 100,
        rainfall_tipping_threshold_mm: 120,
        slope_angle_deg: 35,
        historical_events_count: 1,
        transit_traffic_vph: 500,
        bypass_distance_km: 20,
        population_in_runout: 0,
        mitigation_offset: 0.4, // e.g. gabion breast walls & pre-positioned loader
      });

      assert.ok(
        mitigated.consequence < unmitigated.consequence,
        `Mitigated consequence (${mitigated.consequence}) should be lower than unmitigated (${unmitigated.consequence})`
      );
      assert.ok(
        Math.abs(mitigated.consequence - unmitigated.consequence * (1 - 0.4)) < 0.1,
        'Mitigation offset must scale consequence by (1 - delta_prep)'
      );
    });

    it('caps hazard score at 100 during extreme cloudburst precipitation', () => {
      const extremeCloudburst = evaluateSegmentFromRaw({
        rainfall_48h_mm: 400, // 400 mm extreme cloudburst event
        rainfall_tipping_threshold_mm: 100,
        slope_angle_deg: 45,
        historical_events_count: 5,
        transit_traffic_vph: 1000,
        bypass_distance_km: 50,
        population_in_runout: 200,
        mitigation_offset: 0,
      });

      assert.strictEqual(extremeCloudburst.hazard, 100);
      assert.strictEqual(extremeCloudburst.consequence, 100);
      assert.strictEqual(extremeCloudburst.score, 100);
      assert.strictEqual(extremeCloudburst.tier, 'VERY_HIGH');
    });

    it('allows passing custom configuration to override default weights', () => {
      const customConfig = {
        ...DEFAULT_SCORING_CONFIG,
        weights: {
          ...DEFAULT_SCORING_CONFIG.weights,
          hazard_weight: 0.8,
          consequence_weight: 0.2,
        },
      };

      const result = evaluateSegmentFromRaw(
        {
          rainfall_48h_mm: 145,
          rainfall_tipping_threshold_mm: 120,
          slope_angle_deg: 39,
          historical_events_count: 2,
          transit_traffic_vph: 850,
          bypass_distance_km: 40,
          population_in_runout: 0,
          mitigation_offset: 0,
        },
        customConfig
      );

      // Score = 0.8 * 86.64 + 0.2 * 80.20 = 69.31 + 16.04 = 85.35 -> 85
      assert.strictEqual(result.score, 85);
    });

    it('evaluates multiple segments across a corridor in batch', () => {
      const corridorBaselines: RoadSegmentBaseline[] = [
        {
          id: 'seg-1',
          name: 'Gentle Bench Km 15.0',
          chainage_start: 15.0,
          chainage_end: 15.5,
          geometry: { type: 'LineString', coordinates: [[78.3, 30.1], [78.31, 30.11]] },
          slope_angle_deg: 18,
          lithology: 'Massive limestone',
          susceptibility_index: 30,
          historical_events_count: 0,
          rainfall_tipping_threshold_mm: 180,
          population_in_runout: 0,
          transit_traffic_vph: 400,
          isolation_penalty: 0.2,
          mitigation_offset: 0.1,
        },
        {
          id: 'seg-2',
          name: 'Sirobagarh Chronic Chute Km 58.2',
          chainage_start: 58.0,
          chainage_end: 58.5,
          geometry: { type: 'LineString', coordinates: [[78.68, 30.22], [78.69, 30.23]] },
          slope_angle_deg: 39,
          lithology: 'Sheared phyllite',
          susceptibility_index: 78,
          historical_events_count: 2,
          rainfall_tipping_threshold_mm: 120,
          population_in_runout: 0,
          transit_traffic_vph: 850,
          isolation_penalty: 0.8,
          mitigation_offset: 0.0,
        },
      ];

      const results = evaluateCorridor(corridorBaselines, { rainfall_48h_mm: 145 });
      assert.strictEqual(results.length, 2);
      assert.strictEqual(results[0].tier, 'LOW');
      assert.strictEqual(results[1].tier, 'VERY_HIGH');
      assert.strictEqual(results[1].score, 84);
    });
  });
});
