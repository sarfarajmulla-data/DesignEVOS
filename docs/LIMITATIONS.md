# Limitations and future work

## Current limitations

- Fleet, charger state, SoC, telemetry, scheduler operations, and energy operations are simulated or calculated.
- ACN-Data is historical, not real-time physical telemetry, and is not joined to EVOS IDs.
- No Exasol Personal integration exists.
- No persistent database, authentication, authorization, tenancy, or audit log exists.
- Fleet edits are browser-session state; backend cache is process-local.
- No OCPP, MQTT, meter, inverter, or charger-control integration exists.
- Forecasts and battery-health outputs are deterministic estimates.
- Tariff and carbon values need verified server-side configuration.
- Deployment availability was not independently rechecked in this pass.

## Future work

1. Implement and verify Exasol Personal as the analytical data platform using public/synthetic data.
2. Add schema/load SQL, query tests, backend result contracts, and UI evidence.
3. Persist fleet, sessions, decisions, scenarios, alerts, and audit records.
4. Add authentication, authorization, observability, and safe telemetry/control boundaries.
5. Capture genuine screenshots, create the final binary deck, and record the demo video.
