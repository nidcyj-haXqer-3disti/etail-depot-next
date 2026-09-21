# Public website architecture

D108 public-only scope · Updated for D138 and the D139 review, 21 September 2026

The user explicitly selected **public website and vendor links only**, with existing database records preserved. This supersedes every older instruction to retain or restore the internal Etail account application. D140 / PR #31 publishes the verified D139 candidate as Netlify deploy `6ab0d438588dbc2adeb59f78`. See [current status](../planning/STATUS.md).

## One small application

Six public pages introduce the services, explain payment collection and optional dispute readiness, answer questions and publish the website notices. Next.js renders pages and metadata. React controls three purchase examples, five sharing channels, two purchase-recognition views, a local fee estimate, the wallet guide and the compact navigation. Payment and wallet demonstrations do not submit account or transaction requests, enroll merchants, process money or persist account data. There are no account forms, application APIs, database connections, authentication adapters, financial commands or server actions.

`src/app` owns pages; `src/ui` owns the shared public design; `src/shared` owns confirmed identities, offer facts, channel types and fixed destinations. `src/modules/public-site` contains metadata, the search guard, illustrative purchase data and exact-cent fee calculations. The runtime dependencies are Next.js 16.3.4, React 19.2.8 and React DOM 19.2.8. Vendor authentication, product dashboards and financial operations remain outside this codebase.

- **Trolleys:** the exact approved entrance is `https://trolleys.ai`. Service-entry links use no-referrer protection and forward no query, fragment or visitor input. D138 records the operator's confirmation that the Order Insight integration is live and approved; this website illustrates its benefits and does not connect to that integration. Independent vendor testing and merchant-specific enrollment are separate evidence.
- **Ledgix:** Digital Wallet Card is a forthcoming Visa secured credit card. Applications remain closed; `ledgix@etaildepot.com` is the inquiry destination. Wallet artwork changes only local presentation. No card or wallet is provisioned here.
- **Operator:** Etail Depot US, Inc. Privacy/Terms describe the public website, separately hosted products and retained historical information. Source checks do not certify provider agreements or legal effectiveness.

## Retired access

`src/proxy.ts` handles only the 17 listed retired path families. GET/HEAD account bookmarks redirect to fixed local product/help pages, dropping query parameters and resource identifiers and replacing historical fragments with public anchors. Retired APIs, transaction links and writes return HTTP 410 without reading bodies, sessions, cookies or records. Responses prohibit caching and referrer forwarding. Unknown public paths use the branded 404.

No vendor redirect is constructed from visitor input. An old Etail login does not become a vendor login. The proxy has no provider SDK or database access.

## Preserved database history

The complete previous application remains in Git at `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Its 24 ordered migrations, 15 snapshots and 32 schema/configuration source files remain in `archive/database`, outside Netlify's migration discovery path and excluded from active compilation and linting. [Archive evidence](../archive/database/README.md) records hashes and the dated local database audit.

The archive is schema history, not a customer-data backup. Do not edit archived migrations, reopen or reconnect a database, or restore Identity configuration as part of this website. Removing application routes does not delete records or deactivate separately managed resources. Earlier catalog checks are not a current hosted-database audit.

## Build, search and release

Use Node 24.19.0, pnpm 11.19.0 and the single `pnpm-lock.yaml`. Public development and verification require no database, account credentials or secrets. `pnpm verify` runs public checks, production-search checks, an offline Netlify build and package inspection. Its component commands and local setup are documented in [README](../README.md) and [the setup guide](LOCAL_AND_CODEX_SETUP.md).

Package verification permits six public pages plus metadata/error routes, one generated Next.js server handler and the retirement proxy. It rejects archived/private inputs and retired database/authentication dependencies, and inspects function ZIP entries, traces, static files and both edge manifests. Package fresh source and record its identity; prior output does not prove a new candidate.

D122 authorizes indexing only Home, Payments, Cards and Help in the recorded production environment. The guard checks the approved site/origin, `NODE_ENV`, `APP_ENV`, `ETAIL_SEARCH_CONTEXT`, `SITE_ID`, `ETAIL_PUBLIC_ORIGIN` and any supplied `CONTEXT`. Legal pages, 404, retired routes and local/preview environments remain noindex. Search eligibility does not establish actual Google indexing.

Automatic publication remains held. Manual publication follows the reviewed workflow and the user's authorization for that candidate at the exact repository/site in [project targets](../project-targets.json). Local verification does not authorize deployment, DNS/access changes, provider actions or financial activation. See [the deployment runbook](NETLIFY_DEPLOYMENT.md).

## Evidence and limits

[Current status](../planning/STATUS.md) and [release evidence](RELEASE_READINESS_REVIEW.md) record the verified D140 publication of the reviewed D139 candidate. Record actual commands, failures, reruns, source identities and limitations there. Older evidence remains dated history and cannot establish the current candidate's acceptance or vendor end-to-end behavior.
