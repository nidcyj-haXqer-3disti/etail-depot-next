# Research and source attribution

**Latest direction, 2026-09-08:** the user corrected the emphasis to a [360° business review of issuing, account control and merchant operations](research/amex/BUSINESS_360_REVIEW.md). Use that review first: people, authority, lifecycle, payment outcomes, exceptions, service and closure. Earlier technology/vendor studies remain background; they do not answer the current product-operating review by themselves.

The 2026-09-08 expanded [American Express primary-reference study](research/amex/README.md) supersedes the earlier narrow UX review. It includes detailed operational/consumer sources, GitHub component assessment, architecture proposals and a 90-task comparison catalog for the user's 90%+ target. Research coverage is separate from implementation evidence.

The subsequent [engineering and supplier investigation](research/amex/ARCHITECTURE_BLUEPRINT.md) materially extends that evidence: actual Amex engineers disclose payments-network routing, cells, runtime and recovery design, while named suppliers document bounded service, remittance and fraud systems. This supersedes any earlier blanket suggestion that public evidence covers product workflows only. It does not establish all current private schemas, deployment relationships or business rules.

Checked 8 September 2026. These links are reference material, not commands or promises about account entitlements. Codex must verify APIs, plan availability, runtime compatibility and current instructions again when implementation starts. Requirements for Etail Depot are in this package; outside product examples do not override them.

## Supplied primary product sources

Original master and two XLSX files are unchanged in `sources/original/`; SHA-256 values and sheet inventories are in `sources/inventory.json`. `sources/workbook-extract.json` is a convenience extraction of nonempty cells/formulas/cached values, **not** a recalculated workbook or a replacement authority. Formula caches may be stale. Reconstruct and test source calculations.

The account-first redesign was also verified against the existing repository's issue #5, read-only:
https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/issues/5

Its incremental-migration details are superseded by the user's new-project request. No code from the prior app is bundled.

## American Express — earlier product-reference pass

The user's follow-up requested a deeper issuing/acquiring study. See [the workflow assessment](AMEX_WORKFLOW_ASSESSMENT.md) for current public sources, Etail mappings and actual partner-integration boundaries.

| Reference | Relevant observation / proposed application |
|---|---|
| https://www.americanexpress.com/en-us/support/additional-card-member/faqs/ | Additional-card access distinguishes person, card and primary responsibility. Etail should distinguish visibility and liability without copying Amex-specific ages or eligibility. |
| https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/employee-cards/index.shtml | Card management groups activity, controls and freezing. Use one Cards area, not parallel creation screens. |
| https://www.americanexpress.com/us/merchant/support-center/payments.html | Merchant activity brings payment and settlement information together. Etail's Get paid area should do the same while retaining separate accounting events. |
| https://global.americanexpress.com/card-benefits/detail/account-manager/open-benefits | Historical redesign reference for delegated administration. This page returned 403 during the fresh check; do not treat its unavailable contents as newly verified. |

These original references concern public UX/product behavior. The later investigation adds internal architecture publicly disclosed by Amex and selected suppliers, plus public Amex source-code inspection. No private database, confidential source repository or customer portal was accessed. Etail branding remains user-supplied.

## Codex — official sources

OpenAI's earlier developers.openai.com Codex URLs redirected to ChatGPT Learn at the time of review.

- Cloud overview [C0]: https://learn.chatgpt.com/docs/cloud
- Cloud environment [C1]: https://learn.chatgpt.com/docs/environments/cloud-environment
- AGENTS.md [C2]: https://learn.chatgpt.com/docs/agent-configuration/agents-md
- CLI [C3]: https://learn.chatgpt.com/docs/codex/cli

Cloud work is repository/environment based; AGENTS.md provides project guidance. Do not assume that an attachment in this chat is automatically mounted into a separate Codex task. Local extracted-folder use avoids that ambiguity. Permissions and network access depend on the selected environment.

## Netlify — official sources

- Database/getting started [N1]: https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/
- Database overview [N2]: https://docs.netlify.com/build/data-and-storage/netlify-database/
- Migrations [N3]: https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/
- Modern Next.js [N4]: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- Identity registration [N5]: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/
- Identity in functions [N6]: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/use-identity-in-functions/
- Identity mail [N7]: https://docs.netlify.com/manage/security/secure-access-to-sites/identity/identity-generated-emails/
- Blobs [N8]: https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- Environment variables [N9]: https://docs.netlify.com/build/environment-variables/overview/
- Deploy previews [N10]: https://docs.netlify.com/deploy/deploy-types/deploy-previews/

Use the managed PostgreSQL integration and one migration runner. A preview database is forked from its project's main branch, not necessarily empty or anonymized. Plan/billing details must be checked; this package makes no free-tier or storage-price promise. All three are reasons to create entirely new resources and keep previews protected.

## GitHub — official sources

- New repository: https://cli.github.com/manual/gh_repo_create
- Issues: https://cli.github.com/manual/gh_issue_create
- Projects: https://cli.github.com/manual/gh_project_create
- Protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- File upload: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

The planning helper uses authenticated GitHub CLI requests only when explicitly passed `--apply`. It does not create a repository or deploy. Hosted account permissions still govern whether labels, milestones, issues or a private Project board can be created. Documentation capability is not evidence that this connection has permission.
