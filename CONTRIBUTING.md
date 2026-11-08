# Contributing to the public website

Read the [README](README.md), [current work context](docs/CURRENT_WORK_CONTEXT.md), [repository guide](docs/REPOSITORY_GUIDE.md) and [source precedence](docs/SOURCE_PRECEDENCE.md). Archived specifications do not authorize restoring retired account or payment systems.

## Choose the work area

A branch is an independent copy of the whole repository, not a special folder assigned to one person. Agree the outcome and affected files before starting. Use the business feature that owns the page; use shared folders only for behavior genuinely shared across pages.

| Work | Primary location |
| --- | --- |
| Home, a service, a use case, Pricing, a resource or Company page | Its folder in `src/features/` and existing route wrapper in `src/app/` |
| Header, footer, logos, common UI or site facts | `src/shared/` |
| Browser/unit checks, generators, packaging, CI or hosting support | `tests/`, `tools/`, `.github/` or `netlify/` |
| Instructions and current project records | `docs/` |

The public Developers section is a customer-facing product area. Managing the project team belongs here and in engineering documentation. No Etail API or SDK is added by assigning an engineering task.

## Branch and review workflow

1. Agree the scope in an issue or task. For a substantial behavior, dependency, commercial or architecture change, obtain the relevant maintainer decision first.
2. Start a descriptive feature branch from the agreed base. Use `codex/` for agent branches; for example, `codex/services-refunds-copy` or `codex/engineering-build-checks`.
3. External contributors use a fork. Existing collaborators can use a feature branch in this repository. Each developer uses their own checkout or worktree.
4. Keep changes focused. Shared tools and the lockfile belong to the project, not to an individual developer. Personal scripts and review captures stay in ignored local folders.
5. Coordinate edits to shared navigation, design tokens, pricing, legal sources, the lockfile and release checks. If two branches touch the same lines, review the conflict together; never discard the other change just to complete a merge.
6. Update the branch against its agreed base without rewriting shared history. Recheck the combined result. Separate files can still have incompatible assumptions.
7. Review the exact diff, push only when authorized, and open a pull request against this repository's `main` branch. Use the [GitHub delivery procedure](docs/GITHUB_DELIVERY.md).

Do not invent team members or CODEOWNERS entries. Assign a real maintainer/reviewer in the issue or PR. Changing GitHub permissions or branch protections is a separate settings action.

## Verify the change

Use the pinned Node and pnpm versions and one lockfile. For application changes, run `pnpm verify`; [test and evidence requirements](docs/TEST_AND_EVIDENCE.md) describe the gates. For documentation-only changes, verify linked paths, instructions and formatting, and report which application checks were not rerun. A release candidate still needs all four required release commands.

For UI work, follow the [page paint standard](docs/PAGE_PAINT_STANDARDS.md), test affected desktop and phone flows, and inspect keyboard navigation, focus, wrapping and overflow. Add a meaningful regression only when it covers a real behavior or failure. Do not weaken assertions to make a build pass.

Keep actual failures and successful reruns visible. CI must belong to the exact proposed source; a previous passing branch does not prove a new merge is correct.

## Keep publication boundaries clear

Do not commit environment credentials, customer records, unredacted account captures, generated website output or local review files. [File publication policy](docs/FILE_PUBLICATION_POLICY.md) separates public source from public website assets. Do not edit archived migrations, run old provisioning scripts or reconnect a retired database.

A reviewed PR merge and a production deployment are separate actions. Follow the user's applicable authorization and the [manual deployment runbook](docs/NETLIFY_DEPLOYMENT.md). Product questions belong in the [Help center](https://etaildepot.com/help); potential vulnerabilities go privately to [compliance@etaildepot.com](mailto:compliance@etaildepot.com).
