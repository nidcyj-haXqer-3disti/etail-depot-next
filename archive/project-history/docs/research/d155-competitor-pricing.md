# D155 — Create and Share pricing benchmarks

Research date: **22 September 2026**. Primary sources only; US merchant offers and USD unless noted. Prices are publicly advertised retail benchmarks, not Trolleys supplier costs, guaranteed eligibility or permission to change the approved website offer. No application, provider configuration or deployment changes accompany this research.

## What competitors monetize

| Product | Basic creation and sharing | Payment price | Separately monetized value |
| --- | --- | --- | --- |
| **Stripe Payment Links** | Included with standard Payments; no setup or monthly fee for the standard account | **2.9% + $0.30** per successful domestic card transaction | Custom domain **$10/month**; Billing **0.7%** of Billing volume, excluding one-off invoices. [US pricing](https://stripe.com/pricing) |
| **Square Payment Links / Free** | No upfront or monthly charge for basic links | **3.3% + $0.30** online; Payment Links page identifies this as the new-customer rate | Plus **$49/location/month**, Premium **$149/location/month**, with online/invoice card rates **2.9% + $0.30**. API online payments remain **2.9% + $0.30** on every plan. [Payment Links](https://squareup.com/us/en/payment-links), [plans and processing](https://squareup.com/us/en/pricing) |
| **PayPal Payment Links** | Product page says no setup/monthly fees; merchant pays when paid | Product page: cards/Apple Pay **2.99% + $0.10**; PayPal/Venmo **3.49% + $0.10**; Pay Later **4.99% + $0.10** | Product-specific schedules differ; see the applicability note below. [Payment Links](https://www.paypal.com/us/business/accept-payments/payment-links) |
| **QuickBooks Payments + Online** | Payments charges transactions; Online subscriptions sell bookkeeping and business workflows | Cards/wallets through invoices, recurring payments or quick requests: **2.99%**, with no fixed cent amount listed. Provider marks rates accurate **18 September 2026** | Online Simple Start **$38/month list**; Essentials **$85/month list**. Temporary 50% discounts are not the continuing price. Simple Start includes invoicing, status/reminders and accounting; Essentials adds broader reporting and business tools. This does not establish that every QuickBooks payment customer needs an Online subscription. [Payment rates](https://quickbooks.intuit.com/payments/payment-rates/), [Online plans](https://quickbooks.intuit.com/pricing/) |
| **Helcim** | No monthly account/software fee; Payment Pages and online invoicing are included tools | At $0–$50,000 monthly card volume: keyed/online **interchange + 0.50% + $0.25**. This is a markup, not an all-in processing rate | Recurring payments **+0.4% per transaction**; volume-based processing discounts. Its pricing page serves US/Canadian merchants; this comparison concerns US card processing, not Canadian Interac or EFT rates. [Pricing](https://www.helcim.com/pricing/) |

Stripe's additional card charges include 0.5% for manual entry, 1.5% for international cards and 1% when currency conversion is required. The headline domestic rate is not universal. Its **post-payment invoice** option costs 0.4% of transaction total, capped at $2/invoice. That differs from **Invoicing Starter** at 0.4% per paid invoice and **Plus** at 0.5%; processing is additional, and the Invoicing pricing page does not state that post-payment cap for these plans. [Stripe US pricing](https://stripe.com/pricing), [Invoicing pricing](https://stripe.com/invoicing/pricing)

Square also meters an actual delivery service: Plus includes 500 marketing texts/account/month, then $0.03/text; Premium includes 2,500, then $0.015/text. This is different from a merchant copying a payment link into their own messaging app. [Square plan comparison](https://squareup.com/us/en/pricing)

## PayPal: do not blend the rate schedules

The US merchant fee schedule, updated **1 September 2026**, distinguishes these products:

| Schedule section | Cards / Apple Pay | PayPal / Venmo | Pay Later |
| --- | --- | --- | --- |
| **Invoicing transactions** | 2.99% + $0.49 | 3.49% + $0.49 | 4.99% + $0.49 |
| **Point of Sale payment links** | 2.99% + $0.49 | 3.49% + $0.49 | 3.49% + $0.49 |

These are domestic USD figures. Standard Checkout, advanced card processing and card-present QR payments have separate schedules. The $0.10 figures on the Payment Links marketing page therefore must not be presented as universal PayPal fees. Public sources do not fully reconcile applicability between the new Payment Links page and POS payment-link rows; verify the exact product and agreement before a price comparison is published. [US merchant fee schedule](https://www.paypal.com/us/business/paypal-business-fees)

## Implications for Trolleys

These are recommendations inferred from the benchmarks, not competitor statements or newly approved commercial terms.

1. **Create and Share can be the main revenue product without a fee for creating each link.** The common model bundles the merchant workflow with paid payment acceptance. Sell the complete outcome: prepare the request, share it, accept payment, provide confirmation and track the result. An included QR code or receipt supports that paid product; inclusion does not mean the business has no revenue model.
2. **Avoid charging for drafts or shares merely to make revenue visible.** Those events are not completed sales and can discourage merchants from distributing links. Tie the base package to successful captured payments, with the exact capture, refund, retry and reversal treatment defined in the commercial agreement.
3. **Use subscriptions only for verified recurring value.** Candidates include automated follow-up, controlled team workflows, accounting reconciliation and integrations. A different button for the same link is not a sufficient upgrade. Basic invoicing and reminders are already included by some competitors, so the feature names alone do not establish differentiation.
4. **Describe actual channel capability.** Copy link, QR and a website link are presentations of the same checkout. Sending a text through Trolleys, tracking delivery, obtaining messaging consent or automating campaigns would be additional operational capabilities and costs; they cannot be inferred from a share button.
5. **Keep the base business independent of Clarity uptake.** Model the optional service's fee, supplier costs and eligible volume separately. Its presence does not prove that the main payment package is profitable.

## Proposed price tests and competitive limits

The research supports evaluating **3.3% + $0.30, $0 setup/monthly** for Trolleys Two Step as a packaged workflow price. It matches Square Free's hosted online rate, but is **0.4 percentage points above Stripe standard**. At a $100 domestic card payment that is $3.60 versus $3.20. It should not be marketed as the cheapest choice; merchants must value its actual experience and support enough to choose it. [Square](https://squareup.com/us/en/pricing), [Stripe](https://stripe.com/pricing)

A later **$49/month + 2.9% + $0.30** Growth candidate would match Square Plus's single-location headline online comparison. Relative to the proposed Trolleys base, the arithmetic break-even is **$12,250/month** of eligible payment volume: $49 ÷ 0.004. This compares fees only, assumes the same transaction count and rate applicability, and does not value software features. Matching prices does not imply equivalent features or economics.

Do not publish either new price until the actual supplier agreement, payment-method mix, average ticket, operational costs and merchant willingness to pay support it. Competitor retail rates are not a buy rate. Required internal checks include authorization/capture fees, interchange and assessments, account/platform minimums, refunds, disputes, support, reserves and loss exposure. The root D155 proposal evaluates those economics; this note supplies the market evidence only.

## Research limitations

- Public prices can change or vary by enrollment cohort, region, payment method, negotiated agreement and product entry point. This is a dated comparison, not a quote.
- No competitor onboarding, payment or subscription was purchased or tested. Features are documented capabilities, not an assessment of actual conversion or merchant outcomes.
- No demand survey was conducted. Willingness to pay for Two Step needs merchant interviews and a controlled offer test; attractive competitor packaging is not proof of demand.
- The existing Trolleys website rate remains unchanged by this research. No per-share fee, new subscription, supplier margin or new automation capability has been approved or implemented.
