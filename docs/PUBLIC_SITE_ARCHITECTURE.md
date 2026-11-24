# Public website architecture

## Traditional website and agent guidance

The traditional website retains its service pages, use cases, Developers guidance, resources, Company pages and ordinary Help FAQs. A single text link, For agents, in the shared header opens `/agents`. The footer and traditional page bodies do not promote or embed the task helper. Both areas use the same Shell, header, footer, design system and canonical service information. Developers remains merchant-facing integration documentation, separate from this task-oriented agent area and from project contributor management.

`src/features/agents/` owns the Trolleys for Agents composition, metadata, browser-only decision helper and qualified outcomes. Its route entry is `src/app/agents/page.tsx`. The helper distinguishes application review, approval, correct-store gateway access, host/plugin prerequisites, another website versus another DBA, manual entry versus customer payment links, software companies selling their own services versus other merchants or marketplace sellers, and unresolved payment outcomes. Choices are unverified categories held in component memory. No account details, storage, tracking event, remote AI call, backend or database is added.

Each outcome identifies the next action, responsible team, completion check and existing public guidance. Copying a brief is explicit. Setup briefs support a web team or assistant, platform briefs support an account-structure discussion, and payment briefs direct account records to approved support channels. The private project setup skill remains excluded from public source and downloads. The page does not claim a connected chat agent, autonomous account operations or an Etail API.

Six server-rendered guide links cover setup, integration, payment Help and platform models without JavaScript. New questions receive focus and element-scoped scrolling with header clearance. Existing native Back/Forward behavior is unchanged. Maintain decision content alongside its canonical guides. Unit and browser checks cover all terminal paths and destination fragments, back/reset, copy success/fallback, no-script guidance, accessible result/brief states and phone focus. Page styles are feature-owned; Help does not load the agent component or its CSS.

The completed `/agents` page is explicitly included in the production search candidate, bringing it to 440 core pages, 4,146 content pages and 3,769 eligible sitemap URLs. The exact production guard and preview noindex/empty sitemap remain unchanged. Existing Blog, Developers, legal and no-code indexing decisions remain intact. Publication requires separate authorization.

## Search discovery review, 24 November 2026

The earlier discovery review added search eligibility for twenty individually reviewed setup Blog articles and five maintained Developers guidance pages. Explicit lists in `src/shared/site/blog-paths.ts` and `developer-paths.ts` keep future additions excluded until reviewed. At that stage, before the separate Agents page, the inventory contained 4,145 content pages and 3,768 production-eligible sitemap URLs. The current scope is recorded above and in the route inventory. All 392 articles remain on the single Blog collection page. The other 361 articles, three Developers placeholders, legal/policy pages and unfinished no-code page remain noindex. Historical draft notes below describe earlier stages. The exact production guard and preview noindex/empty sitemap remain unchanged. Publication is a separate action.

A private instruction-only Trolleys Checkout Setup skill is stored under ignored `.local/ai-discovery-20261124/skills/`. It uses current public guides for postapproval setup planning. It is not an account connector, payment runtime, backend or published plugin, and is excluded from GitHub and website packages.

The website explains Etail's services and directs visitors to approved vendor services. The account-system boundary is the Sign in or Start now link. The vendor portal handles the subsequent account workflow. There is no Etail financial backend in this repository.

The first new Blog expansion batch adds 25 articles about processing costs and quote comparisons. Their source stays in `src/features/company/blog/`, with individual `/company/blog/` routes and the existing article presentation. `cost-comparison-articles.ts` groups their metadata internally; it does not add a public category. The batch remains local and noindex pending separate publication and search decisions.

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

Existing integration guidance is grouped within the five listed Developers pages. Getting started begins after MID approval and explains Etail's provisioned Infinicept portal and Cybersource gateway access, store/account mapping, connection choices and launch preparation. API reference explains Cybersource Unified Checkout server sessions, hosted browser fields, verified results and subsequent operations, using static code samples. Webhooks explains the Unified Checkout event, subscription setup, encryption and signatures, receipt processing and recovery. Testing covers sandbox checkout, method-specific checks, recovery, account records and separately authorized live validation. Developer tools links official Cybersource documentation, server SDKs and sandbox utilities, distinguishes merchant portal records, and explains the support handoff. Hosted payment tools are conditional on account availability. SDKs, Changelog and API status retain their published addresses and noindex metadata but are omitted from the header, footer and developer sidebar. Merchant account setup, platform integration guides, Help and references belong to Resources. The No code checkout experience draft belongs to Use cases, including its source and canonical URL; its previous Resources address redirects to the new page. Etail APIs, SDKs and other developer products remain unavailable. Vendor integration guidance does not add an Etail payment runtime or imply an Etail API. Project contributor management stays in engineering support.

Blog belongs to Company at `/company/blog` and uses one collection without topic category labels. Article content, metadata and presentation are owned by `src/features/company/blog/`; URL entry points live under `src/app/company/blog/`. Preserve supplied human-authored wording and the established article layouts unless a content change is approved.

Use [Blog paths and search eligibility](../src/shared/site/blog-paths.ts), the [public page inventory](../src/shared/site/public-page-inventory.ts) and the [production indexing guard](../src/shared/site/public-release.ts) for the current route and search scope. A published article URL is not automatically approved for indexing. Do not maintain a second per-article status inventory in this architecture document.

Individual drafting, editorial and indexing decisions remain in the dated [current-work records](CURRENT_WORK_CONTEXT.md) and Git history. Those records describe the decisions at their recorded stage; the current source allowlists and release context govern the candidate. Historical decisions are not recreated here as current policy.

## Guidance dependency pilot

Three guide-owned exports record stable source IDs, source files, relevant guide sections and human summaries to review: `accountAccessSource` in Developers Getting started, `woocommerceCredentialsSource` in the WooCommerce guide, and `additionalDbaSource` in Merchant account setup. They contain references, not copied instructions. `src/shared/site/guidance-source.ts` holds only their types; it imports no feature content.

`setupGuidanceDependencies` in the Agents decision module associates those IDs with actual `question:` and `result:` node IDs. The optional private setup skill owns its separate section-reference map. Website components do not consume the engineering maps, and the private skill is not required or published by the website build.

`pnpm review:guidance` validates this pilot and can report the review impact of supplied paths or a Git comparison. It includes WooCommerce originals and generated previews, plus inline account-guide artwork. It is deliberately conservative at file level. Registered URLs, valid node IDs and content hashes establish structural identity, not factual correctness, account enablement, search eligibility or publication approval. The generated report is a dated snapshot, not an authority over current content. See the [tool instructions](../tools/README.md#guidance-change-review).

## Agent task plans

The `/agents` experience is a planning interface within the static website. `setup-paths.ts` owns the finite questions and result selection; `task-plans.ts` owns the short plans attached to those results. Each step has a source, owner, completion check and any prerequisite. The same plan data feeds the result disclosure, plain-text brief and build-rendered task reference. Native disclosures keep the reference readable without JavaScript. No new routes, account connection, AI request or progress storage are introduced.

Visitors can explicitly copy or download a brief. Its plan reference is a text revision identifier, not authentication, factual validation or confirmation that work is complete. The optional private skill treats it as unverified context, reopens current source guidance and resumes only from a confirmed unfinished step. The owning guide remains authoritative over a saved brief.

The engineering review tool derives task-plan citation coverage from every reachable result and an explicit page-to-source map. Source edits identify affected plan IDs separately from the three shared-guidance pilots. Optional local review also derives private skill page dependencies from its actual website citations, including shared merchant-entry instructions and support destinations. This does not claim that uncited prose or every human summary has been mapped. Tests verify each plan source against the actual exported section. No engineering inventory is loaded into the browser.

## Rendering and interactions

Next.js exports static HTML. The existing shared Shell, header, footer, mobile menu and design tokens serve all page families. Feature-owned illustrations and client components provide explanatory interaction, copy controls, local fee estimates, guide disclosures and filters. They do not submit merchant applications or financial transactions.

Preserve established URLs and section anchors unless a move is explicitly approved. The approved category migration uses `/services`, `/use-cases`, `/developers`, `/resources` and `/company` page families. Home and Pricing stay unchanged. Exact redirects cover former flat addresses, documentation and reference pages, retaining original section anchors. The [original category migration map](plans/category-url-map.json) preserves that migration’s page pairs. Later approved moves are recorded in the current route registry. Services have dedicated pages. Platform industries remain sections of Software platforms. Documentation and reference pages retain their reading navigation; do not add redundant breadcrumb or section-navigation layers to commercial pages.

Follow the [page paint standard](PAGE_PAINT_STANDARDS.md). Preserve the document-ready marker, responsive layout before hydration, versioned image imports, appropriate loading priority, brand aspect ratios, navigation history and native fallbacks. A completed screenshot alone does not verify first paint.

## Account and data boundary

Merchant sign in and registration link only to `https://merchantapp.io/etaildepot/UserAccount/Login`. [The hosted-services module](../src/shared/site/hosted-services.ts) defines the fixed destination; [the shared portal link](../src/shared/ui/merchant-portal-link.tsx) preserves its no-referrer behavior. Do not forward visitor input, page queries or fragments.

Sales appointments use one shared Calendly booking panel. Header and commercial sales actions open it directly without navigating to Contact; the general Contact page and account-support email remain separate. The optional public destination is configured only after the operator approves the provider setup. Calendly loads only after a sales action is selected. Native links work without JavaScript, and a null destination restores the established contact fallback. Scheduling stays with the provider and adds no Etail backend or database. Existing account and integration support uses a separate contact section. Follow the [sales booking runbook](SALES_BOOKING.md) for activation and verification.

No local account application, checkout processor, KYC, ledger, database adapter, provider-key management or payment API is active. Card applications remain closed. Public illustrations use the approved examples and do not expose customer records. Archived schemas are historical definitions, not a data source.

## Routing and search

[The page inventory](../src/shared/site/public-page-inventory.ts), [reference paths](../src/shared/site/standard-reference-paths.ts), [artifact policy](../tools/public-artifact-policy.ts) and [release receipt](../tools/reference-release.json) define the exact approved page set. New routes or reference data need scope and source review; unknown reference values do not become pages.

Production indexing requires the exact approved site, canonical origin and trusted deployment/environment context. Preview and unapproved contexts remain noindex with an empty sitemap. The 12 legal and website policy pages, three Developers placeholders, the pending No code checkout experience and unapproved editorial drafts remain noindex and outside the production sitemap. The five maintained Developers pages and individually reviewed Blog articles are eligible only under the explicit source allowlists and approved production context. Preserve the recorded reference licences and exclude the retired reproduced ISO tables.

[Page revisions](../src/shared/site/public-page-revisions.ts) record meaningful content changes. Do not advance dates for a rebuild, source-folder migration or cosmetic review. Structured data, canonicals and sitemap entries must describe the same approved routes.

## Build and hosting

Use pinned Node and pnpm with one lockfile. [The build wrapper](../tools/build-public-site.mjs) validates source scope and records input identity. [Packaging](../tools/package-public-site.mjs) copies only the verified export to `.netlify/static/`, bundles one public Edge boundary, and preserves the pinned authenticated Emails handler. It never publishes.

[The Edge boundary](../netlify/edge-functions/public-boundary.ts) enforces public routing, preview protections, security headers and retirement behavior. Only exact approved public service exports are exempt from the historical `/services/*` account retirement rule. Other retired routes are read only; they must not read or forward submitted bodies. Keep the enabled Netlify Emails extension and all settings. Its existing authenticated POST handler is the sole server-function exception; public pages do not call it.

The [manual Netlify process](NETLIFY_DEPLOYMENT.md) retains the existing project, domain, root build command and publish directory. Do not deploy the repository root, revive an old backend, change DNS/Identity/database resources or bypass the final package verifier.

## Engineering and history

Team workflow belongs to [CONTRIBUTING.md](../CONTRIBUTING.md), `.github/` and `docs/`. Shared tools are maintained in `tools/`; image-generator data belongs in `tools/assets/`. Historical records are under [archive](../archive/README.md), outside runtime imports and deployment output.

Current work and verification state live only in [CURRENT_WORK_CONTEXT.md](CURRENT_WORK_CONTEXT.md). Prior versions of this architecture and the former status log are preserved in the archive. Their use of words such as “current” or “authorized” describes the original date, not today's scope.

### Local Blog expansion, Batch 2

The second expansion batch covers planned topics 26 through 50 with 22 new article routes and three topics already covered by existing articles. The new content is in `src/features/company/blog/`, collected by `commercial-terms-articles.ts`, with matching `src/app/company/blog/` routes. All 22 new routes retain draft noindex status. The Blog remains one collection with no public categories. The local inventory is now 283 Blog articles, 330 core pages and 4,036 content pages; the production search-eligible inventory remains 3,743 URLs. No publication is authorized by these local checks.

### Local Blog expansion, Batch 3

The third expansion batch covers planned topics 51 through 75 with 20 new articles and five topics already covered. `provider-selection-articles.ts` collects their metadata internally; feature sources and app routes retain the existing single Blog collection and presentation. All new routes remain noindex drafts. The local inventory is 303 Blog articles, 350 core pages and 4,056 content pages. Search eligibility remains 3,743 URLs. Publication and search approval remain separate.

### Local Blog expansion, Batch 4

The fourth expansion batch covers planned topics 76 through 100 with 18 new articles and seven topics covered by existing articles. `migration-decision-articles.ts` groups metadata internally without adding a public category. Feature sources, app routes and the classic Blog presentation remain. All new routes are noindex drafts. The local inventory is 321 Blog articles, 368 core pages and 4,074 content pages. Search eligibility remains 3,743 URLs; publication and indexing need separate approval.

### Local Blog expansion, Batch 5

The fifth expansion batch covers planned topics 101 through 125 with 16 new articles, seven within-batch consolidations and two existing-article reuses. `onboarding-identity-articles.ts` groups metadata internally without a public category. Classic presentation, feature ownership and app routes remain. New routes are noindex drafts. The local inventory is 337 Blog articles, 384 core pages and 4,090 content pages. Search eligibility remains 3,743 URLs; publication and indexing need separate approval.

### Local Blog expansion, Batch 6

The sixth expansion batch covers planned topics 126 through 150 with 17 new articles, four within-batch consolidations and four existing-article reuses. `business-review-articles.ts` groups metadata internally without a public category. Classic presentation, feature ownership and app routes remain. New routes are noindex drafts. The local inventory is 354 Blog articles, 401 core pages and 4,107 content pages. Search eligibility remains 3,743 URLs; publication and indexing need separate approval.

### Local Blog expansion, Batch 7

The seventh expansion batch covers planned topics 151 through 175 with 12 new articles, four within-batch consolidations and nine existing-article reuses. `account-change-articles.ts` groups metadata internally without a public category. Classic presentation, feature ownership and app routes remain. New routes are noindex drafts. The local inventory is 366 Blog articles, 413 core pages and 4,119 content pages. Search eligibility remains 3,743 URLs; publication and indexing need separate approval.

### Local Blog expansion, Batch 8

The eighth expansion batch covers planned topics 176 through 200 with 10 new articles, eight within-batch consolidations and seven existing-article reuses. `review-readiness-articles.ts` collects their metadata internally in the same Blog collection. All new routes remain noindex drafts. The candidate contains 376 Blog articles, 423 core pages and 4129 content pages; approved search eligibility remains 3743 URLs. No publication or indexing authorization is inferred.

### Local Blog expansion, Batch 9

The ninth expansion batch covers planned topics 201 through 225 with 11 new articles, eight within-batch consolidations and six existing-article reuses. `checkout-experience-articles.ts` collects metadata internally in the same Blog collection. All new routes remain noindex drafts. The candidate contains 387 Blog articles, 434 core pages and 4140 content pages; approved search eligibility remains 3743 URLs. No publication or indexing authorization is inferred.

### Local Blog expansion, Batch 10

The tenth expansion batch covers planned topics 226 through 250 with five new articles, five within-batch consolidations and fifteen existing-article reuses. `wallet-experience-articles.ts` collects metadata internally in the same Blog collection. All new routes remain noindex drafts. The candidate contains 392 Blog articles, 439 core pages and 4145 content pages; approved search eligibility remains 3743 URLs. No publication or indexing authorization is inferred.
