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
5. Record deploy ID, exact commit, build result and read-back status. Verify hosted pages, sitemap, canonicals, security headers, mobile behavior, compression, cache and retirement responses. Confirm `/tools/reference-release.json` and `/reference-release.json` return 404. Do not submit merchant accounts or payments as a deployment check.

Stop if identity, source, checks or authorization differ. Keep the enabled Netlify Emails extension and all its settings. Only its pinned authenticated POST handler is allowed. Preserve databases, Identity, DNS, email, denied projects and provider resources. A website rollback does not restore a retired backend or alter financial records.
