# D131 — a credible path toward a 9/10 public experience

21 September 2026. Research and proposed acceptance criteria for Home, Payments and Cards, following [D130](../CUSTOMER_EXPERIENCE_REASSESSMENT.md) and the accepted [D126 proposal](../PUBLIC_PRODUCT_PROPOSAL.md). This document changes no website, provider, account or deployment behavior. The current Trolleys destination's design is excluded as requested; its future onboarding/dashboard remains vendor-owned.

**Recommendation:** preserve the accepted visual system and improve what customers can decide. The current site explains the mechanics better than the offer. Another visual redesign cannot supply missing eligibility, fees, payout or card-program facts. A 9/10 target is a proposed design standard, not a measured result, conversion forecast or evidence of product-market fit.

## Evidence and its limits

Sources below were inspected on 21 September 2026. Product pages are examples of communication, not controlled experiments. Research findings inform hypotheses; none establishes Etail customer behavior.

| Primary source | Observed lesson | Application and limit |
| --- | --- | --- |
| [Stripe Payment Links](https://stripe.com/payments/payment-links) and [pricing](https://stripe.com/pricing) | The product page connects link creation and sharing with confirmation and bank deposit; it includes pricing and deeper detail links. | Explain the whole customer question, including what follows payment. The retrieved product page redirected to India; no regional prices, payout timing, subscription feature or Stripe conversion claim transfers to Trolleys. |
| [American Express card comparison guidance](https://www.americanexpress.com/en-us/credit-cards/credit-intel/compare-amex-cards/), updated 6 January 2026 | Encourages evaluating relevant benefits alongside annual fees, APR and offer conditions. | Make Ledgix's approved financial conditions easy to evaluate alongside wallet convenience. Do not copy Amex rewards, rates or eligibility. The dynamic card directory returned no readable body; this finding uses its official comparison guidance, not an exercised application. |
| [Brex corporate card page](https://www.brex.com/product/credit-card) | Identifies a business audience, demonstrates specific controls, presents an attributed customer example and exposes qualification/credit/fee questions. | One substantiated customer benefit is stronger than a generic feature list. Actual named customers and product evidence must be obtained before Etail uses them. Brex's corporate product, integrations and benefits are not Ledgix capabilities. |
| [Baymard: avoid mobile product subpages](https://baymard.com/research-articles/avoid-using-subpages), 2 November 2020 | Mobile testing found discoverability and orientation problems when important product content lived on separate subpages. Inline collapsed sections can retain context on long pages. | Keep offer facts on the product page; do not send visitors through Help to understand the offer. This is ecommerce product-page research, applied directionally to a financial-service introduction. |
| [Baymard: avoid horizontal product-detail tabs](https://baymard.com/research-articles/avoid-horizontal-tabs) | Participants overlooked core information concealed in horizontal tabs. | Do not hide eligibility, costs or money conditions behind tabs. Existing Booking/Invoice/Sale and wallet selectors demonstrate alternatives; this finding does not justify removing them indiscriminately. |
| [NN/g: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), 3 December 2006 | Put frequent, important information first; reveal secondary detail through clearly labelled controls. Excessive disclosure levels undermine orientation. | Use one disclosure layer for expanded examples or setup instructions. Critical conditions remain visible. This is a design principle, not a measured Etail uplift. |
| [NN/g: photos as web content](https://www.nngroup.com/articles/photos-as-web-content/), 31 October 2010, reviewed 13 August 2026 | Eyetracking distinguishes useful, information-bearing images from decoration that users ignore. | Preserve the useful payment journey and supplied card artwork. Add art only when it explains a task or provides authentic evidence; no generic stock-photo strip or fictional testimonial. |

## Proposed page order

### Home — recognize the services and choose a path

1. Keep the existing company header, payment-led headline, concise explanation, business handoff photograph and **Explore payments** action.
2. Keep three concise situations: booking deposit, completed-work invoice and sale. Each example contributes a different reason to explore; avoid repeating the create/share/pay description beneath every image.
3. Keep the forthcoming Ledgix introduction, quiet product preview, secured-credit identity and **Meet the card** link. Preserve the availability distinction at normal and enlarged text sizes.
4. Keep three service questions and the accepted footer. No additional promotional closing panel or duplicated hero action.

The homepage should remain short. It introduces the choice; it need not reproduce product conditions or every supported channel. Do not add a brand switcher, mega-menu or local sign-in.

### Payments — understand fit, collection and money expectations

1. Keep the hero and coherent two-step Booking/Invoice/Sale artwork. Retain **Get started with Trolleys** with an explicit application handoff. Approval is a prerequisite to collection, not a third illustration state that appears completed.
2. Add a compact **Before you apply** facts area once approved: supported businesses/locations, fee model or confirmed quotation process, application requirements, and payout arrangements. Use a plain description list rather than four oversized cards. If quoting is genuinely required, explain when and how a quote is supplied; do not invent “custom pricing” because rates are missing.
3. Consolidate the repeated business-use section with sharing examples. Keep a short recognisable use-case introduction, then let visitors inspect a relevant format without another full product pitch. All seven formats remain discoverable. On mobile, prototype clearly labelled inline sections for expanded examples; compare against the current accessible selector rather than assuming an accordion will win.
4. Add a concise **After a customer pays** explanation only when vendor-approved: how the merchant verifies the result, how bank payout works, and where support is available. Distinguish accepted payment, available funds and bank receipt. Show no invented settlement time, reserve rule or “instant” result.
5. Finish with the few unresolved application/support questions. Keep the fixed provider entrance and contact route; do not create a second navigation system or a marketing detour at handoff.

Steps 2 and 4 are content prerequisites. Until their facts are approved, keep the current honest page rather than publishing empty claims, fake prices or filler assurances. Proposed headings and layouts can be reviewed privately without making them public.

### Cards — understand the commitment before learning setup

1. Preserve the supplied Ledgix identity, quiet phone/card art, **Coming soon**, Visa secured credit description and **Contact Ledgix** inquiry action.
2. Keep the deposit → purchases → separate repayment explanation immediately after the hero. Clarify meaning with concise copy; avoid illustrative dollar amounts that imply a deposit-to-limit ratio.
3. Add **Card details** after program approval: intended customer/market, eligibility, deposit and credit-limit relationship, charges, repayment requirements and deposit-return conditions. Use a consistent row layout. Until confirmed, the card cannot earn a high decision-confidence score merely through design.
4. Keep one wallet guide lower on the page. Consider a compact initial explanation with an explicitly labelled **See wallet setup** disclosure on narrow screens, retaining Apple/Google choice and step controls when expanded. Availability remains conditional on card, device and region.
5. Keep concise questions and the inquiry route. Do not turn the email link into “Join the waitlist” or “Get notified”; those would require a separately implemented consent and communication flow.

## Artwork and visual direction

| Area | Preserve | Refine or add only for a clear purpose |
| --- | --- | --- |
| Shared system | Company header/footer, green/cream palette, restrained serif accents, existing logo assets | Align section starts, text measures and artwork baselines. Use one body-copy scale and limited heading levels; disclosure text must remain readable, not decorative fine print. |
| Home | Existing business/customer photograph without overlays | Maintain a crop that shows the exchange and leaves the headline dominant. If later commissioning photography, depict a real permitted business interaction in natural light; do not imply the subject is a customer without consent and evidence. |
| Payments | The two-step request/checkout artwork and matching amounts | Use one visual grammar across channel examples: consistent frame, scale, type and checkout destination. Differentiate the situation, not the invented merchant name. A future provider-approved status/payout illustration should be separate from collection, not suggest one uninterrupted instant flow. |
| Cards | Supplied virtual-card face, official marks and single wallet guide | Make the static hero feel like a finished product, while preserving coming-soon context. If the secured-credit explanation needs art, use a small conceptual diagram that visibly separates collateral from purchases/repayment; no fake balance dashboard or implied automatic deposit spending. |

Retain reduced-motion support and avoid autoplay carousels, scroll-controlled storytelling, floating badges, imitation live notifications and decorative charts. Use real product screenshots only after the vendor supplies current approved assets, with private data removed. Network logos communicate compatibility, not endorsement, deposit insurance or customer success.

## Proposed acceptance criteria

These are prospective targets, not passed tests. First run a formative round with five relevant merchant prospects and five card prospects, then revise and validate with a fresh ten per cohort. Small samples diagnose issues; they do not establish population success rates or statistically proven conversion gains. Include first-time mobile users and participants using accessibility accommodations; use no real financial data.

| Task or quality | Target for the next validation |
| --- | --- |
| Home comprehension | After 15 seconds, at least 9 of 10 participants in each cohort identify available payments versus forthcoming cards without prompting. |
| Navigation | At least 9 of 10 reach their intended product and explain the next action within 30 seconds; no participant mistakes a public illustration for a submitted application or transaction. |
| Payment fit and cost, after approved facts exist | At least 9 of 10 merchant prospects find business eligibility, cost/quote process and payout conditions within 60 seconds and describe them accurately. Unknown facts count as unresolved, not successful discovery. |
| Collection example | At least 9 of 10 merchants select a suitable sharing format and explain what the customer sees, without assuming automatic message delivery or immediate bank receipt. |
| Secured-credit understanding | At least 9 of 10 card prospects distinguish the deposit from repayment and correctly state that applications are not open. Any observed deposit-as-spendable-cash misconception requires revision. |
| Mobile interaction | Complete both journeys on representative iOS/Android browsers; no horizontal overflow at 320–1440px, lost focus, obscured action or forced sideways scrolling. Keep important controls at least 44×44 CSS pixels as a project target. |
| Accessibility | Keyboard-only operation and screen-reader names/states for all selectors/disclosures; no content loss at enlarged text, 400% desktop zoom/reflow or increased text spacing; applicable WCAG 2.2 AA contrast and focus checks pass. Automated passes are supplemented by manual use. |
| Perceived clarity | After each task, median ease rating at least 6/7, recorded alongside actual errors and time. A high rating cannot override a financial misunderstanding. |

For the **9/10 heuristic score**, use the same written rubric before and after: visual hierarchy/consistency, comprehension/navigation, mobile/accessibility, and decision confidence. Require at least 9 in each dimension from independent reviewers, with evidence notes and no material unresolved customer task. Do not average away missing commercial facts or failed accessibility. Report the score separately from observed task counts and eventual vendor activation/retention.

## Execution sequence

1. Approve provider offer sheets and choose one initial merchant research cohort. Service businesses collecting agreed deposits and final invoices remain a hypothesis, not established demand. Validate Ledgix's intended customer and reason to choose it beyond wallet compatibility.
2. Prototype only the facts area, mobile detail treatment and approved post-payment explanation; preserve accepted chrome and artwork. Compare against the deployed baseline using the tasks above.
3. Implement the winning public presentation with existing reusable components. No account/database/financial runtime, new collection form or invented provider path is needed.
4. Complete technical, accessibility, content and task checks. Record what improved, what remained uncertain and which provider facts were approved.
5. Treat qualified application, activation and repeat-use measurement as later vendor-coordinated work with an agreed privacy basis. Do not install tracking or call an outbound click a successful customer account.

Only this research document was written for this subtask. No application tests, customer study, source implementation, provider audit or publication was performed.
