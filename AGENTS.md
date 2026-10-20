# Etail Depot public website

## Current scope

Read `project-targets.json`, `docs/CURRENT_WORK_CONTEXT.md`, `docs/SOURCE_PRECEDENCE.md`, `docs/PUBLIC_SITE_ARCHITECTURE.md` and `planning/STATUS.md`. This workspace and conversation concern only the customer-facing website and its explicitly approved refinements and releases. Use the current context as the starting point; dated research or requirements are not active instructions. The user explicitly chose **public website and vendor links only** in D108. Historical account/financial requirements do not override this decision.

- D302 public page scope: `/`, `/credit-card-services`, `/payment-acceptance-service`, `/help`, `/guides`, `/guides/stripe-alternatives`, `/guides/payment-processing-systems`, `/guides/what-is-a-chargeback`, `/guides/how-to-create-a-payment-link`, `/privacy` and `/terms`, plus metadata and 404. The new `/guides` hub lists only four existing articles; no dynamic guide/blog family or private draft is approved.
- D302 explicitly authorizes push and deployment through the reviewed feature-branch, exact-source verification and manual publication gates. Release tests and hosted acceptance remain pending until recorded in current status. Nine nonlegal pages are search-eligible only under the exact production site/origin guard; legal, local/preview, error, navigation-payload and retired-route protections remain. No indexing or ranking result is implied.
- Trolleys payments use the fixed `https://trolleys.ai` entrance. Ledgix Visa secured credit cards are coming soon; inquiries use `ledgix@etaildepot.com`.
- No Etail login, dashboard, API, database adapter, ledger, checkout, issuance, KYC or money processing belongs in the active application.
- D201 preserves the enabled Netlify Emails extension and its settings. Its pinned, authenticated, POST-only platform handler is the sole permitted server-function exception; website pages do not call it. Reject other generated functions and do not expose the extension's preview UI or secrets.
- One public Shell, header, footer and design system. Product-page bodies stay focused on their own service.
- Provider links never forward queries, fragments, account identifiers or referrers. Do not invent vendor registration/sign-in paths.

## Boundaries

- Use only the exact repository/site IDs in `project-targets.json`. D215 explicitly permits the recorded apex/www domain migration from etail-depot-webapp and required web DNS changes; preserve nameservers, email records and all old project code/data/settings. All other excluded-project/domain changes, provisioning, purchases and secret exposure remain prohibited.
- Existing databases and Identity records remain preserved. `archive/database` is inactive schema history, not a data backup. Do not edit archived migrations or reconnect old resources.
- Keep the retirement proxy read-only. Old account bookmarks may redirect to fixed local information pages; retired APIs and financial links return Gone. Never forward submitted bodies to a vendor.
- Real-money processing remains absent. No public indexing, deployment or remote resource change is implied by local verification.
- Feature branches and reviewed changes; no force-push, direct-to-main feature work or silent merge.

## Delivery

Use the exact Node/pnpm/dependency versions and one lockfile. Read local Next.js documentation before changing framework behavior. Run `pnpm verify:public`, `pnpm package:netlify` and `pnpm verify:package` for release candidates. Tests must exercise the current public website, not the retired account application. Record actual failures, reruns and limitations in `planning/STATUS.md` and the decision log.

Keep current root documentation concise. Earlier requirements and evidence remain dated history; the complete retired application is available at Git commit `111b703d9793c53d414f6c1ab0ec8985a5e54095`.
