# Historical technical records

This archive contains public engineering history, not current implementation instructions or private storage. Current work starts with [the repository guide](../docs/REPOSITORY_GUIDE.md), [source precedence](../docs/SOURCE_PRECEDENCE.md) and [work context](../docs/CURRENT_WORK_CONTEXT.md).

## What stays in GitHub

| Location | Retained records | Files |
| --- | --- | ---: |
| `database/` | Immutable migrations, snapshots, schemas, manifest and read-only audit | 74 |
| `project-history/` | Technical decisions, security and access design, release evidence, asset provenance and implementation traceability | 75 |
| `retired-platform/contracts/` | Historical API, workflow, acceptance and regression specifications | 9 |
| `retired-platform/assets/brand/` | Supplied brand originals and their provenance note | 3 |
| `bootstrap/` | Original handoff validation and package manifest | 2 |
| This index | Retention and recovery instructions | 1 |

These 164 files remain outside active runtime imports and website output. Retired platform contracts describe the former application, not today's merchant legal agreements. Current customer-facing provisions belong to `src/features/company/legal/`.

## What moved to local work

The selective cleanup on 9 November 2026 reduced this archive from 319 to 164 files. Four original supplied reference documents were copied to `local-work/input/archive-trim-20261109/`. Another 151 superseded research, prompt, template, planning and presentation files were copied to `local-work/output/archive-trim-20261109/`. The copies preserve their archive-relative paths. Every copy was checked against its SHA-256 digest before its repository copy was removed. The detailed inventory and verification receipt stay in that local output bundle.

This is a working-tree cleanup, not a rewrite of Git history. Previously committed material remains public in earlier commits. Moving it locally does not make those earlier versions confidential.

## Find earlier records

The [complete archive before cleanup](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/tree/b62ff7e5e033313a77eb53e6a1110e6d427e946c/archive) remains available at the pinned commit. Use that snapshot to find removed records or follow historical references. Existing technical records retain their original paths and bytes; older relative links, commands and approvals describe their recorded stage and may refer to retired locations.

The [Stage 4 migration receipt](../docs/plans/repository-stage4.json) records the earlier restructure, before this trim. It remains a dated record of that move, not an assertion that every archived destination is still in the current checkout. Later records in `docs/plans/` are preserved unchanged.

Do not execute archived prompts, restore retired runtimes or reuse old publication approvals. Keep every file under `database/` unchanged. Any future database work requires separate authorization and the recovery boundaries in [its README](database/README.md).
