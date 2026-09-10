# Merchant marketing fit: delegated collection

**Researched 2026-09-10.** U.S. Amex and Square pages; Stripe’s U.S. marketing and provider documentation. This is a positioning hypothesis and implementation audit, **not validated demand**. No customer interviews, conversion experiment or competitor account trial was conducted.

## Recommendation

Lead with **“Let trusted people collect for your business.”** Explain the intended benefit: **“Give family, teammates or helpers permission to collect for your merchant. Each person sees the merchants and records they’re allowed to access. You keep the overview.”**

For today’s release, qualify that promise beside the primary action: **“Try the sandbox”** and **“Practice with sample payments. No real money moves.”** Avoid presenting the sandbox as an available live acceptance service. A secondary **“See how it works”** action should demonstrate delegation, a payment request and the resulting records.

## What the references establish

| Reference | Observed marketing or documented workflow | Etail implication |
|---|---|---|
| [Amex: Accept the Card](https://www.americanexpress.com/us/merchant/accept-the-card.html) | Leads with acceptance benefits, then offers direct acceptance and a payment-provider route. Benefits, business examples, repeated enrollment actions and FAQs support conversion. Some cited statistics/campaigns are dated. | Explain the customer outcome before administrative setup. Offer a clear next action; do not borrow Amex’s reach, spending, pricing or trust claims. |
| [Amex: Manage your account online](https://www.americanexpress.com/us/merchant/support-center/registration/manage-account-online.html) | Promotes one place for payment history, reports, disputes and account support. Registration is for existing merchants and requires merchant credentials. | Separate acquiring customers from servicing existing merchants. Show a recognizable payment record as proof of the working sandbox; omit unimplemented disputes and provider settlement. |
| [Square Payment Links](https://squareup.com/us/en/payment-links) | Combines a simple link proposition, creation steps, sharing examples, reporting and start/sales actions. It markets reuse and concrete business uses rather than presenting formats as separate payment systems. | Demonstrate one request appearing in several formats. Channels alone are not a distinctive proposition. |
| [Square: create and share links](https://squareup.com/help/us/en/article/6692-get-started-with-square-checkout-links) and [team permissions](https://squareup.com/help/us/en/article/7480-square-online-checkout-links-troubleshooting) | Owners or permitted team members create/manage links; sharing includes text, email, social, QR and buttons. Payment-link permission and location settings are separate controls. These pages do not establish creator-only financial visibility. | Delegation already exists elsewhere. Etail must demonstrate its particular primary/submerchant boundaries rather than claim to have invented team collection. |
| [Square: create and send invoices](https://squareup.com/help/us/en/article/8387-create-and-send-invoices) | Invoice permissions, customer information, payment terms, delivery choices and subsequent management form a broader workflow. Sharing a link does not itself email an invoice. | Keep invoice/bill request previews distinct from a complete invoicing product and actual message delivery. |
| [Stripe Payment Links](https://stripe.com/payments/payment-links) and [sharing guide](https://docs.stripe.com/payment-links/share) | Marketing shows create → share → payment, including a sample conversation and checkout. Documentation confirms a QR code and multiple distribution channels can represent the same link. | Use one concrete merchant, helper and amount throughout the story. A reusable channel is not automatic recurring billing. |

**Evidence quality:** the above public page text, headings, image descriptions and documented steps were read. Image retrieval failed; no live page screenshot or signed-in flow was visually verified in this task. An additional public [Amex Click to Pay brochure](https://network.americanexpress.com/globalnetwork/dam/jcr:7b5a8365-75ad-47b4-ad5f-e0931de0327f/Click_To_Pay_Merchant_Overview_April_2021.pdf), April 2021, was text-readable; its screenshot failed. It is historical checkout marketing, not evidence of Etail’s features or current Amex design. Other cited pages had no clear publication date. Amex merchant locations and Square employee access are benchmarks, not proof of Etail’s delegated-submerchant or legal model.

## Proposed audience and conversion sequence

Start with a business owner assisted by trusted people: family helping at a market stall, staff collecting for an event, or an on-site teammate requesting payment after a service. These are hypotheses to test, not verified customer segments. Avoid positioning this as friends receiving unrestricted personal transfers.

1. **Hero:** benefit, a compact sandbox label and one primary action.
2. **Concrete demonstration:** “Alex’s business → Jamie’s pop-up → $25 request.” Show who collects, whose merchant receives the payment and who can review it.
3. **Three steps:** choose a person and their access; prepare a payment request; review the resulting payments together within that access.
4. **Channel examples:** text/social for a conversation; email for a remote request; invoice/bill for a documented amount; QR for a counter; web link for an online page. Label every current example “Preview.”
5. **Control explanation:** primary merchant oversees its business; helpers work within assigned merchants. Then show actual sandbox payments, refunds and transfers.
6. **FAQ:** who sees records, who can refund, what happens when access ends, and what the sandbox does. Repeat the sandbox action.

The proposed fit is a focused combination of delegation, collection and oversight. Validate whether prospective owners understand responsibility and whether helpers can complete the assigned task before making demand or efficiency claims.

## Claim boundaries from current code

| Safe, with sandbox context | Qualification required |
|---|---|
| Invite people and choose their permitted actions. | Acceptance, current permission and expiry apply; today’s identities are sample users. No automatic Cardholder access. |
| Keep an overview while helpers use assigned merchants. | Payment visibility is by assigned submerchant, not necessarily by individual. People sharing one submerchant may see its payments. The primary can oversee creator-private channels. |
| Preview seven formats using one saved amount. | SMS/email/social are not sent. QR opens an authenticated preview. Invoice/bill previews are not issued tax documents; receipts follow approved sandbox payments. |
| Try payments, full refunds and transfers. | Practice funds only; refunds/transfers require primary authority. No partial-refund claim, live bank payout, settlement speed or fee quote. |

Evidence: [channel contracts](../../../src/modules/acquiring/contracts.ts), [exact merchant access](../../../src/modules/access/merchant-scope.ts), [channel visibility](../../../src/modules/acquiring/service.ts), [operations](../../../src/modules/acquiring/operations-service.ts), and [presentation previews](../../../src/ui/workspace/merchant-operations.tsx).

The user’s model makes the primary merchant responsible for its business’s sales, fees, refunds and chargebacks; permission to collect does not transfer that responsibility. This is a product rule, not established live underwriting or merchant-of-record status. [Stripe’s merchant-of-record guidance](https://docs.stripe.com/connect/merchant-of-record) illustrates why provider configuration and clear buyer-facing identification matter. Do not claim Amex integration, provider approval, live verification, universal compliance, certified security, zero fees or guaranteed faster payment.
