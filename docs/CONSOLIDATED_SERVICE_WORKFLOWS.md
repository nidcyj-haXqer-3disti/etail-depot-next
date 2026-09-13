# D79 — one workspace for each service

13 September 2026. The user asks to remove duplicate balance destinations, describe cards by use rather than names, and connect Merchant payments, people, terminals and channels under one menu. This overrides D77/D78 navigation only. D73 separate money, total card allowances and resource permissions; D76 network checkout and exact resource invitations; and D78 Merchant funding retirement remain unchanged.

## Published references and product decisions

Sources reviewed on 13 September 2026: [Amex US app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) groups account home, activity, account actions and selected-card controls. [Amex additional-card FAQs](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) retain separate cardholder access. [Revolut Business card names](https://help.revolut.com/en-CY/help/making-paymentsbusiness/cards-general/can-i-label-name-my-cards/business/) demonstrate purpose-based naming. These support account/card separation and nicknames; Etail is prepaid and does not inherit Amex credit repayment or promise anonymous network cards.

[Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics), [balances](https://docs.stripe.com/payments/balances), [payouts](https://docs.stripe.com/payouts), [team roles](https://docs.stripe.com/get-started/account/teams/roles), and [Payment Links sharing](https://docs.stripe.com/payment-links/share) support distinct payment records, available funds, payouts and team authority, with multiple sharing methods for one checkout. Stripe physical Terminal readers/locations are not Etail digital terminals. Consolidating the balance into Overview is an Etail simplification, not a claim that Stripe has this exact menu.

[CFPB guidance on remaining prepaid funds](https://www.consumerfinance.gov/ask-cfpb/if-my-prepaid-card-expires-do-i-lose-my-money-en-423/) describes ways to recover remaining funds, depending on the agreement. We retain a secondary return path for overfunding or canceled spending. This is a product decision, not legal advice or a universal method/fee guarantee.

Public documentation only was inspected for this slice. No private dashboard, private architecture or new full-video review is claimed.

## Cardholder workspace

Owner menu: **Account home / Cards / Activity / Account settings**. A recipient has **Preferences** instead of owner settings. There is no Account balance menu. Account home shows one canonical available balance, Add money, pending returns when relevant, and a subordinate Money activity link. Account settings offers owner-only **Return unused money**. Neither card allowance nor card-creation permission grants funding authority; canonical money capabilities authorize action links and server commands recheck access.

Owner card filters: **All cards / For your use / For others**. For your use retains OWN semantics, including cards received from another owner. For others retains MANAGED semantics: cards assigned to another person or ready for invitation within the actor's current owner authority. Recipients see their one authorized list without redundant filter controls. Card nickname and last four digits lead the list; assignment details remain available in private card details. Nicknames change presentation, never identity, eligibility or invitation binding.

## Merchant workspace

One menu: **Overview / Payments / Team & terminals / Channels / Settings**. Terminal-only users see **Your terminals** and permitted destinations. Selecting a terminal changes the task context inside that same workspace; it never opens a second full navigation menu.

The hierarchy is business → terminals → payment requests → sharing methods. People receive explicit terminal access. A terminal is a digital collection workspace, not a new merchant liability or physical reader. Owner-only fund controls remain separate from collection permissions.

Overview combines received-payment metrics, available money, pending payouts, Request payout, recent payments and a secondary incoming-settlement disclosure. Available money is current across dates; historical payment metrics identify their period. Multiple authorized businesses have separate labelled balances; selecting a business/terminal restricts the money context exactly. Never sum unrelated accounts or choose an arbitrary first account. Payments retains search/refunds/receipts/disputes/support. Team & terminals creates terminals and assigns people. Channels selects a permitted terminal and uses its existing payment-request lifecycle and seven sharing presentations. Settings groups business/payment configuration.

Saved section=funds destinations render Overview, preserving valid filters and return context. Canonical /money-accounts/:id routes remain focused amount → saved review → confirmation → receipt and history tasks with Overview/Account home active. No separate money navigation or duplicate task engine remains.

## Ownership and recovery

No database migration, reset or import is needed. Existing domain owners, immutable ledger, integer money, current authorization, funding/withdrawal intent IDs, operator settlement outcomes and exact receipts remain. Unknown responses retain their original request and immutable amount; denial hides private content; merchant navigation stays locked during unresolved commands. Saved reviews and history pages remain recoverable. The service overview uses server projections and existing commands only.

## Acceptance

Verify owner/recipient card scope, nicknames, top-up from Home, return from settings, review/reload/receipt/retry and denied reads. Verify one Merchant menu in every terminal task; overview payout/settlement paths; retained terminal/date/search/page context; team/channel links; no delegated fund controls; private support/disputes; inaccessible terminal handling. Run appropriate source, database, browser/mobile, accessibility and production build checks; capture the preserved preview read-only. Record actual results separately. D78 hosted publication is history and does not publish D79.
