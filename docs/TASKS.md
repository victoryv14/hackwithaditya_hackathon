# LRSS Task Breakdown & Implementation Roadmap

> **Specification Source:** `docs/SPEC.md`  
> **Design Source:** `design.md` & `design-tokens.json`  
> **Status:** Approved for Implementation  
> **Sprint Estimate:** 10 discrete tasks (each under 1 hour)

---

## Dependency Graph

```
Task 1: Project Setup & Scaffolding
    │
    ▼
Task 2: Data Contracts & TypeScript Types
    │
    ├───► Task 3: NH-7 Corridor Sample Data (35 segments)
    │         │
    │         ▼
    └───► Task 4: Mathematical Scoring Engine
              │
              ▼
          Task 5: Interactive Map Screen (Leaflet & Choropleth)
              │
              ├───► Task 6: Rainfall Slider & Scenario Presets
              │         │
              ▼         ▼
          Task 7: Transparent "Explain Why" Drawer
              │
              ▼
          Task 8: Prescriptive SOP Action Cards (Police/BRO/DM)
              │
              ▼
          Task 9: Mobile Citizen Advisory View
              │
              ▼
          Task 10: Production Build & Demo Readiness
```

---

## Detailed Task Catalog

### Task 1: Project Setup & Baseline Scaffolding
- **Description:** Initialize the React 18 + TypeScript + Vite project structure, configure Tailwind CSS with custom tokens from `design.md`, install dependencies (`leaflet`, `react-leaflet`, `lucide-react`, `@types/leaflet`), and set up the base HTML with dark theme styling.
- **Estimated Scope:** Small (~30 mins)
- **Dependencies:** None
- **Files Touched:**
  - `package.json`
  - `vite.config.ts`
  - `tailwind.config.js`
  - `src/index.css`
  - `src/App.tsx`
- **Acceptance Criteria:**
  - [ ] Vite dev server runs clean without warnings.
  - [ ] Tailwind processes design tokens (e.g. `bg-app`, `bg-card`, `tier-very-high`).
  - [ ] Leaflet CSS and Lucide icons import without errors.
- **Done Check (Verification):** Run `npm run build` and `npm run dev` to confirm clean startup.

---

### Task 2: Data Contracts & Interface Design
- **Description:** Define strict TypeScript interfaces for `RoadSegment`, `HazardFactors`, `ConsequenceFactors`, `RiskTier`, `ScoringWeights`, `ExplainWhyDrivers`, `SOPActionCard`, and `ScenarioPreset`.
- **Estimated Scope:** Small (~25 mins)
- **Dependencies:** Task 1
- **Files Touched:**
  - `src/types/corridor.ts`
  - `src/types/scoring.ts`
  - `src/types/sop.ts`
- **Acceptance Criteria:**
  - [ ] Full type coverage for all 35 segments, scoring components, and agency action cards.
  - [ ] Strong enum for 5 tiers (`VERY_LOW`, `LOW`, `MODERATE`, `HIGH`, `VERY_HIGH`).
  - [ ] Zero TypeScript `any` types.
- **Done Check (Verification):** Run `npx tsc --noEmit` with zero type errors.

---

### Task 3: NH-7 Corridor Sample Dataset (35 Segments)
- **Description:** Construct the realistic sample dataset in `src/data/nh7CorridorData.ts` featuring 35 chainage blocks (250m–500m) spanning Rishikesh (Km 15.0) to Srinagar (Km 95.0), explicitly including chronic trouble zones (Byasi, Totam, Sirobagarh). Each segment contains realistic coordinates, slope angles, sheared lithology, historical scars, tipping thresholds, traffic volume, and isolation penalties.
- **Estimated Scope:** Medium (~45 mins)
- **Dependencies:** Task 2
- **Files Touched:**
  - `src/data/nh7CorridorData.ts`
- **Acceptance Criteria:**
  - [ ] Exactly 35 continuous chainage segments along the Alaknanda/Ganga river gorge.
  - [ ] Distinct tipping thresholds (e.g., Sirobagarh at 120 mm / 48h, stable segments at > 180 mm).
  - [ ] All data explicitly tagged with `isSampleData: true`.
- **Done Check (Verification):** Validate data structure via unit test verifying array length, coordinate formats, and valid numerical bounds.

---

### Task 4: Mathematical Scoring Engine
- **Description:** Implement `src/utils/scoringEngine.ts` following PRD formulas:
  - $H = \min\left(100, (0.65 \cdot S + 0.35 \cdot H_{hist}) \times \Phi(T)\right)$
  - $C = \min\left(100, (0.35 \cdot E_{pop} + 0.40 \cdot E_{infra} + 0.25 \cdot V_{isolation}) \times (1 - \delta_{prep})\right)$
  - Asymmetric composite score $\text{Score} = \text{round}(0.55 \cdot H + 0.45 \cdot C)$ mapped to the 5 tiers.
- **Estimated Scope:** Medium (~45 mins)
- **Dependencies:** Task 2, Task 3
- **Files Touched:**
  - `src/utils/scoringEngine.ts`
  - `src/utils/scoringEngine.test.ts`
- **Acceptance Criteria:**
  - [ ] Accurately outputs $H$, $C$, final score (0–100), and tier for any rainfall value.
  - [ ] Tipping points trigger properly when rainfall exceeds segment threshold.
  - [ ] Uninhabited strategic corridors maintain high consequence (no zero-factor suppression).
- **Done Check (Verification):** Run focused unit tests verifying scores across dry (20 mm) and cloudburst (165 mm) conditions.

---

### Task 5: Interactive Map Screen & Risk Choropleth
- **Description:** Implement `src/components/CorridorMap.tsx` with Leaflet. Render the NH-7 highway polyline divided into 35 interactive chainage blocks color-coded according to the color-blind-safe palette (Sky, Teal, Amber, Orange, Rose). Implement hover tooltips, click selection, and smooth pan-to-segment.
- **Estimated Scope:** Medium (~50 mins)
- **Dependencies:** Task 3, Task 4
- **Files Touched:**
  - `src/components/CorridorMap.tsx`
  - `src/components/MapLegend.tsx`
- **Acceptance Criteria:**
  - [ ] All 35 road segments render as distinct clickable polyline segments.
  - [ ] Segment colors immediately reflect current calculated risk tiers.
  - [ ] Custom dark map tiles (CartoDB Dark Matter / Stadia Alidade Smooth Dark) match `#0B0F19` aesthetic.
- **Done Check (Verification):** Visual confirmation that segments render correctly along the river valley with distinct tier colors.

---

### Task 6: Dynamic Rainfall Slider & Scenario Presets
- **Description:** Build `src/components/RainfallController.tsx` with an interactive 48h rainfall slider (0–250 mm) that recalculates all 35 segments in real time (< 16ms loop) and 1-click scenario presets:
  - *Dry Season (20 mm)*
  - *Monsoon Surge (85 mm)*
  - *Km 58.2 Cloudburst (165 mm)*
  Include a "Top 5 Critical Hotspots" quick-filter button.
- **Estimated Scope:** Medium (~40 mins)
- **Dependencies:** Task 4, Task 5
- **Files Touched:**
  - `src/components/RainfallController.tsx`
  - `src/components/TopHotspotsFilter.tsx`
- **Acceptance Criteria:**
  - [ ] Dragging the slider dynamically updates map polyline colors with zero stutter.
  - [ ] Clicking a preset snaps slider and triggers the expected operational state.
  - [ ] Top 5 Hotspots list dynamically ranks segments from highest to lowest score.
- **Done Check (Verification):** Drag slider from 20 mm to 165 mm and verify that hotspot counters and map colors update synchronously.

---

### Task 7: Transparent "Explain Why" Drawer
- **Description:** Create `src/components/ExplainWhyDrawer.tsx`, a 420px slide-out right drawer that opens upon clicking any segment. Breaks down:
  1. Trigger Overage: Current rainfall vs threshold with % delta.
  2. Geological Fragility: Slope angle, lithological shearing, historical slide counts.
  3. Consequence Impact: Traffic volume, detour delay (km), isolation penalty.
  4. Visual meters for $H$, $C$, and Composite Risk Score.
- **Estimated Scope:** Medium (~45 mins)
- **Dependencies:** Task 2, Task 5
- **Files Touched:**
  - `src/components/ExplainWhyDrawer.tsx`
  - `src/components/ScoreGauge.tsx`
- **Acceptance Criteria:**
  - [ ] Smooth slide transition without layout shift.
  - [ ] Plain-English explanations generated dynamically based on segment metrics.
  - [ ] Visual progress bars for Hazard ($H$) and Consequence ($C$).
- **Done Check (Verification):** Click segment Km 58.2; drawer displays 145 mm / 120 mm (+21% breach), 41° cut slope, and score breakdown.

---

### Task 8: Prescriptive Priority Action Cards (Police / BRO / DM)
- **Description:** Build `src/components/ActionCardsPanel.tsx` presenting role-specific Standard Operating Procedure (SOP) instructions for:
  - **Traffic Police:** Checkpoint diversions, uphill traffic hold.
  - **PWD / BRO:** Excavator standby at depots, culvert clearance.
  - **District Magistrate (DDMA):** Yellow/Red SACHET alert SMS to local panchayats.
  Include an interactive "Dispatch Simulated Order" button with a real-time timestamped audit log.
- **Estimated Scope:** Medium (~40 mins)
- **Dependencies:** Task 2, Task 7
- **Files Touched:**
  - `src/components/ActionCardsPanel.tsx`
  - `src/components/DispatchAuditLog.tsx`
- **Acceptance Criteria:**
  - [ ] Cards update dynamically based on the selected segment and its risk tier.
  - [ ] Clicking "Dispatch Order" updates the card state to "DISPATCHED" with current timestamp.
  - [ ] Dispatched orders appear in a live audit feed.
- **Done Check (Verification):** Dispatch an action for Police and verify state toggle and audit entry.

---

### Task 9: Lightweight Mobile Citizen / Commuter Advisory View
- **Description:** Implement `src/components/CitizenMobileView.tsx`, a togglable 390px mobile modal simulating what commuters and pilgrims see on their phones:
  - Corridor Status banner (Open / Restricted / Closed).
  - Recommended Safe Transit Windows.
  - Emergency Relief Shelters directory with click-to-call dummy links.
- **Estimated Scope:** Small (~35 mins)
- **Dependencies:** Task 2, Task 6
- **Files Touched:**
  - `src/components/CitizenMobileView.tsx`
  - `src/components/Header.tsx`
- **Acceptance Criteria:**
  - [ ] Clean header toggle between "EOC Command Center" and "Citizen View".
  - [ ] Mobile view renders in a simulated mobile device frame.
  - [ ] Corridor status reflects the highest active risk tier on NH-7.
- **Done Check (Verification):** Toggle to Citizen View; verify shelter list and status banner reflect current rainfall scenario.

---

### Task 10: Production Build & Demo Readiness
- **Description:** Perform strict end-to-end audit: verify production Vite build (`npm run build`), ensure zero TypeScript or ESLint errors, verify WCAG contrast compliance, add fallback offline tiles/data, and write a concise 3-minute judge walkthrough guide into `README.md`.
- **Estimated Scope:** Small (~30 mins)
- **Dependencies:** Tasks 1–9
- **Files Touched:**
  - `README.md`
  - `dist/`
- **Acceptance Criteria:**
  - [ ] `npm run build` succeeds cleanly with zero bundle errors.
  - [ ] Zero runtime console warnings or errors.
  - [ ] Complete 3-minute demo script documented in `README.md`.
- **Done Check (Verification):** Run `npm run preview` to test the production build locally.

---

## Mid-Sprint Checkpoints

### Checkpoint A: Data & Math Core (After Tasks 1–4)
- [ ] Project scaffolds and builds.
- [ ] 35 NH-7 segments loaded.
- [ ] Scoring formulas tested and verified.

### Checkpoint B: Interactive Geospatial Cockpit (After Tasks 5–7)
- [ ] Map renders 35 segments in tactical dark mode.
- [ ] Rainfall slider dynamically updates map colors live.
- [ ] "Explain Why" drawer opens with transparent scientific drivers.

### Checkpoint C: Actionable Operations & Demo Polish (After Tasks 8–10)
- [ ] Multi-agency SOP dispatching works with audit logs.
- [ ] Mobile citizen view toggles cleanly.
- [ ] Production build succeeds and demo walkthrough script is verified.
