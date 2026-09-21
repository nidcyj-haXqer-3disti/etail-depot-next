> **D137 supersedes the independent paid-document model.** The active public candidate uses one optional [Trolleys Sale Records](TROLLEYS_SALE_RECORDS.md) service at 0.4% plus additional vendor charges. The prior pricing below is retained as design history, not the current offer.

# D136 — useful document services, priced by the work they remove

21 September 2026 · Product proposal and provider acceptance requirements

This is the current interpretation of **Goods / Services / Information** and the three independent document add-ons. It supersedes D134's narrowing of Information to digital files and any suggestion that Receipt / Invoice / Agreement are protection tiers. The public website shows examples of **coming-soon** services; it does not generate, sign, deliver, store or bill real transaction documents. The separately hosted provider must implement and verify the workflows below before they are advertised as available.

## The product promise

Charge for three different jobs: **organize the record, collect an amount owed, and record the agreed scope**. Do not charge for the customer's right to a basic receipt, promise a dispute outcome, or sell the same generated PDF three times. The approved merchant rates remain Enhanced receipt **0.1%**, Invoice **0.4%**, Agreement **1%** of the relevant successful payment amount, plus processing. Selections are independent; all three add **1.5%**. Nothing here introduces a minimum, cap, bundle or buyer surcharge.

| Service | One-sentence value for the interface | Paid output and work removed | When it is unnecessary |
| --- | --- | --- | --- |
| **Basic receipt — included** | Your customer gets a record of their payment. | The provider's payment/refund receipt, required transaction facts, access to a copy and ordinary payment status. | It remains available even when every paid option is declined. |
| **Enhanced receipt — 0.1%** | Bring the payment, delivery records and any refunds together in one downloadable record. | A sale-linked record that assembles actual supporting material, identifies missing records and exports a factual timeline with originals. Saves finding order, payment, fulfillment and support records across separate tools. | A simple immediate sale whose ordinary receipt already meets the merchant's needs, or an existing system that already assembles the same material. |
| **Invoice — 0.4%** | Create an itemized invoice, send reminders and track the unpaid balance until it is paid. | Reusable customer/items, itemization, due date, hosted invoice and PDF, supported reminder schedule, payment allocation and corrections. Saves recreating bills, chasing payment and manually reconciling amounts due. | An immediate checkout with an already-agreed price and no separate billing need; an invoice already issued and managed elsewhere. |
| **Agreement — 1%** | Set the scope and cancellation terms, collect acceptance before payment, and keep the accepted version with the sale. | Guided transaction terms using applicable reviewed modules; exact presented version, affirmative acceptance, customer copy, change history and links to the order. Saves repeated drafting and locating which terms were accepted. | A straightforward sale adequately described by its existing terms, or an existing valid agreement covering this sale. It is not compulsory because Invoice or Enhanced receipt was selected. |

The Enhanced receipt fee buys **organization and export**, not access to otherwise included records or a substitute for collecting real evidence. An Invoice records the amount requested; it is not a receipt until actual payment is linked. An Agreement records commitments and acceptance; it cannot manufacture later performance or prove that a payer owned the card. A timestamped typed name alone is not a verified identity claim.

## Goods, Services and Information are usable dimensions

The interface may offer three example types, but a real sale can combine them. **Information** includes knowledge, findings, instructions, analysis, specifications or access to information. It may be supplied in a live briefing, written report, printed pack, ongoing access or another agreed format; it is not synonymous with a downloadable file. Separately, every sale has descriptive information needed to explain its promise. These product dimensions do not replace the merchant's MCC or decide legal classification.

| Dimension | Receipt record adds useful context | Invoice makes the charge clear | Agreement makes the promise clear | Actual fulfillment to retain |
| --- | --- | --- | --- | --- |
| **Goods** | Item, quantity and order reference; later shipment/pickup/refund links | Unit price, quantity, delivery/tax amounts and outstanding balance | Specification, customization approval, delivery and return terms | Actual carrier/pickup records and relevant item/condition evidence |
| **Services** | Appointment/work reference; advance versus final payment | Scope, hours or milestones, deposit and remaining amount | Deliverables, exclusions, timing, responsibilities and change procedure | Dated work/attendance records, deliverables and relevant customer communications |
| **Information** | Topic or product, version/period, format and recipient/order linkage | What briefing, report, research or access period is charged | Defined subject and scope, intended use, format, delivery, permitted use and relevant limitations | Actual briefing attendance, supplied version, delivery/access records or other evidence appropriate to the promised format |

A “research briefing” example should show the agreed subject, delivery format and due date, then leave evidence **pending** until the briefing or information was actually supplied. Do not show a download log for an oral briefing. A goods order with installation and instructions can retain all three dimensions under one order without three copies of the same service fee. Information involving legal, medical, financial or other regulated advice requires a separately reviewed scope; the generic agreement is insufficient.

## What the industry references establish

Stripe currently lists Invoicing Starter at **0.4% per paid invoice**, alongside hosted invoice pages, collection reminders, analytics and reconciliation features. Its separate lifecycle guidance distinguishes editable drafts, issued invoices and payment outcomes. The useful benchmark is a billing workflow, not an extra charge for formatting a document. These Stripe capabilities do not establish Trolleys vendor support. [Stripe pricing](https://stripe.com/invoicing/pricing), [invoice lifecycle](https://docs.stripe.com/invoicing/overview)

Stripe also creates ordinary receipts for successful payments and refunds. Its documentation separates these from separately configured paid-invoice features. This supports a clear included-receipt boundary; Etail's own add-on rate is an operator choice, not a card-network requirement. [Stripe receipts](https://docs.stripe.com/receipts)

Docusign's eSignature plans use subscription and envelope allowances; an envelope can contain several documents and signers. PandaDoc offers seat-based and document-based pricing, alongside reusable content, approvals and document/payment workflows. These are relevant alternatives to manual agreement administration, not proof that a percentage of the sale is the right fee. [Docusign plans](https://ecom.docusign.com/plans/esignature), [PandaDoc pricing](https://www.pandadoc.com/pricing/)

PandaDoc's audit trail records separate activities such as sending, viewing, signing and payment status, and supports export. Its payments tool also permits manually marked outside payments while recording that intervention. The design lesson is provenance: a merchant assertion and a processor-confirmed capture must remain distinguishable. We should not label an imported manual “paid” flag as verified card capture. [Audit trail](https://support.pandadoc.com/en/articles/9714819-review-audit-trail-for-sent-documents), [payment workflow](https://support.pandadoc.com/en/articles/9714744-payments)

These official pages were checked on 21 September 2026. Prices, plan entitlements and regional availability can change. No competitor's contract, price or functionality is adopted automatically.

## Is 1% defensible?

**Not for a static template or signature capture alone, particularly at high transaction values.** A credible paid offer must deliver the agreed workflow above and demonstrate that merchants value the administrative work it removes. Neither document length nor speculative chargeback savings justifies the percentage.

| Successful payment | Enhanced receipt 0.1% | Invoice 0.4% | Agreement 1% | All three 1.5% |
| --- | ---: | ---: | ---: | ---: |
| $100 | $0.10 | $0.40 | $1.00 | $1.50 |
| $1,000 | $1.00 | $4.00 | $10.00 | $15.00 |
| $10,000 | $10.00 | $40.00 | $100.00 | $150.00 |
| $50,000 | $50.00 | $200.00 | $500.00 | $750.00 |

These are merchant document fees only, excluding processing and any applicable taxes. At $50,000, a $500 agreement charge needs a much stronger value case than the same workflow at $100. The work may not grow in proportion to sale value. Evaluate a cap, fixed per-agreement price or subscription against actual vendor costs and merchant willingness to pay before commercial activation. **Those are proposals for a separate pricing decision; the approved 1% is unchanged and no cap is implied.** The same scaling concern applies to the other add-ons.

Test merchants performing representative goods, services and information sales. Measure time spent creating a bill, reconciling partial payment, retrieving records and locating the accepted terms with their existing tools versus the proposed flow. Show the actual dollar fee at their typical and largest sale values. Validate whether they would buy each service independently. Do not claim time savings or dispute improvements until measured.

## Provider acceptance criteria

These supplement the [vendor implementation contract](payment-documents/VENDOR_HANDOFF.md). They are release requirements for the hosted service, not claims about an existing integration.

1. **Included baseline:** Successful payments/refunds provide appropriate basic receipts and copies without a paid choice. Ordinary transaction records and legally required access cannot be withheld to sell Enhanced receipt. Confirm applicable provider/network receipt content and availability.
2. **One sale, consistent facts:** Reuse approved order lines, amounts and identifiers across selected documents. Support mixed dimensions without duplicate fees. Capture versioned disclosures and distinguish planned fulfillment from actual events.
3. **Observable enhanced output:** Demonstrate assembly and export of original linked records, source/timestamp attribution, refunds and corrections, plus an honest missing-record list. Confirm which integrations supply records and which require merchant uploads; do not advertise automatic carrier, attendance or access capture without one.
4. **Working invoicing:** Demonstrate draft, issue, permitted correction, due date, partial payment, balance reconciliation and void/credit handling. Prove supported reminders, appropriate delivery permission, retry controls and stopping/pausing after payment, cancellation or a contested balance. No reminders or automatic collection beyond authorized scope.
5. **Working agreements:** Applicable reviewed text is presented accessibly before the relevant payment; the buyer affirmatively accepts the exact retained version and can obtain it. No prechecked assent, retroactive terms or required acknowledgment of unperformed work. Material changes need renewed acceptance. Separate legal counsel review and identity verification from ordinary acceptance records.
6. **Accurate events and fees:** Verify capture from the payment provider rather than browser success or authorization. Test duplicate/out-of-order events and partial captures; retrying delivery, changing channels, regenerating a copy or exporting records must not bill twice. Merchant approval must identify each rate, combined rate and amount basis. Resolve rounding, refunds/fee credits, partial captures, tax and failure-to-deliver remedies before billing.
7. **Safe sharing:** Text, Email, Social, QR code and Website open the same authorized transaction journey. Public posts/QR codes cannot expose private documents. After payment, links show the appropriate receipt/status instead of inviting accidental repayment. Signed records, private evidence and public marketing examples have distinct access boundaries.
8. **Reviewable export:** The merchant can inspect and correct attribution, select relevant evidence and export without fabricated events. No automatic filing, representation or promised outcome. Preserve consumer dispute rights; review governing jurisdictions, mandatory notices, retention and specialized industries with qualified advisers before launch.

The public demonstration should communicate these jobs using concise example outputs and **Coming soon**, while retaining freely explorable previews and no default paid selection. It must not imply that selecting an example sends a document, signs an agreement, submits evidence or activates a fee.
