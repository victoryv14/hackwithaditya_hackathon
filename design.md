---
version: anydesign-1
name: LRSS Tactical Mission Control
source: Landslide_Risk_Scaling_System_Specification.pdf
captured_at: 2026-11-21
description: |
  High-contrast tactical emergency command-center system designed for District Emergency Operation Centres (DEOCs). Deep charcoal/slate surfaces host high-luminance, color-blind-safe risk telemetry, interactive GIS corridor overlays, and instant SOP dispatch cards.
colors:
  bg-app: "#0B0F19"
  bg-card: "#111827"
  bg-card-elevated: "#1F2937"
  border-subtle: "#1F2937"
  border-strong: "#374151"
  text-primary: "#F9FAFB"
  text-muted: "#9CA3AF"
  accent-sky: "#0284C7"
  tier-very-low: "#38BDF8"
  tier-low: "#2DD4BF"
  tier-moderate: "#FBBF24"
  tier-high: "#FB923C"
  tier-very-high: "#F43F5E"
typography:
  display: { fontFamily: "Inter, sans-serif", fontSize: 24px, fontWeight: 700, letterSpacing: -0.02em }
  heading: { fontFamily: "Inter, sans-serif", fontSize: 18px, fontWeight: 600 }
  body: { fontFamily: "Inter, sans-serif", fontSize: 14px, fontWeight: 400, lineHeight: 1.5 }
  telemetry-mono: { fontFamily: "JetBrains Mono, monospace", fontSize: 13px, fontWeight: 500 }
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 20, 24, 32, 48]
rounded:
  sm: 4px
  md: 8px
  lg: 12px
shadows:
  card: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)"
  drawer: "-4px 0 24px rgba(0,0,0,0.7)"
components:
  card-container: { backgroundColor: "{colors.bg-card}", borderColor: "{colors.border-strong}", rounded: "{rounded.md}", padding: "16px" }
  map-viewport: { backgroundColor: "{colors.bg-app}", borderColor: "{colors.border-strong}", rounded: "{rounded.md}" }
  explain-drawer: { backgroundColor: "{colors.bg-card}", borderColor: "{colors.border-strong}", shadow: "{shadows.drawer}", padding: "20px" }
  sop-card: { backgroundColor: "{colors.bg-card-elevated}", borderColor: "{colors.border-strong}", rounded: "{rounded.md}", padding: "14px" }
  risk-badge: { rounded: "{rounded.sm}", padding: "4px 8px" }
---

# Design Analysis: LRSS Tactical Mission Control

> Analysis generated with the `anydesign` skill. Date: 2026-11-21. Emphasis: design system

## Source
PRD specifications from Landslide_Risk_Scaling_System_Specification.pdf and incident command center operational requirements for DEOC/DDMA disaster monitoring.

## TL;DR
Tactical dark-mode emergency response layout designed for cognitive clarity under crisis stress. Fuses high-contrast deep slate foundations with a color-blind-safe 5-tier risk chromatic scale, monospace chainage telemetry, and focused slide-out diagnostic drawers.

## 1. Visual identity

### 1.1 Surface description
- Personality: Authoritative, mission-critical, precise, calm under pressure. ✅
- Mood: Night-ops situational awareness command room. ✅
- Stylistic references: Defense geospatial command consoles, NASA disaster telemetry, Palantir Foundry. ⚠️
- Information density: High data density with structured modular card grouping. ✅
- Implicit positioning: Institutional public safety infrastructure software for decision-makers. ✅

### 1.2 Brand voice / Atmosphere
Operational calm and unyielding precision. In high-stakes mountain disaster triage where lives and transit arteries are on the line, the interface eliminates frivolous decoration and ambiguity. Every visual signal is calibrated to provide immediate spatial comprehension without alert fatigue.

### 1.3 The "ONE brand thing"
- The thing: Color-blind-safe luminous risk ribbons overlaid on a dark tactical topographic corridor map.
- Why it carries the brand: It instantly communicates the physical status of the highway at a glance, converting complex geological and meteorological formulas into clear operational reality.
- How the rest is restrained around it: The surrounding panels and navigation use muted slate tones `{colors.bg-card}` (#111827) and subdued borders `{colors.border-subtle}` (#1F2937) so the chromatic risk tiers command singular visual priority.
- Where it appears: On the interactive map polylines, chainage badges, and risk breakdown gauges.

## 2. Design System (tokens)

### 2.1 Colors

| Token | Hex | Role | Where it appears | Confidence |
|---|---|---|---|---|
| `bg-app` | `#0B0F19` | Application canvas | Root layout background | ✅ |
| `bg-card` | `#111827` | Surface base | Control panels, sidebar containers | ✅ |
| `bg-card-elevated` | `#1F2937` | Elevated surface | Action cards, dropdowns, hovered items | ✅ |
| `border-subtle` | `#1F2937` | Subtle divider | Section borders, container separators | ✅ |
| `border-strong` | `#374151` | Strong stroke | Card outlines, active panel boundaries | ✅ |
| `text-primary` | `#F9FAFB` | Primary text | Headers, metrics, critical labels | ✅ |
| `text-muted` | `#9CA3AF` | Secondary text | Chainage subtext, unit labels, timestamps | ✅ |
| `accent-sky` | `#0284C7` | Primary action | Interactive buttons, active filters | ✅ |
| `tier-very-low` | `#38BDF8` | Risk Tier 1 (0–20) | Sky Blue: Routine conditions | ✅ |
| `tier-low` | `#2DD4BF` | Risk Tier 2 (21–40) | Teal: Advisory state, standard patrol | ✅ |
| `tier-moderate` | `#FBBF24` | Risk Tier 3 (41–60) | Amber/Gold: Pre-activation, trouble spots | ✅ |
| `tier-high` | `#FB923C` | Risk Tier 4 (61–80) | Warm Orange: Tactical alert, machinery standby | ✅ |
| `tier-very-high` | `#F43F5E` | Risk Tier 5 (81–100) | Rose/Crimson: Emergency action, road closure | ✅ |

### 2.2 Typography

Family: Inter with JetBrains Mono for telemetry figures. ✅

| Token | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| `display` | 24px | 700 | 1.2 | Command center corridor header |
| `heading` | 18px | 600 | 1.3 | Panel titles, drawer headings |
| `body` | 14px | 400 | 1.5 | Explanatory text, SOP instructions |
| `telemetry-mono` | 13px | 500 | 1.4 | Chainage markers (Km 58.2), rainfall (mm), scores |

### 2.3 Spacing
Base unit of 4px. Observed standard multiples: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px. Layout gaps maintain strict 16px consistency across grid containers. ✅

### 2.4 Radii
- `sm`: 4px for badges, tag chips, and monospace data pills.
- `md`: 8px for standard cards, buttons, map container, and action blocks.
- `lg`: 12px for modal panels and floating drawer headers.

### 2.5 Elevation system
- Flat base with high-contrast 1px border outlines `{colors.border-strong}` (#374151).
- Slide-out "Explain Why" drawer uses heavy lateral shadow `{shadows.drawer}` (`-4px 0 24px rgba(0,0,0,0.7)`) to establish unambiguous z-index priority over the interactive map.

| Level | Name | Treatment | Use |
|---|---|---|---|
| Level 0 | Canvas | `#0B0F19` flat background | Screen base |
| Level 1 | Card surface | `#111827` + 1px `#374151` | Dashboard widgets, stats bar |
| Level 2 | Overlay drawer | `#111827` + shadow `-4px 0 24px rgba(0,0,0,0.7)` | Slide-out diagnostic drawer |

### 2.6 Borders
- Standard card border: 1px solid `{colors.border-strong}` (#374151).
- Subdued separator: 1px solid `{colors.border-subtle}` (#1F2937).
- Focus state: 2px ring with `{colors.accent-sky}` (#0284C7).

### 2.7 Accessibility quick-check
Contrast verified via `design-a11y.md` automated check against WCAG 2.1 AA/AAA standards:
- Primary text `{colors.text-primary}` (#F9FAFB) on `{colors.bg-app}` (#0B0F19): **18.33:1 (AAA Pass)**.
- Muted text `{colors.text-muted}` (#9CA3AF) on `{colors.bg-card}` (#111827): **6.99:1 (AA Pass)**.
- Risk Telemetry Text on Dark Canvas:
  - Tier 1 `{colors.tier-very-low}` (#38BDF8): **8.94:1 (AAA Pass)**
  - Tier 2 `{colors.tier-low}` (#2DD4BF): **10.29:1 (AAA Pass)**
  - Tier 3 `{colors.tier-moderate}` (#FBBF24): **11.47:1 (AAA Pass)**
  - Tier 4 `{colors.tier-high}` (#FB923C): **8.46:1 (AAA Pass)**
  - Tier 5 `{colors.tier-very-high}` (#F43F5E): **5.22:1 (AA Pass)**
- Color-blind safety: Employs a non-overlapping multi-hue ramp (Sky $\to$ Teal $\to$ Amber $\to$ Orange $\to$ Rose/Crimson). Protanopia and Deuteranopia distinguish Sky/Teal clearly from Amber/Orange/Rose; Tritanopia distinguishes Sky/Amber/Rose clearly. Every status indicator couples color with explicit numerical scores (0–100) and Roman numerals (I–V).

## 3. Components Inventory

### 3.1 Generic components

#### card-container
- Variants: Standard container, highlighted container.
- Sizes: Full width or widget-scoped.
- Visible states: Default, hovered.
- Padding/Radius: Padding 16px, rounded `{rounded.md}` (8px).
- Confidence: High. ✅

#### map-viewport
- Variants: Full-height interactive Leaflet viewport.
- Sizes: Responsive viewport occupying primary dashboard stage.
- Visible states: Default, dragging, segment selected.
- Padding/Radius: Rounded `{rounded.md}` (8px) with 1px border `{colors.border-strong}` (#374151).
- Confidence: High. ✅

#### explain-drawer
- Variants: Slide-out right inspection drawer (420px fixed desktop width).
- Sizes: 100% viewport height, anchored to the right edge.
- Visible states: Closed (hidden), Open (slide transition).
- Padding/Radius: Padding 20px, left border 1px `{colors.border-strong}` (#374151), shadow `{shadows.drawer}`.
- Confidence: High. ✅

#### sop-card
- Variants: Agency-specific styling (Police: Blue accent, BRO/PWD: Amber accent, DDMA/DM: Crimson accent).
- Sizes: Compact actionable card with dispatch trigger.
- Visible states: Pending, Dispatched (timestamped state).
- Padding/Radius: Padding 14px, rounded `{rounded.md}` (8px), background `{colors.bg-card-elevated}` (#1F2937).
- Confidence: High. ✅

#### risk-badge
- Variants: 5 risk tiers (Very Low, Low, Moderate, High, Very High).
- Sizes: Compact (inline text) and Large (drawer header).
- Visible states: Active, dimmed.
- Padding/Radius: Padding 4px 8px, rounded `{rounded.sm}` (4px).
- Confidence: High. ✅

### 3.2 Signature components
- **Live Trigger Rainfall Slider:** Monospace-calibrated dynamic slider with preset scenario pills ("Dry Season", "Monsoon Surge", "Km 58.2 Cloudburst") delivering instant state updates.
- **Explain-Why Driver Meter:** Three-part stacked scientific diagnostic showing rainfall threshold overage percentage, cut-slope stability, and detour isolation penalty.

## 4. Layout & Composition

### 4.1 Grid & containers
- Application canvas is 100vw $\times$ 100vh with a 56px fixed tactical topbar.
- Main body uses a two-panel split: 70% geospatial corridor map viewport, 30% tactical status & priority queue panel.
- Collapsible 420px drawer slides over the right panel for deep segment diagnostics.

### 4.2 Composition patterns
- Header: Operational status indicator ("DEOC MONITORING ACTIVE"), active corridor badge, citizen view toggle.
- Sub-header Bar: Rainfall scenario slider and top-risk quick filters.
- Primary View: Center map ribbon displaying NH-7 chainage segments.

### 4.3 Responsive behavior
- Desktop (> 1024px): Full command center cockpit layout with simultaneous map, stats, and drawer.
- Tablet (768px – 1023px): Stacked map with bottom drawer modal.
- Mobile View (< 768px / 390px Citizen Mode): Single-column public advisory feed showing road open/closed status, convoy windows, and shelter contacts.

### 4.4 Image behavior
- Topographic cartographic tiles rendered via high-contrast dark satellite base layers with vector GeoJSON segment overlays.

## 5. Reconstruction Notes
- Stack: React + TypeScript + Tailwind CSS + Leaflet (react-leaflet).
- Quick wins: Using Tailwind utility classes for dark tactical cards and JetBrains Mono for telemetry readouts.
- Tricky bits: Synchronizing the dynamic rainfall slider state with Leaflet polyline color recalculations without re-rendering the base map tiles.
- Confidence map:
  - Visual identity: High ✅
  - Token precision: High ✅
  - Component architecture: High ✅

## 6. Do's and Don'ts

### Do
- Always pair risk color badges with explicit numerical scores (e.g., "Very High: 84/100") and tier tags.
- Use `{colors.bg-card}` (#111827) for data container backgrounds to ensure high contrast against the `{colors.bg-app}` (#0B0F19) canvas.
- Keep telemetry and measurements (Km markers, rainfall mm, slope angles) strictly in `{typography.telemetry-mono}`.
- Reserve `{colors.tier-very-high}` (#F43F5E) strictly for critical tipping-point segments and emergency actions.
- Use `{colors.border-strong}` (#374151) for 1px card boundaries to give crisp tactical definition in dark mode.

### Don't
- Never rely on red vs. green alone for risk status; maintain the color-blind-safe Sky $\to$ Teal $\to$ Amber $\to$ Orange $\to$ Rose ramp.
- Don't use light-mode card surfaces or white containers anywhere in the primary command center.
- Never omit the plain-English explanation behind a risk escalation.
- Don't apply drop shadows to internal flat cards; use 1px border lines and reserve heavy elevation strictly for the slide-out drawer.
- Never use non-monospace fonts for fluctuating numbers or chainage indicators.

## 7. Open Questions
Material sufficient for complete reconstruction.

## 8. Companion files
- `design-a11y.md`: Automated WCAG 2.1 AA/AAA contrast check report.
- `design-tokens.json`: W3C Design Tokens Community Group (DTCG) token export.
