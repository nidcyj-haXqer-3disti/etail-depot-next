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
    developers/
      guidance/             Existing integration guidance grouped within planned pages
      metadata.ts
      navigation.tsx
      page-content.tsx
    resources/
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
      reading-guide/        Shared reading layout and workflow diagrams
    styles/
    site/
    seo/
public/                     Approved public assets and licence notices
```

A feature keeps the content and visual implementation that belong to it. Use existing file conventions such as `content.ts`, `metadata.ts`, `page-content.tsx`, `artwork.tsx` and `assets/` where they fit. Do not add empty folders or wrapper files merely to make every feature identical. CSS and existing descriptive component names stay with their owner.

`src/app/` determines URLs. Source ownership and customer addresses are separate. The approved category URL migration now places Payouts at `/services/payouts`, with its implementation in `src/features/services/payouts/`.

The separately approved Developers alignment creates eight public information pages. Existing integration guidance appears within Getting started, API reference, Webhooks, Testing and Developer tools. SDKs, Changelog and API status are Coming soon. All eight pages clearly distinguish current account guidance from unavailable Etail API products. This is public content, not an API runtime.

## Business areas and public addresses

The navigation label, public address and source folder serve different purposes. A label helps a customer choose; `src/app/` owns the address; the feature folder owns its content and implementation. The approved category migration is recorded in [the complete URL map](plans/category-url-map.json). Further source moves do not themselves authorize address changes.

| Business area | Current public addresses | Owning feature |
| --- | --- | --- |
| Home | `/` | `src/features/home/` |
| Merchant onboarding | `/services/merchant-onboarding` | `src/features/services/merchant-onboarding/` |
| Payment methods and ACH | `/services/payment-methods`, `/services/ach-payments` | `src/features/services/payment-methods/`, `src/features/services/ach-payments/` |
| Payouts and reconciliation | `/services/payouts`, `/services/reconciliation` | `src/features/services/payouts/`, `src/features/services/reconciliation/` |
| Refunds and disputes | `/services/refunds`, `/services/disputes` | `src/features/services/refunds/`, `src/features/services/disputes/` |
| Card services | `/services/card-services` | `src/features/services/card-services/` |
| Service overview and model | `/services/merchant-services`, `/services/payment-facilitator` | `src/features/services/overview/`, `src/features/services/service-model/` |
| Online businesses | `/use-cases/online-businesses` | `src/features/use-cases/online-businesses/` |
| Software platforms and industries | `/use-cases/software-platforms` and its four industry anchors | `src/features/use-cases/software-platforms/` |
| Platform partnerships and models | `/use-cases/software-platforms/partnerships`, `/use-cases/software-platforms/payment-models` | `src/features/use-cases/software-platforms/partnerships/`, `src/features/use-cases/software-platforms/payment-models/` |
| Switch merchant services | `/use-cases/switch-merchant-services` | `src/features/use-cases/switch-merchant-services/` |
| Merchant account setup | `/resources/merchant-account-setup` | `src/features/resources/merchant-account-setup/` |
| Developers | `/developers/getting-started`, `/developers/api-reference`, `/developers/sdks`, `/developers/webhooks`, `/developers/testing`, `/developers/developer-tools`, `/developers/changelog`, `/developers/api-status` | `src/features/developers/` |
| Shopify and WooCommerce guides | `/resources/shopify-gateway-integration`, `/resources/woocommerce-gateway-integration` | `src/features/resources/integrations/shopify/`, `src/features/resources/integrations/woocommerce/` |
| Help and guide directory | `/resources/help`, `/resources/guides` | `src/features/resources/help/`, `src/features/resources/guides/` |
| Payment code references | `/resources/guides/iso-20022` and `/resources/guides/iso-8583`, including their generated reference addresses | `src/features/resources/references/` |
| About, Contact and Trust | `/company/about`, `/company/contact`, `/company/security` | `src/features/company/about/`, `src/features/company/contact/`, `src/features/company/trust/` |
| Legal, Terms and Privacy | `/company/legal`, its merchant legal documents, `/company/terms`, `/company/privacy` | `src/features/company/legal/` |
| Pricing | `/pricing` | `src/features/pricing/` |

Services, Use cases, Developers, Resources and Company now use matching URL families. Home and Pricing keep their existing addresses. The old flat page addresses and reference URLs redirect directly to their final category addresses. Static asset URLs are unchanged.

Header and footer share the same eight Developers destinations. Merchant account setup belongs to Resources. The former `/docs` pages redirect to their new destinations; path-only redirects retain section bookmarks without forwarding queries or submitted data.

The nine merchant legal document routes share the approved [legal content](../src/features/company/legal/merchant-legal-content.json) and [renderer](../src/features/company/legal/components/legal-service-document.tsx). They do not need nine duplicate implementation folders. Likewise, reference URLs are generated from the reviewed data; there is not one source file per reference value. The [route inventory](../src/shared/site/public-page-inventory.ts) remains the authoritative address list.

The repository's `docs/` folder contains contributor instructions. It has no customer page counterpart. Developer page wrappers live in `src/app/developers/`; merchant account setup lives in `src/app/resources/merchant-account-setup/`. Engineering instructions and archive records are excluded from website output.

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
