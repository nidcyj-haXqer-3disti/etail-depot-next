# Local and CI setup

Use Node 24.19.0 and pnpm 11.19.0 with the frozen pnpm lockfile. No database, Identity tenant, vendor credentials or production environment file is needed.

Run `pnpm install --frozen-lockfile`, `pnpm build` and `pnpm preview` for a static local preview on port 3100. `pnpm dev --port 3100` is available for UI development. Static preview exercises the actual Edge boundary; development mode does not.

Keep ports 3100 and 3101 free for verification. Install Chromium with `pnpm exec playwright install chromium`, then run `pnpm verify`. CI installs Chromium system dependencies on Linux. The complete checks cover lint, types, unit tests, browser journeys, accessibility, security, production search metadata and the deployment package.

Local previews remain noindex with an empty sitemap. Production SEO checks and package preparation intentionally build the exact approved production context, but never publish. Restore a local build before serving it as the ordinary preview, or use a separate source directory for production verification.

The exact scope, site and publication gates are documented in CURRENT_WORK_CONTEXT.md and NETLIFY_DEPLOYMENT.md. Do not run retired provisioning, migration or financial application tools. Keep the protected Emails integration enabled.
