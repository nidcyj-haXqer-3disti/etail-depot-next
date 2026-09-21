# D130 — customer-experience reassessment

21 September 2026. Advisory review of the current local D127/D128 public website, source commit `e93a255321438e2770ff4fd1b9f6602d9952d1b8`. Trolleys’ future vendor-hosted onboarding/dashboard is excluded, as requested. These are qualitative judgments from a simulated first-time customer perspective, not observed customer research, conversion measurements or a claim of employment at Stripe/American Express.

## Rating

Overall public customer experience: **7.5/10**. Visual consistency: **8.5/10**; understanding/navigation: **8/10**; mobile usability: **8/10**; confidence before applying: **5.5/10**. The previous D125 review also included the then-current external handoff, so the totals should not be treated as a controlled before/after measurement. Product-market fit remains unproven.

## Actual walkthrough

At 1440px and 390px, followed Home → Explore payments → Invoice example → QR sharing example, then Home → Meet the card → Google Wallet → Use wallet. The customer can identify a relevant collection task, see a matching request/checkout amount, distinguish the Payments application entrance from product exploration, and understand that cards are forthcoming. The card page now explains deposit, purchase balance and separate repayment before setup. No provider link, application, email or financial action was submitted.

The homepage feels composed and makes its next step clear. The payment examples explain the mechanics, but a customer still lacks eligibility, fee and payout facts before applying. Cards explains what it is and how to use a wallet, but not a sufficiently specific reason for its intended customer to choose it and commit a deposit. Contact Ledgix is a valid inquiry route, but requires an interested visitor to compose an email without an explicit launch-interest outcome. Brand marks establish the stated compatibility/acceptance story; they do not provide evidence of customer results.

## Priorities

1. Add compact provider-approved product facts: Payments eligibility/location, fee model, application requirements and payout arrangements; Cards eligibility, deposit/limit relationship, fees, repayment and deposit return. Unknown terms must remain internal prerequisites, not invented promises.
2. Establish one clear audience and substantiated reason to choose each service. Booking deposits and final invoices are a plausible initial payment segment to test. Digital-wallet compatibility explains card use but does not itself prove a differentiated offer. Keep the accepted brand names while validating their customer benefit.
3. Preserve the two-step payment artwork and separately explain what happens after payment: confirmation/status, the approved bank-payout arrangement and support. Use confirmed provider behavior rather than an instant-settlement promise.
4. For upcoming cards, consider an actual opt-in launch-update flow, with confirmation, unsubscribe and matching privacy handling. Do not simply rename the mailto button. Retain a distinct inquiry route.
5. Make small mobile refinements to long channel examples after customer testing. Retain all supported sharing options, but explore progressive disclosure and clearer invoice/bill distinctions. Add real approved product screenshots or permissioned customer evidence when available.

Keep the current shared header/footer, palette, restrained typography and useful interactive examples. Validate the next iteration with representative merchants and card prospects: ask them what it is, whether it suits them, what it costs, what happens to their money and where they would go next. Test comprehension separately from actual activation and continued use; the latter requires the hosted product.

## Benchmark and evidence

[Stripe Payment Links](https://stripe.com/payments/payment-links) makes pricing and the progression to bank deposit visible alongside collection examples. The fetched page redirected to its India locale; no regional prices are imported into this assessment. [American Express’s US card comparison](https://www.americanexpress.com/us/credit-cards/) exposes benefits, annual fees and comparison choices. These are references for helping a visitor decide, not terms or capabilities to copy into Etail’s offers.

Local read-only walkthrough evidence: `artifacts/d130-review/walkthrough.mjs`, `walkthrough.json` and desktop/mobile screenshots. The initial screenshot timing was corrected to wait for the new route and heading before capture; both completed walkthroughs and final screenshots are current. No application source, provider settings, database, deployment or release approval changed. D129 remains pending exact PR #30 merge approval. Documentation-only changes need no repeat of the application suite.
