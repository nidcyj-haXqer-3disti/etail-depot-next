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
