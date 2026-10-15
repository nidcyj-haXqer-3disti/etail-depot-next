# Contributing to Etail Depot

Thank you for helping improve the Etail Depot public website. Useful contributions include reproducible bug fixes, accessibility improvements, focused visual refinements, tests and clearer documentation.

## Before you start

Read the [README](README.md), [current work context](docs/CURRENT_WORK_CONTEXT.md) and [public architecture](docs/PUBLIC_SITE_ARCHITECTURE.md). This repository serves the existing public website. Older requirements and archived account code are historical; they do not expand its scope.

For substantial changes to product behavior, commercial wording, dependencies or architecture, open an issue to agree the approach first. Keep approved offers, legal disclosures, product availability, original logos and service destinations intact unless the maintainer has approved the specific change.

## Make a change

1. Fork the repository and clone your fork. Existing collaborators may work on a feature branch in the upstream repository.
2. Install the exact Node and pnpm versions and follow the [local setup](README.md#quick-start).
3. Create a descriptive branch, for example `git switch -c codex/improve-help-spacing`.
4. Make a focused change. Keep unrelated files and generated outputs out of the commit.
5. Run the relevant checks and inspect any affected pages.
6. Push your branch and open a pull request against `nidcyj-haXqer-3disti/etail-depot-next:main`.

Use `pnpm-lock.yaml` as the only dependency lockfile. Do not commit `.env` files, credentials, customer records, `node_modules`, build output or local review artifacts. Do not modify archived migrations, connect old databases or run retired account tools.

## Verify your work

For an application change, run the full sequence before requesting final review:

```sh
pnpm exec playwright install chromium
pnpm verify
```

Stop your own development/preview server first; ports 3100 and 3101 must be free. The [README checks](README.md#checks) explain the individual gates and Linux browser prerequisites. For a documentation-only change, check the instructions, linked paths and formatting; accurately report which application checks were not run. Maintainers still run the required release checks for a release candidate.

For UI changes, inspect the existing design at 1440px, 390px and 320px widths, and check keyboard navigation, focus states, wrapping and overflow. Include comparable before/after screenshots when they help review the change. Do not add a test that only repeats the implementation; cover the behavior or regression that matters.

GitHub checks are bound to the upstream repository and run on pull requests targeting its `main` branch. Workflows running inside a fork do not satisfy that binding. Run checks locally and submit the upstream pull request; do not change repository IDs or release controls to make fork-local Actions pass. A maintainer may need to approve a new contributor's workflow run.

## Write a useful pull request

Explain the problem, the resulting behavior and how you verified it. Include the related issue, relevant screenshots and any remaining limitations. Keep actual failures and successful reruns visible; do not describe a skipped check as passed.

Use a feature branch and request maintainer review. Do not push feature changes directly to `main` or rewrite shared history. Repository write permission allows merging, but does not replace review or the release process. CI and local packaging do not publish the site; production deployment remains a separate authorized maintainer action.

## Keep support information private

Public issues and pull requests must not contain account details, identity documents, payment information or credentials. Product questions belong in the [Help center](https://etaildepot.com/help). Report a potential security vulnerability privately to [compliance@etaildepot.com](mailto:compliance@etaildepot.com).

The repository does not currently have a repository-wide open-source license. See the [license and asset note](README.md#license-and-assets) before reusing code or brand assets.
