# Deployment

The repository contains Vercel routing for a Vite frontend and a serverless-compatible Node backend. `vercel.json` routes `/api/*` to the backend service and other paths to the frontend.

## Prerequisites

- Vercel project connected to the repository
- Frontend build variables configured
- Backend secrets configured server-side
- `CORS_ORIGINS` set to the deployed frontend origin
- Independent checks of `/` and `/api/v1/health`

## Variables

```dotenv
VITE_BACKEND_URL=<deployed-backend-or-same-origin>
VITE_SITE_LATITUDE=28.6139
VITE_SITE_LONGITUDE=77.209
ACN_DATA_API_KEY=<server-side-secret-if-used>
ACN_DATA_BASE_URL=https://ev.caltech.edu/api/v1
NASA_POWER_BASE_URL=https://power.larc.nasa.gov/api/temporal
PVGIS_BASE_URL=https://re.jrc.ec.europa.eu/api/v5_3
CORS_ORIGINS=<deployed-frontend-origin>
PORT=8787
```

Do not put secrets in `VITE_*` variables or commit `.env` files. The current backend is stateless, unauthenticated, non-persistent, and has no physical telemetry/control integration.

## Verification

```text
GET /
GET /api/v1/health
GET /api/v1/live/parameters
```

Deployment availability was not independently verified during this documentation pass. There is no Exasol deployment or database configuration in the current repository.
