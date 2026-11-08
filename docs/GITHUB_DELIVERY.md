# GitHub review and merge

The target is [nidcyj-haXqer-3disti/etail-depot-next](https://github.com/nidcyj-haXqer-3disti/etail-depot-next), repository ID `1361184741`, as bound in [project-targets.json](../project-targets.json). Current release authorization is recorded in [CURRENT_WORK_CONTEXT.md](CURRENT_WORK_CONTEXT.md).

## Before a push

Review the exact diff and file placement. Use a feature branch, preserve unrelated work, and follow [CONTRIBUTING.md](../CONTRIBUTING.md). Private working material must stay outside Git. A passing check is not permission to upload or publish a candidate outside the authorized scope.

Run the applicable local checks and record failures and corrections. Release candidates require the four commands in [TEST_AND_EVIDENCE.md](TEST_AND_EVIDENCE.md). Do not use force push or push feature changes directly to `main`.

## Pull request and integration

Open a focused PR against this repository's `main`. Explain the resulting change, affected business or engineering files and validation. Assign the actual maintainer/reviewer; do not invent owners.

[The existing workflow](../.github/workflows/foundation.yml) checks the exact repository ID, commit, pinned runtime and disabled financial release before running the required checks. A fork-local workflow does not satisfy the upstream identity binding. A maintainer may need to approve a new contributor's upstream workflow run.

When another change lands on the base branch, inspect the combined diff and resolve conflicts deliberately. Different files can still depend on the same navigation facts, shared styling or build behavior. Revalidate the combined candidate. Check the exact PR/merge source that will be published, not a stale successful run. A synthetic PR merge commit may differ from the feature head; record the identity and relationship.

Merge only under applicable authorization after review and passing checks. Do not bypass protection settings, change CI to manufacture success or infer deployment approval from repository write access. This procedure does not configure branch protections or team permissions.

## After merge

Merging source and publishing the website are separate actions. Follow the existing [manual Netlify Git-build procedure](NETLIFY_DEPLOYMENT.md) only with release authorization. Record the deployed commit and hosted checks separately. The original 2026-09-10 GitHub delivery receipt is preserved in [history](../archive/project-history/docs/GITHUB_DELIVERY.md).
