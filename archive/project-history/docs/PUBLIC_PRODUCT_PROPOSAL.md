# D126 — a clearer decision journey for three public pages

21 September 2026. Proposal requested following the [D125 assessment](PRODUCT_DESIGN_ASSESSMENT.md). This is a reviewable design direction, not an implemented replacement or a deployment. The existing website remains unchanged.

**D127 acceptance:** The user subsequently accepted this proposal and requested implementation. The original proposal below remains the design record; [current status](../planning/STATUS.md) records implementation and verification separately. Acceptance does not publish a release or establish missing provider terms.

## User clarification

The user confirms that trolleys.ai will become vendor-hosted onboarding and the account dashboard, with its current page redesigned later. Do not optimize this proposal around the present Trolleys marketing page or treat that page's website field as a future eligibility requirement. Focus this scope on Etail's Home, Payments and Cards pages. Preserve the public-only architecture and provider-owned accounts.

## Recommendation

Keep the established green/cream visual identity, company header, Payments / Cards / Help navigation, compact footer, approved photographs, two-step payment illustration and wallet artwork. Improve the order and purpose of the content before commissioning another visual identity or adding more sections.

The product names stay **Trolleys Payments** and **Ledgix Digital Wallet Card**. Navigation stays **Payments** and **Cards**, where familiar service labels help visitors find the product before learning its brand. Digital Wallet Card is the product name; virtual Visa secured credit card identifies the financial product. Wallet compatibility supports the proposition but is not, by itself, a defensible reason to choose a new credit card.

## Three pages, three jobs

| Page | Customer question | Recommended progression | Main next step |
| --- | --- | --- | --- |
| Home | What can Etail Depot help me do? | Available payments → recognizable business uses → clearly forthcoming cards → brief service questions | Explore payments, to the Payments page |
| Payments | Will this work for my business? | Collection promise → two-step example → uses and sharing formats → approved account information → onboarding | Get started with Trolleys, to the confirmed vendor application destination |
| Cards | What is this card and how does it work? | Secured-credit identity and wallet benefit → deposit/purchases/repayment → wallet setup → questions | Contact Ledgix while applications remain closed |

The Home and Payments actions have different jobs and destinations. Do not repeat “Explore payments” on the Payments page. One homepage hero action restores a discoverable next step on mobile; remove the later redundant payment-discovery link. Persistent header access and a local product action serve different needs, but extra closing CTA sections are unnecessary when they repeat the same message.

## Proposed leading copy

**Home — keep the accepted headline**

> Get paid. Keep going.
>
> Accept card payments for bookings, invoices and sales. Share a payment link by text, email or QR code.
>
> Explore payments

Preserve the business/customer photograph without adding an overlay; the adjacent payment examples already establish the context. Keep the forthcoming Ledgix introduction visually distinct from available payments. Do not present invented customer testimony or successful transactions as evidence.

**Payments — retain the accepted product promise**

> Accept payments. Your way.
>
> Create a payment request and share it with your customer. They review the amount and pay by card.
>
> Get started with Trolleys

The two-step artwork remains the main explanatory asset. A compact Booking / Invoice / Sale selector changes the example and amount in both sides of the illustration, showing how one workflow applies to different jobs. These figures are illustrative, not fees, customer results or actual payment controls.

The steps are **You create and share** and **Your customer pays**. They describe collection for an enabled account. They do not collapse approval, payment processing or bank payout into two clicks. Keep account setup and payout information separate, concise and grounded in vendor-approved rules.

All seven sharing formats remain available in one supporting section: text, email, invoice, bill, social, QR code and website. Explain each with a relevant example; do not repeat “your business” as the title for every format. These are ways to present or share a request, not seven different financial services. Do not imply automatic message delivery merely from creating a link.

**Cards — lead with the product, then the setup**

> Ledgix Digital Wallet Card · Coming soon
>
> Secured credit. Made for your wallet.
>
> A virtual Visa secured credit card for Apple Wallet and Google Wallet. Pay in stores and online where supported.
>
> Contact Ledgix

Move the deposit explanation directly below the hero. Three concise steps distinguish a security deposit backing the account, purchases creating a credit balance, and separate repayment. Preserve the user's pay-in-full product direction in the internal brief; publish a specific schedule only alongside confirmed program terms.

Keep the approved virtual-card face and unchanged official wallet marks. The hero communicates what the product is; the guide lower down teaches adding the card, completing issuer verification and paying where supported. Keep the Apple and Google image elements distinct, preserving D124's image-identity fix. Avoid implied automatic provisioning or a fabricated provider dashboard.

Retain an honest inquiry action for the coming-soon card. A future launch subscription would require its own consent, confirmation and opt-out flow; the prototype does not relabel an email link as a working waitlist.

## What makes the proposal stronger

1. **A clearer decision at each stage.** The homepage introduces, the product page explains, and the vendor handles application and service. Visitors should not restart the marketing journey after selecting Get started.
2. **Recognizable needs before feature inventories.** Bookings, invoices and sales make the payment capability concrete. Sharing methods then answer how to use it.
3. **Financial understanding before setup instructions.** A deposit-backed credit account is a material decision. It needs more prominence than an attractive phone illustration alone.
4. **Artwork demonstrates a job.** The payment example changes coherently; the wallet illustration uses the supplied product mark and approved wallet assets. No additional generic artwork is required for this revision.
5. **A consistent visual rhythm.** Use the existing palette, balanced two-column heroes, one main type scale, aligned artwork frames, compact controls and section dividers. Avoid both oversized headlines and small explanatory text competing with logo artwork. Preserve responsive stacking and keyboard access.

## Product work that design alone cannot complete

Before a stronger launch claim or final acquisition page, approve one offer sheet for each provider program. Payments needs the intended business/market eligibility, pricing or quotation process, application requirements, settlement/payout rules, support responsibilities and confirmed management capabilities. Cards needs the intended audience, issuer/program terms, deposit and credit-limit relationship, fees, repayment, deposit return and any additional-card controls.

Keep missing offer facts out of customer-facing filler copy. The concept therefore does not invent pricing, approval times, payout speed, rewards, credit reporting, shared limits or testimonials. Once verified, add the most important conditions in a compact product details area before the application decision; the current inquiry/help links do not substitute for that information.

An initial market hypothesis worth testing is service businesses agreeing a job by message or email and collecting a deposit or final invoice. This is a focused research cohort, not established product-market fit or a restriction on all marketing examples. Ledgix's target audience and reason to choose it beyond wallet compatibility need validation before more expansive family/team claims.

## Review and implementation sequence

1. Review this content order, leading copy and interactive concept. Preserve accepted chrome and assets; do not replace application source from the proposal alone.
2. Confirm the offer facts and future application destination with each service operator. The current Trolleys marketing page is outside this design scope.
3. Implement the agreed changes in the existing reusable public components, keeping the public runtime free of local financial/account systems. No database migration follows from a marketing revision.
4. Run the affected desktop/mobile, keyboard/accessibility, metadata, link and build checks. Coordinate continuity tests with the vendor separately.
5. Test whether representative visitors can explain each product, find the correct next step and distinguish the card deposit from repayment. After launch, measure qualified applications, activation and repeat use with consent-appropriate vendor coordination. Click counts and aesthetic scores alone do not prove market fit.

## Benchmark basis and limits

The useful lessons from [Stripe Payment Links](https://stripe.com/payments/payment-links) are a concrete workflow, recognizable checkout and information supporting the buying decision. [American Express card comparison guidance](https://www.americanexpress.com/en-us/credit-cards/credit-intel/compare-amex-cards/) supports connecting needs and benefits with conditions. This proposal borrows those principles, not private architecture or unconfirmed product capabilities.

The conversation preview is a self-contained design exploration with local page, example, channel and wallet selections. Existing public/contact links remain normal links. It does not process applications, collect card details or subscribe users. Approved brand assets are embedded unchanged. No application, backend, database, vendor configuration or deployment was changed for D126.
