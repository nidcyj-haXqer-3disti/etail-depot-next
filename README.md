# Etail Depot

The public website for Etail Depot US, Inc., introducing **Trolleys payments** and forthcoming **Ledgix Visa secured credit cards**. Payment account setup, sign-in and dashboards are hosted at the vendor service. This application contains product information, help, legal pages and fixed service links only.

**Release status:** D163 / PR #34 / Netlify deploy `6ab20642fc4fee270b08924d` remains live. PR #35's static-site and native Edge security remediation passed CI and merged with zero dependency advisories. Its first hosted build failed before publication. D201 directs a compatible repair that keeps the existing Netlify Emails extension enabled and preserves its settings. The reviewed release now allows only its pinned, authenticated POST handler alongside the public site; full local/CI and hosted checks must pass before publication. Read [current work context](docs/CURRENT_WORK_CONTEXT.md) and [status](planning/STATUS.md) for current evidence and limits.

## Run locally

Use Node **24.19.0** and pnpm **11.19.0**:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

Open `http://127.0.0.1:3100`. No database, authentication tenant, payment credentials or environment secrets are needed. For UI development, use `pnpm dev --port 3100`; use the built preview to exercise static hosting, retirement responses and search headers.

## Project map

| Folder | Purpose |
| --- | --- |
| `src/app` | Six public pages, metadata routes, global styles and 404 |
| `src/ui` | Public layout, brand artwork, channel illustrations and legal/help components |
| `src/shared` | Confirmed product/contact details, public channel types, retired bookmark destinations and the search-release guard |
| `src/modules/public-site` | Search/social metadata, illustrative purchase examples and local fee calculations |
| `netlify/edge-functions/public-boundary.ts` | Read-only retirement responses, security headers and deployment-context search protection |
| `netlify/email-compat`, `netlify/plugins/public-release` | Protect the existing platform email handler and verify its final hosted package; no website email form |
| `public` | Local brand assets, official network marks and marketing photography |
| `tests` | Public journeys, links, accessibility, metadata and retired-route checks |
| `tools` | Static build/preview, local Edge packaging and source/dependency/artifact verification |
| `patches` | Scoped Next lint root-resolver patch, tested without disabling lint rules |
| `archive/database` | Inactive migration/schema history and preservation evidence; never used at runtime |
| `docs`, `planning`, `sources`, `contracts` | Current decisions plus dated requirements and review history |

The previous account backend is retained in Git at `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Existing database records were not deleted or imported into the public website. The database archive is schema history, not a customer-data backup.

## Verify and package

```sh
pnpm verify:public
pnpm test:seo:production
pnpm package:netlify
pnpm verify:package
```

The checks cover types, lint and `test:lint-tooling`, public-only boundaries, unit/browser/accessibility tests, dependencies, the static production build, search guard and local Netlify packaging. The supported `output: "export"` keeps the existing pages and interactions; original images are served directly without an image server. The pinned `@netlify/edge-bundler` 16.0.4 replaces the Next adapter and Netlify CLI. A scoped patch uses pinned Node 24’s stable filesystem glob API for Next lint root resolution; unsupported patterns fail closed and rule coverage is tested. Run them with ports 3100 and 3101 free. `pnpm verify` runs the complete sequence. `package:netlify` rebuilds a local production-review export and packages static files, the single Edge boundary and the strictly verified platform email source; it does not upload or publish them.

## Release boundaries

The only approved repository and site are recorded in [project-targets.json](project-targets.json). D122 authorized search indexing for Home, Payments, Cards and Help at `https://etail-depot-next.netlify.app` in the bound production environment; previews, legal pages, 404 and retired routes remain noindex. Netlify automatic publication remains held. Manual publication follows the reviewed release workflow and the user's authorization for that candidate. Local checks do not publish the website or establish Google indexing.

Search release requires the recorded approval, exact site/origin and production environment checks. Static build metadata and runtime Edge protection use the same pure guard. The Edge boundary takes site identity and deploy context from Netlify’s trusted context, not visitor headers; nonproduction responses remain noindex. Search environment and remote release configuration must be verified for the candidate before publication. See [release evidence and remaining checks](docs/RELEASE_READINESS_REVIEW.md), including the unverified Search Console/indexing status.

Read [the public architecture](docs/PUBLIC_SITE_ARCHITECTURE.md), [current source precedence](docs/SOURCE_PRECEDENCE.md) and [implementation status](planning/STATUS.md) before changing scope. Older documents describe retired account features; they do not authorize restoring those features or reconnecting stored account data.
