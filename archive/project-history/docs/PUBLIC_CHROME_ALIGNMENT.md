# Shared header and footer alignment

D109 · 20 September 2026

The user identified uneven footer alignment and requested a detailed header/footer review across every page. This refinement preserves the public-only scope, confirmed copy, destinations and shared design.

## Visual corrections

The original 800×150 logo contains 24 transparent pixels before its 774-pixel visible mark. Shared CSS compensates for this inset without changing the asset, so the visible logo starts at the same edge as content and copyright. Header and footer use one brand width and horizontal gap at each breakpoint.

Desktop footer Services begins on the same text rail as the first header navigation link. Footer headings share a 44px row with the brand; both link rows align across all three groups. The mobile footer uses three vertical groups instead of alternating section titles and links across table-like rows. Its height is 319px on narrow phones; the desktop footer is 230px.

Copyright and Privacy/Terms use one 12px type scale and a centered row. The desktop Terms text reaches the right content edge. Mobile legal links remain left aligned. All links retain at least 44px targets. Selected header navigation keeps a consistent font weight to prevent neighboring links moving between pages. The page frame grows to the viewport height, keeping the footer at the bottom of short pages including the 404.

## Verification

`artifacts/d109-checks/chrome-review.mjs` checks all six public pages and the 404 at 320, 360, 375, 390, 640, 760, 761, 768, 1000, 1001, 1280, 1440 and 1920px: 91 page/width states. It measures visible logo edges, header navigation positions, footer heading/link rows, legal edges, cross-page consistency, target sizes, overlap, horizontal overflow and bottom gaps. All pass. Captures in `artifacts/d109-checks/visual/` were reviewed visually, including both sides of the tablet breakpoint and both header actions; an independent review found no remaining alignment defect.

The normal public verification pipeline covers existing interactions, keyboard access, metadata, retired routes and accessibility, then generates and audits the Netlify package. Results are recorded in `planning/STATUS.md` and `artifacts/d109-checks/verify.log`. Visual checks cover the recorded viewport sizes and Chromium; they do not promise perfection on every browser or device.

No content, vendor setup, database, authentication, publication or search-indexing change is part of this refinement.
