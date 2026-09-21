# D148 — Payments media gallery

21 September 2026. The user requests a YouTube/social-media-style way to choose sale types and payment channels. Apply the browsing pattern to the existing product examples, without presenting them as videos.

- Goods, Services and Information use distinct parcel, appointment and research thumbnails. Only the active category has the selection check.
- One large preview shows the existing two-step journey: share a payment link, then the customer pays by card.
- Five thumbnail choices form a side rail on desktop: Text, Email, Social, QR code and Website. Their small illustrations mirror each channel's recognizable format.
- At narrow widths the rail moves above the preview and scrolls locally. The page itself does not scroll horizontally. The selected choice is revealed after keyboard input or a desktop-to-mobile resize.
- The preview is always visible; the old Show example / Hide example control and hidden mobile state are removed.
- The active channel has a clear border, background and check; its caption describes the action. Keyboard Left/Right/Up/Down and Home/End retain one roving tab stop. Decorative thumbnails do not add noise to accessible names, and orientation follows the displayed rail.
- Category selection still updates the hero, channel purchase and banking-recognition context together. Channel selection never selects a paid service, persists account data, sends a message or opens checkout.

All artwork uses the existing CSS/icon system. No new image library, remote image request, generated bitmap, fabricated video interaction or external social platform integration is introduced. Approved pricing, network marks, Order Insight scope, fixed service destinations, legal pages and preserved database resources remain unchanged.

Verification and initial/final evidence are recorded in `planning/STATUS.md` and `artifacts/d148-checks/`. D145 / PR #32 remains live pending a separate release request.
