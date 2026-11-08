# D103 — public typography and artwork balance

20 September 2026. The user accepts the public content and design direction but finds that the landing page typography and artwork do not feel balanced. This slice adjusts their relative scale and spacing while preserving the accepted content, navigation and product behavior.

Status: implemented and locally verified. Production build, lint, TypeScript and 42 public browser/accessibility checks pass. Responsive review passes 74 page/channel states. Independent artwork and channel visual reviews find no remaining issues. No deployment is recorded here.

## Shared type hierarchy

`src/ui/consumer-site.css` now defines a small set of shared variables for title size, section headings, body copy, small text, section spacing and hero artwork height. The homepage and both product pages consume the same values rather than maintaining unrelated sizes for each section.

| Role | Desktop treatment | Phone treatment |
| --- | --- | --- |
| Homepage hero title | Responsive size capped at 72px, with a 1.08 line height and less compressed letter spacing | 52px, reducing to 44px below 360px |
| Product hero title | Uses the shared title scale, capped at 64px for the longer product headings | Uses the same 52px / 44px narrow-screen scale |
| Main section headings | Responsive size capped at 44px, with a 1.2 line height | 32px |
| Standard body copy | 16px with a 1.7 line height | 15px |
| Hero introduction | 17px with a 1.7 line height | 16px |
| Eyebrows and availability labels | 12px, with reduced letter spacing and quieter weight | Retain the same readable scale |
| Supporting notes and artwork captions | 13px | Retain the same readable scale |
| Primary marketing actions | 14px text and a minimum 48px target height | Same type and target scale |

The existing system sans serif and restrained italic serif accents remain. Accent text now consistently uses the shared public accent color. Channel introductions, upcoming-card copy, FAQs, product features and the final action area follow the same hierarchy.

Main section spacing is standardized at 80px on larger screens, 64px on intermediate layouts and 48px on phones. Heading margins, body spacing, column gaps and closing-section spacing are adjusted to support that rhythm. Several earlier breakpoint-specific font overrides are removed so mobile sections do not drift into separate scales.

## Artwork proportions

The homepage photograph and product hero artwork use a shared 480px desktop height, reduced from the previous 560px hero treatment. Intermediate layouts use 440px and phones use 400px. The image and text therefore occupy more comparable areas without changing the photograph or its subject.

The photograph's overlay brand is 28px, its supporting captions are 13px, and its main caption is reduced to 32px on desktop and 28px on smaller layouts. Channel pills increase to 12px. Their offsets are adjusted to accommodate wrapping while preserving separation from the caption. Final desktop, tablet and phone review confirms clear caption separation and appropriate crops.

The homepage Ledgix section uses a quieter 400px artwork panel, reducing to 360px on smaller layouts and 340px below 360px. The standalone card product hero continues to use the shared hero height.

## Ledgix card illustration

`src/ui/service-entry.css` reduces the card illustration's visual weight while keeping its existing content and official Visa artwork:

- The front and back cards rotate by approximately five degrees in opposite directions, replacing the earlier nine- and ten-degree rotations.
- Card width is capped at 340px, with a smaller corner radius and a softer shadow.
- Background rings use responsive proportions and lighter strokes; their outer spacing decreases from 42px to 28px.
- Card brand text is consistently 24px, secondary card text remains 12px on phones, and the artwork caption increases to 13px.

The illustration remains a representation of the forthcoming Ledgix product. No card capability, availability or network relationship changes.

## Payment-channel illustrations

`src/ui/payment-channel-preview.css` aligns all seven marketing presentations with the page's calmer type hierarchy. Channel titles use 28px on desktop and 24px on phones, with 15px explanatory copy. Tabs use 14px text and retain their existing keyboard behavior and responsive layout.

Small illustration text is consistently at least 12px, including message status, document labels, invoice metadata, line items, QR instructions, browser labels and checkout descriptions. Important amounts use a shared 28px treatment. Payment-link actions and the depicted checkout action use 14px text. The lower explanatory line uses 13px, and its actual service link uses 14px with a minimum 48px target height.

These changes improve the relative scale of the example and checkout panels without changing their words, example amounts, channel selection or destinations. The presentation remains marketing artwork, with account tools retaining their own styles.

## Header and footer

The public header action increases from 13px to 14px. Footer group headings increase from 12px to 13px; service, support, contact and legal links increase from 13px to 14px. Existing link destinations, compact grouping, responsive layout, focus treatment and minimum 44px chrome targets remain.

## Scope and preserved behavior

The implementation changes only four stylesheets: `consumer-site.css`, `service-entry.css`, `payment-channel-preview.css` and `public-chrome.css`. The shared homepage/product composition remains in place, preserving consistency across `/`, `/payment-services` and `/card-services`.

No wording, product claims, service availability, network asset files, provider handoff, email destination, legal content, authentication, permissions, financial logic or database schema changes belong to this slice. Trolleys remains available through its hosted service; Ledgix Visa secured credit cards remain coming soon. No push, domain configuration or deployment is established by these style changes.

## Verification

Checks pass with the pinned Node24.19.0 and pnpm11.19.0 runtime:

- `pnpm build` — production Next build, exit0 (`artifacts/d103-checks/build.log`).
- `pnpm lint` — exit0 (`lint.log`).
- `pnpm exec tsc --noEmit` — exit0 (`types.log`).
- Existing public/browser tests: `node tools/run-with-database.mjs playwright test tests/browser/public-foundation.spec.ts tests/browser/consumer-preview-foundation.spec.ts tests/browser/public-accessibility.spec.ts --project=desktop --project=mobile --project=accessibility` — 42passed (`browser.log`).
- `node artifacts/d103-checks/review.mjs` — 74responsive states pass with no overflow, text clipping, caption collisions or runtime errors (`visual.log`, `visual/results.json`). This checks the three public routes at320,390,520,768,1024,1440px, plus all seven channel variants on both payment-marketing pages at320,390,768,1440px. The helper blocks mutation requests.

Before/after homepage captures and final section screenshots are retained under `artifacts/d103-checks/`. Manual review covers full-page rhythm, header/footer, hero and card illustrations. Independent reviews inspected all14channel captures and six key artwork captures at390/1440px; no crowding or clipping remains. All original content, links and network artwork are preserved.

The preview is running at http://127.0.0.1:3100/. Startup verified the preserved database without migrating or seeding. No push, deployment, provider action or customer-data change occurred.

## Related records

- [D98 — cohesive discovery and product pages](COHESIVE_PUBLIC_PRODUCTS.md)
- [D99 — shared public detail polish](PUBLIC_DETAIL_POLISH.md)
- [D97 — official network artwork provenance](NETWORK_BRAND_ASSETS.md)
