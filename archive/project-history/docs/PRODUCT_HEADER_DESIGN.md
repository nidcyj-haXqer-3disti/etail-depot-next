# Product header design

> **D112 correction — 20 September 2026:** The user requests one consistent company header. Every page now uses the homepage's Etail Depot logo, Trolleys Payments / Ledgix Cards / Help navigation and Open Trolleys action. Removed product identity/attribution markup, conditional header props and unused styles. Only the active navigation underline varies by route. The D111 product-identity proposal below is retained as superseded history; its mobile menu behavior remains.

D111 · 20 September 2026

The header names the service a visitor is viewing while preserving a clear route back to Etail Depot. This is a presentation change to the public website; vendor sign-in and dashboards remain external.

| Page | Identity | Navigation | Action |
| --- | --- | --- | --- |
| Homepage, Help, Privacy, Terms and 404 | Etail Depot logo | Trolleys Payments / Ledgix Cards / Help | Open Trolleys |
| Payments | Trolleys, by Etail Depot | Payments / Cards / Help | Open Trolleys |
| Cards | Ledgix, by Etail Depot | Payments / Cards / Help | Contact Ledgix |

All identity links lead home. Product identity and attribution form one accessible 44px target. Product-page navigation remains neutral to preserve the user's preference against opposite-brand promotion. Trolleys continues to use the fixed no-referrer provider entrance; Ledgix uses the approved inquiry email and remains coming soon.

At 960px and above, navigation is centered between the brand and action. Below 960px, a labeled Menu button reveals the same navigation and action in a simple inline panel. There is one navigation DOM, no modal or focus trap, and hidden links leave the accessibility and tab order. Enter/Space operate the button; Escape closes and restores focus. Route selection, outside pointer interaction, leaving the header with focus and viewport resizing close it. The closed header is 73px high across reviewed widths.

One shared `PublicHeader` owns identity and disclosure state; `PublicNavigation` owns route labels and current-page state. The existing Shell still owns one header, main and footer. Header-specific brand dimensions no longer alter the accepted footer's dimensions. Footer markup, content and visual layout remain unchanged.

## Verification

- `pnpm verify`: exit 0; lint, typecheck, 43 unit, 22 browser, 18 accessibility cases, source/dependency security, production build, offline Netlify packaging and artifact boundary checks.
- `node artifacts/d111-checks/header-review.mjs`: exit 0; 70 closed/open responsive states across six public pages and the 404 at 320, 390, 768, 959, 960 and 1440px. Checks include centered desktop navigation, target sizes, no overflow, one navigation/footer and preserved footer markup/dimensions.
- Desktop and mobile screenshots reviewed for identity hierarchy, spacing, menu layout and unchanged footer. Keyboard, outside click, route change and rapid breakpoint changes are covered by browser tests.
- Initial assertion and rapid-resize failures were corrected before the final full passing run; logs remain in `artifacts/d111-checks/`.

No dependency, database, provider configuration, publication or indexing change is included. Offline packaging is not deployment.
