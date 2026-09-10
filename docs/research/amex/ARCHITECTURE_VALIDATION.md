# Architecture investigation: evidence and validation receipt

Date: 2026-09-08. Branch: `feature/EDN-003-foundation`. Research base: `e08021aaf33be1692bc02a7d116eb7ab59491ab5`. Local environment: macOS/Darwin 25.6.0, Python 3.9.6, Git and bundled Poppler. This is documentation/research evidence, not application, live-provider, certification or performance-test evidence.

## Scope and counts

The follow-up delivers a synthesis, four focused studies and four new evidence registers:

| Register | Included records | Limits |
|---|---:|---|
| Platform P01–P10 | 10 | Eight architectural/approval/practice sources plus two conference-provenance records; historical certification is not current deployment proof. |
| Vendor V01–V13 | 13 | Includes dated cases, limited provider claims, one recruitment signal and explicitly separate entities/connections. V14/V15 are failed reads and excluded. |
| Data T01–T10 | 10 | Eight substantive engineering/research/library sources and two limited-adoption records. Related research records are not separate deployed systems. |
| Engineering E01–E13 | 13 | Nine revision-pinned source files, one published engineering design, three patent publications. |

New phase: **46 included records / 46 normalized distinct URLs**, plus 18 failed/excluded/limited-lead records outside that count. Entire research package: **183 included records / 181 normalized distinct URLs**. These are source counts, not deployment counts, verified-system counts or progress percentages. Normalization lowercases the hostname, ignores query/fragment and trims a trailing slash; it does not collapse different hostnames or unrelated pages about one project.

The original public-product inventory remains 90 tasks, 18 per domain, 71 critical rows and 20 mandatory gates. It is unchanged by this task. Twelve new architecture review refinements are separately versioned and all remain proposed/unassessed with empty evidence arrays. No milestone or comparison task is completed by research.

## Executed documentation checks

The task-local validator at `/private/tmp/edn-amex-architecture-validate.py` checks JSON parsing, included/excluded counts, global unique evidence IDs, required source metadata, HTTPS URLs, citation presence, nine full GitHub revision pins, local Markdown targets, EDN issue references, twelve unassessed architecture gates and the unchanged product comparison. It does not re-fetch all external URLs, run upstream code or test application behavior.

| Check | Exit | Result |
|---|---:|---|
| `python3 /private/tmp/edn-amex-architecture-validate.py` | 0 | Counts, metadata, citations, revision pins, 91 local Markdown links, issue mappings and gate states passed. Product comparison byte-identical to research base. |
| `git diff --check` | 0 | No whitespace errors. |
| Complete change: `git diff e08021a --check` | 0 | Final full research diff passes; an earlier staged check found two extra blank lines at EOF, which were removed. |
| Gravity ACS PDF: public read and first-page render | 0 | First page visually inspected; product/platform/version/approval/expiry labels verified. |

The Poppler render exited 0 but emitted repeated Fontconfig configuration/cache warnings. The produced page was legible and inspected; no rendering failure was hidden. The public PDF and its image are temporary local research files, not repository artifacts. Conference slide text was read; no embedded video was claimed as watched. The source-code study used pinned GitHub file reads; no upstream repository was executed or installed.

## Independent content review and corrections

- Two researchers independently reviewed the platform study. Corrected an ambiguous inter-cell replication arrow by omitting the undisclosed transport path. Changed issuer-only wording to an external-system boundary with issuer as an example.
- Clarified that pre-dispatch internal reservations/effects also require stable identities; being before an external call is not itself proof that replay is safe.
- Kept durable journals/audit separate from diagnostic logs that may degrade. No proposed financial evidence is droppable.
- NVIDIA's LSTM/GRU discrepancy remains unresolved and visible; subsystem inference latency is never treated as a full authorization SLA.
- Finastra is scoped to cardholder remittances; Pega testimony does not establish Amex Smart Dispute; GBT/Swisscard/BAC systems are not assigned to Amex's global card core.
- Recruitment notices establish intended work; patents establish proposed inventions; code establishes behavior at a revision. None is silently promoted to a current deployed topology.
- Final independent review of the synthesis and twelve-gate inventory found no material inconsistency, unsupported production assertion or completed-implementation claim.

## State preserved

No application code, database schema, runtime dependency, original workbook, product economics, comparison denominator or deployment/access configuration changed. No vendor contact, partner application, private-portal login, old Etail resource access, repository push/PR/merge or public release occurred. Application tests were not rerun for documentation-only changes; previous application evidence remains tied to its recorded SHA. This task ends with local research artifacts and proposed implementation gates, not a claim of continuing background work.
