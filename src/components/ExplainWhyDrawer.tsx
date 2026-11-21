import React, { useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  CloudRain, 
  Mountain, 
  Clock, 
  Car, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Layers,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RoadSegment, RiskTier } from '../types/corridor';
import { TIER_COLORS } from './CorridorMap';
import { ScoreGauge } from './ScoreGauge';

interface ExplainWhyDrawerProps {
  segment: RoadSegment | null;
  onClose: () => void;
  rainfall48hMm: number;
}

const ROMAN_TIERS: Record<RiskTier, string> = {
  VERY_LOW: 'TIER I • VERY LOW',
  LOW: 'TIER II • LOW',
  MODERATE: 'TIER III • MODERATE',
  HIGH: 'TIER IV • HIGH',
  VERY_HIGH: 'TIER V • VERY HIGH',
};

export const ExplainWhyDrawer: React.FC<ExplainWhyDrawerProps> = ({
  segment,
  onClose,
  rainfall48hMm,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button on open and handle ESC key
  useEffect(() => {
    if (segment) {
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [segment, onClose]);

  if (!segment) return null;

  const tierColor = TIER_COLORS[segment.tier];

  return (
    <>
      {/* Backdrop overlay on smaller screens */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1050] lg:hidden animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Container */}
      <aside
        ref={drawerRef}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] max-w-full bg-[#111827] border-l border-[#374151] z-[1100] shadow-[-4px_0_24px_rgba(0,0,0,0.7)] flex flex-col font-sans text-primary overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-segment-title"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stroke bg-[#0B0F19] flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-950 border border-sky-800 text-sky-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                NH-7 Km {segment.chainage_start.toFixed(1)} – {segment.chainage_end.toFixed(1)}
              </span>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                style={{
                  color: tierColor,
                  backgroundColor: `${tierColor}15`,
                  border: `1px solid ${tierColor}40`,
                }}
              >
                {ROMAN_TIERS[segment.tier]}
              </span>
            </div>
            <h2 id="drawer-segment-title" className="text-base font-bold text-primary tracking-tight">
              {segment.name}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-[#1F2937] border border-transparent hover:border-stroke transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Close Explain Why drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Transparent Operational Risk Summary Banner */}
          <div 
            className="rounded-lg p-3.5 border font-mono flex items-center justify-between"
            style={{
              backgroundColor: `${tierColor}10`,
              borderColor: `${tierColor}40`,
            }}
          >
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold">
                Operational Risk Index
              </div>
              <div className="text-2xl font-bold flex items-baseline gap-1" style={{ color: tierColor }}>
                <span>{segment.score}</span>
                <span className="text-xs text-muted font-normal">/ 100</span>
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                {segment.tier === 'VERY_HIGH'
                  ? 'CRITICAL: Immediate Road Closure Recommended'
                  : segment.tier === 'HIGH'
                  ? 'ALERT: Tactical Convoy & Machinery Standby'
                  : segment.tier === 'MODERATE'
                  ? 'WATCH: Chronic Trouble Spot Pre-activation'
                  : 'ROUTINE: Normal Mountain Highway Conditions'}
              </div>
            </div>

            <div className="p-2.5 rounded-full" style={{ backgroundColor: `${tierColor}20` }}>
              {segment.tier === 'VERY_HIGH' ? (
                <AlertOctagon className="w-8 h-8 animate-pulse" style={{ color: tierColor }} />
              ) : segment.tier === 'HIGH' ? (
                <ShieldAlert className="w-8 h-8" style={{ color: tierColor }} />
              ) : segment.tier === 'MODERATE' ? (
                <AlertTriangle className="w-8 h-8" style={{ color: tierColor }} />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
            </div>
          </div>

          {/* Mathematical Decomposition (H & C Scores) */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                MATHEMATICAL SCORE DECOMPOSITION
              </span>
              <span>Section 2.3 PRD</span>
            </div>

            <div className="space-y-2">
              <ScoreGauge
                label="Dynamic Hazard Index (H)"
                score={segment.hazard}
                tier={segment.tier}
                subtext="Fragility × Live Trigger Multiplier"
                formulaNote="H = (ws·S + wh·H_hist) × Φ(T)"
              />
              <ScoreGauge
                label="Consequence Impact Index (C)"
                score={segment.consequence}
                tier={segment.tier}
                subtext="Lifeline Traffic + Isolation Vulnerability"
                formulaNote="C = min(100, wp·E_pop + wi·E_infra + wv·V_iso)"
              />
            </div>
          </div>

          {/* Diagnostic Risk Drivers (Explain Why Section) */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                EXPLAIN WHY: DIAGNOSTIC DRIVERS
              </span>
              <span>4 Factors Evaluated</span>
            </div>

            <div className="space-y-2">
              {segment.drivers.map((driver, idx) => {
                const isCritical = driver.status === 'CRITICAL';
                const isElevated = driver.status === 'ELEVATED';

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#0B0F19] border border-stroke text-xs font-mono flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-muted font-medium">{driver.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                            : isElevated
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                        }`}
                      >
                        {driver.status ?? 'NORMAL'}
                      </span>
                    </div>

                    <div className="text-primary font-bold text-[13px]">{driver.value}</div>

                    <div className="text-[11px] text-muted flex items-center justify-between pt-1 border-t border-stroke/40">
                      <span>Threshold:</span>
                      <span className="text-slate-300 font-medium">{driver.threshold}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prescriptive Agency SOP Action Directives */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-muted mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                PRIORITY AGENCY SOP ACTIONS
              </span>
              <span>SOP Dispatch Ready</span>
            </div>

            <div className="space-y-2">
              {segment.actions.map((action, idx) => {
                const audienceColor =
                  action.audience === 'POLICE'
                    ? '#38BDF8'
                    : action.audience === 'PWD_BRO'
                    ? '#FBBF24'
                    : action.audience === 'DISTRICT_MAGISTRATE'
                    ? '#F43F5E'
                    : '#2DD4BF';

                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#1F2937] border border-stroke text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          color: audienceColor,
                          backgroundColor: `${audienceColor}15`,
                          border: `1px solid ${audienceColor}40`,
                        }}
                      >
                        {action.audience.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-muted">Direct Order</span>
                    </div>

                    <p className="text-slate-200 text-xs leading-relaxed">{action.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Tactical Footer */}
        <div className="p-3 bg-[#0B0F19] border-t border-stroke flex items-center justify-between text-xs font-mono text-muted flex-shrink-0">
          <span>DEOC NH-7 Incident Console</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#1F2937] hover:bg-stroke text-primary transition-all text-xs border border-stroke"
          >
            Close Inspector
          </button>
        </div>
      </aside>
    </>
  );
};
