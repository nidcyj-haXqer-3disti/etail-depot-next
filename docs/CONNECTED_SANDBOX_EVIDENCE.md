# Connected sandbox build — D65

11 September 2026. This implements the current Cardholder and Merchant slices from the consolidated design. The earlier interactive walkthrough remains historical review evidence; these checks exercise the actual application, PostgreSQL commands and browser journeys.

## Delivered behavior

- Cardholder management shows each accepted person, their permitted cards, access and invitation history. Directory filters survive navigation. A secondary awaiting their first card sees their named primary group; opening an independent service is optional. Requests retain created and canceled history, filters, pagination and exact card links.
- Primary and holder freezes are distinct restrictions in the existing card-control command. A holder cannot clear a primary restriction. Existing freezes with unknown provenance require primary review before release.
- Merchant overview supports network or exact-unit scope, dates, payment/refund/transfer activity, pagination and matching CSV. Current funds remain distinct from period totals, and receipt/back links retain their filters.
- Merchant support uses the same private case lifecycle as Cardholder support. A case belongs to its requester; current permission is rechecked on reads and retries. Assigned support operators receive only the authorized payment context and have no customer money authority.
- A merchant can explicitly publish or revoke a guest payment link. Guests own private, durable orders through an HttpOnly cookie, review practice outcomes, confirm once and revisit receipts. Interrupted confirmations recover the same result. Channel/access revisions and revocation stop new effects. Guest and signed-in payments share the existing gateway adapter, payment writer and ledger.
- Email recovery guidance distinguishes an expired link from an uncertain password change. Callback handling passed both optimized production and React development mode; no credential or pending-reset barrier is bypassed.

## Verification record

Environment: macOS Darwin 25.6.0, Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, native PostgreSQL 18.6. All database tests use the marked project-owned `etail_depot_next_services_test` database. Browser tests use loopback services and fictional people. Tests of previous implementations are not included as evidence for these changes.

| Check | Result | Evidence under `artifacts/complete-sandbox-journeys/` |
| --- | --- | --- |
| Full unit and executable contract suites | 360 passed; exit 0 | `final-release-unit-contracts.log` |
| Full PostgreSQL integration suite | 173 passed; exit 0 | `release-integration.log` |
| Concurrency/replay suite | 35 passed; exit 0 | `final-concurrency.log` |
| API, desktop, mobile and accessibility | 98 passed | `release-browser.log` |
| Lint, TypeScript and architecture | Passed, including the final authentication delta | `final-release-lint.log`, `final-typecheck.log`, `auth-review-architecture-final.log` |
| Production Next and offline Netlify package | Passed, including the final authentication delta | `final-netlify-package.log` |
| Source security and dependency advisory audit | Passed; no known advisories returned | `release-security-source.log`, `final-security.log` |
| Generated migration drift | No schema changes | `release-schema-drift.log` |
| Source-only handoff helpers | 35 passed; exit 0 | `final-handoff.log` |
| Dedicated email provider harness | 16 production journeys, 4 development Strict Mode checks and 12 repeated callback checks passed | `auth-review-production-email-corrected.log`, `auth-review-dev-final.log`, `auth-review-production-callback-repeat.log` |
| Preserved-preview visual review | 39 states at 1440/390/320px; zero axe, overflow or runtime errors; 13 authorized projections unchanged | `visual-final/checks.json` and PNGs |

The original browser run found a real person-navigation race and outdated timing/heading assertions. A later complete run exposed tests that assumed a newly created card or an older reusable channel was on the first bounded page. The corrected tests follow pagination or create an independently scoped channel; application limits remain intact. Email tests exposed callback consumption during React effect replay and a router refresh restoring an already-cleared fragment. Failed runs are retained, not counted as successful acceptance. No test assertion, authentication guard or financial invariant is bypassed to produce a green result.

The final visual run covers primary, secondary and assigned-operator screens. An initial safety guard stopped at an additional preserved local submerchant; its exact fictional preview ID/name/primary relationship was verified before the guard was extended. No data was renamed or removed. Screens with no existing merchant support case show the honest empty state. Guest publication was not repeated in this read-only capture; its mutating journeys passed the separate browser suite.

The user confirmed that their deployed password sign-in reaches **Your services**. This is positive hosted sign-in evidence. It does not by itself certify real mailbox delivery, password recovery, or authenticated acceptance of this new deployment. The isolated email harness exercises actual application routes and PostgreSQL with synthetic provider transport; it sends no external email.

## Data preservation and recovery

Three additive migrations extend the existing model: `20260911103124_merchant-support`, `20260911104524_card_restriction_ownership` and `20260911105542_guest_checkout`. Their applied SQL is immutable. They add service/unit/payment constraints, freeze ownership and guest order provenance without resetting customer records or financial journals.

Local preview comparison preserved every original value in 51 tables / 198 rows. New columns and tables were excluded from that original-value comparison. Evidence: `preview-before.json`, `preview-after.json`, `preview-migration.log` and `preview-preservation.log`.

A separate native PostgreSQL backup and disposable restore matched all 58 tables / 207 rows, including the migration records. Data SHA-256: `58a98697dc6e10a3a809e355d31da7643df859a5dafb12c90eaa41a1c7c3a778`. Schema SHA-256: `65d30d421f5318b5300351339d906f6cd8fd5fbccbaf8e72e44063ab3caf3db4`. Both copies are project-owned, local recovery artifacts; the original preview remained unchanged. This is a local restore rehearsal, not a hosted Netlify restore. Evidence: `restore-rehearsal.json` and its guarded script/log.

The existing hosted checkpoint is Netlify's on-publish snapshot at `2026-09-11T05:08:59.015Z`, attached to deploy `6aa38cc5382486eaf0a02aa9`. The exact site remains `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`. Netlify applies production migrations at publication and records automatic backups. A code rollback retains the current database; restoring a hosted backup replaces production and may lose later activity, so no hosted restore was performed. [Migrations](https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/), [backup and recovery](https://docs.netlify.com/build/data-and-storage/netlify-database/backup-and-recovery/).

## Release scope

Feature branch: `feature/complete-sandbox-journeys`. Local base `b92cb786addf921429a1cbc3efaee554cfab4849` and owner-merged remote main `7a7f954558f257997cbe64a95fac4719a5231531` have the same tree, `9f7533cc55213702e6c69ffb0c9b5e9656b03aed`. Only private repository `1361184741` and the recorded new Netlify site may receive the release. Final source/PR/deploy receipts will be recorded after acceptance; no feature merge is implied.

This release expands P3/P4 and P5a. SMS/email sending, asynchronous provider reconciliation, partial refunds, disputes, settlement/reserves, failed transfers, physical delivery, replacement/closure, supervised funding and broader billing/rewards/commercial work remain in the [delivery plan](../planning/DELIVERY_PLAN.md). The seven channel formats are copyable presentations; copying does not send a message. All money is simulated. No full-product or 100% Amex-parity claim is made from these tests.
