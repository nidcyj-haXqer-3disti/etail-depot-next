# Public website architecture

D108 public-only scope · D198 tooling candidate, 14 October 2026

The user selected **public website and vendor links only**, with existing database records preserved. D163 / PR #34 is the recorded published baseline. D198 changes local build and hosting tools while preserving the approved Home photograph, D184 Payments presentation, Cards, six public routes, copy, offers and client interactions. It is not a published release. See [current status](../planning/STATUS.md).

## Pages and client interactions

Next.js 16.3.8 uses its supported `output: "export"` mode to generate HTML, navigation payloads and static assets for Home, Payments, Cards, Help, Privacy, Terms and the branded 404. React and React DOM remain 19.2.8. The shared Shell, navigation, footer and page designs remain intact. Original images and authentic marks are served directly with image optimization disabled; no image server or Next.js server function is deployed.

Client components retain the three purchase examples, six sharing presentations, two purchase-recognition views, exact-cent fee estimate, wallet guide and mobile navigation. Trolleys still presents Create → Share, followed by illustrative customer checkout; the same purchase data drives the existing Clarity artwork. Static card-entry specimens are not form fields. Website interactions do not create accounts, send payment requests, enroll merchants, provision cards, process money or persist account records.

`src/app` owns pages and metadata; `src/ui` owns presentation; `src/shared` owns product/contact facts, public types, retired destinations and the pure search-release guard. `src/modules/public-site` owns page/social metadata, illustrative purchases and exact-cent fee calculations. Authentication, dashboards and financial operations remain outside the application.

- **Trolleys:** the fixed entrance is `https://trolleys.ai`; links forward no visitor input and use no-referrer protection. Two Step remains 2.9% + 30¢ per successful domestic online card payment, with no monthly fee. Optional Clarity remains +0.4% under its published fee basis and coverage limits. D193 sets disputes received to $35 each; the separately disclosed response fee remains unchanged. The website does not configure billing or call Order Insight.
- **Ledgix:** Digital Wallet Card remains a Visa secured credit card marked Coming soon, with applications closed. The inquiry destination is `ledgix@etaildepot.com`. The $200 minimum security deposit is distinct from full monthly purchase-balance repayment; approved annual/monthly fees remain $0. Wallet artwork changes only local presentation.
- **Operator:** Etail Depot US, Inc. Website notices distinguish public-site information, separately hosted products and retained historical records. Source checks do not certify provider agreements, contact operations or legal effectiveness.

## One native public request boundary

`netlify/edge-functions/public-boundary.ts` replaces the Next proxy. One native Edge function runs before cache lookup for all paths and fails closed on handler errors. Its only application imports are the shared retired-route definitions and search-release guard. It has no account service, provider SDK, database access or financial operations.

For the same 17 retired path families, GET/HEAD account bookmarks receive fixed local 307 redirects. Query parameters and resource identifiers are dropped; explicit public anchors replace old fragments. Retired APIs, transaction links and writes return 410 without parsing or forwarding submitted bodies. These responses remain no-store and noindex, with no-referrer and nosniff protection. Unknown public paths use the branded 404.

The boundary also preserves baseline security headers and deployment-context indexing protection. It obtains the site ID and deployment context from Netlify’s trusted context, not request headers. The same pure approval guard checks the recorded origin/site and required production environment. Nonproduction responses remain noindex; preview robots omit the sitemap and preview sitemap responses contain no page URLs. Legal pages, navigation payloads, errors and retired routes retain noindex protection. D122 permits only Home, Payments, Cards and Help in the approved production environment. Search eligibility is not evidence of actual Google indexing.

## Build and package

Use Node 24.19.0, pnpm 11.19.0 and the single lockfile. The build wrapper records a fingerprint of active source/configuration/test inputs and the build’s search context. Local preview serves the exported files through the same public request handler. Next development mode is useful for UI edits but does not validate hosting behavior.

The pinned official `@netlify/edge-bundler` 16.0.4 replaces the Netlify CLI and Next adapter. `pnpm package:netlify` builds a local production-review candidate, copies the exact export to `.netlify/static`, adds reviewed static headers and creates one Edge bundle/manifest. Initial bundling may retrieve official bootstrap/tooling resources. No server-function archive or adapter runtime is permitted. Packaging neither uploads nor publishes the candidate.

The scoped Next ESLint plugin patch replaces root-directory glob expansion with Node 24’s stable filesystem glob API. It preserves rule coverage, supports the reviewed root patterns and rejects unsupported patterns. `pnpm test:lint-tooling` checks root resolution and representative lint-rule behavior; it is part of `verify:public`. The full dependency audit remains enabled without advisory exceptions.

Package verification checks current source/build identity, six pages and metadata assets, byte-identical export copying, security headers, the all-path Edge contract and absence of server functions, private inputs and retired dependency paths. Unit and HTTP/browser checks separately exercise retirement methods/statuses, safe links, search controls and client interactions. Run the full sequence in [README](../README.md) and [local setup](LOCAL_AND_CODEX_SETUP.md); previous output cannot certify a changed candidate.

## Preserved history and release limits

The previous application remains in Git at `111b703d9793c53d414f6c1ab0ec8985a5e54095`. Its 24 ordered migrations, 15 snapshots and 32 schema/configuration files remain in `archive/database`, outside compilation, packaging and migration discovery. The archive is schema history, not a customer-data backup. Do not edit it, reconnect databases or restore Identity while maintaining this website. Earlier catalog checks are not a current hosted-data audit.

D192/D197 recorded unresolved node-forge and braces advisories in the former toolchain, including adapter-bundled build helpers. D198 removes those dependency paths and the adapter deployment package rather than suppressing findings. The complete local verification sequence passes, including the full dependency audit with zero findings. Hosted verification and publication have not occurred. Follow [current status](../planning/STATUS.md) for actual passes, failures and package evidence. Operational privacy/product confirmations and Search Console measurement remain separately unverified.

Automatic publication remains held. Manual publication requires the reviewed candidate, the exact repository/site in [project targets](../project-targets.json) and the applicable user authorization. Local checks do not change DNS, visitor access, provider operations or financial activation. See [the deployment runbook](NETLIFY_DEPLOYMENT.md).
