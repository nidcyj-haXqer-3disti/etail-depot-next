# Etail Depot public website

Read `project-targets.json`, `docs/CURRENT_WORK_CONTEXT.md`, `docs/SOURCE_PRECEDENCE.md`, `docs/PUBLIC_SITE_ARCHITECTURE.md` and `planning/STATUS.md` before changes.

## Scope

Only the public website and approved vendor links are active. The 28 October 2026 candidate has 3,725 exact pages and 3,723 search eligible URLs. Preparation is authorized; pushing, merging and deploying need applicable release authorization. Do not infer publication from a passing local check.

Preserve one Shell, header, footer and design system. Preserve pricing, eligibility and source notes. Use plain language and avoid dash punctuation in authored public prose. Technical identifiers, URLs, licence notices, addresses and mathematical notation keep their required characters.

No Etail account application, checkout processing, API, KYC, ledger, database adapter or payment runtime may be added. Merchant handoff uses https://trolleys.ai without referrers or forwarded input. Card applications remain closed. Keep the enabled Netlify Emails extension and its settings; only its pinned authenticated POST handler is allowed.

## Boundaries

Use only the exact repository and site IDs in `project-targets.json`. Preserve denied projects, data, Identity, DNS, email records and resources. Do not modify archived migrations. Retirement routing is read only and must never read or forward submitted bodies. Preserve the exact production indexing guard, preview noindex and empty preview sitemap.

Independent 8583 sources are distinct from ISO republication permission. Keep the excluded reproduced tables out of public source and packages. New reference data requires source, licence and scope review.

## Delivery

Use pinned Node, pnpm and one lockfile. Read installed Next.js documentation before framework changes. Use a feature branch and review the exact diff. No force push or direct main feature changes.

Run `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package` for release candidates. Record failures, corrections, final results and remaining hosted checks. Preserve the manual publication process in `docs/NETLIFY_DEPLOYMENT.md`.
