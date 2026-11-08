# D71 — simpler entry, dashboards and everyday tasks

12 September 2026. The user requested removal of manual confirmation-link entry and a stronger public landing page, then extended the request to simpler actual Cardholder/Merchant dashboards and workflows. D69 remains the product/money contract; D70 confirmation-navigation corrections remain intact.

## Experience contract

The home page leads with prepaid spending, payment collection and personal control. A labelled public example switches between Cardholder and Merchant dashboards. Fixed example selections do not read private records or issue commands. Actions link to the existing protected services. Product comparison explains funding before spending, each person's limit, separate access and published Etail-card checkout. Family/team are use cases, not account types. Shared access is optional; starting alone does not require an invitation.

Registration starts directly from Create your login. The customer then follows the emailed link. Existing callback confirmation and token handling remain; manual confirmation/reset-link fields and link-paste instructions are removed. Safe generic signup feedback, recovery and unknown-result handling remain. There is no provider, email-delivery or database change.

Actual dashboards lead with essential money, the next useful action and recent activity. Lower-frequency requests/account tools and detailed filters use clearly labelled disclosure; the full existing capabilities, role isolation, URL context and recovery ownership remain. Primary group money remains visible beside Cardholder funding. Merchant current money states remain distinct from period activity. Setup removes redundant headings and a nonfinancial merchant-name review, retaining explicit enrollment/creation, responsibility disclosure and identical retries. No parallel easy mode or new financial engine is introduced.

## Everyday routes

| Customer task | Entry and destination |
|---|---|
| Register | Create your login → email/password → Check your email → explicit confirmation from the emailed callback. |
| Start using a service | Choose Cards or Payments and enter a display name → Continue → explicit card-group or merchant setup. |
| Check a card | Home → selected card, available amount, freeze/controls and recent activity. |
| Fund cards | Primary Home → Add money → existing saved funding review and receipt. |
| Change a person's limit | People → Spending limits → the existing authorized group funding/limits page. |
| Return to saved work | More → Requests; the same request URLs and command owners remain. |
| Find a payment | Merchant overview → search → exact payment record/receipt. Date/status filters and downloads expand when needed. |
| Manage collection points | Merchants & people → Manage the named merchant. A primary can return directly from a submerchant to its parent network. |

“Simple enough for a five-year-old” is treated as a plain-language/usability objective, not a change to age eligibility. A usability acceptance or measured comprehension result requires customer observation; automated checks alone do not establish it.

## Public reference evidence

Official Amex public content was revisited on 12 September 2026: [Merchant Home](https://www.americanexpress.com/us/merchant/merchant-home.html) separates returning login from onboarding; [Amex App](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) puts account selection, money and controls together; [Additional Card FAQs](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) explains responsibility and attributed spending; [settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html) connects summaries to individual records; [locations](https://www.americanexpress.com/us/merchant/support-center/account-services/manage-locations.html) preserves merchant scope. This pass read public content and screenshot descriptions; direct screenshot assets failed. No private portal, fresh pixel-level inspection or parity is claimed. Etail retains its own prepaid and stricter secondary privacy rules.

The resulting Etail decisions are product-first illustrations, two clear service choices, named people/merchant scope, progressive disclosure and exact record links. Marketing no longer promises hosted sample-profile switching or describes an unpaid request as collected. Automatic message delivery remains outside the sandbox.

## Review corrections

The first browser run was interrupted after 39 passes, three failures and one interrupted case (148 not run). The new Cardholder disclosure check matched only the label even though the amount is nested within that element. The Merchant tests attempted Add submerchant before opening its newly named Manage disclosure; one long journey's timeout also triggered pool-cleanup noise. The original log and failure contexts are retained in `artifacts/d71-browser.log` and `artifacts/d71-browser-initial-failures/`. The corrected tests open the actual controls and retain the money, command-retry and isolation assertions.

A separate source review identified context and discoverability defects: primary funding must not be paired with a selected card belonging to another primary's group; People needs a direct path to spending limits; a primary viewing one submerchant needs a direct route to the responsible primary's management. These changes use the existing scoped projections, funding page and merchant directory. They do not grant access or add financial commands.

Registration-link navigation also needs to update an idle mounted login form when the customer follows Sign in or browser history. The form now observes external mode changes while preserving pending requests, held email callbacks and unconfirmed outcomes. Browser coverage verifies idle back/forward navigation without authentication requests, callback precedence, and a held real-route signup response across header navigation.

## Acceptance

Checked registration and emailed confirmation/reset/reload/error paths; absence of manual-link fields; keyboard-operated public previews and seven channel examples without mutations; service/record navigation; primary/secondary and primary/submerchant boundaries; setup and unknown-response retries; 1440/390/320px reflow/accessibility; production build and source checks. Existing indexing/public-release boundaries stay unchanged.

## Final verification

Local macOS, Node24.19.0, pnpm11.19.0, Next16.3.4 and PostgreSQL18.6. Commands use the bundled Node/pnpm runtime on PATH. Base commit `8c460e6f0430a40a7a38e3458c51912ef0d54165`; feature branch `codex/consumer-entry-experience`. No domain service, schema, migration, dependency, provider, hosted setting or money rule changed.

| Command | Result and evidence |
|---|---|
| `pnpm lint` | Exit0; `artifacts/d71-lint-final.log`. |
| `pnpm typecheck` | Exit0; `artifacts/d71-typecheck-final.log`. An earlier unsupported icon name failed and was corrected before final builds; initial log retained. |
| `pnpm test:architecture` | Exit0; `artifacts/d71-architecture-final.log`. |
| `pnpm exec vitest run tests/unit tests/contracts` | Exit0;401 pass (389 unit,12 contracts); `artifacts/d71-unit-contracts-final.log`. |
| `node tools/verify-security.mjs` | Exit0; `artifacts/d71-security-final.log`. Dependencies unchanged; no new dependency audit or full database/concurrency suite is claimed for this UI slice. |
| `node tools/run-with-database.mjs playwright test --project=api --project=desktop --project=mobile --project=accessibility` | Complete run:192 pass,3 landing contrast failures, exit1; `artifacts/d71-browser-final.log`. All service journeys passed. |
| `node tools/run-with-database.mjs playwright test tests/browser/public-foundation.spec.ts tests/browser/consumer-preview-foundation.spec.ts tests/browser/public-accessibility.spec.ts --project=desktop --project=mobile --project=accessibility` | After darkening only the six product-step numerals: all32 pass, exit0; `artifacts/d71-public-verified.log`. This closes all195 distinct browser/API/accessibility cases without double-counting reruns. Contrast failure contexts retained in `artifacts/d71-browser-contrast-failures/`. |
| `pnpm test:email-e2e` | All26 desktop/mobile cases pass, exit0; `artifacts/d71-email-final.log`. Isolated provider harness on3101/3102, synthetic credentials and marked test DB. No actual email or hosted current-revision acceptance is claimed. |
| `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 ENABLE_REAL_MONEY=false pnpm exec netlify build --offline --context deploy-preview` | Final Next production build and Netlify package pass, exit0; `artifacts/d71-build-verified.log`. No deployment. |
| `pnpm preview:fixture` | Running on3100; verified existing preview without migrations/seeds/resets; `artifacts/d71-preview-server.log`. |
| `node tools/capture-consumer-preview.mjs --local-preview-3100` | Exit0;27 states/42 screenshots, zero accessibility, overflow or runtime/mutation errors; `artifacts/consumer-entry-d71/visual/checks.json`. All301 source entries unchanged, hash `c811833effeb469988e97b7ea43a6b75313ae6c84ca114c6f6a04e24ecfc3a5b`. |
| `node tools/run-with-database.mjs --preview tsx tools/capture-prepaid-preview.mjs d71-services-visual` | Exit0;33 primary/secondary/operator states, zero accessibility, overflow or runtime errors; all15 authorized projections unchanged; `artifacts/d71-services-visual/checks.json`. All665 source entries unchanged during capture, hash `79e821761e00b89ed3049933c3997906c956c69c45a4c3606a16dff403e456e0`. |

The first service capture launcher used `node` where the wrapper requires an installed `node_modules/.bin` tool. It exited1 before any capture; `artifacts/d71-services-visual.log` is retained. The documented `tsx` command above passed without changing the script or database.

The task visually inspected desktop and390px landing views, desktop Cardholder and Merchant overviews,390px Cardholder and Merchant views and320px secondary Cardholder. Card money and controls remain visible in the phone's first screen; table rows reflow and supporting tools expand when needed. These60 capture states/75 PNGs are visual evidence, not additional browser test cases. The customer has not yet accepted this revision.

Delivery is local only. No GitHub push, merge, hosted deployment, access change, real email or real-money operation occurred. D69's remaining product/release scope and D70's separately recorded limitations remain open.
