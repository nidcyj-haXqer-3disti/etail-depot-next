# Reviewed Netlify publication

The only target is etail-depot-next, site cbbb6c24-9dbc-43a2-9234-e4357b5b5280, canonical origin https://etaildepot.com. Repository identity is nidcyj-haXqer-3disti/etail-depot-next, ID 1361184741. Confirm these against project-targets.json immediately before any remote change.

## Candidate checks

Use the pinned runtime and frozen lockfile. Run pnpm verify:public, pnpm test:seo:production, pnpm package:netlify and pnpm verify:package against the exact candidate. The reviewed local PayFac candidate contains 3,738 content pages and 3,736 nonlegal sitemap URLs. The previously published baseline contains 3,725 content pages and 3,723 nonlegal sitemap URLs; the thirteen new commercial pages are not live until a separately authorized release. Reference data, notices, output bytes and source fingerprints must match the candidate receipt in tools/reference-release.json. Exclude private research and the old reproduced ISO 8583 tables.

APP_ENV=production, ETAIL_SEARCH_CONTEXT=production and ETAIL_PUBLIC_ORIGIN=https://etaildepot.com must exist in build and function scopes. SITE_ID must identify the bound project and deploy context must be production. TOML only supplies build values. Verify the necessary nonsecret runtime settings before publication; do not expose secrets or copy production markers into local environment files.

## Publication sequence

1. Review the exact feature branch diff, source manifest, passing checks and licence notices.
2. Verify that user authorization covers publication of this candidate. Local preparation is not deployment authorization.
3. Use the repository PR, check and review workflow. Bind passing CI to the exact source. Do not force push, bypass protections or silently merge into main.
4. Use the bound site's reviewed Git build and manual Trigger deploy so the enabled Emails plugin and final onPostBuild verifier run. Keep build.ignore = exit 0 and do not add unattended hooks. Do not use static only uploads.
5. Record deploy ID, exact commit, build result and read back status. Check actual hosted pages, sitemap, canonicals, security headers, mobile interactions, compression, cache and retirement responses. Do not submit accounts, payments or provider actions.

Stop if identity, source, checks or authorization do not match. Keep the enabled Netlify Emails extension and all settings. Its pinned authenticated POST handler is the only server function exception. Preserve databases, Identity records, DNS, email, excluded projects and all provider resources. A website rollback cannot restore a retired backend or alter financial data.
