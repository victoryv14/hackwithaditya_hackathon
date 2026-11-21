# Regional Landslide Risk Scaling System (LRSS) — Hackathon Demo

> **Project:** HackwithAditya Hackathon  
> **Status:** Stage 1 — Technical Specification & Architecture  
> **Target Timeline:** 12–24 Hour Hackathon Sprint  
> **Current Code Status:** Design & Specification Phase (No code written yet)

---

## 1. Executive Summary

The **Regional Landslide Risk Scaling System (LRSS)** is a dynamic, map-based geospatial decision-support command center designed for District Emergency Operation Centres (DEOCs), infrastructure authorities (BRO/NHAI/PWD), and disaster managers (DDMA). 

Unlike static macro-susceptibility maps that blanket thousands of square kilometers in generic warnings, LRSS continuously fuses baseline terrain fragility with live hydrometeorological triggers and human/economic consequence metrics to produce an explainable, localized (250m–500m) **Operational Risk Score (0–100)** for discrete road segments.

---

## 2. Project Scope & Architecture Alignment

The project parameters for the hackathon demo are structured as follows:

| Parameter | Selected Target | Justification / Context |
| :--- | :--- | :--- |
| **Corridor** | **NH-7: Rishikesh – Devprayag – Srinagar (Uttarakhand)** | Critical high-stakes Himalayan transit artery along the Alaknanda/Ganga river gorge with chronic landslide hotspots (Byasi, Totam, Sirobagarh). |
| **Primary User Persona** | **DEOC / DDMA Incident Commander** | The multi-agency coordinator responsible for issuing road closures, directing police diversions, and staging BRO machinery. |
| **Core Value Demo** | **The Integrated Operational Loop** | Live Rainfall/Trigger Slider $\to$ Instant Chainage Tipping Points $\to$ Transparent "Explain Why" Drawer $\to$ 1-Click SOP Action Dispatch. |
| **Technology Stack** | **React + TypeScript + Vite + Tailwind CSS + Leaflet** | High-performance single-page application with an embedded client-side scoring engine for instant reactivity and zero runtime latency during judging. |
| **UI Design Theme** | **Tactical Dark Mission Control** | Emergency command-center aesthetic (`#0B0F19`), neon status indicators (Emerald, Amber, Crimson), monospace telemetry, and slide-out HUD panels. |
| **Sprint Duration** | **12–24 Hours** | Focused high-polish MVP utilizing pre-modeled high-fidelity corridor data and simulated weather scenarios. |
| **Explicit Non-Goals** | Live multi-GB raster GIS ingestion, physical IoT hardware sensors, automated siren hardware. |

---

## 3. Mathematical & Scoring Engine Foundation

The engine follows the NDMA-aligned four-pillar framework:

### 1. Dynamic Hazard Score ($H \in [0, 100]$):
$$H = (w_s \cdot S + w_h \cdot H_{hist}) \times \Phi(T)$$
- **$S$**: Baseline Susceptibility (slope angle, curvature, lithology, and land cover).
- **$H_{hist}$**: Historical Landslide Density & Recurrence Factor.
- **$\Phi(T)$**: Dynamic Trigger Multiplier derived from 24h/48h rainfall and Antecedent Rainfall Index (ARI).

### 2. Consequence Impact Score ($C \in [0, 100]$):
$$C = \min\left(100, w_p \cdot E_{pop} + w_i \cdot E_{infra} + w_v \cdot V_{isolation}\right) \times (1 - \delta_{prep})$$
- **$E_{pop}$**: Population exposure in runout path.
- **$E_{infra}$**: Strategic highway significance (National Highway vs. rural bypass).
- **$V_{isolation}$**: Single-road cutoff vulnerability penalty.
- **$\delta_{prep}$**: Mitigation offset (gabion walls, pre-positioned excavators).
- *Prevents the "zero-factor suppression trap"* so uninhabited transit bottlenecks are never under-scored.

### 3. Asymmetric $5 \times 5$ Risk Matrix:
- **0–20 (Very Low):** Routine monitoring conditions.
- **21–40 (Low):** Advisory state; standard drainage checks.
- **41–60 (Moderate):** Pre-activation; inspect chronic trouble spots.
- **61–80 (High):** Tactical alert; pre-position heavy equipment, enforce traffic convoying.
- **81–100 (Very High):** Emergency action; immediate road closure, localized evacuation advisories.

---

## 4. Development Roadmap & Milestones

1. **Milestone 1: Requirements & Intent Alignment** — [COMPLETED]
   - Defined corridor, incident commander persona, demo narrative, and technical stack.
2. **Milestone 2: Technical Specification & Boundaries** — [IN PROGRESS]
   - Formalizing corridor segment schema, mathematical weight vectors, SOP card data contracts, and testable acceptance criteria.
3. **Milestone 3: Timeboxed Work Breakdown** — [PENDING]
   - Prioritized task planning with vertical-slice checkpoints.
4. **Milestone 4: Data Contracts & Interface Design** — [PENDING]
   - Type definitions for corridor segments, telemetry, and agency action cards.
5. **Milestone 5: Mathematical Scoring Engine & Unit Verification** — [PENDING]
   - Formula validation, edge-case handling, and 5x5 matrix projection tests.
6. **Milestone 6: Incremental System Integration** — [PENDING]
   - Base map rendering, dynamic choropleth coloration, scenario slider, and drawer integration.
7. **Milestone 7: Command-Center UI Engineering** — [PENDING]
   - Mission-control dark layout, interactive filters, and alert action workflows.
8. **Milestone 8: Quality Assurance & Code Polish** — [PENDING]
   - Clean state management, smooth 60fps map rendering, and robust error handling.
9. **Milestone 9: Demo Readiness & Presentation Walkthrough** — [PENDING]
   - 1-click scenario presets, incident simulation scripts, and judge walkthrough guide.
