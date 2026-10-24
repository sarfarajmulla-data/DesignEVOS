# Data sources and provenance

| Source/category | Current use | Provenance |
|---|---|---|
| ACN-Data | Historical charging sessions and normalized baseline | Server API when credential is configured |
| NASA POWER | Solar/weather point observations | Server API; effective-date fallback is reported |
| PVGIS | PV performance series | Modelled/historical API |
| Fleet and chargers | Demo scheduling and UI records | Illustrative/simulated |
| Tariff and carbon | Cost and emissions assumptions | Environment-configured or deterministic fallback |
| Browser imports | CSV/JSON parse, map, and validate preview | Local only; not persisted |

The project is intended to use public or synthetic data only. Verify attribution and terms before submitting. ACN data is not physical telemetry and is not mapped to EVOS vehicle identities.

## Exasol status

No Exasol driver, SQL, schema, loader, connection configuration, query endpoint, or result is present. Therefore no Exasol-backed metric or performance claim can be made. This is tracked as a mandatory blocker in [`submission/EXATHON_CHECKLIST.md`](submission/EXATHON_CHECKLIST.md).

Keep credentials server-side in `backend/.env` or deployment secret storage.
