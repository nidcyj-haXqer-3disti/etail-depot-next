# D75 — working dashboards grounded in published Amex tasks

12 September 2026. The user found `/services` cluttered and the card/payment experience impractical. This slice makes existing daily tasks easier to find and preserves investigation context. It does not claim complete Amex parity. D73's owner, cards, flat terminals, separate balances and total card allowances remain authoritative.

## What was inspected

- [Amex US app tour](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/): current public text describes account switching and Home/Account freeze controls. Its [published account-selector illustration](https://www.americanexpress.com/content/dam/amex/en-us/support/digital/amex-mobile-app/Amex--Mobile-app-refresh/amex-app-hero.png) was visually inspected in the browser during D75: named products, account amounts and recognizable card identity form selectable rows. This is a public illustration, not an authenticated account session.
- [Amex Employee Cards](https://www.americanexpress.com/en-us/business/employee-credit-cards/) and [Additional Card FAQ](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/): spending oversight, limit management and connected-card activity inform placement of card controls. Etail's total allowance is not Amex's product-specific recurring limit.
- [Amex US Viewing Settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html): the page and [first settlement illustration](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-Payments/viewing_settlements_a.png) were read and visually inspected in the browser. Search, location, date and download sit above the record table; pending/posted groups and reference-led detail support reconciliation. The image contains sample 2021 dates; the public page does not establish the current signed-in portal release date.
- [Payments default view](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html), [Submissions](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-submissions.html), [Disputes Summary](https://www.americanexpress.com/us/merchant/support-center/disputes/disputes-summary-table.html) and [Managing a case](https://www.americanexpress.com/us/merchant/support-center/disputes/managing-a-disputes-case.html): public text separates payment records, settlement investigation and response work.

The web image fetcher failed for the two illustrations; browser image navigation succeeded. Other failed Card Profile image fetches do not count as fresh visual evidence. No private Amex portal, confidential architecture or newly watched video is claimed. Existing regional/video research remains dated background, not proof of these changes.

## Source-to-task changes

| Task | Observed Etail problem | D75 change and boundary |
| --- | --- | --- |
| Choose a service after sign-in | Promotional tiles repeat headings, balances and profile/support panels before actual work. | A compact two-choice page. Profile is a shared footer destination; security/help and explicitly authorized customer-care access remain reachable there. Each service owns its balance view. New-member enrollment still works. |
| Check a card and its spending limit | Limit and used amount are hidden; changing the limit is discoverable only inside generic settings. | Show the selected card's server-projected used/total limit, keep available spending prominent, and give authorized owners a direct route to the existing limit editor. No new financial calculation or alternative command. |
| Open an account with several cards | No explicit selection can lead to an empty explanatory panel despite available cards. | Show actual authorized card rows that open exact selected-card views. Never guess the first card or expose unseen pages/another holder's records. |
| Resume unfinished card setup | Saved work is visible only after finding the requests page. | A conditional unfinished-request link; completed history remains in its own task. |
| Investigate merchant payments | Changing terminal scope silently drops date/search/status; search drops status. References and download are hard to find. | Preserve applicable filters across forms, tabs, scope and detail returns; reset only pagination when changing a filter. Put exact references and download with the records, expose supported status/date options. |
| Review refunds or deposits | Search/table/empty wording still describes payments, and current balance is mixed with historical searches. | Name the selected record type, show the server's date range and use contextual empty states. Keep current payment balance distinct. Do not label all-time or unfiltered totals as the search result. |

## Remaining practical gaps

This is a concrete usability correction, not a complete Amex replacement. A dispute queue with compact case drilldowns and response-work prioritization remains to be designed against actual supported states. Current disputes have no provider response deadline, so none is invented. Bank settlement timing, automatic provider reconciliation, live/external card acceptance and external message delivery remain unavailable. Current reviewed settlement, withdrawal and operator outcomes retain their real implemented meaning; a label change cannot turn them into an automatic bank payout.

Amex credit bills, minimum payments, AutoPay, rewards, physical delivery, chargebacks and product-specific spending resets are not introduced into the user's prepaid model. No schema migration, saved-data reset, access expansion or provider configuration change is required for D75.

## Verification

Commands, original failures and corrected outcomes are recorded below as they run. Local artifacts are ignored from Git; exact source trees, GitHub checks and canonical deployment belong in the release receipt/PR. UI tests prove specified navigation and access behavior, not a measured Amex-parity percentage or actual hosted mailbox delivery.

### Local results

Environment: macOS, Node24.19.0, pnpm11.19.0, PostgreSQL18.6 on the marked `etail_depot_next_services_test` and preserved `etail_depot_next_services_preview` databases. Seventeen migrations were present; zero applied. Real money remained disabled.

| Check | Result |
| --- | --- |
| `pnpm lint`, `pnpm typecheck`, `pnpm test:architecture`, `pnpm test:security` | Exit0; source/dependency guards passed, no known high-severity dependency findings. |
| `pnpm test:unit`, `pnpm test:contracts` | Exit0;402 unit and12 contract cases. |
| `node tools/run-with-database.mjs vitest run tests/integration/service-dashboard.test.ts` | Exit0;8 PostgreSQL cases including owner limit capability, independent holder scope, revoked grant, exact-card reads and pagination. |
| Focused Playwright desktop/mobile/accessibility | All26 distinct affected cases pass across the initial run and corrected reruns. The final10 keyboard/accessibility cases also pass after the mobile navigation correction. |
| `pnpm test:email-e2e` | Exit0;26 isolated registration, confirmation, password sign-in, session and recovery cases. This is an isolated provider environment, not a hosted mailbox delivery claim. |
| `pnpm test:handoff` | Exit0;35 maintained source-only handoff helpers. |
| `pnpm exec netlify build --offline --context production` | Exit0 on final application source, including Next production build and adapter packaging. |
| Rendered preview review |57 before and57 after states at1440/390/320px; no axe/reflow/runtime failures, all three personas' card/payment projections unchanged (generated report timestamp excluded from comparison). |
| Additional final views |12 merchant captures verify every overview-navigation link stays visible, zero axe/reflow/runtime failures and unchanged projections. A separate isolated multi-card fixture captures3 genuine picker states with axe/reflow checks passing. |

Original evidence is retained: one incorrect Playwright CLI target invocation exited1; the correctly targeted prior-bundle regression then failed because Show discarded filters. A separate prior-bundle assertion confirmed the absent Status control. Initial candidate browser runs exposed a nested test-locator error; later return assertions needed to await route completion and treat omitted empty query values as equivalent. The card limit capability omission was caught by independent source review and corrected through the existing server evaluator; dedicated integration and UI checks pass. Do not attribute test-selector failures to application money behavior.

The first57 after-state captures included12 duplicates; the preserved single-own-card personas did not exercise the new picker, so its3 genuine multiple-card views were added separately. The member-code display is covered by the isolated enrollment browser case, not those preview portraits. Manual review also found a clipped mobile merchant navigation item despite passing axe/reflow; the final12 views confirm its correction. No failing assertion was removed to conceal an application error.

Named logs/captures: `artifacts/d75-*`, including `d75-filter-loss-reproduced.log`, `d75-focused-integration.log`, `d75-focused-browser-final.log`, `d75-card-action-browser.log`, `d75-card-picker.log`, `d75-merchant-browser-canonical.log`, `d75-nav-a11y.log`, `d75-email.log`, `d75-netlify-build-final.log`, and the before/after/after-nav/picker image directories. GitHub's full database/concurrency/API/browser pipeline and hosted release checks are recorded for the final exact tree in the release PR and `artifacts/d75-publication.json`.
