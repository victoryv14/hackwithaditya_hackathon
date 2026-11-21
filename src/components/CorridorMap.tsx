import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from 'react-leaflet';
import { RoadSegment, RiskTier } from '../types/corridor';

interface CorridorMapProps {
  segments: RoadSegment[];
  selectedSegment: RoadSegment | null;
  onSelectSegment: (segment: RoadSegment | null) => void;
  activeTierFilter: RiskTier | 'ALL';
}

// Color palette mapping to ensure color-blind safety
export const TIER_COLORS: Record<RiskTier, string> = {
  VERY_LOW: '#38BDF8', // Sky Blue
  LOW: '#2DD4BF',      // Teal
  MODERATE: '#FBBF24', // Amber/Gold
  HIGH: '#FB923C',     // Warm Orange
  VERY_HIGH: '#F43F5E', // Rose/Crimson
};

// Component to handle auto-focusing on selected segment
const MapFocusController: React.FC<{ selectedSegment: RoadSegment | null }> = ({ selectedSegment }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedSegment && selectedSegment.geometry.coordinates.length > 0) {
      const midCoord = selectedSegment.geometry.coordinates[Math.floor(selectedSegment.geometry.coordinates.length / 2)];
      // GeoJSON is [lng, lat], Leaflet is [lat, lng]
      map.flyTo([midCoord[1], midCoord[0]], 13, { duration: 0.8 });
    }
  }, [selectedSegment, map]);

  return null;
};

export const CorridorMap: React.FC<CorridorMapProps> = ({
  segments,
  selectedSegment,
  onSelectSegment,
  activeTierFilter,
}) => {
  // Center of NH-7 corridor (near Devprayag: ~30.15, ~78.58)
  const defaultCenter: [number, number] = [30.165, 78.580];
  const defaultZoom = 11;

  // Free basemap layers requiring zero API keys
  const [basemap, setBasemap] = React.useState<'dark' | 'satellite' | 'street'>('dark');

  const BASEMAP_CONFIGS = {
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      label: 'Dark Tactical'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics',
      label: 'Satellite'
    },
    street: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      label: 'Street'
    }
  };

  // Filter segments based on legend selection
  const filteredSegments = activeTierFilter === 'ALL'
    ? segments
    : segments.filter(s => s.tier === activeTierFilter);

  return (
    <div 
      className="relative w-full h-full min-h-[500px] bg-[#0B0F19] rounded-lg border border-stroke overflow-hidden shadow-card"
      role="application"
      aria-label="NH-7 Corridor Risk Map Viewport"
    >
      {/* 100% Free Basemap Selector (Zero API Key Required) */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1 bg-card/95 backdrop-blur-md border border-stroke p-1 rounded-md shadow-card font-mono text-[11px]">
        {(['dark', 'satellite', 'street'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setBasemap(mode)}
            className={`px-2 py-0.5 rounded transition-colors ${
              basemap === mode 
                ? 'bg-sky-600 text-white font-bold' 
                : 'text-muted hover:text-primary hover:bg-elevated'
            }`}
          >
            {BASEMAP_CONFIGS[mode].label}
          </button>
        ))}
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        style={{ height: '100%', minHeight: '520px', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <MapFocusController selectedSegment={selectedSegment} />

        {/* Dynamic Free Basemap TileLayer */}
        <TileLayer
          key={basemap}
          attribution={BASEMAP_CONFIGS[basemap].attribution}
          url={BASEMAP_CONFIGS[basemap].url}
          maxZoom={17}
        />

        {/* Render each segment as a high-visibility tactical polyline */}
        {filteredSegments.map((segment) => {
          const isSelected = selectedSegment?.id === segment.id;
          const color = TIER_COLORS[segment.tier];
          
          // Invert GeoJSON [lng, lat] to Leaflet [lat, lng]
          const positions: [number, number][] = segment.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          return (
            <Polyline
              key={segment.id}
              positions={positions}
              pathOptions={{
                color: color,
                weight: isSelected ? 8 : (segment.tier === 'VERY_HIGH' ? 6 : 5),
                opacity: isSelected ? 1.0 : (selectedSegment ? 0.4 : 0.85),
                dashArray: isSelected ? undefined : (segment.tier === 'VERY_HIGH' ? '1, 8' : undefined),
                lineCap: 'round',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectSegment(segment),
                mouseover: (e) => {
                  const layer = e.target;
                  if (!isSelected) {
                    layer.setStyle({ weight: 7, opacity: 1.0 });
                  }
                },
                mouseout: (e) => {
                  const layer = e.target;
                  if (!isSelected) {
                    layer.setStyle({ 
                      weight: segment.tier === 'VERY_HIGH' ? 6 : 5, 
                      opacity: selectedSegment ? 0.4 : 0.85 
                    });
                  }
                }
              }}
            >
              <Tooltip 
                direction="top" 
                offset={[0, -5]} 
                opacity={0.95} 
                sticky
              >
                <div className="font-mono text-xs">
                  <div className="font-bold text-primary flex items-center justify-between gap-2">
                    <span>Km {segment.chainage_start.toFixed(1)} - {segment.chainage_end.toFixed(1)}</span>
                    <span 
                      className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                      style={{ backgroundColor: color + '33', color: color }}
                    >
                      {segment.tier.replace('_', ' ')}: {segment.score}/100
                    </span>
                  </div>
                  <div className="text-[11px] text-muted mt-0.5 truncate max-w-[200px]">
                    {segment.name}
                  </div>
                  <div className="text-[10px] text-sky-400 mt-1 flex items-center gap-1">
                    <span>Click to inspect &rarr;</span>
                  </div>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
};
