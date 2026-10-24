# Problem statement

## One sentence

Fleet operators cannot coordinate vehicle readiness, charger capacity, and site-energy trade-offs in one explainable workflow because the relevant operational signals are distributed across separate views and often incomplete. If this were solved, operators could compare charging decisions before departure and understand the constraints behind each recommendation.

## Who is affected?

The primary user is an EV fleet or depot operator preparing multiple vehicles for service. Drivers are secondary users who need to know whether a selected vehicle will reach its target state of charge and which compatible charger is available.

## Why it matters

A vehicle missing its departure target can disrupt service. An incompatible charger or ignored power limit can make a plan infeasible. Solar, storage, grid limits, tariffs, carbon assumptions, and battery condition create trade-offs that are difficult to inspect when they are shown separately.

## How EVOS responds

EVOS connects readiness, scheduling, energy dispatch, battery estimates, sustainability calculations, alerts, scenario comparison, and decision rationale in one deterministic prototype. It labels simulated, calculated, modelled, historical, and unavailable values instead of claiming physical telemetry.

## Scope boundary

EVOS currently has no physical charger control, no real-time telemetry, no authentication, no persistent fleet database, and no Exasol Personal integration. The Exasol requirement remains blocked until a real database workflow is implemented and verified.
