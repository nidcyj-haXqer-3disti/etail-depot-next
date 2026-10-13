# Local and CI setup for the public website

D139 maintainer refresh · 21 September 2026

The application already exists. D108 limits it to public pages and fixed vendor links. Read [AGENTS.md](../AGENTS.md), [project targets](../project-targets.json), [source precedence](SOURCE_PRECEDENCE.md) and [current status](../planning/STATUS.md) first. Do not scaffold a replacement repository, reconnect PostgreSQL or Identity, or restore the retired account application.

D163 / PR #34 / Netlify deploy `6ab20642fc4fee270b08924d` is the recorded published baseline. The current working branch has unpublished refinements; follow current status for release checks and unresolved dependency advisories. Local checks do not authorize publication.

## Pinned workspace

Use Node **24.19.0**, pnpm **11.19.0** and the existing `pnpm-lock.yaml`. Next.js, React, the Netlify adapter and tooling are pinned in `package.json`; install the frozen lockfile without replacing dependencies or adding another package manager.

Work in the existing `etail-depot-next` repository on a feature branch. The only bound GitHub repository is `nidcyj-haXqer-3disti/etail-depot-next` (ID `1361184741`), and the only bound Netlify site is `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`. Preserve every excluded resource in `project-targets.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

The production preview listens at `http://127.0.0.1:3100`. For development, use `pnpm dev --port 3100` instead. No database service, account fixture, authentication tenant, migration, seed or payment credential is required. `.env.example` documents optional local settings; do not copy production search markers or old account secrets into local configuration.

## Verification

Stop the task's own preview before verification and keep ports **3100 and 3101** free. Install the pinned Playwright Chromium browser when absent:

```sh
pnpm exec playwright install chromium
pnpm verify
```

The GitHub workflow uses `pnpm exec playwright install --with-deps chromium` on its Linux runner. The complete verification sequence is:

```sh
pnpm verify:public
pnpm test:seo:production
pnpm package:netlify
pnpm verify:package
```

Public checks cover lint, types, unit behavior, architecture, a production build, browser journeys, accessibility and source/dependency security. The SEO check builds and serves a temporary local production-configured instance on port 3101. Packaging uses the pinned Netlify adapter offline for the exact site; artifact inspection excludes private and archived inputs. None of these commands publishes, creates accounts, enrolls a service or changes stored records.

The workflow in `.github/workflows/foundation.yml` checks the exact repository, commit, Node and pnpm versions, installs the frozen lockfile and runs the same gates with read-only repository permissions. Do not restore historical database/API/authentication test scripts to satisfy old task inventories. Record actual failures, reruns and remaining gaps in `planning/STATUS.md` and the decision log.

## Preserved resources and publication

`archive/database` holds immutable schema/migration history, not a data backup. Existing databases and Identity records remain outside this runtime. Do not open them, run archived tools, apply migrations or change provider settings as part of setup or verification.

Production search permits only Home, Payments, Cards and Help for the exact approved site and environment. Local/preview, legal, 404 and retired pages remain noindex. Keep the guard intact. Manual publication follows the [reviewed deployment runbook](NETLIFY_DEPLOYMENT.md) and authorization already recorded for that candidate; a passing local check is not publication authorization.

## Historical setup archive

The text below predates D108. It is retained as historical source material only: its scaffold, database, Identity and command instructions are retired and must not be executed for this public website.

<details>
<summary>Retired setup brief — historical text</summary>

````markdown
# Codex/local environment setup

## No runtime assumptions from the old project

This seed has no `package.json`, application lockfile or app source. Codex must scaffold them and verify the actual current versions. Do not run an old publishing helper, download the previous application's dependency ZIP, or reuse its Node modules. One package manager: pnpm. Node runtime must be supported by both the selected Next.js release and Netlify; verify the current LTS at implementation time and pin the exact chosen patch in developer/CI configuration.

The package's Python helpers require Python 3.10+ and the standard library only. GitHub planning apply additionally needs an authorized `gh` binary; it is optional and defaults to dry run. Handoff validation requires neither a database nor cloud credentials.

## Local coding workspace

Open the extracted new root, then paste `01_PASTE_IN_CODEX.md`. Codex CLI/IDE integrations can work with a local directory. Verify the root is new and has no old remote before `git init`/creation. Network/install/tool permissions are part of the chosen Codex environment, not implied by this ZIP. [C3]

## Codex cloud

Codex cloud checks out a selected GitHub branch/revision. Import the package into the new private repository first, select/authorize that repository and configure its environment. Use environment setup to install pinned dependencies once the application lockfile exists. First scaffold task needs network access to obtain/verify packages and current official APIs; use an appropriate allowlist rather than unrestricted access by default. [C1]

Official cloud documentation distinguishes setup-time secrets from variables available throughout a task. Do not assume a secret provided only to setup scripts exists during agent execution, and do not persist it in a plain environment file to evade that boundary. Prefer authorized connected tools or a narrowly scoped deployment environment for later provider operations. Local/CI fake data needs no production secret. [C1]

## Real development and test services

Use one PostgreSQL schema and real PostgreSQL integration tests, typically an isolated local container/service. Network/database unavailability is a failed gate, not a reason to substitute an in-memory store or SQLite and claim compatibility. `netlify dev` exercises platform services when appropriate; `next start` is also tested as the real framework build. [N1]

Implement commands after scaffolding:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm test:contracts
pnpm test:concurrency
pnpm test:architecture
pnpm test:api
pnpm build
pnpm test:e2e
pnpm test:a11y
pnpm test:security
pnpm verify
pnpm exec netlify build
```

These names are a requested script interface, NOT existing commands in this handoff. Add real implementations and document database/Identity fixture setup. Keep screenshot and log outputs tied to exact test SHAs. CI and local test clocks must not overwrite the actual hosted clock.

## A task is not the whole project

Start with M0–M1 and the canonical Cards slice, then follow dependencies. A task that runs out of time must commit coherent work to its feature branch, document checks and blockers, and identify the next task. Never start a second design in the next task. Keep review/merge/public-deployment approvals explicit.

[C1] https://learn.chatgpt.com/docs/environments/cloud-environment
[C3] https://learn.chatgpt.com/docs/codex/cli
[N1] https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/
````

</details>
