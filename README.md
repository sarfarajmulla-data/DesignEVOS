<p align="center">
  <img src="src/assets/evos-logo.jpg" alt="EVOS logo" width="420" />
</p>

<h1 align="center">EVOS — Electric Vehicles Operations & Sustainability</h1>

<p align="center">
  An interactive demo of an operations platform for electric fleet depots: smart charging schedules,
  solar + storage energy management, battery health, forecasting and emissions reporting.
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript 5.7" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Status: demo" src="https://img.shields.io/badge/status-demo-C58B35" />
</p>

> **Demo notice.** All vehicles, chargers, energy flows, forecasts and emissions figures are produced by a
> deterministic, in-browser simulation. EVOS does not connect to real vehicles, chargers, meters or the
> grid, and it makes no network requests for data. Numbers are illustrative and must not be used for
> operational, financial or regulatory decisions.

---

## Contents

- [What it does](#what-it-does)
- [Feature tour](#feature-tour)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [How the simulation works](#how-the-simulation-works)
- [Connecting a real backend](#connecting-a-real-backend)
- [Design, motion & accessibility](#design-motion--accessibility)
- [Performance](#performance)
- [Browser support](#browser-support)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## What it does

A depot that charges a mixed electric fleet (buses, vans, carts) has to answer the same questions every day:

- Will every vehicle be charged enough before it leaves?
- Can we do that without going over the site's grid connection limit?
- How much can solar and on-site storage cover, and what will it cost?
- How healthy are the batteries, and what is our CO₂ impact?

EVOS answers these in one place. You can change the assumptions (solar output, tariff, grid limit,
vehicle priorities, faults) and see schedules, energy flows, costs and emissions recalculate instantly,
with a plain-language explanation of every decision.

## Feature tour

The app has a public landing site (`/`) and a demo workspace (`/app/...`). Routing is hash-based,
so every page is linkable, e.g. `/#/app/scheduler`.

| Area | Page | Route | What you can do |
| --- | --- | --- | --- |
| **Operate** | Overview | `/app/overview` | Readiness, energy mix, active alerts at a glance |
| | Fleet | `/app/fleet` | Search, filter and sort vehicles; open a vehicle for its charge timeline |
| | Scheduler | `/app/scheduler` | Compare charging strategies on a Gantt timeline; edit vehicle constraints |
| | Energy | `/app/energy` | Solar, storage and grid supply over the day, tariff bands, storage reserve |
| | System View | `/app/system` | Live schematic of power flowing between grid, solar, storage and chargers |
| **Analyse** | Battery Health | `/app/battery` | Estimated state of health with uncertainty ranges |
| | Forecasts | `/app/forecasts` | Demand and solar forecasts with likely ranges |
| | Sustainability | `/app/sustainability` | Estimated emissions vs. a grid-only baseline, by day |
| | Explainability | `/app/explain` | Why each vehicle was scheduled the way it was |
| | Maintenance & Faults | `/app/maintenance` | Inject faults (stale telemetry, frozen or invalid readings) and see the response |
| **Plan** | Scenarios | `/app/scenarios` | What-if simulator compared against today's baseline |
| | Experiments | `/app/experiments` | Run strategy experiments and compare cost and lateness |
| | Alerts | `/app/alerts` | All derived alerts with severity and suggested action |
| **Data** | Datasets & Sources | `/app/datasets` | See data provenance; import a sample dataset with validation |
| | Configuration | `/app/settings` | Edit site assumptions with validation; reset the simulation |
| | Methodology | `/app/methodology` | Models, assumptions and limitations, stated plainly |

### Charging strategies

| Strategy | Behaviour |
| --- | --- |
| **First-come, first-served (FCFS)** | Vehicles charge in arrival order at full power. No site power cap; exceedances are flagged. |
| **Rule-based (earliest deadline)** | High-priority vehicles first, then earliest departure, within the site power cap. |
| **EVOS weighted heuristic** | Weighted score of urgency, charge deficit, slack, service class and operator priority, within the cap. |

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | [React 19](https://react.dev) + TypeScript 5.7 |
| Build / dev server | [Vite 8](https://vite.dev) with `@vitejs/plugin-react` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` (no config file needed) |
| Icons | [lucide-react](https://lucide.dev) |
| Charts | Custom lightweight SVG components (`src/components/charts.tsx`); no chart library |
| Routing | Tiny hash router (`src/lib/router.tsx`) with View Transitions |
| State | React context store (`src/lib/store.tsx`); session-scoped, nothing is persisted to a server |
| Formatting | [oxfmt](https://oxc.rs) |
| Toolchain | Node 22, pnpm 10 (pinned in `.mise.toml`) |

## Getting started

### Prerequisites

- **Node.js 22** or newer
- **pnpm 10** (`corepack enable` will provide it), or use [mise](https://mise.jdx.dev): `mise install`

### Install and run

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
pnpm install
pnpm dev
```

Then open the URL Vite prints (by default <http://localhost:5173>).

### Production build

```bash
pnpm build      # outputs static files to dist/
pnpm preview    # serves dist/ locally to check the build
```

No environment variables are required to run the demo.

## Available scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with hot reload |
| `pnpm build` | Create an optimised production build in `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm format` | Format the codebase with oxfmt |
| `pnpm exec tsc --noEmit -p .` | Type-check the project |

## Project structure

```text
.
├── index.html                 # HTML shell with the #root element
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Top-level routing, page titles, error boundary
│   ├── index.css              # Tailwind import, theme tokens, motion system
│   ├── assets/
│   │   └── evos-logo.jpg      # Brand artwork (logo mark is cropped from this)
│   ├── site/
│   │   └── Site.tsx           # Public landing site and shared <Logo />
│   ├── app/
│   │   ├── Shell.tsx          # App layout: sidebar, mobile nav, toasts
│   │   ├── AppRoutes.tsx      # /app/* route table
│   │   ├── ConstraintEditor.tsx
│   │   └── pages1–5.tsx       # Workspace pages (Overview, Fleet, Scheduler, …)
│   ├── components/
│   │   ├── ui.tsx             # Buttons, panels, tabs, metrics, animated numbers
│   │   ├── charts.tsx         # TimeChart, Bars, Donut, Legend (SVG)
│   │   ├── EnergySchematic.tsx
│   │   └── ErrorBoundary.tsx  # Recovery screen instead of a blank page
│   ├── lib/
│   │   ├── sim.ts             # Deterministic depot simulation + strategies
│   │   ├── store.tsx          # App state (assumptions, overrides, faults)
│   │   ├── router.tsx         # Hash router with View Transitions
│   │   └── importer.ts        # Sample dataset import + validation
│   ├── data/
│   │   ├── catalog.ts         # Data source catalogue and provenance
│   │   └── contracts.ts       # Shared data types / contracts
│   └── services/
│       └── index.ts           # Data-access layer (demo adapter today)
├── supabase/functions/server/ # Optional edge-function scaffold (unused by the demo)
├── utils/supabase/            # Optional Supabase project info (unused by the demo)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## How the simulation works

`src/lib/sim.ts` models one operating day in **15-minute steps** (96 steps).

1. **Inputs:** vehicles (arrival, departure, current and target charge, priority, service class),
   chargers (type, power), site assumptions (grid limit, solar scale, storage size and reserve,
   tariff with peak multiplier, grid carbon intensity).
2. **Scheduling:** the selected strategy assigns vehicles to compatible chargers and power levels,
   respecting the site cap (except FCFS, which flags exceedances).
3. **Energy balance:** at each step, demand is met first from solar, then storage (above the reserve),
   then the grid.
4. **Outputs:** per-vehicle sessions (on time / late / at risk), energy flows, peak grid import, cost,
   estimated emissions and derived alerts.

The simulation is **deterministic**: the same inputs always give the same results, so
demos are repeatable. Results are cached by input, so switching back to a previous setting is instant.
Forecasts are a profile-based baseline (`profile-baseline 0.1`), **not** a trained model.
See the in-app **Methodology** page for full assumptions and limitations.

## Connecting a real backend

UI code talks only to the service interfaces in `src/services/index.ts`. Today every service is
backed by the local demo model, and no network requests are made.

To connect the EVOS backend, copy `.env.example` to `.env.local` and set the browser-safe API origin:

```bash
VITE_EVOS_API_URL=http://localhost:8000
```

The frontend uses the `/health`, `/ready`, and `/api/v1` EVOS routes for fleet, chargers,
scenario, scheduling, simulations, energy, battery health, forecasting, maintenance, datasets,
sustainability, confidence, explainability, and evaluation. Non-2xx and network failures are
surfaced as `EvosApiError`; a configured API is never silently replaced by demo values. Without
`VITE_EVOS_API_URL`, the deterministic demo adapter remains active. Backend fractions such as
`renewable_share` and `state_of_charge` are normalized to the UI's percentage contract, and
backend provenance is preserved rather than presented as measured data.

The `supabase/` and `utils/supabase/` folders are optional scaffolding and are not used by the demo.
Never commit service-role keys or other secrets; keep them in environment variables on your host.

## Design, motion & accessibility

- **Plain-language charts:** every chart opens with a one-line "In short" summary, and uses
  rounded values and minimal gridlines.
- **Motion system:** shared duration and easing tokens in `src/index.css`. It includes page
  cross-fades (View Transitions API), staggered section entrances, animated value changes with a
  brief highlight, chart reveal/morph, sliding tabs and segmented controls, and animated toasts.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, all decorative animation and view
  transitions are disabled; content and controls work the same.
- **Accessibility:** semantic landmarks, labelled SVG charts (`role="img"` + summary), keyboard
  navigation for tabs (arrow keys) and chart tooltips, visible focus styles, and 44px touch targets
  on primary actions.
- **Resilience:** an error boundary shows a recovery screen with "Try again" and "Reset demo"
  instead of a blank page.
- **Responsive:** verified at 360px with no horizontal overflow.

## Performance

Measured on a local production build with Chrome DevTools-style 4× CPU throttling:

| Metric | Result |
| --- | --- |
| Largest Contentful Paint (app pages, without photos) | ≈ 1.7 s |
| Cumulative Layout Shift | 0.000–0.001 |
| Strategy switch, click → paint | ≈ 220–290 ms |

Techniques used: cached simulation results, `startTransition` for recalculations, optimistic control
state, and animated numbers that update the DOM directly instead of re-rendering React every frame.

## Browser support

Latest Chrome, Edge, Firefox and Safari. Page cross-fades use the View Transitions API, which is
available in Chromium browsers and recent Safari; other browsers get the same content without the
cross-fade.

## Deployment

The build output in `dist/` is fully static, so you can host it on any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.).

```bash
pnpm build
# upload the contents of dist/
```

Because routing is hash-based (`/#/app/...`), no server rewrite rules are needed.

**GitHub Pages:** if serving from a sub-path (`https://<user>.github.io/<repo>/`), set
`base: "/<repo>/"` in `vite.config.ts` before building.

## Known limitations

- All data is simulated; imports are validated and processed in the browser and are **not saved**.
- Forecasts and battery-health estimates are illustrative heuristics, not trained models.
- State resets when the browser session ends.
- Not yet tested with screen readers or on touch devices beyond responsive layout checks.
- The main JavaScript bundle is about 500 kB before compression.

## Contributing

1. Fork the repository and create a branch: `git checkout -b feature/my-change`
2. Install dependencies: `pnpm install`
3. Make your change, then run:
   ```bash
   pnpm exec tsc --noEmit -p .
   pnpm build
   pnpm format
   ```
4. Commit with a clear message and open a pull request describing what changed and why.

Conventions: components are default exports where they own a file; use Tailwind utilities for styling;
put global CSS and theme tokens in `src/index.css`; keep simulation logic in `src/lib/sim.ts`, and keep UI
components free of data-fetching (go through `src/services`).

## License

No license has been chosen yet. Until one is added, all rights are reserved by the authors.
Add a `LICENSE` file (for example [MIT](https://choosealicense.com/licenses/mit/)) before publishing
if you want others to use or contribute to the code.
