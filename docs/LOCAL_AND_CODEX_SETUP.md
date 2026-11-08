# Local and CI setup

Use Node **24.19.0** and pnpm **11.19.0**, as pinned in [package.json](../package.json), [.nvmrc](../.nvmrc) and [the lockfile](../pnpm-lock.yaml). No database, Identity tenant, vendor credentials or production environment file is required.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

The static preview runs at `http://127.0.0.1:3100` and exercises the Edge request boundary. For UI development, stop it and run `pnpm dev --port 3100`. Development mode does not exercise the full hosting boundary.

Keep ports 3100 and 3101 free for verification. Install Chromium using `pnpm exec playwright install chromium`, then run `pnpm verify`. On Linux, `pnpm exec playwright install --with-deps chromium` also installs required system libraries. Use the same pinned runtime in local and CI checks.

Ordinary local builds remain noindex with an empty sitemap. Production SEO checks and package preparation intentionally generate the exact production context locally without publishing it. The preview boundary still protects preview/unapproved contexts; rebuild with `pnpm build` when returning to the ordinary local export. Do not place production markers in an environment file to imitate production.

Coding agents read [AGENTS.md](../AGENTS.md) and the current instructions it names. Use [CONTRIBUTING.md](../CONTRIBUTING.md) for collaboration, [the tools guide](../tools/README.md) for shared commands, and [current work context](CURRENT_WORK_CONTEXT.md) for status. Never run retired provisioning, migration or financial-platform scripts from the archive.
