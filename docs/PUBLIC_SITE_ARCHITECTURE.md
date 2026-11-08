# Public website architecture

The website explains Etail's services and directs visitors to approved vendor services. The account-system boundary is the Sign in or Start now link. The vendor portal handles the subsequent account workflow. There is no Etail financial backend in this repository.

## Source ownership

| Location | Responsibility |
| --- | --- |
| `src/app/` | Existing URL routes, layout, sitemap, robots, social image and not-found entry points |
| `src/features/` | Each business area's content, metadata, presentation, artwork and feature assets |
| `src/shared/layout/` | One Shell, header, footer and navigation behavior |
| `src/shared/brand/` | Shared brand marks, proportions and embedded image system |
| `src/shared/ui/` and `src/shared/styles/` | Reusable presentation and the existing design system |
| `src/shared/site/` | Company facts, approved destinations, navigation and exact route/revision inventories |
| `src/shared/seo/` | Metadata and structured-data builders that receive feature facts |
| `public/` | Approved static assets and licence notices, never development files |

See the [repository guide](REPOSITORY_GUIDE.md) for feature folders and engineering ownership. A route composes its owning feature. Shared code must not import feature-owned business content. Whole-site registries are used for checks; runtime pages import their own content. Tests enforce these boundaries.

Existing vendor documentation and merchant integration guides belong to Resources. Public Developers navigation is preserved. An Etail API or SDK feature is a future product scope, distinct from management of this project's developers.

## Rendering and interactions

Next.js exports static HTML. The existing shared Shell, header, footer, mobile menu and design tokens serve all page families. Feature-owned illustrations and client components provide explanatory interaction, copy controls, local fee estimates, guide disclosures and filters. They do not submit merchant applications or financial transactions.

Preserve established URLs and section anchors even when folder or navigation names differ. Services have dedicated pages. Platform industries remain sections of Software platforms. Documentation and reference pages retain their reading navigation; do not add redundant breadcrumb or section-navigation layers to commercial pages.

Follow the [page paint standard](PAGE_PAINT_STANDARDS.md). Preserve the document-ready marker, responsive layout before hydration, versioned image imports, appropriate loading priority, brand aspect ratios, navigation history and native fallbacks. A completed screenshot alone does not verify first paint.

## Account and data boundary

Merchant sign in and registration link only to `https://merchantapp.io/etaildepot/UserAccount/Login`. [The hosted-services module](../src/shared/site/hosted-services.ts) defines the fixed destination; [the shared portal link](../src/shared/ui/merchant-portal-link.tsx) preserves its no-referrer behavior. Do not forward visitor input, page queries or fragments.

No local account application, checkout processor, KYC, ledger, database adapter, provider-key management or payment API is active. Card applications remain closed. Public illustrations use the approved examples and do not expose customer records. Archived schemas are historical definitions, not a data source.

## Routing and search

[The page inventory](../src/shared/site/public-page-inventory.ts), [reference paths](../src/shared/site/standard-reference-paths.ts), [artifact policy](../tools/public-artifact-policy.ts) and [release receipt](../tools/reference-release.json) define the exact approved page set. New routes or reference data need scope and source review; unknown reference values do not become pages.

Production indexing requires the exact approved site, canonical origin and trusted deployment/environment context. Preview and unapproved contexts remain noindex with an empty sitemap. The 12 legal and website policy pages are noindex and outside the production sitemap. Preserve the recorded reference licences and exclude the retired reproduced ISO tables.

[Page revisions](../src/shared/site/public-page-revisions.ts) record meaningful content changes. Do not advance dates for a rebuild, source-folder migration or cosmetic review. Structured data, canonicals and sitemap entries must describe the same approved routes.

## Build and hosting

Use pinned Node and pnpm with one lockfile. [The build wrapper](../tools/build-public-site.mjs) validates source scope and records input identity. [Packaging](../tools/package-public-site.mjs) copies only the verified export to `.netlify/static/`, bundles one public Edge boundary, and preserves the pinned authenticated Emails handler. It never publishes.

[The Edge boundary](../netlify/edge-functions/public-boundary.ts) enforces public routing, preview protections, security headers and retirement behavior. Retired routes are read only; they must not read or forward submitted bodies. Keep the enabled Netlify Emails extension and all settings. Its existing authenticated POST handler is the sole server-function exception; public pages do not call it.

The [manual Netlify process](NETLIFY_DEPLOYMENT.md) retains the existing project, domain, root build command and publish directory. Do not deploy the repository root, revive an old backend, change DNS/Identity/database resources or bypass the final package verifier.

## Engineering and history

Team workflow belongs to [CONTRIBUTING.md](../CONTRIBUTING.md), `.github/` and `docs/`. Shared tools are maintained in `tools/`; image-generator data belongs in `tools/assets/`. Historical records are under [archive](../archive/README.md), outside runtime imports and deployment output.

Current work and verification state live only in [CURRENT_WORK_CONTEXT.md](CURRENT_WORK_CONTEXT.md). Prior versions of this architecture and the former status log are preserved in the archive. Their use of words such as “current” or “authorized” describes the original date, not today's scope.
