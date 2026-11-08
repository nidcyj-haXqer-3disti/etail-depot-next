# Shared website tools

These tools belong to the project and are used by all contributors. Keep command entry points here so local scripts, CI and Netlify use the same implementation. Personal helpers and unredacted evidence belong in ignored local folders.

| Tool or data | Purpose |
| --- | --- |
| `build-public-site.mjs` | Validate the source, export the public website and record its fingerprint |
| `preview-public-site.mjs` | Serve the export through the existing local request boundary |
| `package-public-site.mjs` | Package static output, the Edge boundary and protected platform email handler without deploying |
| `verify-architecture.mjs` | Verify exact source/runtime scope and, with `--artifacts`, packaged files |
| `verify-file-publication.mjs` | Classify Git candidates and reject private or development files in public assets |
| `verify-security.mjs` | Scan active source for credential exposure and unsafe browser handling |
| `verify-production-seo.mjs` | Verify production indexing and negative hosting contexts locally |
| `verify-reference-release.mjs` | Verify approved legal/reference source hashes and licence scope |
| `verify-lint-glob.mjs` | Verify the reviewed lint-tooling path behavior |
| `reference-release.json` | Stable build-check manifest; source-only, never a website download |
| `generate-inline-brand-images.mjs` | Maintain the existing embedded brand system and approved asset copies |
| `generate-guide-image-previews.mjs` | Generate the exact guide preview images and bindings; `--check` verifies without rewriting them |
| `generate-social-previews.mjs` | Generate approved social artwork from the existing page inventory |
| `assets/guide-image-sources.mjs` | Reviewed guide image frames |
| `assets/guide-image-previews.json` | Generated image sizes and byte-hash receipt |
| Other `public-*` and `netlify-email-compat.ts` modules | Shared package policies, identity checks and protected email compatibility |

Use pinned Node and pnpm with the frozen lockfile. The exact approved page counts and source scope come from [reference-release.json](reference-release.json); do not maintain a second hardcoded total here.

Run the four release commands in order: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify`, `pnpm verify:package`. `package:review` and `verify:package:review` prepare a separate local noindex package. None uploads, deploys or submits URLs to search engines. Follow the [manual deployment runbook](../docs/NETLIFY_DEPLOYMENT.md) only when publication is authorized.

Guide generator paths resolve from the repository root. Image outputs remain under their owning `src/features/resources/integrations/` assets directories. Keep pixels, redactions, source receipts and loading behavior intact. Do not bypass a failed hash check by replacing the expected value without reviewing its source.
