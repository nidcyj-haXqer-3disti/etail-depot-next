# Reviewed Netlify publication

The only target is `etail-depot-next`, site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, canonical origin `https://etaildepot.com`. Repository identity is `nidcyj-haXqer-3disti/etail-depot-next`, ID `1361184741`. Confirm these against [project-targets.json](../project-targets.json) immediately before any remote change.

## Candidate and authorization

[CURRENT_WORK_CONTEXT.md](CURRENT_WORK_CONTEXT.md) records current release state. Earlier dated approvals do not authorize a new candidate. Preparation, a passing local package and a PR merge are not deployment authorization. Before a batch push, read its open items and give the operator any reminders explicitly requested for the next release. A deferred feature is not automatically a blocker for unrelated changes.

Use the pinned runtime and frozen lockfile. Run `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package` against the exact candidate. [tools/reference-release.json](../tools/reference-release.json) records the approved counts, reference licences and legal-source hashes. The ten merchant legal routes and two website policy pages remain noindex and outside the sitemap. Publishing general terms does not establish merchant acceptance or provider approval.

Keep excluded reproduced ISO tables, original account captures, credentials and private research out of source publication and packaging. Source, export and package fingerprints must match the reviewed candidate. The only static publish directory is `.netlify/static/`, generated from `out/`; never publish the repository root.

## Production context

`APP_ENV=production`, `ETAIL_SEARCH_CONTEXT=production` and `ETAIL_PUBLIC_ORIGIN=https://etaildepot.com` must exist in build and function scopes. `SITE_ID` must identify the bound project. The deploy context must be production; where runtime `CONTEXT` is absent, the existing guard requires the other exact markers. TOML provides build values only. Verify the needed nonsecret settings without exposing unrelated secrets or copying production markers into local environment files.

## Manual publication sequence

1. Review the exact feature diff, source manifest, passing checks and licence notices.
2. Confirm applicable authorization covers this candidate's publication.
3. Use the [GitHub review procedure](GITHUB_DELIVERY.md). Bind passing CI and the merge to the exact reviewed source. No force push or protection bypass.
4. Use the bound site's reviewed Git build and manual **Trigger deploy**, so the enabled Emails plugin and final `onPostBuild` verifier run. Preserve `build.ignore = "exit 0"`. Do not add unattended hooks or use a static-only upload.
5. Record deploy ID, exact commit, build result and read-back status. Verify hosted pages, sitemap, canonicals, security headers, mobile behavior, compression, cache and retirement responses. Use the separate hosted health and boundary checks below; the boundary check confirms both release manifests remain unavailable. Do not submit merchant accounts or payments as a deployment check.

Stop if identity, source, checks or authorization differ. Keep the enabled Netlify Emails extension and all its settings. Only its pinned authenticated POST handler is allowed. Preserve databases, Identity, DNS, email, denied projects and provider resources. A website rollback does not restore a retired backend or alter financial records.

## Hosted verification and Netlify error reporting

After confirming the published deploy ID and commit in Netlify, run the shared checker from that source revision:

```sh
pnpm verify:hosted --deploy <Netlify-deploy-ID>
pnpm verify:hosted --boundaries --deploy <Netlify-deploy-ID>
```

The default **health** run requests the registered core pages, robots.txt and sitemap.xml. It expects HTTP 200 and the site's security headers. Any unexpected status, header, timeout or response failure fails the run. These checks do not replace content, sitemap membership, assets, compression/cache, desktop/mobile or booking verification.

The separate **boundary** run makes only five GET requests: two representative retired URLs expecting 410, both release manifests expecting 404, and one internal document expecting 404. Expected security, noindex and applicable no-store headers must also match. An exposed private file returning 200, a different error code or a redirect is a failure. Do not repeat the exhaustive alias/retirement matrix against production; the unit and production-SEO suites already cover it locally. Run the small hosted boundary check once per release, repeating only when investigating a failure.

Each mode uses its own User-Agent containing a unique run ID. Private receipts in `.local/hosted-verification/` record the operator-supplied deploy ID, local commit/dirty state, UTC run/request windows, Netlify request IDs, actual status counts, expected boundary responses and unexpected failures. The deploy ID is an attribution label, not an authenticated remote identity check. Confirm it before running. Interrupted runs remain incomplete and fail; response bodies, cookies and credentials are not retained. Commands are GET-only, use the bound canonical origin, do not follow redirects and do not retry automatically. They are manual hosted checks, not part of CI or the four local release gates.

Netlify's raw traffic totals still include these requests. Its Observability Errors percentage groups Client Error and Server Error responses; Not Found is displayed separately in the dashboard reviewed on 15 November 2026. An expected 410 can therefore raise that percentage even when the test passes. This tool does not change Netlify filters, security settings or HTTP behavior.

When investigating an error percentage, record the dashboard time window, filter by the exact receipt User-Agent and compare each path/status with the planned assertion. Report **expected boundary responses**, **unexpected verification failures** and **other traffic errors** separately. Never exclude all 4xx, all verifier traffic or all traffic during the test window. A verifier receiving an unexpected 500 still indicates a real problem. Inspect remaining failures by status and URL before attributing them to visitors, bots or tests.

Classify the remaining requests after matching test receipts:

| Request group | Treatment |
| --- | --- |
| Current pages, their assets and visitor links | Investigate unexpected 4xx/5xx, broken destinations and reproducible loading failures as website problems. |
| Known removed pages and retired endpoints | Report separately. Keep 404/410 when there is no equivalent current page. Add an exact redirect only after comparing the old content and destination. |
| Unknown paths, unsupported methods and optional discovery files | Report separately as unmatched requests. Do not assume they are all bots or turn them into successful homepage responses. |
| Client cancellations, including 499 | Report separately and look for repeatable visitor impact. A cancellation alone does not establish a server failure or prove harmless navigation. |

For a replacement, check the exact HTML aliases, old section bookmarks, final page status, canonical and indexing policy. Do not redirect submissions, read or forward their bodies, retain old query parameters, or send obsolete application payloads to an HTML page. Repair stale internal links at their source. Keep removed URLs out of current navigation and the sitemap. No-index destinations remain noindex until separately approved.

Every release summary must state the healthy-check result, expected 404/410 counts and UTC window, unexpected failures, and remaining hosted checks. Tell the operator when deliberate boundary probes affect the aggregate metric; do not report it as a percentage of visitors experiencing failure. Preserve real 404/410 responses instead of returning 200 to improve a dashboard number.
