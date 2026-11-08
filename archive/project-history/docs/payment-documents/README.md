# Payment documents — design and review package

D133 · 21 September 2026 · Original working drafts for US general commerce

These drafts specify a proposed Trolleys document service. They are not lawyer-authored or lawyer-approved forms, deployed vendor functionality, tax advice, insurance, or a guarantee against disputes. A qualified lawyer must review the applicable jurisdictions, merchant industries and live acceptance process before production use. The website currently remains public information and fixed vendor links only.

## Three documents, five delivery methods

| Document | What it records | When it is produced | Operator-selected merchant add-on price |
| --- | --- | --- | --- |
| [Invoice](INVOICE_TEMPLATE.md) | What the customer owes and why | Before payment; revisions preserve prior versions | 0.4% |
| [Enhanced payment receipt](PAYMENT_RECEIPT_TEMPLATE.md) | A completed payment, with organized supporting records | After a verified successful capture; refund records remain linked | 0.1% |
| [Transaction agreement](TRANSACTION_AGREEMENT_TEMPLATE.md) | The specific purchase terms the customer affirmatively accepts | Before payment; material changes require fresh acceptance | 1% |

The user explicitly selected independent add-ons: chosen rates add together, so all three cost **1.5% of the successfully paid transaction amount**, in addition to payment processing. For a $100 successful payment, those add-ons total $1.50. These are optional merchant software charges, not network-mandated fees, customer surcharges or success fees for winning disputes. Selecting or generating a document does not authorize charging the buyer an extra fee.

No fee is activated by this package. Before billing, confirm provider support and publish the complete commercial policy: exact rounding, partial-capture attribution, refunds/fee credits, cancellation, chargebacks, any minimums/caps and applicable tax treatment. The payment amount is the fee basis; invoice face value, failed attempts, authorization holds and repeated delivery attempts are not additional successful payments. No rate establishes an evidence-strength tier: a receipt cannot replace a contract, and a contract cannot prove delivery.

**Basic payment and refund receipts remain included.** The paid receipt option adds organization, linked evidence and export preparation. It must never gate a receipt that a customer is otherwise entitled to receive. Mastercard's June 2026 rules address card-not-present receipts and printable e-commerce receipts, with transaction/region-specific requirements. The vendor/acquirer must validate the final receipt implementation. [Mastercard Transaction Processing Rules, §3.13](https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/transaction-processing-rules.pdf)

Delivery methods are **Text, Email, Social, QR code and Website**. An invoice is a document, not a delivery method. The same agreed price and purchase record must survive switching delivery methods. A public QR code or social post should reveal a generic payment entrance, not a customer's private invoice, address, agreement or evidence. Customer-specific documents require scoped access. A payment receipt confirms an earlier payment; it must not ask the customer to pay the same amount again.

## Requirements have different sources

| Classification | Meaning in this package |
| --- | --- |
| Network/provider requirement | Must be mapped to the actual brand, region, transaction flow and acquiring agreement. The basic receipt is an example; a merchant's optional software choice cannot remove it. |
| Applicable legal requirement | Depends on the transaction and jurisdiction. Consumer disclosures, electronic delivery, refunds and tax rules need a legal applicability review. |
| Product-required field | A consistency or evidence rule we propose for Trolleys, such as a stable order ID. This is not asserted to be a universal legal mandate. |
| Conditional evidence | Collected only if relevant, such as a carrier delivery record for shipped goods. |

An MCC is an industry classification, not a substitute for this applicability review. The merchant cannot change an assigned MCC by choosing a document, a payment example or a delivery method. An acquirer-approved industry mapping is needed before adding specialized templates.

## One connected record, accurate at every stage

1. Create a sale/order record with seller identity, items, total, currency and fulfillment expectations.
2. Select optional documents and show the merchant the combined fee before confirmation. Preserve the exact commercial version accepted by the merchant.
3. Present any transaction agreement and relevant cancellation terms before checkout. Provide an accessible downloadable copy. Record an explicit action, not a preselected checkbox.
4. Hand payment collection to the hosted provider. A displayed invoice, signed agreement, page visit, authorization or merchant-written note is not evidence of successful capture.
5. Produce the basic receipt from verified provider payment state. Produce enhanced receipt organization only when selected. Keep failed attempts, authorization holds, captures, reversals, refunds and payouts distinct.
6. Add actual fulfillment and support records as they occur. Missing evidence stays missing; automation must not invent delivery, acceptance, identity verification, signatures or tax treatment.
7. Assemble a response relevant to the actual dispute reason. The merchant reviews it; the processor's deadlines and submission rules govern. Accept or remedy a valid customer complaint instead of generating a defense by default.

Keep the underlying provider receipt and event identifiers. An enhanced receipt supplements rather than rewrites the source. Version changes, corrections and later refunds append records; they do not silently replace history. Track document creation, delivery attempt, delivery result, opening and affirmative acceptance separately. An email open is not agreement; an agreement is not fulfillment.

## Data and retention

Store only evidence justified by the sale and disclosed purposes. Keep private operational notes out of the customer's receipt. Separate customer copies from restricted evidence exports; authorize and log evidence access. Never put full card numbers, CVV, PINs, payment tokens, access secrets or identity-document images into templates or URLs. PCI SSC prohibits keeping card-verification values after authorization, including encrypted copies. [PCI SSC card-verification guidance](https://www.pcisecuritystandards.org/faqs/are-merchants-allowed-to-request-card-verification-codes-values-from-cardholders/)

Tax evidence needs records supporting both the amounts and business nature of transactions; an invoice alone is not a complete accounting trail. Reconcile gross charges, taxes, fees, refunds, disputes and net payouts. Set a documented retention schedule with counsel/accounting and the acquirer; IRS retention periods vary by record and circumstances. Apply legal holds and privacy requirements rather than one invented universal duration. [IRS supporting records](https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep), [IRS retention guidance](https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records)

## Review before vendor implementation

- Confirm basic receipt compliance and the actual hosted provider events, delivery, document storage and export capabilities. No capability is established by these files.
- Preserve the approved additive rates and successful-payment basis; finalize rounding, multiple captures, refunds/fee credits, minimums/caps and chargeback handling. Display the full fee to merchants before selection.
- Have counsel approve merchant-specific cancellation/deposit terms and electronic acceptance, including any legally required consumer electronic-record consent. Do not require consent to unrelated marketing.
- Validate sales tax, invoice numbering and jurisdictional fields with a qualified tax adviser. No automatic tax calculation, exemption decision or deduction eligibility is implied.
- Review regulated goods, financial/health/legal services, travel/lodging, rentals, subscriptions, minors, donations, home improvement, international sales and other specialized transactions separately. The generic templates do not cover them automatically.
- Use the [evidence matrix](EVIDENCE_MATRIX.md) to test both valid defenses and cases that must be accepted/refunded. Document quality does not override cardholder rights, network rules or the truth of what happened.

The [vendor handoff contract](VENDOR_HANDOFF.md) defines the proposed lifecycle, event dependencies and acceptance checks. No new application, database, checkout, message delivery or document-generation backend is included in this artifact package.
