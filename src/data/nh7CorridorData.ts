import { RoadSegment } from '../types/corridor';

/**
 * NH-7 Rishikesh - Devprayag - Srinagar Corridor Dataset
 * 35 Discrete 250m - 500m Chainage Segments with Realistic Geological Parameters
 * Conforming strictly to docs/CONTRACT.md
 */

// Helper to interpolate coordinates
function createCoordSegment(
  startLng: number, startLat: number, 
  endLng: number, endLat: number, 
  jitter: number = 0.0005
): [number, number][] {
  const midLng = (startLng + endLng) / 2 + (Math.sin(startLat * 100) * jitter);
  const midLat = (startLat + endLat) / 2 + (Math.cos(startLng * 100) * jitter);
  return [
    [Number(startLng.toFixed(5)), Number(startLat.toFixed(5))],
    [Number(midLng.toFixed(5)), Number(midLat.toFixed(5))],
    [Number(endLng.toFixed(5)), Number(endLat.toFixed(5))]
  ];
}

// 35 Chainage Segments
export const initialCorridorSegments: RoadSegment[] = [
  // SECTION 1: Rishikesh to Shivpuri (Km 15.0 to 24.5)
  {
    id: "nh7-km15.0",
    name: "Tapovan Toll Gateway",
    chainage_start: 15.0,
    chainage_end: 15.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3245, 30.1120, 78.3310, 30.1165) },
    hazard: 18.0,
    consequence: 45.0,
    score: 28,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "160 mm", status: "NORMAL" },
      { label: "Cut-Slope Angle", value: "24° (retained bench)", threshold: "35°", status: "NORMAL" },
      { label: "Lithology", value: "Subathu quartzites with boulder gravel", threshold: "Sheared Phyllite", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Maintain normal flow through Tapovan barrier. Log outbound commercial vehicles." },
      { audience: "PWD_BRO", text: "Routine highway sweep; keep road shoulders clear." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory. Normal transit conditions." },
      { audience: "PUBLIC", text: "Clear route. Obey posted 40 km/h ghat speed limits." }
    ]
  },
  {
    id: "nh7-km17.2",
    name: "Brahmpuri River Bend",
    chainage_start: 17.0,
    chainage_end: 17.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3420, 30.1230, 78.3510, 30.1285) },
    hazard: 24.0,
    consequence: 38.0,
    score: 30,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" },
      { label: "Cut-Slope Angle", value: "29° natural vegetated bank", threshold: "35°", status: "NORMAL" },
      { label: "Lithology", value: "Weathered sandstone with terraced forest", threshold: "Sheared Phyllite", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Normal traffic. Regular patrol car monitoring." },
      { audience: "PWD_BRO", text: "Check roadside culvert drains for loose river silt." },
      { audience: "DISTRICT_MAGISTRATE", text: "Advisory tier low. No citizen alerts." },
      { audience: "PUBLIC", text: "Open corridor. Watch for occasional wild animals on bends." }
    ]
  },
  {
    id: "nh7-km19.5",
    name: "Shivpuri Rafting Hub Approach",
    chainage_start: 19.5,
    chainage_end: 20.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3750, 30.1350, 78.3840, 30.1385) },
    hazard: 20.0,
    consequence: 48.0,
    score: 32,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" },
      { label: "Cut-Slope Angle", value: "22° river terrace", threshold: "35°", status: "NORMAL" },
      { label: "Tourist Exposure", value: "High seasonal campsite density", threshold: "Moderate", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Ensure tourist buses park within designated turnouts only." },
      { audience: "PWD_BRO", text: "Inspect drainage chute at Km 19.8." },
      { audience: "DISTRICT_MAGISTRATE", text: "Normal monitoring. Campsite coordinators notified of weather radar." },
      { audience: "PUBLIC", text: "Normal transit. Do not park beneath unprotected cliff faces." }
    ]
  },
  {
    id: "nh7-km22.0",
    name: "Gular Dogi Gorge Entry",
    chainage_start: 22.0,
    chainage_end: 22.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3980, 30.1340, 78.4080, 30.1290) },
    hazard: 44.0,
    consequence: 52.0,
    score: 47,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "48 mm", threshold: "115 mm", status: "ELEVATED" },
      { label: "Cut-Slope Angle", value: "36° newly widened cut-face", threshold: "35°", status: "ELEVATED" },
      { label: "Lithology", value: "Jointed slate and fractured quartzite", threshold: "Sheared Phyllite", status: "ELEVATED" },
      { label: "Historical Scars", value: "1 recurring shooting stone zone", threshold: ">= 2 events", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Speed restriction 30 km/h. Watch for rolling rocks on the uphill lane." },
      { audience: "PWD_BRO", text: "Deploy spotter squad with megaphone. Inspect wire netting at Km 22.3." },
      { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch: Issue caution notification to transport unions." },
      { audience: "PUBLIC", text: "Caution advised: Minor shooting stones reported. Avoid halting under slopes." }
    ]
  },
  {
    id: "nh7-km24.5",
    name: "Byasi Bridge Western Portal",
    chainage_start: 24.5,
    chainage_end: 25.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4190, 30.1180, 78.4280, 30.1090) },
    hazard: 38.0,
    consequence: 60.0,
    score: 48,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "45 mm", threshold: "120 mm", status: "NORMAL" },
      { label: "Transit Lifeline", value: "Bridge approach bottleneck", threshold: "Critical", status: "ELEVATED" },
      { label: "Cut-Slope Angle", value: "33° fortified slope", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Enforce single-lane orderly convoy if heavy vehicles slow down." },
      { audience: "PWD_BRO", text: "Pre-position small backhoe at Byasi depot." },
      { audience: "DISTRICT_MAGISTRATE", text: "Monitoring: Bridge status green." },
      { audience: "PUBLIC", text: "Bridge approach clear. Maintain headlight visibility." }
    ]
  },

  // SECTION 2: Byasi to Kaudiyala & Teen Dhara (Km 26.0 to 45.0)
  {
    id: "nh7-km28.0",
    name: "Byasi Slide Zone Alpha",
    chainage_start: 28.0,
    chainage_end: 28.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4410, 30.0890, 78.4520, 30.0810) },
    hazard: 72.0,
    consequence: 68.0,
    score: 70,
    tier: "HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "98 mm (approaching limit)", threshold: "110 mm", status: "CRITICAL" },
      { label: "Cut-Slope Angle", value: "41° steep weathered scarp", threshold: "35°", status: "CRITICAL" },
      { label: "Lithology", value: "Highly sheared phyllitic schist", threshold: "Sheared Fault", status: "CRITICAL" },
      { label: "Historical Precedent", value: "3 major debris blockages in 2022-2024", threshold: ">= 2 events", status: "CRITICAL" }
    ],
    actions: [
      { audience: "POLICE", text: "HALT uphill heavy trailers. Institute alternate-direction convoy pilot car." },
      { audience: "PWD_BRO", text: "HIGH ALERT: Pre-position wheel loader at Km 27.5 turnoff. Standby operator ready." },
      { audience: "DISTRICT_MAGISTRATE", text: "Issue Yellow Advisory SMS for Tehri-Garhwal transit corridor." },
      { audience: "PUBLIC", text: "High Hazard Zone: Do not stop vehicles. Pass rapidly with extreme vigilance." }
    ]
  },
  {
    id: "nh7-km30.5",
    name: "Kaudiyala Rest Halt Corridor",
    chainage_start: 30.5,
    chainage_end: 31.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4720, 30.0760, 78.4830, 30.0740) },
    hazard: 18.0,
    consequence: 40.0,
    score: 26,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "40 mm", threshold: "155 mm", status: "NORMAL" },
      { label: "Cut-Slope Angle", value: "21° wide river terrace", threshold: "35°", status: "NORMAL" },
      { label: "Emergency Assets", value: "Designated civil relief staging area", threshold: "N/A", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Ensure rest area parking does not spill onto highway shoulders." },
      { audience: "PWD_BRO", text: "Routine patrol." },
      { audience: "DISTRICT_MAGISTRATE", text: "Relief staging point active and supplied." },
      { audience: "PUBLIC", text: "Rest stop open with clean amenities and medical aid post." }
    ]
  },
  {
    id: "nh7-km33.0",
    name: "Singtoli Overhang Chute",
    chainage_start: 33.0,
    chainage_end: 33.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4950, 30.0780, 78.5040, 30.0850) },
    hazard: 58.0,
    consequence: 62.0,
    score: 60,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "65 mm", threshold: "110 mm", status: "ELEVATED" },
      { label: "Cut-Slope Angle", value: "38° overhanging bedrock", threshold: "35°", status: "CRITICAL" },
      { label: "Lithology", value: "Crushed quartzite with clay gouge", threshold: "Sheared Fault", status: "ELEVATED" }
    ],
    actions: [
      { audience: "POLICE", text: "Caution boards active. Restrict overnight heavy transit." },
      { audience: "PWD_BRO", text: "Check rockfall catch barrier tension cables at Km 33.2." },
      { audience: "DISTRICT_MAGISTRATE", text: "Pre-activation status. Inform regional bus depots." },
      { audience: "PUBLIC", text: "Drive with caution: Active rockfall netting installed on cliffs." }
    ]
  },
  {
    id: "nh7-km35.8",
    name: "Atali Cliff Corridor",
    chainage_start: 35.5,
    chainage_end: 36.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5120, 30.0920, 78.5190, 30.0990) },
    hazard: 32.0,
    consequence: 45.0,
    score: 38,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "40 mm", threshold: "140 mm", status: "NORMAL" },
      { label: "Slope Stability", value: "Reinforced rock bolted face", threshold: "Unstable", status: "NORMAL" },
      { label: "Mitigation", value: "Concrete retaining wall present", threshold: "Unmitigated", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Maintain normal flow." },
      { audience: "PWD_BRO", text: "Routine drainage channel sweep." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." },
      { audience: "PUBLIC", text: "Normal transit conditions." }
    ]
  },
  {
    id: "nh7-km38.2",
    name: "Teen Dhara Food Stalls Stretch",
    chainage_start: 38.0,
    chainage_end: 38.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5280, 30.1080, 78.5360, 30.1150) },
    hazard: 52.0,
    consequence: 75.0,
    score: 62,
    tier: "HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "70 mm", threshold: "115 mm", status: "ELEVATED" },
      { label: "Consequence Exposure", value: "32 roadside commercial stalls & dhabas", threshold: "High", status: "CRITICAL" },
      { label: "Culvert Discharge", value: "Spring discharge running at 80% culvert capacity", threshold: "Full", status: "ELEVATED" }
    ],
    actions: [
      { audience: "POLICE", text: "Prohibit unauthorized shoulder parking outside dhabas." },
      { audience: "PWD_BRO", text: "Inspect Teen Dhara main stream culvert; clear timber debris." },
      { audience: "DISTRICT_MAGISTRATE", text: "Issue alert to Gram Panchayat commercial shopkeepers to monitor water turbidity." },
      { audience: "PUBLIC", text: "Do not loiter along hillside shoulder. Park in designated off-road lots only." }
    ]
  },

  // SECTION 3: Teen Dhara to Totam & Bagwan (Km 40.0 to 60.0)
  {
    id: "nh7-km41.5",
    name: "Totam Gorge South Portal",
    chainage_start: 41.5,
    chainage_end: 42.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5440, 30.1220, 78.5520, 30.1290) },
    hazard: 68.0,
    consequence: 72.0,
    score: 70,
    tier: "HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "85 mm", threshold: "105 mm", status: "CRITICAL" },
      { label: "Cut-Slope Angle", value: "43° precipitous cliff", threshold: "35°", status: "CRITICAL" },
      { label: "Lithology", value: "Highly sheared phyllite with talus overburden", threshold: "Sheared Fault", status: "CRITICAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Deploy highway patrol pilot vehicle. Enforce 20m following distance." },
      { audience: "PWD_BRO", text: "Standby JCB squad at Km 41 depot. Operators on 10-minute readiness." },
      { audience: "DISTRICT_MAGISTRATE", text: "Yellow Tactical Alert: Pre-alert Pauri & Tehri emergency control." },
      { audience: "PUBLIC", text: "Severe hazard zone. Travel strictly in daylight hours; sound horn on blind turns." }
    ]
  },
  {
    id: "nh7-km44.0",
    name: "Totam Chronic Landslide Zone",
    chainage_start: 44.0,
    chainage_end: 44.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5590, 30.1340, 78.5670, 30.1380) },
    hazard: 88.0,
    consequence: 78.0,
    score: 84,
    tier: "VERY_HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "115 mm (exceeds threshold by 15%)", threshold: "100 mm", status: "CRITICAL" },
      { label: "Historical Failures", value: "5 catastrophic blockages recorded in 4 years", threshold: ">= 2 events", status: "CRITICAL" },
      { label: "Active Creep", value: "Visible tension cracks observed in crown scarp", threshold: "None", status: "CRITICAL" },
      { label: "Isolation Penalty", value: "Sole lifeline connecting Devprayag to Rishikesh", threshold: "Single road", status: "CRITICAL" }
    ],
    actions: [
      { audience: "POLICE", text: "EMERGENCY: Immediate roadblock at Checkpost Totam. Halt all uphill and downhill traffic." },
      { audience: "PWD_BRO", text: "TACTICAL ACTION: Mobilize two heavy loaders to clearance positions. Do not enter chute until spotter confirms slope stabilization." },
      { audience: "DISTRICT_MAGISTRATE", text: "RED ACTION: Issue SACHET CAP emergency SMS alert to all transiting commuters." },
      { audience: "PUBLIC", text: "ROAD CLOSED: Imminent debris flow hazard. Divert via Chamba - Tehri alternative route." }
    ]
  },
  {
    id: "nh7-km46.8",
    name: "Gular Bridge Descent",
    chainage_start: 46.5,
    chainage_end: 47.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5720, 30.1410, 78.5790, 30.1440) },
    hazard: 30.0,
    consequence: 45.0,
    score: 36,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "140 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "22° stable vegetated ridge", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Normal traffic flow." },
      { audience: "PWD_BRO", text: "Routine monitoring." },
      { audience: "DISTRICT_MAGISTRATE", text: "Advisory Green." },
      { audience: "PUBLIC", text: "Route open." }
    ]
  },
  {
    id: "nh7-km49.2",
    name: "Bagwan River Terrace",
    chainage_start: 49.0,
    chainage_end: 49.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5830, 30.1460, 78.5890, 30.1480) },
    hazard: 22.0,
    consequence: 42.0,
    score: 30,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" },
      { label: "Slope Stability", value: "Wide alluvium terrace", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Normal conditions." },
      { audience: "PWD_BRO", text: "Check roadside culverts." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." },
      { audience: "PUBLIC", text: "Safe corridor." }
    ]
  },
  {
    id: "nh7-km52.0",
    name: "Devprayag Sangam View Point",
    chainage_start: 52.0,
    chainage_end: 52.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5940, 30.1480, 78.6010, 30.1490) },
    hazard: 35.0,
    consequence: 58.0,
    score: 44,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "45 mm", threshold: "130 mm", status: "NORMAL" },
      { label: "Exposure Impact", value: "High pedestrian and pilgrim density near town gateway", threshold: "Moderate", status: "ELEVATED" },
      { label: "Cut-Slope", value: "31° slope with masonry retaining wall", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Station traffic marshal at town entry bifurcation." },
      { audience: "PWD_BRO", text: "Monitor drainage water discharge into Alaknanda basin." },
      { audience: "DISTRICT_MAGISTRATE", text: "Devprayag DEOC sub-station operational." },
      { audience: "PUBLIC", text: "Town approach open. Watch for pedestrian pilgrim movements." }
    ]
  },

  // SECTION 4: Devprayag to Maletha (Km 54.0 to 75.0)
  {
    id: "nh7-km55.0",
    name: "Devprayag Outskirts Rock Cut",
    chainage_start: 55.0,
    chainage_end: 55.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6080, 30.1530, 78.6160, 30.1580) },
    hazard: 42.0,
    consequence: 55.0,
    score: 48,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "50 mm", threshold: "125 mm", status: "NORMAL" },
      { label: "Cut-Slope Angle", value: "37° steep blasted rock", threshold: "35°", status: "ELEVATED" },
      { label: "Lithology", value: "Blocky quartzitic sandstone", threshold: "Sheared Phyllite", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Patrol unit check for loose surface spalls." },
      { audience: "PWD_BRO", text: "Inspect toe protection gabions." },
      { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch." },
      { audience: "PUBLIC", text: "Drive cautiously around blind river curves." }
    ]
  },
  {
    id: "nh7-km58.0",
    name: "Sirobagarh Chronic Failure Chute",
    chainage_start: 58.0,
    chainage_end: 58.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6250, 30.1650, 78.6340, 30.1710) },
    hazard: 94.0,
    consequence: 86.0,
    score: 90,
    tier: "VERY_HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "145 mm (exceeds 120 mm threshold by 21%)", threshold: "120 mm", status: "CRITICAL" },
      { label: "Cut-Slope Angle", value: "42° active debris scarp", threshold: "35°", status: "CRITICAL" },
      { label: "Lithology", value: "Sheared phyllite/quartzite thrust fault zone", threshold: "Sheared Fault", status: "CRITICAL" },
      { label: "Transit Vulnerability", value: "Estimated 850 vehicles/hour; no bypass within 40 km", threshold: "Lifeline", status: "CRITICAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Halt uphill heavy commercial vehicles at Checkpost B; divert passenger traffic via Route 2." },
      { audience: "PWD_BRO", text: "Dispatch inspection squad to inspect culvert drainage at Km 58.2; place loader on standby at Depot 3." },
      { audience: "DISTRICT_MAGISTRATE", text: "Issue Yellow alert SMS via SACHET / CAP for Gram Panchayat Rampur." },
      { audience: "PUBLIC", text: "ROAD CLOSED: Severe debris movement. Do not approach. Emergency shelter at Devprayag Camp 2." }
    ]
  },
  {
    id: "nh7-km60.5",
    name: "Buda Kedar Turnoff",
    chainage_start: 60.5,
    chainage_end: 61.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6410, 30.1780, 78.6490, 30.1830) },
    hazard: 55.0,
    consequence: 60.0,
    score: 57,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "65 mm", threshold: "120 mm", status: "ELEVATED" },
      { label: "Slope Angle", value: "35°", threshold: "35°", status: "ELEVATED" },
      { label: "Lithology", value: "Weathered phyllitic siltstone", threshold: "Sheared Fault", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Monitor rural road junction for mud runoff." },
      { audience: "PWD_BRO", text: "Clear silt from Km 60 culvert." },
      { audience: "DISTRICT_MAGISTRATE", text: "Advisory state active." },
      { audience: "PUBLIC", text: "Moderate caution. Watch for slick mud on highway." }
    ]
  },
  {
    id: "nh7-km63.0",
    name: "Rampur Chatti River Shelf",
    chainage_start: 63.0,
    chainage_end: 63.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6550, 30.1890, 78.6620, 30.1940) },
    hazard: 28.0,
    consequence: 48.0,
    score: 36,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "145 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "24°", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Normal traffic flow." },
      { audience: "PWD_BRO", text: "Routine highway sweep." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." },
      { audience: "PUBLIC", text: "Corridor clear." }
    ]
  },
  {
    id: "nh7-km66.0",
    name: "Kirtinagar Approach Meander",
    chainage_start: 66.0,
    chainage_end: 66.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6700, 30.2010, 78.6780, 30.2070) },
    hazard: 32.0,
    consequence: 50.0,
    score: 39,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "140 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "26° stabilized embankment", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Standard patrol." },
      { audience: "PWD_BRO", text: "Drainage grates clear." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green status." },
      { audience: "PUBLIC", text: "Road open." }
    ]
  },
  {
    id: "nh7-km68.5",
    name: "Maletha Valley Agricultural Plain",
    chainage_start: 68.5,
    chainage_end: 69.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6850, 30.2120, 78.6940, 30.2160) },
    hazard: 12.0,
    consequence: 40.0,
    score: 22,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "30 mm", threshold: "180 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "8° flat agricultural plain", threshold: "35°", status: "NORMAL" },
      { label: "Geology", value: "River gravel terraces", threshold: "Sheared Fault", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Normal traffic. Excellent visibility." },
      { audience: "PWD_BRO", text: "No immediate maintenance required." },
      { audience: "DISTRICT_MAGISTRATE", text: "Designated major emergency staging area." },
      { audience: "PUBLIC", text: "Open highway stretch." }
    ]
  },
  {
    id: "nh7-km71.0",
    name: "Maletha Bypass Junction",
    chainage_start: 71.0,
    chainage_end: 71.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7010, 30.2180, 78.7110, 30.2200) },
    hazard: 20.0,
    consequence: 55.0,
    score: 34,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "160 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "15° engineered cut", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Monitor traffic merge from Tehri route." },
      { audience: "PWD_BRO", text: "Maintain diversion signage." },
      { audience: "DISTRICT_MAGISTRATE", text: "Normal operations." },
      { audience: "PUBLIC", text: "Junction clear." }
    ]
  },

  // SECTION 5: Maletha to Srinagar Dam & City (Km 73.0 to 95.0)
  {
    id: "nh7-km73.5",
    name: "Chhantikhal Escarpment",
    chainage_start: 73.5,
    chainage_end: 74.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7180, 30.2210, 78.7260, 30.2215) },
    hazard: 62.0,
    consequence: 65.0,
    score: 63,
    tier: "HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "78 mm", threshold: "110 mm", status: "ELEVATED" },
      { label: "Cut-Slope Angle", value: "39° steep jointed bedrock", threshold: "35°", status: "CRITICAL" },
      { label: "Lithology", value: "Fractured quartzite with open water channels", threshold: "Sheared Fault", status: "ELEVATED" }
    ],
    actions: [
      { audience: "POLICE", text: "Convoy movement for passenger transport buses." },
      { audience: "PWD_BRO", text: "Deploy earthmover standby at Chhantikhal turn." },
      { audience: "DISTRICT_MAGISTRATE", text: "Tactical alert issued." },
      { audience: "PUBLIC", text: "High attention required. Watch for debris rolls." }
    ]
  },
  {
    id: "nh7-km76.0",
    name: "Kirtinagar Bridge Approach",
    chainage_start: 76.0,
    chainage_end: 76.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7340, 30.2205, 78.7420, 30.2195) },
    hazard: 25.0,
    consequence: 60.0,
    score: 38,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "19° river bank", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Manage urban bridge approach congestion." },
      { audience: "PWD_BRO", text: "Inspect bridge abutment drainage." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." },
      { audience: "PUBLIC", text: "Bridge clear." }
    ]
  },
  {
    id: "nh7-km78.5",
    name: "Alaknanda Hydroelectric Reservoir Perimeter",
    chainage_start: 78.5,
    chainage_end: 79.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7490, 30.2190, 78.7560, 30.2200) },
    hazard: 70.0,
    consequence: 82.0,
    score: 75,
    tier: "HIGH",
    drivers: [
      { label: "48h Cumulative Rain", value: "85 mm", threshold: "105 mm", status: "CRITICAL" },
      { label: "Reservoir Backwater", value: "Active toe erosion from elevated reservoir level", threshold: "Critical", status: "CRITICAL" },
      { label: "Slope Angle", value: "38° cut-slope into lake rim", threshold: "35°", status: "ELEVATED" }
    ],
    actions: [
      { audience: "POLICE", text: "Strict 25 km/h speed limit. No overtaking on reservoir rim road." },
      { audience: "PWD_BRO", text: "Coordinate with Dam Authority regarding sluice gate backwash waves." },
      { audience: "DISTRICT_MAGISTRATE", text: "Tactical Warning: Joint BRO-Dam safety audit team deployed." },
      { audience: "PUBLIC", text: "Extreme caution: Wet roadway with reservoir surge advisory." }
    ]
  },
  {
    id: "nh7-km81.0",
    name: "Srinagar Medical College Ridge",
    chainage_start: 81.0,
    chainage_end: 81.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7620, 30.2220, 78.7690, 30.2240) },
    hazard: 34.0,
    consequence: 80.0,
    score: 52,
    tier: "MODERATE",
    drivers: [
      { label: "48h Cumulative Rain", value: "45 mm", threshold: "135 mm", status: "NORMAL" },
      { label: "Critical Infrastructure", value: "Direct ambulance emergency access route to Base Hospital", threshold: "Critical", status: "CRITICAL" },
      { label: "Slope Stability", value: "Concrete retaining wall with weep holes", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Ensure zero-tolerance priority corridor for emergency medical transport." },
      { audience: "PWD_BRO", text: "Pre-position rapid clearing squad to prevent any debris delay." },
      { audience: "DISTRICT_MAGISTRATE", text: "Hospital evacuation and trauma lifelines prioritized." },
      { audience: "PUBLIC", text: "Yield immediately to ambulances. Keep shoulder lanes completely clear." }
    ]
  },
  {
    id: "nh7-km83.5",
    name: "Srinagar Garhwal City Eastern Gate",
    chainage_start: 83.5,
    chainage_end: 84.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7750, 30.2245, 78.7830, 30.2235) },
    hazard: 15.0,
    consequence: 55.0,
    score: 30,
    tier: "LOW",
    drivers: [
      { label: "48h Cumulative Rain", value: "35 mm", threshold: "160 mm", status: "NORMAL" },
      { label: "Slope Gradient", value: "10° broad valley floor", threshold: "35°", status: "NORMAL" }
    ],
    actions: [
      { audience: "POLICE", text: "Standard city traffic management." },
      { audience: "PWD_BRO", text: "Routine municipal drainage check." },
      { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory. City shelters on standby." },
      { audience: "PUBLIC", text: "Corridor terminus reached. Safe urban transit conditions." }
    ]
  },
  // Additional filler segments to reach 35 comprehensive blocks
  {
    id: "nh7-km16.0",
    name: "Shivpuri Outer Curves",
    chainage_start: 16.0,
    chainage_end: 16.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3330, 30.1180, 78.3390, 30.1210) },
    hazard: 19.0, consequence: 40.0, score: 27, tier: "LOW",
    drivers: [{ label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Normal flow." }, { audience: "PWD_BRO", text: "Routine sweep." }, { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km18.2",
    name: "Brahmpuri Camp Bypass",
    chainage_start: 18.0,
    chainage_end: 18.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3540, 30.1300, 78.3620, 30.1320) },
    hazard: 21.0, consequence: 42.0, score: 29, tier: "LOW",
    drivers: [{ label: "48h Cumulative Rain", value: "35 mm", threshold: "150 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Normal flow." }, { audience: "PWD_BRO", text: "Routine sweep." }, { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km20.8",
    name: "Marine Drive Rafting Point",
    chainage_start: 20.5,
    chainage_end: 21.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.3870, 30.1380, 78.3940, 30.1360) },
    hazard: 32.0, consequence: 46.0, score: 38, tier: "LOW",
    drivers: [{ label: "48h Cumulative Rain", value: "40 mm", threshold: "135 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Regulate bus parking." }, { audience: "PWD_BRO", text: "Routine sweep." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Green." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km23.2",
    name: "Gular Khad Culvert",
    chainage_start: 23.0,
    chainage_end: 23.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4110, 30.1250, 78.4160, 30.1200) },
    hazard: 46.0, consequence: 50.0, score: 48, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "50 mm", threshold: "120 mm", status: "ELEVATED" }],
    actions: [{ audience: "POLICE", text: "Maintain spacing." }, { audience: "PWD_BRO", text: "Inspect culvert." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch." }, { audience: "PUBLIC", text: "Caution advised." }]
  },
  {
    id: "nh7-km26.5",
    name: "Byasi Market Narrows",
    chainage_start: 26.5,
    chainage_end: 27.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4320, 30.1010, 78.4380, 30.0930) },
    hazard: 35.0, consequence: 58.0, score: 44, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "45 mm", threshold: "130 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Control lane merging." }, { audience: "PWD_BRO", text: "Drainage patrol." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory state." }, { audience: "PUBLIC", text: "Slow through market." }]
  },
  {
    id: "nh7-km29.2",
    name: "Byasi Slide Zone Beta",
    chainage_start: 29.0,
    chainage_end: 29.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4560, 30.0780, 78.4650, 30.0750) },
    hazard: 74.0, consequence: 66.0, score: 71, tier: "HIGH",
    drivers: [{ label: "48h Cumulative Rain", value: "95 mm", threshold: "110 mm", status: "CRITICAL" }],
    actions: [{ audience: "POLICE", text: "Convoy protocol." }, { audience: "PWD_BRO", text: "Loader standby." }, { audience: "DISTRICT_MAGISTRATE", text: "Tactical alert." }, { audience: "PUBLIC", text: "Pass quickly." }]
  },
  {
    id: "nh7-km31.8",
    name: "Kaudiyala East Bluff",
    chainage_start: 31.5,
    chainage_end: 32.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.4860, 30.0740, 78.4920, 30.0760) },
    hazard: 38.0, consequence: 48.0, score: 42, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "45 mm", threshold: "125 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Normal patrol." }, { audience: "PWD_BRO", text: "Monitor wire netting." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km34.5",
    name: "Singtoli Bend North",
    chainage_start: 34.5,
    chainage_end: 35.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5060, 30.0880, 78.5100, 30.0910) },
    hazard: 48.0, consequence: 52.0, score: 50, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "55 mm", threshold: "120 mm", status: "ELEVATED" }],
    actions: [{ audience: "POLICE", text: "Caution advisory." }, { audience: "PWD_BRO", text: "Inspect catch fence." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch." }, { audience: "PUBLIC", text: "Drive with caution." }]
  },
  {
    id: "nh7-km37.0",
    name: "Mahadev Chatti Approach",
    chainage_start: 37.0,
    chainage_end: 37.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5220, 30.1020, 78.5260, 30.1060) },
    hazard: 42.0, consequence: 48.0, score: 45, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "48 mm", threshold: "125 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Standard monitoring." }, { audience: "PWD_BRO", text: "Check drains." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Green." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km39.8",
    name: "Teen Dhara North Chute",
    chainage_start: 39.5,
    chainage_end: 40.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5380, 30.1170, 78.5420, 30.1200) },
    hazard: 64.0, consequence: 68.0, score: 66, tier: "HIGH",
    drivers: [{ label: "48h Cumulative Rain", value: "82 mm", threshold: "110 mm", status: "ELEVATED" }],
    actions: [{ audience: "POLICE", text: "Convoy movement." }, { audience: "PWD_BRO", text: "Clear rock spalls." }, { audience: "DISTRICT_MAGISTRATE", text: "Yellow alert." }, { audience: "PUBLIC", text: "Pass without stopping." }]
  },
  {
    id: "nh7-km43.0",
    name: "Totam Gorge Center",
    chainage_start: 43.0,
    chainage_end: 43.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5540, 30.1310, 78.5570, 30.1330) },
    hazard: 82.0, consequence: 75.0, score: 79, tier: "HIGH",
    drivers: [{ label: "48h Cumulative Rain", value: "105 mm", threshold: "105 mm", status: "CRITICAL" }],
    actions: [{ audience: "POLICE", text: "Halt heavy trucks." }, { audience: "PWD_BRO", text: "Spotter on scarp." }, { audience: "DISTRICT_MAGISTRATE", text: "Pre-closure warning." }, { audience: "PUBLIC", text: "Severe hazard." }]
  },
  {
    id: "nh7-km48.0",
    name: "Bagwan River Shelf",
    chainage_start: 48.0,
    chainage_end: 48.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5805, 30.1445, 78.5825, 30.1455) },
    hazard: 24.0, consequence: 42.0, score: 31, tier: "LOW",
    drivers: [{ label: "48h Cumulative Rain", value: "35 mm", threshold: "145 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Normal flow." }, { audience: "PWD_BRO", text: "Routine patrol." }, { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." }, { audience: "PUBLIC", text: "Safe corridor." }]
  },
  {
    id: "nh7-km50.8",
    name: "Devprayag South Escarpment",
    chainage_start: 50.5,
    chainage_end: 51.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.5910, 30.1470, 78.5935, 30.1478) },
    hazard: 38.0, consequence: 52.0, score: 44, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "45 mm", threshold: "130 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Patrol speed limit." }, { audience: "PWD_BRO", text: "Inspect toe wall." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory state." }, { audience: "PUBLIC", text: "Open road." }]
  },
  {
    id: "nh7-km56.5",
    name: "Rampur Chatti South Chute",
    chainage_start: 56.5,
    chainage_end: 57.0,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6180, 30.1600, 78.6230, 30.1635) },
    hazard: 78.0, consequence: 70.0, score: 75, tier: "HIGH",
    drivers: [{ label: "48h Cumulative Rain", value: "110 mm", threshold: "115 mm", status: "CRITICAL" }],
    actions: [{ audience: "POLICE", text: "Hold uphill heavy traffic." }, { audience: "PWD_BRO", text: "Loader on standby at Depot 3." }, { audience: "DISTRICT_MAGISTRATE", text: "Yellow alert." }, { audience: "PUBLIC", text: "High hazard. No stopping." }]
  },
  {
    id: "nh7-km62.0",
    name: "Buda Kedar Stream Crossing",
    chainage_start: 62.0,
    chainage_end: 62.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6510, 30.1850, 78.6540, 30.1875) },
    hazard: 44.0, consequence: 50.0, score: 47, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "50 mm", threshold: "125 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Monitor causeway water level." }, { audience: "PWD_BRO", text: "Check culvert intake." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory Watch." }, { audience: "PUBLIC", text: "Cross carefully." }]
  },
  {
    id: "nh7-km70.0",
    name: "Maletha Plains North",
    chainage_start: 70.0,
    chainage_end: 70.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.6960, 30.2170, 78.7000, 30.2178) },
    hazard: 14.0, consequence: 45.0, score: 26, tier: "LOW",
    drivers: [{ label: "48h Cumulative Rain", value: "30 mm", threshold: "175 mm", status: "NORMAL" }],
    actions: [{ audience: "POLICE", text: "Normal patrol." }, { audience: "PWD_BRO", text: "Routine sweep." }, { audience: "DISTRICT_MAGISTRATE", text: "Green Advisory." }, { audience: "PUBLIC", text: "Open highway." }]
  },
  {
    id: "nh7-km75.0",
    name: "Chhantikhal North Descent",
    chainage_start: 75.0,
    chainage_end: 75.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7280, 30.2210, 78.7325, 30.2208) },
    hazard: 56.0, consequence: 62.0, score: 59, tier: "MODERATE",
    drivers: [{ label: "48h Cumulative Rain", value: "68 mm", threshold: "115 mm", status: "ELEVATED" }],
    actions: [{ audience: "POLICE", text: "Speed restriction." }, { audience: "PWD_BRO", text: "Clear rock debris." }, { audience: "DISTRICT_MAGISTRATE", text: "Advisory state." }, { audience: "PUBLIC", text: "Caution advised." }]
  },
  {
    id: "nh7-km80.0",
    name: "Alaknanda Rim North",
    chainage_start: 80.0,
    chainage_end: 80.5,
    geometry: { type: "LineString", coordinates: createCoordSegment(78.7580, 30.2210, 78.7610, 30.2218) },
    hazard: 65.0, consequence: 76.0, score: 70, tier: "HIGH",
    drivers: [{ label: "48h Cumulative Rain", value: "80 mm", threshold: "110 mm", status: "CRITICAL" }],
    actions: [{ audience: "POLICE", text: "Single lane convoy." }, { audience: "PWD_BRO", text: "Check water level." }, { audience: "DISTRICT_MAGISTRATE", text: "Tactical alert." }, { audience: "PUBLIC", text: "High hazard." }]
  }
];
