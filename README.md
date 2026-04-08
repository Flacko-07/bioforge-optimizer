# 🔥 BioForge Optimizer

> **AI-driven biomass briquette composition and process optimization tool powered by GNN-PINN hybrid architecture.**

BioForge Optimizer is a web-based scientific tool that lets you design, simulate, and optimize biomass briquettes for specific end-use applications — from cremation and cooking to industrial boilers and ritual use. It combines a Graph Neural Network (GNN) mixture model with Physics-Informed Neural Network (PINN) simulation to predict real-time drying curves, thermal properties, and mechanical performance.

---

## ✨ Features

- **🧪 Recipe Editor** — Interactively adjust the biomass blend ratio (cow dung, sawdust, straw) and initial moisture content with live feedback
- **⚡ GNN-PINN Physics Engine** — Simulates drying dynamics, moisture loss curves, and temperature profiles using a physics-constrained neural model
- **📊 Physics Dashboard** — Real-time visualization of drying curves, temperature evolution, and predicted briquette properties (calorific value, density, burn time, ash content, smoke rating, strength)
- **🎯 Application-Specific Optimizer** — One-click recipe optimization for four target applications with custom priority weights:
  - **Cremation** — Long burn, high structural integrity
  - **Cooking / Domestic** — Low smoke, stable flame
  - **Industrial Boiler** — Max calorific value, minimal ash
  - **Ritual / Havan** — Clean-burning, traditional high-dung blend
- **🖥️ Neural Engine Status Panel** — Live inference latency, convergence stats, and architecture metadata
- **🎨 GNOME-Inspired UI** — Dark, minimal interface with fluid animations via Motion (Framer)

---

## 🧠 Architecture

```
Input: Biomass Recipe (dung %, sawdust %, straw %, moisture %)
          │
          ▼
    GNN Mixture Model
  (Component interactions → Blend representation)
          │
          ▼
    PINN Physics Engine
  (Drying PDEs · Thermal dynamics · Mass transfer)
          │
          ▼
   SimulationResult {
     moistureCurve[], temperatureCurve[],
     finalProperties: { density, calorificValue,
                        strength, ashContent,
                        burnTime, smokeRating }
   }
          │
          ▼
   Application Optimizer
  (Weighted scoring per use-case priorities)
```

The `PhysicsEngine` in `src/lib/physics.ts` runs both the simulation (`simulateDrying`) and the inverse optimization (`optimize`) routines, backed by the GNN-PINN hybrid model.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Google Gemini API key** (for any AI assistant features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Flacko-07/bioforge-optimizer.git
cd bioforge-optimizer

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Development

```bash
npm run dev
# App runs at http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
bioforge-optimizer/
├── src/
│   ├── App.tsx                  # Root component, layout, state management
│   ├── types.ts                 # Shared TypeScript types & application configs
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global styles (Tailwind v4 + custom GNOME theme)
│   ├── components/
│   │   ├── RecipeEditor.tsx     # Biomass blend ratio sliders
│   │   ├── PhysicsDashboard.tsx # Simulation result charts & property cards
│   │   └── OptimizerPanel.tsx   # Application selector + optimize trigger
│   └── lib/
│       └── physics.ts           # GNN-PINN PhysicsEngine (simulation + optimization)
├── index.html                   # HTML entry point
├── metadata.json                # Project metadata
├── vite.config.ts               # Vite + React + Tailwind config
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment variable template
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts + D3.js |
| **Animations** | Motion (Framer) |
| **Icons** | Lucide React |
| **AI / LLM** | Google Gemini (`@google/genai`) |
| **Backend** | Express (lightweight API proxy) |

---

## 🎯 Application Targets

BioForge supports four optimization presets, each with tuned priority weights:

| Application | Burn Time | Strength | Heat | Low Smoke | Low Ash |
|---|---|---|---|---|---|
| 🕯️ Cremation | ★★★★★ | ★★★★ | ★★★ | ★ | ✗ |
| 🍳 Cooking | ★★ | ★★ | ★★★ | ★★★★★ | ★★★★ |
| 🏭 Industrial Boiler | ★★ | ★ | ★★★★★ | ★★★ | ★★★★★ |
| 🔥 Ritual / Havan | ★ | ★ | ★★ | ★★★★★ | ★★★ |

---

## 📐 Biomass Components

| Component | Role |
|---|---|
| **Cow Dung** | Binder; increases density and structural strength. High in traditional ritual blends. |
| **Sawdust** | Calorific value booster; lowers ash content, aids combustion. |
| **Straw** | Porosity agent; improves drying, burn initiation, and smoke profile. |

Recipe constraint: `dung + sawdust + straw = 100%`

---

## 📄 License

Licensed under the **Apache 2.0 License** — see [LICENSE](LICENSE) for full details.

---

## 👤 Author

**Naval Singh**  
ML & Scientific Computing | GNN · PINN · Open Source  
[GitHub → @Flacko-07](https://github.com/Flacko-07)

---

<p align="center">
  Built with physics-constrained intelligence for sustainable biomass energy 🌱
</p>
