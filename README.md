# ResQFlow — Disaster Relief Logistics & Emergency Operations Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-GIS_Mapping-green?logo=leaflet)](https://leafletjs.com/)

**ResQFlow** is an emergency logistics decision-support platform designed for disaster-response coordinators. It combines **Demand**, **Inventory**, **Mobility**, **Risk**, and **Fleet** multi-agent telemetry into ranked, deterministic delivery plans powered by optimization algorithms.

---

## 🌟 Key Features

### 1. National Disaster Command Matrix (All 29 Indian States & Territories)
- **Comprehensive Coverage**: Mapped command centers for all 29 Indian states and major territories (from *Assam, Bihar, Odisha, Kerala, Maharashtra, Gujarat* to *Jammu & Kashmir, Ladakh, and Delhi NCR*).
- **Hazard Profiles**: Localized flood inundation belts, cyclone storm surge corridors, cloudburst zones, and high-risk relief sectors.
- **Instant Node Switching**: Switch command centers on the fly with automatic map centering and telemetry adaptation.

### 2. Live GIS Interactive Operations Map
- **Pulsing Critical Markers**: Real-time animated radar ripple indicators for high-urgency hospitals and shelters.
- **Dynamic Layers**: Toggleable vector overlays for warehouses, medical centers, fleet units, active hazard zones, blocked road segments, and optimal delivery paths.
- **Route Corridor Inspector**: Auto-fit bounds zoom, checkpoint analysis, and hazard avoidance visualization.

### 3. Multi-Agent Optimization Pipeline
- **Demand Agent**: Predicts hospital consumption rates and impending supply exhaustion windows.
- **Risk Agent**: Evaluates live hydro-gauge and radar flood zones.
- **Mobility Agent**: Identifies severed road segments and validates high-elevation bypasses.
- **Inventory Agent**: Checks regional supply depot stock buffers.
- **Fleet Agent**: Designates cold-chain vehicles and turnaround schedules.
- **Deterministic Orchestrator**: Generates ranked delivery schedules with transparent agent reasoning.

### 4. Real-Time Telemetry & Disruption Simulator
- **Live Incidents Stream**: Manual sensor polling and background auto-sync (12s interval).
- **Interactive Disruption Injection**: Simulate sudden flash floods, road closures, or bridge collapses and watch the multi-agent system synthesize updated bypass plans in real time.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.3.1](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Stitch Design Tokens
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Mapping & GIS**: [Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/)
- **Icons & Typography**: Google Material Symbols Outlined, Inter, JetBrains Mono

---

## 📁 Project Architecture

```
resqfloww/
├── src/
│   ├── app/                    # Next.js 16 App Router pages
│   │   ├── page.tsx            # Main Command Center Dashboard
│   │   ├── dashboard/          # Operations Overview
│   │   ├── delivery-plan/      # Recommended Delivery Schedule
│   │   ├── warehouses/         # Regional Depots & Stock
│   │   ├── hospitals/          # Medical Centers & Relief Camps
│   │   ├── fleet/              # Logistics Units & Turnaround
│   │   ├── roads/              # Mobility & Blocked Corridors
│   │   ├── risk/               # Hazard Zones & Vulnerability
│   │   ├── activity/           # Multi-Agent Execution Log
│   │   ├── reports/            # Operational Analytics & Archive
│   │   └── settings/           # System Configuration
│   ├── components/
│   │   ├── dashboard/          # Metrics, DeliveryPlanCard, Modals
│   │   ├── layout/             # Sidebar, Header, AppLayout
│   │   ├── map/                # Leaflet OperationsMap & GIS Layers
│   │   └── ui/                 # Reusable Design System Components
│   ├── data/
│   │   └── mock/               # Mock Datasets & State Generator
│   ├── store/
│   │   └── simulationStore.ts  # Zustand Global State
│   └── types/
│       └── index.ts            # Domain TypeScript Definitions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm / yarn / pnpm

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone <YOUR_REPO_URL>
   cd resqfloww
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build & Linting

```bash
npm run lint    # Run ESLint validation
npm run build   # Compile optimized production bundle
npm run start   # Start production server
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
