# Current work context

Updated 9 November 2026. The five repository restructure stages and subsequent Developers and Resources alignment are complete. Their immutable evidence remains in `docs/plans/`. All five category URL migration stages are now complete locally.

## Active scope

Branch: `codex/url-category-alignment-20261108`, based on association review commit `6c27b215debd78d9a453ae54a2cd1990a23a7f8d`, retaining the preceding Developers alignment changes.

1. Map every existing public page to its final category address.
2. Move page wrappers and update navigation and authored links, preserving section anchors.
3. Update metadata, structured data and sitemap to final addresses.
4. Redirect former addresses directly to the corresponding final page.
5. Test the complete migration against the exact candidate before publication.

The complete mapping is in [category-url-map.json](plans/category-url-map.json). There are 3,738 moved addresses and 13 unchanged addresses. Services, Use cases, Developers, Resources and Company use their respective URL families. Home and Pricing remain unchanged. No category overview pages are added.

All former `/docs` pages remain redirect only. Merchant account setup belongs to `/resources/merchant-account-setup`. Existing guidance remains within the eight planned Developers pages. All eight mark Etail API products as unavailable; none creates a financial or account runtime.

The candidate still has 3,751 content pages and 3,731 search eligible URLs. Twelve legal/policy pages and eight unfinished Developers pages remain noindex. Frozen reference data, licensing, legal provisions, company identity, asset URLs and approved vendor destinations are unchanged. Exact new service documents are exempted from historical account-route retirement; unknown or operational service paths remain closed.

## Verification and release

Local implementation and all five migration stages are complete. The [category alignment receipt](plans/category-url-alignment.json) records stages 1 through 4. The [Stage 5 receipt](plans/category-url-stage5.json) records a fresh run of all four release-preparation commands against the unchanged final source fingerprint. That run passed 491 unit tests, 310 desktop/mobile tests and 153 accessibility tests, with one expected desktop skip. Source security and dependency checks passed. No runtime or presentation changes were needed during Stage 5.

All 380,388 internal link occurrences across 3,751 exported pages resolve. All 3,750 legacy addresses passed 11,250 actual local HTTP requests to direct final destinations. An additional 127,501 assertions covered URL variants, GET/HEAD redirects, rejected submitted bodies and approved production, former production origin, preview and wrong-site contexts. Chromium and WebKit passed 48 migration journey checks at phone and desktop widths, including bookmarks, refresh, header/footer navigation and browser Back. The earlier 72 responsive page/width checks remain recorded in the stages 1 through 4 receipt.

The production sitemap has exactly 3,731 URLs; preview and unapproved contexts remain noindex with an empty sitemap. Source, export and package fingerprints match. The local package retains 3,751 content pages, one Edge boundary and the protected email handler. Repository-only files remain outside website output. Local Stage 5 evidence and screenshots are in `outputs/url-migration-stage5-20261109/` in the original checkout, outside the published website.

Last verified published baseline: `e9e44fbebfde0f0ae6a7b5383c3400dfa632b1a5`, Netlify deploy `6aef58f5c8e79bce7be0b5b3`. On 9 November 2026, the user authorized committing and pushing this feature branch, opening a pull request against `main`, and checking its GitHub CI result. Merge, production deployment and remote protection changes are outside this step. Hosted redirects, cache and headers remain part of a separately authorized release. Preserve the existing manual publication procedure.

The final GitHub audit verified the 902-file candidate, unchanged remote baseline, clean publication boundary and unchanged Stage 5 runtime fingerprint. The contributor Help link was corrected to `/resources/help`. Fresh architecture, source-publication and package checks passed. The existing `main` workflow passed, but the candidate must pass its own `public-website` check before merge. `main` currently has no protection or ruleset; enabling protection remains a separate recommendation.

## Operating instructions

Use [source precedence](SOURCE_PRECEDENCE.md), [architecture](PUBLIC_SITE_ARCHITECTURE.md), [repository guide](REPOSITORY_GUIDE.md), [contributor workflow](../CONTRIBUTING.md), [page paint rules](PAGE_PAINT_STANDARDS.md), [file publication policy](FILE_PUBLICATION_POLICY.md) and [Netlify runbook](NETLIFY_DEPLOYMENT.md). Exact permitted and denied targets remain in `project-targets.json`.
