# D99 — public page detail polish

20 September 2026. The user requests a consistent header and footer across public pages, followed by a detailed review of typography, spacing, colors, artwork, buttons, copy and examples. This slice extends D98's shared discovery and product design to the surrounding public interface.

Status: implemented and locally verified on `codex/public-detail-polish`, based on D98 commit `c528092`. No push or deployment is recorded by this document.

## Scope

The homepage, payment and card product pages, Help, Privacy, Terms and retained public access pages share one visual foundation. `Shell` applies `public-main` only when `authenticated` is false. Public header and footer styles use the same foundation; authenticated workspaces retain their existing theme and navigation.

The D94 provider handoff remains the product journey: Trolleys payments are available through their separate hosted service, and Ledgix cards remain coming soon. The website does not gain a shared provider login, dashboard, financial processing or account connection through this presentation change.

## Shared foundation

`src/ui/public-theme.css` defines the public font, color, container, gutter, radius and interaction tokens. `consumer-site.css` and the public header and footer consume those tokens instead of separately repeating their base values.

| Detail | Implemented treatment |
| --- | --- |
| Typography | One system sans serif family across public page framing, including Help, legal and access pages. The existing italic serif accent in marketing headings remains. |
| Container | A shared 1,248px maximum width, with 32px gutters, reducing to 24px below 1,000px and 18px below 360px. Existing narrower reading columns remain. |
| Color | Forest text and primary actions, warm white surfaces, muted green supporting text and quiet green-gray rules. |
| Corners | A 10px artwork radius and 7px control radius. Product artwork no longer uses a large asymmetric lower corner. |
| Focus | A consistent 3px visible focus outline with a 4px offset for public links, buttons and disclosure controls. |
| Motion | Public transitions are removed and smooth scrolling is disabled when reduced motion is requested. |

The public theme is scoped to `.public-header`, `.public-main` and `.public-footer`. It does not replace authenticated workspace tokens. Legal reading widths and the Help reading column remain separate from the wider page frame.

## Header and footer

The desktop header is reduced from an 88px minimum height to 80px. Its logo, Payments / Cards / Help center links and Trolleys entry action occupy a simpler three-part grid. Current-page navigation uses the same quiet filled state on desktop and mobile. The existing `aria-current` behavior and destinations are retained.

At smaller widths, the logo and primary action remain together, with the three navigation links on a second row. Header and footer logos use matching responsive sizes. Main navigation, the primary entry action and footer links retain a minimum 44px target height.

The footer changes from dark forest to the same warm white surface as the header, separated by a fine rule. It keeps its distinct grouped structure: Services, Support and Contact, followed by the company statement and Privacy / Terms links. Mobile retains compact labeled rows rather than a long stack of separate headings and links. The original logo colors replace the inverted footer treatment.

Contact labels become **Email Trolleys** and **Email Ledgix**. Their existing email destinations are unchanged. Copyright, company identity, trade-name wording and legal destinations are preserved. This supersedes the earlier dark footer styling, without adding another footer or moving private profile and account navigation into it.

## Typography, spacing and artwork

Hero text, supporting copy and actions use more consistent spacing. Small availability notes, artwork captions and product notes are enlarged. Marketing buttons retain their substantial target size while sharing the common radius, hover color and focus treatment.

The photograph, Ledgix illustration and channel surfaces use the common artwork radius. Existing image files, official D97 network artwork and the D98 product composition are retained. This slice does not redraw or recolor network marks.

Channel previews increase small labels and supporting text, including message status, document metadata, checkout descriptions and payment link details. On mobile, the channel footer wraps naturally instead of forcing its explanatory text into a narrow column. Help text and questions receive consistent readable sizes. FAQ links are underlined in their resting state and retain visible keyboard focus.

## Clearer payment examples

The seven existing channel presentations remain: Text, Email, Invoice, Bill, Social, QR code and Website. Descriptions now explain the specific action and its destination more directly: share a payment link or QR code, review the amount, and continue to card checkout.

| Channel | Example retained or refined |
| --- | --- |
| Text | An $80 consultation payment request; the reply identifies the payment link without implying that payment itself confirms an appointment. |
| Email | A $120 custom stationery order, labeled as a payment request. |
| Invoice | $480 for design services, alongside the amount due. |
| Bill | A $65 garden care bill, with repeated explanatory footnotes removed. |
| Social | A $45 studio workshop, with a direct reservation caption. |
| QR code | An $18 lunch order, scanned to open card checkout. |
| Website | A $64 homeware set, with a concrete quantity rather than a decorative product sentence. |

The examples remain marketing illustrations. No payment form, transaction, provider connection or new product capability is added. The homepage closing now says “Manage payments for your business” in place of a less specific statement about where payments belong.

## Cleanup and preservation

Unused earlier public hero, feature, closing and step styles are removed from `public-site.css`, along with the unused `ServiceSteps` component. Shared FAQ and Help styles remain there; current discovery and product framing stays in `consumer-site.css`. Styles for removed channel footnotes are removed with their markup.

Existing browser assertions are updated for the two contact labels and the refined channel examples. This records expected copy changes; it does not itself establish that the tests have passed.

Privacy and Terms wording, draft status and indexing controls are unchanged. Product availability, approved provider URLs, email destinations, outbound referrer handling, existing email callback recovery and authenticated navigation remain unchanged. There is no financial command, permission, schema, provider integration, domain configuration or deployment change in this slice.

## Verification

All commands ran with the pinned Node 24.19.0 runtime and pnpm 11.19.0. Browser flows used the isolated local test database; preview startup only verified the preserved preview database, without migration or seed writes.

- Final production build, full lint, typecheck, architecture checks and `git diff --check` pass.
- The metadata unit suite passes all 18 cases.
- The existing public foundation, consumer preview, public accessibility, guest-checkout accessibility and account-menu suites pass all 50 desktop/mobile/accessibility cases. These include navigation and approved handoffs, email callback recovery, checkout/receipt readability and authenticated menus without public footers.
- Responsive capture checks 98 states: seven public routes at six widths (320, 390, 520, 768, 1024 and 1440px), plus all seven channel states on both marketing routes at four widths. It verifies header/footer gutter alignment, 44px chrome targets, overflow, visible focus and accessibility; no mutation requests are permitted. The route inventory includes the retained login page. Final capture passes all 98 states with no reported issues or runtime errors, and records 72 screenshots.
- Independent visual review covers header/footer at 320/1440px and every channel at 390/1440px, confirming readable copy, matched item/amount pairs, clean wrapping and no overlaps. A final micro-correction preserves whitespace around the hidden mobile FAQ heading break and uses 14px mobile FAQ answers. Public focus colors are centralized, including Help, legal and form controls.

Logs and captures are under `artifacts/d99-checks/`: `build-final.log`, `lint.log`, `typecheck.log`, `architecture.log`, `metadata.log`, `browser.log`, `visual.log`, `visual-final.log` and `visual/`. The capture helper is `review-public.mjs`.

The preview remains at http://127.0.0.1:3100/. The checks establish local interface behavior; they do not validate the independent third-party sign-in or financial services. D86 remains the hosted baseline; no deployment, provider activation or customer-data change occurred.

## Related decisions

- [D94 — provider-hosted public journey](PROVIDER_HOSTED_PUBLIC_JOURNEY.md)
- [D97 — official network artwork provenance](NETWORK_BRAND_ASSETS.md)
- [D98 — cohesive public product pages](COHESIVE_PUBLIC_PRODUCTS.md)
