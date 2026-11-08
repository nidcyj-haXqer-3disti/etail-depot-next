# Three-account Merchant redesign: Amex reference and Etail decisions

Researched **2026-09-09**. The latest user instruction establishes exactly **PERSONAL, HOUSEHOLD and MERCHANT**, replacing SELLER. This instruction supersedes earlier account-label and Seller-only assumptions in the [merchant research](MERCHANT_AND_OPERATIONS.md), [business audit](MERCHANT_360.md) and [front-end reference](FRONTEND_EXPERIENCE.md). Their historical findings remain references, not current Etail account definitions.

This document refreshes public Amex merchant workflows and proposes the next Etail experience. It does **not** assert that the proposed payment simulator, gateway management or three-account migration is already implemented. Existing local merchant relationships, access and channel drafts are the starting point. No authenticated Amex session, application, payment, refund, signup or message was performed. No private Amex architecture is inferred.

## Primary evidence refreshed

All ten linked sources were opened and read on the research date. Evidence is public help text or PDF text, not a newly exercised interface. Earlier screenshots were reviewed through the existing local research; no new visual or mobile-app walkthrough was conducted. U.S. examples concern Amex's Merchant website; the mobile-app reference is explicitly Australian and limited. Unstated publication dates remain unknown; access dates and search-engine crawl dates are not release dates.

| ID | Primary source and precise locator | Observed behavior and useful boundary |
|---|---|---|
| T01 | [Viewing Transactions](https://www.americanexpress.com/us/merchant/support-center/payments/view-transactions.html), Transactions section | U.S.; date unstated. Location/date filters, configurable columns and downloadable transaction data support investigation from a stable list. This is a reporting view, not proof of a portal payment-creation command. |
| T02 | [Viewing Your Settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html), settlement breakdown | U.S.; date unstated. Pending/posted settlements expand into deductions, bank-paid amounts and transaction detail. Preserve the distinction between a sale, a settlement and payment to a bank. |
| T03 | [Manage Locations](https://www.americanexpress.com/us/merchant/support-center/account-services/manage-locations.html), product enrollment and Account Actions | U.S.; date unstated. A location's Payments, Disputes and Account Services enrollment is distinct from adding/removing it from a user's profile. Profile visibility is not merchant creation or closure. The current page describes a merchant-ID export; it does not establish an editable people directory. |
| T04 | [Merchant Site Terms of Use](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/terms-and-conditions.pdf), §6, pp6–7; §12, pp9–10 | U.S.; last modified **2025-10-31**. Roles and access levels are separate. Dependent-location disputes can be centrally managed or locally managed; local management leaves the parent with review access rather than response authority. Courtesy emails are not guaranteed. These arrangements are program evidence, not an Etail preset. |
| T05 | [Disputes Summary Table](https://www.americanexpress.com/us/merchant/support-center/disputes/disputes-summary-table.html), summary, filters and three views | U.S.; date unstated. Response-needed cases lead, ordered by deadline; review-in-progress and closed cases have separate views. Cases expose reason, amount and type. Inquiry and chargeback distinguish whether a debit has already occurred. |
| T06 | [Agreeing with a claim and issuing a full refund](https://www.americanexpress.com/us/merchant/support-center/disputes/agreeing-with-cm-claim-full-refund.html), response steps | U.S.; date unstated. The response distinguishes authorizing a chargeback from crediting the cardholder directly, with comments and confirmation. This does not establish a general-purpose refund button in the ordinary transaction list. |
| T07 | [Contact Information and Alerts](https://www.americanexpress.com/us/merchant/support-center/account-services/online-account-contact-information-and-alerts.html), View/Edit Alerts | U.S.; date unstated. Payment, dispute and marketing preferences are separate; enrolled services affect which alerts appear. Some destination settings differ. An alert preference is not authority to access a case or financial data. |
| T08 | [Edit Bank Information](https://www.americanexpress.com/us/merchant/support-center/account-services/edit-bank-information.html), account selection and verification | U.S.; date unstated. The change identifies affected credit/debit accounts and verifies the user before replacement information is entered. This supports a focused sensitive-change review, not copying bank-data collection into Etail's local sandbox. |
| T09 | [Payment Facilitator acceptance factsheet](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/Payment-Facilitator-FactSheet.pdf), p1 definition and OptBlue relationship | U.S. program document; date unstated. It describes a facilitator serving sponsored merchants through a certified OptBlue participant, with a merchant-of-record/settlement role. Ordinary merchant reporting access does not confer that role. Published volume thresholds are deliberately not adopted as current Etail eligibility rules. |
| T10 | [Australian Shop Small merchant page](https://www.americanexpress.com/au/shop-small/small-business.html), “Do business on the go” block | Australia; page includes **2020/2022 campaign material**. It promotes an Amex Merchant App for payment information using an Online Merchant Account. Store links failed in this research tool. Current app availability, release, dispute/refund features and U.S. availability were **not verified**. |

The refresh did not substantiate a current U.S. native Merchant App or a complete public delegated-user administration walkthrough. Corporate @ Work, FX International Payments, Vendor Pay and merchants' own SafeKey-enabled apps are different products; their controls were not silently substituted for Merchant Online.

## Product interpretation: one account experience with three levels of responsibility

The following is **Etail's proposed design**, not an Amex account taxonomy or regulatory classification.

| Account | Everyday experience | Responsibility boundary |
|---|---|---|
| Personal | Own cards, own activity and a short Get paid journey for an explicitly accepted collection unit. | Limited collection permissions do not expose the responsible Merchant's other units, users, routing or balances. A private account does not become a payment facilitator. |
| Household | Shared card management, participant controls and named shared collection units; delegate useful tasks to specific people. | Household membership and permission to collect are distinct. Collection access does not reveal anyone's private Personal activity. Supervised access cannot create independent borrowing or administrative authority. |
| Merchant | Payments, collection units, channels, refunds, disputes, settlements, people and payment setup within one account shell. | The responsible Merchant operates its own and explicitly linked Personal/Household collection units. Its facilitator/gateway role is an Etail sandbox model until a supported live program is separately approved. |

Retain the user's previously confirmed attribution rule through the rename: the responsible Merchant bears sales, fees, refunds and chargebacks; each collection unit has one immutable responsible parent. Multiple Merchant relationships for one Personal/Household host use distinct units. A user must select the relevant unit; do not pick the first Merchant or infer consent from a shared login.

T01–T05 suggest the front-end structure, not three separate applications. Keep account name/type visible, preserve filters when opening a payment or case, and put the next action beside its explanation. On mobile, show a compact amount/name/status/date row and open details; do not require desktop-width financial tables. T10 only supports interest in mobile access, not a particular current native layout.

Use a short Merchant navigation: **Overview, Payments, Get paid, Disputes, People, Settings**. Get paid contains channels and collection units. Payments contains transactions and settlements; Settings contains payment setup and alerts. If separate Payouts or Reports destinations become necessary, add them when their working workflows justify them. Advanced processing controls belong to authorized Merchant staff, not every Personal collector.

## Make the sandbox finish real user tasks

These are proposed acceptance journeys. Their database effects must be implemented and tested before the interface claims success.

| Task | Working sandbox sequence and durable result | Essential failure or scope check |
|---|---|---|
| Prepare collection | Name a channel → choose one-time/reusable use, amount, expiry and presentations → review the named collection unit → save → enable for test collection when its test configuration is ready. | Saving never implies publication. A disabled or expired unit cannot collect. Keep an uncertain save tied to the original request. |
| Take a practice payment | Open the test collection page → review payee and amount → use a fictional payment method → submit → show the saved payment and a test receipt after successful processing. | A browser return, QR scan or email preview is not payment evidence. One purchase retains one order through all presentations and retries; a reusable channel creates a distinct order for each deliberate purchase. |
| Refund a payment | Open the payment → show refundable amount and prior refunds → choose amount/reason → review → submit → show pending or completed test refund and its effect on the same payment. | Prevent concurrent over-refunds. A dispute response must not also create a second credit for an already refunded amount. T06 motivates separating intent from money movement. |
| Respond to a dispute | Open a due case → read disputed payment, reason, deadline and existing credits → choose response → review → submit → retain response, next actor and final test outcome. | One explicit responder owns the case; Merchant oversight and delegated response authority differ. Preserve already recorded debits and late evidence. T04–T05 inform this division. |
| Explain settlement | Open a pending or completed test settlement → see included sales, refunds, configured fees, reserve movements and adjustments → follow its payout reference. | Every component references its business event. A failed payout leaves a visible unresolved obligation. Never equate gross sales with available money. T02 is the user-facing benchmark. |
| Manage access | Choose a collection unit and person → select actions and delegation ceiling → review → recipient accepts → show effective access and expiry → revoke when needed. | Read access is not refund authority. Removed access blocks new work without deleting history. A Household helper never becomes a Merchant account member implicitly. |
| Configure processing | Authorized Merchant staff select the named **test processor**, supported currency/methods and fictional destination → review affected units → save → see test readiness and history. | No real credentials or bank numbers. Test readiness must not flip real verification or production-acceptance flags. A later route change cannot move historical refunds or disputes to another merchant. |
| Stay informed | Save event preferences → create a relevant test event → receive an in-app alert → open its permitted payment/case → mark it read. | External delivery remains off unless separately configured and authorized. Missing email does not remove a case from the work queue. T04/T07 support this separation. |

The sandbox should not be a collection of permanently blocked buttons. Implement an explicit local test configuration that allows its supported workflows to complete through the same owning commands and event handlers. Maintain a separate live-readiness gate for provider identity, registration, acceptance, settlement and production credentials. One visible **Sandbox · No real money** marker, reinforced at payment/refund confirmation and on test receipts, is sufficient context; ordinary screens need clear tasks and results.

Simulation must be reproducible: a saved scenario selects success, decline, delayed confirmation or failure; its events survive reload, and replay cannot duplicate money effects. Use exact minor-unit amounts, approved sandbox fee rules and one ledger for simulated monetary postings. React renders the resulting balances and statuses. Do not simulate completion by changing display text or inventing bank deposits.

## User language and release gates

| Keep internal | Show the person |
|---|---|
| MASTER/SUB, merchantUnitId | Merchant name; “Managed by [Merchant]”; collection-unit name |
| Capability or assignment lineage | What this person can do; who gave access; expiry |
| Provider binding and projection | Payment setup; test processor; supported payment methods |
| Command receipt, idempotency conflict | Saved result; “This changed. Review the latest details.”; retry the same action |
| Mock approval / fictional legal verification | Ready for test payments; live verification not connected |

Do not import Amex's product names, role names, bank-enrollment mechanism, response deadlines, settlement timing, limits or program economics as Etail rules. T09 establishes a separate program boundary, not live authorization. No public source establishes Amex's private case assignment, database, ledger, gateway configuration or permission implementation.

Before calling the redesign working, demonstrate: each account's intended scope; two-sided collection consent; a delegated helper completing only allowed work; one channel-to-payment-to-refund/settlement journey; a dispute with a persistent response/outcome; expired and revoked access; duplicate/uncertain payment recovery; a failed payout; and consistent test labels on mobile and desktop. Preserve prior IDs, amounts, history and revocations during the SELLER→MERCHANT migration. Record execution evidence separately from this research and from any future live-provider certification.
