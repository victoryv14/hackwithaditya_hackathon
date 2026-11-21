import React, { useState } from 'react';
import { CloudRain, Sun, CloudLightning, Flame, AlertTriangle, ChevronDown, ChevronUp, MapPin, ExternalLink } from 'lucide-react';
import { RoadSegment, RiskTier } from '../types/corridor';
import { TIER_COLORS } from './CorridorMap';

export type ScenarioPreset = 'DRY' | 'MONSOON_SURGE' | 'CLOUDBURST' | 'CUSTOM';

interface RainfallControllerProps {
  rainfall48hMm: number;
  onRainfallChange: (rainfallMm: number, preset?: ScenarioPreset) => void;
  activePreset: ScenarioPreset;
  segments: RoadSegment[];
  onSelectSegment: (segment: RoadSegment) => void;
  selectedSegmentId: string | null;
}

const PRESETS: { id: ScenarioPreset; label: string; rainfall: number; icon: React.FC<{ className?: string }>; description: string }[] = [
  {
    id: 'DRY',
    label: 'Dry Season',
    rainfall: 20,
    icon: Sun,
    description: '20 mm — Routine monitoring; low hazard corridor-wide',
  },
  {
    id: 'MONSOON_SURGE',
    label: 'Monsoon Surge',
    rainfall: 85,
    icon: CloudRain,
    description: '85 mm — Elevated alerts at Byasi & Totam gorges',
  },
  {
    id: 'CLOUDBURST',
    label: 'Km 58.2 Cloudburst',
    rainfall: 145,
    icon: CloudLightning,
    description: '145 mm — Critical emergency tipping point at Sirobagarh',
  },
];

export const RainfallController: React.FC<RainfallControllerProps> = ({
  rainfall48hMm,
  onRainfallChange,
  activePreset,
  segments,
  onSelectSegment,
  selectedSegmentId,
}) => {
  const [showHotspots, setShowHotspots] = useState(false);

  // Top 5 Critical Hotspots sorted descending by operational risk score
  const topHotspots = [...segments]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const highestRiskCount = segments.filter(s => s.tier === 'VERY_HIGH' || s.tier === 'HIGH').length;

  return (
    <div className="bg-card border border-stroke rounded-lg p-3 sm:p-4 text-primary font-sans shadow-card relative">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Dynamic Rainfall Slider Controls */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <span className="text-muted font-medium">LIVE 48H PRECIPITATION TRIGGER:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800">
                {rainfall48hMm} <span className="text-xs text-muted font-normal">mm</span>
              </span>
              <span className="text-[10px] text-muted hidden sm:inline">
                ({rainfall48hMm >= 120 ? 'Tipping Threshold Breached' : 'Within Normal Range'})
              </span>
            </div>
          </div>

          {/* Slider input */}
          <div className="relative flex items-center gap-3">
            <span className="text-[11px] font-mono text-muted">0mm</span>
            <input
              type="range"
              min={0}
              max={250}
              step={5}
              value={rainfall48hMm}
              onChange={(e) => onRainfallChange(Number(e.target.value), 'CUSTOM')}
              className="w-full h-2 bg-elevated rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              role="slider"
              aria-label="48-Hour Cumulative Rainfall in millimeters"
              aria-valuemin={0}
              aria-valuemax={250}
              aria-valuenow={rainfall48hMm}
            />
            <span className="text-[11px] font-mono text-muted">250mm</span>
          </div>

          {/* Critical tipping markers */}
          <div className="flex justify-between text-[10px] text-muted font-mono mt-1 px-8">
            <span className="text-emerald-400/70">Routine (0–60mm)</span>
            <span className="text-amber-400/70">Tipping Zone (100–120mm)</span>
            <span className="text-rose-400/70">Cloudburst (&gt;140mm)</span>
          </div>
        </div>

        {/* 1-Click Scenario Presets */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t lg:border-t-0 lg:border-l border-stroke pt-3 lg:pt-0 lg:pl-4">
          <div className="text-xs font-mono text-muted uppercase tracking-wider hidden sm:block">
            PRESETS:
          </div>
          <div className="grid grid-cols-3 sm:flex items-center gap-2">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onRainfallChange(preset.rainfall, preset.id)}
                  title={preset.description}
                  className={`px-3 py-2 rounded-md text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all duration-200 border ${
                    isActive
                      ? preset.id === 'CLOUDBURST'
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm'
                        : preset.id === 'MONSOON_SURGE'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-sky-950/80 border-sky-500 text-sky-300 shadow-sm'
                      : 'bg-elevated border-stroke text-muted hover:text-primary hover:bg-stroke/40'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{preset.label}</span>
                </button>
              );
            })}
          </div>

          {/* Top 5 Hotspots Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`w-full sm:w-auto px-3 py-2 rounded-md text-xs font-mono font-medium flex items-center justify-between sm:justify-start gap-2 border transition-all ${
                showHotspots
                  ? 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                  : highestRiskCount > 0
                  ? 'bg-rose-950/50 border-rose-600/60 text-rose-300 hover:bg-rose-900/60'
                  : 'bg-elevated border-stroke text-muted hover:text-primary'
              }`}
              aria-expanded={showHotspots}
              aria-label="Toggle Top 5 Critical Hotspots Panel"
            >
              <div className="flex items-center gap-1.5">
                <Flame className={`w-3.5 h-3.5 text-rose-400 ${highestRiskCount > 0 ? 'animate-bounce' : ''}`} />
                <span>Top 5 Hotspots</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500 text-white">
                  {highestRiskCount}
                </span>
              </div>
              {showHotspots ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Hotspots Dropdown Drawer Panel */}
      {showHotspots && (
        <div 
          className="mt-3 pt-3 border-t border-stroke grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          role="region"
          aria-label="Top 5 High Risk Highway Segments"
        >
          {topHotspots.map((spot, index) => {
            const isSelected = selectedSegmentId === spot.id;
            const tierColor = TIER_COLORS[spot.tier];

            return (
              <button
                key={spot.id}
                onClick={() => onSelectSegment(spot)}
                className={`text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between gap-1.5 font-mono text-xs ${
                  isSelected
                    ? 'bg-sky-950/80 border-sky-400 ring-1 ring-sky-400 text-primary'
                    : 'bg-elevated border-stroke hover:border-slate-500 hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0B0F19] text-muted border border-stroke font-bold">
                    #{index + 1}
                  </span>
                  <span 
                    className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                    style={{ 
                      color: tierColor, 
                      backgroundColor: `${tierColor}15`,
                      border: `1px solid ${tierColor}40`
                    }}
                  >
                    {spot.tier.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 font-bold text-primary truncate">
                    <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                    <span>Km {spot.chainage_start.toFixed(1)}</span>
                  </div>
                  <div className="text-[11px] text-muted truncate mt-0.5" title={spot.name}>
                    {spot.name}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stroke/50 mt-1">
                  <span className="text-muted">Score:</span>
                  <span className="font-bold" style={{ color: tierColor }}>
                    {spot.score}/100
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
