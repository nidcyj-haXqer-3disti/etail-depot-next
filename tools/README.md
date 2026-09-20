# Public website checks

The active application has no database or local account backend. Use the pinned runtime and package scripts in the root README.

- `verify-architecture.mjs`: verifies the public-only source boundary; `--artifacts` also inspects the packaged application.
- `verify-security.mjs`: checks source/configuration security; `pnpm test:security` also audits pinned dependencies.

The D122 search release is authorized only for the recorded production site and four public information pages. Verification must cover its exact site/origin and production environment guard, while preserving noindex for previews, legal pages and retired routes. `ETAIL_SEARCH_CONTEXT` is required in both build and function scopes because Netlify functions do not receive `CONTEXT`; any supplied `CONTEXT` must also be production. Verification and packaging commands do not publish, submit to Google Search Console or prove search indexing. See [the current release record](../docs/RELEASE_READINESS_REVIEW.md).

Local database preparation, seeding, recovery, email impersonation and migration tools were retired from this branch. The complete previous toolset remains at Git commit `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Do not restore or run those tools as part of public-site startup or deployment.

`archive/database/README.md` records preserved database identities and migration checks. It does not contain customer-data exports. No active script should read `.local` account storage, a database URL, Identity credentials or payment credentials.
