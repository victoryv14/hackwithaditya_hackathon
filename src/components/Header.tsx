import React from 'react';
import { ShieldAlert, Radio, Activity } from 'lucide-react';
import { RoadSegment } from '../types/corridor';

interface HeaderProps {
  segments: RoadSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (id: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  segments,
}) => {
  // Compute real-time counts across the corridor
  const criticalCount = segments.filter(s => s.tier === 'VERY_HIGH').length;
  const highCount = segments.filter(s => s.tier === 'HIGH').length;
  const moderateCount = segments.filter(s => s.tier === 'MODERATE').length;
  const normalCount = segments.filter(s => s.tier === 'LOW' || s.tier === 'VERY_LOW').length;

  return (
    <header className="bg-card border-b border-stroke px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Mission Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-md text-tier-veryHigh">
          <ShieldAlert className="w-5 h-5 animate-pulse" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-primary flex items-center gap-2">
              <span>LRSS COMMAND CENTER</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-400 font-mono font-medium">
                NH-7 PILOT
              </span>
            </h1>
          </div>
          <p className="text-xs text-muted flex items-center gap-2">
            <span>Rishikesh – Devprayag – Srinagar Corridor</span>
            <span className="text-stroke">•</span>
            <span className="font-mono">Km 15.0 to Km 84.0</span>
          </p>
        </div>
      </div>

      {/* Operational Corridor Telemetry */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-elevated border border-stroke text-xs font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-emerald-400 font-semibold">DEOC ACTIVE</span>
        </div>

        {/* Corridor Health Stat Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-stroke"
            title="Normal / Low Risk Segments"
          >
            <span className="w-2 h-2 rounded-full bg-tier-veryLow" />
            <span className="text-muted">Routine:</span>
            <span className="text-primary font-bold">{normalCount}</span>
          </div>

          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-stroke"
            title="Moderate Watch Segments"
          >
            <span className="w-2 h-2 rounded-full bg-tier-moderate" />
            <span className="text-muted">Watch:</span>
            <span className="text-tier-moderate font-bold">{moderateCount}</span>
          </div>

          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B0F19] border border-stroke"
            title="High Tactical Alert Segments"
          >
            <span className="w-2 h-2 rounded-full bg-tier-high" />
            <span className="text-muted">Alert:</span>
            <span className="text-tier-high font-bold">{highCount}</span>
          </div>

          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
              criticalCount > 0 
                ? 'bg-rose-950/60 border-rose-500/60 text-tier-veryHigh' 
                : 'bg-[#0B0F19] border-stroke text-muted'
            }`}
            title="Critical Emergency Segments"
          >
            <span className={`w-2 h-2 rounded-full bg-tier-veryHigh ${criticalCount > 0 ? 'animate-ping' : ''}`} />
            <span className={criticalCount > 0 ? 'text-rose-200' : 'text-muted'}>Emergency:</span>
            <span className="font-bold">{criticalCount}</span>
          </div>
        </div>

        {/* Quick Action Info */}
        <div className="hidden lg:flex items-center text-xs text-muted font-mono pl-2 border-l border-stroke">
          <Activity className="w-3.5 h-3.5 mr-1 text-sky-400" />
          <span>35 Segments Monitored</span>
        </div>
      </div>
    </header>
  );
};
