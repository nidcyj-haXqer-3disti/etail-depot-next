# Current work context

Updated 24 November 2026. This document contains public contributor guidance and a concise release summary. Detailed working notes, research, captures and verification logs stay in the ignored private workspace. Earlier published technical history remains available in Git history and the retained archive.

## Active website scope

The traditional marketing website and the separate Trolleys for Agents page share one Shell, header, footer, design system and approved service information. Merchant sign in, applications, account operations and payments remain with the approved vendor services. This repository adds no account system, payment backend or database.

The Agents page at `/agents` provides 40 guided paths. The current local extension adds ordered task plans with prerequisites, owners, completion checks and source links, plus copyable or downloadable briefs and a static task reference. It uses browser-local choices and links to maintained public guides. It does not access accounts, execute transactions or call an AI service. The experimental setup skill remains private and is not part of this public release.

## Latest published release

- Add the separate Agents page and its For agents header link; retain ordinary Help FAQs and support.
- Clarify Online businesses setup choices and link Merchant services directly to the application guide.
- Improve mobile navigation before hydration, retain all 392 Blog articles on one collection page and isolate software-platform artwork styling.
- Make twenty reviewed Blog articles and five maintained Developers pages search eligible, alongside the new Agents page.
- Update merchant-service structured data and clarify webhook source references.

Pricing, article bodies, legal/source records, provider handoffs and production/preview protections are preserved. The approved inventory is 440 core pages, 4,146 content pages and 3,769 search-eligible sitemap URLs. Blog has 31 eligible articles and 361 held articles. Five Developers pages are eligible and three remain held. The route and indexing registries own these decisions.

## Published release verification

All four local release gates passed: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package`. The public verification includes 989 unit tests, 530 browser checks and 1,339 accessibility checks. Two desktop skips apply to mobile-only controls. Source, export and package identities match.

The maintainer authorized this release. Follow the feature-branch PR, required hosted checks and manual Netlify Git-build process in [GitHub delivery](GITHUB_DELIVERY.md) and [Netlify deployment](NETLIFY_DEPLOYMENT.md). Record the deployed commit and hosted results separately. Local verification does not establish field performance, search ranking or actual booking delivery.

The real calendar booking and confirmation-email delivery test remains deferred. Keep provider-dependent capabilities conditional on account availability.

## Local guidance release candidate

The candidate adds ordered task plans to all 40 Agents paths. Each step identifies prerequisites, the responsible team, a completion check and a link to its owning guide. The same plan feeds the interactive result, copyable or downloadable brief and static task reference. No account connection, remote AI service, payment runtime or database is added.

The shared-guidance review covers account access, WooCommerce credentials and additional DBA setup. It identifies related human instructions, Agents outcomes and task-plan citations. Optional local review follows the private skill's actual source citations. Public CI reports only the public dependencies and never reads or uploads the skill. Changes to the credential illustration shared by Shopify and WooCommerce trigger review for both consumers.

Editorial corrections distinguish another website for the same DBA from an additional DBA, identify the documented WooCommerce plugin without SMB, and align Shopify ownership and setup prerequisites. The task plans preserve custom-checkout enablement and recovery requirements, payout bank-credit checks and merchant-versus-gateway reconciliation. Pricing, article bodies, design-system ownership, provider destinations and indexing decisions remain unchanged.

All four release gates passed for this candidate: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package`. The full run passed 1,028 unit tests, 554 browser checks and 1,339 accessibility checks, with two expected desktop skips for mobile-only controls. Production SEO verified 3,769 eligible URLs and the exact preview protections. Source, export and package fingerprints match. Additional completed responsive review covered 21 linked pages at four browser/viewport settings, all 40 paths on desktop and mobile, and 59 page or section links. Detailed evidence remains private.

The private setup skill was reviewed against this candidate, including its 11 cited website pages and saved-brief continuation rules. It remains excluded from GitHub and the website package. A saved plan reference identifies instruction text, not account readiness; the owning guide takes precedence and unmet approval, access or capability gates still stop the work.

The user authorized pushing, merging after required checks, and deployment of this candidate on 24 November 2026. Follow the reviewed feature-branch PR and manual Netlify Git-build process. Hosted CI, the exact merged and deployed commits, and live verification results are recorded in the release handoff as they complete. Actual merchant-account actions, live payments, booking confirmation emails and field performance were not tested by these local checks. The real calendar booking test remains deferred.

Future guidance changes follow the [versioned handoff](GITHUB_DELIVERY.md#versioned-guidance-handoff): update the owning guide, review affected human and Agents instructions, check the optional private skill, test the journey and record the exact candidate. A reference map is a review aid, not factual or release approval. Revalidate changed inputs before publication.

Use [source precedence](SOURCE_PRECEDENCE.md), [public site architecture](PUBLIC_SITE_ARCHITECTURE.md), [repository guide](REPOSITORY_GUIDE.md) and [project targets](../project-targets.json) for project boundaries and ownership.
