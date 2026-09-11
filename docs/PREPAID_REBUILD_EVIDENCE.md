# D69 prepaid services — reviewer evidence

12 September 2026. This record covers the local D69 working candidate and the saved verification logs listed below. It does not certify a hosted deployment, a real-money product or American Express parity. Add the final source/tree and publication receipts before attaching this record to a release.

## Result and scope

The two service journeys now share a coherent prepaid payment model. A Cardholder primary adds money to one group and sets each person's monthly spending limit. Card issuance, an invitation and a limit change create no funds. Secondary cardholders see their own permitted cards and records; managing somebody else's card does not permit spending with it. Service-related shared access remains available without a global Invitations product in the post-login service chooser.

A Merchant publishes a customer payment request through the supported channel presentations. The customer signs in, selects their own eligible Etail card, reviews a saved payment and confirms it. One transaction persists the connected card purchase, merchant payment and balanced journals. A full refund returns money atomically to the original card group without restoring gross monthly spending allowance. Direct test purchases and the old guest payment mutation workflow have been retired.

Merchant funds are separated into awaiting settlement, processing, returned deposits and the sandbox bank balance. A deposit review binds the full eligible batch; changed collections or refunds require another review. Pending deposits reserve the saved items. Only a separately assigned operator can record a completed or failed processing outcome. A returned-deposit retry reviews its remaining original items and cannot absorb later collections. Customers have no “simulate success” control or arbitrary instant transfer.

The browser checks cover exact saved-attempt recovery after lost, malformed and denied responses; sensitive context is removed on access denial while the original request can be retried. They also exercise funding, spending-limit, checkout, refund, deposit and operator boundaries, primary/secondary and merchant-unit privacy, invitation acceptance, card requests and controls, receipts, filters and reloads. React continues to use the canonical server policy, command and ledger owners.

## Environment and boundaries

- Local macOS ARM64 workspace: `/Users/yu/Downloads/etail-depot-next`; Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, React 19.2.8, TypeScript 6.0.3, Vitest 5.0.0 and Playwright 1.63.0. Versions are pinned in the application/tool configuration. Native PostgreSQL 18.6 runs on the guarded loopback port 55439 under `etail_local`.
- Database and browser runs target only `etail_depot_next_services_test`, generation `fresh-services-d69`. The local preview uses the separately guarded `etail_depot_next_services_preview`. Both original generations retain their OIDs and records under the corresponding `_retired_d69` names with connections disabled. The logs report 13 migrations present and zero newly applied during final verification. No hosted database or Identity reset is implied.
- Browser tests use the production Next server at `http://127.0.0.1:3100`, one worker, zero automatic retries, Desktop Chrome and Chromium with iPhone 13 emulation. Accessibility checks include 1440, 390 and 320 pixel layouts where applicable. Email/session tests use the separate local email harness and actual application routes; they are not evidence of current hosted email delivery. Credentials and email tokens are excluded from recordings, screenshots and traces.
- `ENABLE_REAL_MONEY=false` remains enforced. All identities, group funding, cards, merchant payments and deposits in these checks are sandbox records.

## Verified checks

Log paths below are relative to the repository root. Commands use the declared package scripts or the corresponding direct invocation. The Netlify log records the effective build command and offline context rather than a deployment.

| Check and command | Recorded result | Evidence |
| --- | --- | --- |
| `pnpm typecheck` (`next typegen && tsc --noEmit`) | Passed | `artifacts/d69-source-gates.log`; `artifacts/d69-release-build.log` |
| `pnpm lint` | Passed; final lint log contains no diagnostics | `artifacts/d69-lint-final.log` |
| `pnpm test:architecture` | Passed detector self-tests and ownership checks: 270 source files, 52 UI/client roots, 84 API routes | `artifacts/d69-architecture-final.log` |
| `pnpm test:unit` | **389 passed**, 30 files | `artifacts/d69-source-gates.log` |
| `pnpm test:contracts` | **12 passed**, 5 files | `artifacts/d69-source-gates.log` |
| `pnpm test:integration` | **208 passed**, 40 files | `artifacts/d69-integration-complete.log` |
| `pnpm test:concurrency` | **39 passed**, 11 files | `artifacts/d69-concurrency-final.log` |
| `node tools/run-with-database.mjs playwright test` | Release run: **149 API/desktop/mobile passed**, plus 2 accessibility cases; interrupted later as explained below | `artifacts/d69-browser-release.log` |
| `pnpm test:a11y` | Corrected complete accessibility project: **30/30 passed** | `artifacts/d69-accessibility-final.log` |
| Desktop/mobile rerun of `cardholder-experience-workspace.spec.ts`, `cardholder-management-workspace.spec.ts` and `merchant-people-redesign-workspace.spec.ts` | **24/24 passed**, 12 per project; overlaps the release cases | `artifacts/d69-final-navigation.log` |
| `pnpm test:email-e2e` | **24/24 passed**, 12 desktop and 12 mobile | `artifacts/d69-email-final.log` |
| `pnpm build`; offline Netlify build in `deploy-preview` context | Next production build and server-function packaging completed. Netlify Build 36.4.6; Next runtime 5.15.13 | `artifacts/d69-release-build.log`; `artifacts/d69-netlify-final.log` |
| `node tools/verify-security.mjs` | Final scoped scanner and its self-tests passed: 463 source/configuration/test files and 6 real-money configuration cases | `artifacts/d69-security-final.log` |
| `pnpm test:security` (earlier D69 scanner plus `pnpm audit --audit-level=high`) | Scoped scan passed; dependency audit reported **no known vulnerabilities** at the recorded run | `artifacts/d69-security.log` |
| `pnpm test:handoff` (`python3 tools/test-handoff.py`) | **35/35 source-only helper tests passed**; original package hashes are not re-certified | `artifacts/d69-handoff-source-only.log` |

**Browser accounting: 179 distinct browser/API/accessibility project cases passed across the release and corrected accessibility runs: 9 API + 70 desktop + 70 mobile + 30 accessibility.** The first 2 accessibility passes overlap the corrected 30; the final 24 navigation checks are reruns. Neither is added again. The separate 24-case email suite is reported separately. This is evidence across recorded runs, not a claim that one uninterrupted 179-case invocation passed.

The integration output retains `pg` deprecation warnings about concurrent `client.query()` calls. They did not fail the 208-test run; the warning is not suppressed or presented as a clean diagnostic log. Architecture and security source guards have bounded scopes and do not independently prove authorization, financial correctness, dependency safety or production readiness.

## Preserved preview and visual acceptance

`node tools/run-with-database.mjs --preview tsx tools/verify-clean-preview.ts` passed its read-only D69 baseline checks: group funds 46,400 cents; four connected purchases, one refund and one completed deposit; 12 resource-access denials; no historical rows. Merchant awaiting funds were 13,800 cents and the sandbox bank balance 4,800 cents. Secondary access remained private. Evidence: `artifacts/d69-preview-verification.log`.

The repeated-preparation comparison preserved **69 tables and 243 rows**, with the same digest before and after: `7f20e1f8b5d3496090d418ce3354e621021acd98cc3140a3191299d00c6ea9d9`. Preparation reported `prepared:false`; 13 migrations were present and zero applied. Evidence: `artifacts/d69-preview-noop.log`. This proves the recorded no-op, not the absence of all later intentional customer edits.

The final read-only capture, `node tools/run-with-database.mjs --preview tsx tools/capture-prepaid-preview.mjs d69-prepaid-visual-02`, passed **33 screens at 1440, 390 and 320 pixels**, with zero accessibility violations, horizontal overflow or runtime/guard errors. It covers primary Cardholder and Merchant screens, secondary own-card and assigned-submerchant screens, and separate operator queues. Only three fictional fixture sign-ins were performed; no customer command was submitted. All three roles' before/after projections matched, excluding only `asOf` timestamps. The source snapshot stayed unchanged across 664 files, hash `b6e8abeda8f3d475471a39a374b9124e1517de3a027b3806980f2751fd3a982b`. Evidence and screenshots: `artifacts/d69-prepaid-visual-02/checks.json` and its sibling PNGs. The implementation task visually inspected desktop primary card, funding and merchant funds; mobile primary and secondary cards and submerchant; and the 320-pixel deposit view. These 33 capture states are separate visual evidence, not additional distinct browser test cases.

The first capture is retained in `artifacts/d69-prepaid-visual-01/checks.json`: eight captured screens passed, then the harness reported `CAPTURE_FAILED`; the implementation task traced it to `AUDIT_TIMEOUT` while waiting for hidden lazy images. Its source hash still matched, but it did not complete projection-preservation checks. The capture script now waits for rendered images and loads images eagerly only during capture. No application source change was needed; the complete second run above is the passing evidence.

## Retained failures and remaining limits

The release run reached 151 passes before an obsolete accessibility selector for the Merchant navigation label “Payment setup” failed; a second accessibility test was interrupted and 26 did not run. The selector was corrected to the current navigation, and the full 30-case accessibility project then passed. The original failure remains in `artifacts/d69-browser-release.log`. Earlier migration/test-assumption and browser failures also remain, including `artifacts/d69-integration.log`, `artifacts/d69-integration-fresh.log`, `artifacts/d69-browser-initial.log`, `artifacts/d69-new-browser.log`, `artifacts/d69-new-browser2.log` and `artifacts/d69-browser-final.log`; these are history, not passing evidence.

The original `python3 tools/verify_handoff.py` and whole-tree `unittest` command fail while traversing installed dependency JSONC. Their diagnostics remain in `artifacts/d69-original-handoff.log` and `artifacts/d69-handoff-tools.log`. The successful source-only wrapper has a narrower stated scope and does not replace a checksum certification of the original package.

External channel delivery, live funding/card/bank rails, real identity/merchant verification, automatic provider reconciliation, partial refunds, production disputes/reserves and the wider commercial/rewards scope are not established by this slice. The reviewed public American Express material informs navigation and workflow; it is not private architecture evidence or a 100% parity certification.

No D69 hosted acceptance, deployment or release is asserted in this record. Offline Netlify packaging does not upload the application. Final source/tree identity, review/publication receipts and hosted verification must be recorded separately when verified; D68 results remain historical evidence.
