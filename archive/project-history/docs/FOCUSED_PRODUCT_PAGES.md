# D105 — focused product pages

20 September 2026. The user requests removing Ledgix references from the payment product page and Trolleys references from the card product page to reduce confusion.

Both product bodies now focus on their own service. Counterpart links are removed from their closing sections, and the card-account explanation no longer compares Ledgix with Trolleys. Product availability and financial descriptions remain unchanged.

An optional typed public-service context reaches the existing shared Shell, Header and PublicFooter. Cards uses Contact Ledgix in its header; Payments retains Open Trolleys. Product footers use neutral Payments/Cards navigation, the current product’s email, Compliance, relevant help and its own trade-name disclosure. The shared layout and all legal links remain. Home, Help, legal pages, retained sign-in and authenticated workspaces preserve their existing navigation.

The existing public journey now checks the absence of the opposite brand in visible product-page content, no payment-provider portal links on the card page, correct header/footer contacts, one focused closing action and neutral navigation between products. Referrer protection, public accessibility and no private API reads or mutations remain covered. This is a rendered-page change; the inherited social-preview artwork is unchanged.

## Verification

Production build, focused lint, types and architecture checks pass. All 48 public discovery, access-menu and accessibility cases pass; eight affected cases pass again after the final footer target-size refinement. Eight product/width states at 320, 390, 768 and 1440px pass without horizontal overflow, clipped navigation, undersized header/footer targets or runtime errors. Header, footer and closing-section captures were visually reviewed. Evidence is recorded in `artifacts/d105-checks/` (`build-final.log`, `browser.log`, `browser-final.log`, `visual.log` and `visual/`). Independent source review found no functional regressions. The preserved local preview is refreshed. No provider, customer-data, financial, push or deployment change is included.
