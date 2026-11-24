# Current work context

Updated 24 November 2026. This document contains public contributor guidance and a concise release summary. Detailed working notes, research, captures and verification logs stay in the ignored private workspace. Earlier published technical history remains available in Git history and the retained archive.

## Active website scope

The traditional marketing website and the separate Trolleys for Agents page share one Shell, header, footer, design system and approved service information. Merchant sign in, applications, account operations and payments remain with the approved vendor services. This repository adds no account system, payment backend or database.

The Agents page at `/agents` provides 40 guided paths and a copyable next-step brief. It uses browser-local choices and links to maintained public guides. It does not access accounts, execute transactions or call an AI service. The experimental setup skill remains private and is not part of this public release.

## Current release

- Add the separate Agents page and its For agents header link; retain ordinary Help FAQs and support.
- Clarify Online businesses setup choices and link Merchant services directly to the application guide.
- Improve mobile navigation before hydration, retain all 392 Blog articles on one collection page and isolate software-platform artwork styling.
- Make twenty reviewed Blog articles and five maintained Developers pages search eligible, alongside the new Agents page.
- Update merchant-service structured data and clarify webhook source references.

Pricing, article bodies, legal/source records, provider handoffs and production/preview protections are preserved. The approved inventory is 440 core pages, 4,146 content pages and 3,769 search-eligible sitemap URLs. Blog has 31 eligible articles and 361 held articles. Five Developers pages are eligible and three remain held. The route and indexing registries own these decisions.

## Validation and publication

All four local release gates passed: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package`. The public verification includes 989 unit tests, 530 browser checks and 1,339 accessibility checks. Two desktop skips apply to mobile-only controls. Source, export and package identities match.

The maintainer authorized this release. Follow the feature-branch PR, required hosted checks and manual Netlify Git-build process in [GitHub delivery](GITHUB_DELIVERY.md) and [Netlify deployment](NETLIFY_DEPLOYMENT.md). Record the deployed commit and hosted results separately. Local verification does not establish field performance, search ranking or actual booking delivery.

The real calendar booking and confirmation-email delivery test remains deferred. Keep provider-dependent capabilities conditional on account availability.

## Next work

The proposed shared content and workflow inventory is a separate future change. Begin with a read-only ownership and dependency review when that stage is requested. Preserve feature ownership and existing fact, route and search registries; do not create a second content library or infer approval for a connected agent runtime.

Use [source precedence](SOURCE_PRECEDENCE.md), [public site architecture](PUBLIC_SITE_ARCHITECTURE.md), [repository guide](REPOSITORY_GUIDE.md) and [project targets](../project-targets.json) for project boundaries and ownership.
