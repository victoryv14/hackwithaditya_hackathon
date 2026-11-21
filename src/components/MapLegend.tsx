import React from 'react';
import { Layers } from 'lucide-react';
import { RiskTier } from '../types/corridor';

interface MapLegendProps {
  activeTierFilter: RiskTier | 'ALL';
  onSelectTierFilter: (tier: RiskTier | 'ALL') => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  activeTierFilter,
  onSelectTierFilter,
}) => {
  const tiers: { tier: RiskTier; name: string; score: string; color: string; desc: string; roman: string }[] = [
    { tier: 'VERY_LOW', roman: 'I', name: 'Very Low', score: '0–20', color: '#38BDF8', desc: 'Routine Conditions' },
    { tier: 'LOW', roman: 'II', name: 'Low', score: '21–40', color: '#2DD4BF', desc: 'Advisory State' },
    { tier: 'MODERATE', roman: 'III', name: 'Moderate', score: '41–60', color: '#FBBF24', desc: 'Pre-Activation' },
    { tier: 'HIGH', roman: 'IV', name: 'High', score: '61–80', color: '#FB923C', desc: 'Tactical Alert' },
    { tier: 'VERY_HIGH', roman: 'V', name: 'Very High', score: '81–100', color: '#F43F5E', desc: 'Emergency Action' },
  ];

  return (
    <div 
      className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-md border border-stroke rounded-lg p-3 max-w-xs shadow-card text-xs select-none"
      role="region"
      aria-label="Risk Tier Legend"
    >
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stroke">
        <div className="flex items-center gap-1.5 font-semibold text-primary">
          <Layers className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
          <span>5-TIER RISK SCALE</span>
        </div>
        <button
          onClick={() => onSelectTierFilter('ALL')}
          className={`text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors ${
            activeTierFilter === 'ALL' 
              ? 'bg-sky-600 text-white font-bold' 
              : 'text-muted hover:text-primary hover:bg-elevated'
          }`}
          aria-label="Show all risk tiers"
        >
          SHOW ALL
        </button>
      </div>

      <div className="space-y-1.5" role="list">
        {tiers.map(({ tier, roman, name, score, color, desc }) => {
          const isSelected = activeTierFilter === tier;
          return (
            <button
              key={tier}
              onClick={() => onSelectTierFilter(isSelected ? 'ALL' : tier)}
              className={`w-full flex items-center justify-between p-1.5 rounded transition-all text-left font-mono focus:outline-none focus:ring-1 focus:ring-sky-400 ${
                isSelected 
                  ? 'bg-elevated border border-stroke ring-1 ring-sky-400/50' 
                  : 'hover:bg-elevated/60'
              }`}
              role="listitem"
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-sm flex-shrink-0 border border-white/20"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-semibold text-primary">
                  {roman}. {name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-muted">{score}</span>
                <span className="text-[10px] text-muted hidden sm:inline">• {desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-2 pt-1.5 border-t border-stroke text-[10px] text-muted leading-tight font-sans">
        WCAG AA & Color-blind safe scale (Sky → Teal → Amber → Orange → Crimson).
      </p>
    </div>
  );
};
