# D131 — Payments decision and pricing benchmark

Researched **21 September 2026**. US competitor pricing was checked on the official US/USD pages below; those pages do not supply a single effective date for all rates. Rates can change. This is proposal research, not Trolleys pricing, an approved provider configuration, or a promise of merchant eligibility. No application, payment, account or deployment was changed.

The strongest opportunity is to make a business confident about **what it can collect, what it costs, when it receives money, and who helps when something goes wrong**. The existing collection examples are useful; they do not yet answer those purchasing questions. This is a design judgment, not a measured conversion result.

## Current competitor economics

Illustration: one successful **$100 USD domestic online card payment**, without tax, currency conversion, international-card charges, optional products or custom pricing. “Net” is arithmetic after the listed fees, not a promise of the amount or date deposited.

| Official US benchmark | Listed fee basis | Fee on $100 | Net after listed fees |
| --- | --- | ---: | ---: |
| [Stripe Payment Links](https://stripe.com/pricing) | 2.9% + $0.30; links included with standard Payments | $3.20 | $96.80 |
| [Stripe Invoicing Starter](https://stripe.com/invoicing/pricing) paid by the same card | Base processing above + 0.4% per paid invoice | $3.60 | $96.40 |
| [Square Payment Links](https://squareup.com/us/en/payment-links), new customers | 3.3% + $0.30 per online transaction | $3.60 | $96.40 |

Stripe add-ons: manual entry +0.5%; international cards +1.5%; required currency conversion +1%. Optional custom domain: $10/month. Post-payment invoice: 0.4%, capped at $2. Disputes: $15 received plus $15 for manual countering; counter fee returned if won, possible network fees extra. Instant Payouts: 1.5%, $0.50 minimum; Connect differs. [Stripe pricing](https://stripe.com/pricing).

Invoicing Plus is 0.5% per paid invoice; payment processing remains additional. Its pricing includes a hosted invoice page and reminders. Do not confuse invoicing with the separate post-payment invoice add-on. [Stripe Invoicing pricing](https://stripe.com/invoicing/pricing).

Square’s quoted Payment Links rate expressly applies to **new customers**; custom pricing is available, and Afterpay has a separate rate. This is not a claim that all Square customers pay the same price. [Square US Payment Links](https://squareup.com/us/en/payment-links).

**Implication for Trolleys:** these are comparison points, not proposed Etail terms. Do not publish “2.9% + 30¢,” “free invoices,” “no monthly fee,” or “lower cost” until the actual Trolleys schedule and relevant exclusions are approved. A percentage-only comparison hides fixed fees and optional charges.

## Demand evidence and its limits

The Federal Reserve’s report, published **5 December 2024**, uses an optional payments module answered by **4,920 US employer firms**, surveyed September–November 2023. About 80% reported payment challenges; 38% primarily collected at purchase/service, while 28% collected after delivery. It is a weighted convenience sample, not a random survey or a 2026 market estimate. [Report and methodology, executive summary pp. i–ii](https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2024/2024-report-on-payments_sbcs.pdf).

Fees were especially relevant to businesses paid at sale; slow customers mattered for later collection. The report’s “third party” category includes insurance, lender financing and buy-now-pay-later; it should not be relabeled as all payment processors. [Federal Reserve report summary](https://www.fedsmallbusiness.org/reports/survey/2024/2024-report-on-payments).

**Inference:** maintain the practical Booking / Invoice / Sale entry points. Explain different collection needs rather than presenting seven sharing formats as seven separate products. These findings suggest questions to answer; they do not prove Trolleys demand, conversion improvement or a specific segment’s willingness to pay.

## Seven improvements for the public Payments page

1. **Put an approved price and net-payment example within the decision path.** Add a compact cost section after the collection example, with one headline rate or a clear quotation model, included functions, material extras and a $100 calculation. Let visitors expand the detail instead of filling the hero with qualifications. Use the competitor table internally until Trolleys terms are confirmed. This addresses the fee concern above more directly than additional slogans.

2. **Keep “two steps” limited to collecting an already-agreed payment.** The current “Create & share → Your customer pays” illustration is sound for collection. It should not imply that application, underwriting and bank funding also take two steps. A separate short “Getting started” explanation can identify applying, approval and account setup, followed by collection and payouts, once the actual provider sequence is confirmed. Infinicept separates merchant onboarding/underwriting from backoffice fees, risk, chargebacks and funding. [Infinicept platform guide](https://developer.infinicept.com/docs/getting-started-with-infinicept).

3. **Distinguish the payment request from how it is delivered.** Stripe lets one link travel through messages, email, social media, a QR code or a website button. [Sharing documentation](https://docs.stripe.com/payment-links/share). Keep the seven familiar examples, but organize their explanation around the customer's task: request a booking payment, collect an invoice, or sell an item. An invoice needs an actual itemized invoice workflow; SMS/email/QR describe delivery. “QR at your counter” must not imply card-present processing, a contactless reader, or a cheaper card-present rate.

4. **Explain the path from payment to bank deposit.** Add one compact diagram or FAQ: payment received → available for payout → sent to bank. Stripe explicitly separates settlement availability, payout schedule and bank availability; it describes first payouts as typically 7–14 days, potentially longer. [Stripe payouts](https://docs.stripe.com/payouts). Do not copy that timeframe into Trolleys. Obtain first/subsequent payout terms, cutoff, business-day handling and possible holds; then publish a plain answer to “When will I receive my money?” Avoid treating “customer paid” as “cash in your bank.”

5. **Show a credible after-payment outcome.** The next useful illustration is a merchant payment record and a customer confirmation/receipt, using verified provider fields and clearly labeled examples. Stripe documents payment tracking, customer confirmations, email receipts and full/partial refunds after a link payment. [Stripe after-payment guide](https://docs.stripe.com/payment-links/post-payment). A Trolleys example should prove only the capabilities actually enabled; do not fabricate a live dashboard screenshot, successful merchant results or guaranteed notifications. The public site remains informational, with no financial backend.

6. **Make refunds and disputes understandable before application.** Stripe retains original processing fees; card refunds can remain pending if available funds are insufficient. On the illustrated $100 payment, a full refund leaves the merchant bearing the original $3.20 fee, before any other applicable cost. [Stripe refunds](https://docs.stripe.com/refunds). Stripe dispute responses usually have 7–21 days depending on network; the bank decides the outcome. [Stripe dispute response guide](https://docs.stripe.com/disputes/responding). Trolleys needs its own concise explanation of who acts, what can cost extra, notification/deadline handling and where to get help. Do not imply disputes are automatic refunds or that contesting guarantees recovery.

7. **Make eligibility, support and accountability concrete.** Near the final decision, answer who can apply, what information is needed and who assists the merchant. Retain one primary “Get started with Trolleys” action to the approved fixed entrance. Use the existing payments contact for questions; add hours or response commitments only when approved. Infinicept offers different operating models, including Launchpay and Payops, with different allocations of control and responsibility. [Infinicept software-platform solutions](https://www.infinicept.com/software-platform-solutions/). Naming Infinicept alone does not establish Trolleys’ contractual model, support service or merchant liability.

## Provider boundary and internal confirmations

Infinicept documents Launchpay Orchestrate interfaces for card-not-present, card-present and hosted iframe payments, with reporting/funding integration. [Payment processing APIs](https://developer.infinicept.com/docs/payment-processing-apis). This establishes platform capability, not which gateway, methods, screens or commercial terms Trolleys has enabled. Its displayed relative update dates are not a contractual version or launch commitment.

Resolve these in the internal product brief before promoting their answers:

- Actual merchant pricing: fixed/percentage/monthly fees, invoicing, card/country/FX exceptions, refunds, disputes and payout options.
- Eligible business types and regions, restricted uses, required application information, approval process and merchant agreement.
- Enabled invoice, receipt, refund, team-permission and channel behavior; supported card networks/payment methods and any per-merchant conditions.
- First and subsequent funding schedules, reserves/holds, bank requirements, negative balances and refund funding.
- Contracting/acquiring parties, support owner and escalation path, security/compliance statements and any brand approvals.

Do not turn those unknowns into prominent public “pending confirmation” panels. Finish the offer definition, then present approved facts concisely. Until then, keep uncertain claims out of the page. The proposed near-9/10 standard is that a first-time merchant can explain the product, choose an appropriate use, estimate cost, understand funding, find support and anticipate the next step without assistance; it is a usability target requiring customer testing, not a rating proven by this research.
