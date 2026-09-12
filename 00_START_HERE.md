# Etail Depot Next — start here

The working D69 sandbox connects prepaid Cardholder and Merchant services. The primary adds money to one card group and sets each person’s monthly spending limit. Each secondary sees their own cards and activity. The primary merchant oversees its submerchants; delegates see only their authorized records.

A customer pays at a published merchant checkout with their own Etail card. The purchase and merchant payment commit together. Full refunds return to the original card group. Reviewed deposits remain pending until a separately assigned sandbox operator completes or returns them. No real money moves.

Read [project targets](project-targets.json) → [source precedence](docs/SOURCE_PRECEDENCE.md) → [master prompt](02_MASTER_BUILD_PROMPT.md) → [product design](docs/PRODUCT_TECHNICAL_DESIGN.md) → [delivery plan](planning/DELIVERY_PLAN.md) → [status and evidence](planning/STATUS.md). The [D69 contract](docs/FRESH_PREPAID_REBUILD.md) is the current funding, workflow and data replacement decision. The previous planning pause and allocation/simulator journeys are superseded.

Use this repository and its recorded resources. The old local preview/test generations are preserved offline under their `_retired_d69` names; fresh active generations use `fresh-services-d69`. Startup never migrates or seeds. [README.md](README.md) and [tools guide](tools/README.md) describe the guarded preview and checks.

Retain the two-service policy, one issuance lifecycle, one immutable ledger and exact resource scope. No Personal/Household/Seller account model, global invitation step, dashboard purchase simulator or card-creation funding remains. Original workbooks and broader commercial requirements remain historical requirements where not superseded, with future scope visible in the delivery plan.

Local evidence and hosted deployment are separate. Existing Identity and visitor settings remain unchanged; reviewed merges and releases keep their applicable authorization. See [01_PASTE_IN_CODEX.md](01_PASTE_IN_CODEX.md) for continuation instructions.
