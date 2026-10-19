# Etail Depot

The customer-facing website for **Etail Depot US, Inc.**, introducing **Trolleys payment acceptance** and the **Ledgix credit card**.

[Website](https://etaildepot.com) · [Payment acceptance](https://etaildepot.com/payment-acceptance-service) · [Credit card](https://etaildepot.com/credit-card-services) · [Help](https://etaildepot.com/help)

## About the project

Trolleys helps US businesses accept online payments. Ledgix is a virtual Visa secured credit card, **coming soon**; applications are not open. The website explains both products, their pricing and limitations, and where to get help.

This repository contains the public website: product pages, interactive illustrations, help, merchant guides, legal notices and fixed links to the services. It does not run customer accounts, card issuance or payment processing. Trolleys account access is handled separately at [trolleys.ai](https://trolleys.ai); Ledgix inquiries go to [ledgix@etaildepot.com](mailto:ledgix@etaildepot.com).

Built with **Next.js, React and TypeScript**, exported as static pages and served on Netlify with a shared Edge request boundary. See the [architecture](docs/PUBLIC_SITE_ARCHITECTURE.md) for implementation details and [current status](planning/STATUS.md) for verified release information.

## Quick start

Install **Node.js 24.19.0**, **pnpm 11.19.0** and Git. Dependency versions are pinned in [package.json](package.json) and [pnpm-lock.yaml](pnpm-lock.yaml).

```sh
git clone https://github.com/nidcyj-haXqer-3disti/etail-depot-next.git
cd etail-depot-next
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

Open [http://127.0.0.1:3100](http://127.0.0.1:3100). Local setup needs no production credentials, database, service account or environment file.

For UI development with automatic reloads:

```sh
pnpm dev --port 3100
```

Stop the preview before starting the development server on the same port. The built preview exercises hosting, redirects and search headers; development mode is for UI work. Local previews remain excluded from search indexing.

## Contributing

Contributions are welcome through pull requests. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the fork and branch workflow, checks and review expectations. Start with an issue for a substantial product or architecture change so its scope can be agreed before implementation.

Public access allows anyone to fork the repository and propose changes. Merging requires repository write access; changes should go through review. A merge or a passing local check does not authorize a production deployment.

## Checks

Stop your local development or preview server and keep ports **3100 and 3101** free. Install the test browser, then run the complete verification sequence:

```sh
pnpm exec playwright install chromium
pnpm verify
```

On Linux, Playwright may also require system libraries; use `pnpm exec playwright install --with-deps chromium` when needed. Dependency auditing and first-time bundling require network access.

| Command | Purpose |
| --- | --- |
| `pnpm verify:public` | Lint, types, unit tests, architecture, build, browser journeys, accessibility and security checks |
| `pnpm test:seo:production` | Check production metadata and indexing safeguards using a local server |
| `pnpm package:netlify` | Build and package a local production-review candidate |
| `pnpm verify:package` | Verify package contents, source identity and hosting boundaries |

`pnpm verify` runs all four commands in order. None uploads or deploys the website. The [GitHub workflow](.github/workflows/foundation.yml) runs these checks for pull requests against this repository's `main` branch.

## Repository guide

| Path | Purpose |
| --- | --- |
| `src/app` | Nine approved page routes: Home, Payment acceptance, Credit card, Help, three merchant guides, Privacy and Terms; plus metadata and 404 |
| `src/ui` | Shared layout, navigation, artwork and interface components |
| `src/shared`, `src/modules/public-site` | Product details, safe service links, metadata and illustrative calculations |
| `public`, `assets/brand` | Original brand, card-network, wallet and other visual assets |
| `netlify` | Edge request boundary, protected platform email compatibility and release checks |
| `tests`, `tools`, `patches` | Automated checks, build/preview tooling and a documented dependency patch |
| `docs`, `planning` | Architecture, decisions, current work and release evidence |
| `archive/database`, `sources`, `contracts` | Preserved schema, requirements and research history; not active application services |

## Scope and releases

The active application is a public information website. Historical account code and database schemas are retained for reference; they are not setup instructions, customer-data backups or permission to reconnect retired services. The existing protected Netlify Emails handler is a platform compatibility exception; website pages do not call it.

Preserve approved product wording, pricing, availability, authentic logos and the shared design. Service links use fixed destinations and must not forward customer identifiers, query strings, fragments or referrers. D248 publishes the three exact guide routes `/guides/stripe-alternatives`, `/guides/payment-processing-systems` and `/guides/what-is-a-chargeback`. D250 adds `/guides/how-to-create-a-payment-link` for local review; publication remains separate.

The current local candidate prepares eight search-eligible routes: Home, Payment acceptance, Credit card, Help and the four exact guides under the recorded site/origin guard. The live D248 sitemap contains seven URLs until a separately approved release. Legal pages, local/preview builds, navigation payloads, errors and retired routes retain their indexing restrictions. Eligibility does not establish actual indexing or rankings.

Release targets are bound in [project-targets.json](project-targets.json). Deployment is a separate maintainer operation under the [deployment runbook](docs/NETLIFY_DEPLOYMENT.md). Use the [current work context](docs/CURRENT_WORK_CONTEXT.md) and [source precedence](docs/SOURCE_PRECEDENCE.md) before acting on older documents. Coding agents must also follow [AGENTS.md](AGENTS.md).

## Support and security

- **Website bugs:** [open an issue](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/issues) with the affected page, reproduction steps and browser/viewport details. Remove personal information from screenshots.
- **Product or account questions:** use the [Help center](https://etaildepot.com/help), rather than a public GitHub issue.
- **Potential security vulnerabilities:** contact [compliance@etaildepot.com](mailto:compliance@etaildepot.com) privately. Do not post credentials, customer information or sensitive exploit details in public issues or pull requests.

## License and assets

No repository-wide open-source license has been selected. Public visibility is not a license announcement. For licensing or reuse questions, contact [compliance@etaildepot.com](mailto:compliance@etaildepot.com). Preserve the existing notices and attribution for dependencies and third-party brand assets.
