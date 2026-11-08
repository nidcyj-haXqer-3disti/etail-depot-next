# D78 — clear account, card and merchant workspaces

13 September 2026. The user rejects the authenticated footer, ambiguous card/account selection, generic Merchant wallet actions and competing terminal creation/opening controls. This is the current experience and funding-policy override to D77. D73 separate balances, per-card total allowances and owner/resource isolation remain; D76 resource-first invitations and external-card checkout remain. American Express is the cardholder reference; Stripe is the merchant reference.

## Evidence and interpretation

The following official public resources were read on 13 September 2026. They inform interaction patterns, not private architecture, product parity or connected payment rails.

| Source | Observed pattern | Etail application |
|---|---|---|
| [Amex US app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) | Explicit account switching, direct card freeze controls; public navigation separates Account Home, Statements & Activity and Account Services. | Separate account overview from a named card detail. Keep selected card, available spending and controls together. |
| [Amex employee cards](https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/employee-cards/) | Additional-card listing, creation and individual spending controls are grouped. | One Cards destination owns creation, recipients, controls and history. |
| [Amex US additional-card FAQ](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) | Separate recipient logins and own-purchase visibility; this Amex product also exposes account total balance to additional members. | Adopt own-card visibility and clear holder identity; retain Etail's stricter rule hiding owner balances from invited holders. |
| [Stripe Web Dashboard](https://docs.stripe.com/dashboard/basics) | Distinct overview, balances, customer transactions and product tools; personal, account and product settings have different scope. | Separate daily payment work, payment links, terminal administration and owner payouts. Place personal profile/help in the global account menu. |
| [Stripe balance types and settlement](https://docs.stripe.com/payments/balances), [Payouts](https://docs.stripe.com/payouts) | Pending/available proceeds, settlement timing and payout scheduling have different meanings. Stripe also supports top-ups in certain contexts. | Describe existing Etail settlement and payout commands accurately. Removing routine merchant top-up is an Etail product decision, not a claim that Stripe lacks it. |
| [Stripe Payment Links](https://docs.stripe.com/payment-links), [Terminal](https://docs.stripe.com/terminal/smart-readers) | Payment links are collection tools; Stripe Terminal concerns physical readers. | Keep Etail's seven link presentations. Etail terminals are logical collection workspaces, not implied hardware devices. |
| [Stripe team roles](https://docs.stripe.com/get-started/account/teams/roles) | Operational work and financial authority can be assigned separately. | Preserve narrower Etail permissions: terminal users collect and service their records; only owners settle, refund or request payouts. |

This is a targeted public workflow review. No private Amex/Stripe login, new full-video viewing, proprietary architecture access or measured parity is claimed. Public image-fetch failures are not screenshot evidence.

## One navigation system

The authenticated shell has the two service destinations and one **Profile & help** disclosure containing Your profile, Sign-in & security, Help center and Sign out. It has no footer, copyright bar or footer support navigation. The public marketing footer remains a public-page component. Profile holds identity information; financial work stays inside its service. Contextual payment disputes and private support cases remain part of the affected record's workflow.

The disclosure uses native keyboard behaviour, Escape dismissal, an accessible name and visible focus. It remains usable at 320 px. Moving Sign out into the menu must not change its timeout, acknowledgement validation, session revocation or retry behaviour. Pending Merchant operations still prevent navigation and sign-out through the existing boundary.

### Cards & spending

| Destination | Responsibility |
|---|---|
| Account home | Owner's actual card-account balance and exact-account recent activity/counts, independent of any card received from another owner. Invited holders receive their own-card overview without owner money. |
| Cards | One searchable, paginated card list. One category control: All cards / Cards in your name / Cards for others. One Add card action; cardholders and saved card history stay here. |
| Named card | Cardholder first, nickname/ending, available spending, total allowance, permitted Freeze and management. Clear return to Cards. Received cards identify their account owner. |
| Activity | Authorised account/card activity and exact receipt investigation. Never widen to unrelated received-card or owner data. |
| Account balance | Owner-only Card money funding and existing withdrawal lifecycle. Creating or assigning cards never adds money. |
| Account settings / Preferences | Account information and permitted notification preferences. Personal login tools live in the global account menu. |

`OWN` continues to mean the signed-in person is the actual holder; `MANAGED` means another or not-yet-assigned holder within current authority. They are list filters, not card products or permission grants. Unassigned and revoked cards have explicit lifecycle labels. Do not duplicate category filters, group headings, nested All cards tabs and a mixed card dropdown on the account home.

The server supplies an exact owner-account overview. Existing global dashboard activity spans authorised services and is limited; filtering that limited result in React would be incorrect. Scope before ordering/limiting, and compute counts for that exact account. Never sum allowances as money. Invalid, revoked or duplicated URL selection remains an explicit unavailable state; do not substitute an unrelated first card.

### Accept payments

| Destination | Responsibility |
|---|---|
| Overview | Recent payment activity, incoming proceeds and relevant next steps. |
| Payments | Search/filter payments and refunds; exact receipt links and preserved return context. |
| Payment links | Create, publish and share through all seven presentations within an explicit authorised terminal. Reuse the existing channel command and renderer. |
| Team & terminals | Owner administration and one Create terminal action. Existing terminals are named links; recipient navigation shows only assigned terminals. Invitations remain attached to a created terminal. |
| Balance & payouts | Owner-only incoming/ready-to-settle collections, available proceeds, processing payouts and exact histories. |
| Settings | Merchant or selected-terminal configuration according to current authority. |

Terminal selection is an explicit record scope, not a second account product. If multiple terminals are authorised, require a meaningful choice for collection actions. Do not pick an arbitrary first terminal. Creating a terminal and viewing an existing one must have distinct names and placement. Existing exact terminal invitations, operational capabilities and pending-navigation recovery remain.

## Merchant proceeds and retired top-ups

The implemented sequence remains: payment network processing → terminal collection → owner-reviewed settlement into the merchant money account → owner payout request reserves available proceeds → separately assigned operator completes or fails the payout. A failed payout releases the reservation. Do not relabel terminal settlement as a completed bank payout, hide unsettled money, invent automatic settlement, or promise bank destinations/arrival times that are not implemented.

Routine **Add money** is removed from Merchant eligibility and new funding writes. This is enforced on the server using the money account's service kind, not merely hidden in React. Card funding remains unchanged.

Historical Merchant top-up rules:

1. Saved reviews and receipts remain accessible to the current authorised owner.
2. A new request or an old unconfirmed review cannot post a new Merchant top-up.
3. A replay whose financial effect already posted returns its exact original receipt after current authorisation, preserving recovery from an unknown response.
4. Rejection creates no new command effect, top-up or journal. Existing immutable history is not rewritten.

The existing withdrawal owner remains the single payout command. Present its amount, review, reserved status and receipt in merchant language. Payout history is projected from saved withdrawal records and their current events, not inferred solely from available-balance journal activity. Payout history and Balance activity are separate URL-backed tabs; switching a tab resets its page, and receipts retain the selected history and return context. A failed incoming-payment read shows an explicit retry state only after money-account access is rechecked; it must not turn an error into an empty successful result. Preserve immutable command IDs, response schemas, saved URLs, validated payment filters and uncertain-result retries. No migration or provider reset is planned.

## Implementation and acceptance

Use the existing modular monolith, policy engine, command owners and ledger. Extend the existing dashboard projections and executable response schemas only where the corrected views require it. Regenerate contracts after source changes. Financial amounts remain server-owned integer minor units; UI derives no authoritative funds or permissions.

Verify owner without a personal card, owner who receives another account's card, recipient with multiple cards, exact owner-account counts/activity, pagination, unavailable focus, funding and card-control recovery. Verify terminal creation versus selection, all link formats, delegate isolation, owner settlement/payout history, retired top-up denial and posted-receipt recovery. Test utility-menu keyboard/mobile behaviour and sign-out recovery. Run impacted unit/PostgreSQL checks, full maintained API/browser/accessibility checks, lint/types/architecture/security and production packaging. Capture 1440/390/320 px views without changing saved preview records.

Candidate starts from local `71776c77e8225e077a7727d4b696f450b0dcd95b`, tree `280f88646cf8a33c2da732e6dedec7f0597df6ce`, identical to published D77 merge `a799ad663db454474c13d5b75d3ff392841458d8`. Work is on `codex/service-dashboard-clarity`. Record actual completed checks and source/deployment identity separately; this design is not evidence of a completed release.

Final recipient detail: Cards starts with search and the authorized card list. Owner-only Card management and Card ownership controls are omitted for invited holders because their All/Own scopes contain the same authorized cards. Saved inapplicable managed-card links have an explicit View your cards recovery.

Final Merchant detail: named terminal links use explicit arrows, underlines and comfortable touch targets. Invited terminal users see optional business enrollment collapsed on Overview only. Zero incoming payments and unavailable incoming reads use different copy.
