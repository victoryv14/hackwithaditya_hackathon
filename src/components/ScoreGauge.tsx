import React from 'react';
import { RiskTier } from '../types/corridor';
import { TIER_COLORS } from './CorridorMap';

interface ScoreGaugeProps {
  label: string;
  score: number;
  maxScore?: number;
  tier?: RiskTier;
  subtext?: string;
  formulaNote?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  label,
  score,
  maxScore = 100,
  tier,
  subtext,
  formulaNote,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  // Determine fill color
  const color = tier
    ? TIER_COLORS[tier]
    : score >= 80
    ? '#F43F5E'
    : score >= 60
    ? '#FB923C'
    : score >= 40
    ? '#FBBF24'
    : score >= 20
    ? '#2DD4BF'
    : '#38BDF8';

  return (
    <div className="bg-[#0B0F19] border border-stroke rounded-lg p-3 font-mono">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-muted font-medium">{label}</span>
        <span className="text-primary font-bold text-sm" style={{ color }}>
          {score.toFixed(0)}
          <span className="text-muted text-xs font-normal">/{maxScore}</span>
        </span>
      </div>

      {/* Progress track */}
      <div 
        className="w-full h-2 bg-elevated rounded-full overflow-hidden border border-stroke/50"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-label={label}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>

      {/* Subtext and formula note */}
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
        <span>{subtext ?? `${percentage.toFixed(0)}% capacity`}</span>
        {formulaNote && <span className="text-slate-400 font-mono italic">{formulaNote}</span>}
      </div>
    </div>
  );
};
