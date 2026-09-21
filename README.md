# Etail Depot

The public website for Etail Depot US, Inc., introducing **Trolleys payments** and forthcoming **Ledgix Visa secured credit cards**. Payment account setup, sign-in and dashboards are hosted at the vendor service. This application contains product information, help, legal pages and fixed service links only.

**Release status:** D140 / PR #31 is published and verified. Netlify deploy `6ab0d438588dbc2adeb59f78` contains the reviewed product journeys and final responsive polish. Follow [current status](planning/STATUS.md) for actual verification and publication evidence.

## Run locally

Use Node **24.19.0** and pnpm **11.19.0**:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

Open `http://127.0.0.1:3100`. No database, authentication tenant, payment credentials or environment secrets are needed. For development, use `pnpm dev --port 3100`.

## Project map

| Folder | Purpose |
| --- | --- |
| `src/app` | Six public pages, metadata routes, global styles and 404 |
| `src/ui` | Public layout, brand artwork, channel illustrations and legal/help components |
| `src/shared` | Confirmed product/contact details, public channel types and retired bookmark destinations |
| `src/modules/public-site` | Search/social metadata, the indexing guard, illustrative purchase examples and local fee calculations |
| `src/proxy.ts` | Read-only retirement responses for old account, payment and API URLs |
| `public` | Local brand assets, official network marks and marketing photography |
| `tests` | Public journeys, links, accessibility, metadata and retired-route checks |
| `tools` | Public-source, dependency and deployment-package verification |
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

The checks cover types, lint, public-only boundaries, unit/browser/accessibility tests, dependencies, production build, the production search guard and local Netlify packaging. Run them with ports 3100 and 3101 free. `pnpm verify` runs the complete sequence. These commands do not publish the website.

## Release boundaries

The only approved repository and site are recorded in [project-targets.json](project-targets.json). D122 authorized search indexing for Home, Payments, Cards and Help at `https://etail-depot-next.netlify.app` in the bound production environment; previews, legal pages, 404 and retired routes remain noindex. Netlify automatic publication remains held. Manual publication follows the reviewed release workflow and the user's authorization for that candidate. D140 published the reviewed D139 candidate. Local checks do not publish the website or establish Google indexing.

Search release requires the recorded approval, exact site/origin and production environment checks. Production-scoped `APP_ENV`, `ETAIL_SEARCH_CONTEXT` and `ETAIL_PUBLIC_ORIGIN` are configured for both Netlify builds and functions. Any supplied Netlify `CONTEXT` must also be production; functions do not receive that variable. See [release evidence and remaining checks](docs/RELEASE_READINESS_REVIEW.md), including the unverified Search Console/indexing status.

Read [the public architecture](docs/PUBLIC_SITE_ARCHITECTURE.md), [current source precedence](docs/SOURCE_PRECEDENCE.md) and [implementation status](planning/STATUS.md) before changing scope. Older documents describe retired account features; they do not authorize restoring those features or reconnecting stored account data.
