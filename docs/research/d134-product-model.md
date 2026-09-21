# D134 — transaction types and document packages

> **Superseded category/value interpretation — D136:** The current model is **Goods / Services / Information**, with Information broader than digital files. Follow the [document-service value design](../PAYMENT_ADDON_VALUE_DESIGN.md) for the distinct independent add-ons and their paid outputs. The earlier Digital content recommendation and level framing below are retained only as dated research history.

21 September 2026 · Research and product proposal only · Public website unchanged

**Recommendation:** use Goods, Services and Digital content to choose the relevant fulfillment questions. Use Receipt, Invoice and Agreement to describe what each record does. Do not describe L1/L2/L3 as increasing levels of dispute protection. The currently approved D133 model remains three independently selectable add-ons: enhanced receipt 0.1%, invoice 0.4%, agreement 1%; all three add 1.5% to processing. Basic payment receipts remain included.

## What the evidence supports

Stripe organizes evidence around the actual dispute claim and transaction type. Its guidance distinguishes physical delivery, digital access and offline service performance; an invoice or contract does not answer every complaint. For a digital non-receipt claim, customer-linked access/download activity can matter. For services, dated records showing that the promised service was provided can matter. These distinctions support tailored evidence modules, not a universal contract template. [Stripe dispute categories](https://docs.stripe.com/disputes/categories)

Stripe’s July 2026 analysis examined one million disputes across 16 weeks. Digital activity logs were associated with a 10 percentage-point higher win rate for non-receipt disputes. Physical delivery confirmation, a GPS map and recipient signature together were associated with a 44 percentage-point difference. These are observational results from Stripe’s population, not proof that a document caused a win, a price justification, or a Trolleys performance promise. [Stripe evidence analysis](https://stripe.com/blog/analyzing-the-evidence-that-helps-businesses-win-product-not-received-disputes)

Stripe separately accepts fields for a receipt, service date/documentation, shipping records and digital access activity. This is useful evidence architecture: one sale can need several distinct sources. Stripe is the benchmark, not the established Trolleys processor interface; the actual vendor must confirm its supported fields and submission process. [Stripe dispute evidence API](https://docs.stripe.com/api/disputes/update)

## A defensible 3×3 proposal

“Information” is ambiguous for customers: advice is usually a service; a downloadable report is digital content; a printed report is a physical delivery. Prefer **Digital content** in the interface, with a description such as “downloads, reports and online access.” These are product categories, not legal classifications or merchant MCC assignments. Classify fulfillment per order line; never rewrite an acquirer-assigned MCC from this selector.

The following matrix proposes **cumulative record completeness**, not bundled billing. L1/L2/L3 are internal discussion labels only; use Receipt, Invoice and Agreement publicly. Network Level 2/Level 3/Product 3 terminology already describes eligible commercial-card transaction data, a separate program with its own conditions. Our document selector must not imply network certification, interchange savings or participation. [Stripe payment line items](https://docs.stripe.com/payments/payment-line-items)

Every column retains the included basic receipt; later documents remain pending until their real event occurs. L2 combines an invoice with that basic receipt, not automatic enrollment in the paid enhanced-receipt add-on. L3 links an agreement to the ordinary sale and payment records; an invoice is included only when selected or otherwise applicable. An agreement does not make the separately priced Invoice add-on compulsory. The currently approved independent fee model remains unchanged.

| Sale type | L1 — Receipt record | L2 — Invoice + basic receipt | L3 — Agreement + supporting sale/payment records |
| --- | --- | --- | --- |
| **Goods** | Captured amount, item/order references and payment receipt; link shipment, delivery or pickup evidence as it becomes available. | Add itemization, quantity, tax treatment, amount due, shipping/pickup promise and billing revisions. | Add accepted specification, fulfillment commitments, cancellation/return terms and recorded changes. Still collect actual delivery evidence. |
| **Services** | Captured payment linked to appointment/work order; attach attendance, deliverables or completion evidence later. A deposit is not completed work. | Add scope, dates, deposit versus total, remaining balance and any agreed milestones. | Add responsibilities, scope boundaries, timing, change approval and relevant cancellation/remedy terms; preserve acceptance before payment. |
| **Digital content** | Captured payment linked to the specific purchased content/access entitlement; attach actual access or download events. | Add product/version, entitlement period, quantity, price and access-delivery promise. | Add agreed access/license terms, compatibility, delivery, cancellation and support obligations; retain the exact accepted version. |

This matrix organizes information capture. It does not certify that all its fields are mandatory, that every transaction needs an agreement, or that regulated industries fit a general template. The applicable network, jurisdiction, business model and provider rules still determine requirements.

## Why “higher level” does not mean “better protection”

A simple receipt plus reliable delivery evidence may answer a non-receipt claim better than a long agreement without delivery proof. An accepted contract cannot turn a duplicate capture into a valid second sale. A receipt cannot establish that the customer authorized the payment, and an invoice cannot establish that the promised service occurred. Product language should say **“Organize the records your sale needs,”** not “maximum protection,” “lawyer-grade defense” or “dispute-proof.”

Logs need qualification. A delivered email is not necessarily a downloaded product; opening a request is not accepting terms. A login or matching IP alone does not prove who used a card, whether a specific file was received, or whether the product matched its description. Preserve the event’s source, object, time and customer/order association; show unverified or missing evidence explicitly. Do not fabricate completion to make a packet look finished. This is a product-design inference from the distinction between payment, acceptance and fulfillment records.

For a response, select records that answer the actual allegation. Stripe recommends relevant excerpts rather than an entire agreement or external links, so an export should contain readable evidence, not merely URLs pointing to the merchant dashboard. [Stripe response best practices](https://docs.stripe.com/disputes/best-practices)

## Mixed purchases and later changes

A workshop with a printed workbook and online videos is one order with service, goods and digital-content lines. Give each line an agreed amount and fulfillment promise; link the payment to the order and maintain each line’s fulfillment state. One receipt can cover the captured amount, one invoice the sale, and one agreement the combined terms. Do not multiply document fees simply because an order has three fulfillment types.

Model deposits, partial capture, partial fulfillment and partial refunds separately. A $300 deposit on a $1,000 order is a $300 payment, not proof of $1,000 fulfillment. Preserve the original terms and append accepted amendments. A revised invoice must not silently replace the customer’s accepted contract or recalculate a previous receipt. If only one part is disputed, identify that part and the already refunded amounts.

## The simplest customer workflow

1. **Describe the sale.** Enter items and amount; ask how each item will be delivered. Select ordinary defaults and reveal additional questions only when relevant.
2. **Choose records.** Basic receipt is included. Offer the approved independent add-ons with their combined merchant fee and clear timing. Recommend relevant records with a short reason; never silently select paid options.
3. **Review and share.** Preview what the buyer will see, then use Text, Email, Social, QR code or Website. Private documents need scoped access; a public post should not expose customer records.
4. **Buyer reviews, accepts when needed, then pays.** Never require acknowledgment of completed delivery before an advance payment. Generate a paid receipt only after verified capture.
5. **Complete the record.** Attach real fulfillment events; keep unresolved items visibly pending. If disputed, present the complaint, relevant records and remedy options before a merchant decides to respond.

Stripe’s workflow explicitly lets a merchant accept or challenge a dispute; the issuer decides the outcome. Its submission is final, which supports a deliberate evidence-review step rather than automatically filing every generated document. [Stripe responding workflow](https://docs.stripe.com/disputes/responding)

## Implementation implications and pricing boundary

Use a conceptual **Order → Lines → Fulfillment events** structure, linked to provider payment/refund references. Separate document versions, customer acceptance, delivery attempts, source evidence and evidence exports. Store who supplied each record and when; distinguish provider-confirmed facts from merchant assertions. Keep fee selection and its accepted commercial version separate from document contents. A receipt must not contain secret card data or private fraud notes.

If a future bundled-package model is approved, show one selected package and one total rate. Never upgrade or charge automatically because the sale needs more evidence. Any paid change requires the merchant’s informed selection; previously purchased entitlements must not be billed twice. Package pricing, late upgrades, refunds, caps and partial captures would require an explicit commercial decision. **No package conversion is authorized by this research; D133’s independent rates remain unchanged.**

The current public code correctly shares example amounts between channels and documents, separates receipts from requests, preserves five delivery methods and marks add-ons coming soon. Its three generic examples and templates are not a fulfillment system. A later vendor implementation needs the additional modules and truthful lifecycle above; the public app should remain a preview and fixed vendor handoff. Test customer understanding, evidence completeness and preparation time before claiming any improvement in dispute outcomes.
