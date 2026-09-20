# D104 — public footer detail refinement

20 September 2026. The user requests a micro-level footer layout review. Retain the accepted compact grouping, public theme, company wording and all nine links. Authenticated workspaces still have no footer.

## Corrections

- Align desktop/tablet Privacy and Terms with the copyright baseline instead of vertically centering them between the two company lines. Adjust the divider spacing to preserve a compact lower row.
- Let the company block share available width with the legal navigation, then stack deliberately below 560px.
- Give the first mobile navigation column enough space for “Trolleys payments,” with a common column track across Services, Support and Contact.
- Refine the category width and gaps below 360px so “Ledgix cards” also fits on one line at 320px. The initial review detected this final fractional-width wrap; the corrected layout retains 44px link targets.
- Keep the legal company name together within each paragraph and use natural paragraph wrapping.

Only `public-chrome.css` and two inline company-name wrappers in `public-footer.tsx` change. No header, wording, destinations, policy, provider, financial or data changes.

## Verification

Final results are recorded in `artifacts/d104-checks/`. Production build (`build-final.log`), focused ESLint (`lint.log`) and TypeScript (`types.log`) checks pass. Twenty existing public-page/browser/accessibility cases pass (`browser.log`); all six narrow-phone accessibility cases pass again after the final column adjustment (`browser-final.log`).

The footer review covers all seven public routes at 320 and 1440px, plus Terms at 360, 390, 520, 560, 600, 760, 768 and 1000px. It checks one footer, nine links, at least 44px targets, single-line navigation labels, aligned company/legal text, no viewport overflow, accessibility and keyboard focus. Initial findings are preserved in `visual-initial/` and `visual-initial.log`; final output is recorded separately.

All 22 final footer states pass with zero issues or runtime errors (`visual-final.log`, `visual/results.json`). Independent visual review confirms the 320/390/600/1440px layouts and unclipped keyboard focus; no crowding or unwanted navigation wrapping remains. The local preview is refreshed, with startup only verifying preserved database preparation. No push or deployment is included.
