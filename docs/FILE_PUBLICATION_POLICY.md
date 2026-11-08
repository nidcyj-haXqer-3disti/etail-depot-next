# File publication policy

GitHub and the website are separate publication destinations. This repository is public. A file kept in GitHub is readable by anyone even when it returns 404 on etaildepot.com.

| File category | Location | GitHub | Website |
| --- | --- | --- | --- |
| Website inputs | `src/` and reviewed assets in `public/` | Yes | Compiled pages, scripts, styles and approved assets |
| Development and build files | `tools/`, `tests/`, `.github/`, project configuration and public contributor documentation | Yes | No raw source files |
| Private working material | `.local/`, `.private/`, `outputs/`, `artifacts/`, credentials and unredacted captures | No | No |

The only static publish folder is `.netlify/static/`, produced from the verified `out/` export. Both are generated and excluded from Git. The existing approved Edge boundary and protected Emails handler are packaged separately. Do not deploy the repository root or copy source directories into `public/`.

## Build-check manifest

`tools/reference-release.json` belongs in GitHub. It records reviewed page counts, reference licensing and content hashes used by the build checks. The user approved keeping it in public source on 8 November 2026. That placement decision does not require repeated approval for routine count updates. Changes to legal content, source licensing or release scope still follow their existing review rules.

Neither `/tools/reference-release.json` nor `/reference-release.json` is a website resource. Both must return HTTP 404, not a download or a redirect. The publication checks also reject this filename if copied into another asset directory.

## Before each push

1. Put new private notes, credentials and original account captures in an ignored local directory. Existing tracked documentation is public; `.gitignore` does not make a previously committed file private.
2. Run `pnpm test:publication`. It lists counts for website inputs and repository-only files, and fails for local-only files in the Git candidate, unknown file locations, symlinks or development files inside `public/`. It checks tracked files and nonignored new files. Ignored files under `public/` are inspected separately.
3. Review the exact diff and staged files. To save the complete destination list locally, run `mkdir -p .local` then `pnpm --silent test:publication --json > .local/file-publication-report.json`. A destination classification is not approval of a file's contents. Keep the existing credential scan, screenshot review and licensing checks.
4. Run the required release commands: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package`. File publication checks run automatically during architecture verification and before builds. Final artifact checks reject source/configuration files and confirm the package is exactly the reviewed export plus security headers.
5. Follow the existing PR and manual deployment process in `NETLIFY_DEPLOYMENT.md`. After deployment, confirm the two build-check URLs return 404, alongside the normal hosted checks.

Unknown new file locations require a deliberate update to `tools/file-publication-policy.ts`. Do not add exceptions to hide a failed check. No check moves, deletes, stages, pushes or deploys files. Source hosting approvals and deployment authorization remain separate; these checks cannot override an external security review.

## Existing records

Tracked historical documentation, contracts and archived development records remain repository-only. This policy neither republishes them on the website nor changes their existing public Git history. Keep archived migrations unchanged. New confidential material belongs outside the tracked documentation folders.
