# File publication policy

GitHub and the website are separate publication destinations. This repository is public. A file kept in GitHub is readable by anyone even when it returns 404 on etaildepot.com.

| File category | Location | GitHub | Website |
| --- | --- | --- | --- |
| Website inputs | `src/` and reviewed assets in `public/` | Yes | Compiled pages, scripts, styles and approved assets |
| Development and build files | `tools/`, `tests/`, `.github/`, project configuration and public contributor documentation | Yes | No raw source files |
| Private working material | External `local-work/input/` and `local-work/output/`, ignored tool state and compatibility shortcuts, credentials and unredacted captures | No | No |

The only static publish folder is `.netlify/static/`, produced from the verified `out/` export. Both are generated and excluded from Git. The existing approved Edge boundary and protected Emails handler are packaged separately. Do not deploy the repository root or copy source directories into `public/`.

## Build-check manifest

`tools/reference-release.json` belongs in GitHub. It records reviewed page counts, reference licensing and content hashes used by the build checks. The user approved keeping it in public source on 8 November 2026. That placement decision does not require repeated approval for routine count updates. Changes to legal content, source licensing or release scope still follow their existing review rules.

Neither `/tools/reference-release.json` nor `/reference-release.json` is a website resource. Both must return HTTP 404, not a download or a redirect. The publication checks also reject this filename if copied into another asset directory.

## Before each push

1. Put supplied documents and references in the external `local-work/input/` folder, and generated working material in `local-work/output/`. Credentials remain in approved private storage. Existing tracked documentation is public; `.gitignore` does not make a previously committed file private. Keep compatibility shortcuts ignored and outside `public/`.
2. Run `pnpm test:publication`. It lists counts for website inputs and repository-only files, and fails for local-only files in the Git candidate, unknown file locations, symlinks or development files inside `public/`. It checks tracked files and nonignored new files. Ignored files under `public/` are inspected separately.
3. Review the exact diff and staged files. To save the complete destination list locally, run `mkdir -p .local` then `pnpm --silent test:publication --json > .local/file-publication-report.json`. A destination classification is not approval of a file's contents. Keep the existing credential scan, screenshot review and licensing checks.
4. Run the required release commands: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify` and `pnpm verify:package`. File publication checks run automatically during architecture verification and before builds. Final artifact checks reject source/configuration files and confirm the package is exactly the reviewed export plus security headers.
5. Follow the existing PR and manual deployment process in `NETLIFY_DEPLOYMENT.md`. After deployment, confirm the two build-check URLs return 404, alongside the normal hosted checks.

Unknown new file locations require a deliberate update to `tools/file-publication-policy.ts`. Do not add exceptions to hide a failed check. No check moves, deletes, stages, pushes or deploys files. Source hosting approvals and deployment authorization remain separate; these checks cannot override an external security review.

## Existing records

Selected technical records remain under `archive/bootstrap/`, `archive/project-history/` and `archive/retired-platform/`. The existing `archive/database/` remains unchanged. Superseded research, prompts, templates and presentation reviews have been moved to local work; the [archive index](../archive/README.md) records retention and recovery. Retained files remain repository-only. This policy neither republishes them on the website nor changes their existing public Git history. Keep archived migrations unchanged. New confidential material belongs outside the tracked documentation folders.

Current file ownership is documented in [REPOSITORY_GUIDE.md](REPOSITORY_GUIDE.md). Only the root `.env.example` is an approved configuration sample. The obsolete archived template and its exception have been removed; other environment files remain local-only. Archived instructions are not an active setup guide.

## Retired folder names

New source must use the current nine top-level folders shown in the repository guide. The old root locations `assets/`, `contracts/`, `planning/`, `prompts/`, `sources/` and `templates/`, and the five original bootstrap filenames are no longer accepted root source locations. Selected technical copies remain in the archive; obsolete setup prompts are in local work and earlier Git history. The old names stay blocked in website output where applicable; removing a source exception must not make historical files publishable.

Root-level `local-work`, `input`, `output`, `outputs`, `artifacts` and `tmp` are ignored even when they are compatibility symlinks. The publication check still rejects them if they are force-added to Git. The external workspace remains the place for new private inputs and generated output.
