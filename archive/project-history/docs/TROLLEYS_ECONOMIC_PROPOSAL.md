# Trolleys economics proposal

> **Current rate, D159:** The user corrected the selected Two Step rate to **2.9% + 30¢**, with no monthly fee. Included creation/sharing and optional Clarity remain. Earlier rate proposals and D158's 3.0% selection below are historical; no provider billing or deployment change is included.

> **Selected offer, D158:** The user subsequently approved Trolleys Two Step at **3.0% + 30¢**, no monthly fee, with creation and sharing included. This supersedes the rate and subscription alternatives below for the local public offer. D155 calculations remain historical scenario analysis, not a current fee schedule or realized margin. Publication and hosted billing configuration are separate.

> **Membership update, D156:** The user prefers $5 monthly or $36 annually. [The revised membership proposal](TROLLEYS_MEMBERSHIP_PRICING.md) supersedes the $49 Growth candidate below. Its processing-discount economics are historical analysis, not an active recommendation. The proposed 3.3% rate has not been accepted or published; the current website price remains unchanged.

22 September 2026 · D155 · US merchants, USD

**Recommendation: make Trolleys Two Step the core paid collection product, priced when a payment succeeds. Test $0 setup/monthly and 3.3% + 30¢ per successful domestic online card payment. Keep Clarity optional at the existing +0.4%.** A later $49/month plan with 2.9% + 30¢ is conditional on verified costs and recurring merchant value.

These are proposal prices, not approved replacements for the current offer. The public website remains 2.9% + 30¢ with the existing Clarity option. No application, database, provider, policy or deployment change accompanies this research. Actual Infinicept commercial terms and Trolleys merchant willingness to pay have not been supplied; all supplier costs below are explicit sensitivity assumptions.

## 1. What needs to change in the business model

The current pricing card makes payment links and QR sharing look like peripheral free features. They should be presented as the product merchants buy: create a clear request, share it where the customer is, accept payment and see the result. Basic receipts belong in that complete experience.

Inclusion does not mean zero revenue. The successful-payment fee funds the workflow as well as acceptance. Charging for each draft, QR generation, copied link, delivery channel or repeated share would penalize distribution and compare poorly with competitors. Trolleys should earn more when merchants successfully collect more.

The initial 2.9% + 30¢ figure was a selected Stripe retail benchmark. It establishes neither Trolleys' upstream processing cost nor retained revenue. Raising the selling price alone cannot create a durable business if acquisition, servicing and supplier costs consume the margin.

## 2. What the market says

| Benchmark | Public US offer | Economic lesson |
| --- | --- | --- |
| Stripe Payment Links | Included with standard Payments at 2.9% + 30¢ for successful domestic card transactions | The collection interface supports transaction revenue; core link creation is not separately priced. |
| Square Payment Links / Free | Hosted online payments at 3.3% + 30¢; no monthly fee | A higher bundled retail rate exists, but it comes with a broad established product. |
| Square Plus | $49/location/month; online/invoice payments at 2.9% + 30¢ | Frequent users can exchange a subscription for lower variable fees and software benefits. |
| Helcim | Included payment tools; lowest-volume online markup is interchange + 0.50% + 25¢ | Sophisticated merchants can compare transparent cost-plus alternatives. This figure excludes interchange and is not an all-in rate. |

Sources: [Stripe pricing](https://stripe.com/pricing), [Stripe Payment Links](https://stripe.com/payments/payment-links), [Square Payment Links](https://squareup.com/us/en/payment-links), [Square pricing](https://squareup.com/us/en/pricing), [Helcim pricing](https://www.helcim.com/pricing/). Checked 22 September 2026. Square's API rate is a separate comparison; its paid plans apply per location. Product scope, approval, international cards, refunds and other fees differ.

Additional evidence: Stripe separately prices Billing at 0.7% of Billing volume, while Helcim lists recurring payments at +0.4% per transaction. These are specific automation products, not proof that a share button merits the same fee. QuickBooks combines acceptance with paid accounting workflows. PayPal's Payment Links marketing page and its POS payment-link fee schedule have different fixed fees; this proposal does not collapse them into one universal price. [Detailed competitor review](research/d155-competitor-pricing.md).

The Federal Reserve's 2024 payments study finds payment fees especially prominent for businesses paid at purchase, while businesses paid after delivery face more slow-paying customers. Its 2026 employer-firm report, based on the 2025 survey, reports uneven cash flow at 50% and rising costs at 73%. That supports a collection problem and simultaneous price sensitivity. It does not establish demand for Trolleys or willingness to pay a premium. [Payments study](https://www.fedsmallbusiness.org/about/media/2024/payments-challenges-small-businesses-face-20241205), [2026 employer report](https://www.fedsmallbusiness.org/-/media/project/clevelandfedtenant/fsbsite/reports/2026/2026-report-on-employer-firms/2026-report-on-employer-firms.pdf).

The 2025 Intuit US panel reports 47% of respondents had some invoices more than 30 days overdue. This vendor-sponsored survey supports further discovery, not a causal claim that payment links solve late payment. [Intuit study](https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/). Survey samples and limitations are recorded in the [demand review](research/d155-market-demand.md).

## 3. Where to start

**First hypothesis: service businesses collecting deposits and outstanding balances.** Examples include project services, agencies, field services and appointment businesses, subject to actual underwriting. A focused pilot could recruit merchants collecting $10,000–$50,000/month with typical tickets of $75–$500. These ranges are recruitment hypotheses, not market measurements or eligibility rules.

Custom goods sold through conversations are the next segment: the request can clarify what is being purchased and the delivery expectation. Information sellers need separate discovery because the purchase can depend on subject, timing, freshness, scope and access. Regulated advice, restricted products and higher-risk categories require their actual approved terms; an Information selector does not establish eligibility.

The value proposition to test is **less chasing and a clearer path from request to paid**, measured against what each merchant currently uses. Instant checkout retail is crowded and price-sensitive. Small tickets also magnify fixed transaction charges: the proposed 3.3% + 30¢ costs 6.3% on a $10 payment and 3.6% on $100. Large service tickets require a later bank-payment assessment; no ACH availability, rate or refund policy is added by this proposal.

## 4. Proposed packaging

| Offer | Proposed charge | Scope and condition |
| --- | --- | --- |
| **Trolleys Two Step** | **$0 setup/month + 3.3% + 30¢** | One bundled price for each successful domestic online card payment. Primary price to test. |
| **Trolleys Clarity** | Existing optional **+0.4%** | Eligible enrolled successful-payment volume. Separately elected; measure its costs and outcomes independently. |
| **Growth, later** | **$49/month + 2.9% + 30¢** | Candidate for frequent users, only after wholesale economics and recurring software value are verified. Not a launch requirement. |

Two Step should include preparing sale-specific requests, sharing the same checkout across supported channels, accepting payment, payment confirmation/basic receipts and payment-status visibility. Operator-confirmed vendor capabilities still need an actual end-to-end walkthrough and billing verification before promising a precise workflow. The current public website demonstrates this experience; it does not execute payments or verify the hosted implementation.

Automated reminders, deposit/balance scheduling, saved workflows, team ownership, reconciliation and integrations are possible Growth benefits. They are proposals, not verified shipped Trolleys capabilities. Their names alone do not differentiate the product; some competitors already include similar tools. Establish meaningful time saved or collection improvements.

The proposed base is 40 basis points above the current price and Stripe's domestic rate, equal to $40 extra on $10,000 collected. A $100 payment would cost $3.60, or $4.00 if eligible and enrolled in Clarity. The extra 0.4 percentage points in the base price are distinct from the optional Clarity fee. Do not show the base as 3.3% plus another mandatory Two Step fee.

Growth becomes cheaper than the proposed base above **$12,250/month**, assuming the same applicable volume and transaction count: $49 / 0.004. It offers a lower rate at higher volume; this does not prove equivalent value to Square Plus or a competitive advantage over Stripe's $0-monthly 2.9% offer.

### Charging rules to finalize before publication

- Charge the merchant for successful captured payment volume, not for drafting, copying, scanning or resending. Define the billable event and rounding with the processor, reconcile it once and prevent duplicate fee events.
- Share actions are not payment transactions. A request shared through several channels remains the same request; configure any single-payment or reusable behavior clearly.
- Distinguish manual sharing from messages actually sent by Trolleys. Platform-sent SMS incurs segment, carrier, registration and number costs. Define an allowance or disclosed overage only if that service is offered; do not promise unlimited paid messaging. [Twilio's US cost structure](https://www.twilio.com/en-us/sms/pricing/us) is an illustration, not Trolleys' supplier contract.
- Finalize partial captures, refunds, reversals, chargebacks, failed authorizations, international cards, currency conversion and exceptional fees. Do not assume the processor returns original fees or absorbs every event cost.
- Keep merchant fees separate from customer checkout pricing. This proposal does not introduce a consumer surcharge or convenience fee.
- Existing merchant contracts need their applicable change process. Pricing an acquisition test does not automatically reprice an existing account.

## 5. Retained economics

Infinicept's current Launchpay page describes merchant-pricing control, transaction-level cost visibility and both flat-rate and interchange-plus pricing. It also advertises no setup/platform fees and assumes specified PayFac responsibilities. Those public statements are not a review of Etail's signed product, gateway or contract. The indexed calculator FAQ describes a buy-rate arrangement rather than revenue sharing; direct retrieval of that older URL returned 404 during this review. Use the actual agreement, not an invented revenue-sharing percentage. [Current Launchpay product](https://www.infinicept.com/launchpay/), [indexed calculator FAQ](https://www.infinicept.com/launchpay-calculator/).

For each merchant, monthly contribution is:

`Merchant fees billed − external transaction costs − direct account support − variable operations − unrecovered losses − other directly attributable fees`.

Merchant fee billings are not necessarily Trolleys' accounting revenue. Payment volume is merchant money; gross versus net revenue presentation depends on the contractual accounting treatment. Contribution is before customer acquisition, initial onboarding, company overhead and tax.

### Explicit model assumptions

| Input | Assumption |
| --- | --- |
| Scope | Domestic online cards; no Clarity in the base model |
| External transaction cost A | 2.2% + 15¢ |
| External transaction cost B | 2.6% + 20¢ |
| External transaction cost C | 2.9% + 30¢ |
| Direct account support | $15 per active merchant/month |
| Internal variable operations | 5¢ per successful payment |
| Unrecovered losses borne by Trolleys | 0.05% of volume; sensitivity assumption, not a measured loss rate |

**All three supplier cases are hypothetical blended costs, not Infinicept quotes, market averages or probabilities.** Replace them with actual interchange, assessments, processing, gateway and applicable transaction charges for the observed card mix. Any platform minimum or monthly provider fee must be allocated separately if applicable. Costs for failed attempts, refunds and disputes require separate counts; the simple model does not silently cover them. Do not count a supplier charge both in the blended cost and again as operations.

If the signed arrangement leaves Trolleys with no unrecovered payment losses, set that input to zero; do not treat public provider marketing as sufficient evidence. A refundable reserve is working capital, not automatically a loss expense. The model's loss allowance is separate from dispute handling fees.

### Monthly contribution by merchant

At a $100 average successful payment, after the modeled supplier, support, operations and loss costs:

| Monthly collected volume | Supplier assumption | Current 2.9% + 30¢ | Proposed Two Step | Future Growth |
| --- | --- | ---: | ---: | ---: |
| $2,000 | B | −$9 | −$1 | $40 |
| $10,000 | A | $60 | $100 | $109 |
| $10,000 | B | $15 | $55 | $64 |
| $10,000 | C | −$25 | $15 | $24 |
| $50,000 | A | $360 | $560 | $409 |
| $50,000 | B | $135 | $335 | $184 |
| $50,000 | C | −$65 | $135 | −$16 |

The low-volume Growth number assumes a merchant actually accepts a $49 subscription; it is not evidence that this customer will buy it. The negative high-volume Growth case shows why lower rates require adequate wholesale spread.

In the middle assumption, 100 merchants each collecting $10,000/month at a $100 ticket produce **$1 million payment volume, $36,000 merchant fee billings and only $5,500 contribution** under Two Step, before acquisition and company fixed costs. A hypothetical $20,000 monthly fixed budget would require about 364 such active merchants before acquisition costs. This is scenario arithmetic, not a forecast.

At the same ticket size, proposed Two Step covers its modeled direct costs from roughly $2,143/month in case B or $5,000/month in case C. Under B, a hypothetical $300 acquisition cost has about 5.5 months of payback at $55/month contribution, assuming retention and stable volume. Neither acquisition cost nor retention has been measured.

Ticket sensitivity matters: in case C, $10,000/month with a $20 average payment produces **−$5** under Two Step. At a $10 average payment, the assumed per-payment costs make the contribution slope negative, so more volume alone cannot repair the model. At a $100 average payment, Growth in case C becomes negative above $34,000/month. These are reasons to negotiate costs and segment the offer before acquiring volume. The model charges the assumed $15 support cost for an active merchant even in a zero-volume month.

Reproducible Decimal calculations: [D155 model](research/d155-economics-model.py). It covers 81 plan/cost/volume/ticket combinations, using expected count = volume / average ticket. It is planning analysis, not a production ledger or fee-rounding specification.

## 6. Give Clarity its own economic test

Keep the existing +0.4% optional, and make the base payment product sustainable without uptake. For Clarity:

`Contribution = 0.004 × eligible enrolled successful-payment volume − inquiry/event charges − account/platform charges − data/support/integration costs`.

Supplier billing might be per inquiry, event, account or another basis. The actual Order Insight route and contract determine it. A percentage charged to merchants must not be mistaken for a percentage retained by Trolleys. At $10,000 enrolled volume, fee billings are $40 before those costs.

Merchant value should be measured through useful transaction recognition, resolved inquiries, eligible dispute outcomes and staff time saved. Compare the incremental fee with evidenced outcomes, avoid counting prevented and recovered amounts twice, and distinguish outcomes caused by the service from ordinary non-disputed payments. [Visa Order Insight](https://www.visa.com/en-us/products/order-insight) supports the recognition/inquiry and conditional fraud-deflection functions. It does not promise universal coverage or a guaranteed dispute win.

## 7. Validate before adopting prices

1. **Get the actual commercial schedule.** Confirm the precise Infinicept product, pricing authority, cost components, platform minimums, gateway bill, merchant onboarding/support obligations, loss allocation, settlement and Clarity billing. Model card mix and ticket size. No new price is approved merely because a competitor charges it.
2. **Walk the hosted product end to end.** Validate request creation, supported sharing, customer payment, confirmation, partial payment rules, activity, refund and fee reconciliation. Establish which automation is actually available and which needs development.
3. **Run focused discovery and a paid pilot.** Recruit an initial 20–30 merchants across the priority service cases and custom goods. Observe their existing process. Test comparable offers at 2.9%, 3.1% and 3.3% plus 30¢, with the same disclosed terms and cohort controls. This is exploratory learning, not a statistically conclusive experiment; size a larger test once baseline conversion and variability are known.
4. **Measure behavior and retained value.** Track activation to first paid request, payment completion, time to payment, retained volume at 30/60/90 days, servicing cost and realized contribution. Price selection should consider retained contribution per acquired merchant, not only the number accepting a quote or a raw processing-margin percentage.
5. **Set a commercial release gate.** Require positive contribution under the actual contract, an explicit acquisition payback budget and evidence that merchants prefer the workflow at the offered price. A six-month acquisition-payback target is a proposed management limit, not an industry fact. Follow loss/dispute cohorts long enough to observe delayed costs; a short pilot alone cannot establish mature risk economics.
6. **Introduce Growth only when justified.** It needs sustained usage, verified lower-rate margin and a supported reason to subscribe. Use the $12,250 fee crossover to explain plan choice; do not force a subscription merely to hide unprofitable processing.

## 8. Payment-page direction after commercial approval

Present **Trolleys Two Step** as the main offer, with a short outcome line such as **Create it. Share it. Get paid.** The two illustrated merchant steps remain Create and Share; payment is the customer outcome. Show one applicable bundled price and concise inclusions rather than repeating “free” beside the product's main capabilities.

Place optional **Trolleys Clarity** beside or below the core offer with a separate opt-in and total-fee clarity. Detailed exceptions and account terms remain accessible. Do not expose supplier mechanics in marketing, make unsupported savings claims or promise a payment speed the provider has not confirmed.

This proposal changes the commercial framing and recommends price experiments. It does not authorize a public price change, provider configuration, new billing service or deployment.
