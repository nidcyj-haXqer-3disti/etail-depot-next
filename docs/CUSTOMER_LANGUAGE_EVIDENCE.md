# D74 — Customer language verification

12 September 2026. Implements [the language contract](CUSTOMER_LANGUAGE.md) on the deployed D73 owner/cards/terminals model. Cards & spending and Accept payments replace customer-facing service jargon; card/payment balances remain separate. A labelled example payment request replaces the purchase-card illustration on the payment marketing page. The checkout recovery screen uses a plain fallback for JSON, transport and schema errors while retaining the saved command and retry controls.

## Review scope

Independent source reviews compared the changed projections, policy conditions, event handlers and request routes. Existing financial commands, ledger ownership, permissions, enums and database schema are unchanged. Public FAQ content and the decorative illustration are presentation changes. Two review findings were corrected: card-balance empty states no longer imply receiving business payments, and malformed checkout replies no longer display raw browser JSON errors. Existing checkout recovery cases assert the plain message and retain exact-request, access-denial, single-payment and balance checks.

Existing browser expectations were updated to the actual customer labels. Heading levels disambiguate existing Card requests sections; contextual invitation, setup, support and payment retry names are retained. No test case, privacy/money assertion or timeout was removed. The retained visual capture tool now selects the viewer's current assigned terminal instead of retired hierarchy fields; its read-only guards and before/after projection comparisons remain.

## Local verification

Environment: macOS, Node24.19.0, pnpm11.19.0, Next16.3.4, TypeScript6.0.3, native PostgreSQL18.6. Database checks use the marked `etail_depot_next_services_test`; startup verified17 existing migrations and applied none. The preview database and historical retained databases were not reset.

| Check | Evidence / result |
|---|---|
| Unit / adapter contracts | 402 unit +12 contract cases passed; `artifacts/d74-unit.log`, `artifacts/d74-contracts.log`. |
| Focused PostgreSQL projections | 18 cases /4 files passed; `artifacts/d74-projection-integration.log`. Existing tests cover collection availability, access, workspace and card purchase availability. |
| Email/session regression | 26 cases passed; `artifacts/d74-email.log`. Disposable provider transport and synthetic accounts on dedicated3101/3102; no real mailbox interaction. |
| Historical handoff helpers | 35 passed through `pnpm test:handoff`; `artifacts/d74-handoff.log`. This is a source-only helper check, not original package recertification. |
| Public visual/accessibility | 39 distinct states passed at1440/390/320px:12 route/width views,21 keyboard-selected sharing examples,3 payment previews,3 expanded help views. Zero axe violations, overflow or browser errors. `artifacts/d74-public-visual-final/results.json`, `artifacts/d74-public-visual-interactive/results.json`, `artifacts/d74-public-visual-review.md`. The final rebuilt public views are separately verified in `artifacts/d74-public-verified`. |
| Source/build checks | Lint, types, architecture, scoped security and dependency audit passed. Next production and offline Netlify packaging passed; final lint/types/architecture and production Next/offline Netlify packaging passed (`artifacts/d74-lint-release.log`, `artifacts/d74-types-final.log`, `artifacts/d74-architecture-final.log`, `artifacts/d74-netlify-build-verified.log`). Final402 unit cases passed again after the checkout message correction. |
| API/browser/accessibility journeys | All215 distinct cases passed across the original full run and corrected rerun. The original run passed197 and failed18 outdated-label/heading expectations; the final64-case desktop/mobile rerun passes every affected file, including both interrupted-checkout cases. No skipped cases or added retries. Logs: `artifacts/d74-browser.log` and `artifacts/d74-browser-final.log`. |

The first unprivileged Netlify packaging attempt failed opening the CLI's preferences temporary file (`EPERM`); the authorized run outside that filesystem restriction passed. This was an environment failure, not an application build failure. Initial full browser results and corrected reruns are preserved separately; earlier D73 success is not substituted for D74 evidence.

## Release boundary

Local base `72f180552f77076637f77520c834b64cb888d33c`, tree `ef72c34c2cc549e2a22af0257e7479148842ddd8`, matches deployed D73 main `75eee004a1ded48fb6adbf2bb0ff67c3f5ea7bc8`. The D74 feature PR and `artifacts/d74-publication.json` identify the exact final local/remote tree, CI, reviewed merge and canonical deployment. Release remains pending until those receipts exist.

No new migration, Identity configuration, visitor-access setting, indexing approval or live-money feature is introduced. Local email tests do not verify actual mailbox delivery or hosted HTTPS/session behavior. Browser/accessibility tests and source review do not establish measured novice usability or American Express parity. External card networks, digital wallets and automatic text/email sending remain outside the current implementation.
