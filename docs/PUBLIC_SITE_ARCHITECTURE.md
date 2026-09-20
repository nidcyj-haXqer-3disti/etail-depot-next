# Public website architecture

D108 · 20 September 2026

The user explicitly selected **public website and vendor links only**, with existing database records preserved. This supersedes prior instructions to retain the internal Etail account application.

## One small application

Six public pages introduce the services, explain payment channels, answer questions and publish the website notices. Next.js renders the pages and metadata; React controls the seven illustrated channel tabs, the illustrated wallet setup guide and the compact mobile navigation menu. There are no account forms, application APIs, database connections, authentication adapters, financial commands or server actions.

`src/app` owns pages; `src/ui` owns the shared public design; `src/shared` owns confirmed identities, channel types and fixed destinations. `src/modules/public-site` contains public metadata only. The three runtime dependencies are Next.js, React and React DOM. Vendor authentication and product dashboards are outside this codebase.

- **Trolleys:** the exact approved portal is `https://trolleys.ai`. Every service-entry button uses no-referrer protection and forwards no user input. It responded HTTP 200 during the link check; this does not verify a vendor account or financial action.
- **Ledgix:** cards remain coming soon. The intended `ledgix.com` domain did not resolve during the check, so legal pages display it as forthcoming text. `ledgix@etaildepot.com` remains the card inquiry destination. No DNS or mailbox configuration was changed.
- **Operator:** Etail Depot US, Inc. Privacy/Terms describe the current website, separately hosted products and retained historical information. The factual hosting review consulted [Netlify's privacy statement](https://www.netlify.com/privacy/); provider product terms and legal certification are not established by code checks.

## Retired access

`src/proxy.ts` handles only the explicitly listed retired path families. GET/HEAD account bookmarks redirect to fixed local product/help pages, dropping query parameters and resource identifiers and replacing historical URL fragments with public page anchors. API requests, old transaction links and writes to retired paths return HTTP 410 without reading bodies, sessions, cookies or records. Unknown public paths use the normal branded 404.

No vendor redirect can be constructed from `next`, an incoming host parameter or a resource ID. An old Etail login does not become a vendor login. The proxy has no provider SDK and no database access.

## Preserved database history

The complete previous application remains in Git at `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Its 24 ordered migrations, 15 snapshots and 32 schema/configuration source files are preserved outside Netlify's migration discovery path. [Archive evidence](../archive/database/README.md) includes checksums and aggregate read-only local database checks.

Both local databases had 24 matching migration receipts, no pending migrations, no unvalidated constraints and no disabled custom triggers. No customer rows were read or changed. The archive is not a customer-data backup. Hosted Database and Identity records/configuration are unchanged; removing application routes does not deactivate a separately provisioned Identity service.

## Build and release

Public development and tests need no database or secrets. `pnpm verify:public` checks lint, types, unit behavior, public-source boundaries, build, browser journeys, accessibility and source/dependency security. `pnpm package:netlify` performs a local offline build for the exact site in `project-targets.json`; `pnpm verify:package` rejects private/archived inputs, retired database/authentication SDKs and unexpected application routes in the output. It requires exactly the generated Next.js server handler and the retirement proxy, verifying both edge manifests and their route coverage.

The automatic-publication hold and current noindex boundary remain. Old generated output must not be reused: package the fresh public source, inspect its routes and file traces, then record the resulting commit and hashes. A deployment is a separate authorized action. None of these checks purchases services, updates DNS, logs into a vendor or migrates records.

## Evidence and limits

Final commands, exit statuses and results are recorded in `artifacts/d108-checks/` and `planning/STATUS.md`. D107 and earlier checks describe their old source revisions; they do not prove this cutover. Local database checks are not a hosted audit, and successful website links do not establish vendor end-to-end acceptance.
