# D146 — recognizable banking experiences

21 September 2026. The user finds the “Your customer’s banking app” and “A participating bank” examples insufficiently realistic. Replace the two receipt-like panels with distinct, neutral customer and bank-support interfaces while keeping the merchant → Order Insight connection.

## Customer experience

A phone frame opens on **Transaction details**. Merchant name, posted amount, transaction date, masked illustrative card and statement name establish which charge is being examined. An accessible **Purchase details** disclosure contains the matching item, reference, fulfillment information and merchant support. It opens initially and can be collapsed with pointer or keyboard. No report, contact or dispute submission is implied by a decorative control.

## Bank support experience

A wider **Transaction inquiry** workspace has an inquiry reference, customer question, transaction summary and clearly attributed **Merchant response — via Order Insight**. The response reuses the same purchase and fulfillment context as the phone. A short progression ends at **Ready to review**, never a fabricated resolution or win.

Goods have a delivery example; Services have a work-completion example; Information has supplied-by-email and as-of details. These dates, masked digits, references and the reserved `.example` support address are illustration data, not customer records or evidence that any transaction or delivery occurred. Goods / Services / Information selection remains shared with the existing payment examples. The optional 0.4% offer, processing/vendor charges and eligibility limits do not change.

## Research and design boundaries

- [Visa Order Insight](https://www.visa.com/en-us/products/order-insight) describes merchant, transaction and order details for participating issuers and customers.
- [Visa Resolve Online](https://usa.visa.com/solutions/post-purchase-solutions/visa-resolve-online.html) distinguishes Digital banking-app receipts from Call Center transaction inquiries.
- [Verifi Order Insight](https://www.verifi.com/solutions-sellers/prevent-disputes.html) describes detailed receipts in banking apps and enhanced information for issuer call centers.
- [Verifi’s transaction example](https://www.verifi.com/in-the-news/take-control-disputes-holiday-season.html) supports itemization, delivery confirmation and merchant-support context. Services completion and Information freshness are our design application of contextual merchant records, not a claimed universal provider field schema.
- [Capital One transaction guidance](https://www.capitalone.com/help-center/checking-savings/find-transaction/) supports the familiar transaction-detail pattern. No Capital One branding, customer data or private UI is copied, and no bank affiliation is implied.

The small illustration caption states that available details and layouts vary by bank. No invented bank name, supplier response, fraud adjudication, refund, CE3.0 eligibility or guaranteed outcome is added. The operator’s live-integration confirmation remains the provenance; the public site does not execute the integration.

## Runtime and verification

Public-only local illustration state. No API, storage, account, database, provider or legal/commercial change. Source and responsive/accessibility evidence is recorded in `planning/STATUS.md` and `artifacts/d146-checks/`. D145 / PR #32 remains live until a separately authorized release.
