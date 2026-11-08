# D131 — a plan for a 9/10 public product experience

21 September 2026 · Research and proposal · US-first benchmark

This plan follows the [customer assessment](CUSTOMER_EXPERIENCE_REASSESSMENT.md) and the deployed PR #30 experience. It proposes changes; it does not change the website, prices, provider services or database. The future Trolleys onboarding/dashboard remains vendor-owned and outside the redesign scope. The 9/10 scores are targets to earn through evidence, not new ratings awarded to an unbuilt proposal.

## Recommendation

Preserve the accepted identity, header/footer and useful artwork. Make the offer understandable enough to choose: who it is for, what it costs, what happens to the money, what happens when something goes wrong and what the next action does.

Use Stripe for payment explanation and cost visibility, American Express for benefits/conditions and card-selection clarity, Brex for explicit business fit and operational controls, and a secured-card issuer for the deposit explanation. These are different products; their terms cannot be combined into an invented Etail offer.

Keep navigation **Payments / Cards / Help**, product names **Trolleys Payments** and **Ledgix Digital Wallet Card**, and the descriptor **virtual Visa secured credit card**. “Two-step payments” is a useful explanation of collection after account approval. It is not the legal product name or a claim that onboarding, settlement and bank receipt take two actions.

## 1. Market evidence and positioning

The Federal Reserve's payment-specific small-business research identifies fees, slow customer payment and delays in access to funds as separate pain points. Its newer employer report also identifies customer acquisition and costs as important business challenges. These support a proposition around collecting an agreed payment and understanding its cost and timing; they do not prove Trolleys will increase sales. The consumer diary reports substantial use of both remote and in-person payments, supporting link and QR examples. The payment-specific study uses 2023 responses; the newer employer/consumer findings use 2025 observations. [Payments research](https://www.fedsmallbusiness.org/about/media/2024/payments-challenges-small-businesses-face-20241205), [2026 employer report](https://www.fedsmallbusiness.org/reports/survey/2026/2026-report-on-employer-firms), [2026 consumer diary](https://www.frbservices.org/binaries/content/assets/crsocms/news/research/2026-diary-consumer-payments-choice.pdf).

**Initial Trolleys audience to validate:** service businesses collecting booking deposits and completed-work invoices. Keep sales/pop-ups as a secondary example. This gives the page a concrete job without claiming to replace a full point-of-sale or commerce suite.

**Proposed Trolleys positioning:** “Payment links for bookings, invoices and sales.” Supporting value: create a clear request, share it where the conversation happens, then see its payment and payout status if the configured vendor service supports that workflow. A fee advantage, faster payment or reduced administration must be substantiated before it becomes a headline.

**Ledgix needs a sharper offer decision.** Wallet compatibility is useful, but many existing cards already offer it. A prospective customer must have a reason to commit a deposit. Validate whether the approved eligibility model, repayment clarity or actual card controls provide a meaningful reason to switch. Do not claim credit-building, rewards, easier approval, free service or family/team eligibility without the program evidence.

For research, recruit adults who can accommodate a deposit and full monthly repayment. Final eligibility must determine whether this is a consumer, business or separate-program proposition. Avoid presenting it as emergency funding or a revolving borrowing product. [Visa's secured-credit explanation](https://www.visa.com/en-us/personal/cards/what-is-a-secured-credit-card) is useful education, not Ledgix's agreement.

Detailed [market-demand brief](research/d131-market-demand.md) distinguishes evidence from these hypotheses.

## 2. Pricing benchmarks and commercial direction

Competitor observations checked on 21 September 2026; US products and USD. These are research comparisons, not Etail prices. Reconfirm them before using any public comparative claim.

| Comparator | Observed reference | Meaning for our proposal |
| --- | --- | --- |
| Stripe standard domestic online card payment | 2.9% + $0.30; Payment Links included in standard Payments pricing | Use a legible base rate and expose applicable exceptions. A $100 payment has a $3.20 processing fee and $96.80 remaining before other applicable costs. |
| Stripe Invoicing Starter | Additional 0.4% per paid invoice, separate from payment processing | Show whether invoicing has a separate charge. The same $100 paid by a domestic card would leave $96.40 under these assumptions. |
| Square US Payment Links for new customers | 3.3% + $0.30 | A comparable $100 example leaves $96.40. Verify new/existing-customer and plan context; do not compare it with in-person card-present pricing. |
| Amex Gold | $325 annual fee, with a defined benefit proposition and rate/fee disclosures | Make the value and conditions assessable together. Its rewards and Pay Over Time options are not Ledgix terms. |
| Brex software plans | Essentials $0/user/month; Premium $12/user/month; Enterprise custom | Separate software subscriptions from financial-product fees and distinguish business eligibility. |
| Capital One Platinum Secured | $0 annual fee; $49/$99/$200 minimum security-deposit options for an initial line of at least $200, subject to its terms | A useful comparison for explaining deposit versus limit; its revolving-credit and reporting terms do not transfer to Ledgix. |

Sources: [Stripe pricing](https://stripe.com/pricing), [Stripe Invoicing](https://stripe.com/invoicing/pricing), [Square Payment Links](https://squareup.com/us/en/payment-links), [Amex Gold](https://www.americanexpress.com/us/credit-cards/card/gold-card/), [Brex pricing](https://www.brex.com/pricing), [Capital One Platinum Secured](https://www.capitalone.com/credit-cards/platinum-secured/). Details and service exceptions: [Payments benchmark](research/d131-payments-benchmark.md), [Cards benchmark](research/d131-cards-benchmark.md).

### Proposed commercial targets, for operator/vendor evaluation

**Trolleys:** begin with one understandable pay-as-you-go offer if provider economics support it. Include ordinary link/QR sharing in the base offer; avoid a separate fee for every way a link is shared. Investigate a total domestic-card cost competitive with the Stripe benchmark. Offer negotiated pricing only when there is an actual high-volume quotation process. Do not create three artificial plans or claim “no hidden fees” while material costs remain unknown.

The public pricing block should state the base rate, monthly/minimum charges, any invoice/SMS/service charges, international/FX costs, refunds, disputes and optional accelerated-payout charges where applicable. Distinguish a processing fee retained on a refund from a new refund fee. State the ordinary payout schedule, first-payout exceptions and relevant hold/reserve conditions separately. A customer's successful payment is not the same event as money reaching the business's bank.

A net-payment calculator is useful only after the approved price rules exist. Label the currency/payment scenario; itemize the fee; make exceptions visible; do not predict an exact bank payout date or present the estimate as an actual transaction.

**Ledgix:** evaluate a $0 annual/monthly base fee as a commercial goal, plus a practical deposit entry point and clear deposit-return process. That is a proposed competitive direction, not an approved promise. Do not copy a competitor's deposit-to-limit ratio. Explain the user-selected full-monthly-payment model and optional early/daily repayments alongside the issuer's actual schedule and charges. Full repayment does not automatically mean “0% APR,” no late fees or instant restoration of credit.

Before choosing numbers, model processing/network/vendor costs, loss exposure, support and operations, funding/return costs and acquisition expense. Payment processing margin and card interchange economics are different models. A cheap headline unsupported by sustainable delivery would reduce confidence later.

## 3. Three pages with distinct decisions

### Home — recognize the product and choose

Preserve **“Get paid. Keep going.”** and the company chrome. Supporting copy can remain: “Accept card payments for bookings, invoices and sales. Share a payment link by text, email or QR code.” Keep one **Explore payments** action.

Order: payment proposition and current photograph → three concise business situations → clearly forthcoming Ledgix preview → brief service questions → shared footer. No expanded pricing table, seven-channel gallery, second payment pitch or new login system here. Home should create understanding quickly and hand detailed evaluation to the product page.

### Payments — establish fit, cost and the complete money story

Preserve **“Accept payments. Your way.”** and the two-step artwork. The product-page action remains **Get started with Trolleys**, leading to the approved vendor entrance, not another marketing page. Add a quiet **View fees and payouts** anchor when that section exists.

Proposed order:

1. Hero with concise audience/use statement, collection artwork and approval context.
2. **Before you apply:** a compact description list for who can apply, processing/other costs and ordinary payout timing. Keep essential conditions visible; expand only secondary detail. Do not display empty “TBD” rows publicly.
3. **Share a payment request:** one coherent example at a time. Retain all seven formats, with Text, Email and QR easiest to discover. Preserve Invoice, Bill, Social and Website through a clearly labelled additional-options control if mobile testing supports it. Keep the chosen job, description and amount consistent when changing the sharing format. Use “Bill” for an amount still due and “Receipt” for evidence of payment, never interchangeably.
4. **After your customer pays:** a compact approved sequence covering confirmation, payment availability and bank payout, with refunds/disputes reachable in one supporting disclosure. Explain where to check a pending payment and where to get help. Do not imply instant bank receipt.
5. A short application/support FAQ and the shared footer. Remove redundant use-case paragraphs as this content is consolidated.

On small screens, put a readable offer summary before the long expanded illustration. One clearly labelled **See payment example** disclosure can keep the first decision concise. This is a prototype to test, not a reason to hide fees or eligibility in tabs.

### Cards — understand the commitment and express interest

Preserve **Ledgix Digital Wallet Card**, **“Secured credit. Made for your wallet.”**, Visa secured-credit identity and **Coming soon**. Use the existing static hero art. Keep the requested Apple/Google wallet compatibility; do not reintroduce WeChat.

Proposed order:

1. Product identity, one substantiated benefit once selected, availability and the next action.
2. **Card details:** visible approved deposit/credit-limit relationship, fees, full-payment obligation and eligibility. Keep deposit-return conditions easy to find alongside these facts.
3. **How the account works:** two separate visual tracks for security deposit and purchases/repayment. Deposit backs the account; purchases create debt; repayment comes from the customer's payment source. Wallet setup changes access to the card, not the amount owed or the deposit.
4. **Use your wallet:** one Apple/Google guide, initially compact on mobile, with the existing working steps available when opened.
5. Decisive questions about return of the deposit, payments, lost-device/dispute help and launch availability; shared footer.

Candidate repayment copy after issuer confirmation: “Pay your statement balance in full each month. Make payments earlier whenever you prefer.” Do not silently add daily automatic collection or immediate credit replenishment.

**Get launch updates** should replace the main inquiry action only after a real subscription service exists. Keep **Contact Ledgix** as a quieter route for questions. The launch action must not imply a card application, approval or reserved place in a queue. Until that service is built and verified, retain the current working contact action.

## 4. Product functions and proof required

| Capability | Role in the public experience | Evidence before stronger claims |
| --- | --- | --- |
| Share a card-payment request across the confirmed formats | Primary Trolleys explanation | Vendor-enabled format behavior, delivery ownership and checkout acceptance |
| See payment confirmation/status and bank payouts | Explain the outcome after collection | Actual status definitions, payout schedule, failure/hold paths |
| Refund or respond to a dispute | Establish realistic aftercare | Role permissions, fee consequences, support owner and deadlines |
| Team/terminal access | Supporting business benefit if demonstrated | Exact user's scope, visibility and refund/dispute authority; no implied funds control |
| Add a Ledgix card to Apple/Google wallets | Product-use explanation | User-confirmed support plus final device/region/program instructions |
| Security deposit, credit and separate repayment | Essential financial understanding | Issuer offer, deposit custody/limit rules, payment cycle and return conditions |
| Additional-card controls | Potential differentiator | Configured provider capability and eligible consumer/business/authorized-user model |
| Launch notifications | Low-commitment next step | Working confirmation, preference/opt-out handling and privacy disclosure |

Platform brochures do not prove a contracted program feature. The user has confirmed broad payment capabilities and the two wallets; exact configurations, operating terms and screenshots still need product-owner/vendor verification. Do not revive retired local account features as evidence.

## 5. Artwork and visual refinements

Use three explanatory assets rather than more decoration:

- **Collection:** retain the strong two-step request/checkout composition. Match each amount, description and sharing format. The request and checkout should remain understandable without motion.
- **After payment:** a small receipt/status-to-bank illustration with clearly distinct events. No invented timestamps, automatic success or settlement guarantees. Real approved vendor screenshots are preferable once available.
- **Secured credit:** show the deposit in its own lane, separate from the purchase → statement → repayment lane. The virtual card and wallet show how to pay, without resembling a prepaid balance.

Preserve the supplied logos and official wallet/network marks with consistent scale and clear space. Do not make network logos larger than the offer explanation. Keep one body-copy size, restrained heading steps, readable terms and aligned artwork frames. Refine the mobile flow by removing repetition and collapsing optional instruction, not shrinking text. Retain shared header/footer and page URLs.

[UX evidence and detailed criteria](research/d131-ux-benchmark.md) supports the on-page decision information and restrained disclosure. The aim is to help the customer complete a task; no unsupported promise of a conversion uplift follows from these visual choices.

## 6. Content, backend and policy plan

The marketing improvement does not require restoring the old financial database, login or dashboards. Use one versioned public product-facts source for approved eligibility, fees, timing, availability, contact ownership and document links. Each fact should record its source, program/region, approver and review date. Page copy, examples, Help and structured data should use the same facts to prevent contradictory prices or availability.

Keep draft and approved facts separate. Unknown terms remain internal prerequisites. A genuine quotation model can be explained publicly once confirmed; missing rates alone do not justify inventing “custom pricing.” Provider destinations remain allowlisted and do not forward visitor data or referrers.

A launch-update subscription is an optional, limited marketing capability outside the current non-collecting website. It must be included explicitly in an approved implementation scope before enabling collection. Prefer an approved managed email service, with only email, product preference, consent wording/version, timestamps and subscription status needed. Proposed states: pending confirmation → subscribed → unsubscribed/suppressed. Define expiration/retention, duplicate handling, retry-safe delivery, rate limits, abuse protection, data access and deletion. Do not reuse the archived customer database. Confirmation and unsubscribe links must avoid leaking tokens through analytics/referrers. Never put subscriber emails in general logs or browser storage.

Before activating that flow, update Privacy to reflect actual collection, processor and retention choices; supply the confirmed business mailing address and working sender/support identities. Choose explicit opt-in and confirmation as the product standard. Commercial messages need truthful identification and working opt-out handling; the [FTC's CAN-SPAM guidance](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) is a reference for the communications review, not a certification of the future implementation.

Keep website Terms distinct from the merchant agreement and issuer/cardholder agreement. Display Etail Depot US, Inc. and its Ledgix/Trolleys DBA roles consistently. Approved issuer/processor identity, financial disclosures, deposit treatment and service-specific conditions belong with the relevant offer. Do not imply that i2c is the issuing bank or that a network logo establishes insurance or endorsement. Preserve truthful coming-soon card status until the service is actually ready.

## 7. How we would earn the 9/10 target

Use the existing four-dimension rubric; do not average a missing offer into an attractive visual score. Independent reviewers should record reasons for each rating after implementation. The targets below are proposed acceptance criteria, not completed research.

| Area | Previous assessment | Target | Required evidence |
| --- | --- | --- | --- |
| Visual design | 8.5/10 | At least 9/10 | Coherent type/spacing/artwork on all pages, no clipping or competing hierarchies, accessible states and independently reviewed captures |
| Understanding/navigation | 8/10 | At least 9/10 | At least 9 of 10 relevant participants identify the product/availability after 15 seconds and locate the correct next step within 30 seconds |
| Mobile experience | 8/10 | At least 9/10 | At least 9 of 10 complete key tasks unaided; no lost focus/sideways scrolling; iOS/Android, keyboard and screen-reader checks |
| Decision confidence | 5.5/10 | At least 9/10 | Approved commercial facts; at least 9 of 10 find and correctly explain costs, eligibility and money timing/repayment within 60 seconds; no material misunderstanding left unresolved |

First conduct formative sessions with five merchants and five card prospects; revise, then validate with a fresh ten in each cohort. These samples diagnose problems; they are not population conversion estimates. Ask about the last real need before showing the product, and compare with the deployed baseline. Include accessibility needs. Do not count a positive opinion as task success or an outbound click as an activated customer.

Technical targets: applicable WCAG 2.2 AA checks, readable reflow at 320px/400% zoom, reduced motion and 44px principal touch targets as a project target. Aim for field 75th-percentile LCP ≤2.5 seconds, INP ≤200ms and CLS ≤0.1. Lab checks are preliminary when field data is unavailable, and neither an accessibility automation result nor a Lighthouse score proves the full customer experience. [W3C target guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [Google Web Vitals](https://web.dev/articles/vitals).

Later measure qualified vendor applications, approval, first successful use, time to first payout, repeat collection and support contacts per active merchant; for Cards, verified interest and eventual activation/retention. Define permitted aggregate measurement and vendor attribution before installation. Pricing-detail engagement and notification signups are intermediate signals, not product-market fit. No analytics or tracking is installed by this proposal.

## 8. Delivery sequence and decision gates

| Phase | Deliverable | Completion condition |
| --- | --- | --- |
| 1. Offer and audience | One approved offer sheet per product; selected merchant cohort and card value hypothesis | Fees, eligibility, money rules and support responsibilities documented; facts without evidence remain explicitly unresolved |
| 2. Focused prototype | Home refinement, product-facts rows, payment aftermath and compact mobile wallet/channel treatment | Customers can evaluate a realistic offer; no invented rates or fake working forms |
| 3. Public implementation | Reusable fact/fee/disclosure components; consistent Help/metadata/policy references | Source, desktop/mobile, accessibility, link and build checks pass; existing public-only boundaries preserved |
| 4. Optional notifications and handoff | Confirmed email opt-in/opt-out; agreed vendor application entrance and recovery route | Delivery/consent/failure/unsubscribe tests pass; vendor handoff communicates exactly what happens next |
| 5. Customer validation and release | Recorded task outcomes, independent rubric reassessment and reviewed release | Critical misunderstandings resolved; approved claims and measured evidence support the rating; publish only after release review |

Prototype the structure while offer confirmation is underway. Do not publish competitor prices or incomplete financial rows to fill the gap. If payment facts are ready before the card program, release the clearer Payments journey first and keep Cards honestly forthcoming. Do not delay a sound payment improvement merely to pretend both products have the same readiness.

The recommended first implementation slice is **the Payments decision area and after-payment explanation**, supported by the approved offer sheet. It addresses the largest confidence gap for the available product. Next improve Cards' offer explanation; add launch updates only when that optional scope and its data/delivery requirements are approved. Another whole-site visual replacement is unnecessary.

## Research package

- [Market demand and customer jobs](research/d131-market-demand.md)
- [Payments functions, pricing and operating expectations](research/d131-payments-benchmark.md)
- [Cards, financial-model boundaries and decision information](research/d131-cards-benchmark.md)
- [Page order, useful artwork and customer-task criteria](research/d131-ux-benchmark.md)

No live application, provider account, customer-data system or deployment was changed for D131. Actual program facts, customer outcomes and future vendor-hosted UX remain to be established through the steps above.
