# Run guide

1. Start the backend on port `8787`.
2. Start Vite on port `8443`.
3. Open `http://localhost:8443/`.
4. Enter Manager at `/#/app/overview` or Driver at `/#/app/driver`.

## Manager walkthrough

- **Overview:** readiness, active sessions, alerts, and energy context.
- **Fleet:** search, filter, sort, add, and remove browser-local vehicles.
- **Scheduler:** compare three deterministic strategies.
- **Explainability:** inspect rationale, score components, alternatives, and constraints.
- **Energy/System:** inspect solar, storage, grid, reserve, and charger flows.
- **Battery/Forecasts/Sustainability:** inspect estimates, ranges, energy mix, cost, and emissions.
- **Maintenance:** toggle documented simulated faults.
- **Scenarios/Experiments:** compare what-if assumptions and strategies.
- **Datasets:** inspect source status, ACN evidence, import validation, and limitations.

## Driver walkthrough

Open `/#/app/driver`, select a vehicle, then review SoC, target, projected completion, departure readiness, tariff context, and compatible chargers. This view does not control physical equipment.

## API checks

```bash
curl http://localhost:8787/api/v1/health
curl "http://localhost:8787/api/v1/live/parameters?latitude=28.6139&longitude=77.209&date=20261011&pvKWp=100"
```

The realtime and SSE routes are simulated.
