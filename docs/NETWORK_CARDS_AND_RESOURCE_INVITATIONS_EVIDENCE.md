# D76 verification — network cards and resource invitations

The [active contract](NETWORK_CARDS_AND_RESOURCE_INVITATIONS.md) defines this slice. The existing dashboard layout, separate Card money and Merchant money, and total card allowances remain. The new journeys create a card before offering it to its intended recipient, share exact cards/terminals by email or messaging links, return a new login to its invitation, and collect a public card payment without an Etail account.

## Data, access and accounting

Five additive migrations extend the existing card, invitation, identity, acquiring and ledger owners. All 22 migrations pass on the marked local test database. Explicit preview preparation applied the five additions and reported its completed seed as a no-op: saved cards, balances, permissions and user changes were preserved. No retired database, old project, external financial provider or customer-data import was used. Hosted migration and deployment are separate release gates.

The PostgreSQL suite passes 250 cases in 51 files; concurrency passes 42 in 13 files. This includes exact-card assignment, competing email claims, forwarded links, stale/current owner authority, cancellation versus acceptance, revocation, replay after the latest-30 history boundary, and independent terminal permissions. An accepted invitation is bound to one application person; a different login with the same provider-verified email cannot list or reopen it. Removing one cardholder does not widen or revive other cards.

New network payment coverage proves unauthenticated payment ownership, one-time link reservation before dispatch, capture versus availability, duplicate/reordered events, recovery after link revocation, exact original-source refunds, pending-refund reservation, and terminal-only payment-status recovery without funds authority. Historical internal-card accounting still has canonical domain fixtures and saved-review/receipt recovery; its old new-payment HTTP route and card chooser are retired.

## Verification record

All logs below are local ignored artifacts, not hosted acceptance. Runtime: macOS arm64, Node24.19.0, pnpm11.19.0, Next16.3.4, TypeScript6.0.3, native PostgreSQL18.6. Browser checks use the production build and the guarded fictional test database. Emails are handled by the isolated provider harness; no real messages are sent.

| Check | Recorded result | Artifact |
|---|---|---|
| PostgreSQL integration | 250 passed | `artifacts/d76-integration-full-second.log` |
| PostgreSQL concurrency | 42 passed | `artifacts/d76-concurrency.log` |
| Unit checks | 451 passed | `artifacts/d76-unit-final-third.log` |
| Executable API/adapter contracts | 12 passed | `artifacts/d76-contracts-final.log` |
| Email/session and invitation continuation | 28 passed, desktop/mobile | `artifacts/d76-email-browser-second.log` |
| Built HTTP API | 9 passed | `artifacts/d76-api-verified.log` |
| Desktop/mobile | All192 distinct cases pass across the final broad run and corrected affected runs (188 + 8 + 2, with overlap counted once) | `artifacts/d76-e2e-verified.log`, `d76-e2e-corrected-final.log`, `d76-e2e-navigation-verified.log` |
| Accessibility | 30 passed | `artifacts/d76-a11y-verified.log` |
| Scoped handoff helpers | 35 passed | `artifacts/d76-handoff.log` |
| Lint/types/architecture/security | Passed; no known dependency vulnerabilities | `artifacts/d76-*-verified.log` |
| Production Next build | Passed | `artifacts/d76-build-verified.log` |
| Netlify production packaging | Passed; Next build and generated server/API function bundled | `artifacts/d76-netlify-verified.log` |

Independent access review found no open actionable findings in its scoped current source and migration review; exact reviewed hashes and limits are in `artifacts/d76-access-final-review.md`. Identity/invitation review is in `artifacts/d76-identity-invitation-review.md`. These reviews supplement runtime tests and do not establish a live provider connection.

## Failures retained and corrected

- Initial full browser results were178/190. Six cases failed on both widths: three ambiguous recovery-alert locators, two old card-chooser journeys, and the blanket prohibition of the word sandbox in truthful network-card disclosures. Selectors now target the actual payment alert, public payment journeys use the new guest checkout, and public-page assertions require the exact disclosure while retaining the remaining internal/private-language ban.
- The final broad browser run passed188/192. Two converted historical-review cases failed at both widths: a fixture left the new Someone else default selected when it meant Me, and an assertion waited for the navigation it had deliberately held. The fixture now explicitly selects Me; the navigation check verifies the absence of payment controls before navigating and checks financial effects while loading, retaining no-confirmation/no-money and exact-receipt assertions.
- Initial API results were8/9: the retired-route list still included the deliberately restored guest-session endpoint. The corrected test verifies its reuse, CSRF, lack of service authority, and absence of payment/order/balance effects while all actual retired mutations still return404.
- Initial accessibility results were28/30: the new checkout lacked the shared consumer stylesheet, causing insufficient button contrast. Importing the existing stylesheet fixes button contrast and the status region’s screen-reader-only presentation; the unchanged axe checks must pass.
- The removed new-review route first caused an architecture unit failure. The guard now explicitly rejects application calls to the retired preparation command and permits only the saved review read/confirmation route. All451 unit cases pass.
- Early migration trigger planning and fixture version/identity mismatches were corrected before the250-case PostgreSQL pass. Applied SQL is immutable; the trigger correction is an additional migration, not an edit to an applied migration.

## Visual review

The first visual run captured24 card/invitation states and18 network-payment states at1440/390/320px. All42 passed automated accessibility, reflow, runtime and projection-preservation checks. Manual inspection found two refinements: the invitation-expiry select needed the existing44px field styling, and processing-only merchant states should say No completed payments yet rather than suggesting a first payment. Both display fixes are saved, along with removal of the stale sentence requiring a cardholder to sign in before making purchases. The final packaged application passes30 affected desktop/mobile/accessibility cases. Its separate recapture passes all42 states again (24 card/invitation,18 network checkout), including44px expiry controls, accurate processing copy and unchanged projections/ledger during screenshots. Manual review found no remaining blocking issues. Initial screenshots and review notes remain preserved. Final evidence: `artifacts/d76-card-visual-verified`, `artifacts/d76-card-visual-final-review.json`, and `artifacts/d76-network-visual-final`.

## Limits and release

The card product is modeled as Visa; fictional cards are not live Visa credentials. Public checkout currently uses deterministic Visa/Mastercard/American Express/Discover sample instruments with no PAN/CVC entry and no real charge. No Stripe account, live issuer/acquirer, external provider webhook or automated SMS/email-delivery transport is connected. A copied invitation, opened composer or closed native share sheet is never reported as delivered. Sign-in confirmation email uses the existing Identity integration.

Publishing follows a feature PR, exact-revision checks and the repository’s review requirement. No new visitor access, DNS, plan, Identity tenant or provider setting is part of this release. GitHub/Netlify release IDs and hosted checks are recorded after they actually complete; the prior deployed D75 remains current until then. A later code rollback must remain compatible with new unassigned cards and network-payment records; use a reviewed forward repair rather than restoring an earlier database over new activity.
