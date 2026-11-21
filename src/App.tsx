import React, { useState } from 'react';
import { Header } from './components/Header';
import { CorridorMap } from './components/CorridorMap';
import { MapLegend } from './components/MapLegend';
import { initialCorridorSegments } from './data/nh7CorridorData';
import { RoadSegment, RiskTier } from './types/corridor';
import { MapPin, AlertCircle, Compass, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [segments] = useState<RoadSegment[]>(initialCorridorSegments);
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<RiskTier | 'ALL'>('ALL');

  return (
    <div className="min-h-screen bg-app text-primary flex flex-col font-sans">
      {/* Tactical Emergency Header */}
      <Header
        segments={segments}
        selectedSegmentId={selectedSegment?.id ?? null}
        onSelectSegment={(id) => {
          const seg = segments.find(s => s.id === id) ?? null;
          setSelectedSegment(seg);
        }}
      />

      {/* Main Command Center Stage */}
      <main className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
        {/* Corridor Status Notification Ribbon */}
        <div 
          className="bg-card border border-stroke rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none"
          role="status"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-muted">Target Corridor:</span>
            <span className="font-semibold text-primary">NH-7 Rishikesh (Km 15) &rarr; Devprayag &rarr; Srinagar (Km 84)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-muted hidden md:inline">Showing:</span>
            <span className="px-2 py-0.5 rounded bg-elevated border border-stroke text-sky-400 font-semibold">
              {activeTierFilter === 'ALL' ? 'All 35 Segments' : `Filtered: Tier ${activeTierFilter}`}
            </span>
            {selectedSegment && (
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Km {selectedSegment.chainage_start.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="relative flex-1 min-h-[550px] w-full rounded-lg overflow-hidden border border-stroke">
          <CorridorMap
            segments={segments}
            selectedSegment={selectedSegment}
            onSelectSegment={setSelectedSegment}
            activeTierFilter={activeTierFilter}
          />

          {/* Interactive Tactical Legend */}
          <MapLegend
            activeTierFilter={activeTierFilter}
            onSelectTierFilter={setActiveTierFilter}
          />

          {/* Quick Segment Inspection Card (Floating pill if segment selected) */}
          {selectedSegment && (
            <div 
              className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-md border border-stroke rounded-lg p-3 max-w-sm shadow-card text-xs font-mono"
              role="dialog"
              aria-label="Selected Segment Overview"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Km {selectedSegment.chainage_start.toFixed(1)} – {selectedSegment.chainage_end.toFixed(1)}</span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">{selectedSegment.name}</p>
                </div>
                <button
                  onClick={() => setSelectedSegment(null)}
                  className="text-muted hover:text-primary p-1 rounded hover:bg-elevated text-sm"
                  aria-label="Close segment preview"
                >
                  &times;
                </button>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stroke grid grid-cols-3 gap-2 text-center">
                <div className="p-1 rounded bg-[#0B0F19] border border-stroke">
                  <div className="text-[10px] text-muted">Hazard (H)</div>
                  <div className="font-bold text-primary">{selectedSegment.hazard.toFixed(0)}</div>
                </div>
                <div className="p-1 rounded bg-[#0B0F19] border border-stroke">
                  <div className="text-[10px] text-muted">Impact (C)</div>
                  <div className="font-bold text-primary">{selectedSegment.consequence.toFixed(0)}</div>
                </div>
                <div className="p-1 rounded bg-[#0B0F19] border border-stroke">
                  <div className="text-[10px] text-muted">Risk Score</div>
                  <div className="font-bold text-tier-veryHigh">{selectedSegment.score}/100</div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-muted flex items-center gap-1">
                <Info className="w-3 h-3 text-sky-400 flex-shrink-0" />
                <span>Next slices will unlock the dynamic rainfall slider & Explain Why drawer.</span>
              </div>
            </div>
          )}
        </div>

        {/* Tactical Footer / Instructions */}
        <footer className="text-center text-xs text-muted font-mono py-1 select-none flex items-center justify-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Interactive Risk Map Slice Ready • Click any road segment or legend filter to inspect telemetry</span>
        </footer>
      </main>
    </div>
  );
};

export default App;
