# D132 — product-confidence implementation

21 September 2026 · local feature branch `codex/product-confidence`

The user accepted [D131](ADVANCED_PUBLIC_PRODUCT_PLAN.md), then selected benchmark-based payment pricing and explicitly approved Ledgix’s $200 minimum security deposit, $0 annual/monthly fees and full monthly repayment with optional early/daily payments. This implementation improves the existing public website; it does not implement the vendor’s onboarding, financial system or card program.

## Implemented experience

| Page | Result | Customer purpose |
| --- | --- | --- |
| Home | Accepted discovery layout and shared chrome preserved; upcoming card preview includes the selected deposit and annual fee | Recognize the offer and choose the relevant product |
| Payments | Visible US domestic-card pricing, itemized local fee estimator, extra-fee disclosure and separate payout explanation | Assess costs and distinguish customer payment from bank arrival |
| Payment channels | One Booking/Invoice/Sale example remains consistent through all seven sharing formats; optional expanded artwork on phones | Choose a relevant job and understand how the same request is shared |
| Cards | Deposit, recurring fees and repayment facts immediately after the hero; collateral and debt shown in separate visual tracks | Understand the financial commitment before learning wallet setup |
| Wallet guide | One accessible Apple/Google guide, initially collapsed on phones; existing stable logo identities preserved | Open instructions when needed without a long mandatory mobile scroll |
| Help, Privacy, Terms | Matching facts, payout/refund/dispute guidance and truthful browser-only calculator disclosures | Reach the right support and understand website/service boundaries |

The shared `src/shared/product-facts.ts` registry records the version, operator approval, references and unresolved evidence. The calculator uses exact cents and separately rounded fees, rejects invalid/out-of-range input and makes no request or stored record. Changing its amount does not create a transaction. Retired account routes, financial endpoints, databases and archived customer records remain outside the runtime. Removed the unused product-use-case component/styles after consolidating that section.

## Commercial interpretation and release review

The user’s “same as benchmarks” answer was resolved to Stripe US standard online-card pricing: 2.9% + $0.30, ordinary link/QR sharing included, no standard setup/monthly fee, and Invoicing Starter’s additional 0.4% per paid invoice. Published exception details use the same selected reference: international +1.5%, conversion +1% when required, manual entry +0.5%, $15 dispute received and $15 manual response (response fee returned for a win). References were checked on September 21: [Stripe pricing](https://stripe.com/pricing), [Invoicing](https://stripe.com/invoicing/pricing).

These are **operator-selected terms for the local candidate**, not proof that Infinicept has configured or contractually accepted them. Do not activate processing or describe the provider contract as verified. Validate that the actual merchant agreement, invoice product, refunds, disputes, optional services and total economics support this offer before publishing the changed pricing. A country/industry eligibility list, ordinary/first payout schedule and reserve rules remain unverified; the website gives no invented bank-arrival date.

Ledgix’s selected deposit/recurring fees/repayment are approved by the operator. Its issuer, eligibility, deposit custody and return, credit-limit relationship, other charges and final cardholder disclosures remain external prerequisites before opening applications. The page retains Coming soon. It does not promise credit reporting, rewards, a 1:1 deposit/limit ratio, 0% APR or instant credit restoration.

## Launch notifications: not enabled

`ledgix@etaildepot.com` remains the confirmed contact. No active subscription store, email adapter, audience, verified sender or confirmation/unsubscribe service was found in active source. Safe cloud environment metadata shows Netlify email helper scaffolding (`NETLIFY_EMAILS_SECRET`, `NETLIFY_EMAILS_DIRECTORY`), but not the required provider-name/provider-key configuration. No values were displayed. A helper function or contact mailbox is not a working launch subscription.

The user’s “use the same” reply did not provide a business postal address or identify an email provider. The user then explicitly deferred setup: “use the same, will setup later.” No inactive signup form, fake success state, mailto-labelled subscription, message send, DNS change or subscription data collection was added.

Before enabling this accepted optional part:

1. Confirm the postal address and approved existing email service or hosted opt-in URL. Configure project-specific credentials through the approved secret store and verify the sender; do not use archived credentials.
2. Establish pending/confirmed/unsubscribed states, versioned explicit consent, duplicate/retry handling, short-lived confirmation, rate limits, retention and deletion, with no addresses or tokens in logs/analytics.
3. Verify actual confirmation and unsubscribe delivery; align Privacy with the real processor, data and retention. No commercial updates without confirmed consent.

This optional capability is explicitly deferred by the user. It is not a completed email feature.

## Validation and rating

See `artifacts/d132-checks/` for actual command, source-boundary, visual and packaging evidence and [STATUS](../planning/STATUS.md) for the completed counts. The independent source review found two minor issues (payout link target and screen-reader error association), both fixed. Visual inspection found rotated disclosure indicators extending past their rows; spacing was corrected.

The 9/10 target is not a measured outcome. [The customer-session script](CUSTOMER_VALIDATION_SCRIPT.md) is ready for merchants and card prospects. Actual sessions, vendor terms and notification delivery cannot be replaced by a self-assigned design score or automated browser results.

No push, merge, production deploy, DNS change, vendor action or financial/database migration is part of this local implementation. PR #30 remains the live release.
