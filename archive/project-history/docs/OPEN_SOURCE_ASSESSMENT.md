# GitHub reuse assessment — Etail Depot Next

Reviewed: 8 September 2026. Scope: public upstream repositories, documentation, selected source files, licenses and release notes. This is a selection recommendation; no dependency has been installed or approved by a runtime/security audit.

## Recommendation

Build the new application on a small Next.js foundation with established libraries. None of the complete applications reviewed offers enough matching functionality to justify adopting its account, authentication and financial model under the current brief.

The strongest reuse is framework plumbing, typed PostgreSQL access, validation, UI components and decimal arithmetic. Etail still owns the account relationships, server policy, saved card request, provider operations, ledger postings and membership economics. This conclusion follows from the differences below; it is not a claim that a commerce platform cannot be extended.

Suggested baseline: Next.js/React, the required Netlify SDKs, Drizzle subject to a transaction compatibility check, Zod, and selected shadcn/ui components. Use decimal.js for server-side rates and modeled costs after defining precision and rounding. Keep pg-boss conditional until its worker and migration behavior is proven in the intended runtime.

## Complete applications and starters

| Project | Reusable value | Fit and decision |
|---|---|---|
| [Medusa](https://github.com/medusajs/medusa) | TypeScript commerce modules, provider integration, payment/order workflows and integration-test patterns. | **Reference only; high adaptation cost.** Standard deployment adds Redis and server/worker processes. It brings its own framework, auth, workflows and migrations. Catalog/order functions cover relatively little of Etail's issuing, Household responsibility and financial ledger. [Deployment requirements](https://docs.medusajs.com/learn/deployment/general). |
| [Vendure](https://github.com/vendurehq/vendure) | Payments, extensible order states, merchant administration and multi-channel examples. | **Reference only; high adaptation cost.** Its NestJS/GraphQL backend and worker introduce another application model. A channel does not establish Household privacy, sponsorship or spending responsibility. [Deployment](https://docs.vendure.io/current/core/deployment/using-docker), [workers](https://docs.vendure.io/current/core/developer-guide/worker-job-queue). |
| [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) | Compact Next.js/PostgreSQL/Drizzle/shadcn layouts and form examples. | **Do not fork as the foundation.** Custom password/JWT auth and Stripe subscriptions would need replacement. Its account queries select the first matching team, conflicting with explicit validated account selection. The inspected manifest uses a Next.js canary and lacks lint/typecheck/test scripts. [Queries](https://github.com/nextjs/saas-starter/blob/e0dc5d40ce26c01672557912b533d25e32957ad4/lib/db/queries.ts), [manifest](https://github.com/nextjs/saas-starter/blob/e0dc5d40ce26c01672557912b533d25e32957ad4/package.json). |
| [Netlify Next Platform Starter](https://github.com/netlify-templates/next-platform-starter) | Examples of Next.js with Netlify primitives. | **Documentation reference; do not copy wholesale.** It uses JavaScript, an npm lockfile and demonstration dependencies; the inspected manifest still invokes removed `next lint`. GitHub metadata reports no detected license and the root listing has no license file. Resolve licensing before source reuse. Fresh framework scaffolding avoids importing these gaps. [Inspected manifest](https://github.com/netlify-templates/next-platform-starter/blob/e80d7c706f6a244b6929a774776c17a8afcbe336/package.json), [Next.js removal](https://nextjs.org/docs/app/guides/upgrading/version-16#next-lint-command). |

Medusa and Vendure are substantial commerce systems. Their strongest ready-made features are products, carts, inventory, orders and fulfillment. The current Etail brief centers on financial access and liabilities. Adopting either would move considerable effort into adapting or replacing core abstractions. Revisit them if a conventional storefront/catalog becomes a major requirement and the architecture is explicitly reconsidered.

## Ledger and durable processing

| Project | Reusable value | Fit and decision |
|---|---|---|
| [Formance Ledger](https://github.com/formancehq/ledger) | Multi-posting transactions, financial history, corrections, idempotency and locking/test design. | **Study design and test cases.** It is a separate Go service backed by PostgreSQL; production support is described through its Kubernetes operator. Its internal SQL transaction does not encompass Etail's application state and outbox. Adopting it would require a service-boundary redesign. [Concepts](https://docs.formance.com/getting-started/concepts), [idempotency](https://docs.formance.com/modules/ledger/working-with/idempotency). |
| [TigerBeetle](https://github.com/tigerbeetle/tigerbeetle) | Integer transfers, immutable history, stable transfer IDs, linked operations and fault simulation. | **Study; defer adoption.** It is a separate financial database designed to work alongside an application database. This introduces cross-store coordination. Application access control remains our responsibility. [Architecture](https://docs.tigerbeetle.com/coding/system-architecture/), [safety](https://docs.tigerbeetle.com/concepts/safety/), [reliable submission](https://docs.tigerbeetle.com/coding/reliable-transaction-submission/). |
| [Medici](https://github.com/flash-oss/medici) | A TypeScript double-entry book/journal API. | **Reject for this stack.** MongoDB/Mongoose storage and JavaScript-number bounds do not match PostgreSQL bigint money and shared SQL transactions. Replacing these foundations removes much of the reuse benefit. [README](https://github.com/flash-oss/medici), [manifest](https://github.com/flash-oss/medici/blob/master/package.json). |
| [pg-boss](https://github.com/timgit/pg-boss) | PostgreSQL jobs, retries and enqueueing within an existing database transaction. | **Conditional candidate for durable jobs, not ledger or financial limits.** Avoid permanent polling in request functions. Prove bounded fetch/process/complete/fail execution, recovery, connection cleanup and deployment-controlled migrations. [Workers](https://pgboss.io/api/workers), [constructor options](https://github.com/timgit/pg-boss/blob/master/docs/api/constructor.md). |

Queue delivery guarantees and ledger transaction IDs do not replace application business-effect uniqueness. A worker can call a provider, crash before recording acknowledgement, and retry. Etail must reuse the saved operation identity and reconcile uncertain results. Limits and the Premier cap must be enforced by the domain transaction, never by queue concurrency settings.

Useful upstream ideas to bring into Etail tests include Formance's locking of initially absent balance records and TigerBeetle's fault/replay scenarios. Upstream tests were inspected as evidence of engineering practices, not executed or counted as Etail acceptance. [Formance contribution/testing guide](https://github.com/formancehq/ledger/blob/main/CONTRIBUTING.md), [TigerBeetle safety testing](https://docs.tigerbeetle.com/concepts/safety/).

## Recommended supporting components

| Component | Recommendation | Integration boundary |
|---|---|---|
| [Next.js](https://github.com/vercel/next.js) | **Use the required framework with a fresh TypeScript scaffold.** | Resolve a supported runtime and actual package versions, then commit one pnpm lockfile. Implement real lint/build/test commands; a template's scripts are not evidence. |
| [Netlify Database SDK](https://github.com/netlify/primitives/tree/main/packages/database/prod) | **Use as required by the brief.** | Keep one PostgreSQL transaction context for related domain writes. The API exposes a pool for same-connection transactions. [API](https://docs.netlify.com/build/data-and-storage/netlify-database/api/). |
| [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) | **Preferred, conditional on the compatibility check below.** | Typed schema/SQL and migration generation; Netlify remains the sole hosted migration executor. Explicit bigint mapping, row locking and transaction propagation need tests. |
| [Netlify Identity SDK](https://github.com/netlify/primitives/tree/main/packages/identity/prod) | **Use the required supported SDK behind the Identity adapter.** | Select one session owner and verify it in the actual Next/Netlify runtime. SDK identity and metadata do not confer Etail account permissions. |
| [Zod](https://github.com/colinhacks/zod) | **Use for executable input/event schemas.** | Wire money remains validated strings; server commands enforce policy. JSON Schema generation can support final contracts, but does not itself implement the entire OpenAPI specification. Ordinary parsing is sufficient initially. |
| [shadcn/ui](https://github.com/shadcn-ui/ui) | **Use selected, reviewed components.** | Retain source provenance and license notices. Components become our code to maintain. Test accessible names, keyboard behavior, errors and mobile composition; preserve one CardRequestForm. [Component model](https://ui.shadcn.com/docs). |
| [decimal.js](https://github.com/MikeMcl/decimal.js) | **Use conditionally for server-side rates and modeled costs.** | All calculations round to configured significant-digit precision. Define bounded inputs, a dedicated constructor and explicit rounding rules; use decimal strings. Posted journals remain bigint minor units. |

## Findings that change the first implementation task

1. **Prove the database adapter before committing financial code to it.** Netlify's guide currently recommends Drizzle's `beta` tag, while Drizzle's own Netlify guide uses `rc`. The inspected `v1.0.0-rc.4` adapter uses different ordinary-query and transaction paths, with pooled WebSocket transactions in serverless mode and node-postgres in server mode. It implements transactions; compatibility still needs execution. Verify local/hosted bigint and decimal decoding, rollback, row locks, deadlock/serialization recovery and cleanup on connection failures. Pin the tested ORM/Kit pair, not a floating tag. [Netlify guide](https://docs.netlify.com/build/data-and-storage/netlify-database/tooling/), [Drizzle guide](https://orm.drizzle.team/docs/connect-netlify-db), [driver](https://github.com/drizzle-team/drizzle-orm/blob/v1.0.0-rc.4/drizzle-orm/src/netlify-db/driver.ts), [session implementation](https://github.com/drizzle-team/drizzle-orm/blob/v1.0.0-rc.4/drizzle-orm/src/netlify-db/session.ts).

2. **Verify the SDK integration against our security contract.** The Identity README documents JWT-claim fallback, browser session hydration and an origin helper whose default compares the request's own origin. Etail needs its trusted configured canonical origin, verified identity, revocation behavior and server-secret rules. Use explicit trusted origin configuration and test the selected session design; do not copy the browser quick start as the full auth system. The bundled skill and current README also disagree on local `netlify dev` support, so local hosted-auth capability remains unverified. [Identity README](https://github.com/netlify/primitives/blob/main/packages/identity/prod/README.md), [project security contract](SECURITY_AND_IDENTITY.md).

3. **Do not introduce pg-boss by default.** Its startup can run migrations, maintenance and scheduling; `work()` polls continuously. It needs an explicit bounded worker design and reviewed schema operations under the single migration authority. Disable runtime migrations if selected. The optional dashboard is unnecessary; its September release fixes browser exposure of connection strings. [Operations](https://github.com/timgit/pg-boss/blob/master/docs/api/ops.md), [dashboard release](https://github.com/timgit/pg-boss/releases/tag/dashboard-1.7.0).

4. **Separate early protected Identity setup from M7 public release.** EDN-004 requires new Identity in M0; EDN-029 creates its site in M7 and depends on EDN-004. Propose moving only the necessary protected site/Identity prerequisite earlier while retaining database/release acceptance at the appropriate dependencies. No provisioning order or release approval has been silently changed. Guarded local/CI Identity work can proceed while hosted setup is unresolved. [Backlog](../planning/backlog.json).

## License and maintenance snapshot

These are observed upstream versions/revisions, not installed versions or dependency pins. Default branches and registry tags can change independently. A recent release or a clean advisory page does not prove safety. License identifiers below describe the inspected upstream materials; dependency notices and the exact package contents still need review during installation.

| Project | Observed snapshot | License evidence |
|---|---|---|
| Next.js | [v16.3.4](https://github.com/vercel/next.js/releases/tag/v16.3.4), 31 Aug 2026; latest stable endpoint | [MIT](https://github.com/vercel/next.js/blob/canary/license.md) |
| Netlify Platform Starter | [`e80d7c7`](https://github.com/netlify-templates/next-platform-starter/commit/e80d7c706f6a244b6929a774776c17a8afcbe336), 8 Sep 2026 | No license detected in [metadata](https://api.github.com/repos/netlify-templates/next-platform-starter); no root license file observed. Source reuse unresolved. |
| Drizzle | [v1.0.0-rc.4](https://github.com/drizzle-team/drizzle-orm/releases/tag/v1.0.0-rc.4), 27 Jun 2026; prerelease | [Apache-2.0](https://github.com/drizzle-team/drizzle-orm/blob/main/LICENSE) |
| Netlify SDKs | Source manifests: Database 2.0.1; Identity 2.0.0; both require Node >=22.12.0 | MIT declared by [database](https://github.com/netlify/primitives/blob/main/packages/database/prod/package.json) and [Identity](https://github.com/netlify/primitives/blob/main/packages/identity/prod/package.json) manifests; packaged license contents not inspected. |
| Medusa | [v2.20.1](https://github.com/medusajs/medusa/releases/tag/v2.20.1), 3 Sep 2026; `0ed927b` | [MIT with Enterprise exclusions](https://github.com/medusajs/medusa/blob/develop/LICENSE). [Enterprise terms](https://github.com/medusajs/medusa/blob/develop/ENTERPRISE-LICENSE.md) cover listed RBAC/policy and OIDC materials; do not assume unrestricted MIT reuse of its permission engine. |
| Vendure | [v3.7.3](https://github.com/vendurehq/vendure/releases/tag/v3.7.3), 2 Sep 2026; `2cc309d` | [GPLv3 or commercial, with plugin exception](https://github.com/vendurehq/vendure/blob/master/LICENSE.md). Review the actual integration before source adoption. |
| Next.js SaaS Starter | [`e0dc5d4`](https://github.com/nextjs/saas-starter/commit/e0dc5d40ce26c01672557912b533d25e32957ad4), 18 Jun 2025; manifest uses 15.6.0-canary.59 | [MIT](https://github.com/nextjs/saas-starter/blob/main/LICENSE) |
| Formance | [v2.4.12](https://github.com/formancehq/ledger/releases/tag/v2.4.12), 24 Jul 2026; `f43a707` | [MIT](https://github.com/formancehq/ledger/blob/main/LICENSE) |
| TigerBeetle | [0.17.9](https://github.com/tigerbeetle/tigerbeetle/releases/tag/0.17.9), 6 Jul 2026; `cc1c06a` | [Apache-2.0](https://github.com/tigerbeetle/tigerbeetle/blob/main/LICENSE) |
| Medici | GitHub release v7.2.0; inspected master manifest 7.3.0; not equivalent publication evidence | [MIT](https://github.com/flash-oss/medici/blob/master/LICENSE) |
| pg-boss | [12.30.0](https://github.com/timgit/pg-boss/releases/tag/12.30.0), 3 Sep 2026; `180a54b` | [MIT](https://github.com/timgit/pg-boss/blob/master/LICENSE) |
| shadcn/ui | [CLI 4.21.0](https://github.com/shadcn-ui/ui/releases/tag/shadcn%404.21.0), 4 Sep 2026; `7c9eaba` | [MIT](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md); CLI version does not version all generated components. |
| Zod | [v4.5.4](https://github.com/colinhacks/zod/releases/tag/v4.5.4), 29 Aug 2026; `e8e206f` | [MIT](https://github.com/colinhacks/zod/blob/main/LICENSE) |
| decimal.js | [v10.6.0](https://github.com/MikeMcl/decimal.js/tree/v10.6.0), 6 Jul 2025; `1a6e845` | [MIT](https://github.com/MikeMcl/decimal.js/blob/master/LICENCE.md) |

Security review found relevant upstream release fixes: Medusa field restrictions, Vendure cross-channel payment access and authentication issues, and the pg-boss dashboard connection-string exposure noted above. These are reasons to read release notes and add relevant regression cases, not evidence that current candidate versions remain affected. No full dependency audit, exploit verification or current upstream CI-run verification was performed.

## Concrete next deliverable

M0 should produce a fresh repository/bootstrap, exact resolved versions and a small executable compatibility proof, followed by the first M1 account/access slice. The database proof should run against real PostgreSQL and ultimately the protected new Netlify runtime:

- Commit and roll back account/domain state plus an outbox record in the same transaction.
- Round-trip bigint values above JavaScript's safe-integer boundary without conversion to number.
- Overlap two separate transactions contending for the same row; prove shared limits cannot both approve beyond backing.
- Test transaction failure and retry with the same business identity.
- Verify one migration authority; if pg-boss is considered, prove controlled schema setup and bounded job recovery separately.
- Verify Identity/session/canonical-origin behavior, then sign in, explicitly select an authorized account and deny cross-account/revoked access through the UI and API.

Monetary rounding, membership-year boundaries, reward attribution and Household funding choices remain D14–D17 in the decision register. No library settles those product choices. The review does not complete M0, implement any of the 72 application acceptance cases, or authorize public release.

## Evidence and scope

Before documentation edits, `PYTHONDONTWRITEBYTECODE=1 python3 tools/verify_handoff.py` exited 0: 62 manifest files, 32 tasks, 72 planned acceptance cases, two workbooks/21 sheets and 17 arithmetic assertions passed. The 35 existing helper tests also passed. Original source materials were preserved.

After edits, `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_handoff_tools.py' -v` exited 0 with 35 passing tests. An inline Python integrity/link check exited 0: the only original-manifest differences were `docs/DECISIONS.md` and `planning/STATUS.md`, all original source hashes were unchanged, and local links in the three changed documents resolved. Environment: local macOS/Darwin 25.6.0, Python 3.9.6. The supplied setup recommends Python 3.10+; these results record the actual interpreter used rather than asserting conformance to that recommendation. No application runtime or PostgreSQL test ran.

Only this report, the decision register and implementation status are changed by the assessment. The original package manifest is intentionally retained; its hashes for the two edited distributed documents will differ. No source code was copied from upstream, no package installed, no application test claimed, and no GitHub/Netlify resource created or changed. The checkout still has no Git branch or commit. Read-only public repository access was used; excluded Etail projects and databases were not accessed.
