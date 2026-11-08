# Page paint and loading standard

This is a standing requirement for future website work, requested by the user on 6 November 2026. Preserve a stable first view and refresh on desktop and mobile. Apply these rules when adding or changing pages, artwork, image delivery, shared navigation, responsive behavior or framework versions.

## Lessons that must not be repeated

| Observed issue | Required implementation |
| --- | --- |
| Logos or guide screenshots appeared late | Keep small shared brand marks in the existing embedded brand system. Use versioned static imports for image assets and preserve their cache behavior. Keep visible account and Shopify guide screenshots eager, including images reached by a saved section link. Hidden dialog copies can remain lazy. |
| A header or part of the artwork painted before the rest of the document | Preserve the shared Shell render hint targeting `#public-page-ready` and the marker after the footer. The opening `#main-content` element does not prove that the page markup has finished arriving. Keep the normal rendering fallback for browsers without native hint support. |
| Desktop artwork or the phone footer changed shape when JavaScript initialized | Render the correct responsive layout before hydration. Preserve the CSS selected footer variants, stable keys and the small disclosure initializer. Keep native disclosure choices and focus intact during enhancement and resizing. |
| ISO filters pushed a table down after initialization | Reserve the final filter layout and initial count in HTML. Enable controls when ready. Without JavaScript, keep the full table readable and hide inactive controls. |
| Payment logos changed size when image data arrived | Use the source aspect ratio for reserved space and CSS for the display size. Preserve fractional SVG view box ratios where generated metadata rounds them. Compare dimensions before and after delayed image responses. The six opening Payment methods marks use the existing embedded brand system in a stylesheet imported only by that route, preserving original bytes and avoiding separate logo paints. |

`loading="eager"` alone does not fix document streaming, hydration, decoding or incorrect aspect ratios. A complete screenshot after loading is not evidence that the first paint was stable.

## Implementation rules

1. Keep one Shell, header, footer and brand system. Fix shared causes in shared components instead of adding page specific loading workarounds.
2. Give images stable intrinsic proportions before their data arrives. A design display width is not necessarily the source width. Avoid guessed width and height pairs. Recheck exact SVG ratios if assets are replaced.
3. Choose loading priority by visibility. Preload only genuinely critical opening assets. Do not make all future images eager by default. Noncritical offscreen or closed dialog images may remain lazy when space is reserved and saved section refreshes still work.
4. Preserve versioned asset URLs and production caching. Do not change preview cache or indexing protections to make a local speed result look better.
5. Initialize responsive states without moving already visible content. Keep early clicks, keyboard focus, browser history and native behavior without JavaScript working.
6. Do not hide loading faults behind a full page opacity gate, loading overlay, arbitrary timer or a requirement to wait for the application bundle. Do not weaken a failing regression to conceal a reproduced defect.
7. Measure image decoding changes per asset type. Synchronous decoding helped the three account JPG screenshots; it did not improve the earlier Shopify WebP case. Do not generalize that setting across the site without evidence.

## Verification for future UI changes

Use the pinned runtime. Rebuild after source changes so browser checks inspect the current export:

```sh
pnpm build
pnpm exec playwright test --project=desktop --project=mobile tests/browser/site-paint.spec.ts tests/browser/shopify-guide.spec.ts tests/browser/documentation.spec.ts tests/browser/site-structure.spec.ts
```

Choose additional tests for the changed component. For a new page family or artwork component, extend the relevant regression to cover it rather than relying only on existing examples.

The existing `pnpm test:e2e` includes these files in both desktop and mobile projects. `pnpm verify:public` runs that suite, and the GitHub foundation workflow runs `pnpm verify:public`. Preserve this inclusion. A focused command is not a substitute for all required release checks.

For changes affecting shared layout or image delivery, check:

1. A cold visit, a cached refresh, and a refresh at a saved section containing artwork. Use production asset cache rules in a controlled fixture; keep local preview safeguards intact.
2. Slow image responses, slow JavaScript and split HTML delivery separately. Compare geometry before and after each dependency arrives. Check early interaction before hydration.
3. Phone, tablet and desktop breakpoints, including 320, 390, 768, 1024 and 1280 pixels where relevant. Check Chromium and WebKit for affected flows. WebKit checks are additional local coverage, not part of the current Chromium CI projects.
4. Navigation between page families, browser Back, open disclosures, the footer and the page not found recovery link. Keep images inside closed disclosures or dialogs out of visible image failure counts.
5. Browser errors, hydration warnings, missing visible images, overflow and unexpected layout shifts. Inspect first frames when a visual flash is reported; do not rely only on measurements taken after the load event.

Fix reproduced regressions before marking the change complete. Record the exact routes, widths, browser engines and network conditions checked. Shared template coverage must not be described as an individual browser inspection of every generated URL. After an authorized deployment, recheck the affected hosted pages and asset headers. Local passing checks do not establish hosted behavior or guarantee zero delay on every device and connection.

## Route scrolling

Preserve `data-scroll-behavior="smooth"` on the root HTML element while global CSS enables smooth scrolling. Next.js 16 uses that declaration to suspend smooth scrolling during route positioning. Without it, opening a long page from shared navigation can continue scrolling toward the footer after the new route renders. Verify both the first and settled viewport, not merely the destination URL or DOM visibility. Keep native section links and browser Back coverage.

## Regression ownership

| Coverage | Repository file |
| --- | --- |
| Partial document paint, responsive artwork, table insertion, early clicks and logo geometry | `tests/browser/site-paint.spec.ts` |
| Split document test fixture | `tests/browser/guide-rendering.ts` |
| Shopify screenshots, saved steps and refresh | `tests/browser/shopify-guide.spec.ts` |
| Account screenshots and partial guide paint | `tests/browser/documentation.spec.ts` |
| Responsive footer before hydration and navigation | `tests/browser/site-structure.spec.ts` |
| Browser history and native section links | `tests/browser/public-history.spec.ts` |

The 6 November findings and completed checks are preserved in [the historical work context](../archive/project-history/docs/CURRENT_WORK_CONTEXT.md) and [status log](../archive/project-history/planning/STATUS.md). Current status is in [CURRENT_WORK_CONTEXT.md](CURRENT_WORK_CONTEXT.md). This standard changes implementation and review practice, not publication authorization or the website's public content.

## Startup traffic and performance measurement

Shared header, footer and documentation directory links opt out of speculative route downloads with `prefetch={false}`. The optional support link in the Shopify guide follows the same rule. These links still navigate normally when selected. Preserve that distinction from the main commercial journey links, where selective prefetching may be useful. Do not make a whole directory download merely because it becomes visible.

The site paint browser suite verifies that the account and Shopify guides do not fetch unselected routes during startup and that the Contact sales link still works on desktop and mobile. A failed check must be investigated rather than weakening the traffic assertion.

For loading speed reviews, inventory all exported pages and time every core route plus the largest reference layouts. Run timing sessions sequentially without concurrent builds or browser suites. Verify that throttling affects the document as well as its assets, and calibrate against the intended latency and transfer rate. Preserve the normal preview protections; use a separate compressed cache fixture when measuring production asset behavior locally. Record both first visits and warm refreshes. Exclude legacy `nomodule` scripts from modern browser payload estimates, and distinguish required assets from speculative downloads. Local laboratory timings are not real visitor Core Web Vitals or a guarantee for every device and connection.
