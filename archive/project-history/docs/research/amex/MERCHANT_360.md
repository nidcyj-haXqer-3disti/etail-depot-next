# Merchant operations: a 360 business and product check

Research date: **2026-09-08**. This is a business audit: who does the work, what the customer sees, who owes or receives money, and how an unresolved problem gets finished. It does not propose vendors, databases or technical architecture.

The earlier merchant comparison concentrated on applications, account editing, payment reports and disputes. Those remain useful, but a complete operating journey also needs acceptance and fulfillment, recurring cancellation, missing deposits, reserves, merchant shortfalls and closure. The [24 detailed checks](merchant-360-checks.json) make those missing connections visible. Their evidence classifications describe public Amex coverage: **12 documented, 9 partial and 3 gaps**. They are not application-completion scores or a claim to cover every Amex product.

## Scope and responsibility

Use U.S. merchant behavior as the baseline and preserve the distinction between direct Amex merchant servicing and a merchant-services-provider/OptBlue arrangement. The public OptBlue overview makes the provider relationship central; its rates and combined servicing are not a promise that every direct Amex portal function appears in a provider's portal. [M27: OptBlue](https://www.americanexpress.com/us/merchant/optblue.html)

The public U.S. policy page points merchants to signed-in terms/regulations and describes an April/October publication cycle. This pass did not inspect those private materials. A generally indexed policy is not automatically the current agreement for the Seller. [N01: policy access](https://www.americanexpress.com/us/merchant/merchant-regulations.html)

For Etail, every Seller should be able to answer these business questions:

| Responsibility | Required customer understanding |
|---|---|
| Legal merchant | Who sold the goods/service and is responsible for fulfillment, returns and the merchant obligation? |
| Merchant-services provider/acquirer | Who accepts the Seller into the program and handles submission issues and dispute responses? |
| Funding party | Who owes the settlement/payout, can explain deductions, and traces a missing bank deposit? |
| Destination bank | Where should the money arrive, and who investigates a rejected, returned or missing deposit? |
| Card issuer | Who explains the buyer's approval, hold, statement charge, credit and cardholder dispute? |
| Authorized Seller staff | Who may view, refund, answer disputes, change bank information, manage users or close the account? |

These are proposed Etail responsibility statements. The same company may perform several jobs, but the product must still distinguish the jobs. Seller approval does not create a spending facility. Seller team administration does not confer refund or payout authority. A guardian-funded participant cannot independently become a merchant; the existing responsible-party rules remain in force.

## Public evidence added in this pass

The publicly linked **2024TPP disputes guide** is expressly aimed at merchants contracted with a Merchant Services Provider. It includes examples of expired authorization, late/duplicate submission, partial non-receipt, cancelled recurring billing, incorrect debit/credit treatment and inadequate responses. Its reply deadline comes from the provider, rather than one universal number. These are useful operating risks to test; they are not permission to import every industry rule or a current negotiated time limit. [N02: guide, pp.2, 7, 27–63](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/tpp/manage-disputes/Amex-TPP-Disputes-Reference-Guide.pdf)

The public learning hub links the cardholder and merchant perspectives, including understandable charge identification and pending-refund visibility. [B01 in the business source register](business-360-sources.json) records that evidence. The Etail checks use that relationship without promising that an ordinary refund submission is already a posted credit. [B01: learning hub](https://www.americanexpress.com/us/merchant/tpp/manage-disputes.html)

The earlier [merchant study](MERCHANT_AND_OPERATIONS.md) supplies the detailed portal observations and M01–M30 citations. This audit references that evidence rather than republishing its full field lists. Settlement, dispute-summary and account-update pages were rechecked during this pass.

## The operating journey

The table is the **proposed Etail business check**, not a claim that Amex exposes every action in precisely this sequence. Full actors, normal flows, exceptions, issuing/control handoffs and fictional acceptance scenarios are in the accompanying JSON. A `documented` task still requires verification of Etail's implementation.

| Check | Journey and the outcome to verify | Evidence |
|---|---|---|
| MER360-01 | Choose the program, responsible Seller, permitted activity and parties handling money/help | Partial |
| MER360-02 | Resume an application, supply missing information and understand activation or refusal | Partial |
| MER360-03 | Set up locations with clear submitting and receiving relationships | Documented |
| MER360-04 | Give, review and revoke each merchant team member's permitted work | Documented |
| MER360-05 | Make seller identity, sale terms, price and receipt recognizable to the buyer | Documented |
| MER360-06 | Explain an approval, decline, cancellation, partial decision or uncertain payment | Partial |
| MER360-07 | Handle delayed/partial fulfillment, advance payments and cancelled orders | Partial |
| MER360-08 | Operate recurring billing and give an effective cancellation result | Documented |
| MER360-09 | Review submissions and correct late, duplicate or partly failed delivery | Documented |
| MER360-10 | Distinguish a completed sale from pending settlement and usable funds | Documented |
| MER360-11 | Explain every fee, credit and other deduction, including a questioned charge | Documented |
| MER360-12 | Explain withholding, review rights and reserve release conditions | Gap |
| MER360-13 | Explain a merchant shortfall and who must resolve it | Gap |
| MER360-14 | Follow payout through the funding party to the bank; trace missing/returned money | Partial |
| MER360-15 | Change bank/contact/business details and know when the change is effective | Partial |
| MER360-16 | Refund all or part of an ordinary sale and follow the buyer's credit | Partial |
| MER360-17 | Receive an inquiry, assign a responder and identify the required reply | Documented |
| MER360-18 | Handle an upfront chargeback without confusing a debit with case closure | Documented |
| MER360-19 | Submit usable evidence and repair late, rejected or insufficient responses | Documented |
| MER360-20 | Account for a prior or partial refund before agreeing a dispute resolution | Documented |
| MER360-21 | Close the dispute and separately verify its resulting money | Partial |
| MER360-22 | Reconcile a period and retrieve correctly scoped statements/reports | Documented |
| MER360-23 | Restrict/close new activity while finishing refunds, disputes and other obligations | Gap |
| MER360-24 | Get help, escalate a complaint and keep a named party responsible | Partial |

`comparison_ids` maps each check to related AX rows in the earlier 90-task catalog; an empty list identifies a task without a distinct matching row. These mappings do not silently change that catalog's denominator or make a broad new check equivalent to one old point.

## The handoffs that must work together

**Acceptance → issuing.** The buyer needs a truthful payment outcome; the Seller needs to know whether it can proceed. A lost response must not lead staff to ask for another payment while the first may have succeeded. The buyer's authorization hold, final charge and refund remain different stages. This is the proposed MER360-06/09/16 review, using the existing [Etail workflows](../../WORKFLOWS.md), not a new Amex processing specification.

**Settlement → Seller funds → commercial spending.** A Seller should see why money is unavailable: still pending, withheld, disputed, promised to a refund, committed to payout, or explicitly pledged to its commercial spending. These reasons are not interchangeable. The [Etail product contract](../../PRODUCT.md) already excludes pending/reserved/disputed money from backing and requires an explicit pledge. A payout or refund request cannot quietly consume that same backing.

**Inquiry/chargeback → response → money.** A case explains who acts next, the reply-by source and whether the Seller has already been debited. A response receipt is not a win. A win is not proof the reversal has reached the Seller. Existing portal evidence differentiates dispute work and adjustments; the new checks require the staff and customer explanations to stay consistent. [M12: dispute summary](https://www.americanexpress.com/us/merchant/support-center/disputes/disputes-summary-table.html), [M07: adjustments](https://www.americanexpress.com/us/merchant/support-center/payments/navigating-adjustments-and-chargeback-data.html)

**Account changes → unfinished money movement.** A bank-change request must explain which destination applies to money already being delivered. A failed change cannot be presented as effective. Legal-party changes, bank changes, contact changes and user removal require different responsibility decisions. The current public observations do not resolve every timing or approval detail. [M20: bank changes](https://www.americanexpress.com/us/merchant/support-center/account-services/edit-bank-information.html), [M23: change status](https://www.americanexpress.com/us/merchant/support-center/account-services/view-account-updates.html)

**Closure → continued servicing.** The proposed Etail exit path stops the relevant new activity while preserving owners for outstanding orders, refunds, disputes, reserves and money traces. Closing a Seller does not erase the buyer's problem or a separate Seller spending obligation. This requirement comes from Etail's exit workflow; it is not asserted as the complete Amex U.S. termination process.

## A single fictional walkthrough to review first

Use one Seller with an owner, cashier, bookkeeper and dispute responder; the buyer need not have an Etail account. This example uses **fictional amounts and terms**, not Amex pricing or reserve policy.

1. A buyer purchases 100 dollars of goods. Interrupt the confirmation once. Both sides can recover the same sale, understand its status and receive an identifiable receipt.
2. Settlement later shows a fictional 5-dollar fee and 20-dollar reserve, leaving 75 dollars eligible under the scenario's terms. The Seller sees all three amounts and why the reserve is unavailable.
3. The Seller explicitly pledges 25 dollars to commercial spending. Only 50 dollars remain available for other permitted uses; viewing the same funds in two screens does not make two pools.
4. The buyer requests a 30-dollar refund. Staff first establish whether the 50 dollars are still available or already committed to a payout. They explain the refund's progress and resolve any funding shortfall without silently consuming protected backing.
5. A 20-dollar dispute then arrives. The dispute responder sees whether it overlaps the refund, what evidence is needed and who is responsible. The bookkeeper follows the final credit/debit independently of the case label.
6. The owner changes the bank destination and requests closure while work remains open. Pending changes, unresolved obligations and the responsible support route remain visible; no screen promises completion prematurely.

The first review should answer every handoff in this example using business language. If the team cannot explain who owes what, who acts next or why funds are unavailable, adding more screens will not finish the product.

## Decisions and evidence gaps to resolve

- **Reserve policy:** reason categories, notification, review, release conditions, applicable amounts and post-closure handling. No universal Amex U.S. formula or release interval was established.
- **Merchant shortfalls:** liable party, repayment/offset permission, notices, restrictions, failed recovery and treatment after closure. Do not borrow consumer checking overdraft terms.
- **Payout promise:** what “paid” means, expected timing, holidays/cutoffs, missing-deposit tracing, returned funds and a destination change already in progress. The portal's paid-to-bank amount is not an independently verified bank receipt. [M02: settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html)
- **Refund and fulfillment rules:** supported advance payments, partial delivery/capture, insufficient funds, recurring cancellation, refunds during disputes and the explanation when only part of a claim is accepted.
- **Termination and complaints:** permissible restrictions, notice/review routes, post-closure access, complaint ownership and promised response stages. Public support channels do not establish a formal U.S. merchant complaint-resolution deadline. [M30: support](https://www.americanexpress.com/us/merchant/support-center.html)

Use the actual case/provider reply-by information. Do not invent a blanket dispute-response window, reserve-release period or bank-deposit SLA. Any precise timing adopted for Etail must come from its approved product policy or the applicable future provider agreement.

## Access and evidence limits

The [new-source register](merchant-360-sources.json) records substantive sources and exclusions separately. The old public Merchant Reference Guide URL returned 404. Search results for full U.S. regulations/reference guides displayed confidentiality notices, and the current public landing directs merchants to login. Three linked one-page prevention/refund PDFs also carried confidentiality markings; their substantive content was not used in this audit. Public HTML and the unmarked 2024TPP guide provide usable alternatives.

Canada reserve terms, UK complaints deadlines, Caribbean merchant procedures and generic payment-gateway developer pages were not imported as U.S. merchant rules. A publication from 2024 is dated evidence, not automatic proof that its entire rule set remains the current 2026 agreement. This audit does not require access to private portals to identify and retain those gaps.

No live merchant application, account change, payment, refund, communication or closure was performed. No implementation status or percentage is awarded by this business audit.
