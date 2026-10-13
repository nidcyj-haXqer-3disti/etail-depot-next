# Public website architecture

D108 public-only scope · Updated for D195, 14 October 2026

The user explicitly selected **public website and vendor links only**, with existing database records preserved. This supersedes every older instruction to retain or restore the internal Etail account application. D163 / PR #34 is the recorded published baseline; the working branch includes D175–D195 refinements and release preparation. D184 restores the published Payments presentation and D187 restores the live-style homepage. See [current status](../planning/STATUS.md).

## One small application

Six public pages introduce the services, explain payment collection and optional Trolleys Clarity, answer questions and publish the website notices. Next.js renders pages and metadata. React controls three purchase examples, six sharing presentations from an extensible registry, two purchase-recognition views, a local fee estimate, the wallet guide and the compact navigation. The Payments hero contains one Trolleys Two Step illustration: Create holds Goods / Services / Information and the request; Share holds the channel gallery. The customer checkout is an unnumbered outcome with static, non-interactive card-entry specimens synchronized to the selected purchase. D160 frames both merchant steps as one forest-green product workspace matching the existing bank-recognition artwork. D184 restores the published sequence: Two Step, optional Clarity, pricing and four practical FAQs. Its safe fixed service handoff is in the hero beside View pricing. This supersedes D175’s pricing-first order. D187 restores the original Home business photograph and compact, non-interactive business examples; the duplicate Home create/share/checkout component is removed. The detailed payment walkthrough stays on Payments. Original assets and the descriptive photo alternative text are preserved. Route-scoped `payment-page.css` owns page framing; the existing journey/channel components retain their state and accessibility contracts. One purchase context supplies both stages, the outcome and the existing bank-recognition example. Copy link illustrates general reuse of the same URL; it does not copy or issue a live payment link. Payment and wallet demonstrations do not submit account or transaction requests, enroll merchants, process money or persist account data. There are no account forms, application APIs, database connections, authentication adapters, financial commands or server actions.

`src/app` owns pages; `src/ui` owns the shared public design; `src/shared` owns confirmed identities, offer facts, channel types and fixed destinations. `src/modules/public-site` contains metadata, the search guard, illustrative purchase data and exact-cent fee calculations. The runtime dependencies are Next.js 16.3.8, React 19.2.8 and React DOM 19.2.8. Vendor authentication, product dashboards and financial operations remain outside this codebase.

D159's operator-selected local offer is Trolleys Two Step at 2.9% + 30¢ per successful domestic online card payment, with no monthly fee and creation/sharing included. One shared 290-basis-point rate drives the public label and exact-cent estimate; separately optional Clarity remains 40 basis points. This website neither configures processor billing nor adds a subscription or separate per-share charge.

- **Trolleys:** the exact approved entrance is `https://trolleys.ai`. Service-entry links use no-referrer protection and forward no query, fragment or visitor input. D138 records the operator's confirmation that the Order Insight integration is live and approved; this website illustrates its benefits and does not connect to that integration. Independent vendor testing and merchant-specific enrollment are separate evidence.
- **Ledgix:** Digital Wallet Card is a Visa secured credit card program marked Coming soon. Applications remain closed; `ledgix@etaildepot.com` is the inquiry destination. Wallet artwork changes only local presentation. No card or wallet is provisioned here.
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

[Current status](../planning/STATUS.md) records D191 verification and D192 investigation of two remaining high-severity dependency findings. Local UI, accessibility, source security, production SEO and offline package checks pass; the full dependency audit does not. Neither affected package has a published patched release at the D192 check. Although the production-only audit has no findings, the adapter's server ZIP includes bundled braces-related build helpers. The inspected runtime import graph does not reach those helpers; this is a limited reachability assessment, not proof of package absence or a security exception. Operational privacy/product evidence and Search Console measurement remain separately unverified. This is not a deployment approval. Earlier release evidence remains dated history and cannot establish the current candidate’s acceptance or vendor end-to-end behavior.
