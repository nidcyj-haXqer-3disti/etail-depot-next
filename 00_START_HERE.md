# Etail Depot Next — start here

**This repository contains the working two-service sandbox and its requirements, research and delivery evidence.** It is no longer an unimplemented handoff package. Continue in this workspace and use the existing resources recorded in [project-targets.json](project-targets.json); do not provision another repository, site, database or Identity tenant to restart the project.

## Current task: review and plan before building

The user has paused implementation and requested a full video review followed by a product, technical and design plan. Review the evidence, document the intended journeys and resolve the active delivery order before making more application changes. Do not treat this entry document as authorization to resume implementation or deploy.

The target has exactly two services:

- **CARDHOLDER:** a primary cardholder oversees their card group; secondary cardholders use their own cards and permitted data.
- **MERCHANT:** a primary merchant oversees its own submerchants; delegated people work within their assigned merchant permissions. Permission to collect does not grant Cardholder access or primary financial authority.

Personal, Household and Seller account types in earlier source material are historical. Preserve the original requirements where they remain applicable, but do not rebuild that superseded customer model.

## Read in this order

1. [project-targets.json](project-targets.json) — exact owned resources and excluded legacy targets.
2. [Source precedence](docs/SOURCE_PRECEDENCE.md) — latest decisions and superseded instructions.
3. [Master brief](02_MASTER_BUILD_PROMPT.md) — current mandate and boundaries.
4. [Product and technical design](docs/PRODUCT_TECHNICAL_DESIGN.md) — proposed product journeys, architecture and design decisions.
5. [Delivery plan](planning/DELIVERY_PLAN.md) — active sequencing and acceptance gates.
6. [Implementation status](planning/STATUS.md) — actual work, verification and remaining gaps, including D62 email-access evidence.

[AGENTS.md](AGENTS.md) contains standing project instructions, subject to the latest explicit user decisions. [Video planning review](docs/research/VIDEO_PLANNING_REVIEW.md) records the requested review; distinguish watched material, text-only evidence and unavailable sources. [01_PASTE_IN_CODEX.md](01_PASTE_IN_CODEX.md) is the continuation prompt.

The original M0–M7 [backlog](planning/backlog.json), source workbooks and master in `sources/original/` remain the scope baseline. They do not replace the active delivery plan or prove that a feature exists. Earlier research and evidence remain historical where superseded.

## Preserve the working project

- Use only the GitHub repository, Netlify site and current database/Identity targets explicitly recorded for Etail Depot Next. Keep excluded Etail applications, credentials, customer data and DNS untouched.
- Keep `ENABLE_REAL_MONEY=false`. Sandbox cards, payment channels, payments, refunds and transfers do not establish live financial processing or provider approval.
- Preserve one policy engine, card-request/issuance lifecycle, merchant-channel lifecycle and immutable financial ledger. React renders server projections and invokes their existing commands.
- Do not reset data, replace authentication, copy legacy source, broaden access or create another implementation to make a check pass.
- Feature merges and releases require the applicable review and authorization. A previous deployment does not authorize another release during this planning pause.

Hosted registration, confirmation, password sign-in and recovery are implemented. D62 verified provider settings and enabled forms, plus isolated application journeys. The user's own successful hosted mailbox/password roundtrip remains pending; see [email reliability evidence](docs/EMAIL_ACCESS_RELIABILITY.md).

## Working locally and continuing later

[README.md](README.md) contains current setup and verification commands. The existing local preview uses a guarded database separate from automated tests. Starting a prepared preview does not migrate or reseed it. Do not run preparation, builds or runtime checks merely to complete this documentation review.

When implementation is resumed, follow the active delivery plan and record exact changes, checks, limitations and next steps in `planning/STATUS.md` and the decision log. Preserve the current implementation and its evidence across tasks.
