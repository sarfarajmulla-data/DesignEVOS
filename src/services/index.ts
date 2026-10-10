/**
 * EVOS data-access layer.
 *
 * The UI talks only to the interfaces in this file. With VITE_EVOS_API_URL set,
 * requests go to the EVOS REST API; without it the deterministic demo adapter is
 * used. A configured API is never silently replaced by simulated data on failure.
 */

import {
  simulate,
  compareStrategies,
  forecastSeries,
  deriveAlerts,
  sohTrend,
  CHARGERS,
  VEHICLES,
  DEFAULTS,
  type Assumptions,
  type SimResult,
} from "../lib/sim"

import { EXTERNAL_SOURCES } from "../data/catalog"

import type { Charger, Provenance, SourceRef } from "../data/contracts"

export const ALGORITHM_VERSION = "evos-demo-heuristic 0.3.0"

export const FORECAST_MODEL_VERSION =
  "profile-baseline 0.1 (not a trained model)"

export type BackendKind = "demo" | "evos"

export interface BackendStatus {
  kind: BackendKind

  connected: boolean

  configured: boolean

  message: string
}

const apiUrl = () =>
  (import.meta.env.VITE_EVOS_API_URL as string | undefined)
    ?.trim()
    .replace(/\/+$/, "")

export function backendStatus(): BackendStatus {
  const url = apiUrl()

  return {
    kind: url ? "evos" : "demo",

    connected: false,

    configured: Boolean(url),

    message: url
      ? `EVOS API configured at ${url}. Live data will be used when requests succeed.`
      : "No EVOS API configured. EVOS is using the local, deterministic demo model.",
  }
}

export class NotConnectedError extends Error {
  constructor(what: string) {
    super(
      `${what} is not connected. Set VITE_EVOS_API_URL or use the demo adapter.`,
    )

    this.name = "NotConnectedError"
  }
}

export class EvosApiError extends Error {
  readonly status?: number

  readonly endpoint: string

  constructor(endpoint: string, message: string, status?: number) {
    super(`EVOS API ${endpoint}${status ? ` (${status})` : ""}: ${message}`)

    this.name = "EvosApiError"

    this.endpoint = endpoint

    this.status = status
  }
}

type Json = Record<string, unknown>

const number = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback

const pct = (value: unknown) => {
  const n = number(value)

  return n >= 0 && n <= 1 ? n * 100 : n
}

const provenance = (value: unknown): Provenance => {
  const normalized = String(value ?? "").toLowerCase()

  if (normalized.includes("real") || normalized.includes("live")) return "real"

  if (normalized.includes("import")) return "imported"

  if (normalized.includes("forecast") || normalized.includes("predict"))
    return "forecast"

  if (normalized.includes("calcul")) return "calculated"

  if (normalized.includes("simulat")) return "simulated"

  if (normalized.includes("demo") || normalized.includes("illustr"))
    return "demo"

  return "not-connected"
}

const source = (value: unknown, datasetId: string): SourceRef => ({
  datasetId,
  provenance: provenance(value),
})

const asArray = (value: unknown): Json[] =>
  Array.isArray(value)
    ? value.filter((item): item is Json =>
        Boolean(item && typeof item === "object"),
      )
    : []

async function request<T>(
  base: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    })
  } catch (error) {
    throw new EvosApiError(
      path,
      error instanceof Error ? error.message : "Network request failed",
    )
  }

  const text = await response.text()

  let body: unknown = null

  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  if (!response.ok) {
    const detail =
      body && typeof body === "object" && "detail" in body
        ? String((body as Json).detail)
        : typeof body === "string"
          ? body
          : response.statusText

    throw new EvosApiError(path, detail || "Request failed", response.status)
  }

  return body as T
}

export interface VehicleService {
  list(a: Assumptions): Promise<SimResult["vehicles"]>
}

export interface ChargingSessionService {
  schedule(a: Assumptions): Promise<SimResult["sessions"]>
}

export interface BatteryHealthService {
  trend(vehicleId: string, a: Assumptions): Promise<ReturnType<typeof sohTrend>>
  rulEstimate(id: string): Promise<null>
}

export interface EnergyService {
  flows(a: Assumptions): Promise<SimResult["flows"]>
}

export interface ForecastingService {
  series(
    a: Assumptions,
    kind: "demand" | "pv",
  ): Promise<ReturnType<typeof forecastSeries>>
  validationMetrics(): Promise<null>
}

export interface SchedulerService {
  compare(a: Assumptions): Promise<ReturnType<typeof compareStrategies>>
}

export interface FaultMonitoringService {
  alerts(a: Assumptions): Promise<ReturnType<typeof deriveAlerts>>
}

export interface DatasetService {
  sources(): Promise<typeof EXTERNAL_SOURCES[number] & {
    status: "Not connected"
    lastImport: null
    records: null
    period: null
    quality: null
  }[]>
}

export interface SimulationService {
  run(a: Assumptions): Promise<SimResult>
}

export interface EvosOperations {
  health(): Promise<Json>

  readiness(): Promise<Json>

  status(): Promise<Json>

  scenario(): Promise<Json>

  updateScenario(payload: Json): Promise<Json>

  chargers(): Promise<Charger[]>

  energySummary(): Promise<Json>

  sustainability(payload: Json): Promise<Json>

  confidence(payload?: Json): Promise<Json>

  explainability(payload: Json): Promise<Json>

  evaluation(): Promise<Json>

  datasetStatus(): Promise<Json[]>

  importHistory(): Promise<Json[]>

  importDataset(name: string, source?: string): Promise<Json>
}

export interface Backend {
  vehicles: VehicleService

  sessions: ChargingSessionService

  battery: BatteryHealthService

  energy: EnergyService

  forecasting: ForecastingService

  scheduler: SchedulerService

  faults: FaultMonitoringService

  datasets: DatasetService

  simulation: SimulationService

  operations?: EvosOperations

  provenance: Provenance
}

const mockAdapter: Backend = {
  provenance: "simulated",

  vehicles: { list: async (a) => simulate(a).vehicles },

  sessions: { schedule: async (a) => simulate(a).sessions },

  battery: {
    trend: async (id, a) => {
      const v = simulate(a).vehicles.find((x) => x.id === id)
      if (!v) throw new Error(`Vehicle ${id} not found`)
      return sohTrend(v)
    },
    rulEstimate: async () => null,
  },

  energy: { flows: async (a) => simulate(a).flows },

  forecasting: {
    series: async (a, k) => forecastSeries(simulate(a), k),
    validationMetrics: async () => null,
  },

  scheduler: { compare: async (a) => compareStrategies(a) },

  faults: { alerts: async (a) => deriveAlerts(simulate(a)) },

  datasets: {
    sources: async () =>
      EXTERNAL_SOURCES.map((s) => ({
        ...s,
        status: "Not connected" as const,
        lastImport: null,
        records: null,
        period: null,
        quality: null,
      })),
  },

  simulation: { run: async (a) => simulate(a) },
}

function evosAdapter(base: string): Backend {
  const operations: EvosOperations = {
    health: () => request(base, "/health"),

    readiness: () => request(base, "/ready"),

    status: () => request(base, "/api/v1/health"),

    scenario: () => request(base, "/api/v1/scenario"),

    updateScenario: (payload) =>
      request(base, "/api/v1/scenario", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),

    chargers: async () =>
      asArray(await request(base, "/api/v1/chargers")).map((c) => ({
        id: String(c.charger_id ?? c.id),
        type: String(c.type).toUpperCase() === "DC" ? "DC" : "AC",
        ratedPowerKW: number(c.power_kw ?? c.rated_power_kw),
        connector: String(c.connector ?? "Unknown"),
        status: c.available === false ? "Fault" : "Available",
        source: source(c.provenance, "evos-chargers"),
      })),

    energySummary: () => request(base, "/api/v1/energy/summary"),

    sustainability: (payload) =>
      request(base, "/api/v1/sustainability/metrics", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    confidence: (payload = {}) =>
      request(base, "/api/v1/confidence/score", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    explainability: (payload) =>
      request(base, "/api/v1/explainability/decision", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    evaluation: () =>
      request(base, "/api/v1/evaluation/compare", {
        method: "POST",
        body: "{}",
      }),

    datasetStatus: async () =>
      asArray(await request(base, "/api/v1/datasets/status")),

    importHistory: async () =>
      asArray(await request(base, "/api/v1/datasets/import-history")),

    importDataset: (name, sourceName) =>
      request(
        base,
        `/api/v1/datasets/import?name=${encodeURIComponent(name)}${
          sourceName ? `&source=${encodeURIComponent(sourceName)}` : ""
        }`,
        { method: "POST" },
      ),
  }

  return {
    provenance: "real",

    operations,

    vehicles: {
      list: async () => {
        const rows = asArray(await request(base, "/api/v1/fleet/vehicles"))

        const demo = simulate(DEFAULTS)

        return rows.map((row, index) => {
          const local =
            VEHICLES.find((v) => v.id === row.vehicle_id) ??
            VEHICLES[index % VEHICLES.length]

          const p = provenance(row.provenance)

          return {
            ...demo.vehicles[index % demo.vehicles.length],
            id: String(row.vehicle_id ?? local.id),
            cls: local.cls,
            capKWh: number(row.battery_capacity_kwh, local.capKWh),
            soc: pct(row.state_of_charge),
            requiredSoC: local.requiredSoC,
            maxKW: local.maxKW,
            priority: "Normal" as const,
            source: {
              datasetId: "evos-fleet",
              provenance: p === "not-connected" ? "real" : p,
            },
          }
        })
      },
    },

    sessions: {
      schedule: async (a) => {
        const requests = simulate(a)
          .vehicles.slice(0, a.requesting)
          .map((v) => ({
            vehicle_id: v.id,
            requested_at: new Date().toISOString(),
            estimated_energy_kwh: v.energyRequiredKWh,
            priority: v.priority === "High" ? 3 : 1,
            duration_hours: Math.max(
              0.25,
              ((v.requiredSoC - v.soc) * v.capKWh) / 100 / Math.max(v.maxKW, 1),
            ),
            state_of_charge: v.soc * (v.soc <= 1 ? 100 : 1),
            charger_type: v.cls === "Utility cart" ? "ac" : "dc",
          }))

        const body = await request<Json>(base, "/api/v1/scheduler/plan", {
          method: "POST",
          body: JSON.stringify(requests),
        })

        const rows = asArray(
          (body as Json).recommended ?? (body as Json).algorithms,
        )

        return rows.map((row, index) => ({
          ...simulate(a).sessions[
            index % Math.max(1, simulate(a).sessions.length)
          ],
          vehicleId: String(row.vehicle_id ?? "unknown"),
          chargerId: String(row.charger_id ?? "backend"),
          powerKW: number(row.power_kw, 0),
          energyKWh: number(row.estimated_energy_kwh, 0),
          rationale: String(
            row.reason ?? `Scheduled by ${row.algorithm ?? "EVOS"}`,
          ),
          rank: index + 1,
        }))
      },
    },

    battery: {
      trend: async (id) => {
        const row = await request<Json>(
          base,
          `/api/v1/battery-health/${encodeURIComponent(id)}`,
        )
        const health = pct(row.health_percent)
        return Array.from({ length: 12 }, (_, m) => ({
          m,
          value: health,
          lo: Math.max(0, health - number(row.degradation_percent)),
          hi: Math.min(100, health + number(row.degradation_percent)),
        }))
      },
      rulEstimate: async () => null,
    },

    energy: { flows: async (a) => simulate(a).flows },

    forecasting: {
      series: async (a, kind) => {
        if (kind === "pv") return forecastSeries(simulate(a), kind)
        const row = await request<Json>(base, "/api/v1/forecasting/demand")
        const values = Array.isArray(row.values) ? row.values : []
        return values.map((value, t) => ({
          t,
          observed: undefined,
          forecast: number(value),
          lo: number(value) * 0.9,
          hi: number(value) * 1.1,
        }))
      },
      validationMetrics: async () => null,
    },

    scheduler: { compare: async (a) => compareStrategies(a) },

    faults: {
      alerts: async () => {
        const rows = asArray(await request(base, "/api/v1/maintenance/alerts"))
        return rows.map((r, time) => ({
          id: String(r.alert_id),
          severity: (String(r.severity ?? "medium").toLowerCase() === "high"
            ? "Critical"
            : String(r.severity ?? "medium").toLowerCase() === "low"
              ? "Info"
              : "Warning") as "Critical" | "Warning" | "Info",
          time,
          asset: String(r.vehicle_id ?? "Fleet"),
          title: String(r.kind ?? "Maintenance alert"),
          detail: String(r.message ?? ""),
          category: "Battery" as const,
        }))
      },
    },

    datasets: {
      sources: async () =>
        EXTERNAL_SOURCES.map((s) => ({
          ...s,
          status: "Not connected" as const,
          lastImport: null,
          records: null,
          period: null,
          quality: null,
        })),
    },

    simulation: {
      run: async (a) => {
        const row = await request<Json>(base, "/api/v1/simulations/run", {
          method: "POST",
          body: JSON.stringify({
            scenario_name: "evos_frontend",
            horizon_hours: 24,
            demand_kwh: 250,
            renewable_kwh: 180 * a.solarMult,
            fleet_size: a.requesting,
            timestep_minutes: 60,
            grid_import_limit_kw: a.gridLimitKW,
            battery_capacity_kwh: a.storageKWh,
            battery_reserve_percent: a.storageStartPct,
            charger_count: CHARGERS.length,
            charger_power_kw: 7.4,
          }),
        })

        const local = simulate(a)

        return { ...local, provenance: provenance(row.provenance) } as SimResult
      },
    },
  }
}

export function getBackend(): Backend {
  const url = apiUrl()

  return url ? evosAdapter(url) : mockAdapter
}

export const chargerCount = CHARGERS.length
