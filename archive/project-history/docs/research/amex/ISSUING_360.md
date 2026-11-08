# Issuing: 360 business and product review

Research date: **2026-09-08**. This document examines operating journeys: who starts the work, what they need to decide, who acts next, how an exception is recovered and what counts as finished. It is supplementary to [the earlier issuing study](ISSUING_AND_CONSUMER.md), not a technical architecture proposal.

The [24 detailed checks](issuing-360-checks.json) contain 10 documented and 14 partially documented Amex reference journeys. Those labels describe evidence, **not Etail implementation**. Each check contains actors, normal flow, exceptions, account-control and merchant handoffs, gaps and a proposed fictional acceptance scenario. None of those scenarios has been executed against an application.

The [new source register](issuing-360-sources.json) contains 19 sources: 18 official pages opened and read, and one limited product-shopping source whose indexed copy was readable but direct extraction was empty. Earlier I sources and the cross-domain B sources remain in their own registers. Most pages are undated; access date is not publication date. This work used no authenticated Amex account, real application, card, transaction or private operating manual.

## What the earlier checklist missed

The existing [90-task comparison](../../../planning/amex-comparison.json) has useful card-request, control and transaction tasks, but it is not a complete business lifecycle. Seven distinct issuing journeys have no directly corresponding row: product choice, early digital availability, product change, renewal at expiry, full account closure/inactivity, due-date change and formal complaints. Related rows also need deeper operating coverage: virtual payment creation does not finish the supplier journey; AutoPay enrollment does not cover its later servicing; a dispute-opening action does not describe its evidence, merchant-credit and closure handoffs.

The original 90-row inventory remains unchanged. The `comparison_ids` field links related existing rows and does not declare them complete. These 24 broader review checks are not an extra denominator to add silently to the 90. A future revised benchmark should consolidate overlapping tasks and explicitly retain or exclude each new journey before scoring.

## The full operating sequence to review

**Selection → application → decision and acceptance → onboarding → delivery and first use → ongoing spending and billing → changes and exceptions → closure and continuing service.**

For Etail, review each stage with a named responsible person, a customer-visible current state, any action required, an appropriate notification and a clear completed outcome. These are proposed operating requirements. They are not claims about Amex's private status names, internal staffing or service levels.

| Stage | Proposed Etail business owner | Completion means | Exception that must have an owner |
|---|---|---|---|
| Product selection | Product/service team | The member understands the selected plan, account purpose, costs, permitted spending and repayment obligation. | Product unavailable, benefits misunderstood or recommendation mistaken for approval. |
| Application and decision | Applicant, required approver and issuing reviewer, each with separate work | Every required consent and decision is complete; any required acceptance is recorded. | Missing information, unavailable approver, decline, review request or an expired offer. |
| Holder onboarding and delivery | Holder plus fulfillment/support | The intended person has appropriate access and understands which supported uses are available. | Wrong person, failed linking, nonreceipt, address correction or failed confirmation. |
| Spending and billing | Holder and responsible payer | A purchase, statement and repayment have understandable, consistent outcomes. | Decline, changed availability, returned repayment, disputed amount or insufficient funds. |
| Lifecycle changes | Authorized owner/administrator plus servicing | The intended card or product changes with clear effective time and consequences. | Lost versus damaged card, expiry, departure, unsupported product change or recurring merchant continuity. |
| Exit and continuing service | Closure/complaint owner | New activity stops as required while remaining money, records and cases have a resolved or assigned path. | Late refund, open dispute, credit balance, final statement, hardship or unresolved complaint. |

The account-control handoff identifies who can approve, see, change or pay. The merchant handoff identifies what the supplier or merchant must do, how the cardholder can follow it, and which party owns a failure. These handoffs are important even when the first release uses fictional operations.

## Evidence that changes the product review

**Physical delivery, early digital use and activation are separate experiences.** Amex's US help supports each, but the timing wording differs between its general delivery FAQ and Instant Card Number page. Etail should show its own supported simulated states and explicit estimates instead of importing a single claimed Amex delivery guarantee. [J04 — delivery](https://www.americanexpress.com/us/customer-service/faq.new-card-delivery-timing.html), [J05 — activation](https://www.americanexpress.com/us/customer-service/faq.how-to-activate-your-amex-card.html), [J06 — early digital use](https://www.americanexpress.com/us/credit-cards/features-benefits/digital-wallets/instant-approval-credit-card/).

**Replacement reason affects the member's next action.** Lost/stolen and damaged-card handling differ; replacing a card does not automatically close its account. Renewal, saved merchant details and existing digital-wallet use also require continuity review. [J09 — replacement and renewal](https://www.americanexpress.com/en-us/support/lost-or-stolen-card/).

**A spending check, an increase request and a holder control change are different decisions.** Public US help supplies the first two routes but not a complete review process. Etail must explain whether the user is checking current possibilities, asking for changed capacity or changing a restriction inside already permitted capacity. [J07 — planned spending](https://www.americanexpress.com/us/customer-service/faq.check-spending-power-advance-purchase.html), [J08 — increase request](https://www.americanexpress.com/us/customer-service/faq.increase-credit-limit.html).

**Ongoing repayment servicing extends beyond enrollment.** The public US journey has update, pause/resume and stop choices; due-date changes follow product-specific routes. The operational question is what changes now, what still processes and what the payer still owes. [J13 — manage AutoPay](https://www.americanexpress.com/us/customer-service/faq.manage-autopay-settings.html), [J14 — due-date changes](https://www.americanexpress.com/us/customer-service/faq.change-payment-due-date.html).

**Closing a card, closing an account and resolving a complaint have different endpoints.** The US sources establish cancellation and inactivity-warning entry points but do not expose every postclosure step. UK complaints offer a useful explicitly regional example of receipt, ownership, communication and written outcome; its deadlines and external-review rules cannot be transferred to the US or Etail. [J10 — employee cancellation](https://www.americanexpress.com/us/customer-service/faq.cancel-employee-corporate-card.html), [J11 — account cancellation](https://www.americanexpress.com/us/customer-service/faq.cancel-card-account.html), [J12 — inactivity](https://www.americanexpress.com/us/customer-service/faq.card-inactivity.html), [J19 — UK complaints](https://www.americanexpress.com/uk/legal/complaints-procedures.html).

## Check inventory

“Documented” applies to the bounded public behavior in the check. It does not mean every exception is documented or that the current authenticated screen was tested. “Partial” identifies specific missing evidence in the detailed record.

| Check | Business journey | Amex evidence | Related existing comparison rows |
|---|---|---|---|
| ISS360-01 | Choose a product and understand the offer | partial | Distinct journey absent |
| ISS360-02 | Provide application information, review terms and accept a decision | partial | AX-ISSUING-01, AX-ISSUING-05, AX-ISSUING-06, AX-ISSUING-07, AX-ISSUING-10 |
| ISS360-03 | Follow a pending application, decline and requested review | partial | AX-ISSUING-08, AX-ISSUING-11, AX-ISSUING-12 |
| ISS360-04 | Complete an employee application and company approval handoff | documented | AX-ISSUING-03, AX-ISSUING-04, AX-ISSUING-06, AX-ISSUING-08, AX-ISSUING-09, AX-ISSUING-10 |
| ISS360-05 | Onboard the cardholder with their own access | documented | AX-CONTROLS-02, AX-CONTROLS-06, AX-CONTROLS-09, AX-ISSUING-02 |
| ISS360-06 | Deliver a new physical card and recover nonreceipt | documented | AX-ISSUING-17 |
| ISS360-07 | Confirm receipt, activate and attempt first use | documented | AX-ISSUING-15 |
| ISS360-08 | Use eligible digital details before the physical card arrives | documented | Distinct journey absent |
| ISS360-09 | Request a virtual payment and help the supplier use it | partial | AX-ISSUING-13, AX-ISSUING-14 |
| ISS360-10 | Check planned spending and request changed capacity | partial | AX-CONTROLS-10 |
| ISS360-11 | Change holder controls, pause use and resume safely | documented | AX-CONTROLS-10, AX-CONTROLS-11, AX-CONTROLS-12, AX-CONTROLS-13 |
| ISS360-12 | Change the card product or plan without losing the history | partial | Distinct journey absent |
| ISS360-13 | Replace a lost, stolen or damaged card and maintain continuity | documented | AX-ISSUING-16, AX-CONSUMER-12 |
| ISS360-14 | Renew an expiring card | partial | Distinct journey absent |
| ISS360-15 | Offboard an employee and confirm card cancellation | documented | AX-ISSUING-18, AX-CONTROLS-05 |
| ISS360-16 | Close an account or respond to an inactivity warning | partial | Distinct journey absent |
| ISS360-17 | Understand billing balances and obtain the right statement | documented | AX-CONSUMER-01, AX-CONSUMER-02, AX-CONSUMER-03, AX-CONSUMER-04, AX-CONSUMER-05, AX-CONSUMER-06 |
| ISS360-18 | Make, schedule, manage and stop repayment instructions | partial | AX-CONTROLS-15, AX-CONTROLS-16, AX-CONSUMER-07, AX-CONSUMER-08, AX-CONSUMER-09, AX-CONSUMER-10 |
| ISS360-19 | Change the payment due date or statement cycle | partial | Distinct journey absent |
| ISS360-20 | Recover a repayment returned by the funding institution | documented | AX-CONSUMER-11 |
| ISS360-21 | Follow a merchant return and request an issuer credit-balance refund | partial | AX-CONSUMER-02, AX-CONSUMER-13 |
| ISS360-22 | Open a billing dispute, add evidence, follow progress and withdraw | partial | AX-CONSUMER-12, AX-CONSUMER-13, AX-CONSUMER-14 |
| ISS360-23 | Seek hardship help and accessible servicing | partial | AX-CONSUMER-18 |
| ISS360-24 | Raise a formal service complaint and receive a final response | partial | Distinct journey absent |

## Etail decisions to make before claiming business parity

1. **Keep the product model coherent.** PERSONAL, HOUSEHOLD and SELLER are account types; a membership plan, a person's authority and a card's format are separate choices. The shopping and servicing experiences must preserve that distinction.
2. **Define the missing lifecycle policies.** Specify whether early digital use, product changes, expiry renewal and due-date changes exist in the first release. An unsupported journey should remain an explicit gap, with a helpful explanation; a renamed button does not constitute support.
3. **Define what each party sees after money changes.** Repayment, merchant refund, credit-balance refund and dispute adjustment need distinct meanings. A returned payment or late merchant credit must have an understandable next step and accountable owner.
4. **Review operations through final resolution.** Add fictional scenarios for nonreceipt, employee departure, returned repayment, merchant credit during a dispute, unresolved closure and complaint escalation. A case reference or status screen is an intermediate result until the next action and final outcome are clear.
5. **Retain intentional Etail differences.** Supervised minors remain guardian-funded; commercial daily full repayment remains governed by Etail's rules. Opening cards/accounts or changing plans does not reset the shared membership-year cap. An Amex fee, credit rule, age rule or country deadline is not an Etail requirement.
6. **Preserve continued service after exit.** The local [workflow specification](../../WORKFLOWS.md) already requires outstanding obligations, holds, refunds, disputes and records to be handled during closure. The business review must make that visible to the member and servicing staff.

## Remaining research limits

Current US interactive product comparison and acceptance, generic upgrade/downgrade servicing, a complete formal US complaint process, nonrenewal decisions and detailed postclosure refund treatment remain incomplete in this study. The public record supplies useful entry points and consequences without fully specifying each operating procedure. Source limitations are retained rather than filled with assumed behavior.

The next useful product exercise is a set of continuous fictional walkthroughs from each of the three account types: one ordinary purchase through repayment; one holder/card lifecycle change; and one exception through final resolution. Use these checks to identify missing steps and owners, then update the benchmark transparently. This is a business review recommendation, not an instruction to issue cards or move money.
