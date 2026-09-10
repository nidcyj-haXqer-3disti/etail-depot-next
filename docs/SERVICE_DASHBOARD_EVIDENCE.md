# Direct service dashboard delivery evidence

Branch `feature/EDN-003-foundation`; baseline `f4e0085837cb52cf794cee284384ce232b71573a`. Core implementation `33152c7be9c473f208fe2a3c4c9ab453780541a2`; permission/refresh/recovery refinement `b8579b6a8c3bc67480f757df4290d27acd6373ac`; test adaptation `313aab5618237378d397eadae5a7fcafcd76157d`, followed by the explicit primary browser-fixture correction `1dd28f3` and saved-request navigation correction `3689ea7c2b74ded6f0c8e097a4d0417d7558eab3`. Application source is unchanged after `b8579b6`. [Design](SERVICE_DASHBOARD_DESIGN.md) governs the correction; prior [D47 evidence](TWO_SERVICE_EVIDENCE.md) remains historical.

## Scope and environment

Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, TypeScript 6.0.3, PostgreSQL 18.6. The isolated `etail_depot_next_test` and preserved `etail_depot_next` preview run on loopback port 55439 as `etail_local`. Real money remains disabled. This is a local implementation; no hosted database, Identity tenant, visitor access, remote branch, deployment or external notification changed.

Both service entrances are now dashboards rather than old account directories. Named primary profile metadata links Cardholder records without merging their authority or financial ownership. Merchant creation and Cardholder access are independent; named submerchants use one canonical relationship writer. The single card form, issuance command, channel workflow, invitation lifecycle and immutable ledger remain in use.

## Preserving migrations

Private snapshots are ignored, directory mode 0700 and file mode 0600. Each comparison covers all original row/column values in every original public table. Snapshot counts differ because deliberate test activity occurred between migrations.

| Migration | Database | Original rows/tables unchanged | Private snapshot SHA-256 |
|---|---|---|---|
| 12: Cardholder profile/default | Test | 184,175 / 51 | `f6861a5c1b4113b3b39c9029a916ea398fe810ab9a1dda8a597f846c6162e83c` |
| 12 | Preview | 361 / 51 | `304c73a67ec198aa6de68a2dda2a266107b03e203d5cb9382c3c3970efcfa8af` |
| 13: independent named submerchants | Test | 190,555 / 52 | `56dcc292f4d1338e2acfca441ae9fdf60748c5c12e5019163be52c16766ffd7c` |
| 13 | Preview | 363 / 52 | `f9f4c3051979a2ba445961f68be1d698bf4faa478b9c9aed2daee503ad29d15b` |

All four migrate commands and four preservation comparisons exited 0. Receipts are under ignored `artifacts/service-dashboard/` (`migrate-*`, `preserve-*`). Applied migrations were never edited. Schema generation after application reported no changes.

## Research and review

The refreshed [Cardholder research](research/amex/CARDHOLDER_DASHBOARD_ROLES.md) includes 14 references, five visually inspected official illustrations and a sampled historical independent video. [Merchant research](research/amex/MERCHANT_DASHBOARD_ROLES.md) records ten scoped sources and distinguishes current text from dated portal guides, earlier observed screenshots and video metadata. This is evidence about public experience and documented responsibilities, not access to private Amex internals or measured product parity.

Focused Cardholder PostgreSQL tests passed 9/9, including grant nonunion, exact legacy card/request/activity routing, forged IDs, persisted default without fallback, report/export denial after revocation and independent Merchant/Cardholder roles. Focused Merchant tests passed 18/18 before the complete suite. Review found and fixed the canonical holder check and three primary-governance checks consulting Merchant role instead of independent card access. A second review found stale merchant React state after a new server projection. The dashboard now renders server props directly; refresh preserves child creation attempts while showing current authorized data.

## Candidate results and corrections

The first complete database/concurrency run passed 198/199; the remaining test expected the superseded one-submerchant-per-controller restriction. The first API run passed 20/22; one test expected a card invitation validation result from a newly created merchant that now correctly has no card access, and another incorrectly assumed the fictional viewer had no independently owned primary card profile. Assertions were corrected to verify current per-service boundaries, not to erase independent authority.

The first production build passed. The first lint run exposed JSX construction inside a new business-details try/catch; data loading and rendering were separated. The contract inventory test was updated from 12 to 13 card/workspace operations for the new authenticated dashboard read. Generated schemas include the optional customer-service identity and strict pagination input.

The first 24-view visual/axe capture covered primary/secondary dashboards, card details and merchant payments at 1440, 390 and 320 pixels. No horizontal overflow occurred. Six dashboard views shared one footer contrast finding (4.18:1); the text color was darkened. All merchant and card-dialog views passed those axe checks. The final recapture passed all 24 views, with no axe violations or horizontal overflow.

The complete browser candidate on `33152c7` passed **112 cases**, with **four failures and six intentional project exclusions**, exit 1 (`browser-candidate.log`). All 15 accessibility cases passed. Two desktop/mobile failures used an overly exact textbox name that omitted its helper text; the locator now identifies the actual single enabled funds field. Two exposed a residual Cardholder shell on invalid legacy merchant selection; the error stays in Merchant services with no selected substitute and returns to Merchant overview. The complete suite is rerun on the corrected application and test revisions, rather than treating the candidate as complete. Original failure contexts are retained under `browser-candidate-contexts/`.

The rebuilt browser run was stopped after **39 passed / two failed / one interrupted / one skipped / 79 unrun**, exit 130 (`browser-verified-final.log`). Both failures traced to the shared browser fixture creating a named primary with only the default Cardholder role, rather than explicit Cardholder OWNER. The fixture now declares that authority independently; application permissions were not weakened. The interruption occurred in an unrelated passing merchant-helper journey during cleanup. Failure contexts are retained in `browser-governance-contexts/`.

## Final executed checks

The final complete domain run passed **393/393 across 60 files**, exit 0, in `artifacts/service-dashboard/domain-verified-final.log`. Command: `node tools/run-with-database.mjs vitest run`; the Vitest configuration includes unit, integration, concurrency and contract tests. After the Cardholder governance correction, two older fixtures required explicit Cardholder OWNER setup; the 391/393 diagnostic run and corrected full pass are retained. Original independence/merchant-consent assertions remain unchanged.

The completed browser run on `1dd28f3` passed **114 cases**, with **two failures and six intentional project exclusions**, exit 1 (`browser-complete-final.log`). Both failures were the desktop/mobile saved-card journey reloading before the Close action's asynchronous route replacement completed. The test now waits for the clean dashboard URL and hidden dialog, reloads, and verifies persisted request details, exact funding, single issuance and exact issued-card routing. The targeted desktop/mobile rerun passed **2/2**, exit 0 (`browser-saved-card-final.log`), on the test content committed as `3689ea7`. This verifies **all 116 distinct browser cases across the completed run and focused rerun**, not a single uninterrupted green run. Failure contexts remain in `browser-close-navigation-contexts/`.

Browser commands: `node tools/run-with-database.mjs playwright test`, then `node tools/run-with-database.mjs playwright test tests/browser/services-workspace.spec.ts --project=desktop --project=mobile -g 'primary dashboard uses'`. Retries were disabled. No application permissions or production code changed for this final test correction.

| Check | Result | Receipt under `artifacts/service-dashboard/` |
|---|---|---|
| Complete domain/database/concurrency/contracts | 393 passed, exit 0 | `domain-verified-final.log` |
| Browser API/desktop/mobile/accessibility | All 116 distinct cases verified across 114-pass complete run and 2-pass focused rerun; six intentional project exclusions | `browser-complete-final.log`, `browser-saved-card-final.log` |
| Final responsive visual/axe capture | 24 views passed at 1440/390/320px; no violations or overflow, exit 0 | `visual-verified-final.log`, `visual-checks.json`, `screenshots/` |
| Production Next + offline Netlify packaging | Passed, exit 0, source/test revision `313aab5` | `netlify-build-verified-final.log` |
| Whole-project lint / typecheck | Passed, exit 0; final test file lint and full typecheck also passed | `lint-verified-final.log`, `typecheck-verified-final.log`, `saved-card-lint-final.log`, `typecheck-closeout.log` |
| Architecture ownership | Passed, exit 0; canonical one-form/command/ledger ownership remains | `architecture-verified-final.log` |
| Source security | Passed, exit 0 | `security-verified-final.log` |
| Dependency advisory audit | No known vulnerabilities, exit 0 | `dependency-audit.log` |
| Schema drift | No changes, exit 0 | `schema-drift.log` |
| Handoff helpers | 35 passed, exit 0; not a recertification of original package hashes | `handoff.log` |

The build command was `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 node node_modules/netlify-cli/bin/run.js build --offline --context production`. Static commands were `pnpm lint`, `pnpm typecheck`, `pnpm test:architecture`, `node tools/verify-security.mjs`, `pnpm audit --audit-level=high`, `pnpm db:generate` and `pnpm test:handoff`. Database/build/browser commands used authorized loopback/process access. No automatic approval review rejected an action in this task.

The final 24-view capture used the preserved preview database on temporary loopback port 3101 while browser tests exclusively used 3100 and the test database. Desktop Cardholder and mobile Merchant/dashboard/detail screenshots were visually inspected after recapture. The temporary server was stopped; `pnpm preview:fixture` restored the preserved preview on port 3100 with all 13 migrations verified and none newly applied (`preview-final.log`). The existing in-app tab was opened directly to `/cardholder-services`. No completion percentage or platform milestone is awarded by these local checks.

## Remaining limits

Dashboard windows disclose 30-card pages, latest 25 card transactions, 20 unfinished requests, 12 merchant payments and six transfers. The existing reports, support and People tasks retain exact stored scopes. A review can affect multiple named cards in the same scope; this is displayed. Cross-scope grant merging, global holder revocation and service-wide reports are not added. Primary responsibility transfer, live verification/processing, real cards, official bills, gateway settlement/reconciliation, guardian funding and unresolved commercial economic writes remain separate platform work.
