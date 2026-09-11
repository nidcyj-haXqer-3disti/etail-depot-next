# Merchant experience redesign — D67 evidence

11 September 2026. Implements the user's request to redesign Merchant services alongside the completed Cardholder redesign. [Experience contract](MERCHANT_EXPERIENCE_REDESIGN.md). The source branch is `codex/merchant-experience`, based on local `b5284ff2a5d64a1389a80732bea3f57f54eed639` and tree `e3121108d06ecc854f9c194a120e191920362c83` (D66's final receipt tree).

## Implemented change

- Merchant overview prioritizes received payments and current funds, with scoped activity, native search/date/status filters, exact receipts and matching exports. Merchant and filter context survives directory and unit navigation.
- Merchants you manage and Merchants shared with you distinguish primary oversight from delegated work. Each unit shows server-derived collection readiness and its available next action. Missing permission remains different from zero funds or no channels.
- Payment channels retain selected channel/search/status in URLs and show actual ready, off, used, expired and setup states. Activation, guest publication, copyable sharing formats and signed-in practice checkout remain separate canonical flows.
- People and access separates active people, past access and pending-first invitations. Exact counts disclose the bounded history. One ordinary collection invitation offers optional actions within the inviter's current grants and valid expiry terms. No edit/extend-access command is invented.
- Business details shows saved progress and explicit navigation to payment setup. Unknown command results keep their original retry; current-access loss has generic recovery and explicit explained exit instead of trapping navigation.

No migration, database reset, dependency/provider/Identity change, financial writer, new money lifecycle or external delivery was added. Nine existing migrations remain current. All money is sandbox money. The test database is `etail_depot_next_services_test`; the separate preserved local preview is `etail_depot_next_services_preview`, both on the owned PostgreSQL instance on loopback55439.

## Verification

Environment: macOS, bundled Node24.19.0 / pnpm11.19.0, PostgreSQL18.6, production Next16.3.4 on loopback3100. Raw logs and guarded visual evidence are under ignored `artifacts/merchant-redesign/`.

| Check | Result | Local evidence |
|---|---|---|
| Full unit and contracts | 361 passed, exit 0 | `unit-contracts.log` |
| Full PostgreSQL integration | 183 passed in 37 files, exit 0 | `integration.log` |
| Full concurrency | 35 passed in 11 files, exit 0 | `concurrency.log` |
| API, desktop, mobile and accessibility | All 134 distinct cases pass across the full 132-case run and corrected 72-case affected-journey run; see chronology below | `browser-final.log`, `browser-canonical-final.log` |
| Lint, types and architecture | Passed, exit 0; canonical publication ownership guard unchanged | `lint-canonical-final.log`, `typecheck-canonical-final.log`, `architecture-canonical-final.log` |
| Security source and real-money guards | Passed, exit 0 | `security-canonical-final.log` |
| Dependency advisory audit | No known vulnerabilities, exit 0 | `dependency-audit.log` |
| Production Next build | Passed, exit 0 | `build-canonical-final.log` |
| Source-only handoff helpers | 35 passed, exit 0 | `handoff.log` |
| Offline Netlify package, exact sandbox site | Passed, exit 0; no deploy | `netlify-build-final.log` |
| Preserved-preview visual/reflow/accessibility/runtime checks | 63/63 states, zero violations, overflow or runtime errors; exit 0 | `visual-final/checks.json`, `visual-capture.log` |

The final post-test copy change replaces “assignment” with plain permission wording in an empty access detail; it changes no behavior and is included in final lint/build/visual verification.

The initial typecheck/build correctly rejected an invalid icon name; it was corrected to an existing icon. The initial 116-case browser run was interrupted after 61 passes, four failures and one interruption because the test selectors still followed retired overview/setup actions and a new assertion captured the URL before navigation finished. The same run retained 50 unrun cases; it is not a full-suite pass. Original logs are preserved, with corrected source and selectors checked in the final run. The initial combined security command passed source checks but could not resolve the package registry in the restricted network; the authorized advisory-only run passed.

The full 132-case run completed with 126 passes and six failures: an onboarding confirmation disappeared after successful setup, and two new tests matched recovery text in both open and closed dialogs, each on desktop/mobile. The correction retains a useful setup-ready state before the first channel and renders recovery only in its visible owner. Independent review also found inaccessible unknown requests could trap navigation; new tests cover original retry identity, scope denial, generic private-data-free recovery and explicit exit. The architecture check rejected a duplicate publication retry call in the parent; that call was removed and recovery now invokes the original `MerchantChannelPublication/send`, with the guard unchanged. The final 72-case affected-journey run passes, including both newly added publication-recovery cases. Together these cover all 134 distinct cases. No difficult tests were skipped or replaced with stubs; original failures remain in their logs.

The guarded visual review ran at 14:57:30–14:57:51 UTC. It covered primary/delegated overview, funds, directory, unit payments, filtered/selected channels and own-card regressions at 1440/390/320px, plus primary channel creation, publication review, people/invitation, payment setup, saved business details and private help. Representative desktop and phone screenshots were visually inspected. All 26 authorized projections stayed unchanged (20 primary, six delegate); only the documented dashboard read timestamp was excluded. All 606 source files stayed unchanged during capture, fingerprint `40778c319ca63cee86038d1108b8bc54d4d51d4dbd47a14e77da7fe7332440bb`. The exact preserved `hi` unit and existing money, channels, permissions and records remained intact. Only fixed fictional sign-in sessions were written; no business or provider mutation was allowed. Preview startup performed no migration or seed writes.

## Publication and remaining acceptance

The tested application is local `54ff95cbb0a213bdf4079cdd89e031e253da0754`, published as GitHub `def41a757219c5d65261470f71c7b1660cd53bdf`; both have exact tree `293cd154693d0d559fb580c576fb8f80c72bcd62`. All41 uploaded blobs were verified against local Git object hashes. [Draft PR12](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/12) is stacked on D66's PR11. The final receipt-only follow-up changes this document and the task status; it does not change the tested application. The existing local preview tab was opened to Merchant services and its rendered scope, money and exact receipt navigation verified.

No merge, production-source switch, hosted migration or deployment is performed by this redesign task. Automatic approval review previously rejected the narrow Netlify production-source change; its requested explicit approval remains pending. Current hosted positive task acceptance is separate from local evidence. External SMS/email delivery, asynchronous reconciliation, partial refunds/disputes/reserves/settlement, broader issuing/commercial features and the full Amex comparison target remain open.
