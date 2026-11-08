# Amex experience correction — 2026-09-09

The user rejected the previous dashboard as an insufficient American Express benchmark. That assessment is valid: a simplified service directory and passing functional tests do not establish resemblance to Amex's actual customer journeys. This refinement changes the working screens, with traceable references and explicit remaining gaps. It does not award a percentage or close the 100% target.

## Reference evidence

Revisited the following public US Amex material on 2026-09-09. The distinction between current documentation and dated illustrations matters; no authenticated private portal was accessed.

| Reference | What was actually inspected | Applicable pattern and limits |
|---|---|---|
| [Amex mobile app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) | Current public description and [published product-switcher image](https://www.americanexpress.com/content/dam/amex/en-us/support/digital/amex-mobile-app/Amex--Mobile-app-refresh/amex-app-hero.png), visually viewed in the browser | Recognizable card identity, balance, switching and documented Home/Account freeze shortcuts. The image shows a product chooser, not proof of every selected-card Home screen. |
| [Corporate card profile illustration](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/uplifted-card-profile/Picture1.png) | Published screenshot visually viewed in the browser | Cardholder identity, financial summary and specific controls share one working context. This is a corporate administrator example with 2023 sample dates; its credit, billing and administration rules are not consumer rules. |
| [Merchant settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html) | Current help page and [published settlement table](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-Payments/viewing_settlements_a.png), visually viewed in the browser | Payment subviews, location/date/search filters, expandable financial rows and explicit status groups. The illustration has June 2021 sample dates. Etail's sandbox transfers are not equivalent to Amex settlement batches. |
| [Merchant payment navigation](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html) and [submission filtering](https://www.americanexpress.com/us/merchant/support-center/payments/search-filter-download-submissions.html) | Published workflow descriptions reviewed | Summary-to-record navigation and persistent, bounded working context. Supported Etail record types determine its tabs and filters. |
| [Previous cardholder role study](research/amex/CARDHOLDER_DASHBOARD_ROLES.md), [merchant study](research/amex/MERCHANT_DASHBOARD_ROLES.md) and [reviewer walkthroughs](research/amex/REVIEWER_WALKTHROUGHS.md) | Prior evidence, including sampled historical independent video; not newly replayed in this correction | Corroboration and regional/role distinctions. Secondary users retain the product owner's stricter own-data rule. Corporate managers and Amex locations are not silently equated to Etail primary/submerchant liability. |

## Changes and acceptance

| Previous gap | Correction | Acceptance evidence required |
|---|---|---|
| Cardholder Overview behaves like a directory | One selected card, recognizable card face, actual available money and immediate actions | Desktop/mobile visual review; primary can select a secondary card; secondary sees only own cards |
| Navigation loses card context | Stable `focus` selection through task views, dialogs and return navigation | Selection persists through reload and Back; invalid or foreign IDs show unavailable without choosing a different card |
| Freeze sits behind a generic management step | Home opens the existing freeze/unfreeze confirmation | Same canonical command, current permission/version checks and existing recovery behavior |
| Recent activity mixes contexts | Selected-card preview with an exact-card link to complete history | Correct card attribution; no claim that the latest dashboard items are full history |
| Merchant summary does not lead to a particular payment | Exact payment links open the existing receipt/refund dialog | Reload and Back retain the payment and filters; a foreign payment never opens another record |
| Merchant payments lack a financial working table | Payments, Refunds and Transfers with date, status and search controls | Existing complete authorized projections only; filters persist in the URL; current available balance does not change with row filters |
| Network actions imply a merchant selection | Require an explicit unit before unit-specific actions; compact parent/child presentation | No arbitrary first-primary destination; submerchant remains own-scope |
| Test counts substitute for design comparison | Inspect reference and Etail screens and record material differences | Screenshot review at desktop and narrow mobile widths, plus keyboard/accessibility and real workflow checks |

## Data and command design

No migration, financial record change or new provider is necessary for this presentation correction. A bounded selected-card reader resolves the stored financial owner and current policy, then reuses the canonical card projection. It returns one card and at most 25 exact-card transactions, without other cards, requests or people. The visible list cannot confer permission. An implicit selection is allowed only with a complete first page and exactly one own card, otherwise exactly one permitted card. An explicit invalid selection never falls back, including repeated URL parameters through navigation. Legacy activity links resolve their exact card rather than intersecting with a different default. Dialog selection and command forms remain independent of dashboard selection.

Merchant table filters operate on existing authorized payment/refund/transfer projections. Money and current balances remain server-owned exact values. All supported financial actions retain their existing commands, review, idempotency, optimistic versions and uncertain-response recovery. Primary and secondary authority stay independent between the two services.

## Remaining experience gaps

This remains a bounded sandbox, not a complete Amex-equivalent product. Real statement cycles, amount due and repayment, reward/benefit servicing, replacement and delivery tracking, live support, provider settlement batches, chargeback evidence files and complete operator escalation remain separate delivery work. A decorative due date, reward total or settlement record would misrepresent functionality. Existing [platform gap audit](../planning/EXPERIENCE_GAP_AUDIT.md) and backlog remain open.

## Delivery evidence

Implemented and verified locally, closing on 2026-09-10. Baseline: `01a146bd0ac5f93e7fe882a97cf05f493919c6e3`. Core source/tests: `ba1d9c1cf25df35ff6c98194b093a1c5d6f4c011`, tree `9d7775597071f96d9baf5ed4d9b6b49394e267a5`. Final application/test correction: `fdc3cb80888911831e403f769a4e778899653fe4`, tree `7bcbaf2dcbccceab2388f940b1d515976efa19ac`. Subsequent closeout changes documentation only. Earlier D49 counts are not this correction's verification.

The first new visual run passed 57 keyboard/accessibility/reflow checks and preserved both users' financial projections. Manual inspection nevertheless found that mobile Cardholder Home put available money and the freeze action below the first viewport. That candidate is retained for comparison; final acceptance now measures the balance and action against an 844px mobile viewport as well as checking overflow and WCAG rules.

The corrected visual run passed all 57 checks at 1440/390/320px with 46 retained screenshots; 14 final and nine candidate screenshots were visually inspected. On all six mobile Home/selected-secondary cases, available money ended between 668–750px and the first control between 729–811px, inside the 844px viewport. The final CSS-only correction removes a button color transition; it changes no static layout and passed the previously failing default-motion accessibility journey. Visual receipts identify their exact scope rather than claiming all 46 screenshots were manually reviewed.

Environment: Node 24.19.0, pnpm 11.19.0, Next 16.3.4, TypeScript 6.0.3, native PostgreSQL 18.6 on loopback 55439, Chromium. Test writes use `etail_depot_next_test`. Visual checks use the preserved `etail_depot_next_preview_v2` on 3101; final preview uses 3100. No migration or preview reseed was added.

| Check | Result | Receipt in `artifacts/amex-correction/` |
|---|---|---|
| `node tools/run-with-database.mjs vitest run` | 410 passed, exit 0 | `domain-final.log` |
| Complete browser suite | 117 passed, three failed, seven intentional project exclusions | `browser-complete.log`, `browser-candidate-errors/` |
| Final focused browser rerun | Five passed, one intentional exclusion; covers all three failures plus both selected-card control journeys | `browser-focused.log` |
| Combined distinct browser coverage | All 120 runnable cases passed across the full and focused runs | Same two receipts; not represented as a fresh complete rerun |
| Responsive, keyboard, Axe and read-only preservation | 57 passed; no violations, overflow, runtime errors or domain writes; both users' projections unchanged | `visual-final.log`, `visual/checks.json`, `visual-review.md` |
| ESLint / TypeScript | Passed, exit 0 | `lint-closeout.log`, `typecheck-closeout.log` |
| Canonical architecture / security checks | Passed, exit 0 | `architecture-frozen.log`, `security.log` |
| Current dependency audit | No known vulnerabilities, exit 0; lockfile unchanged | `audit.log` |
| Source-only handoff helper regressions | 35 passed, exit 0; original package hashes not re-certified | `handoff-source-tests.log` |
| Production Next / offline Netlify packaging | Passed, exit 0 on final application | `netlify-build-contrast.log` |
| Clean preview startup and in-app inspection | Verify-only startup; selected-card Home and exact payment-to-receipt-to-table path inspected | `preview-final.log` |

The full browser run found one test locator ambiguity in both desktop and mobile: the date error assertion also matched Next's route announcer. The final assertion scopes to Payments and checks the exact message. A separate default-motion accessibility case caught a real transient contrast failure as Add card changed from its Overview style to its task-view style. Removing that transition fixes the UI; the accessibility assertion was retained. All three failed journeys passed in the final five-case run, including the remainder of the merchant privacy and filter assertions.

Intermediate diagnostics are retained. Restricted-shell PostgreSQL access required the same local process permissions as the running database. One chained TypeScript invocation lacked Node in its second command's PATH; corrected standalone checks passed. The original handoff-only verifier failed JSON parsing when run against the assembled application tree; the supported `pnpm test:handoff` source-only runner passed all 35 helper tests. These are not reported as successful original-package recertification. Nonfatal PostgreSQL concurrent-query, terminal color and aborted Next navigation-stream warnings remain in their logs.

The offline build explicitly targets only site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` and does not deploy. No hosting access, remote branch, external resource, dependency version or real-money setting changed. `ENABLE_REAL_MONEY=false` remains enforced.

Open [Cardholder services](http://127.0.0.1:3100/cardholder-services) or [the merchant payment table](http://127.0.0.1:3100/merchants/0934e189-88e0-43a6-b10c-616640b3bbc1?tab=payments). Both were inspected in the app with the preserved Alex/Jamie sandbox data. This delivers the specific reference-based refinements above; the full Amex comparison and platform backlog remain open.
