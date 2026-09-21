# Public website release review

## D122 — public search release deployed and verified

21 September 2026. The user explicitly approves indexing and deploying the reviewed public website to `https://etail-depot-next.netlify.app`, site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, team `685ae8f4e6ce519ecf6b267d`. This supersedes the D121 release/indexing hold for this candidate. The approved indexed pages are `/`, `/payment-services`, `/card-services` and `/help`; Privacy, Terms, 404, retired routes and all preview/local environments remain noindex. No custom-domain, DNS, vendor activation or financial change is authorized by this release.

The source now includes distinct truthful page descriptions/titles, fixed canonicals, social metadata and Organization/WebSite/WebPage structured data with the confirmed company legal name and non-home breadcrumbs. Approved production exposes only those four pages in the sitemap and advertises that sitemap through robots metadata. Product availability and vendor-access wording remain unchanged.

Production-only `APP_ENV=production`, `ETAIL_SEARCH_CONTEXT=production` and `ETAIL_PUBLIC_ORIGIN=https://etail-depot-next.netlify.app` settings were configured successfully through the Netlify API for **builds and functions**. The source guard also checks the recorded approval, exact site/origin, production `NODE_ENV` and matching `SITE_ID`. Netlify `CONTEXT` is not available to functions, so the guard requires the custom production context and rejects any supplied `CONTEXT` other than `production`. This preserves the preview boundary without relying on request hostnames or visitor input.

**Local verification passed:** lint, types, 67 unit cases, 24 desktop/mobile cases, 18 accessibility cases, public architecture, dependency/security review (no known vulnerabilities), production SEO HTTP checks and Netlify packaging. The production checker verifies four indexable pages, schema/canonical/social metadata, exact sitemap and noindex legal/404/17 retired route families, with runtime `CONTEXT` absent. Output inspection confirms 11 routes, one server archive (1,337 entries), 17 proxy routes and 72 public/static files. Initial checker assertions were corrected to normalize equivalent root URLs and resolve valid relative redirect locations; application behavior did not change. Evidence: `artifacts/d122-checks/verify-release.log`, `production-seo-final.log` and `package.log`.

**Published and verified:** [PR #29](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/29) passed all GitHub CI steps in run `35519223125`, job `106100288172`, and merged as `51e4717f3cc466f60c9081147cde58a6d7f0a079`. Local release commit `621ffb25755d661855e52d04caa35d93fba4aab4`, remote feature commit, CI merge, merged main and uploaded source all match tree `e0857da627ca1b4defcdea06f144ceb242a9d9f3`. A pristine 371-file Git archive was uploaded; its tracked files remained unchanged and the provider added only `.netlify/state.json`.

Netlify production deploy `6aaffadab7fae6eb884df1af` (build `6aaffadab7fae6eb884df1ad`) is **ready and current**, published 20 September 2026 at 15:26:02 UTC / 21 September in the local timezone. Visitor access is unchanged. Hosted HTTP checks passed for four indexable pages, canonical/schema/social metadata, sitemap/robots, the social image and noindex legal/404/17 retired route families. Hosted visual checks passed all 14 desktop/mobile scenarios with six screenshots, no overflow, unloaded visible images, JavaScript errors, account cookies or prohibited requests.

The initial mobile smoke harness clicked at DOMContentLoaded before React had attached; diagnostic evidence reproduces the early click and confirms first-click success after load, without retries. The final harness waits for load; no application change was made to hide this condition. Local packaging contains one application server function; Netlify additionally reports its platform-managed `emails` helper. No message was sent and no platform extension was changed. Netlify reports no database migration files for this deployment.

Release/CI/hosted evidence is recorded in `artifacts/d122-checks/publication.json`, `github-release.json`, `github-ci.log`, `hosted-seo.log`, `hosted-visual-final.log` and `hosted-visual/summary.json`. These closeout documentation updates follow publication; they do not change the deployed application. Automatic publication remains held.

Google Search Console submission, actual Google indexing and rankings are not verified. Index eligibility does not guarantee any of them. No vendor account, mailbox delivery, hosted customer database, DNS, provider agreement or legal-compliance audit is added by this work. Ledgix remains coming soon; public-only and record-preservation boundaries remain intact.

## D121 — preserved preparation record

D121 · 20 September 2026

The user approves the three marketing pages and shared header/footer and requests a final detailed review before deployment. Preserve the approved design. This is preparation of the public website release, not publication or activation of vendor services.

## Completed refinements

- Keep the shared company header, Payments / Cards navigation, footer, artwork and page composition. Specify accurate responsive image sizes for the company logos and product photographs, avoiding unnecessarily large image requests.
- Distinguish ways to share a payment request from payment methods. Clarify that the channel layouts are examples, simplify invoice wording and remove nearby repetition. The wallet guide's final Apple state now says “Ready for Apple Pay,” rather than suggesting an invented payment control.
- Align payment-page copy, FAQ, Help and search/social descriptions with the actual approved destination. A read-only browser visit to `https://trolleys.ai` returned HTTP 200 and displayed its marketing/application page. It did not expose merchant sign-in; the visible Replit feedback sign-in is unrelated. The user confirmed there is no separate sign-in URL. Keep the approved root destination and refer to getting started/applying; existing customers follow the access instructions supplied with their account or contact support.
- Update Privacy and Terms to describe the illustrative wallet guide, distinguish it from actual provisioning, and confine financial retry instructions to hosted products. Avoid an absolute analytics claim that cannot be established from source alone; describe the hosting provider's potential technical processing for delivery, security and traffic measurement. Confirmed company/DBA identities and contact addresses remain unchanged.

These are factual and presentation refinements, not claims of proven conversion performance, universal compatibility or legal certification. Useful primary references are [Stripe's payment-link sharing guidance](https://docs.stripe.com/payment-links/share), [Apple's documented payment flow](https://support.apple.com/en-us/102626), [Netlify Web Analytics](https://docs.netlify.com/manage/monitoring/web-analytics/overview/), [Netlify snippet injection](https://docs.netlify.com/build/post-processing/snippet-injection/) and [Netlify's DPA](https://www.netlify.com/pdf/netlify-dpa.pdf).

## Backend and database boundary

The active application remains 51 public source files: six information pages, metadata, a branded 404 and the retirement proxy. There is no local account API, form, authentication adapter, database connection, financial processing or migration runner. The proxy covers 17 retired path families, keeps safe bookmark redirects local, drops sensitive query/resource information and returns 410 for retired APIs and submitted writes. Provider links remain fixed and do not forward query parameters or referrers.

All 71 preserved database-history files—24 migrations, 15 snapshots and 32 schema/configuration files—match both their manifest checksums and the original Git revision `111b703d9793c53d414f6c1ab0ec8985a5e54095`. No database was opened, modified or reset. This confirms archive integrity and runtime separation; it is not an audit or backup of hosted customer records. Independent evidence is in `artifacts/d121-checks/backend-audit.json`.

## Verification

- The complete `pnpm verify` sequence passed: lint, types, 43 unit tests, public architecture, production Next build, 24 desktop/mobile browser cases, 18 accessibility cases, source/dependency security, local Netlify packaging and output inspection. There were no known dependency vulnerabilities.
- Existing Help assertions were aligned with the corrected provider-access wording after the first run identified two stale text expectations; no workflow assertion was removed. Follow-up unit/metadata checks and packaging passed after the search-description refinement.
- Final output inspection covers 11 generated routes, one Next.js server archive with 1,337 entries, 17 retirement-proxy routes and 72 public/static files. No retired database/authentication source or archive is included.
- Responsive review covers the six public pages plus 404 at 320, 390, 680, 681, 768, 959, 960, 1280 and 1440px. It checks shared menus, one header/footer/main structure, heading hierarchy, image loading, horizontal overflow and accessibility. The capture harness was corrected to target the shared header on legal pages and wait for lazy images. Final results contain no layout issue or browser error. A further Payments-only pass verifies the last copy refinement.

Logs and captures: `artifacts/d121-checks/final-verify.log`, `final-package.log`, `release-package.log`, `final-visual.log`, `final-payments.log`, `visual/` and `final-payments/`. The local candidate receipt records the committed source and generated artifact hashes; it is not a deployment receipt.

## Release state and limits

The connector verified the existing Netlify project ID `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, name `etail-depot-next`, team `685ae8f4e6ce519ecf6b267d` and unchanged visitor access. The reported current deployment remains `6aae8c43b7fae63bdf4df26e`; the new candidate has not been published. The CLI's additional settings read was unavailable, and the connector did not expose analytics/snippet settings; no claim of a complete hosted-settings audit is made.

Automatic publication and search indexing remain held. Deployment must use the reviewed candidate and exact existing site; it is separate from search launch. No vendor login, card provision, payment, mailbox delivery, DNS change, hosted database inspection or provider agreement review was performed. Ledgix remains coming soon. Privacy/Terms accurately describe this website's observed behavior and confirmed identities; their review does not establish provider-specific legal obligations or statutory compliance.
