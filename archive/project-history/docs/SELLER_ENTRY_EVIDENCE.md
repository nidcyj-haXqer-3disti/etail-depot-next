# Connected Seller experience — delivery evidence

9 September 2026 (JST). The user accepted Personal **Quick Sell**, Household **Help a Seller** and Seller **Get paid**, then requested the design, database, UI/UX and implementation. This delivery connects those entry points through one named Seller and one saved merchant setup. The [design and storage relationships](SELLER_ENTRY_EXPERIENCE.md) distinguish account context, permission, merchant acceptance and commercial spending.

## Exact source and environment

- Branch: `feature/EDN-003-foundation`.
- Application implementation: `2c74ad5b9dc9fb36a227a9ac7defabf6807edca0`.
- Final tested revision: `edcf29f21d325b7c8748d627c2383acfc7d318db` (adds only five explicit fictional sample selectors in four browser test files).
- Final tested tree: `afa05a2c1d7c6ea99d0012bb9a0459542f9109e7`.
- Darwin 25.6.0 ARM64, Node 24.19.0, pnpm 11.19.0, PostgreSQL 18.6, Next 16.3.4 and Netlify Next adapter 5.15.13. Dependencies and the single lockfile are unchanged.
- The [core receipt](../artifacts/seller-entry/verification/identity.json) records exact commands, UTC timing, exit statuses and lockfile/migration/log hashes. It passed with a clean working tree. The later closeout changes documentation only.

## Executed verification

| Check | Result | Evidence |
|---|---|---|
| Lint and TypeScript | Exit 0 each | [Lint](../artifacts/seller-entry/verification/lint.log), [types](../artifacts/seller-entry/verification/types.log) |
| Unit tests | 163 passed, exit 0 | [Unit](../artifacts/seller-entry/verification/unit.log) |
| PostgreSQL integration | 61 passed, exit 0 | [Integration](../artifacts/seller-entry/verification/integration.log) |
| PostgreSQL concurrency | 18 passed, exit 0 | [Concurrency](../artifacts/seller-entry/verification/concurrency.log) |
| Executable API contracts | 7 passed, exit 0 | [Contracts](../artifacts/seller-entry/verification/contracts.log) |
| Architecture ownership | Exit 0 | [Architecture](../artifacts/seller-entry/verification/architecture.log) |
| Security source checks and dependency audit | Exit 0; audit reported no known vulnerabilities | [Security](../artifacts/seller-entry/verification/security.log) |
| Strict dependency peers | Exit 0 | [Peers](../artifacts/seller-entry/verification/peers.log) |
| Production Next build and offline Netlify packaging | Exit 0 | [Build](../artifacts/seller-entry/verification/netlify-packaging.log) |
| Handoff helper regressions | 35 passed, exit 0, counted separately | [Handoff](../artifacts/seller-entry/verification/handoff.log) |

The final complete Playwright run passed **89/89**, exit 0: **19 API, 29 desktop, 29 mobile and 12 accessibility**. There were no skipped, unexpected or flaky results and no retries. The [browser receipt](../artifacts/seller-entry/browser/receipt.json), [full log](../artifacts/seller-entry/browser/browser.log) and HTML/JSON reports record the final exact SHA/tree and a clean working tree at start and end. All tests used the production build and isolated `etail_depot_next_test`.

Across the final checks, **338 application tests passed**: 249 unit/database/concurrency/contract tests and 89 Playwright tests. The 35 handoff regressions and static/build checks are counted separately. Automated accessibility/keyboard checks do not constitute a manual screen-reader certification or full product acceptance. The browser log preserves nonfatal Next stream-closure messages during passing navigation tests and color-environment warnings; execution is not claimed to be warning-free.

The initial uncommitted browser candidate passed 12/14 tests and failed two setup navigation checks. Both reloaded immediately after the saved dialog closed but before Next completed removing `view=setup` from the URL. The test now waits for the canonical URL before reloading, preserving the original saved-field, local submission and scope assertions. A targeted rerun passed 3/3, including expanded setup form accessibility. The [failed candidate](../artifacts/seller-entry/candidate-browser/receipt.json) and [recovery run](../artifacts/seller-entry/candidate-recovery/receipt.json) are retained and are not the final source receipt.

Review also corrected payment-draft HTTP 408 handling: when a request commits but its response times out, the form retains the original command identity. The browser regression forwards the original command to completion, returns 408 to the UI, retries and proves there is exactly one private draft. An intermediate production build exposed a TypeScript narrowing issue in that regression's shared transport unit test; the guard was fixed before the successful final verification. The failed log remains `.local/seller-candidate-408-build.log`.

The first complete run on `2c74ad5` passed **86/89**: 29 desktop, 29 mobile, 12 accessibility and 16 API checks. Three older API tests selected the first Seller, which could now be a newly created setup-only Seller without historical reporting or cardholder access. Their correct 403/empty results revealed the fixture assumption. The final revision explicitly selects the named fictional Sample shop in those history tests and two related selectors; application permissions and denial assertions are unchanged. The [complete failed candidate](../artifacts/seller-entry/browser-candidate-2c74ad5/receipt.json) and [prior core checks](../artifacts/seller-entry/verification-2c74ad5/identity.json) are preserved.

## Implemented behavior and database

Personal can choose a permitted Seller or deliberately create a new empty Seller draft. The single account command atomically creates its account, accepted owner, explicit permissions, merchant setup, durable retry receipt and outbox fact. No fixture balances, sales, cards or spending capacity are added. A lost creation response can be resumed without making a second Seller.

Household shows only Sellers independently available to the signed-in person. A named confirmation displays that person's Seller role before switching, and a validated return link restores the original context. Search covers the bounded loaded set and has a clear no-results recovery. The existing intended-person invitation lifecycle grants only reviewed Seller permissions; Household relationships supply none.

One merchant setup supports individuals, sole proprietors and businesses. It keeps fictional legal and selling names separate, identifies the responsible applicant, saves versioned draft details, reviews prerequisites, and records a truthful local review submission. Merchant status and commercial spending status are separate. Another authorized manager cannot silently replace the responsible applicant.

Private payment-request drafts support exact USD cents, one-time/reusable intent, expiry, review, save, edit, cancellation and reload. They remain visible only to their creator in the named Seller. Network/408 uncertainty retries the same command; stale edits retain input and require refresh. Expired drafts cannot be edited. These drafts contain no public payment token, URL or QR code and never collect money.

Two additive migrations create eight typed tables and scoped list/history indexes. Composite foreign keys enforce Personal/Seller account types and actor/resource relationships. Eligibility comes from explicit fictional adult test declarations; missing and supervised declarations are denied. Versions, payload digests, command uniqueness and PostgreSQL locks enforce scope and retry behavior. Database tests include real concurrent connections, revoked access, responsible-applicant eligibility, privacy and absence of financial/card effects. Fixture startup no longer restores changed delegation ceilings or grants approvals to newly created Sellers.

## Demonstration and visual review

The production preview is running at [Personal Quick Sell](http://127.0.0.1:3100/accounts/df8a22a3-11e1-48f2-b679-62860fab3469/get-paid). `pnpm preview:fixture` verified the separate project-owned `etail_depot_next` database, applied the two new migrations (six total), and preserved its existing fictional accounts and records. The prior browser state returned to sign-in, so a fresh local owner test session was opened through the existing fixture button; no record reset or customer-data import occurred. The [preview receipt](../artifacts/seller-entry/preview-receipt.json) records the observed result.

Ten [desktop/320-pixel screenshots](../artifacts/seller-entry/screenshots/receipt.json) were captured against isolated test records on the final clean revision. They cover Personal picker search, Household named handoff, Seller setup/spending status, a saved sole-proprietor review, the setup form and exact-USD payment-draft review. All ten were visually inspected: names wrap, controls remain readable, no horizontal clipping was observed, and long setup dialogs scroll within the viewport. Search was used normally to select a named test Seller; screenshots do not hide test rows through DOM changes.

The final in-app browser was refreshed against the preserved preview and inspected at its actual narrow panel width. The existing Personal account displays Quick Sell, the independently permitted Sample shop, and the deliberate Seller creation action. The tab was left open as the deliverable. No application source changed after the passing production verification; the evidence/status closeout changes documentation only.

## Remaining product work

This completes the approved local entry/setup slice and supports EDN-004/006/017/020 without closing their financial dependencies. The [90 comparison tasks and 20 gates](../planning/amex-comparison.json) remain intact and unassessed; no 100% Amex score or full milestone completion is claimed.

Live merchant onboarding/decisions, legal/guardian verification, payment publication/checkout, refunds/reserves/payouts, commercial approval, actual card issuance and the single financial ledger/provider lifecycle remain outstanding. Local submissions have no operating review team or real provider delivery. Historical financial examples remain fictional read-only snapshots. `ENABLE_REAL_MONEY=false` remains enforced, and D14–D17 still govern affected financial writes.

Only the new local project source and its isolated databases changed. No external message, remote push, PR, merge, deploy, visitor setting or old resource changed. Netlify access remains as the user chose. Hosted setup, review publication and eventual public release retain their separate recorded boundaries.
