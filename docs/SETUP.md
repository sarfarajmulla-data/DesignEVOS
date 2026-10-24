# Setup guide

This guide reproduces the existing application. It does not provide Exasol setup because the repository currently has no Exasol integration.

## Prerequisites

- Node.js 22+
- pnpm
- Git
- Network access for optional upstream sources

## Install

```bash
git clone https://github.com/sarfarajmulla-data/DesignEVOS.git
cd DesignEVOS
pnpm install
```

## Frontend environment

Create `.env.local`:

```dotenv
VITE_BACKEND_URL=http://localhost:8787
VITE_SITE_LATITUDE=28.6139
VITE_SITE_LONGITUDE=77.209
```

Only browser-safe values belong in `VITE_*` variables.

## Backend environment

Create `backend/.env` from `backend/.env.example`:

```dotenv
ACN_DATA_API_KEY=replace_me_locally
ACN_DATA_BASE_URL=https://ev.caltech.edu/api/v1
NASA_POWER_BASE_URL=https://power.larc.nasa.gov/api/temporal
PVGIS_BASE_URL=https://re.jrc.ec.europa.eu/api/v5_3
CORS_ORIGINS=http://localhost:8443,http://127.0.0.1:8443
PORT=8787
DEFAULT_TARIFF_INR=
GRID_CARBON_G_PER_KWH=
TARIFF_PROFILE_JSON=
CARBON_PROFILE_JSON=
```

Keep `backend/.env` untracked.

## Start

```bash
node --env-file=backend/.env backend/server.mjs
```

In another terminal:

```bash
pnpm run dev -- --host 0.0.0.0 --port 8443
```

Open `http://localhost:8443/`. Windows users can run `run-local.bat`.

## Exasol setup

Not available in this repository. No Exasol Personal connection, schema, SQL, or initialization script exists. Do not invent an Exasol command; implement and verify that integration before claiming ExaThon readiness.
