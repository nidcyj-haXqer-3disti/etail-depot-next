# D134 — network evidence for Goods, Services and Digital content

Research date: **21 September 2026**. US-oriented product analysis; network rules remain sensitive to geography, transaction type, processing route and effective date. This is research for a proposed vendor-hosted service, not legal representation, network certification or an implemented dispute system. D133's [document package](../payment-documents/README.md) remains the baseline; no template or application changes follow from this brief.

## Finding

Use the three fulfillment categories to choose relevant questions and evidence. Do not market **Receipt → Invoice → Agreement** as increasing legal protection. Those documents establish different facts, occur at different times, and cannot replace proof of authorization or performance. “Information” should become **Digital content & access** in the customer interface, with separate subtypes for a download, licensed software, online access and a digital deliverable. Advice delivered by a professional is usually a service for this product taxonomy; an e-book is digital content. Mixed orders require line-level fulfillment types.

This is a proposed operational classification, not an MCC taxonomy or a tax classification. A merchant's approved MCC must not change when a staff member selects a document or fulfillment category. Never promise that a package defeats every chargeback, shifts liability universally or predicts a win rate.

## What the network material establishes

### Visa: reason-specific evidence and two different fraud routes

Visa's merchant guidance separates fraud, authorization, processing errors and consumer complaints. Non-receipt needs evidence of agreed delivery/performance; cancellation needs the terms and actual chronology; an unprocessed-credit complaint needs real credit/reversal evidence. An invoice or agreement cannot show that a promised service happened. An applicable return policy does not automatically answer a defective/not-as-described claim. See the **June 2024** guidance, conditions **13.1, 13.3, 13.6 and 13.7**, printed pp. **37–41, 45–47**. [Visa merchant dispute guidance](https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf)

The **18 April 2026** rules' **§11.5.1, Table 11-6 item 4, printed pp. 677–678**, permit a particular digital-goods compelling-evidence route for **10.4 card-absent fraud**: description/download date plus at least two specified corroborating elements. Those include IP, device, profile identity, verification/access history and an undisputed device/credential transaction. That route is distinct from the historical-transaction remedy commonly called CE3.0. Neither should be relabeled a universal “digital delivery guarantee.” [Visa public rules](https://usa.visa.com/content/dam/VCOM/download/about-visa/visa-rules-public.pdf)

The current CE3.0 pattern uses two qualifying earlier transactions and matching transaction identifiers. Visa's public explanation describes IP or device matching plus another specified element across the three transactions, with prior transactions in the 120–365-day window. A first purchase or a signed agreement alone lacks that history. [Visa CE3.0 explanation, 8 August 2023, paragraph beginning “CE3.0 now allows”](https://www.visa.co.uk/about-visa/newsroom/press-releases.3267118.html)

**Date-sensitive qualification:** current rules **§11.7.5.3, Table 11-28, pp. 701–705**, specify more than 120 days, no more than 365, fraud-reporting conditions and exceptions. **24 October 2026** introduces expanded multi-merchant history, announced on p.48. It is future scope on this research date. **§11.7.5.6, pp.706–709**, separately specifies pre-arbitration evidence/certifications. The acquirer must validate the applicable route and date; a checkout checkbox is not CE3.0 eligibility. [Visa public rules](https://usa.visa.com/content/dam/VCOM/download/about-visa/visa-rules-public.pdf)

### Mastercard: receipts, participation and purchase controls

The **9 June 2026 Transaction Processing Rules, §3.13, printed pp.134–138**, address receipt requirements; card-not-present transactions require a receipt, and completed e-commerce purchases require a printable receipt page. Therefore basic receipts remain included. A paid service may organize additional evidence, but cannot withhold the underlying required receipt. Specific fields and regional exceptions require acquirer validation. [Mastercard processing rules](https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/transaction-processing-rules.pdf)

The publicly available **13 May 2025 Chargeback Guide**, **pp.425–427**, describes alternative e-commerce participation evidence: relevant signed records, electronic-delivery registration, correspondence, pickup information and a conditional registered-account route. That registered-account route explicitly excludes guest purchases; simply offering registration is insufficient.

Its **pp.213–215**, “Digital Goods Purchase of USD/EUR 25 or Less,” covers a separate purchase-control complaint, not fraud. It includes controls for disabling purchases, a limited authentication window and confirmation/cancellation of the displayed amount. A stronger contract does not fix absent product controls. This is a conditional low-value rule, not a universal limit on digital-goods disputes.

Procedure matters: **p.426** restricts late second-presentment evidence, and **pp.452–455** describe continuing fraud disputes after compelling evidence. These are not automatic merchant wins. The provider must confirm subsequent bulletins and the current applicable processing route. [Mastercard Chargeback Guide](https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/documents/chargeback-guide.pdf)

### American Express: useful evidence, no conclusive finding

American Express's public merchant dispute page links a **2024 one-page Compelling Evidence factsheet**. It recognizes receipt/performance evidence, pickup records, digital download/access times and qualifying previous-transaction matches. It expressly distinguishes submitted evidence from a compelled conclusion about participation, receipt or benefit; its fraud full-recourse exception also matters. Do not turn that marketing brief into a complete rule engine or imply that a receipt proves a disputed service's quality. [Amex merchant dispute resources](https://www.americanexpress.com/us/merchant/tpp/manage-disputes.html), [linked 2024 factsheet, p.1](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/tpp/manage-disputes/Amex_Compelling_Evidence_Factsheet-TPP.pdf)

The indexed US regulations link returned **404** during this review. The similarly named `Regs_EN.pdf` is an **International April 2026** edition, so it was not treated as current US regulations. Obtain the applicable merchant/acquirer agreement before implementing Amex-specific conditions.

## Proposed evidence mapping

The following is a design synthesis, not a universal network-required checklist. Apply the actual complaint and processor instructions before requesting additional personal data.

| Fulfillment | Agree and record before payment | Record after payment | Important limit |
| --- | --- | --- | --- |
| Goods | Specific item, quantity, condition/specification, delivery or pickup promise, destination, returns | Verified payment, actual dispatch and delivery/pickup, relevant return/refund history | A generated shipping label proves preparation, not receipt; delivery alone does not prove correct condition |
| Services | Scope, deliverables, date/location, dependencies, price, milestones if applicable, cancellation | Actual attendance/work/deliverable records, agreed changes, relevant customer communications, credits | A signature before work starts cannot truthfully acknowledge later completion or satisfactory performance |
| Digital content & access | Exact content/version, format, compatibility, license scope, access period, price and applicable cancellation | Actual entitlement, provision/access/download/license activation events, relevant support/refund history | Sending a link is not proof of use; access is not proof of authority, content accuracy or conformity |

Digital records should distinguish **provisioned**, **message sent**, **delivered**, **accessed** and **downloaded**. Do not label all five “delivered.” Record event source, time zone, identity/account linkage and content version. A hash supports integrity of the referenced file; it does not establish who read it. Proxy IPs, shared devices and forwarded links require context rather than categorical identity claims.

## If L1/L2/L3 are retained

Use them only as an internal workflow shorthand or clearly described commercial packages:

| Proposed name | Actual role | What it cannot replace |
| --- | --- | --- |
| L1 — Payment record | Included basic receipt; optionally paid enhanced organization | Purchase consent, fulfillment or dispute submission |
| L2 — Itemized billing | Invoice with price, scope, tax where applicable and payment allocation | Proof of payment, acceptance or delivery |
| L3 — Agreed terms | Exact purchase terms with affirmative, version-linked acceptance | Authorization, lawful terms, later performance or required refunds |

The customer-facing labels **Receipt, Invoice, Agreement** are clearer than protection levels. Select documents independently, or transparently state which package includes which records; do not silently convert D133's additive pricing into nested tiers. A buyer must never acknowledge future receipt/completion to pay a deposit. Preserve actual evidence even when the merchant declines paid documentation.

## Network proceedings are not court judgments

The merchant supplies evidence through its acquiring/provider relationship; network procedures can involve issuer responses, second presentment, pre-arbitration and allocation of financial liability. They are not a court's adjudication of every contractual or statutory claim. Mastercard's guide, **chapter 1 pp.25–29**, describes this network process. Court enforceability, evidence admissibility and consumer rights require a separate jurisdiction-specific analysis; do not market a network response package as litigation representation. [Mastercard Chargeback Guide](https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/documents/chargeback-guide.pdf)

For US consumer-credit billing errors, Regulation Z covers specified non-acceptance/non-delivery complaints; merchant contact is not always a prerequisite. Keep that right intact in every document tier. [CFPB §1026.13(a)(3), official interpretation paragraph 3](https://www.consumerfinance.gov/rules-policy/regulations/1026/13/)

## Decision for the proposal

Adopt the three fulfillment categories as a **routing tool**, with mixed-order support. Keep document selection separate from delivery channel, payment authentication and fulfillment evidence. Build a reason-specific missing-record checklist, not a “defense score.” Ask the vendor to verify receipt compliance, genuine event availability, evidence export/submission, current rule versions and any CE3.0 participation before promising automation. Track a valid refund/remedy path alongside a defensible response path. No observed source supports an “all possibilities” guarantee, a universal document hierarchy or an automatic 1%-fee legal defense.
