# D73 delivery evidence

12 September 2026. Implements the [owner, cards and terminals contract](OWNER_CARDS_TERMINALS_DESIGN.md). The user explicitly authorized implementation and deployment. Local base `4fe3d06d671f7a34f6158b418608dda5d88d6d71`, branch `codex/group-money-cards-terminals`. Exact published commit, tree, review, workflow and deployment receipts belong in `artifacts/d73-publication.json` and the release pull request.

## Implemented behavior

- One owner-controlled Card money account, unlimited named cards without a product count cap, independent total card allowances and own-card access. The owner can operate without a personal card. Refunds replenish money without renewing gross allowance usage.
- One merchant and Merchant money account with flat named terminals, seven presentation channels and fixed owner-issued terminal access. Terminal users cannot settle, refund, withdraw, change account settings or delegate. Actual payment disputes have scoped responses and separately assigned review; case outcomes do not silently move money.
- Separate money-purpose ledger positions, atomic card/pool checks, settlement credit, saved add/withdraw reviews, explicit withdrawal processing and exact receipt/history links. Pending reservations cannot be spent again. Every retry rechecks authority and retains its original operation.
- Landing, product/help pages, profile, invitations and dashboards use the same ownership model. One Sandbox badge remains. Retired hierarchy routes, monthly per-person limit routes, permission-matrix writers and disconnected payment simulators were removed; historical migrations and posted records remain.

## Verification

Runtime: macOS, Node24.19.0, pnpm11.19.0, Next16.3.4, TypeScript6.0.3, native PostgreSQL18.6. Database suites use only the marked `etail_depot_next_services_test`; preview verification uses only the marked `etail_depot_next_services_preview`. Database/browser commands run through `node tools/run-with-database.mjs`. Browser batches target the known built test server on loopback3100 through a temporary config; CI retains the ordinary no-server-reuse config.

| Check | Result / evidence |
|---|---|
| `pnpm contracts:generate`, `pnpm lint`, `pnpm typecheck` | Exit0; `d73-contracts-final.log`, `d73-lint-final.log`, `d73-types-final.log` |
| `vitest run tests/unit tests/contracts` |414 passed; `d73-unit-contracts-final.log` |
| `vitest run tests/integration tests/concurrency` |258 tests across59files passed; `d73-release-database-final.log` |
| Browser inventory |215 distinct cases in39files; `d73-browser-inventory.txt` |
| Card desktop/mobile |52 distinct cases pass across baseline and corrected reruns; final8 affected journey cases pass in `d73-card-css-browser.log` |
| Merchant desktop/mobile |56 baseline plus2 navigation cases pass; `d73-merchant-browser-final.log`, `d73-merchant-navigation-rerun.log` |
| Merchant accessibility |2 support plus4 operations cases pass; `d73-merchant-a11y-final.log`, `d73-merchant-operations-a11y-final.log` |
| General desktop/mobile/accessibility |54 distinct cases pass; `d73-general-browser-verified.log`, `d73-general-help-final.log` |
| Root fresh-service, money and hosted-style journeys |34 distinct cases pass across `d73-root-focused.log` and corrected4 merchant cases in `d73-hosted-workspace-accepted.log` |
| Retained historical deposit browser recovery |2 desktop/mobile cases passed with the original malformed-success/exact-retry/event/journal assertions; `d73-historical-deposit-browser.log` |
| API and isolated email/session |9 API and26 email cases pass; `d73-api-browser.log`, `d73-email-browser.log` |
| Architecture and source security |307 source files,94 routes,60 typed writer sites; security527 files and6 actual real-money guard cases pass |
| Dependency audit |No known vulnerabilities; `d73-dependency-audit.log`; initial restricted-network failure retained separately |
| Production and Netlify package |Exit0; `d73-netlify-build-final.log` |
| Final responsive capture |18 Cardholder plus15 Merchant states at1440/390/320px; axe/reflow pass, card dialog actions in bounds; `d73-card-visual-final-inspected.log`, `d73-merchant-visual-final.log` |
| Handoff helpers |Source-scoped wrapper35 passed; original historical direct commands fail dependency JSONC traversal and are retained as failures in their own logs |

## Corrections found during acceptance

Final review corrected receipt/account identity checks, oversized withdrawal correction after a definitive rejection, revocation while a terminal is paused, and historical invitation access expiry. Unknown responses retain the exact original request; denied recovery hides private details. Mobile review buttons and allowance fields were real layout findings and were fixed before the final package. Navigation reveals the active/focused item without changing URL or vertical scroll.

Initial browser failures included obsolete monthly/submerchant labels, old payment-field expectations, ambiguous headings and starting a Settings interaction before navigation completed. Corrected tests retain financial and privacy assertions, including an explicit read of the exact Merchant money account after settlement. No retry setting or broad timeout hides these failures. Original logs remain beside corrected evidence.

## Database proof and release limits

All17 migrations apply on a fresh isolated schema, the canonical seed reaches COMPLETE, and repeat preparation preserves every row hash. The D73 migration configuration is permitted by the empty-seed guard only after exact row/column/immutable-trigger validation. An altered configuration is rejected. See `d73-fresh-seed-evidence.md` and `d73-fresh-seed-proof.log`.

Preserved preview reconciliation verifies14 prior journals and28 prior entries unchanged, balanced cutover journals, zero old spendable buckets and exact new balances (Card46400cents, Merchant4800cents). Logs: `d73-preview-before.log`, `d73-preview-migration.log`, `d73-preview-after.log`, `d73-preview-verification.log`. Historical pending-deposit migration replay and current commands pass without rewriting ledger history.

These checks establish the requested sandbox behavior, not real financial services, independent usability research or measured Amex parity. Actual external delivery, live issuing/acquiring/bank rails, partial refunds, financial chargebacks, reserves and broader commercial/provider scope remain separate. No real credentials, customer imports or visitor-setting changes are part of this release. Hosted migration and exact-revision deployment must be verified before claiming it is live.

## Publication review correction

Automatic approval review required retaining the original deposit-processing browser recovery test in addition to the new withdrawal test. The original check is preserved, with setup adapted to a unique schema in the marked test database: apply the actual historical migrations, create guard-valid fictional historical records, apply D73 unchanged, and exercise the current built application on an independent ephemeral loopback server. No current reservation guard is disabled, no production writer is reintroduced, and the shared3100server/public schema stay unchanged. Both desktop/mobile cases pass. TypeScript, lint, architecture and security are checked again; no detector exemption is broadened.

The earlier migration-publication rejection was resolved after inspecting immutable archives and exact historical ledger preservation, followed by the user's renewed instruction to continue and deploy. No blocked action was sent through a different tool. The first migration has one existing blank line at EOF reported by staged whitespace checking; its applied checksum is intentionally preserved. This cosmetic warning is not a database or application-test failure.

## First GitHub CI correction

PR16 run34684370525 checked the exact published tree and passed402 unit tests, then passed219 of220integration cases. The32-card pagination case exceeded its15-second test budget without an assertion mismatch; later workflow stages were skipped. Its setup had reloaded the entire growing workspace after each card creation. The fixture now exposes the same canonical start/update/submit lifecycle without that unused full-workspace read, while the ordinary card helper retains its existing read/purchase behavior. All32-card pagination/search/holder-privacy assertions and the15-second timeout remain. The complete8-case dashboard file, focused lint and TypeScript pass locally; final full-suite and exact-head CI results are retained in the publication receipt. No application or schema change is part of this correction.
