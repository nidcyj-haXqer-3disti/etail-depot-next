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

## Guidance change review

The existing check workflow adds a Guidance change review job summary for the account-access, WooCommerce-credentials and additional-DBA pilots. It validates references and lists related human page sections, Agents nodes and source files. It uses the candidate's map. When a file containing mapping definitions changes, it requests review of all pilots and asks the reviewer to inspect removed relationships in the diff. A separate task-plan section maps every reachable plan to its cited page sources and identifies affected result IDs. Review those plans even when the changed source is outside the three pilots. When the private skill is supplied for local review, its actual website citations also identify affected skill sections. Public CI never reads that private map or content.

| Run | Compared source |
| --- | --- |
| Pull request | Event base SHA against the exact tested merge SHA |
| Existing branch push | Event previous SHA against the checked-out SHA |
| New branch or manual run | All pilots, with changed-file coverage explicitly unavailable |

The check uses a direct comparison of committed trees. It fetches only a missing, validated base SHA from this bound public repository with depth one and no credentials. A required base that cannot be read fails the check; it never becomes an empty success. The existing action pins, read-only permissions and four release gates stay in place. No PR comments, artifacts, private skill uploads or publication are added.

For local review, run `pnpm review:guidance --base <comparison-commit> --markdown`. Local comparison includes committed, staged, unstaged and untracked changes. Use the optional `--skill-dir <local-skill-directory>` to validate private skill references; public CI always reports **Private skill not checked**. Keep reports containing private references in ignored local storage.

In the PR, record which affected instructions were reviewed, any corrections, and why no change was needed elsewhere. Files outside the pilot still need ordinary review. A valid map or empty impact list does not establish factual accuracy, account enablement, correct rendered anchors or release readiness. See [tool usage](../tools/README.md#guidance-change-review) for JSON output and exact scope.

## Versioned guidance handoff

Use the existing PR and release record, plus one dated receipt in ignored local storage. Do not create a second tracked inventory of page content. The task owner records the review; the maintainer authorizes publication. Public contributor context remains concise.

For each affected pilot, record the owning source, related human guidance, Agents nodes and private skill status. State the correction or why no related edit was needed. A green reference check alone is not a completed editorial review. Preserve unresolved items explicitly.

The private handoff records:

```text
Candidate: branch, comparison base, HEAD, dirty state and reviewed diff
Website identity: source fingerprint from the fresh build and matching package
Pilots: source revisions, reviewed sections/nodes and correction/no-change decisions
Private skill: reviewed / unavailable / not reviewed; exact candidate reviewed against
If reviewed: SHA-256 hashes of SKILL.md, references, dependency map and supporting files
Evidence: commands, results, failures/corrections and remaining checks
Delivery: local / pushed / merged / deployed; exact CI/merge/deploy IDs when available
Authorization: permitted next action and anything still on hold
```

Use `.next/public-build.json` and `.netlify/public-build.json` after the required release gates for build/package identity. The fingerprint covers active build, runtime, tests and packaging inputs; review documentation and the staged diff separately. `HEAD` alone does not identify uncommitted changes. The guidance JSON's source revisions identify guide files, not the whole website or private skill. A clean comparison can have no affected workflows even though references were validated. Hash the complete private skill package separately when recording its reviewed identity. None of these identities certifies factual correctness.

Keep previous receipts and create a new one when the candidate changes. After a merge or rebase, reconcile the actual commit with the reviewed fingerprint and checks; do not carry forward a stale green result. A change to the owning guide, provider procedure, mapped instructions or private skill requires review of the affected guidance before calling it current. If the skill is unavailable, mark it not reviewed and do not recommend it as aligned with this candidate. The public website can follow its own authorized release process independently.

After an authorized deployment, add the actual deployed commit, build fingerprint and hosted results to the receipt. A website rollback also requires checking the private skill against the restored website revision; rolling back the site does not roll back local skill files. Keep the skill on hold if the matching review is unavailable. Do not attach private receipts, skill files or account evidence to public CI, PRs or website assets.

## After merge

Merging source and publishing the website are separate actions. Follow the existing [manual Netlify Git-build procedure](NETLIFY_DEPLOYMENT.md) only with release authorization. Record the deployed commit and hosted checks separately. The original 2026-09-10 GitHub delivery receipt is preserved in [history](../archive/project-history/docs/GITHUB_DELIVERY.md).
