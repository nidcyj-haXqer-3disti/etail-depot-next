# D83 — whole-site spacing and copy review

17 September 2026 (Tokyo). The user asked to check all pages for awkward spacing and remaining repetition. This extends D82's dashboard copy pass to every rendered page family, including authentication, secondary tasks, checkout, help, invitations, errors and operator tools. Existing approved workflows and separate card/merchant money remain unchanged.

## Coverage

The source inventory contains 38 `page.tsx` entry files, including canonical catch-all routes and redirect-only aliases. Repeated records and query combinations use these shared templates; they are not separate designs.

| Page family | Included review |
| --- | --- |
| Public | Landing page, Cards & spending, Accept payments, Help center; seven payment-channel presentations and public navigation/footer |
| Entry and personal account | Sign-in, registration, recovery, confirmation/error copy, services hub, Profile, Sign-in & security, empty/populated invitation inbox and invitation entry/details |
| Card service | Account home, card lists/use filters, detail, creation, invite/share, freeze/limit controls, cardholders, card history, account/card activity and transaction details |
| Card account tasks | Settings/preferences, Add money, unused-money return, history/receipts, reports/filter/save, Help/support and Membership |
| Merchant | Overview/statement, terminal directory/detail/create/invite, channels/create/share, payment/refund/settlement records, account settings, business setup, support and disputes |
| Customer checkout | Public payment request, card checkout, order/receipt and dispute routes, including unavailable/access-required states |
| Operators | Customer care queue/case, previous deposits, withdrawal processing and dispute-review routes, including denied/empty states |
| Route fallbacks | Legacy aliases through canonical destinations, invalid resource selections and application-styled missing page |

Prepared preview data does not provide every positive financial, invitation or operator state. The capture receipt records those gaps explicitly; the existing isolated browser suite exercises additional creation, response, processing, denied and interrupted states. Preview records are not reset or manufactured to fill a visual checklist.

## Changes

- Sign-in now has one active form heading instead of stacked generic/form titles. Existing authentication callbacks, availability, validation, messages and recovery remain.
- Security uses concise section headings. Invitations have readable detail/action spacing and an explicit empty state.
- Card creation, activity, reports, Help and Membership no longer repeat the shell title or decorative introductions. Money forms have consistent top spacing and appropriately sized subheadings; Membership fields no longer stretch to match an adjacent help message. Report print rules remain.
- Merchant context, statement, creation, channel and People & sharing sections no longer accumulate duplicate margins. Settings back links align with the content. The Disputes disclosure has one title, and submitted business details no longer tell the user to add details again. Necessary business/terminal scope and money distinctions stay visible.
- Public Help uses recognizable topic headings and current Overview/payout instructions. Marketing uses consistent payout terminology; redundant illustration captions are removed.
- Operator tools gain properly spaced navigation, headings, records and mobile actions. The dispute-review page gains its missing H1. Missing pages use the application shell and retain 404 status.

No schema, policy, command, ledger, route validation, identity provider configuration or hosted resources change. All uncertain-request explanations and meaningful financial confirmations remain. Existing assertions follow retained accessible headings; financial/privacy/recovery assertions are preserved.

## Verification

Local verification uses Node 24.19.0, pnpm 11.19.0, Next 16.3.4 and the marked PostgreSQL 18.6 databases. Build output and logs are retained under `artifacts/d83-checks/`.

| Check | Result |
| --- | --- |
| `pnpm lint`; final changed-file/helper ESLint | Exit 0 |
| `pnpm test:architecture` | Exit 0 |
| `pnpm build` after the final copy correction | Exit 0; production compilation and TypeScript checks pass |
| Complete desktop/mobile/accessibility suite | Initial run: 286 pass, 4 fail. The four failures were two obsolete wording assertions on each viewport; both now verify retained controls/meaning. The 34-case affected/public rerun passes, completing all 290 distinct existing cases across runs. This is not a claim of one clean 290-case run. |
| Dispute workflows after removing the repeated heading | 10/10 desktop/mobile cases pass, including scoped responses, recovery and the 320px route |
| `pnpm test:email-e2e` | 28/28 desktop/mobile cases pass through actual application auth/session routes and an isolated provider fixture; no real email or customer password used |
| Final responsive capture | 327/327 states pass at 1440, 390 and 320px; no horizontal page overflow, automated accessibility violations or unexpected browser/runtime/guard errors |

The final capture receipt is `artifacts/d83-all-pages-preview-complete/checks.json` (120 dashboard states plus 207 expanded states). It covers owner, invited holder, assigned operator and anonymous contexts, with 40 unchanged authorized API projections (17 holder, 20 owner, 3 operator). The exact source remained unchanged throughout capture: 873 files, SHA-256 `f19f36a0e4a2829763055cc354a7de31f1c81c173aa85f706dfbde2b0a210913`. These closeout documentation edits followed that receipt. Only projection `asOf` clocks are normalized; generated report times are visually reviewed instead of included in the digest. The capture allows exactly the verified local fixture sign-ins and blocks other writes and external requests.

Manual reviews of representative desktop and phone images covered every page family. They found and corrected a stretched Membership input, the repeated Disputes title, and stale business-details guidance. Final images confirm each correction. Existing functional tests include expected interrupted responses, and their server logs contain incidental “destination stream closed early” messages; the final responsive capture itself has no runtime errors.

The first expanded capture (`artifacts/d83-all-pages-preview-final`) stopped after 96 clean visual states because the new helper tried a GET against a POST-only invitation endpoint. The helper was corrected without suppressing errors or adding a product endpoint. The server-rendered invitation manager remains visually checked with writes blocked; its absence of a read API is recorded as a projection limitation. The subsequent 327-state `final2` run passed; the final `complete` run includes the last business-details copy correction.

Preview coverage limits are explicit in the receipt: already-assigned cards do not provide an unassigned invitation form; the operator has no dispute-review assignment and no pending processing rows; the current published checkout is expired; a positive anonymous receipt requires its original browser session; confirmation/reset forms require provider links. Those data or permissions were not manufactured. The isolated browser and email suites exercise additional positive and recovery flows, but do not prove live mailbox delivery or every possible customer record/state.

D81 remains deployed. D82/D83 are local edits, not a new hosted release.


## Publication authorization

The user requested deployment after reviewing the completed local cleanup. Independent source review found no blocking regression, privacy or accessibility issue. Publication will use the bound GitHub repository and existing Netlify site after exact-source checks, with existing visitor access retained. Hosted results are recorded separately from the local evidence above.

## Verified publication

The user-approved release is published through [PR26](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/26), merged commit `5df50a5f7b9f621ddf283ddd71b5f2aed795bfc7`, source tree `0e47dcf91cc8a570d5254d86ffacda228ee4a4b4`. GitHub run `35116777146` passed the complete release workflow, including all260 desktop/mobile and30 accessibility cases in one run. Its checked merge, reviewed head, final main and873-file source archive match. Offline Netlify packaging also passed; the isolated package dependency-path failure and successful repair are retained in `artifacts/d83-offline-package-receipt.json`.

Netlify deploy `6aaabc9ab5e2833789718dc1` published at15:59:09.752UTC on16 September2026 and was confirmed current again after acceptance. No database migrations, data reset or access-setting changes occurred; Netlify created an on-publish snapshot. All186 final hosted read-only checks and44 responsive public captures pass with zero issues. The first run completed the same checks but flagged three expected404 console messages because HTTP/2 supplied an empty status phrase; its evidence is preserved. An independently reviewed, one-line verifier correction accepts that phrase only for the exact synthetic missing-page navigation, while retaining all status, asset, API, host and runtime guards. No application correction or additional deployment was needed. The deployed version and unchanged visitor access were reverified after acceptance. Actual hosted password/mailbox use and authenticated customer writes are not claimed.

Final receipts: `artifacts/d83-publication.json` and `artifacts/d83-hosted-acceptance-http2-verified/checks.json`. These post-publication notes record evidence; they do not alter the deployed application source or the exact-source provenance above.
