# Handoff validation receipt

Prepared and checked 8 September 2026. **This is a build prompt/specification package, not a runnable application or a cloud deployment.** No new repository, Netlify site, database or user account was created by preparing it. Existing resources were not modified.

## Executed checks

| Check | Result |
|---|---|
| Python helper unit tests | **35 passed**; GitHub responses/mutations mocked; no network |
| Structural requirements and JSON parsing | Passed |
| Delivery-plan dependency graph | 32 unique tasks, 8 milestones, acyclic dependencies |
| Acceptance ownership | 72 unique acceptance cases; all assigned to delivery tasks |
| Planned API inventory | 44 unique core operations; no duplicate method/path; one card submission |
| Supplied arithmetic consistency | 17 checks passed, using exact Decimal/integer calculations |
| Original master and both workbooks | Byte-identical to supplied original ZIP |
| XLSX internal archive integrity | Both passed CRC checks; 21 worksheets inventoried |
| Brand PNG integrity | Both original logo/symbol files validated |
| Python syntax / YAML templates / TOML template | Parsed successfully |
| Authored relative Markdown links | Resolved |
| Planning-helper default execution | Dry run; no network calls or remote changes |
| Excluded content | No fonts, application dependencies, old app source, populated env files or customer records |
| Archive integrity and fresh-folder validation | Final ZIP is extracted and full hash/helper validation rerun before delivery |

`PACKAGE_MANIFEST.json` contains SHA-256 digests of every distributed file except itself. Validate the initial package before editing; intentional implementation edits will naturally differ from the original handoff hashes. The inventory separately anchors the unchanged source materials.

## Reproduce

From the extracted `etail-depot-next` root with Python 3.10 or newer:

```bash
python3 tools/verify_handoff.py
python3 -m unittest discover -s tests -p 'test_handoff_tools.py' -v
python3 tools/seed_github_plan.py
```

The final command is a dry run. The tests' GitHub import checks are mocked, not an actual upload. The complete cost workbook was not recalculated by handoff validation; its final implementation regression remains required.

## Application and hosted status

All 72 application acceptance cases intentionally remain **not implemented / not tested**. No new application build, PostgreSQL runtime test, live email test, actual account/card/payment action, GitHub provisioning, Netlify build or deployment has been executed for the new project. Historical application tests are not reused as new evidence. Codex must implement and verify these stages.

The proposed name `etail-depot-next` is not reserved and availability is not asserted. Follow target verification and user approval boundaries in `AGENTS.md` and `project-targets.json`.
