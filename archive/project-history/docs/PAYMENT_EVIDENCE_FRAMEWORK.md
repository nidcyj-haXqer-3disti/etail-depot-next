# D134 — goods, services and digital-content evidence

> **Superseded category/value interpretation — D136:** Use **Goods / Services / Information**. Information is broader than digital files; the three paid document services are independent workflows, not protection tiers. The current [document-service value design](PAYMENT_ADDON_VALUE_DESIGN.md) governs those points. The dated research below remains background evidence, not the current category recommendation.

21 September 2026 · Research proposal · US general-commerce focus · No website or pricing change

## Recommendation

Keep the proposed three fulfillment types and three document levels, with precise meanings. **Goods / Services / Digital content** determine what was promised and how delivery can be evidenced. **Receipt / Invoice / Agreement** describe increasing workflow detail, not certified levels of legal protection. A sale can use all three documents at different times. Every successful payment still receives its basic receipt.

The product should organize an accurate transaction record: the offer, the customer's acceptance where needed, the payment, actual fulfillment and any remedy. Document length, template price and a polished signature image cannot substitute for a missing event. This is a design recommendation based on the sources below, not a legal opinion or lawyer-approved form.

Read alongside the [network research](research/d134-network-evidence.md), [selected court decisions](research/d134-court-lessons.md) and [product/workflow analysis](research/d134-product-model.md). The existing [D133 templates](payment-documents/README.md) remain original drafts for qualified legal, tax and acquiring-provider review.

## 1. Name the three fulfillment types clearly

| Type | What the buyer receives | Examples | Delivery questions |
| --- | --- | --- | --- |
| **Goods** | A tangible item | Retail order, custom furniture, equipment | What item/specification/quantity? Shipped or collected? To whom, where and by when? |
| **Services** | Work, an appointment or an agreed activity | Repair, consulting, installation, live instruction | What work, when, for whom, and what counts as completion? |
| **Digital content & access** | A specified file, recorded content, information product or access entitlement | Downloadable report, e-book, recorded course, software license | Which version and format? Which account/license period? Was the promised content actually accessible or delivered? |

“Information” works as an internal umbrella, but **Digital content & access** is clearer in a customer interface. An online consultation is a service; a recorded lesson is content; a printed report has a physical-delivery component. These are operational categories, not statutory classifications or replacements for an acquirer-assigned MCC. Software, subscriptions and regulated advice can have additional legal treatment.

Allow mixed order lines. A workshop plus a workbook and video access can contain all three types, while retaining one order and correctly allocated payments. The system must not multiply document fees merely because there are three fulfillment types.

## 2. Define the levels by their job

| Internal level | Customer-facing name | Question it answers | Event and limitation |
| --- | --- | --- | --- |
| **L1** | **Receipt** | What payment occurred? | Produced after verified successful payment; does not establish delivery or consent by itself. |
| **L2** | **Invoice** | What is being charged, and when is it due? | Issued before payment; can link subsequent payments/credits. Does not itself prove the buyer accepted every term. |
| **L3** | **Agreement** | What obligations did both sides agree to? | Clear terms plus actual affirmative acceptance before payment/fulfillment where applicable; does not prove subsequent performance. |

L1/L2/L3 may be retained for internal discussion of complexity. The public interface should use the document names. Card networks already use Level 2/Level 3/Product 3 terminology for enhanced commercial-card transaction data and related eligibility; these are separate from legal templates. No interchange qualification follows from selecting an invoice or agreement. [Stripe payment line items](https://docs.stripe.com/payments/payment-line-items)

An L3 transaction still produces a basic receipt after payment and may use an invoice. It need not buy the separate Invoice add-on if ordinary order details suffice. An L2 workflow does not automatically include or charge for enhanced receipt organization. **Record completeness is cumulative; billing remains the explicitly selected independent add-ons.**

## 3. The proposed 3×3 document matrix

The fields below are recommended product requirements, not a claim that each is legally mandatory for every sale. Required fields must ultimately be configured by provider, network, merchant industry and jurisdiction.

| Fulfillment type | L1 — Receipt | L2 — Invoice | L3 — Agreement |
| --- | --- | --- | --- |
| **Goods** | Seller/order reference, item and quantity, actual captured amount/currency/date, provider-supplied masked method; link later delivery and refunds. | Add SKU/specification, unit prices, tax/delivery charges, prior payments, amount due, due date, and shipping/pickup promise. | Add accepted specifications, customization approvals, delivery commitments, change procedure, cancellation/return terms and applicable warranties. |
| **Services** | Identify the service/appointment or work order, amount actually paid, and whether it is an advance or final payment; link actual work records. | Add scope/period, units or hours, rates, deposit versus total, remaining balance, agreed milestones and payment schedule. | Add deliverables and exclusions, responsibilities, measurable completion criteria, timing, dependencies, change approval, cancellation and remedy terms. |
| **Digital content & access** | Identify exact product/version or entitlement, actual amount paid and order/account linkage; connect real delivery/access events. | Add format, quantity/seats, license/access period, price, technical requirements and activation/delivery promise. | Add permitted uses, license scope, access duration, compatibility, support/update promises, lawful cancellation/refund terms and exact accepted version. |

The agreement module must not default to “no chargebacks,” “all deposits nonrefundable,” an artificial acknowledgment of completed work, or retroactive terms. A customer's refusal to confirm satisfaction must not cause the system to fabricate acceptance. Handling regulated services, subscriptions, rentals, travel, minors, health/legal/financial advice and cross-border consumer sales needs additional reviewed modules.

## 4. A fourth component is required across the matrix: fulfillment evidence

This is a common record capability, not a fourth document price or automatic paid upgrade.

| Type | Useful actual evidence | What it does not establish alone |
| --- | --- | --- |
| Goods | Carrier-linked tracking, delivery date/location, appropriate recipient signature or pickup confirmation, serial/SKU linkage, order and promised destination | A label only proves preparation; a parcel delivery does not necessarily prove its contents, condition or acceptance. |
| Services | Dated work orders, appointment/attendance records, delivered work, correspondence, actual milestone/completion confirmation | An appointment booking or deposit does not prove the work occurred. A completion checkbox does not extinguish a quality claim. |
| Digital content & access | Exact content/version and entitlement, provisioning history, transaction-linked download/access/consumption events, relevant error/support records | Email delivery is not downloading; an account login is not access to the particular product; an IP/device match is not conclusive identity or satisfaction. |

Stripe's July 2026 analysis of one million disputes over 16 weeks found associations between specific fulfillment evidence and better non-receipt outcomes. Those observations support collecting relevant facts, but they are not a controlled trial, a Trolleys win-rate forecast or proof that buying a higher document level causes success. [Stripe evidence study](https://stripe.com/blog/analyzing-the-evidence-that-helps-businesses-win-product-not-received-disputes)

Make event meanings explicit: **sent → delivered by messaging provider → opened → terms accepted → payment captured → item/service/content fulfilled**. These events are not interchangeable and need not all occur in that order. A refund request, processed refund and bank posting are separate states. Evidence must identify the source, time, related order line and what was actually observed.

## 5. Apply the dispute reason after classifying the sale

The same goods transaction can face an unauthorized-payment, non-delivery, quality, cancellation, amount or refund claim. A 3×3 matrix alone cannot decide which evidence answers it.

| Claim | Primary questions | Relevant records |
| --- | --- | --- |
| Unauthorized/unrecognized | Who authorized the payment? Does a specific network authentication/liability rule apply? | Provider authentication records and eligible relationship/history data; order and consent context. A merchant-generated agreement alone is insufficient. |
| Not received/not performed | What was due, by when, and what actually happened? | Promise plus goods/service/digital fulfillment events. |
| Not as described/defective | What was represented at purchase, and what differed? | Saved offer/specification/version, actual deliverable, complaint and remedy chronology. |
| Cancellation/return | Which terms were displayed and accepted, and was cancellation/return valid? | Applicable terms version, notice dates, return/cancellation records and actual credits. |
| Duplicate/incorrect amount | Was there a distinct sale and valid amount for each capture? | Order-to-capture allocation, exact itemization, accepted changes and correction history. |
| Refund not received | Was a credit actually processed, for how much and when? | Provider refund reference/status tied to the original payment; not a promise or credit note alone. |

The source review covers Visa, Mastercard and Amex-specific differences; the provider's actual notice and current submission rules govern. Visa CE3.0 is a conditional card-absent-fraud mechanism, not general non-delivery or quality protection. Do not advertise a future rule change as already effective. [Network research and exact rules](research/d134-network-evidence.md)

## 6. Keep the legal routes separate

**Network dispute:** Issuer/acquirer/provider procedures and, where applicable, network arbitration determine contractual payment-system outcomes. These are not automatically public court judgments.

**Consumer-credit rights:** US Regulation Z has specific billing-error and claims/defenses provisions with different scopes. Non-delivery/non-acceptance under §1026.13 is distinct from a quality complaint about accepted goods/services; §1026.12(c) can preserve other claims subject to its conditions. These are not universal rules for every commercial card, debit payment or international buyer. [CFPB §1026.13](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/), [CFPB §1026.12](https://www.consumerfinance.gov/rules-policy/regulations/1026/12/)

**Merchant/customer or merchant/processor litigation:** Contract formation, performance, statutory rights and the particular processing contract can be litigated separately. The selected decisions in the [case brief](research/d134-court-lessons.md) are illustrative, not an exhaustive history or validation of an L1/L2/L3 protection ladder. A procedural ruling compelling arbitration, reversing dismissal or entering default judgment must not be described as a trial finding that a template defeated a chargeback.

Three useful examples are *Rigby* (2012), where a signed purchase contract did not dispose of a pleaded non-delivery claim; *Berman* (2022), where unclear online notice/assent failed; and *Meyer* (2017), where the particular screen supported formation. Their different procedural postures and limits are documented in the case brief. The product inference is to preserve the actual acceptance interface and later performance separately.

For covered merchandise sales, the FTC shipment rule creates obligations about promised shipping times, delays and refunds. It does not generally cover services; do not paste its shipment language into every digital/service contract as a universal rule. [FTC business guide](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule)

Electronic form does not by itself invalidate an agreement, but E-SIGN preserves substantive rights and has specific consumer electronic-record requirements where legally required written disclosures are delivered electronically. Keep the exact document available to retain and reproduce; a generic checkbox is not a universal compliance conclusion. [15 USC §7001](https://www.govinfo.gov/link/uscode/15/7001)

## 7. Build reliable evidence operations

Use one order with typed line items and separate records for offer versions, document versions, acceptance, capture/refund events, fulfillment, communications and evidence exports. Preserve originals and append corrections. Merchant-entered assertions, third-party carrier data and provider-confirmed facts should remain distinguishable. Hashes can help demonstrate that a file has not changed; they do not prove its original truth or who acted.

Federal evidence rules illustrate why provenance matters: regular business records, authentication and certain certified electronic records have different requirements. A generated PDF or audit log is not automatically admissible. The system should preserve accurate contemporaneous source material and the ability to explain it. Network packet rules and court evidence rules still remain separate. [Federal Rules of Evidence, Rules 803(6), 901 and 902](https://www.uscourts.gov/sites/default/files/2025-02/federal-rules-of-evidence-dec-1-2024.pdf)

Collect proportionate data with scoped access, applicable notices, a reviewed retention schedule and legal holds. Do not put secret payment data into documents. Keep customer copies separate from restricted fraud/operational evidence. For tax/accounting, reconcile sales, actual payments, fees, credits and payouts; the IRS recognizes combinations of supporting records rather than a universal three-level document test. [IRS supporting records](https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep)

Before a response is submitted, show the claim, relevant evidence, missing facts, deadlines and any prior refund. Allow accepting a valid complaint or providing a remedy. Do not automatically challenge every dispute or treat a generated packet as submitted or successful.

## 8. Recommended customer workflow and commercial boundary

1. **What are you selling?** Goods, Services, Digital content & access; allow a mixed order.
2. **Describe the promise.** Reveal the appropriate specification, date, delivery or access fields.
3. **Choose documents.** Basic receipt included; explain optional invoice, enhanced receipt and agreement by their jobs and timing. Recommend only with a short reason and no preselected paid upgrade.
4. **Review and share.** Keep Text, Email, Social, QR code and Website. Private records need protected access; public links must not reveal private evidence.
5. **Customer reviews, accepts where applicable, and pays.** Actual successful payment produces its receipt; later fulfillment updates the same sale record.

Keep the already approved independent rates unchanged during research: enhanced receipt 0.1%, invoice 0.4%, agreement 1%; all three 1.5% plus processing. A document's rank does not justify the fee by itself. The paid value must be delivered through actual automation, versioning, evidence organization and usable exports. Inclusive packages, caps, refund policy, late upgrades and charge timing require a separate commercial decision and provider confirmation.

No application source, template wording, fee configuration, database or deployment was changed for D134. The next implementation decision is the fulfillment-aware workflow and document modules, followed by provider feasibility and qualified review. The current public website must continue to identify unimplemented document services as coming soon.
