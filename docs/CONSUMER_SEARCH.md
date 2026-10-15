# Consumer search and public release

D217 published search refinement · Google and Bing verification/submissions, 15 October 2026 JST

## Current scope and search controls

The active application contains six public information pages. Home, Payment acceptance, Credit card and Help are eligible for indexing on the approved live site; Privacy and Terms retain `noindex, nofollow`. The website has no account, authentication, checkout or database runtime. Retired routes remain governed by the read-only public boundary. Search directives are not access controls.

All six canonicals use `https://etaildepot.com` and their fixed public path. D215 completed the approved domain migration; the old Netlify public hostname and www redirect to the apex. Visitor queries, account identifiers and request headers never choose the canonical origin. D122 records indexing approval for site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, with D215 binding it to the apex origin. The source guard requires that exact approval and the matching production environment/site/origin. Local, test, branch and deploy-preview environments stay non-indexable. D216 does not change those controls.

The published sitemap contains only `/`, `/credit-card-services`, `/payment-acceptance-service` and `/help`, with no invented last-modified dates. `robots.txt` permits HTML crawling so Google can observe indexing directives, excludes `/api/` and advertises the sitemap only in the approved environment. D215 hosted verification confirmed the current domain and route settings. HTTP eligibility does not establish actual Google indexing. [Google indexing directives](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

## Audience and metadata

Trolleys serves US businesses seeking online card payment links, QR sharing and a clear create/share/checkout journey. Ledgix addresses prospective users of a virtual Visa secured credit card, with Coming soon availability. Do not target disposable numbers, instant approval, credit-building claims, prepaid cards, guaranteed dispute protection or other unconfirmed capabilities. Intent recommendations come from official product terminology, not keyword volumes or measured demand.

The six routes use unique titles and descriptions. Public and legal metadata specify absolute branded titles so Home and inner pages receive exactly one Etail Depot suffix; social titles match. `src/modules/public-site/metadata.ts` and `legal-metadata.ts` are the implementation sources. Headings preserve the accepted marketing style and use descriptive subordinate headings, product-specific decision questions and crawlable internal links.

Organization, WebSite, WebPage and breadcrumb structured data use confirmed company facts. Do not add unsupported offer/rating/bank schema or fabricate reviews. FAQs help customers make decisions; Google's FAQ rich-result feature is discontinued, so no FAQ rich-result claim or markup is proposed. [Google updates](https://developers.google.com/search/updates)

## D191 final search checks

14 October 2026. Production-mode verification passes for four indexable discovery routes, exact live-domain canonicals, titles/social metadata, structured data and sitemap, plus noindex legal/404/retired routes. The final local build remains noindex across all six public routes. No search control or canonical changes were made. Rendered local checks find one H1 per page, unique descriptions/titles, 43 resolving internal links/anchors and no private/account requests or browser storage writes in sampled fresh contexts. These observations do not establish ranking, index coverage or field performance.

The earlier nonsquare symbol used as a favicon is replaced by a square 192×192 PNG; the touch icon is 180×180. Both are code-rendered from the original unchanged Etail symbol, preserving its proportions/colors on a square canvas. Both stable public URLs return PNG successfully. [Google favicon requirements](https://developers.google.com/search/docs/appearance/favicon-in-search)

Page-specific social-preview imagery could be considered separately using approved existing art. The current shared company image is preserved; it is not an indexing failure or authorization for another visual redesign. [Google image guidance](https://developers.google.com/search/docs/appearance/google-images)

## D217 Google submissions and broader search access

On 14 October 2026, Google accepted the existing sitemap with Success and four discovered pages. Payment acceptance, Credit card and Help each passed a live smartphone inspection: successful fetch, crawling/indexing allowed, the exact self canonical and one valid breadcrumb item. One indexing request per page was accepted into the priority crawl queue. The earlier baseline below remains a dated observation, not the current submission status. Actual Google-selected canonicals after indexing, impressions, rankings and traffic require subsequent reports; no repeated request is warranted.

Read-only review confirms that the existing wildcard robots policy permits Bingbot and OAI-SearchBot. This is crawl eligibility, not proof of genuine crawler visits, WAF access or AI citations. No robots edit is needed. On 15 October 2026 JST, the user separately approved manual Bing site verification through one Cloudflare CNAME. Bing confirms verified administrator access by DNS, and its first sitemap submission is Success with four discovered URLs. All 55 previous DNS records are unchanged (56 total); no Google Search Console import or ongoing OAuth grant was made. GPTBot training controls are distinct from ChatGPT search controls. Sources, DNS readback and limitations are recorded in `artifacts/d217-release/search-access-review.json`, `bing-verification.json` and `bing-dns-readback.json`.

## Measurement still required

Search Console access and field performance were not available in D178–D179. On 14 October 2026, D216 verified the Domain property through the explicitly approved single Cloudflare TXT addition. Google reports Home as indexed; Payment acceptance, Credit card and Help are unknown to Google. No sitemap is listed as submitted, and manual-action/security reports show no issues. Performance and indexing aggregate reports are still processing. Home’s stored crawl reports no declared canonical, whereas the current live HTML has the correct self canonical; retain this discrepancy until a later crawl can be checked. No search-volume, ranking, conversion or field Core Web Vitals outcome is established. The next measurement steps are:

1. Retain the dated four-URL baseline in `artifacts/search-growth/search-console-setup.json` and compare subsequent crawl/indexing results. Legal-page exclusions remain intentional.
2. Follow the accepted D217 sitemap and indexing requests in subsequent reports. These are complete submissions, not guarantees of indexing or ranking.
3. Record US query/page/device impressions, clicks and click-through rate for each product separately. Distinguish branded queries from payment-link and secured-card queries, and retain comparable dated periods.
4. Review field Core Web Vitals if sufficient data exists. Record unavailable field data as unknown, not as a passing score; use browser/lab tests only as diagnostic evidence.
5. Compare a later approved release with that baseline. Do not promise search placement or infer market fit from technical checks.

[Google Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start), [title guidance](https://developers.google.com/search/docs/appearance/title-link), [description guidance](https://developers.google.com/search/docs/appearance/snippet)

## D216 local content and trust refinement

The accepted first slice uses existing FAQ sections: a concise operator identity answer on Home, sale/use-case and sharing explanations on Payment acceptance, a booking-deposit answer on Help, and Apple/Google setup summaries on Credit card. These answers are present in initial HTML, including when their native disclosures are closed. Existing artwork, interaction states, pricing, deposit/repayment explanations, service availability and notices remain the foundation. The Organization description reuses the visible identity sentence; it introduces no new credential or entity.

The coordinated backlog is `planning/search-growth.json`; dated public observations and specialist drafts are under `artifacts/search-growth/`. Longer guides and new routes are deferred. The separately approved Google ownership verification is complete. Sitemap submissions, new tracking, external identity edits and publication remain separate from this local content work. Keep crawler access, search impressions, AI citations, website clicks and provider-confirmed onboarding as different measures; unavailable data is not zero.

## Verification and release

Unit checks exercise the exact search boundary, nonproduction exclusions, private-path rejection, canonical inventory and safe structured data. `pnpm test:seo:production` builds and inspects the approved production configuration locally, including one company suffix and matching document/social titles. This does not publish or request indexing. Full public checks, packaging, the full dependency audit and the separately open operational evidence review remain separate gates; see [current status](../planning/STATUS.md) and [operational trust review](OPERATIONAL_TRUST_REVIEW.md).
