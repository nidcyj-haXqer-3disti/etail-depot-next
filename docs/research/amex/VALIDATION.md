# Research integrity and evidence receipt

Date: 2026-09-08. Branch: `feature/EDN-003-foundation`. Research base: `123288d`. Environment: macOS/Darwin, local Python 3.9.6 and Git. This receipt validates documentation and comparison-inventory integrity; it is not application, financial, security, hosted-provider or Amex-certification test evidence.

## Executed checks

| Command / check | Exit | Result |
|---|---:|---|
| `python3 /private/tmp/edn-amex-validate.py` — task-local read-only research validator | 0 | Source IDs/schema/date/HTTPS fields, pinned GitHub file revisions, source citations, task/issue mappings, JSON/Markdown acceptance agreement and local links passed. |
| `git diff --check` | 0 | No whitespace errors. |
| `pdftoppm` selected-page renders | 0 | Four source pages rendered and visually inspected as described below. |

Validation totals: 137 source records; 135 normalized distinct URLs; 62 Amex product/program/reporting sources and 73 upstream references; 90 unique comparison tasks, 18 per domain; 71 critical tasks; 20 mandatory gates; 54 local Markdown links checked. Every comparison row has proposed design, unassessed implementation and an empty evidence array. No implementation score was awarded. URL normalization removes query strings and trailing slashes, and failed/excluded records do not count.

The temporary validator reads all four `*-sources.json` registers, checks each required field and unique source ID, verifies 40-character commit pins for GitHub file links, then resolves every comparison source and EDN issue against the registers/backlog. It checks all 90 acceptance texts/source mappings against the rendered Markdown catalog, all five 18-task domain counts, all critical/gate counts, and local Markdown file targets. It also requires every registered source ID to be cited in the research narrative and runs `git diff --check`. It does not make live HTTP requests or inspect application behavior.

## Independent content review

Issuing and merchant reviewers independently checked the architecture/catalog. Applied fixes: specify adult pay-in-full in the linked-purchase example and preserve no child repayment obligation; add closure/offboarding; avoid holder-exclusive activation for supervised users; correct settlement and prior-refund source mappings; keep full operations under M5. No reviewer claimed access to private Amex internals.

## Source and visual evidence limits

Registers include only sources reported as opened/read by the assigned researcher. Failed and excluded sources remain separate. URL counts normalize query strings and trailing slashes; distinct records can point to the same source. Source citations and commit-pinned upstream links are validated structurally; no claim every external link will remain accessible is made. Some public web retrievals failed on repeat while another official read method succeeded.

The public Account Manager PDF was fetched to temporary storage and rendered at pp. 3–4; the reconciliation administrator guide at p. 21; the reporting guide at p. 13. All four rendered pages were inspected. `pdftoppm` exited 0; the reporting/reconciliation render emitted nonfatal font-weight warnings, with legible inspected output. Web screenshot attempts did not deliver usable image output and were not treated as visual evidence.

No application tests were rerun. No upstream code was executed or installed. Original source workbooks, package lockfile, application source, SQL schema, live accounts and hosting configuration were unchanged.
