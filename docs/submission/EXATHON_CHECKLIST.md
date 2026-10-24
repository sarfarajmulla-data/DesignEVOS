# ExaThon India 2026 submission checklist

Audited against the official event page on October 24, 2026. The page specifies Exasol Personal as the project data platform, a public GitHub repository under Apache 2.0 or MIT, public or synthetic data, a problem statement, PDF/PPT pitch deck, demo video of three minutes maximum, README, deployment/run documentation, and license.

| Requirement | Status | Evidence | Remaining action |
|---|---|---|---|
| Problem statement | PASS | `docs/PROBLEM_STATEMENT.md` and README use the same person-first statement. | Recheck after final application changes. |
| Public repository | PASS | Repository is public. | Submit repository URL. |
| Exasol Personal used as data platform | BLOCKED | No Exasol code, SQL, schema, connection, endpoint, or result evidence found. | Implement, test, document, and demonstrate a real Exasol Personal workflow. |
| Public/synthetic data only | PARTIAL | Existing sources and model data are documented. | Confirm final assets and data contain no proprietary material. |
| Pitch deck PDF/PPT | BLOCKED | Editable [`PITCH_DECK.md`](PITCH_DECK.md) and [`PITCH_DECK_OUTLINE.md`](PITCH_DECK_OUTLINE.md) exist; binary deck is not present. | Capture screenshots, add Exasol evidence, export PDF/PPT, and visually review it. |
| Demo video ≤3 minutes | BLOCKED | `DEMO_SCRIPT.md` exists; video does not. | Record, time, review, and upload the video. |
| Clean README | PASS | Root README includes setup, usage, architecture, limitations, and deliverables. | Render-check links after assets are added. |
| Setup and run guide | PASS | `docs/SETUP.md` and `docs/RUN_GUIDE.md`. | Use for recording and reviewer reproduction. |
| Deployment instructions | PASS | `docs/DEPLOYMENT.md`. | Verify actual deployment before submission. |
| MIT/Apache-2.0 license | PASS | Root `LICENSE` is MIT. | Confirm copyright holder. |
| Genuine screenshots | BLOCKED | No screenshots found. | Capture current app screens without secrets. |

## Consistency audit

- README and problem statement use the same person-first problem.
- Architecture describes the actual React + Node runtime.
- Exasol is marked absent everywhere, not presented as implemented.
- Demo script and deck source retain the same limitation until integration exists.
- Application source and runtime files were not changed.

**Decision: not submission-ready.** Exasol integration, binary pitch deck, demo video, and screenshots remain manual blockers.
