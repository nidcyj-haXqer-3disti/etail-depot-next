# Release preparation status

28 October 2026. Steps 1 to 3 are complete locally. The exact inventory contains 3,725 content pages and 3,723 nonlegal sitemap URLs: 19 core pages, 3,455 ISO 20022 references and 251 independent ISO 8583 implementation references.

Production routing, canonical metadata, crawlable navigation and sitemap use the same frozen inventory. Preview responses remain noindex with an empty sitemap. Privacy, Terms, payloads and errors remain noindex in production. Twenty retired articles return 410; unsupported guide and edition routes return 404.

## Verification

The final source fingerprint is `5dc5d178c503e615aed9b6471051d9a7ecb15bcb68e536d9ddffd71754091893`. Active source, clean candidate and production package match. The active local build remains a preview; the separate package uses the exact production context.

`pnpm verify:public` passed: lint, types, 332 unit tests, architecture, build, 166 desktop/mobile browser scenarios, 75 accessibility scenarios and source security. Dependency audit reported no known vulnerabilities. One existing desktop wallet hydration scenario remains skipped; its mobile counterpart passed.

`pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package` passed. The final packaged export also passed a separate rendered check of all 3,723 production URLs and negative deployment contexts. All eligible pages are reachable from Home through initial HTML links. Static review found no errors across 8,019 internal destinations and 45 unique assets. Package verification inspected 18,696 static files, one public Edge boundary and only the protected platform Emails handler.

## Corrections and limits

Initial checks exposed obsolete unit expectations for the old local only scope, five page sitemap count and previous Guides revision date. Corrected expectations retain the production context and negative route checks. Complete diff review removed trailing whitespace in two source files. Offline installation lacked the pinned Next.js tarball; a frozen installation from the registry passed without changing the lockfile. All final checks were rerun on the final active source; the separate package matches it.

Independent 8583 source and licence hashes are enforced. The old reproduced tables remain excluded, and no ISO republication permission is claimed. The source basis is documented in tools/reference-release.json and public/licenses.

The local clean source bundle excludes 108 private research files. The feature branch base tree matches GitHub main at `814626423c73f3c358d68e6a52643e384c20f2e5`. A separate temporary index prepares the full review patch without changing the working index or creating a commit.

No push, merge, deployment, email, DNS or remote setting change occurred. GitHub PR review and CI, publication authorization, runtime configuration read back and actual hosted response/compression/cache checks remain release steps. Local success is not an indexing or ranking guarantee.

Private evidence: control workspace artifacts/release-preparation-20261028/review.html, completion.json, complete-candidate.patch, candidate-source-manifest.json and check logs. Local preview: http://127.0.0.1:3226/.
