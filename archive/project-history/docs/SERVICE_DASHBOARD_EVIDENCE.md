# D78 verification — account, card and payment clarity

13 September 2026. [The D78 design contract](SERVICE_DASHBOARD_CLARITY.md) records the public Amex and Stripe references, scope and permission rules. This record distinguishes implementation, local acceptance and publication.

## Implemented behavior

Authenticated shells have no site footer or copyright navigation. Your profile, Sign-in & security, Help center and Sign out share one header disclosure, with keyboard dismissal and mobile positioning. Profile contains personal information. Signed-in Help uses the same authenticated shell. Private support cases remain available within the relevant card or terminal workflow; terminal navigation calls this Contact support.

Card Account home shows the owner's exact card-account money, counts and recent activity. Selecting a received card cannot replace that account overview with the sender's money. Cards contains one searchable directory. Owners have All cards, Cards in your name and Cards for others filters. Invited cardholders start directly with search and their cards; redundant tabs and ownership filters are absent. Saved links to an inapplicable filter offer View your cards recovery. A named Card details view groups card identity, available spending, total allowance, direct freeze and permitted controls. Account navigation and task-search collection links clear card selection; individual Activity, Reports and Help retain exact card scope.

Merchant navigation separates Overview, Payments, Payment links, Team & terminals, Balance & payouts and Settings. Recipients see Your terminals and no owner money/settings. Payment links require an authorized terminal choice. Terminal creation has one Create terminal action; named terminal links have explicit arrows, underlines and touch targets. For invited users, optional business enrollment is collapsed on Overview only. Balance & payouts separates incoming collections, reviewed settlement, available proceeds and payouts. Settlement invokes the existing command and refreshes the current balance. Payout receipts derive their current pending/completed/failed state from immutable saved records and events. Payout history and Balance activity use separate tabs, with deliberate page reset and saved receipt/return context. Incoming-payment read failure leaves an explicit retry state after current account authorization is checked again.

New Merchant top-up intents, direct credits and confirmations of old unconfirmed reviews are denied by the server policy and canonical writer. The current owner can still read saved reviews and recover an exact already-posted receipt. Card funding remains available. Tests bind retries to the original actor, account, command and amount, with no new effect on rejection. No migration, data reset or external provider connection is introduced.

## Local verification complete

Runtime: Node 24.19.0, pnpm 11.19.0, Next 16.3.4, PostgreSQL 18.6. All commands below completed with exit status 0 in the local environment. The marked test database verified 22 existing migrations, applied none, and retained its preparation marker. Integration/browser tests add fictional isolated test records; they do not reset preview or hosted records.

| Check | Result | Local evidence under `artifacts/` |
| --- | --- | --- |
| `pnpm test:unit` | 487 passed | `d78-unit-verified.log` |
| `pnpm test:integration` | 256 passed | `d78-integration.log` |
| `pnpm test:concurrency` | 42 passed | `d78-concurrency.log` |
| `pnpm test:contracts` | 12 passed | `d78-contracts-final.log` |
| Historical handoff helpers | 35 passed | `d78-handoff.log` |
| Full Playwright run through `tools/run-with-database.mjs` | 261 passed: 9 API, 222 desktop/mobile, 30 accessibility | `d78-browser-final.log` |
| `pnpm test:email-e2e` | 28 isolated email/session cases passed | `d78-email-final.log` |
| Final card/list/menu/accessibility Playwright subset | 32 passed after recipient-only control simplification; these overlap the full suite | `d78-card-final-focused.log` |
| Final Merchant navigation/enrollment/payout/accessibility Playwright subset | 38 passed after visual polish; overlaps the full suite | `d78-merchant-polished-focused.log` |
| `pnpm lint`, `pnpm test:architecture`, `node tools/verify-security.mjs` | Passed on final source | `d78-{lint,architecture,source-security}-polished.log` |
| TypeScript, contract generation and dependency advisory audit | Passed; no known dependency vulnerabilities | `d78-typecheck-verified.log`, `d78-contract-generation-final.log`, `d78-dependency-audit-verified.log` |
| `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 pnpm exec netlify build --offline` | Final production Next build, TypeScript and Netlify packaging passed; no upload | `d78-netlify-polished.log` |
| `tools/capture-dashboard-preview.mjs d78-dashboard-preview-polished` through the preserved preview wrapper | All 45 states passed at 1440, 390 and 320px | `d78-dashboard-preview-polished/checks.json`, `d78-visual-polished.log` |

The final visual run covers owner and invited-user card account/list/detail, Merchant overview/payment links/terminals, the profile/help menu and owner payouts. All states have no authenticated site footer, one Sandbox badge, no horizontal overflow, no detected accessibility violations and no runtime/guard errors. Manual review covered representative desktop and narrow-phone screens. All 19 authorized preview projections remained unchanged after excluding only their documented `asOf` clocks. The source hash remained stable throughout capture. Documentation-only completion notes were written afterward. The earlier 45-state run is retained under `d78-dashboard-preview-final`; the final polished run supersedes its presentation evidence without counting repeated states as new coverage.

Review corrected task-search collection links that retained card focus, large valid amount wrapping, payout-history return context, and settlement read failure containment. Recipient Cards then lost redundant owner-only controls; its final 32-case rerun passed. Manual Merchant review improved terminal link affordance, moved invited-user business enrollment into a collapsed Overview section, fixed singular payment-link counts and distinguished zero incoming payments from an unavailable read. The rebuilt final source passed 38 affected checks and all 45 visual states. Existing tests retain privacy, ledger, saved-command and lifecycle assertions while following the new labels and destinations.

## Initial failures and corrections

The first full application run completed with 245 passes and 16 obsolete-label/selection assertion failures (261 cases total); all 30 accessibility cases passed. The complete corrected run passes all 261. Initial errors remain in `d78-browser-all.log` and `d78-browser-errors-initial/`. Native summary controls are located by their accessible label rather than assuming Playwright exposes them as buttons; saved card activity links now correctly return to Card details, then the list.

Other retained failures include an unsupported test-only array method replaced with a compatible nonmutating reverse, an incorrect settlement aggregate expectation, a chained shell losing its Node PATH after the unit suite, restricted loopback/advisory calls and Netlify CLI preference permissions. Corrected tests and authorized local/network checks passed. The final packaging invocation initially used unsupported `--site`; the exact bound ID was moved to `NETLIFY_SITE_ID`, and the offline package passed. These were verification/setup corrections, not hidden retries of actual payments or deployment.

## Publication boundary

Candidate branch: `codex/service-dashboard-clarity`. Base local commit `71776c77e8225e077a7727d4b696f450b0dcd95b` has tree `280f88646cf8a33c2da732e6dedec7f0597df6ce`, matching published D77 merge `a799ad663db454474c13d5b75d3ff392841458d8`. Repository `1361184741` was reverified as the private `nidcyj-haXqer-3disti/etail-depot-next` project. D78 has not been merged or deployed by this record. Review and any later publication must identify their exact source tree and the bound Netlify site separately.
