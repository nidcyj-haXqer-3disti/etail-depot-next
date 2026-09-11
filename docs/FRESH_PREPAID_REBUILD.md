# Etail Depot prepaid service rebuild

D69 · 12 September 2026 · Prepaid replacement implemented and locally verified; hosted release acceptance remains separate. This is the active replacement specification, not a release or parity certificate.

## Product decision

Cards spend money added in advance. The named primary funds one Cardholder group and controls a limit for each person. Creating a card, accepting access or raising a limit never creates money. Cardholder and Merchant services remain independent. The primary sees their group; a secondary sees their own cards and spending records. The primary merchant oversees its submerchants; each delegate sees only authorized units.

This decision replaces the earlier starting-allocation demo and charge-card interpretation for the active sandbox. Existing commercial source documents remain historical requirements; this prepaid implementation does not silently implement borrowing, collateral, statement repayment or rewards. Exactly one policy evaluator, issuance owner, command receipt system and immutable ledger remain.

## Reference findings

Amex's consumer payment guide separates an account obligation from the payment made against it. Its amount, funding source, review and confirmation sequence is useful for Etail's Add money journey, but Add money is prepaid funding, not Pay bill. The Additional Member FAQ establishes separate logins, card activity and primary responsibility. Etail intentionally retains stricter record isolation. [Payment guide](https://www.americanexpress.com/en-us/resources/how-to-make-a-payment/), [Additional Member FAQ](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/).

The official US app page places card selection, relevant account actions and activity together. A 2025 app redesign review highlights guided setup, activation and continuity between tasks. Banking, travel benefits and Amex branding are not Etail capabilities. [Official app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/), [Upgraded Points illustrated review](https://upgradedpoints.com/news/amex-mobile-app-updates-2025/).

Amex Merchant Payments separates settlements, submissions, transactions, adjustments/chargebacks and reports. Its settlement guide shows expandable pending/posted groups and a settlement-to-transaction breakdown. This requires actual attributed financial records, rather than renaming a practice transfer. [Payment views](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html), [Settlement guide](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html).

The dashboard uses a location/date context; submissions expose sales batches and their financial attribution. Account management groups locations under the merchant hierarchy. Etail keeps a compact merchant selector through each task and separates customer payments from money deposited to the business. [Dashboard](https://www.americanexpress.com/us/merchant/support-center/payments/navigating-to-payments.html), [Submissions](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-submissions.html), [Merchant hierarchy](https://www.americanexpress.com/us/merchant/support-center/account-services/view-and-update-account.html).

The official UK merchant walkthrough's complete available auto-generated transcript (0:01–2:39 of 2:44) was read. Its actual player was inspected at 0:49 and 1:38, showing settlement expansion and transaction detail. It is January 2018 regional evidence, cross-checked against the current US guides, not proof of today's private portal. [Amex UK walkthrough](https://www.youtube.com/watch?v=_fRxW33FJVg).

D69 also inspected the complete available MagnifiedMoney walkthrough transcript (0:00–14:08), plus the player at 1:00 for the home screen and 3:49 for spending by card member. This January 2022 third-party video is historical, regional illustration, cross-checked with current official guidance. It supports account/card selection and person-attributed activity; it does not prove current private portal behavior or Etail parity. No full transcript is reproduced. [MagnifiedMoney walkthrough](https://www.youtube.com/watch?v=3BsVlemlIa4).

## Customer experience

Visual direction: a restrained blue service navigation, white working surfaces, clear account selector, generous readable type, precise money labels and compact reconciliation tables. Use Etail assets and original text. Remove the previous promotional side panels, repeated descriptions, global invitation menu and customer-authored purchase simulator.

After sign-in, show only Cardholder services and Merchant services plus account support. Incoming access is reviewed in its relevant service context, with explicit acceptance; it is not a third product or a required post-login step. Identity enrollment does not grant financial service access.

Cardholder navigation: Home, Cards, Activity, Cardholders and Requests (primary), Add money (primary), and Account services. Cards are selected with explicit own/managed context. Primary home shows actual group funds and the selected person's spending allowance. Secondary home shows only their allowance and own card activity. Card creation asks for holder, name and format; funding and limits are separate tasks. Cards can exist unfunded. Freeze controls remain alongside card status.

Add money: choose the fixed Sandbox bank source, enter exact USD amount, save a review with its own URL, confirm, receive a durable receipt, and see the server-confirmed group balance. No real account details are entered. Unknown or malformed success responses retain the original operation identity; retry never creates a second top-up. Current access is rechecked on retry, unavailable private funding details are hidden, and a spending-limit retry remains its original PUT rather than a funding action.

The initial spending control is a monthly limit per person per group, shared across all of that person's cards. The UTC calendar month and the rule that refunds restore funds but do not restore gross monthly allowance are disclosed beside the control and review. These are explicit Etail sandbox rules, not inferred Amex economics. Lowering a limit below already-spent amounts leaves zero remaining allowance. There is no automatic limit reset job.

Available to a person is the smaller of remaining monthly allowance and actual group funds. Limits are ceilings, not reserved money, and must never be summed as balances. Secondary responses omit group totals, funding sources, top-up history and other people; spendability can necessarily reveal a bound on shared funds when funding is insufficient.

A purchase starts at the merchant's published checkout, using an authenticated card belonging to the payer. The dashboard never asks customers to type a fictional purchase description. A linked card activity and merchant payment commit together. A receipt links back to that exact payment; refund returns to its original funding group.

Merchant overview preserves primary/network or exact-unit selection and dates, with Funds & deposits and Merchants & people. The selected merchant has Payments, Collect payments, People, Account services and Help. Payments distinguishes transactions, refunds and deposits. Deposits show their exact included sales/refunds and saved processing state. Collection asks for purpose/amount, one-time or reusable use and sharing presentations; publication is not email/SMS delivery. People/submerchant management stays in the Merchant service. Current money labels are Awaiting settlement, Processing, Returned deposits and Sandbox bank balance; historical completed deposits are separate period activity.

## Financial and data contract

New service-level `GROUP_AVAILABLE` position: no card or merchant ID; nonnegative USD minor units. Only an explicit `GROUP_FUNDING` event adds new money from the simulated external source; a linked refund returns previously spent principal. Card creation posts no journal. A purchase debits group funds and credits a card-attributed spent position, subject to current holder authorization, freeze and shared person limit. A linked merchant journal records the counterpart in the same database transaction.

`cardholder_spending_limits` keys `(serviceId, personId)` and owns its own version. Membership versions retain access lineage. Immutable limit-change records identify the actor and before/after values. Usage derives from immutable gross approved purchase principal, across all cards in that service/person and the authoritative UTC month. New cards, revoked/reaccepted access, refunds and changed limits never erase usage.

Top-ups have a durable immutable record and exact journal provenance. Command identity is checked only after current authorization. Service-level workspace locks serialize funds, limits and purchases. Connected payment commands acquire all participating service locks in sorted order before merchant/channel/order/card locks. One database time sampled after locks governs both usage eligibility and purchase attribution.

Settlement/deposit state has saved batch membership, attributable principal, immutable events and balanced ledger effects. An initial review binds all eligible unsettled/unrefunded payments; changed membership rejects the token. The explicit request settles the batch and reserves its exact amount as PENDING. Only a separately assigned deposit operator records COMPLETED to Sandbox bank or FAILED back to settled funds. There is no customer simulator or arbitrary instant transfer.

Pending deposits block refunds and another deposit against those funds. Before settlement a refund uses Merchant available funds; after failed processing it uses returned settled funds; after completion it uses Sandbox bank funds. Every full refund atomically credits the original Cardholder group without restoring gross monthly allowance. After failure, a new reviewed deposit may contain only remaining unrefunded items in the original settlement. Later sales stay separate and previous deposit items remain immutable. A changed refund/history state requires a new review; pending/completed or empty batches cannot be paid again.

## Replacement and verification

The user authorizes replacing both fixed active local preview and test generations. D69 preserves their original OIDs/records under `etail_depot_next_services_preview_retired_d69` and `etail_depot_next_services_test_retired_d69`, with `ALLOW_CONNECTIONS=false`, after fixed-target/runtime/owner checks and private preservation receipts. New databases reuse only the two fixed active names with generation `fresh-services-d69`; retained older databases, hosted Database and Identity stay outside this replacement. This is catalog retirement and fresh preparation, not deletion, old-row import or ledger repair.

Append migrations; never rewrite deployed history or disable immutable-ledger guards. Before seeding, allow only the verified migration receipts and the single immutable D69 cutover configuration row. The canonical seed explicitly funds the group, sets person limits, issues unfunded cards, pays published requests, refunds and processes a reviewed deposit. Completed preparation never overwrites user edits, and preview startup never migrates/seeds. See [tools/README.md](../tools/README.md) for the exact boundary.

Deliver one connected acceptance: sign in → create group → add funds → set person limit → issue unfunded card → pay at published merchant checkout → matching scoped activity/receipt → refund to original group → settlement → deposit reconciliation. Verify primary/secondary and primary/delegate isolation, retry recovery, currency precision, concurrent spend/limit/refund/transfer races, responsive layout and accessibility. Passing old demo tests is not acceptance of this flow.

Current status: the reference and money-model decisions are implemented and locally verified on the fresh generations. [D69 evidence](PREPAID_REBUILD_EVIDENCE.md) records 179 distinct API/browser/accessibility cases, 24 email/session cases, 33 unchanged-state visual views, database/concurrency checks and offline packaging. D68 results remain history. The preview is ready for review; this does not claim a hosted D69 release or 100% Amex parity.
