# Payment documents — vendor implementation contract

D133 · 21 September 2026 · Proposed contract for vendor feasibility and legal review

This document specifies required behavior for a separately hosted Trolleys service. It does not assert that Infinicept or any other provider offers these events, storage, signatures, automation or billing features. There is no implementation in the Etail public website. The website must remain informational, without checkout, account access, private-document collection or evidence uploads.

## Commercial selection

The operator selected independent merchant add-ons: Invoice **0.4%**, Enhanced payment receipt **0.1%**, Transaction agreement **1%**. Selected percentages add; all three total **1.5%** on the successful payment amount, plus processing. A merchant must see each selection, the combined percentage and the amount estimate before approving it. Default to no optional add-ons selected. Preserve the merchant's explicit approval and the applicable commercial version. Do not convert merchant software charges into a buyer surcharge.

Selection alone is not a billable event. The proposed fee trigger is a verified successful capture, with the selected services tied to that capture's purchase. An authorization, declined attempt, abandoned checkout, document preview, delivery failure or retry is not a second payment. Applicable refund/fee-credit treatment, minimums/caps, rounding, partial-capture handling, failure-to-deliver remediation and tax must be settled before enabling charges. This handoff does not invent those missing rules.

## Authoritative facts and event prerequisites

| Fact or event | Required source and meaning | Must never be inferred from |
| --- | --- | --- |
| Merchant identity and transaction scope | Verified vendor merchant configuration; stable merchant/order identifiers | URL query or merchant-entered network identity |
| Selected add-ons | Authorized merchant action with fee schedule/selection version | A customer clicking a payment link |
| Agreed sale | Final order content and any required customer acceptance | A changed live page with no saved version |
| Authorization | Authentic provider event or verified provider status | Successful browser return |
| Capture | Authentic provider event or verified provider status, with capture ID, amount and currency | Authorization, email opening, receipt generation or handwritten “paid” flag |
| Refund/reversal | Verified source status and related transaction IDs | Credit note, support promise or refund request |
| Delivery | Actual sending provider response; later status events where supported | Creating a message in a queue |
| Customer acceptance | Explicit action tied to the exact presented document version | Message delivered/opened, typed-name rendering or prechecked consent |
| Fulfillment | Actual merchant/carrier/customer evidence with source attribution | A payment event or generated agreement |
| Bank payout | Verified provider payout/reconciliation data | Capture or a document fee estimate |

Validate incoming event authenticity, merchant/resource scope, replay protection and allowed state transitions. Preserve original source IDs and event timestamps along with receipt time. Resolve contradictory or out-of-order events by fetching authoritative provider state where supported; otherwise flag reconciliation instead of manufacturing a final status.

## Document lifecycle

### Invoice

`draft → issued → corrected/superseded or voided`

An issued invoice exists before payment and records the balance requested. Payment allocations are linked afterward. Preserve earlier versions. A correction cannot quietly change the goods, agreed amount or customer terms; relevant changes need renewed agreement. An order may have several successful partial payments without creating a new invoice for the entire amount after each capture.

### Agreement

`draft → presented → accepted` or `declined/expired/superseded`

Capture the final text, attachments, version, hash, displayed acceptance statement, customer reference, time and actual action. If this add-on is selected for a sale, its required affirmative acceptance must occur before opening that sale's payment step. Failed or missing acceptance blocks that agreement-dependent workflow; it cannot be backfilled after payment. Preserve earlier acceptance for history, but do not apply it to later changed terms. Cancellation rights remain intact.

### Receipt

`capture verified → basic receipt available → enhanced record prepared, if selected`

Basic payment/refund receipts remain available whether or not the enhanced option was purchased. The final basic receipt must follow the acquirer's applicable network and regional requirements. Preserve the provider source receipt and enrich it with linked evidence rather than replacing required facts. A failed capture may receive a truthful attempt notice, never a paid receipt.

A completed payment receipt is an immutable account of the payment event as known when issued. Later refunds, reversals and corrections append linked records. Display the current combined status alongside the historical receipt; do not edit history to pretend that no payment or refund occurred.

## Idempotency and partial payments

Use stable identifiers at two levels:

- Before payment, generation is keyed to `orderId:documentType:documentVersion`. Issuing or downloading the same invoice/agreement again does not make it a new sale.
- After capture, generation/evidence association is keyed to `captureId:documentType:version`. Here `version` is the immutable version selected for that transaction, not the current renderer build. Duplicate source events and delivery retries reuse the existing artifact/effect.
- Billing has its own unique business effect for `captureId:documentType:acceptedSelectionId`. Rendering a corrected copy, changing a template release, exporting evidence or switching a delivery method does not create another charge for that selected service.

For multiple actual captures, allocate the selected service fee only to each relevant captured amount; never charge once on the invoice total and again on its partial payments. Show what each capture paid toward and reconcile the remaining balance. Use exact currency minor units and an explicitly approved rounding rule. No compounding of add-on percentages on other add-on fees is intended. Resolve fee-credit rules for partial/full refunds and failed document fulfillment before activation; append approved corrections rather than rewriting prior charges.

## Delivery across five channels

**Text, Email, Social, QR code and Website** are delivery methods. Invoice, Enhanced payment receipt and Transaction agreement are document choices.

Before payment, a shared entrance leads to the relevant request and, when applicable, agreement, then the hosted payment step. After payment, the customer sees a receipt and cannot accidentally repay the same completed charge. A later remaining-balance request must identify that distinct amount and its order relationship.

Public QR codes, websites and social posts expose only a generic entrance or non-sensitive offer. Private order documents need access scoped to their intended customer. Authorize access server-side; use revocable, time-limited access methods where appropriate, redact contact details from previews, prevent indexing/caching of private records and omit private content from referrers and analytics. Tokens must not appear in exported evidence, support logs or public screenshots. Forwarding a link must not become proof of identity or agreement.

Record delivery as `queued → attempted → delivered/failed` only where the provider supports those facts. Keep document creation, transmission, delivery, viewing and agreement acceptance separate. A delivery retry sends the existing version and cannot create another fee. Customers retain a working route to obtain required basic receipts even if a preferred channel fails. Channel switching must not change the amount or terms. Verify transactional-message permissions and provider restrictions separately from marketing consent.

## Access, provenance and export

Only an authorized merchant user may select paid services or publish transaction terms within their assigned scope. A staff member's allowed document/evidence access must not silently grant refund, payout or merchant-wide authority. Customers may access their own permitted document copies, not merchant notes, other customers' records or unrestricted evidence repositories.

Each evidence item records source, actor, event time, ingestion time, document/transaction linkage, version and integrity metadata. Separate provider facts, merchant assertions and customer actions. Log corrections, reads of sensitive material and exports. Redact unrelated personal information and exclude full card numbers, CVV/PIN data, payment tokens and other secrets.

An evidence export contains a factual timeline, selected original documents, relevant fulfillment/support records, verified transaction/refund references and a missing-evidence list. The merchant reviews its accuracy and relevance before submission. Preserve separate states for `prepared`, `reviewed`, `submitted` and any actual processor outcome. A prepared package is not representation, filing, legal approval or a guaranteed win.

## Retention and legal review

Create a retention schedule for each record category with the acquirer, privacy counsel and tax adviser. Record legal holds and deletion restrictions. Confirm access/export, backups, retention expiry and deletion behavior; do not assume one duration covers network, tax, contract and privacy obligations.

Qualified counsel must approve template applicability by merchant/customer jurisdiction and transaction category, meaningful cancellation/deposit terms, mandatory disclosures, electronic-record consent and signing process. Re-review material commercial, provider or legal changes. Escalate regulated industries, minors, travel/lodging/rentals, recurring charges, home improvement, international sales and other specialized transactions rather than applying the general template by default. A review decision must name the actual template version and scope; “top-tier legal” is not an evidence status.

## Provider acceptance criteria

Before activation, obtain provider confirmation and test evidence for:

1. Actual available events, authenticity validation, transaction/capture identifiers and reconciliation behavior; no guessed webhook schema.
2. Basic network-compliant purchase/refund receipts available without paid options.
3. Explicit optional merchant selection and exact fee display; no unconsented buyer charges.
4. Successful capture as the proposed charge basis, with approved rounding, partials, refunds/credits, minimums/caps and failed-service treatment.
5. Duplicate/replayed/out-of-order events, channel retries and template re-renders producing no duplicate fees or fabricated final states.
6. Agreement acceptance and accessible retained copy before checkout; changed terms cannot reuse stale acceptance.
7. Transaction amounts/currency and document versions unchanged across the five delivery methods.
8. Scoped private access, leakage prevention, permissions, audit history, retention and deletion tested with separate customers and staff roles.
9. Truthful refund and fulfillment histories; missing evidence remains missing; valid complaints can be accepted and remedied.
10. Evidence package review and real submission acknowledgement, without confusing export with processor delivery or outcome.

Until those criteria and legal applicability are resolved, this remains an implementation proposal and public product preview, not an activated vendor feature.
