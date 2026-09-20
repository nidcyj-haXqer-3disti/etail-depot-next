# D98 — one visual system for discovery and product pages

20 September 2026. The user identified a visible mismatch between the homepage, `/payment-services` and `/card-services`. This slice brings those three pages into the same public design system while preserving the D94 hosted-service journey and D97 official network artwork.

Status: implemented and locally verified on `codex/cohesive-public-products`, based on D97 commit `9a17fb3`. This document does not record a deployment or provider-service acceptance.

## Problem

The homepage had moved to a wide editorial layout with restrained typography, an ivory hero, a forest-green palette and photographic product artwork. The product pages still used the earlier `welcome-hero`, compact feature sections and boxed closing panel. Following a product link therefore changed the apparent website style even though the customer remained on the same Etail Depot website.

The mismatch came from separate page framing and stylesheet ownership. Repeating selected colors on the product pages would leave their spacing, type, image proportions and call-to-action structure liable to drift again.

## Final design

All three routes now use the `consumer-page` wrapper and `src/ui/consumer-site.css`. The former homepage-only stylesheet becomes the shared public discovery/product stylesheet. Header and footer retain their existing shared implementation; the channel showcase and network marks continue to own their respective component styles.

| Element | Shared treatment |
| --- | --- |
| Page frame | A maximum 1,248px container, aligned gutters and responsive spacing. |
| Typography | System sans serif for the main interface, with the same restrained italic serif accent in hero headings. Product hero size adjusts for its longer preserved heading. |
| Color | Forest-green text and actions, muted green supporting text, warm ivory heroes and pale green section backgrounds. |
| Hero | One `ConsumerHero` component for product identity, availability, heading, description, actions, supporting note and visual. |
| Product artwork | The same Trolleys photograph, crop rules, caption and channel accents; the same Ledgix card illustration and official Visa marks. |
| Sections | Consistent section headings, fine rules, feature spacing and icon scale; pale section bands distinguish content without introducing another visual theme. |
| Closing | One `ConsumerClosing` component: a divided two-column layout with the next action, which stacks on smaller screens. |
| Interaction | The existing clear focus styles, substantial link/button targets and keyboard-operated channel tabs remain. |

`ConsumerHero` allows a product-specific size modifier and optional note/footer content. It does not create separate old/new modes or account behavior. Each page contains one hero and one main heading; the shared heading identifier remains unique within that page.

## Page journeys

### Homepage

The accepted payment-led headline and content remain. The hero uses the shared component, followed by the existing network acceptance strip, seven-channel showcase, upcoming Ledgix section, common questions and shared closing. The homepage still helps customers discover the two products before choosing their next step.

### Trolleys payments

The existing payment heading now sits in the same hero frame as the homepage, using the same photo and network strip. The page then explains the confirmed payment benefits, places the existing interactive channel showcase in a pale full-width band and presents the three-step handoff in the shared feature grid.

The primary action continues to `https://trolleys.ai`. A secondary hero action moves to the payment-channel section on the same page. Payment help remains linked from the getting-started section. The closing adds a counterpart link to Ledgix cards.

### Ledgix cards

The preserved card heading, card illustration and coming-soon status use the same hero system. The product explanation follows the same section typography and feature layout as payments. The final contact section uses the common closing component and offers a counterpart link to Trolleys payments.

Card applications remain closed. The card action remains `mailto:ledgix@etaildepot.com`; no application, funding or card sign-in flow is introduced.

## Implementation and scope

- `src/ui/consumer-layout.tsx` owns `ConsumerHero` and `ConsumerClosing`.
- `src/ui/consumer-site.css` owns the public discovery/product layout, replacing the homepage-only stylesheet.
- `src/app/page.tsx`, `src/app/payment-services/page.tsx` and `src/app/card-services/page.tsx` compose their content through the shared framing.
- `src/ui/service-entry.tsx` continues to own product availability, the approved provider/contact links and reusable product artwork.
- The channel showcase, official network assets, public navigation and footer retain their existing ownership.

This is a presentation and navigation-consistency change. Existing product headings, confirmed claims, service availability, provider destinations, contact information, canonical metadata and search-release controls are preserved. The Trolleys handoff retains its exact approved URL and no-referrer attributes. Existing local email callback handling is retained.

No authentication, financial command, database schema, provider integration, account permission or money-state change belongs to this slice. No DNS or production-domain configuration is performed, and no live card availability is implied.

## Verification

All commands used the pinned Node24.19.0 runtime and pnpm11.19.0. The browser suites ran through the project’s isolated test-database runner; the preview startup verified the preserved preview database without migration or seeding.

- `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test:architecture` and `git diff --check`: pass.
- `pnpm exec vitest run tests/unit/public-seo.test.ts`:18 cases pass.
- Existing public foundation, consumer preview and public accessibility suites:42 desktop/mobile/accessibility cases pass. The existing discovery test now follows both closing cross-product links, checking routes, active navigation and availability; outdated selectors were updated without weakening outbound-referrer, callback or no-private-read protections.
- Responsive review:18 page/width combinations across all three routes at320,390,680,768,1024 and1440px; no horizontal overflow, missing visible images, duplicate main headings, accessibility violations, runtime errors or mutation requests. Thirty screenshots include every hero, product feature sections, closing sections and payment-channel views.
- Manual visual inspection confirms aligned page framing, coherent typography, matching photograph/card presentation, readable narrow-phone headings and consistent closing actions. An independent source review confirms removed rules target retired product markup and the remaining card/status/network styles are retained. Independent visual review found one missing mobile space around a hidden line break in both network captions; the final correction preserves readable words.

Logs: `artifacts/d98-checks/{build,build-final,lint,lint-final,typecheck,architecture,metadata,browser,visual,visual-final}.log`. The final build and 18-state visual review pass after the mobile-caption space correction. Responsive results and screenshots: `artifacts/d98-checks/visual/`; capture helper: `artifacts/d98-checks/review-pages.mjs`.

The local preview remains at http://127.0.0.1:3100/. No push or deployment occurred; D86 remains the hosted baseline. The visual and navigation checks do not validate behavior inside the independent third-party service websites.
