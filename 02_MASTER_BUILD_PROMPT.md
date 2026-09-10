# Master Codex build prompt — Etail Depot Next

## 1. Delivery mandate

Build a completely new, working Etail Depot sandbox. Deliver the database, domain rules, API, accessible responsive interfaces, operational tools, automated tests, private GitHub repository and verified Netlify deployment. This is implementation work, not a request to return only a design or a checklist.

The previous application became confusing because a guided card-creation process was placed over an intact legacy process. **Do not clone, extend, fork, migrate, or wrap that application.** Start from this requirements package in a clean folder. The source archive contains no application implementation to reuse.

Use the existing product economics and the redesigned responsibilities. Simplicity means one place to do each task and one owner of each business operation—not collapsing distinct financial liabilities into a generic wallet, removing controls, or discarding required support/economics features.

## 2. Mandatory reading and first output

Read `AGENTS.md`, `project-targets.json`, `docs/SOURCE_PRECEDENCE.md`, and `planning/STATUS.md`. Read `docs/PRODUCT.md`, `docs/DATABASE_AND_DOMAIN.md`, `docs/ACCESS_POLICY.md`, `docs/WORKFLOWS.md`, `docs/UX_CONTRACT.md`, and the Netlify/GitHub/testing documents. Inspect both original workbooks, using their cell-addressed extraction when helpful. Read the original master for remaining required feature outcomes.

Before external writes, report the intended new repository/site names, the known excluded resources, the first milestone, and unresolved material product questions. Then begin the unblocked implementation; do not spend the task restating all the documents. Record decisions in `docs/DECISIONS.md` and source-to-feature/test mapping in `planning/TRACEABILITY.md`.

## 3. New infrastructure only

Proposed repository: `nidcyj-haXqer-3disti/etail-depot-next`, private. Proposed Netlify slug: `etail-depot-next`. Verify the GitHub owner and Netlify team with authorized tools. Names are suggestions, not reservations. Create resources only when absent; if a collision exists, ask rather than overwriting or adopting it. Record newly assigned repository and site IDs before further writes. Every mutation must target those exact resources.

Create a fresh PostgreSQL database, Identity configuration and secret set. Do not copy customer records, identities, card tokens, ledger entries, compiled output, deployment secrets or environment files from any old project. Existing Etail Depot resources in `project-targets.json` are denied targets. Do not change `etaildepot.com`, DNS, email-domain records, paid plans, or real providers.

Use GitHub tools/CLI and Netlify tools/CLI/native Git integration when available. Do not claim a tool lacks write capabilities without checking. When an operation genuinely needs the owner to authorize it, provide the exact smallest setup step and continue implementing/testing locally. A blocked deployment is not permission to deploy a static placeholder or use the old site.

## 4. Product model

**Latest override:** customer navigation and permissions follow [the two-service design](docs/TWO_SERVICE_DESIGN.md): Cardholder services (named primary/secondary) and Merchant services (primary/submerchant). The three persisted context kinds below describe preserved internal financial records, not customer products or capability tiers. Secondary cardholder access is own-card/data only.

Exactly three account types:

- **PERSONAL:** private member activity and approved consumer pay-in-full spending. Simple payment links and QR codes operate through an explicitly accepted Personal collection account under a named Merchant master; it never shares Personal financial history with that merchant network.
- **HOUSEHOLD:** explicitly shared activity. Adult delegated capacity references an approved responsible adult's facility. Supervised children/teens use separately funded balances, never independent credit. An accepted Household sub-MID can be delegated to named members or outside operators through merchant-only permission.
- **MERCHANT:** a named individual/business commercial context owning the master merchant/MID and permitted child oversight, its own channels and separately approved commercial spending. Team administration, merchant operations, spending and visibility remain separate.

For the current three-account product and working sandbox, follow [the sandbox design](docs/THREE_ACCOUNT_SANDBOX_DESIGN.md). Follow [the merchant/channel redesign](docs/MERCHANT_HIERARCHY_AND_CHANNELS.md). MASTER/SUB are merchant-unit kinds, not additional account types. Each sub-MID has one immutable master; multiple separate Merchant associations per Personal/Household host are explicitly allowed. The master Merchant is responsible for its sub-MID sales, fees, refunds and chargebacks. Store this responsibility explicitly and configure compatible provider routing; an account label alone is not verified provider evidence. External MID assignment and gateway readiness require their own evidence.

One person/login may access multiple accounts with different roles. An account's legal responsible party, sponsoring membership, product approvals and financial backing are explicit. Select/Premier are plans, not account types. Owner/Manager/Cardholder/Viewer are scoped roles, not account types. Virtual/physical/single-use are card attributes, not independent creation workflows.

Account selection persists in the URL and validated session preference. Never pick the first account returned by the database. Empty accounts get a helpful next step, not fake balances or pre-created commercial services. Creating another account or card must not create extra credit, membership charges or Premier bonus caps.

## 5. Architecture and stack

Build a modular monolith in TypeScript with a current supported Next.js App Router runtime and React. Use one package manager (pnpm), exact installed dependency versions and a real lockfile. Verify the current Node LTS/Next.js/Netlify adapter compatibility at implementation time. No guesses labeled as installed compatibility.

Use Netlify Database/PostgreSQL through `@netlify/database`, a typed SQL layer such as Drizzle, versioned SQL migrations, a transaction-aware repository interface, and private Netlify Blobs for documents. One migration execution authority; do not run two migration systems against the same database. Use a fresh Netlify Identity project via a reviewed server-side integration. A local fixture Identity adapter is allowed only in explicitly isolated local/CI contexts—not a second production authentication engine.

Functional modules: **Issuing, Acquiring, Access/Controls**. Shared foundations: Identity/Membership, Ledger, Rewards, Integrations/Event processing, Cases/Operations, Economics and Partner administration. UI/HTTP layers invoke application commands; only owning modules mutate their state. Provider SDKs belong behind adapters. Workers invoke the same domain commands rather than writing tables independently.

Do not introduce a general workflow-builder product, microservices, event-sourcing framework, generic JSON entity store, offline SQLite substitute, page-class inheritance, second API engine, or copied compiled JavaScript. Normal local execution and deployment share application source and PostgreSQL behavior.

## 6. Accounts, authorization and capabilities

Implement centralized deny-by-default action policy over actor, typed account or merchant target, resource, product state, scope and environment. Authentication does not authorize financial actions. Provider identity metadata and client-supplied roles never confer app privileges. Every read, list, export, mutation, file and operator action must bind to authorized scope. A direct accepted merchant invitation does not create host-account membership; both scope loaders feed the same evaluator and shared invitation lifecycle.

The backend returns authorized capabilities, explicit prerequisites and canonical next-action references. The UI does not reconstruct eligibility from a separate state machine. Capability responses are guidance, not bearer permissions; re-evaluate each write. Use optimistic concurrency/version checks for saved requests and policy edits.

Spending does not imply card issuance. Administration does not imply spending, payout or collateral release. Restrictions at facility/account/person/card levels compose; a child rule cannot relax a parent. Usage counters persist across limit edits. Revoked access blocks subsequent requests. Financial events accepted before revocation still reconcile under their established transaction identity, not a resurrected user session.

## 7. Canonical card workflow

Implement **Select account → Cards → Add card → Cardholder → Details/limits → Review → Create** using one saved request, one form/component and one command handler. Home/empty-state shortcuts navigate to the same route. Advanced fields expand inside that form, not a legacy screen.

Save the selected account, eligible cardholder, explicit funding relationship, version and settings. Missing membership/approval/funding requirements suspend and resume the same request. Check every relationship server-side. A Household card references a specific authorized allocation or supervised balance without exposing the funding adult's unrelated Personal history.

Submission creates a durable provider operation with a stable external idempotency identity. Card uniqueness is tied to the saved business request, not only an HTTP retry header. Network timeout means pending/reconciliation, never retrying issuance with a new operation ID. One request yields at most one issued card; deliberate independent requests remain supported. Distinct duplicates, cancellation, replacement and provider failures are in `docs/WORKFLOWS.md`.

## 8. Money and lifecycle integrity

Use integer minor units with currency in PostgreSQL and decimal strings at API boundaries. Use exact rates and explicit rounding. All posted journals balance by currency and are immutable. Corrections append reversals/adjustments. Projections reconcile to one ledger; balance caches are not independent sources of truth.

Enforce backing and all limits atomically across shared facilities. Concurrent $80 and $30 authorizations against $100 backing cannot both approve. Settled merchant funds cannot be both pledged and paid out. Pending sales, reserves, disputed funds and pledged amounts are unavailable for reuse. Collateral is not platform revenue. Genuine late provider clearing must be recorded and investigated even if a card has since frozen; don't silently discard it to keep a display nonnegative.

Preserve original consumer statement pay-in-full and Merchant daily full-repayment policies. No revolving balance, independent child borrowing or conversion of consumer collateral into prepaid money. Guardian-funded supervised spending is a separate product with no credit bill for the participant.

## 9. Acquiring and simulation

Implement the Merchant master / Personal and Household sub-MID hierarchy through one merchant domain and payment lifecycle. One Payment channel form configures SMS/text, email, invoice, bill, social, QR and website/link presentation/distribution. Draft is a channel status; receipts follow authoritative payment success. Reusable channels create independent orders; one-time channels retain one order across revisions/presentations; invoices support atomic partial allocations. Exact provider/environment/namespace/binding and responsibility versions are pinned to each order. Guest payers need no membership/login and cannot see private member records. Include settlement, reserve, partial/full refund, dispute, payout and failure/reconciliation behavior through the one ledger. Preserve existing private draft IDs/data/visibility in the new-project upgrade; never publish them automatically.

All providers are mocks in the delivered project. A member has one **Make a practice purchase** action. The durable simulation event runner processes authorization/clearing via common handlers and presents honest Pending/Completed/Declined results. The customer never has to press “manual clear” to finish a normal purchase. One-shot checks, out-of-order events, retry and outage experiments are operator-only. Do not use client timers to fabricate completion.

Default workers are off while provisioning; enable only the tested bounded simulation runner at sandbox release. Calendar rewards, renewals, allowances and recurring jobs have independent gates and fake-clock tests. Do not enable a global scheduler just to fix a stuck card purchase. `ENABLE_REAL_MONEY=false` and hosted demo impersonation disabled are invariant. Missing simulator configuration should be visible as a capability/readiness problem, not an unexplained failed purchase button.

## 10. Retain the business contract

Both plans include all three contexts and essential security. Select $120/year, 2.90% + $0.30 eligible domestic online payment pricing. Premier $300/year, actual brand costs + 0.50% + $0.30 provider fee. Both plans have 0.50% base cashback. Premier extra spending 0.50% and 20% of eligible provider fees share ONE $300 membership-year cap. Track sources separately but show one combined bonus. Follow reversals, monthly base posting, annual bonus timing, proration, downgrade and 60-day initial fee-refund rules in the source.

Fixture $100,000 sales / 1,000 payments / $24,000 eligible purchases / 1.90% brand costs yields Select net $3,200, Premier net $2,600, saving $600. This is a model fixture, not a customer promise. Missing contracted/actual rates never become confirmed zero. Retain the cost workbook's Planning regression and source provenance. Operations and partners remain required later milestones, not hidden unfinished scope.

## 11. Interface and public experience

Use the supplied Etail Depot assets and an original design with American Express as the primary issuing, account-control, merchant, management and consumer-experience reference. The user's 90%+ target is tracked through the proposed public-workflow comparison in `docs/research/amex/README.md` and `planning/amex-comparison.json`; private Amex internals and brand pixels have no inferred similarity score. Deliver clear account selection, focused navigation, purposeful empty states, accessible forms, inline errors, and one primary next action. Cards, Get paid, Activity, People & controls, and Settings should stay consistent across account types; capabilities determine which are applicable. Do not render forbidden/private sections with data and merely hide them in CSS.

Use plain-language terms without falsifying financial meaning. Show collateral, outstanding obligations, holds, available capacity, and settled available Merchant funds distinctly. A compact persistent Sandbox badge and explicit simulation confirmations are mandatory. No fake PAN/CVV, real bank/KYC details, hardcoded financial success screens, or duplicated “advanced app” hidden inside details panels.

Build the public pricing and service pages, guest checkout, help, account security, notifications, responsive PWA and private-file flows. Cache only public assets/pages; never authenticated API data, confirmation tokens, documents or account pages. Every visible button must work or accurately show a supported unavailability reason.

## 12. GitHub and evidence

Create the new repository and plan using `docs/GITHUB_PLAN.md` and `planning/backlog.json`. Use M0–M7 milestones, linked issues and focused branches/PRs. A private Project board is useful when permissions allow; its absence must not block issues or code. Never post this package's planning into the old repository.

Bootstrap the handoff, then implement schema → policy/commands → API → interface → tests per vertical slice. Keep one working architecture. Do not wait until the end to wire the backend. An integrator may parallelize separate owned modules only after shared contracts are agreed; no two agents own card issuance or the ledger writer.

Require lint, typecheck, unit/domain, integration with real PostgreSQL, provider contract/replay, concurrency, OpenAPI validation, security, architecture uniqueness, Playwright desktop/mobile, accessibility, Next production build and Netlify build. Preserve exact SHAs, database context, command outputs and safe screenshots. Failures must be fixed rather than excluded. Review PRs before merge. Follow `docs/TEST_AND_EVIDENCE.md`; no old test totals count for this project.

## 13. Netlify delivery and known failure prevention

Follow `docs/NETLIFY_DEPLOYMENT.md`. Create the NEW project with new database/Identity/secrets, record its ID, and connect only the new GitHub repository. Keep builds protected until reviewed. Deploy previews require distinct database branches and isolated auth/secret scope; database branching alone does not isolate Identity or Blob stores. Never expose privileged Identity tokens in previews. Avoid broad deploy tokens in untrusted CI.

Configure canonical external HTTPS origin from trusted server settings, separately for each context. Never derive trust from arbitrary Host/Forwarded/Origin headers; keep strict CSRF and secure cookies. Test the actual deployed same-origin login request, foreign/missing origins, confirmation links, recovery and logout. If using protected sites, verify server-to-Identity reachability without disabling access protections as an undocumented workaround.

Open registration is the final sandbox goal, with required email confirmation and rate/abuse controls. Obtain release approval before exposing the site publicly. Sender authentication and custom SMTP improve operational readiness but require a chosen provider and DNS approval; don't invent DNS records or promise inbox placement. A blocked SMTP setup must be disclosed, not conflated with database failure.

The deployed release must persist a real authenticated test user's workflow, not only pass credential-free probes. Use an authorized test account without printing secrets. Verify the simulator runs, balances reconcile, hosted files remain private and unauthenticated permissions hold. No “Ready” build status alone is sufficient evidence.

## 14. Finish honestly and resume coherently

The complete target includes all original required feature outcomes with the redesigned account model. Do not mark the project finished after one card or a plan document. Finish each milestone's acceptance tests; preserve remaining work in `planning/STATUS.md` and linked issues.

At task end report actual resources and commits, implemented scope, exact executed tests, deployment state, limitations and the next milestone. If runtime/time/authorization prevents finishing everything in one task, save a resumable state and deliver the completed slice; do not imply background work will continue. At release provide the new repository URL, PRs, published sandbox URL, deploy ID, exact SHA, database migration evidence, Identity registration state, mock-provider state, test results and open decisions. Never claim regulatory certification or live financial readiness.
