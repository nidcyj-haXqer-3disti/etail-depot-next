# Current public website scope

The 28 October 2026 decision authorizes preparation steps 1 to 3: production routing, canonical sitemap alignment and a clean release candidate. No push, merge or deployment has been performed or authorized in this preparation.

The candidate contains 3,725 content URLs: 19 core pages, 3,455 ISO 20022 references and 251 independent ISO 8583 implementation references. Exactly 3,723 nonlegal URLs can enter the sitemap under the recorded production site, origin and environment guard. Privacy, Terms, preview responses, navigation payloads and error responses remain noindex.

`src/shared/public-page-inventory.ts` and `src/shared/standard-reference-paths.ts` are the exact reviewed inventory. No wildcard opens an entire collection. Unsupported editions, old articles and private data stay excluded. Twenty previously published articles return 410; other unapproved guide URLs return 404.

The independent 8583 collection uses original explanations and pinned MIT and Apache 2.0 contributions. The previous reproduced tables are absent; their ISO republication permission is not claimed. Source identities, conflicts, limits and licence notices must remain. `tools/reference-release.json` records the frozen source and notice hashes.

The application remains a static public website. Merchant access goes to the fixed https://trolleys.ai entrance without submitted data or referrer forwarding. Card applications are not open. There is no local account, API, database, money processing or provider integration. The existing protected Netlify Emails handler is the sole server function exception and stays enabled.

Use the pinned Node and pnpm versions and one lockfile. Current verification results belong in `planning/STATUS.md`. Dated work and earlier page counts are historical, not active scope.
