# LRSS – Landslide Risk Scaling System

### Predict the Risk. Identify the Danger. Prioritize the Response. Protect Lives.

**An Interactive Geospatial Decision-Support Platform for Landslide Risk Assessment.**

## 1. Problem Statement

Landslides threaten lives, damage critical infrastructure, and disrupt transportation networks, particularly in India's mountainous regions.

During periods of intense rainfall, identifying vulnerable locations and responding quickly becomes critical. However, information such as rainfall measurements, terrain conditions, and historical landslide records is often scattered across different sources.

This fragmentation makes it difficult for disaster management authorities to identify critical hotspots, assess changing risk conditions, and prioritize emergency response.

## 2. Our Solution

LRSS brings fragmented landslide-related information into a centralized geospatial platform.

It enables authorities to visualize vulnerable road segments, simulate rainfall conditions, identify high-risk hotspots, and understand the factors contributing to individual risk assessments.

The goal is to support faster, better-informed decisions and proactive disaster management.

## 3. Key Features

- **Interactive Geospatial Dashboard:** Visualizes 35 risk-coded road segments along the NH-7 corridor.
- **Dynamic Rainfall Simulation:** Simulates 48-hour cumulative rainfall conditions (0–250 mm) and recalculates risk scores.
- **Five-Tier Risk Classification:** Categorizes locations from Very Low to Very High risk.
- **Top Five Critical Hotspots:** Identifies and ranks the five highest-risk road segments.
- **Explain Why Analysis:** Displays contributing factors such as rainfall, slope gradient, historical landslide information, and infrastructure vulnerability.

## 4. Geographic Focus

**NH-7: Rishikesh – Devprayag – Srinagar, Uttarakhand, India**

- Approximately 97 km of highway coverage.
- 35 geographical road segments.
- Key locations: Byasi, Totam, Devprayag, Sirobagarh, and Srinagar.

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application development |
| Vite | Development and build tooling |
| Tailwind CSS | Interface styling |
| Leaflet | Interactive geospatial visualization |
| GeoJSON | Road geometry representation |

## 6. System Workflow

Rainfall Simulation → Dynamic Risk Calculation → Risk Classification → Geospatial Visualization → Hotspot Identification → Explainable Risk Analysis

## 7. Getting Started

### Prerequisites

- Node.js (LTS version)
- npm

### Installation

**Step 1: Clone the repository**

```bash
git clone <repository-url>
```

**Step 2: Navigate to the project directory**

```bash
cd <project-folder>
```

**Step 3: Install dependencies**

```bash
npm install
```

**Step 4: Start the development server**

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### Production Build

To generate the production-ready build:

```bash
npm run build
```

## 8. Development Status

### Implemented

- Interactive geospatial dashboard.
- NH-7 corridor visualization.
- 35 geographical road segments.
- Five-tier risk classification.
- Dynamic rainfall simulation.
- Critical hotspot identification.
- Explainable risk analysis.

### Upcoming

- Priority Agency SOP Action Cards.
- Simulated emergency dispatch and audit log.
- Mobile Citizen Advisory View.
- Final deployment.

## 9. Prototype Limitations

LRSS is currently a hackathon demonstration prototype using sample risk attributes and simulated rainfall conditions.

The current implementation does not yet integrate live meteorological APIs, real-time sensor feeds, or operational emergency-response systems.

The displayed risk scores demonstrate the proposed assessment framework and should not be interpreted as certified landslide predictions.

## 10. Future Scope

- Integration of real-time rainfall and weather APIs.
- Incorporation of geological susceptibility and satellite-derived terrain datasets.
- Integration of historical landslide records.
- Agency-specific emergency action recommendations.
- Development of a citizen-facing mobile advisory interface.
- Expansion to other landslide-prone regions across India.

## 11. Vision

To transform fragmented geographical and environmental information into actionable insights, helping disaster management authorities identify vulnerable locations, understand emerging risks, and prioritize their response.

**Because faster decisions and timely action can help save lives.**

---

**LRSS – Predict the Risk. Identify the Danger. Prioritize the Response. Protect Lives.**
