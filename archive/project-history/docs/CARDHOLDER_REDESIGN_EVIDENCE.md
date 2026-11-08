# Cardholder redesign — D66 evidence

11 September 2026. Branch `codex/cardholder-experience`, application base `eef0bc03342a4730397b6ebb77ca5227f53076fe` / tree `bd12163a6d9c580deb9fc829c12b27bc90ea9b4f`. [Design contract](CARDHOLDER_EXPERIENCE_REDESIGN.md). This document records a redesigned local sandbox, not hosted release acceptance or a complete Amex-equivalence claim.

## Implemented scope

- Selected own-card home with balance, activity, direct freeze and distinct purchase/control tasks; clearly named oversight for managed cards. Restricted own cards show the actual server-owned reason instead of implying that they belong to someone else.
- Your cards / Cards you manage directory with exact authorized counts and persistent ownership/search filters before server pagination. Personal card ownership works across separate primary relationships; secondary results stay private.
- Primary people directory with named cards, ordinary invitations, optional access restrictions, actual grants reviewed before saving, accepted-without-card next steps and existing history/revocation workflows.
- Durable request search and status views, existing single Add card flow and exact issued-card links. Activity, reports, notification preferences and support retain card context. Uncertain purchases retain their command identity while closing or switching tasks is blocked.

No migration, seed, reset, dependency, Identity configuration, provider, card issuance adapter, ledger or financial command changed. PostgreSQL checks use the isolated `etail_depot_next_services_test` database; the preserved preview is `etail_depot_next_services_preview`. Both are owned local PostgreSQL on loopback55439. Real money remains disabled.

## Checks

Environment: macOS, bundled Node24.19.0 / pnpm11.19.0, native PostgreSQL18.6, production Next16.3.4 on loopback3100. Raw logs are under `artifacts/cardholder-redesign/` (ignored local evidence).

| Check | Result | Evidence |
|---|---|---|
| Full unit and adapter/contracts | 361 passed, exit 0 | `unit-contracts.log` |
| Full PostgreSQL integration | 176 passed across 35 files, exit 0 | `integration.log` |
| Full concurrency | 35 passed across 11 files, exit 0 | `concurrency.log` |
| Scoped security source and real-money guards | Passed | `security.log` |
| Current dependency advisories | No known vulnerabilities, exit 0 | `dependency-audit.log` |
| API, desktop, mobile and accessibility | All110 distinct cases pass: final full run 108/110, then corrected accessible-selector run 4/4, exit 0; no application change between these runs | `browser-final.log`, `browser-routing-corrected.log` |
| Lint, typecheck, architecture | Passed, exit 0 | `lint-routing-final.log`, `typecheck-routing-final.log`, `architecture-final.log` |
| Production Next build | Passed, exit 0 | `build-routing-final.log` |
| Source-only handoff helpers | 35 passed, exit 0 | `handoff.log` |
| Offline Netlify package, exact sandbox site | Passed, exit 0; no deploy | `netlify-build-final.log` |
| Preserved-preview visual/reflow/axe/runtime review | 87/87 screens, zero violations/overflow/runtime errors; exit 0 | `visual-final/checks.json`, `visual-capture.log` |

The initial source parse typo, copy-drift assertions and routing corrections remain in their original logs. Initial browser run of 106 cases had four failures in two tests expecting the previous wording; corrected tests keep their invitation and independent-freeze assertions. The 110-case run then exposed a new test using a text-label locator for a select; the accessibility tree showed the correct Card combobox and selected value. Replacing that locator with its accessible role allowed all four legacy-activity cases to pass, without an application change. The first combined security command passed source checks but could not resolve npm from the restricted network; the authorized advisory-only retry passed. Initial offline packaging could not write the CLI's local preferences file; the authorized identical-command retry passed. No checks were skipped or converted into green stubs.

The read-only visual run at 14:01:46–14:02:15 UTC covered own/managed home, all/own/managed/search card directories, controls/purchase forms, primary people/person/invitation/requests, both roles' activity/reports/help/preferences and Merchant overview/payments at 1440/390/320px. Representative screenshots were visually inspected. All 19 authorized projections stayed identical after excluding only documented read timestamps; all 597 source files stayed identical during capture (fingerprint `a43a134e4e9364988325192d3661625a9bee8a9cba8a2375f9392ff21c4fabc9`). Only fixed fictional sign-in sessions were written. The marked preview restarted through its read-only preparation check, without migrations or seeding.

Application changes were frozen for the final 110-case browser acceptance and 87-screen capture; subsequent changes are test-selector and documentation/receipt edits. The final commit/tree and GitHub review receipt are recorded in the task closeout; local logs are not uploaded as customer artifacts. D65 GitHub workflow 34595339056 was rechecked read-only and completed successfully; this is evidence for D65's exact SHA, not D66 CI.

## Release boundary

The tested application is local `2d16c7010a22a68b3032160547fcb6a1d3555190`, published as GitHub `5493da9f471038a1638a838c84238014c5295033`; both have exact tree `91caaad696e3a67ea3a92b69ad660bf6e34e3de8`. All 30 uploaded blobs were verified against local Git object hashes before publishing branch `codex/cardholder-experience` and [draft PR11](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/11). This review is stacked on PR10 and changes only D66 plus the preserved D65 publication receipts. The local preview was reloaded and its rendered Your cards / Cards you manage grouping verified. The receipt-only follow-up changes documentation; no D66 CI completion was available at the initial publication check.

D65's pushed application `3deb0d85269c84792b0f10538bff5c01a197eaa4` remains in draft PR10. Automatic approval review previously rejected changing Netlify's production source from `main` to that feature branch. The requested explicit approval has not arrived. D66 does not change production source, visitor access, hosted schema or data, merge a PR, or claim a new deployment. The local redesign can be reviewed independently.
