# Business 360 review: evidence and validation

Research date: **2026-09-08**. Local branch: `feature/EDN-003-foundation`. Documentation base: `ba57173c6a77b10741ca42b57d5dd2ec1d95bfe6`.

## What was reviewed

The [main review](BUSINESS_360_REVIEW.md) and three area reviews cover business and customer operations, following the user's correction. Four inventories contain 85 checks: 24 issuing, 25 account control, 24 merchant operations and 12 connected journeys. Reference evidence classifications total 35 documented, 42 partial and 8 gaps. These are not passed application tests or a percentage of similarity to Amex.

The public-source pass uses Amex's product/support guidance, program-administrator guides, merchant portal learning materials and relevant portions of a publicly linked provider-merchant disputes guide. Source records retain country, program, date, access limits and exclusions. US behavior is the baseline; UK support/life-event examples are labelled regional. Signed-in workflows were not exercised.

Source files contain 52 included records across 51 URLs: 51 public records opened and read, plus J01's limited indexed product-shopping copy. This count includes revisited sources and does not mean 52 new discoveries. Merchant exclusions N03–N06 are outside the included count. Other unresolved/excluded research leads are separately described in their registers. The 2024TPP guide was read in the listed relevant portions, not every page. Earlier studies remain the source of referenced I/A/M observations unless the new register records a recheck.

## Interpretation of checks

The issuing inventory's `normal_flow` and `exceptions` summarize observed Amex guidance; its handoffs, `etail_gap` and acceptance scenarios are proposed Etail behavior. The control, merchant and connected inventories use proposed Etail business flows informed by their cited sources. Each inventory records its interpretation. A source can document part of a task while a related exception remains partial or unknown.

`comparison_ids` links related tasks in the unchanged 90-task catalog. An empty array identifies a check without a distinct corresponding row. There is deliberate overlap between area checks and connected journeys, so neither their count nor their evidence classifications can be used as an implementation percentage.

## Executed validation

Environment: Darwin 25.6.0, Python 3.9.6. This is documentation validation; application tests are not required or claimed for this research-only change.

| Command/check | Result |
|---|---|
| `python3 /private/tmp/edn-amex-business-360-validate.py` | Exit 0: all four check inventories and four source registers parse; 85 unique checks; valid source/comparison references; required actors, flows, exceptions, handoffs and acceptance scenarios present. |
| Source metadata and classifications | Pass: dated, scoped official HTTPS references; 52 included records/51 URLs; J01 limited; four merchant leads explicitly excluded from substantive use. |
| Local Markdown targets | Pass: 86 links in the changed Markdown documents resolve. |
| Baseline comparison | Pass: the 90-task catalog, its 20 mandatory gates, the separate architecture-gate file, backlog, commercial rules and explicit project targets remain byte-identical to the recorded base. |
| Changed-path review | Pass: 19 documentation/research/planning files; no application, schema, dependency or workbook edits. |
| `git diff ba57173c6a77b10741ca42b57d5dd2ec1d95bfe6 --check` and `git diff --cached --check` | Final exit 0. The first full staged check exited 2 for one extra blank line at the issuing review's end; that formatting issue was corrected before the final check. |

Validator SHA-256: `62ef23a02ebb820d6f813ade14c22f3097a46f860d88e67add0cfc1e47e6e3d6`. Checks without a distinct AX mapping: 7 issuing, 3 control, 8 merchant and 3 connected. These counts expose baseline gaps; they do not add scored points.

## Independent review and retained limits

- Account-control review checked the main review and connected scenarios for responsibility/permission conflation. Its employee-exit source suggestion was incorporated.
- Merchant review checked the same material for unsupported funds, bank-change, reserve, dispute and closure claims. No material overclaim remained; timing and responsibility gaps stay explicit.
- Each area reviewer checked its source and comparison references and fictional acceptance scenarios. Root reviewed and consolidated all three narratives.
- D14–D17 and other unresolved business terms are not silently answered by an Amex example. No milestone, financial feature or end-to-end journey is marked implemented by this audit.

No application, database, dependency, original workbook, hosting setting or external account was changed. No remote push, PR, merge, deployment, payment, application, account modification or external message was performed. The earlier application-test evidence remains tied to its original source commit.
