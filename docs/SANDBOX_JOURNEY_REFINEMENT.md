# Sandbox journey refinement

## Problem and direction

The user rejected both deployed end-to-end experiences after D60. D60 exposed the product commands to email members, but successful commands and passing tests did not make a coherent customer journey. D61 addresses the handoffs from first use to cards, payments and shared access. It preserves the two-service model and its canonical backend rather than adding another workflow engine.

The inspected local screens showed an extra card-request introduction, multiple setup panels with prominent disable/disconnect buttons, and money pushed below several layers of navigation. Source walkthroughs showed ten actions before reaching a first card and separate merchant gateway, enrollment, channel activation and checkout detours. Accepted secondary cardholders without cards were omitted from the main Cardholders view. Member codes occupied valuable dashboard space on every visit. The earlier Amex evidence supports persistent selected-resource context and direct summary-to-record navigation; no private portal access or parity score is claimed.

## Revised customer journeys

- First visit: choose Cardholder or Merchant services, enter a display name, acknowledge simulated money and continue directly to that service. This action records sandbox participation only. Neither financial service opens automatically. Existing members go straight to the working dashboards; member codes live under Your services.
- First card: Create your first card opens the one existing enrollment command and the same Add card form. Cardholder, card name, format and practice balance appear together, followed by review and the existing create command. Completion selects the issued card on Overview. Opening the form performs no write. A lost start/save/submit response freezes its original payload and retries the same command.
- Cardholder sharing: choose a task-based permission preset within the server-provided ceiling, customize if necessary, review and invite. Accepted members appear before they have a card. Add card for a person validates the selection against current authorized cardholder options. A secondary member still sees only their own cards and records.
- First merchant payment: name the merchant, explicitly enable sandbox payments through the existing gateway/enrollment commands, create a channel, enable that exact channel and continue directly to checkout. Interrupted setup preserves the confirmed step and retries the pending step. Previously disabled or paused settings require explicit action and are never silently re-enabled.
- Channels and checkout: purpose, amount and seven formats stay prominent; less common options are grouped. The saved channel shows readiness and its next action in place. Checkout presents the merchant, purpose, amount and Pay with test funds, followed by an exact receipt link. Decline simulation and format previews remain available as secondary tasks.
- Merchant sharing: choose a task preset and review the exact merchant scope; advanced permissions and duration controls remain available. Acceptance provides a clear link into the granted service. No invitation silently opens another service or expands financial authority.

## Data and permissions

The only backend change is a bounded, independently paged accepted-cardholder read projection for primary users with people.read. Card counts remain unavailable without card-reading permission, and Add card requires the existing issuance/request and cardholder permissions. This does not change stored membership, financial or identity records and requires no database migration.

The same API routes, immutable ledger, enrollment, issuing, acquiring and invitation command owners remain authoritative. Architecture checks are updated narrowly for the single request form executor and the fixed, reviewed gateway-to-enrollment continuation. They continue rejecting dynamic routes, duplicate command surfaces and unreviewed writes.

## Acceptance and evidence

The complete backend run passed 531 tests in 70 files against the isolated PostgreSQL test database. Scoped directory tests cover accepted people before their first card, unrelated/secondary exclusion, permission revocation and no financial writes. Lint, TypeScript, architecture, schema drift, dependency/security and 35 handoff helpers passed. Production Next/offline Netlify packaging was rebuilt successfully after the final visual corrections.

The first complete browser run passed 71 of 76 cases. It exposed a real review-navigation race: clicking Create while the request URL was changing could remount the form and lose its retry state. A navigation transition now holds actions and dialog close until the saved form is stable. The retry regression deliberately clicks immediately and loses real committed start/save/submit responses, then verifies unchanged command identities and one issued card. The four Merchant failures were two test synchronization/locator errors repeated on desktop/mobile; those were corrected without suppressing application errors. The initial failed run is retained in `artifacts/journey-refinement/browser.log`.

Visual review of the actual 1280px and 390px screenshots identified hidden form actions, excessive mobile navigation and obsolete activation guidance on an already-ready channel. Card and channel actions remain in one persistent footer while details scroll. The mobile Cardholder task navigation occupies one row, and payment readiness now determines the displayed next step. The final rebuilt run passed all 76 browser/API/accessibility cases (desktop, mobile and accessibility projects). Visible-action assertions include card review at 390px and 320 × 568px, a minimum 44px touch target, channel review before/after expanded options, setup continuation and primary checkout. Both complete email-member journeys pass with synthetic canonical identities in the isolated database. They include primary/secondary invitations and scope, card purchase/freeze, all seven payment formats, receipts, refunds, backed transfers and recovery after lost committed responses. The user's actual hosted credentials and records were not used.

Screenshots under `artifacts/journey-refinement/after/` were visually reviewed for first use, first card, selected-card completion, accepted people, payment readiness, channel form, checkout and exact receipt at desktop/mobile sizes. `before/` and `first-visual-pass/` retain the initial states. First-use captures restore the page to the top after focus/accessibility checks so a scrolled full-page capture does not misplace the offscreen skip link.

| Verification | Result / evidence |
| --- | --- |
| `pnpm lint`, `pnpm typecheck` | Exit 0; `lint-release.log`, `typecheck-release.log` |
| `node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency tests/contracts` | Exit 0; 531/531, `domain.log` |
| `ETAIL_JOURNEY_SCREENSHOTS=1 node tools/run-with-database.mjs playwright test` | Exit 0; 76/76, `browser-final.log` |
| `pnpm test:architecture` | Exit 0; detector self-tests and canonical ownership, `architecture-release.log` |
| `pnpm test:security` | Exit 0; dependency audit has no known vulnerabilities, `security.log`; final source scan `security-release.log` |
| `pnpm db:generate`, `pnpm contracts:generate` | Exit 0; no schema drift or migration; generated read contract updated |
| `pnpm test:handoff` | Exit 0; 35 helper tests, `handoff.log` |
| `pnpm exec netlify build --offline --context production` | Exit 0; production Next build and function packaging, `build-release.log` |

Environment: Node 24.19.0, pnpm 11.19.0, Next 16.3.4, TypeScript 6.0.3, PostgreSQL 18.6. Database tests ran only in `etail_depot_next_services_test`; existing preview and hosted data were not reset. Publication identifiers are recorded below after deployment.

## Published release

- Tested local application commit `f5a0d58b57d40f6319d181faf8e3da96a7d82883` and published GitHub `28516d6e6e542e6fc0033484aa66314fbf13cc55` share the exact tree `1cddba963fc5af6fee2bf450f686508f96ef5cbc`. [Draft PR8](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/8) remains open for review; the agent performed no merge.
- Owned Netlify site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, deployment `6aa277921086e3391ccf5ab8`, production context, ready/published `2026-09-10T09:28:11.474Z`, exact GitHub application revision above. [Open services](https://etail-depot-next.netlify.app/services).
- All nine post-publication public/protected-route checks passed without credentials: landing/login200; service pages307 to login; sandbox, recipient, Cardholder and Merchant dashboard APIs401. Email controls remain enabled. Full authenticated workflows were verified in the isolated test database, not with the user's own hosted credentials.
- Netlify's normal source branch is verified restored to `main`. The first temporary branch-selection attempt was rejected by automatic approval review; exact-site, production-only sign-in and prior authorized sandbox-publication evidence resolved the rejection. The ready build was then explicitly published after source restoration. Access, Identity settings, secrets, DNS and database schema were unchanged.
- Local preview3100 is restored using existing preview records, with no startup migration or seed writes. The final two first-use capture checks passed after restoring page scroll/focus; all 76 distinct browser cases remain passed. GitHub workflow34460331626 was still in progress at the last observation, with its desktop/mobile phase running; local results do not claim that remote workflow completed.

Live cards, money, outbound messages, actual provider verification, new billing/rewards and other unimplemented commercial capabilities remain outside this simulation. This refinement improves the usable implemented journeys; it does not claim completion of every commercial feature.
