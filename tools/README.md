# Public website checks

The active application has no database or local account backend. Use the pinned runtime and package scripts in the root README.

- `verify-architecture.mjs`: verifies the public-only source boundary and exact nine-page allowlist; `--artifacts` also inspects the packaged application. `public-artifact-policy.ts` shares exact page/export paths with packaging; arbitrary guide routes remain rejected.
- `verify-security.mjs`: checks source/configuration security; `pnpm test:security` also audits pinned dependencies.

D228 locally prepares seven search-eligible pages for an eventual approved release: Home, Payment acceptance, Credit card, Help, `/guides/stripe-alternatives`, `/guides/payment-processing-systems` and `/guides/what-is-a-chargeback`. The D122/D215 exact production site/origin and environment guards remain unchanged. Verification must preserve noindex for local/preview responses, legal pages, navigation payloads, errors and retired routes, with empty preview sitemaps. `ETAIL_SEARCH_CONTEXT` is required in both build and function scopes because Netlify functions do not receive `CONTEXT`; any supplied `CONTEXT` must also be production. The enabled, protected platform Emails handler remains the sole server-function exception. Verification and packaging commands do not publish, submit to Google Search Console or prove search indexing. See [current status](../planning/STATUS.md) for actual checks and the deployed release.

Local database preparation, seeding, recovery, email impersonation and migration tools were retired from this branch. The complete previous toolset remains at Git commit `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Do not restore or run those tools as part of public-site startup or deployment.

`archive/database/README.md` records preserved database identities and migration checks. It does not contain customer-data exports. No active script should read `.local` account storage, a database URL, Identity credentials or payment credentials.
