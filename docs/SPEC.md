# LRSS Hackathon Specification: NH-7 Decision Support System

> **Document:** `docs/SPEC.md`  
> **Status:** Draft for Approval  
> **Target Scope:** 12–24h Hackathon MVP  
> **Target Corridor:** NH-7 Rishikesh – Devprayag – Srinagar (~100 km)

---

## 1. Objective & User Persona

- **Objective:** Deliver a dynamic, browser-based emergency command dashboard demonstrating real-time landslide risk triage along a high-stakes mountain highway corridor. The demo translates hydrometeorological triggers and terrain fragility into localized operational risk scores and actionable inter-agency mobilization orders.
- **Primary Persona:** **DEOC / DDMA Incident Commander** (District Disaster Management Authority), coordinating operations with Highway Police and PWD / Border Roads Organisation (BRO).
- **Secondary Persona:** **Citizen / Transiting Commuter** accessing a bandwidth-optimized public advisory feed.

---

## 2. Technology Stack & Commands

- **Framework:** React 18+ with TypeScript (Vite bundler)
- **Styling:** Tailwind CSS (Tactical Dark Command Center palette: `#0B0F19`, slate accents, neon telemetry alerts)
- **Mapping:** Leaflet & React-Leaflet with custom GeoJSON chainage segment choropleth layers
- **Icons:** Lucide React
- **Scoring Engine:** Embedded in-memory TypeScript module (instant client-side execution, zero backend latency)
- **Standard Commands:**
  - `npm install` (Install dependencies)
  - `npm run dev` (Launch local dev server at `localhost:5173`)
  - `npm run build` (Production build verification)

---

## 3. Corridor Data Model (NH-7 Sample Dataset)

The corridor is represented by **35 discrete road segments** (250m–500m chainage blocks) spanning Km 15.0 (Rishikesh outskirts) to Km 95.0 (approaching Srinagar).

> [!NOTE]
> All corridor baseline values are pre-modeled **sample data** calibrated to realistic geological literature for the Garhwal Himalayas (Alaknanda river basin).

### Segment Data Schema:
```typescript
interface RoadSegment {
  id: string;                      // e.g., "seg-km-58.2"
  chainage: string;                // e.g., "NH-7 Km 58.0 - 58.5"
  name: string;                    // e.g., "Sirobagarh Chronic Zone"
  coordinates: [number, number][]; // Polyline lat/lng coordinates
  
  // Baseline Hazard Factors (Static Sample Data)
  slopeAngleDeg: number;           // e.g., 41° cut-slope
  lithology: string;               // e.g., "Sheared phyllite / fractured quartzite"
  susceptibilityScore: number;     // S in [0, 100] (GSI NLSM proxy)
  historicalEventsCount: number;   // e.g., 3 catastrophic failures in 5 yrs (H_hist)
  rainfallThresholdMm: number;     // e.g., 120 mm / 48h critical tipping threshold
  
  // Consequence & Exposure Factors (Static Sample Data)
  exposurePop: number;             // E_pop: Pilgrims/dwellings in direct runout
  transitTrafficVph: number;       // E_infra: Vehicles per hour (e.g., 850 vph)
  isolationVulnerability: number;  // V_isolation: 0.0 - 1.0 (detour distance / dead-end factor)
  mitigationOffset: number;        // delta_prep: 0.0 - 0.5 (breast walls, wire netting present)
  
  // Computed Dynamic Outputs
  dynamicHazardScore: number;      // H in [0, 100]
  consequenceScore: number;        // C in [0, 100]
  operationalRiskScore: number;    // Final score in [0, 100]
  riskTier: "VERY_LOW" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
}
```

---

## 4. Mathematical Scoring Engine & Dynamic Triggers

### 1. Dynamic Hazard Formula:
$$H = \min\left(100, (0.65 \cdot S + 0.35 \cdot H_{hist}) \times \Phi(T)\right)$$
- **$\Phi(T)$ (Trigger Multiplier):**
  $$\Phi(T) = \max\left(0.5, \frac{\text{Current 48h Rainfall (mm)}}{\text{Segment Threshold (mm)}}\right)$$
  When rainfall exceeds the tipping threshold, $\Phi(T) > 1.0$, rapidly escalating the hazard score.

### 2. Consequence Impact Formula:
$$C = \min\left(100, (0.35 \cdot E_{pop} + 0.40 \cdot E_{infra} + 0.25 \cdot V_{isolation}) \times (1 - \delta_{prep})\right)$$
*(Normalized components ensure strategic highways without direct population still score high consequence).*

### 3. Asymmetric $5 \times 5$ Risk Matrix Projection:
Calculated as $\text{Score} = \text{round}(0.55 \cdot H + 0.45 \cdot C)$, mapped to 5 tiers:
- **0–20 (Very Low - Emerald `#10B981`):** Routine monitoring conditions.
- **21–40 (Low - Cyan `#06B6D4`):** Advisory state; standard culvert patrol.
- **41–60 (Moderate - Amber `#F59E0B`):** Pre-activation; inspect chronic trouble spots.
- **61–80 (High - Orange `#F97316`):** Tactical alert; pre-position machinery, convoy traffic.
- **81–100 (Very High - Crimson `#EF4444`):** Emergency action; immediate road closure, localized evacuation.

---

## 5. Core Application Features

### 5.1 Interactive Risk Map & Segment Choropleth
- High-contrast dark basemap showing the NH-7 ribbon from Rishikesh to Srinagar.
- All 35 segments drawn as interactive polylines color-coded by their real-time Risk Tier.
- Hover tooltips showing chainage Km and current risk tier.
- Clicking any segment opens the **"Explain Why"** drawer and highlights its SOP cards.
- Quick Filter button: **"Top 5 Critical Hotspots Right Now"**.

### 5.2 Live Rainfall & Scenario Controller
- **Interactive Rainfall Slider:** Dynamic 48h cumulative rainfall slider (0 mm to 250 mm) that recalculates scores for all 35 segments live on drag.
- **1-Click Judge Presets:**
  - *Preset 1: Pre-Monsoon Dry (20 mm)* — All segments Green/Low.
  - *Preset 2: Sustained Regional Monsoon (85 mm)* — Moderate alerts along Byasi & Totam.
  - *Preset 3: Localized Cloudburst at Sirobagarh (165 mm)* — Triggers Deep Crimson emergency state on Km 58.2.

### 5.3 Transparent "Explain Why" Drawer (Eliminates Black Box)
Clicking a segment slides open an inspector displaying:
- **Trigger Analysis:** Current rainfall vs. tipping threshold with percentage overage.
- **Geological Vulnerability:** Cut-slope angle, lithological shearing, historical recurrence scars.
- **Consequence Profile:** Transit traffic volume, detour penalty (km to nearest alternate route), runout hazard.
- **Mathematical Score Breakdown:** Visual gauges for $H$, $C$, and final Operational Risk Score.

### 5.4 Prescriptive SOP Priority Action Cards
Direct operational translation categorized by executing agency:
1. **Traffic Police:** Tactical checkpoint control (e.g., *"Halt uphill heavy commercial vehicles at Checkpost B; divert light passenger vehicles via Tehri bypass"*).
2. **PWD / BRO:** Field machinery mobilization (e.g., *"Deploy front-end loader on standby at Depot 3; clear drainage culverts at Km 58.2"*).
3. **District Magistrate / DDMA:** Public safety warning (e.g., *"Issue SACHET CAP Yellow Alert SMS to Gram Panchayat Sirobagarh"*).
- Includes an interactive **"Dispatch Simulated Order"** button with timestamped audit log feedback.

### 5.5 Mobile Citizen / Commuter Advisory View
- A dedicated header toggle switching to a lightweight, simulated mobile screen (390px view).
- Shows real-time public travel safety:
  - Corridor Status: *Open / Restricted Convoy / Closed*
  - Recommended Transit Windows (e.g., *"Safe transit window between 06:00 and 11:00"*).
  - Nearest certified emergency shelters with contact numbers along NH-7.

---

## 6. Project Boundaries & Scope Control

### Strictly IN Scope:
- Single NH-7 corridor (Rishikesh to Srinagar) with 35 realistic sample segments.
- Real-time client-side scoring engine with live slider recalculation.
- Tactical Dark UI with interactive map, drawer, SOP cards, and citizen view.
- 1-Click demo presets for effortless judge presentation.

### Strictly OUT of Scope (Non-Goals):
- **No live external APIs:** No real-time IMD / GPM satellite API keys (avoids API rate limits or network failures during demo).
- **No physical IoT hardware:** No borehole inclinometer or piezometer sensor streams.
- **No physical sirens:** No automated hardware acoustic triggers.
- **No authentication / RBAC:** No login screens, user roles, or database permissions.
- **No multi-corridor selection:** Hard-focused on NH-7 to maximize demo depth and polish.

---

## 7. Success & Acceptance Criteria

1. **Reactivity:** Dragging the rainfall slider immediately updates the map colors, stats counter, and open drawer gauges without frame lag (< 16ms render loop).
2. **Explainability:** Clicking any segment shows clear plain-English drivers explaining why it is in its current tier.
3. **Operational Bridge:** Every critical segment generates tailored, role-specific action cards for Police, BRO, and DM.
4. **Judge Narrative Flow:** A presenter can execute the complete demo story (Dry $\to$ Cloudburst $\to$ Explain Why $\to$ SOP Dispatch $\to$ Citizen Advisory) in under 3 minutes without touching code.
