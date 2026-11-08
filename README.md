# Etail Depot

The public website for Etail Depot US, Inc. It explains merchant services, software platform use cases, card services, pricing and account setup.

[Website](https://etaildepot.com) · [Services](https://etaildepot.com/services/merchant-services) · [Resources](https://etaildepot.com/resources/guides) · [Help](https://etaildepot.com/resources/help)

## Project boundary

This repository runs the public website. Merchant sign in and registration open the fixed [Trolleys Welcome page](https://merchantapp.io/etaildepot/UserAccount/Login), where visitors enter their email. The vendor service handles account access and applications. This website does not implement merchant authentication, account processing, payments, KYC, a ledger or a database. Card applications remain closed; card pages provide information and inquiry routes.

The website uses Next.js, React and TypeScript, exports static pages, and runs on the existing Netlify project with one shared request boundary. The enabled Netlify Emails extension retains its pinned authenticated handler; public pages do not call it.

Read the [current status](docs/CURRENT_WORK_CONTEXT.md), [architecture](docs/PUBLIC_SITE_ARCHITECTURE.md) and [repository guide](docs/REPOSITORY_GUIDE.md) before making changes. [project-targets.json](project-targets.json) identifies the only permitted repository and site.

## Quick start

Use Node.js **24.19.0**, pnpm **11.19.0** and the existing lockfile.

```sh
git clone https://github.com/nidcyj-haXqer-3disti/etail-depot-next.git
cd etail-depot-next
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

Open [the local preview](http://127.0.0.1:3100). No production credentials, environment file, database or vendor account is needed. For automatic UI reloads, stop the preview and run `pnpm dev --port 3100`. The built preview exercises the request boundary; development mode is for editing. See [local setup](docs/LOCAL_AND_CODEX_SETUP.md).

## Repository guide

| Area | Location | Purpose |
| --- | --- | --- |
| Website | `src/app/` | Existing URL routes and thin page wrappers |
| Website | `src/features/` | Home, Services, Use cases, Developers, Resources, Company and Pricing content, metadata, components and artwork |
| Website | `src/shared/` | One Shell, header, footer, brand system, shared UI, site facts and SEO helpers |
| Website | `public/` | Reviewed publicly served assets and licence notices |
| Engineering | `.github/`, `tools/`, `tests/`, `netlify/`, `patches/` | Team workflow, shared build tools, checks and hosting support |
| Engineering | `docs/` | Current instructions, architecture and approved migration records |
| Engineering | `archive/` | Preserved prior plans, retired platform specifications and immutable database history |
| Private workspace | Ignored local folders | Credentials, original account captures and review artifacts; never GitHub or website content |

Public **Developers** is a website navigation area. Its eight pages include existing integration guidance and clearly mark unavailable Etail API products as Coming soon. It does not contain instructions for the engineers working on this repository. Merchant setup and platform integration guides belong to Resources. Contributor instructions live in [CONTRIBUTING.md](CONTRIBUTING.md) and engineering documentation.

## Checks

Keep ports **3100 and 3101** free. Install Chromium, then run the complete sequence:

```sh
pnpm exec playwright install chromium
pnpm verify
```

Linux may require `pnpm exec playwright install --with-deps chromium`. Dependency auditing and first-time bundling require network access.

| Command | Purpose |
| --- | --- |
| `pnpm test:publication` | Check source, repository-only and private file placement |
| `pnpm verify:public` | Lint, types, unit tests, architecture, build, browser journeys, accessibility and security |
| `pnpm test:seo:production` | Verify production metadata, the exact sitemap and negative hosting contexts locally |
| `pnpm package:netlify` | Build the local production-review package |
| `pnpm verify:package` | Verify source identity, file inventory and runtime boundaries |

`pnpm verify` runs the four release commands in order. None deploys. The [GitHub workflow](.github/workflows/foundation.yml) runs these checks on the exact candidate. See [acceptance criteria](docs/ACCEPTANCE_TESTS.md) and [evidence requirements](docs/TEST_AND_EVIDENCE.md).

## Contributing and releases

Use a focused feature branch and a reviewed pull request. [CONTRIBUTING.md](CONTRIBUTING.md) explains file ownership, collaboration, conflict resolution and checks. Do not push feature changes directly to `main` or rewrite shared history.

The exact page counts, reference sources and approved legal scope are recorded in [tools/reference-release.json](tools/reference-release.json). This build-check file is public GitHub source, but must return 404 on the website. [File publication policy](docs/FILE_PUBLICATION_POLICY.md) explains this distinction.

Current release status has one home: [docs/CURRENT_WORK_CONTEXT.md](docs/CURRENT_WORK_CONTEXT.md). Old release approvals and test counts in the archive are historical. A passing local check, PR merge or package does not authorize deployment. Follow the [manual Netlify runbook](docs/NETLIFY_DEPLOYMENT.md) when publication is explicitly authorized.

## Support and security

- Website bugs: [open an issue](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/issues) with the page, reproduction steps and browser/viewport. Remove private details from screenshots.
- Product and account questions: use the [Help center](https://etaildepot.com/resources/help).
- Potential vulnerabilities: contact [compliance@etaildepot.com](mailto:compliance@etaildepot.com) privately. Do not post credentials, customer records or sensitive exploit details publicly.

## License and assets

No repository-wide open-source licence has been selected. Public visibility does not grant a licence. Existing dependency, reference-data and asset notices retain their own scope. See [dependency and licensing policy](docs/DEPENDENCIES_AND_LICENSING.md) and [brand asset provenance](docs/NETWORK_BRAND_ASSETS.md).
