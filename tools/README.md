# Public website tools

Use the pinned runtime and frozen lockfile. `pnpm verify:public` checks source, browser behavior, accessibility and security. `pnpm test:seo:production` checks the exact production export and negative deployment contexts. `pnpm package:netlify` prepares static content, the Edge boundary and the protected platform Emails handler. `pnpm verify:package` checks exact source and output consistency.

`package:review` and `verify:package:review` prepare a separate local noindex package. None of these commands publishes or submits to a search engine. See docs/NETLIFY_DEPLOYMENT.md for the manual release workflow.

The frozen inventory contains 3,725 pages with 3,723 nonlegal sitemap URLs. New routes require scope review. Reference data and licence changes require updating the reviewed receipt, not bypassing its hash checks. Private research and retired content must never enter the package.
