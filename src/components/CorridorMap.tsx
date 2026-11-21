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
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <MapFocusController selectedSegment={selectedSegment} />

        {/* High-contrast dark topographic base tiles (CartoDB Dark Matter) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
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
