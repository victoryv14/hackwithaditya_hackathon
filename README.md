# LRSS – Landslide Risk Scaling System

### An Interactive Geospatial Decision-Support Platform for Landslide Risk Assessment

LRSS (Landslide Risk Scaling System) is a map-based decision-support platform designed to help disaster management authorities identify vulnerable road segments, assess changing landslide risk conditions, and prioritize locations requiring attention.

The system focuses on the NH-7 corridor connecting Rishikesh, Devprayag, and Srinagar in Uttarakhand, India. It combines terrain vulnerability, historical landslide information, rainfall triggers, and infrastructure exposure into an explainable risk assessment framework.

The project is being developed as a hackathon prototype to demonstrate how geospatial visualization and dynamic risk assessment can support proactive landslide management.

---

## Problem Statement

Landslide-prone regions frequently face challenges during periods of intense rainfall. Although geological records, rainfall information, and historical landslide data are available, these sources are often fragmented.

This makes it difficult for disaster management authorities to:

- Identify specific vulnerable road segments.
- Understand how changing rainfall conditions influence landslide risk.
- Prioritize critical locations for inspection and monitoring.
- Understand the factors contributing to a particular risk level.

LRSS addresses these challenges through a centralized geospatial platform that visualizes localized risk conditions and provides explainable risk assessments.

---

## Key Features

### 1. Interactive Geospatial Dashboard
- Tactical dark-themed command-center interface.
- Interactive geographical map displaying the NH-7 corridor.
- 35 road segments with risk-coded polylines aligned with the highway.
- Multiple map visualization modes:
  - Dark Tactical
  - Satellite
  - Street
- Interactive zoom, segment selection, and geographical navigation.

### 2. Dynamic Rainfall Simulation
- Interactive 48-hour cumulative rainfall slider (0–250 mm).
- Dynamic recalculation of risk scores as rainfall conditions change.
- Preset scenarios:
  - Dry Season – 20 mm
  - Regional Monsoon – 85 mm
  - Cloudburst Crisis – 165 mm

### 3. Five-Tier Risk Classification

The system classifies road segments into five operational risk categories:

| Tier | Risk Level | Score |
|---|---|---|
| I | Very Low | 0–20 |
| II | Low | 21–40 |
| III | Moderate | 41–60 |
| IV | High | 61–80 |
| V | Very High | 81–100 |

Each category is represented through a distinct, color-blind-conscious color scale for easier identification.

### 4. Top Five Critical Hotspots
- Dynamically ranks the five highest-risk road segments.
- Identifies locations requiring greater attention.
- Allows users to select individual hotspots directly from the dashboard.

### 5. Explain Why – Risk Analysis
Provides a detailed breakdown of the factors contributing to a selected segment's risk assessment.

The inspection panel includes:
- Operational Risk Index.
- Dynamic Hazard Index.
- Consequence Impact Index.
- 48-hour cumulative rainfall.
- Slope gradient and configured threshold.
- Historical landslide information.
- Transit bottleneck vulnerability.

This makes the risk assessment more transparent and understandable.

---

## System Architecture

LRSS follows a client-side architecture in which the rainfall simulation, risk calculation, and interactive visualization operate within the web application.

**Core Workflow:**

Rainfall Simulation  
↓  
Dynamic Risk Calculation  
↓  
Five-Tier Risk Classification  
↓  
Geospatial Risk Visualization  
↓  
Hotspot Identification  
↓  
Explainable Risk Analysis

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application development |
| Vite | Development and build tooling |
| Tailwind CSS | Interface styling |
| Leaflet | Interactive geospatial visualization |
| GeoJSON | Road geometry representation |
| JavaScript / TypeScript | Risk calculation and application logic |

---

## Geographic Focus

**NH-7: Rishikesh – Devprayag – Srinagar, Uttarakhand, India**

The prototype covers approximately 97 km of the selected highway corridor, represented through 35 road segments.

The geographical demonstration includes important locations such as:
- Byasi
- Totam
- Devprayag
- Sirobagarh
- Srinagar

The prototype uses sample risk attributes and simulated rainfall scenarios to demonstrate the system's functionality.

---

## Current Development Status

The following components have been implemented:

- [x] React + TypeScript project setup
- [x] Tactical dark dashboard interface
- [x] Interactive NH-7 corridor map
- [x] 35 road segments with geographical alignment
- [x] Five-tier risk classification
- [x] Interactive risk filters
- [x] Dynamic rainfall slider
- [x] Rainfall scenario presets
- [x] Live risk score recalculation
- [x] Top Five Critical Hotspots
- [x] Explain Why inspection panel

**Upcoming Development:**
- [ ] Priority Agency SOP Action Cards
- [ ] Simulated emergency action dispatch and audit log
- [ ] Mobile Citizen Advisory View
- [ ] Final deployment and demonstration readiness

---

## Running the Project Locally

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project-folder>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Production Build

To generate the production build:

```bash
npm run build
```

---

## Important Note

LRSS is currently a hackathon demonstration prototype. The corridor dataset includes sample risk attributes, and rainfall conditions are simulated through interactive controls.

The current prototype does not yet integrate live meteorological APIs, real-time sensor feeds, or operational emergency-response systems. Its risk scores are intended to demonstrate the proposed assessment framework rather than provide certified landslide predictions.

---

## Future Scope

- Integration of real-time rainfall data and weather APIs.
- Incorporation of geological susceptibility datasets and satellite-derived terrain information.
- Integration of historical landslide datasets for improved risk assessment.
- Implementation of agency-specific emergency action recommendations.
- Development of a citizen-facing mobile advisory interface.
- Expansion to additional landslide-prone regions across India.

---

## Vision

Our vision is to transform fragmented landslide-related information into actionable geographical insights, helping disaster management authorities identify vulnerable locations, understand emerging risks, and prioritize emergency response.

**LRSS – Predict the Risk. Identify the Danger. Prioritize the Response. Protect Lives.**