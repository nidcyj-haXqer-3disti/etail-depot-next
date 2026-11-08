> **D137 supersedes the independent paid-document model.** The active public candidate uses one optional [Trolleys Sale Records](TROLLEYS_SALE_RECORDS.md) service at 0.4% plus additional vendor charges. The prior pricing below is retained as design history, not the current offer.

# D133 — payment documents and delivery channels

Current public presentation: [D135](PAYMENT_PAGE_REBUILD.md) replaces the original Booking/Service/Sale selector with Goods/Services/Digital content and keeps all document previews available without paid selections. The D133 pricing, template and provider boundaries below remain.

21 September 2026. The user selects three independent optional merchant services: Invoice 0.4%, enhanced Payment receipt 0.1%, Agreement 1%. All three add 1.5% to processing. These are operator-selected software prices, not network requirements or confirmed vendor capabilities. D133 supersedes D132's Invoice/Bill delivery formats and standalone invoicing estimate.

## Customer experience

The Payments page separates document choice from delivery. The five delivery methods are Text, Email, Social, QR code and Website. Booking, Service and Sale examples preserve their amount and purpose as the visitor switches channels. The local document selector and fee calculator share selection state, start with no paid options, and itemize each selected fee independently. A $100 domestic online card example with all three selected shows $3.20 processing, $0.40 invoice, $0.10 enhanced receipt, $1.00 agreement and $95.30 after those fees.

An invoice requests payment. An agreement requires affirmative acceptance before payment. A receipt follows verified successful payment. A basic transaction receipt remains included, whether or not enhanced organization/export is selected. A receipt alone is not proof of fulfillment. The document preview follows the selected example and distinguishes pending fulfillment from actual records.

Document add-ons are explicitly **Coming soon**. The public controls are illustrations, not orders, signatures, payment collection, fees, document delivery or dispute submissions. They do not collect customer details, persist selections or call a provider. The normal Trolleys handoff stays at the approved vendor URL. No archived application or database is reconnected. The existing card product, company header/footer and public-only site boundary remain.

## Original templates and research

The [review package](payment-documents/README.md) contains an [invoice](payment-documents/INVOICE_TEMPLATE.md), [payment receipt and enhanced record](payment-documents/PAYMENT_RECEIPT_TEMPLATE.md), [transaction agreement](payment-documents/TRANSACTION_AGREEMENT_TEMPLATE.md), [evidence matrix](payment-documents/EVIDENCE_MATRIX.md) and [vendor implementation contract](payment-documents/VENDOR_HANDOFF.md).

These are original US general-commerce drafts for qualified counsel, tax and acquiring-provider review. They are not lawyer-authored/approved, exhaustive industry-specific legal forms or a guarantee against chargebacks. Network obligations and actual evidence depend on the transaction, region and dispute reason; price is not a protection tier. The drafts preserve statutory rights, never equate consent with payment/fulfillment, and do not invent signatures, authorization, refunds or delivery evidence.

Primary sources include Mastercard Transaction Processing Rules (9 June 2026, §3.13), Visa Dispute Management Guidelines (June 2024), CFPB Regulation Z §1026.13, federal E-SIGN, FTC merchandise-delivery rules, IRS supporting-record guidance and PCI SSC card-verification-data guidance. Exact source links and applicability limits are recorded in the templates and matrix. No copyrighted law-firm form was copied.

The matrix covers unauthorized, non-delivery/non-performance, not-as-described, incorrect-amount, duplicate-payment, cancellation/return, missing-refund and processing issues. Six common-business modules cover booking/deposit, completed services, goods, remaining balances, events and business orders. Specialized/regulated industries require additional reviewed modules; no generic template is represented as defending every possible dispute.

## Vendor implementation still required

The handoff defines event provenance, scoped access, explicit versioned acceptance, actual capture/refund states, idempotent document and fee effects, partial payments, corrections, protected document delivery, evidence export and customer rights. It is a specification, not an implemented financial service. The provider must confirm capabilities and integrate them into its separately hosted account product.

Before activation, finalize fee credits/refunds, failures, multiple captures, minimums/caps, rounding and tax treatment, and approve industry-specific legal terms and electronic-record consent. The public calculator uses exact integer cents with separate half-up rounding for illustration; this does not configure vendor billing. Never silently pass merchant add-on fees to the buyer. Live generation, acceptance, communication, storage and fees remain inactive.

## Verification

See the current D133 entry in [status](../planning/STATUS.md) for completed checks and artifact paths. Local verification is separate from vendor acceptance, legal approval and publication. D129 / PR #30 remains live until a separately reviewed release.
