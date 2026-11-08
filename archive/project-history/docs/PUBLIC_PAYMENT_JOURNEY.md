# D106 — a clear homepage-to-payments journey

20 September 2026. The user finds the homepage and Payments page repetitive and confusing, especially their links, labels and layouts. Keep the accepted visual system while giving each page a distinct purpose.

## Page roles and destinations

- `/`: a service overview with the editorial payment hero, three concise payment-use categories, forthcoming Ledgix cards and common questions. Its main action opens Trolleys directly. “How payments work” is the secondary link to `/payment-services`.
- `/payment-services`: the payment explanation. A compact request/share/track flow replaces the repeated photograph. The full seven-channel examples live only here, followed by the account-access action. The repeated benefits and sign-in instruction sections are removed.
- `https://trolleys.ai`: the one approved payment-service entrance. Every merchant-access button says “Open Trolleys.” Account setup and sign-in are clearly identified as taking place there. Preserve the exact root address, no-referrer protection and lack of forwarded parameters. Do not invent separate vendor sign-up/login URLs.

The channel illustrations explain the customer's checkout; they contain no merchant sign-in link or actionable payment control. Removing their duplicate heading and footer keeps the channel selector and examples together. Old public-only styles for the removed sections are deleted. Shared typography, colors, header/footer, authentic network artwork and mobile targets are retained. Existing routes and the payment-channel section anchors remain valid; no redirect layer is added.

D105 brand separation remains: Payments does not introduce Ledgix, and Cards does not introduce Trolleys. Cards availability, general Help/legal pages, retained local recovery, provider behavior and data remain unchanged.

## Verification

Evidence is recorded in `artifacts/d106-checks/`. Production build, focused lint, types and architecture checks pass. All 42 public browser/accessibility cases pass. The existing discovery/handoff tests verify the direct homepage learning path and consistent portal actions; the seven-channel keyboard, touch-target, static-illustration and private-data checks run on the Payments page. Eight page/width states at 320, 390, 768 and 1440px pass without horizontal overflow or runtime errors. Desktop full pages and narrow-phone heroes were visually inspected. Independent source review found no concrete issue. The preserved local preview is refreshed. No push or deployment is included.
