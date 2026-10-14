# Etail Depot public website

## Current scope

Read `project-targets.json`, `docs/CURRENT_WORK_CONTEXT.md`, `docs/SOURCE_PRECEDENCE.md`, `docs/PUBLIC_SITE_ARCHITECTURE.md` and `planning/STATUS.md`. This workspace and conversation concern only the deployed customer-facing website. Use the current context as the starting point; dated research or requirements are not active instructions. The user explicitly chose **public website and vendor links only** in D108. Historical account/financial requirements do not override this decision.

- Public routes: `/`, `/credit-card-services`, `/payment-acceptance-service`, `/help`, `/privacy`, `/terms`, metadata and 404.
- Trolleys payments use the fixed `https://trolleys.ai` entrance. Ledgix Visa secured credit cards are coming soon; inquiries use `ledgix@etaildepot.com`.
- No Etail login, dashboard, API, database adapter, ledger, checkout, issuance, KYC or money processing belongs in the active application.
- D201 preserves the enabled Netlify Emails extension and its settings. Its pinned, authenticated, POST-only platform handler is the sole permitted server-function exception; website pages do not call it. Reject other generated functions and do not expose the extension's preview UI or secrets.
- One public Shell, header, footer and design system. Product-page bodies stay focused on their own service.
- Provider links never forward queries, fragments, account identifiers or referrers. Do not invent vendor registration/sign-in paths.

## Boundaries

- Use only the exact repository/site IDs in `project-targets.json`. Never modify excluded projects or domains, provision replacements, change DNS, purchase plans or expose secrets.
- Existing databases and Identity records remain preserved. `archive/database` is inactive schema history, not a data backup. Do not edit archived migrations or reconnect old resources.
- Keep the retirement proxy read-only. Old account bookmarks may redirect to fixed local information pages; retired APIs and financial links return Gone. Never forward submitted bodies to a vendor.
- Real-money processing remains absent. No public indexing, deployment or remote resource change is implied by local verification.
- Feature branches and reviewed changes; no force-push, direct-to-main feature work or silent merge.

## Delivery

Use the exact Node/pnpm/dependency versions and one lockfile. Read local Next.js documentation before changing framework behavior. Run `pnpm verify:public`, `pnpm package:netlify` and `pnpm verify:package` for release candidates. Tests must exercise the current public website, not the retired account application. Record actual failures, reruns and limitations in `planning/STATUS.md` and the decision log.

Keep current root documentation concise. Earlier requirements and evidence remain dated history; the complete retired application is available at Git commit `111b703d9793c53d414f6c1ab0ec8985a5e54095`.
