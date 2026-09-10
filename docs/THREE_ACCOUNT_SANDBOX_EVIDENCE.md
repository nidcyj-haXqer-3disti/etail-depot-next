# Three-account sandbox evidence

Reviewed **9 September 2026**. This record covers the local PERSONAL / HOUSEHOLD / MERCHANT redesign described in [THREE_ACCOUNT_SANDBOX_DESIGN.md](THREE_ACCOUNT_SANDBOX_DESIGN.md). It preserves unsuccessful runs and the narrower reruns that followed them. It does not certify all original workflows, live financial readiness or a public release.

## Source and environment

- Recorded candidate: [`c5a135c27caef248ab51e8774bc40ae1b3488d17`](../artifacts/three-account-redesign/source-sha.txt). Final application refinement: `829d05c7928fc563a4ac8e174003f58fcf2f54d5`, on local branch `feature/EDN-003-foundation`. It adds Merchant-only administration presentation, the 320-pixel link fix, reusable preview channels and two final visual corrections. Domain/browser runs below span these candidates; the final visual build, lint and two accessibility scenarios cover the last source. Do not attribute every log to one unchanged SHA. Subsequent closeout changes documentation only.
- Pinned Node **24.19.0**, pnpm **11.19.0**, Next.js **16.3.4**, Vitest **5.0.0**; native project PostgreSQL, loopback only. Tests use `etail_depot_next_test`; preview uses the separate existing `etail_depot_next` database.
- Guarded test commands run through `node tools/run-with-database.mjs`; logs verify the target database and **8 migrations, 0 pending**. No database was reset for this closeout.
- Local fictional identities and test adapters only; `ENABLE_REAL_MONEY=false`. “Issued”, approved/refunded payments and completed payouts below are saved **sandbox** outcomes, not external financial actions.

## Application and source checks

| Evidence | Actual result and scope |
|---|---|
| [Initial application candidate](../artifacts/three-account-redesign/full-candidate.log) | **337 passed, 5 failed**, 49 files. Failures exposed stale generated contracts, tests using newly disallowed Personal presentations and an outdated new-Merchant grant expectation. This is retained as a failed run. |
| [First corrected domain run](../artifacts/three-account-redesign/full-domain.log) | **343 passed / 49 files**. |
| [Expanded domain run](../artifacts/three-account-redesign/full-domain-final.log) | **354 passed / 51 files**. |
| [Domain closeout](../artifacts/three-account-redesign/domain-closeout.log) | **355 passed / 51 files**, 22.60 seconds. Includes unit, PostgreSQL integration/concurrency and executable-contract tests selected by the full Vitest run. |
| [Ledger/access focus](../artifacts/three-account-redesign/ledger-access-candidate.log) | **41 passed / 6 files**: exact money, immutability, business-effect retries, scope/foreign keys, overspend races, explicit card/payment grants and delegation/revocation. Included in broader runs; not an additional unique-test total. |
| [Issuing focus](../artifacts/three-account-redesign/issuing-postgres.log), [payment-permission focus](../artifacts/three-account-redesign/merchant-payment-permission.log) | **28 / 3 files** and **2 / 1 file** passed respectively. |
| [Lint](../artifacts/three-account-redesign/lint-final.log), [final visual lint](../artifacts/three-account-redesign/lint-visual-closeout.log), [typecheck](../artifacts/three-account-redesign/typecheck-final.log) | Coordinator-recorded exit **0**; these quiet logs contain no diagnostics and do not independently encode their exit status. Successful production builds also ran TypeScript. |
| [Schema drift](../artifacts/three-account-redesign/schema-drift.log) | `drizzle-kit generate`: **No schema changes, nothing to migrate**. |
| [Scoped security](../artifacts/three-account-redesign/source-security-closeout.log) | Passed; **294 files** inspected, **6** real-money configuration cases verified. Scope explicitly excludes dependencies, local secrets/build outputs, hosted lifecycle and penetration testing. |
| [Dependency audit](../artifacts/three-account-redesign/dependency-audit.log) | **No known vulnerabilities found** at this run; not a guarantee of security. |

The [architecture closeout command](../artifacts/three-account-redesign/architecture-closeout.log) passed: 176 source files, 61 API routes, one Identity SDK import, four Add card stages, one purchase stage, six canonical card routes, seven Merchant-operation routes and 37 typed write sites. Its nine added mutation tests passed and are included in the broader Vitest suite. These finite source checks protect owners/routes/transports; they do not substitute for runtime authorization or database invariants.

The original handoff helper was first run against the whole application tree and encountered one JSON parse error ([failed log](../artifacts/three-account-redesign/handoff.log)). The established source-only runner then executed **all 35 original helper tests successfully** ([rerun](../artifacts/three-account-redesign/handoff-source-only.log)). It excludes dependency/build files without dropping helper cases and explicitly does not re-certify the original package hashes.

## Browser failures and closeout

| Run | Result | Interpretation |
|---|---|---|
| [Full browser candidate](../artifacts/three-account-redesign/browser-full.log) | **94 passed, 9 failed, 5 project-selection skips** | API, desktop, mobile and accessibility projects. The failing run is not reported as green. |
| [All nine failure regressions](../artifacts/three-account-redesign/browser-regressions.log) | **9 passed**, 27.0 seconds | Re-ran the exact failed scenarios after corrections. |
| [Merchant closeout](../artifacts/three-account-redesign/browser-merchant-closeout.log) | **28 passed, 1 failed, 6 project-selection skips** | Broader Merchant journeys plus new administration-context tests. Personal/Household context tests passed on desktop and mobile; the remaining failure was horizontal overflow in Household relationship history at 320 pixels. |
| [Final narrow accessibility rerun](../artifacts/three-account-redesign/browser-accessibility-closeout.log) | **1 passed**, 9.8 seconds, coordinator-recorded exit **0** | After the long-link wrapping fix, the full selected Personal/Merchant/Household context, reflow and keyboard-focus scenario passed at 320 pixels. |
| [Final visual accessibility checks](../artifacts/three-account-redesign/browser-visual-closeout.log) | **2 passed, 4 project-selection skips**, 16.4 seconds, exit **0** | After removing the stale card-assessment badge and fixing transfer-badge alignment, both Merchant workspace and payment/setup/refund/transfer reflow/focus journeys passed at 320 pixels. |

The first nine failures comprised: a channel API assertion confusing account ID with merchant-unit ID; obsolete Household overview text on desktop/mobile; Merchant people-heading expectations on desktop/mobile and accessibility; a session-dialog transition causing duplicate status matches on desktop/mobile; and a duplicate activity-label locator in accessibility. The log records failures against the then-loaded test source; subsequent test corrections preserve account identity, outcomes and focus assertions.

Selection skips are the explicit project filters in `merchant-operations.spec.ts`: functional journeys run on desktop/mobile, while their dedicated accessibility journey runs in the accessibility project. They are not passed cases or hidden feature failures. Do not sum the reruns into a unique-test total or call this one final clean full-suite execution.

The new context checks demonstrate that Personal/Household collection views retain channel tools while gateway setup, refunds and payouts remain in the responsible Merchant view, even when one person owns both accounts. The server presentation ceiling and persistent UI administration flag survive refresh. This is presentation scoping over existing authorization; it neither awards Merchant authority nor removes independently held permissions from the person's canonical API scope.

Logs retain a `pg` concurrent-query deprecation warning and occasional Next.js “destination stream closed early” messages during browser navigation/recovery. These did not fail the successful reruns; their root causes are not certified resolved by this record.

## Migration and data preservation

[Migration 8](../netlify/database/migrations/20260909053603_furry_madame_hydra/migration.sql) preserves existing IDs/rows through the SELLER→MERCHANT enum/identifier rename, adds practice-card provenance and the immutable ledger/test-operation tables and constraints. Its SQL SHA-256 is `de359ace892ebd239686808ba084317024ce2f1e6c26b52fe35833f8f02d88f6`.

`tools/verify-account-redesign.mjs before|after test|preview` compared all pre-existing row content, normalizing only the declared enum/identifier renames. Successful **task-transcript receipts**, produced immediately after migration and before later test/demo writes, reported:

| Database | Preserved rows / old tables | Private before-snapshot SHA-256 |
|---|---:|---|
| Test | **41,319 / 41** | `dd65919e5a00f9a5c06b3e8195041b6860fd066fff56d432877f1638443bb6b3` |
| Preview | **177 / 41** | `3abb2be286b4bf1b45fee85163c567cdc85f64485bc5cd7c0bd993e8bf5c7ad1` |

The before snapshots remain local under `.local/account-redesign/` with mode 0600; row contents are not published here. Their counts/hashes were independently read during this evidence review. The successful after-comparison output was not saved as a standalone artifact log. Re-running it against databases subsequently changed by legitimate test/demo commands would not reproduce the original preservation comparison.

[Demo preparation](../artifacts/three-account-redesign/demo-prepare.log) then used canonical commands for three practice cards/purchases and connected test payment/refund/payout examples. [The subsequent preparation](../artifacts/three-account-redesign/demo-ready-channels.log) retained existing choices and prepared a reusable channel for each sample account. These deliberate writes are separate from migration preservation and insert-only fixture seeding.

## Build, packaging and visual review

- [Production Next build](../artifacts/three-account-redesign/build-final.log): compiled successfully, TypeScript completed, nine static pages generated and dynamic routes built.
- [Final offline Netlify build](../artifacts/three-account-redesign/netlify-visual-build.log): **Netlify Build Complete**, 6.5 seconds; `offline: true`, production build context, `@netlify/build` **36.4.6**, Next.js Runtime **5.15.13**, server-handler function bundled. This packages locally. It does **not** publish, deploy, provision a site or prove hosted runtime readiness.
- Eleven populated desktop/mobile views were captured and visually inspected: the account directory, Personal/Household overview, Merchant services/setup/payments, checkout, QR preview, and mobile services/payments/Household card. Initial captures caught loading fallbacks; explicit workspace/checkout readiness waits corrected the capture. Visual inspection identified a stretched transfer badge and a stale card-assessment label; both were corrected and affected screens recaptured. [Capture receipt](../artifacts/three-account-redesign/visual-closeout.log) checks no horizontal overflow across all eleven views. The in-app browser was reloaded to the final Merchant services page and its account context verified. Screenshots remain in ignored `artifacts/three-account-redesign/screenshots/`.

## Evidence integrity and remaining limits

Commands were run from the project root with the pinned Node runtime on `PATH`; successful closeout commands returned exit 0. Failed candidate results above are retained separately.

```sh
node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency tests/contracts
node tools/run-with-database.mjs playwright test
node tools/run-with-database.mjs playwright test merchant
node tools/run-with-database.mjs playwright test merchant-accessibility.spec.ts --project=accessibility
node tools/run-with-database.mjs playwright test merchant-accessibility.spec.ts merchant-operations.spec.ts --project=accessibility
pnpm lint
pnpm typecheck
pnpm test:architecture
node tools/verify-security.mjs
pnpm audit --audit-level=high
pnpm test:handoff
pnpm db:generate
pnpm build
NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 node node_modules/netlify-cli/bin/run.js build --offline --context production
```

SHA-256 values of the completed closeout logs when reviewed:

| Log | SHA-256 |
|---|---|
| `domain-closeout.log` | `81b49375663c5accd5b38ad7d35aa78c2363972d5b4a8efb88a3ce5385e33f61` |
| `browser-full.log` | `a3714e94c890211893dd06cb3807e72945b2165399a77a88ea733b30df0897e0` |
| `browser-regressions.log` | `9d05ab3a9969ffcd84eaf462640d5cd18984d70276446436fc3c23c283aa81aa` |
| `browser-merchant-closeout.log` | `337cbd0baf88edc3f3d3a394ffe6dcfd2aff12d0ff02a980b3d4a5549b0b3552` |
| `browser-accessibility-closeout.log` | `76a2118743442e7036d0e7d3b764e1ef00b7672435c105ed2e24cc0a5914cbba` |
| `netlify-closeout-build.log` | `0d1604b3ff5e631c9a9a542c454354119b77dc8c66033f496d4d2b8691df888c` |
| `netlify-visual-build.log` | `a86baba326f30ee92c5cda00ade60ea96e5350ab0a4b1dd8f47de39c1c162661` |
| `browser-visual-closeout.log` | `286a4dc2d249b83a904de8f1b7059476f1037d2b32cf24442bc194c46dbe4c83` |
| `visual-closeout.log` | `9670a7e187239caf7eb605ae386c7ccaf69f232cd4f1395f5813c8ba62779f59` |

Evidence establishes the bounded local practice workflows, not a connected card-to-merchant authorization/capture system, real issuance or acquiring. Account-wide card/activity read grants remain broader than holder-only views. Guardian allocation, numeric tier caps, public checkout/delivery, partial refunds, fees/rewards, asynchronous provider events, settlement/reconciliation and live identity/business verification remain outside this completed slice. D14–D17 still block their affected economic writes. See the [design's explicit limitations](THREE_ACCOUNT_SANDBOX_DESIGN.md#remaining-work-and-explicit-decisions).
