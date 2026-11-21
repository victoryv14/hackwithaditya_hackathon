import React, { useState } from 'react';
import { Header } from './components/Header';
import { CorridorMap } from './components/CorridorMap';
import { MapLegend } from './components/MapLegend';
import { RainfallController, ScenarioPreset } from './components/RainfallController';
import { ExplainWhyDrawer } from './components/ExplainWhyDrawer';
import { getCorridorSegments } from './data/nh7CorridorData';
import { RoadSegment, RiskTier } from './types/corridor';
import { MapPin, AlertCircle, Compass, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [rainfall48hMm, setRainfall48hMm] = useState<number>(35);
  const [activePreset, setActivePreset] = useState<ScenarioPreset>('CUSTOM');
  const [segments, setSegments] = useState<RoadSegment[]>(() => getCorridorSegments(35));
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<RiskTier | 'ALL'>('ALL');

  const handleRainfallChange = (newRainfall: number, preset: ScenarioPreset = 'CUSTOM') => {
    setRainfall48hMm(newRainfall);
    setActivePreset(preset);
    const updatedSegments = getCorridorSegments(newRainfall);
    setSegments(updatedSegments);

    // Keep selected segment in sync with live recalculated metrics
    if (selectedSegment) {
      const refreshed = updatedSegments.find(s => s.id === selectedSegment.id) ?? null;
      setSelectedSegment(refreshed);
    }
  };

  const handleSelectSegment = (segment: RoadSegment | null) => {
    setSelectedSegment(segment);
  };

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
        
        {/* Dynamic Hydrometeorological Trigger Controller */}
        <RainfallController
          rainfall48hMm={rainfall48hMm}
          onRainfallChange={handleRainfallChange}
          activePreset={activePreset}
          segments={segments}
          onSelectSegment={(seg) => setSelectedSegment(seg)}
          selectedSegmentId={selectedSegment?.id ?? null}
        />

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
              {activeTierFilter === 'ALL' ? 'All Segments' : `Filtered: Tier ${activeTierFilter}`}
            </span>
            {selectedSegment && (
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                Selected: Km {selectedSegment.chainage_start.toFixed(1)}
              </span>
            )}
            <span className="text-[11px] text-muted flex items-center gap-1 border-l border-stroke pl-3 hidden lg:flex">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Click segment to open Explain Why Drawer</span>
            </span>
          </div>
        </div>

        {/* Map Viewport Area */}
        <div className="relative flex-1 min-h-[520px] w-full rounded-lg overflow-hidden border border-stroke">
          <CorridorMap
            segments={segments}
            selectedSegment={selectedSegment}
            onSelectSegment={handleSelectSegment}
            activeTierFilter={activeTierFilter}
          />

          {/* Interactive Tactical Legend */}
          <MapLegend
            activeTierFilter={activeTierFilter}
            onSelectTierFilter={setActiveTierFilter}
          />
        </div>

        {/* Slide-out Diagnostic "Explain Why" Drawer */}
        <ExplainWhyDrawer
          segment={selectedSegment}
          onClose={() => setSelectedSegment(null)}
          rainfall48hMm={rainfall48hMm}
        />

        {/* Tactical Footer / Instructions */}
        <footer className="text-center text-xs text-muted font-mono py-1 select-none flex items-center justify-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>LRSS Dynamic Triage Cockpit • Section 2.3 Mathematical Scoring Reactive Engine Active</span>
        </footer>
      </main>
    </div>
  );
};

export default App;
