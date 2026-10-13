# Consumer search and public release

D179 · D191 verification, 14 October 2026

## Current scope and search controls

The active application contains six public information pages. Home, Payment acceptance, Credit cards and Help are eligible for indexing on the approved live site; Privacy and Terms retain `noindex, nofollow`. The website has no account, authentication, checkout or database runtime. Retired routes remain governed by the read-only retirement proxy. Search directives are not access controls.

All six canonicals use `https://etail-depot-next.netlify.app` and their fixed public path. Visitor queries, account identifiers and request headers never choose the canonical origin. D122 records indexing approval for site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`. The source guard requires that exact approval and the matching production environment/site/origin. Local, test, branch and deploy-preview environments stay non-indexable. D179 does not change those controls.

The production sitemap contains only `/`, `/card-services`, `/payment-services` and `/help`, with no invented last-modified dates. `robots.txt` permits HTML crawling so Google can observe indexing directives, excludes `/api/` and advertises the sitemap only in the approved environment. Live D178 checks confirmed these settings. They do not establish actual Google indexing. [Google indexing directives](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## Audience and metadata

Trolleys serves US businesses seeking online card payment links, QR sharing and a clear create/share/checkout journey. Ledgix addresses prospective users of a virtual Visa secured credit card, with Coming soon availability. Do not target disposable numbers, instant approval, credit-building claims, prepaid cards, guaranteed dispute protection or other unconfirmed capabilities. Intent recommendations come from official product terminology, not keyword volumes or measured demand.

The six routes use unique titles and descriptions. Public and legal metadata specify absolute branded titles so Home and inner pages receive exactly one Etail Depot suffix; social titles match. `src/modules/public-site/metadata.ts` and `legal-metadata.ts` are the implementation sources. Headings preserve the accepted marketing style and use descriptive subordinate headings, product-specific decision questions and crawlable internal links.

Organization, WebSite, WebPage and breadcrumb structured data use confirmed company facts. Do not add unsupported offer/rating/bank schema or fabricate reviews. FAQs help customers make decisions; Google's FAQ rich-result feature is discontinued, so no FAQ rich-result claim or markup is proposed. [Google updates](https://developers.google.com/search/updates)

## D191 final search checks

14 October 2026. Production-mode verification passes for four indexable discovery routes, exact live-domain canonicals, titles/social metadata, structured data and sitemap, plus noindex legal/404/retired routes. The final local build remains noindex across all six public routes. No search control or canonical changes were made. Rendered local checks find one H1 per page, unique descriptions/titles, 43 resolving internal links/anchors and no private/account requests or browser storage writes in sampled fresh contexts. These observations do not establish ranking, index coverage or field performance.

The earlier nonsquare symbol used as a favicon is replaced by a square 192×192 PNG; the touch icon is 180×180. Both are code-rendered from the original unchanged Etail symbol, preserving its proportions/colors on a square canvas. Both stable public URLs return PNG successfully. [Google favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)

Page-specific social-preview imagery could be considered separately using approved existing art. The current shared company image is preserved; it is not an indexing failure or authorization for another visual redesign. [Google image guidance](https://developers.google.com/search/docs/appearance/google-images)

## Measurement still required

Search Console access and field performance were not available in D178–D179. No search-volume, ranking, indexing, conversion or Core Web Vitals outcome is established. An authorized property owner should:

1. Inspect the four discovery URLs and record Google's indexing status and selected canonical. Confirm legal-page exclusions remain intentional.
2. Review the existing sitemap report and any security/manual-action reports. Property verification, sitemap submission or indexing requests remain separate authorized actions.
3. Record US query/page/device impressions, clicks and click-through rate for each product separately. Distinguish branded queries from payment-link and secured-card queries, and retain comparable dated periods.
4. Review field Core Web Vitals if sufficient data exists. Record unavailable field data as unknown, not as a passing score; use browser/lab tests only as diagnostic evidence.
5. Compare a later approved release with that baseline. Do not promise search placement or infer market fit from technical checks.

[Google Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start), [title guidance](https://developers.google.com/search/docs/appearance/title-link), [description guidance](https://developers.google.com/search/docs/appearance/snippet)

## Verification and release

Unit checks exercise the exact search boundary, nonproduction exclusions, private-path rejection, canonical inventory and safe structured data. `pnpm test:seo:production` builds and inspects the approved production configuration locally, including one company suffix and matching document/social titles. This does not publish or request indexing. Full public checks, packaging and the unresolved dependency/operational evidence review remain separate gates; see [current status](../planning/STATUS.md) and [operational trust review](OPERATIONAL_TRUST_REVIEW.md).
