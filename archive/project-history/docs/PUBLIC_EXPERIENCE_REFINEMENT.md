# D95 — polished public discovery

20 September 2026. The user requests a more refined landing page, header and footer, removal of the Sandbox label, and distinct examples across payment channels. This overrides the previous presentation requirement to retain that badge; it does not enable real money or authorize publication.

## Experience contract

Lead with available Trolleys payments and a clear product exploration action. Show the accepted card networks, then seven recognizable ways to share a payment request. Each illustration has its own context, item and amount. Use descriptive activities rather than fictional named businesses or repeated “Your business” placeholders. Keep illustrations separate from actual provider interfaces and authenticated merchant data.

Give upcoming Ledgix Visa secured credit cards a dedicated, quieter section with availability and inquiry actions. Remove the repeated product/access sections; the FAQ and product pages explain independent sign-in and dashboards. Public payment entries remain the reviewed Trolleys root, with no user data or referrer passed.

Use a compact navigation header, warm-white editorial landing, consistent content alignment and a distinct forest-green footer. Group service, help, contact and legal links. Preserve keyboard access, 44-pixel navigation targets, legible contrast, narrow-screen layouts and the retained local email-recovery flow. Remove shared Sandbox badges and unused badge styles while retaining all financial, authorization and noindex controls.

## Reference observations

Reviewed public primary marketing references on 20 September 2026. [Stripe](https://stripe.com/) distinguishes product discovery from account access; [Stripe Payment Links](https://stripe.com/payments/payment-links) uses a recognizable share-to-checkout sequence. [Square](https://squareup.com/us/en) grounds its product in distinct business situations, while [Square Payments](https://squareup.com/us/en/payments) puts payment methods before operational details. [American Express](https://www.americanexpress.com/us/credit-cards/) separates exploration from application. These observations guide hierarchy and clarity; they are not evidence of private architecture, product parity or provider activation.

## Scope and acceptance

Presentation only: homepage composition, public chrome, channel marketing and corresponding checks. No new provider connection, schema, command, financial rule, domain configuration or customer-data mutation. Source review, production build, types, lint, architecture, public journeys, account-menu regression, desktop/mobile accessibility and visual review will establish local acceptance. Existing external handoff tests intercept provider navigation locally; no provider session is implied. Deployment is separate.

## Verification

Completed locally on `codex/polished-public-experience`. Evidence is saved under `artifacts/d95-checks/`.

- Production Next build, full lint, typecheck and architecture guards pass (`build-clean.log`, `lint-final.log`, `typecheck.log`, `architecture-final.log`).
- All 18 public metadata unit cases pass (`metadata-corrected.log`), including the social image render. An initial invocation used a nonexistent test filename; it ran no cases and is retained separately in `metadata.log`.
- All 48 final existing desktop/mobile/public accessibility and account-menu cases pass (`public-final.log`). Coverage includes all seven tabs by keyboard, matching channel/checkout descriptions and amounts, 320px overflow, independent service availability, approved outbound URLs without customer parameters/referrers, retained email callbacks and private account-menu positioning.
- The initial browser run passed 46 cases; two assertions still expected the old generic footer labels. Updated the exact expectations to **Trolleys payments** and **Ledgix cards**, with unchanged destination checks. The corrected targeted run and complete final run pass.
- The final responsive review passes **57 states** with zero accessibility violations, horizontal overflow, unexpected network requests or page errors (`responsive-final.log`, `visual-final/results.json`). It checks homepage/card/payment pages at 320, 390, 768, 1024 and 1440px, plus all seven channels on both homepage and payment product page at 320, 768 and 1440px.
- Manual review of the desktop/phone hero, white footer logo on forest background, phone footer, tablet Ledgix section and channel illustrations is complete. The broader review found a low-contrast social caption; it was darkened and all 57 final states pass. Initial failed evidence is retained under `visual/` and `responsive-review.log`.
- Removed obsolete home/preview and shared badge styles. Independent review found no navigation, availability, provider-separation or authenticated-workflow regression. All retained shared channel CSS rules were compared before/after cleanup and are unchanged; only unreferenced selectors were removed.
- Existing historical capture helpers were adjusted to assert badge absence. Their unrelated historical screen selectors were not executed or certified by this change; current evidence comes from the browser suites and scoped D95 review.
- The local preview is running with read-only preparation and preserved data (`preview-final.log`). No customer data, financial commands, permissions, database schema, provider setup, canonical/noindex settings or external resources changed. No push or deployment occurred; D86 remains hosted.


## D96 — compact footer follow-up

20 September 2026. Removed the repeated footer tagline, reduced padding and inter-column spacing, and changed narrow layouts into three labeled link rows. The logo, every service/support/contact/legal destination, operator wording, colors and visible focus treatment remain. Also tightened the adjacent homepage-to-footer gap. The header and application behavior are unchanged.

Production build, focused footer lint and all 22 affected public browser/accessibility cases pass (`artifacts/d96-checks/`). A six-width footer review (320, 390, 520, 768, 1024, 1440px) confirms no overflow or accessibility violations and every link at least 44×44px. Footer height is now 229px at desktop width, down from about 355px, and 387px at 320px width, down from about 610px. Desktop and phone screenshots were manually reviewed. The first ad hoc capture attempt needed an explicit browser context for Axe; corrected without application changes and retained its log. Local preview is refreshed with preserved data. No push or deployment.
