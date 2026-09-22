# Public website Netlify deployment runbook

D139 maintainer refresh · 21 September 2026

D108 public-only scope governs this runbook. The repository and site already exist; there is no provisioning, database migration, Identity setup, account acceptance or financial activation step. Read [source precedence](SOURCE_PRECEDENCE.md), [current status](../planning/STATUS.md) and [release evidence](RELEASE_READINESS_REVIEW.md) before preparing a release.

**Recorded release state:** D152 / PR #33 is published, Netlify deploy `6ab146f61a7d282bab60350e`. Exact-source CI, clean packaging and hosted desktop/mobile/SEO checks passed; ready/current status was re-read after acceptance. See current status for the release evidence and limitations.

## Existing target and preserved boundaries

[project-targets.json](../project-targets.json) is authoritative. Before any authorized remote mutation, verify the actual resource identity against these bindings:

| Resource | Exact binding |
| --- | --- |
| GitHub repository | `nidcyj-haXqer-3disti/etail-depot-next` |
| Repository ID | `1361184741` |
| Netlify site | `etail-depot-next` |
| Site ID | `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` |
| Team ID | `685ae8f4e6ce519ecf6b267d` |
| Public origin | `https://etail-depot-next.netlify.app` |

Never provision replacements or modify the excluded repositories/sites/domains, including the older Etail projects and `etaildepot.com` / `www.etaildepot.com`. Preserve existing databases, Identity records, visitor access, DNS and provider configuration. Do not change plans, purchase services, expose credentials or remove the denied-resource list.

Trolleys links remain exactly `https://trolleys.ai`, without forwarded input or referrers. Ledgix cards remain coming soon with inquiries at `ledgix@etaildepot.com`. The optional Order Insight marketing demonstration does not create a vendor connection or authorize enrollment/testing against a vendor account.

## Local build and review gates

Use Node **24.19.0**, pnpm **11.19.0**, the existing lockfile and `@netlify/plugin-nextjs` **5.15.13**. The configured build command is `pnpm build`, publish directory `.next`, and the adapter generates the application server and retirement proxy. Do not add custom functions, archived APIs or `netlify/database` paths.

With ports 3100 and 3101 free, run:

```sh
pnpm install --frozen-lockfile
pnpm verify:public
pnpm test:seo:production
pnpm package:netlify
pnpm verify:package
```

`pnpm verify` runs the four verification/package commands in order. `package:netlify` binds `NETLIFY_SITE_ID` to the recorded site and invokes the local offline production-context build. It does not deploy. Never substitute old `.next` or `.netlify` output for the source under review.

Package inspection requires the reviewed public routes, one generated Next.js server handler and the 17 retirement-proxy route families. It checks server ZIP entry names, traces, static files and edge manifests for private or archived inputs. Confirm the exact source/commit/tree and record checks, failures, reruns and remaining limitations. Database records and archived migrations are not build inputs and must not be touched.

## Production search configuration

D122 authorizes indexing only `/`, `/payment-services`, `/card-services` and `/help` at the bound production origin. Legal pages, 404, retired routes and local/preview environments remain noindex. Actual search indexing and ranking are not established by a successful build or deployment.

The existing guard requires the recorded approval, exact site/origin, `NODE_ENV=production`, `APP_ENV=production`, `ETAIL_SEARCH_CONTEXT=production`, matching `SITE_ID` and `ETAIL_PUBLIC_ORIGIN`. Any supplied Netlify `CONTEXT` must be `production`; it is absent in Functions. The custom production markers must therefore apply to both builds and functions. `netlify.toml` configures build values; it does not supply function-runtime environment settings. Inspect only necessary nonsecret release settings during an authorized release review and preserve the preview guard. Do not copy production markers into local environment files or expose server secrets through client variables.

## Reviewed manual publication

Automatic publication remains held by the existing `build.ignore` setting. Build hooks can bypass that setting; do not add unattended hooks or a deployment step to the read-only CI workflow.

1. Complete the local candidate and review its exact diff, test results and package boundaries on a feature branch. Prepare a reviewable result before any permission request.
2. Confirm the user's recorded authorization covers this candidate's publication. Use authorization already granted; the runbook and passing checks do not themselves grant it. If authorization is absent, finish preparation and request it before the remote publication step.
3. Follow the repository PR/check/review workflow, bind passing CI to the exact candidate and merge only within the applicable approval. Do not force-push, bypass protections or silently merge feature work into main.
4. Manually publish a fresh source-only extraction of the reviewed commit to the existing bound Netlify site using the authorized release mechanism. Keep the build-validation directory separate: the current upload helper does not ignore `.next`, so a previously built source directory is not suitable for upload. Verify every archived source hash and exclude generated files, dependency directories and environment files before starting the helper. Verify the repository/site identities immediately before mutation and preserve source identity between the reviewed, CI-tested and published revisions. Preserve visitor access and environment scope; do not add database or provider operations.
5. Record the deployment ID, source identity, build outcome and read-back status. Verify public pages, search metadata, links, security headers, responsive interactions and retired-route responses. Public acceptance checks must not create accounts, transmit payment details, send messages or submit vendor actions. Link success does not prove a hosted financial workflow.

Stop if identity, source, checks or authorization do not match. A failed release is not permission to use an excluded site, create replacement resources, change access/DNS or restore the retired backend. Any rollback must follow the authorized site-release workflow and preserve database/provider resources; no database restoration is part of a public-site rollback.

## Historical deployment archive

The text below predates the D108 public-only application. Its provisioning, database, Identity, secret creation, simulated money and authenticated acceptance steps are retired. Preserve it as historical context only; use the current instructions above for this website.

<details>
<summary>Retired application deployment brief — historical text</summary>

````markdown
# New-project Netlify deployment runbook

> **Historical provisioning/model descriptions; retained release safeguards.** Follow [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) for the current model and existing owned deployment. References below to an unreserved slug, new provisioning, three account types or unimplemented hosting describe earlier stages; do not reprovision or attach another project from those instructions.
>
> Exact target isolation, secrets handling, authentication/CSRF, security and financial checks, release approvals and commercial obligations remain required. This notice does not authorize a deployment, access change, purchase or DNS change. A historical release script is not evidence of a current successful hosted journey.

**Target: a NEW sandbox only.** Nothing in this file authorizes use of an existing Etail Depot site, database, Identity configuration or DNS. Proposed slug `etail-depot-next` is unreserved.

## A. Verify and provision

Read `project-targets.json`. Inspect the authenticated Netlify account/team using authorized tools. Verify the proposed slug is available and report the existing-plan capability/billing implications; do not upgrade or accept a new paid commitment without approval. Netlify Database is managed PostgreSQL with plan eligibility and usage billing; recheck current terms before creating it. [N1]

Create a new Netlify project and immediately record its stable site ID, slug and team in a secret-free local provisioning receipt. Confirm none match denied targets. Bind those IDs in `project-targets.json` under the existing schema before any environment/site updates; do not remove the denied-resource list. Run `python3 tools/check_target.py netlify --id NEW_ID --name etail-depot-next` after binding. This helper checks the local binding; it does not replace reading remote resource metadata.

Link **only** the new private GitHub repository. Prefer native continuous deployment rather than injecting a broad Netlify token into every PR workflow. The GitHub connector used by Codex and Netlify's GitHub App need separate repository permissions. Do not disable branch protection or use admin bypass to resolve an integration issue.

## B. Build and framework settings

Use current supported Next.js detection/OpenNext integration. Base directory is repository root for the proposed single-app layout. Build command is the implemented `pnpm build`; publish `.next`; functions `netlify/functions`; pin the verified Node runtime/package manager. `templates/netlify.toml.example` is a template, not an already configured build. Verify current Netlify guidance and actually execute Next and Netlify builds. [N3]

Do not add a legacy Next adapter plugin from an older project or use a static export that discards the API. The provider adapter package named in deployed functions may be automatically generated by Netlify; that is different from manually pinning an obsolete integration in application configuration.

## C. New database and schema

Include the actual `@netlify/database` dependency. Netlify can provision a database as part of deploy; create it only for the new site. Apply fresh ordered SQL migrations from `netlify/database/migrations/`, inspect the applied-migration records, and verify the expected schema. One migration runner only. [N1,N2]

Public request handlers must not run seeds or migrations. Catalog/rate imports are idempotent and source-hashed. Local/CI seeds use fictional accounts; hosted signup creates only the verified new user/context. No bulk demo impersonation in public runtime. Hosted PostgreSQL connections must resolve their actual branch; never use a local loopback override on Netlify.

Deploy previews branch the new production database; they are not automatically empty or anonymized. [N1] Treat copied test-user email/profile data as sensitive. Restrict preview access, omit production auth/session keys, and sanitize/seed only a verified disposable preview database where explicitly allowed. Never reset a branch labeled production. Record preview branch IDs and test that writes in a preview do not affect the main sandbox database.

## D. Environment configuration — one source per runtime setting

Use scoped Netlify environment variables for server configuration. Do not set a contradictory `ENABLE_SANDBOX_SIMULATOR=false` in a production TOML section while expecting a dashboard value to turn it on. Keep operational runtime flags in one documented source, inspect their effective values and redeploy after changes as required by the runtime. [N8]

| Variable | Initial provisioning | Approved new sandbox release |
|---|---|---|
| `APP_MODE` | `sandbox` | `sandbox` |
| `ENABLE_REAL_MONEY` | `false` | `false`, enforced by application guard |
| `PAYFAC_PROVIDER` / `ISSUER_PROVIDER` | `mock` / `mock` | `mock` / `mock` |
| `ENABLE_SANDBOX_SIMULATOR` | `false` | `true` after integration/readiness checks |
| `SIMULATION_RUNNER_ENABLED` | `false` | `true` for the tested bounded runner only |
| `FINANCIAL_SCHEDULES_ENABLED` | `false` | `false` unless a separate schedule is verified/approved |
| `ALLOW_DEMO_IMPERSONATION` | `false` | `false` |
| `ETAIL_PUBLIC_ORIGIN` | Verified new canonical HTTPS origin | Same verified new sandbox origin |
| `NETLIFY_IDENTITY_URL` | New project's actual Identity URL | Same new-project Identity only |
| `SESSION_ENCRYPTION_KEY` | New strong random server-only secret if required by chosen session model | Persistent, not regenerated on each deploy |
| `WORKER_SIGNING_SECRET` | New server-only secret | Scoped to bounded worker endpoint |
| `PAYFAC_WEBHOOK_SECRET` / `ISSUER_WEBHOOK_SECRET` | New independent mock signature secrets | Same scoped mock secrets |

Do not copy these secrets from any old project. A chosen provider-managed session design may not need `SESSION_ENCRYPTION_KEY`; document that choice and remove the unused variable rather than adding a second encryption layer. Never log variable values. Put runtime secrets only in server scopes, not public build variables. Unknown environment context denies unsafe features. Do not turn on real money merely to exercise mocks.

## E. New Identity and protection

Enable Identity in the new project when the tool/UI supports it. Set the desired eventual registration preference to **Open** and keep email confirmation required. During construction, site visitor protection remains enabled; publicly opening the primary sandbox is a separate reviewed release action. Previews and branch deployments stay protected. [N4]

Default previews cannot borrow production Identity/session keys. If authenticated preview tests are required, provision an explicitly approved isolated test-auth configuration for that preview/testing scope; otherwise show a clear auth-unavailable state and do not claim full preview acceptance. Local/CI fixture identity may only run in guarded local/test mode, not public hosted demo sign-in.

Verify confirmation, reset and invite callback origin/routes on the new canonical HTTPS host. Server-to-Identity calls must function with the chosen visitor protection. Do not patch over inaccessible provider endpoints by disabling CSRF or globally opening previews. Every user remains a regular member unless separately provisioned scoped staff permissions. No first-user admin rule.

## F. Build-to-release gates

1. Protected PR build with exact SHA, real PostgreSQL tests, browser tests and migration review.
2. Protected sandbox deployment; read actual framework/function/migration records and stable site ID.
3. Auth and runtime readiness; demonstrate same-origin requests reach validation, foreign/missing origins fail, no production-secret leakage, simulator and runner agree.
4. Authenticated new test-user acceptance using the visible UI, with no pasted credentials in artifacts.
5. Human release review for public registration/site access, limitations and billing. Only then open the new primary sandbox; keep previews private and real money disabled.
6. Record deployment receipt, release label, tested SHA, database branch/migration IDs, safe evidence and known gaps. No deploy link should be invented.

Automatic Git builds may start on push; a successful build is not application acceptance. Use site publishing protection/manual publish or an approved gated deploy mechanism to avoid public exposure before review. Do not equate GitHub PR preview success with public release approval. Verify current capabilities rather than assuming a plan has every protection feature.

## G. Post-deployment acceptance

Probe the new primary domain and exact deploy permalink where appropriate. Confirm canonical redirects do not discard confirmation/recovery fragments. An empty same-origin login POST should reach validation; it is not proof of a successful login. Test with an authorized confirmed user: session persistence, account switch, first card request, test funding, one completed practice purchase, refreshed activity, logout and denial after revocation. Verify both new-user and returning-user states.

Create a fictional merchant payment request, pay as a guest, observe settlement and payout, replay safe events, and check authorized receipts/files. Verify all three account types and permission boundaries. Inspect database/journal reconciliation. Make sure member purchase completion does not depend on unenabled calendar jobs. Record actual outcomes, not just UI screenshots.

For email, verify confirmation is received and the callback works; report default-sender/Junk limitations separately. DNS/SMTP changes require separate approval. This is not a live financial launch.

## H. Rollback and stopping conditions

Fail closed on target mismatch, unknown deploy context, absent secrets, unresolved migration error, failed CSRF/tenant check or failed money invariant. Do not switch to the old site to salvage a deployment.

Before any later schema-changing release, capture the new project's backup/reconciliation checkpoint and rehearse restore on a disposable database. Once new activity exists, code rollback must preserve post-release journals/events; do not restore an old snapshot over new transactions. Use compatible migrations or forward repair. No changes to the old project's data or access settings are part of rollback.

References (checked 2026-09-08; verify again during implementation):
- [N1] https://docs.netlify.com/build/data-and-storage/netlify-database/
- [N2] https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/
- [N3] https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- [N4] https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/
- [N8] https://docs.netlify.com/build/environment-variables/overview/
````

</details>
