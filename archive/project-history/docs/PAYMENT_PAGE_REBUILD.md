> **D137 supersedes the independent paid-document model.** The active public candidate uses one optional [Trolleys Sale Records](TROLLEYS_SALE_RECORDS.md) service at 0.4% plus additional vendor charges. The prior pricing below is retained as design history, not the current offer.

# D135 — payments organized around what the customer buys

**Current interpretation:** [D136](PAYMENT_TRANSACTION_DETAILS.md) replaces Digital content with the broader Information category, displays six transaction details for each type and adds concrete paid-workflow value. This D135 record remains implementation history.

21 September 2026. The user accepts the D134 direction and requests rebuilding the Payments page. This implements the public discovery experience, retaining the existing vendor-hosted service boundary. [D134 research and evidence framework](PAYMENT_EVIDENCE_FRAMEWORK.md) is the design basis; it is not a legal certification or a live dispute service.

## One coherent journey

1. **Understand collection.** Keep the accepted two-step hero: the business creates and shares a request; the customer pays. Goods, Services and Digital content examples now use the same registry as the detailed page.
2. **Choose what you sell.** One accessible selector controls the detailed journey. Goods covers shipping and pickup; Services covers work, appointments and activities; Digital content covers downloads and online access. There is no separate scenario dropdown inside each delivery channel.
3. **Explore the documents.** Receipt, Invoice and Agreement previews explain their different jobs and timing. All three previews remain available without selecting a paid service. Basic receipts remain included. Optional Enhanced receipt (0.1%), Invoice (0.4%) and Agreement (1%) are independent selections, clearly marked coming soon. Selecting one does not force another.
4. **Share the request.** Text, Email, Social, QR code and Website retain the same sale description and amount. Invoice and Agreement choices appear before payment; receipt information appears after payment. Changing a channel or sale type preserves the visitor's explicit add-on choices.
5. **Keep relevant records.** Three concise records per sale type explain fulfillment separately from payment: goods delivery/pickup and returns, service scope/performance and communications, or digital entitlement/access and support. These are guidance, not fabricated completed or verified records.
6. **Estimate costs and understand payouts.** The existing exact-cent fee calculator follows the interactive examples. It shares add-on state but accepts an independent payment amount; the link says “Estimate a payment.” The page retains processing, other charges, refund information and the payment-to-bank explanation.

Receipt / Invoice / Agreement are document roles and workflow complexity, not levels of guaranteed legal protection. No L1/L2/L3 protection labels or win-rate claims appear. Mixed purchases have a compact explanation of retaining item-specific promises and records on one order.

## Interface and source organization

`src/modules/public-site/document-example.ts` holds the three example amounts, descriptions, document details and fulfillment guidance. Both the hero artwork and detailed channel illustrations consume it. `PaymentExperience` owns sale type, independent paid selections and the freely selected preview. `PaymentChannelPreview` accepts the sale type rather than owning a conflicting dropdown. The shared product-facts catalog supplies fee labels and exact basis-point rates.

Selected options have explicit pressed states and accessible descriptions. Sale and channel tabsets support arrow keys, Home and End. The mobile channel artwork remains collapsed until requested, avoiding a long mandatory illustration on a phone. Document examples and mixed-sale detail use native disclosures. The accepted company header, footer, card page and fixed Trolleys destination are preserved.

Help, Privacy and Terms explain the three sale types, free previews, independent add-ons and truthful payment/fulfillment distinctions. They reflect browser-only state: no customer information is collected, no example selections are saved, and no payment request, document, signature or evidence submission is created.

## Service and release boundaries

This six-page public website has no active database, financial ledger, account backend or document automation. Existing records and archived source remain untouched. The vendor handoff continues to the approved Trolleys URL without sending example choices, amounts or referrers. Optional document services still require provider implementation, applicable legal review and complete fee/refund rules before activation. The existing [template and vendor package](payment-documents/README.md) remains a review specification, not provider functionality.

Verification results and evidence paths are recorded in [current status](../planning/STATUS.md). This task prepares the local website; it does not push, merge or deploy it. PR #30 / D129 remains the live release.
