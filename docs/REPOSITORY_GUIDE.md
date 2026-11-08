# Repository guide

Use three working categories: website source, engineering support, and private workspace. Historical public records live with engineering support in the archive. [File publication policy](FILE_PUBLICATION_POLICY.md) determines where each category can appear.

## Website source

```text
src/
  app/                      Existing routes and page wrappers
  features/
    home/
    services/
      merchant-onboarding/
      payment-methods/
      ach-payments/
      payouts/
      reconciliation/
      refunds/
      disputes/
      card-services/
      overview/
      service-model/
      shared/               Reused service layout and types
      components/           Artwork shared within Services
    use-cases/
      online-businesses/
      software-platforms/
      switch-merchant-services/
    resources/
      documentation/
      merchant-account-setup/
      integrations/
        shopify/
        woocommerce/
      help/
      guides/
      references/
      components/
    company/
      about/
      contact/
      trust/
      legal/
    pricing/
  shared/
    layout/
    brand/
    ui/
    styles/
    site/
    seo/
public/                     Approved public assets and licence notices
```

A feature keeps the content and visual implementation that belong to it. Use existing file conventions such as `content.ts`, `metadata.ts`, `page-content.tsx`, `artwork.tsx` and `assets/` where they fit. Do not add empty folders or wrapper files merely to make every feature identical. CSS and existing descriptive component names stay with their owner.

`src/app/` determines URLs. Moving source into a business folder does not rename the public address. For example, Payouts remains `/payouts-and-reconciliation` and its implementation belongs to `src/features/services/payouts/`.

Public Developers is reserved for future Etail developer products. That future feature is not implemented in this restructure. Existing documentation explains vendor-assisted integration and remains Resources. The navigation and published URLs are unchanged.

## Engineering support

```text
.github/                    Issues, pull request template and exact-commit CI
tools/                      Shared build, verification and generator commands
  assets/                   Image source frames and generated-preview receipts
tests/                      Unit, browser and accessibility coverage
netlify/                    Existing Edge boundary and protected email support
patches/                    Reviewed dependency patch
docs/                       Current project instructions
  plans/                    Agreed migration plan and stage receipts
archive/
  bootstrap/                Superseded starting prompts and handoff manifest
  project-history/          Prior website decisions, evidence and status logs
  retired-platform/        Historical account-platform specifications/materials
  database/                 Existing immutable schema and migration history
```

Framework and package configuration stay at the root, where Next.js, pnpm, GitHub and Netlify expect them. The existing build and verification entry points and `tools/reference-release.json` stay in place. Tooling is shared by the project; developers do not each get a separate production tools folder.

Team responsibilities are assigned in tasks and PRs. Use [CONTRIBUTING.md](../CONTRIBUTING.md) for branch, review and shared-file coordination. Internal contributors are not managed through the public Developers feature.

## Private workspace

Ignored `.local/`, `.private/`, `outputs/` and `artifacts/` hold local notes, original account captures and review output. Credentials belong in approved private storage. Neither these files nor generated `.next/`, `out/` or `.netlify/` output belongs in commits. A public GitHub archive is not private storage.

## Current instructions

| Need | Read |
| --- | --- |
| Current task and release state | [Current work context](CURRENT_WORK_CONTEXT.md) |
| Authority and conflicting old instructions | [Source precedence](SOURCE_PRECEDENCE.md) |
| Runtime and dependency direction | [Public architecture](PUBLIC_SITE_ARCHITECTURE.md) |
| Work with other contributors | [Contributing](../CONTRIBUTING.md), [GitHub delivery](GITHUB_DELIVERY.md) |
| Local commands | [Local setup](LOCAL_AND_CODEX_SETUP.md), [tools](../tools/README.md) |
| UI/loading and public wording | [Page paint](PAGE_PAINT_STANDARDS.md), [customer language](CUSTOMER_LANGUAGE.md) |
| What to validate and what counts as evidence | [Acceptance criteria](ACCEPTANCE_TESTS.md), [test evidence](TEST_AND_EVIDENCE.md) |
| Access and security | [Access boundaries](ACCESS_POLICY.md), [security](SECURITY_AND_IDENTITY.md) |
| Source/assets and publication | [Dependencies and licensing](DEPENDENCIES_AND_LICENSING.md), [brand assets](NETWORK_BRAND_ASSETS.md), [file publication](FILE_PUBLICATION_POLICY.md) |
| Authorized release | [Netlify runbook](NETLIFY_DEPLOYMENT.md) |

The [Stage 1 file map](plans/repository-file-map.json) is the original migration proposal. Stage receipts record the actual reviewed moves and any adjustments. Historical paths inside those records describe their original source revision.
