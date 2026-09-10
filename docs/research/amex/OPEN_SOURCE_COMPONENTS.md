# Open-source components for the Amex-informed Etail architecture

Reviewed **8 September 2026**. This report compares **12 principal candidates** and inspects additional American Express repositories for context. The recommendation is to keep the current Next.js/TypeScript/PostgreSQL modular monolith and use upstream projects for narrow components and concrete design/test lessons. **pg-boss is the strongest conditional addition; no complete banking, payment or commerce platform is recommended as the foundation.**

This is research, not an implementation or dependency approval. The account/access foundation already exists; its status and tested revision are recorded in [planning/STATUS.md](../../../planning/STATUS.md). The earlier [open-source assessment](../../OPEN_SOURCE_ASSESSMENT.md) remains useful, but its pre-scaffold status describes that earlier point in the task. This review does not repeat that status as current.

The [master architecture](../../../02_MASTER_BUILD_PROMPT.md) requires one ledger writer, one server policy engine, one saved card-request lifecycle and one issuance command. Account state, backing/limit checks, ledger effects and durable event records must share the required PostgreSQL transaction boundary. Provider adapters and workers invoke those domain commands. American Express public behavior is the primary workflow and experience reference; these repositories do not supply its private issuer architecture, pricing or underwriting rules.

## Selection in one view

| Candidate | Relevant role | Decision for this application | Exact reuse boundary |
|---|---|---|---|
| Formance Ledger | Ledger postings/history | Reference only | Translate idempotency and posting test ideas into Etail's one PostgreSQL ledger; do not add its server. |
| TigerBeetle | Transfers, holds, fault tests | Reference; defer database adoption | Use reserve/post/void and failure scenarios; a second store would split financial atomicity. |
| Apache Fineract | Core banking/loan operations | Reject as foundation; reference only | Study accounting/product separation; its back-office Java server is a different platform. |
| Hyperswitch | Payment orchestration/adapters | Reference only | Use connector/canonical-event design; implement a complete fictional issuer adapter in Etail. |
| Mojaloop Central Ledger | Clearing/net settlement | Reference only | Use settlement/reconciliation concepts; a financial switch is beyond the app's runtime boundary. |
| Kill Bill | Subscriptions/payment states | Reference only | Study pending versus failed/error and adjustment workflows; keep Etail's membership economics. |
| OpenFGA | Relationship authorization | Reference only | Borrow relation/check/list test structure; do not create a second permission service. |
| Node-Casbin | In-process authorization | Defer library; reference now | Consider only as the internal implementation of the sole policy entry point if a concrete need emerges. |
| Temporal TypeScript SDK | Durable workflows | Defer/reject for current runtime | Use durable-step/retry concepts; service and persistent workers require an architecture decision. |
| pg-boss | PostgreSQL durable jobs | Conditional first candidate | Prove enqueue/rollback and bounded recovery with Etail's exact database adapter before adoption. |
| Medusa | Commerce/admin UI/workflows | Reference only | Study operator task presentation; its backend/admin conventions cannot replace Etail's controls. |
| Amex jest-image-snapshot | Visual regression testing | Optional tooling; defer now | Use only if a reviewed test-runner fit justifies it; existing browser tests should stay coherent. |

“Reference” means independently implement the necessary Etail behavior with provenance for any actual reused material; it does not mean fork a platform or quietly install it. “Conditional” means a bounded compatibility test is needed first. None of these choices alters the existing ban on real-money behavior.

## What the repositories actually support

### 1. Formance Ledger

The README describes a Go ledger service with PostgreSQL storage, atomic multi-posting transactions and Numscript. Its local example starts a gateway, ledger server, worker and console; production support is stated to use the Kubernetes operator. That is a service adoption, not a TypeScript journal library. Our inference is that calling its API cannot include Etail's own account/limit/outbox changes in the same local SQL transaction. [Pinned README · G03](https://github.com/formancehq/ledger/blob/f43a7078e7e1b9f6a354307ef994431593bf57e0/README.md)

The inspected storage function updates account volumes and inserts the transaction/history. More immediately useful are its executable idempotency examples: repeat the same request/key and receive the same transaction ID; change the payload under that key and reject it. Recreate those scenarios in Etail's own real-PostgreSQL command tests, with account scope and immutable posting invariants. Do not expose Numscript or arbitrary postings to the browser. [Storage code · G43](https://github.com/formancehq/ledger/blob/f43a7078e7e1b9f6a354307ef994431593bf57e0/internal/storage/ledger/transactions.go) [Idempotency tests · G42](https://github.com/formancehq/ledger/blob/f43a7078e7e1b9f6a354307ef994431593bf57e0/test/e2e/api_idempotency_test.go)

### 2. TigerBeetle

TigerBeetle is a separate database with account/transfer primitives. Its two-phase transfer documentation distinguishes reserved funds from posted funds, then post, void or expire; it also specifies over-reservation rejection. These are useful models for testing holds, but do not establish Amex network clearing rules. Our card simulation must explicitly cover any required late, partial or adjusted clearing instead of assuming the transfer primitive is a complete card lifecycle. [README · G06](https://github.com/tigerbeetle/tigerbeetle/blob/cc1c06a924e49b11089c521b2209d34c92caaf18/README.md) [Two-phase transfers · G44](https://github.com/tigerbeetle/tigerbeetle/blob/cc1c06a924e49b11089c521b2209d34c92caaf18/docs/coding/two-phase-transfers.md)

Use its unique-transfer-ID and fault-simulation ideas to test lost acknowledgements, duplicate submissions and crashes. Adopting the database would require deliberate coordination with the existing PostgreSQL domain store; do not install it as a parallel balance authority. Its safety documentation describes engineering practices, not independent proof of Etail's safety. [Safety design · G45](https://github.com/tigerbeetle/tigerbeetle/blob/cc1c06a924e49b11089c521b2209d34c92caaf18/docs/concepts/safety.md)

### 3. Apache Fineract

Fineract supplies a substantial core banking API, not a drop-in card component. The inspected release requires Java 21+ and PostgreSQL 18+; its threat model describes back-office users, separate self-service/UI projects and a server/daemon, and explicitly excludes embedding it as a library. Loan officers, banking product/accounting separation and end-of-day processes are useful reference areas, but its clients, loans, roles and operations do not become Etail's three account types or liability rules. [Requirements · G09](https://github.com/apache/fineract/blob/d5636847ac556c30b437254c353f05526d172b97/README.md) [Threat model · G46](https://github.com/apache/fineract/blob/d5636847ac556c30b437254c353f05526d172b97/SECURITY.md)

The 1.15.0 release specifically labels the revenue-based working-capital loan product incomplete and unsuitable for production. This is a concrete reason to inspect individual feature readiness instead of treating “core banking” as proof of a complete credit product. No loan or underwriting implementation is selected here. [Release limitation · G11](https://github.com/apache/fineract/releases/tag/1.15.0)

### 4. Hyperswitch

Hyperswitch offers Rust payment orchestration, connector interfaces and payment routing. Its inspected Compose includes PostgreSQL, Redis and separate application/migration components. It can inform canonical request/result schemas, provider error categories and reference IDs, but importing the complete switch would add another backend model. Merchant payment acceptance also differs from issuing cards and determining who owes the balance. [README · G12](https://github.com/juspay/hyperswitch/blob/83cc4876dd067ff16bcac51ce2737ee0fe0bf8b1/README.md) [Runtime definition · G48](https://github.com/juspay/hyperswitch/blob/83cc4876dd067ff16bcac51ce2737ee0fe0bf8b1/docker-compose.yml)

The actual `DummyConnector` is especially instructive: it shares authorization/capture/refund/sync interfaces, but contains unimplemented methods, and its incoming-webhook methods report unsupported/unimplemented behavior. **It is not a complete issuer simulator.** Build the fictional issuer adapter behind Etail's single issuance/event interfaces, including delays, failure, uncertain acknowledgement and duplicate/out-of-order events. The README advertises reconciliation modules; their entire implementation, license boundary and operational readiness were not audited, so no reusable reconciliation engine is claimed. [Inspected dummy connector · G47](https://github.com/juspay/hyperswitch/blob/83cc4876dd067ff16bcac51ce2737ee0fe0bf8b1/crates/hyperswitch_connectors/src/connectors/dummyconnector.rs)

### 5. Mojaloop Central Ledger

The README's scope is clearing transfers between digital financial service providers and maintaining net settlement positions. This is useful context for distinguishing individual transfers from settlement batches, fees and reconciliation breaks. It is a switch-oriented set of services, not a household/merchant account module. [README · G15](https://github.com/mojaloop/central-ledger/blob/c3ea56feca0342a8c5046e8b30e9b26e34f9cd52/README.md)

There is material documentation drift: a README row says PostgreSQL-only, while the pinned development Compose uses MySQL, Kafka, Redis and other services. The transfer guide has old sample dates and a request/response amount mismatch. Treat those examples as historical conceptual material, not Etail contracts or current deployment instructions. The exact supported production topology remains unverified by this review. [Compose · G49](https://github.com/mojaloop/central-ledger/blob/c3ea56feca0342a8c5046e8b30e9b26e34f9cd52/docker-compose.yml) [Transfer guide · G50](https://github.com/mojaloop/central-ledger/blob/c3ea56feca0342a8c5046e8b30e9b26e34f9cd52/TransferGuide.md)

### 6. Kill Bill

Kill Bill's modular subscription, catalog, invoicing and payment responsibilities are relevant to membership renewal and operational exception handling. Its payment-state XML explicitly distinguishes authorization pending, successful, failed and errored outcomes, with separate payment operations. Borrow the requirement that an unknown/error result must remain recoverable and reconciled; do not immediately turn a timeout into a declined transaction or silently retry a new business operation. [README · G18](https://github.com/killbill/killbill/blob/5da9650de60b2fa83dea556d7e95c70b79dabd39/README.md) [Payment states · G51](https://github.com/killbill/killbill/blob/5da9650de60b2fa83dea556d7e95c70b79dabd39/payment/src/main/resources/org/killbill/billing/payment/PaymentStates.xml)

Reject the platform as the current membership/ledger engine. Etail's Select/Premier formulas, sponsorship, shared cap and account-independent membership economics remain governed by its contracts. Subscription catalog features do not settle those product decisions.

### 7. OpenFGA

OpenFGA is a Go relationship-authorization service with HTTP/gRPC interfaces and optional PostgreSQL persistence. It could model ownership, membership and delegated relationships, but using it here would add another permission store/check boundary. Having both its tuple decisions and an independent Etail permission engine risks divergent answers. [README · G21](https://github.com/openfga/openfga/blob/130c30aea5e73543e63b173dadfbd1ee519aa97a/README.md)

Use the official model-testing discipline in the existing policy tests: assert both allowed and denied actions, all visible objects in a list, visible users, and expired grants. A Household relationship must not expose that person's Personal/Seller resources. A valid relationship is only an input to Etail's eligibility, liability and limit checks. The reusable lesson is the test matrix, not a new running service. [Model tests · G61](https://openfga.dev/docs/modeling/testing)

### 8. Node-Casbin

The old `casbin/node-casbin` repository now resolves to `apache/casbin-node-casbin`. It is an in-process Node library, so its integration burden is lower than OpenFGA's service. The inspected domain example includes subject, domain, resource and action, and checks domain equality explicitly. That is directly relevant to account-scoped access. [README · G24](https://github.com/apache/casbin-node-casbin/blob/2d90c7d8c3b522415605cf3d25481e763e73381e/README.md) [Domain model · G52](https://github.com/apache/casbin-node-casbin/blob/2d90c7d8c3b522415605cf3d25481e763e73381e/examples/rbac_with_domains_model.conf)

Keep it as a reference initially: the current centralized policy is already small and testable. If future policy complexity justifies Casbin, it must become an implementation detail of the **same** server policy entry point, with the existing capability contract and deny-by-default rules. Do not add browser enforcement as authority, a second mutable role store or a cache whose revocation behavior is untested. Casbin alone does not establish financial eligibility or atomic spending limits.

### 9. Temporal TypeScript SDK

The SDK separates workflow, activity, client and worker packages. Workers use Node native modules, worker threads and VM isolation; the official guide requires a Temporal Service and Worker processes. TypeScript compatibility does not make the full runtime an ordinary Next request handler. [SDK README · G27](https://github.com/temporalio/sdk-typescript/blob/2453adf91b5287bbd81fb24e04ebd43f1b4cf42f/README.md) [Developer guide · G62](https://docs.temporal.io/develop/typescript)

Defer the runtime under the current modular-monolith/function constraints. Take the principles—durable steps, explicit retries/timeouts, versioned behavior and recovery—and implement the bounded product state machines/outbox required by the brief. A workflow engine would still need stable provider operation IDs and Etail's domain transaction checks. Reconsider only if an explicitly accepted service/worker architecture offers measurable value for sufficiently complex long-running workflows.

### 10. pg-boss

This is the best candidate for a small addition because it uses PostgreSQL and accepts an existing transaction. [README · G30](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/README.md) The adapter docs say `send`, `insert`, `fetch` and `complete` can use the caller's transaction. Its Drizzle adapter parameterizes SQL through the supplied transaction. **The documented drivers are node-postgres and postgres-js; Etail's exact Netlify/Drizzle path still needs execution proof.** [Transaction contract · G53](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/docs/api/adapters.md) [Adapter source · G54](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/src/adapters/drizzle.ts)

The adoption gate is a bounded experiment in the existing application: domain write plus enqueue commit/rollback; worker fetch with a deadline; same-domain-command execution; complete/fail; crash/lease recovery; repeat delivery without a duplicate business effect; connection cleanup; and migration/schema compatibility. `work()` is a polling API. Constructor defaults enable migrations, supervision and scheduling, so a request function must not blindly use the quickstart. Disabling supervision also removes maintenance/recovery duties: assign and test an explicit bounded owner for them. Keep one migration execution authority. [Polling workers · G57](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/docs/api/workers.md) [Startup options · G55](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/docs/api/constructor.md) [Manual jobs/retries · G56](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/docs/api/jobs.md)

Its queue delivery language does not guarantee a provider side effect happens exactly once. Store the permanent business-operation ID separately from the queue job ID; dead-letter redrive can create a new job. Use only internal IDs in job payloads, and keep provider credentials and financial authority in server adapters/commands. No queue dashboard or generic workflow builder is needed.

### 11. Medusa

Medusa's commerce modules and admin patterns help with operator lists, order/payment detail views and task-oriented actions. Its standard deployment includes PostgreSQL, Redis, server/admin and worker processes. It brings its own framework and workflow/data model; the admin is not demonstrated here as an independent UI for Etail's API. Use it for interaction/reference study, and keep the current React command/projection boundary. [README · G33](https://github.com/medusajs/medusa/blob/0ed927bdb7a396a8fd5f6447ed69b7b354b150d3/README.md) [Deployment · G63](https://docs.medusajs.com/learn/deployment/general)

The license boundary matters: root MIT excludes identified Enterprise material, including RBAC/SSO and listed policy/permission files. Those materials are not a free permission engine to copy. The observed 2.20.1 release also fixes response field restrictions that were wrongly conditional on an RBAC flag. Add the analogous Etail privacy regression—disallowed fields never appear in responses—even when a UI capability is absent or disabled. [Enterprise paths · G58](https://github.com/medusajs/medusa/blob/0ed927bdb7a396a8fd5f6447ed69b7b354b150d3/ENTERPRISE-LICENSE.md) [Field-filter fix · G35](https://github.com/medusajs/medusa/releases/tag/v2.20.1) [Reporting process · G59](https://github.com/medusajs/medusa/blob/0ed927bdb7a396a8fd5f6447ed69b7b354b150d3/SECURITY.md)

### 12. American Express jest-image-snapshot

This repository contains a Jest matcher for PNG baseline/diff comparison. It is reusable test tooling, not card processing. It could test a stable fictional card/statement UI if a future test architecture requires Jest. At present, adding a test runner solely for this matcher adds avoidable maintenance beside the existing unit/browser setup. [README · G36](https://github.com/americanexpress/jest-image-snapshot/blob/d8e6b552447549188993d4fa193fed34b632368f/README.md)

The pinned manifest supports Jest `>=20 <31`, while the README's usage text says through 29: verify package constraints rather than copying documentation blindly. This review did not establish Vitest interoperability. If visual baselines are introduced, keep them limited to fictional/approved content and retain functional/accessibility assertions; pixels cannot prove account authorization or ledger correctness. [Manifest · G60](https://github.com/americanexpress/jest-image-snapshot/blob/d8e6b552447549188993d4fa193fed34b632368f/package.json)

## What “build on Amex GitHub” means

The official American Express technology site links to the inspected organization. The public materials below are frameworks, SDK helpers or examples. **None of the inspected repositories exposes an Amex issuer core, authoritative private schema, full card-network lifecycle, or permission to operate real payment services.** This is a limited finding about the inspected set, not a claim that every repository or private system has been searched. [Official provenance · G01](https://americanexpress.io/) [Organization · G02](https://github.com/americanexpress)

| Additional inspected Amex repository | Actual content and observed state | Decision |
|---|---|---|
| One App | Node/React/Holocron web framework; latest observed release 6.12.1 from 2024; repository archived. [README · G39](https://github.com/americanexpress/one-app/blob/7a8181ddb3893ababd8bd26c76b4f1773931149c/README.md) [Metadata · G64](https://api.github.com/repos/americanexpress/one-app) | Do not replace Next.js with an archived second web framework. |
| Unify Flowret | Embedded Java workflow engine, JSON process definitions, resume/persist behavior and per-case definition snapshots; unarchived, last reported push 2026-04-22. [README · G72](https://github.com/americanexpress/unify-flowret/blob/1449bebe1051dd09a268735a982aad350e1280cb/readme.md) [Metadata · G71](https://api.github.com/repos/americanexpress/unify-flowret) | Reference immutable/versioned case-definition and recovery ideas; no Java engine or generic workflow builder. |
| amex-api-java-client-core | Authentication-header helper for developer APIs; unarchived, last reported push 2022-11-16. [README · G69](https://github.com/americanexpress/amex-api-java-client-core/blob/e28b3c11d832c1779c3fc289b338030dcc5bd57a/README.md) [Metadata · G68](https://api.github.com/repos/americanexpress/amex-api-java-client-core) | An integration helper, not an API entitlement or issuer implementation; no current compatibility claim. |
| express-checkout-tutorials | Merchant checkout samples with old portal references; archived, last reported push 2018-01-19. [README · G66](https://github.com/americanexpress/express-checkout-tutorials/blob/8258787701c214ca907913c6b745db54b9977f0c/README.md) [Metadata · G65](https://api.github.com/repos/americanexpress/express-checkout-tutorials) | Historical context only; do not use as a current production integration recipe. |

Those four repositories' inspected license files state Apache-2.0: [One App · G40](https://github.com/americanexpress/one-app/blob/7a8181ddb3893ababd8bd26c76b4f1773931149c/LICENSE.txt), [Flowret · G73](https://github.com/americanexpress/unify-flowret/blob/1449bebe1051dd09a268735a982aad350e1280cb/LICENSE.txt), [Java client · G70](https://github.com/americanexpress/amex-api-java-client-core/blob/e28b3c11d832c1779c3fc289b338030dcc5bd57a/LICENSE.txt), [Checkout tutorials · G67](https://github.com/americanexpress/express-checkout-tutorials/blob/8258787701c214ca907913c6b745db54b9977f0c/LICENSE.txt). License text for source does not establish current availability or access rights for the service an example references.

## Observed versions, licenses and maintenance evidence

These are **research pins**, not installed dependency selections. Each release tag was resolved through GitHub to the recorded full commit; file evidence uses commit-pinned URLs. Release metadata and current repository archival state are separate observations. SPDX identifiers identify the observed license text only, with no legal conclusion about distribution, notices or all dependencies.

| Principal candidate | Observed release/date and resolved commit | License file observation | Maintenance/security signal and uncertainty |
|---|---|---|---|
| Formance | [v2.4.12 · G05](https://github.com/formancehq/ledger/releases/tag/v2.4.12); 2026-07-24; `f43a7078e7e1b9f6a354307ef994431593bf57e0` | [MIT · G04](https://github.com/formancehq/ledger/blob/f43a7078e7e1b9f6a354307ef994431593bf57e0/LICENSE) | Fixes idempotency/business error mappings; dependency updates. No upstream CI or security audit reproduced. |
| TigerBeetle | [0.17.9 · G08](https://github.com/tigerbeetle/tigerbeetle/releases/tag/0.17.9); 2026-07-06; `cc1c06a924e49b11089c521b2209d34c92caaf18` | [Apache-2.0 · G07](https://github.com/tigerbeetle/tigerbeetle/blob/cc1c06a924e49b11089c521b2209d34c92caaf18/LICENSE) | Explicit client/replica compatibility floor; reverts a compatibility-breaking change. Release freshness is not safety proof. |
| Apache Fineract | [1.15.0 · G11](https://github.com/apache/fineract/releases/tag/1.15.0); 2026-07-14; `d5636847ac556c30b437254c353f05526d172b97` | [Apache-2.0 · G10](https://github.com/apache/fineract/blob/d5636847ac556c30b437254c353f05526d172b97/LICENSE_SOURCE) | Release warns new working-capital feature is incomplete. Back-office threat model inspected. |
| Hyperswitch | [v1.126.0 · G14](https://github.com/juspay/hyperswitch/releases/tag/v1.126.0); 2026-08-24; `83cc4876dd067ff16bcac51ce2737ee0fe0bf8b1` | [Apache-2.0 · G13](https://github.com/juspay/hyperswitch/blob/83cc4876dd067ff16bcac51ce2737ee0fe0bf8b1/LICENSE) | Payment/webhook changes observed. Advertised capabilities and compliance claims were not independently verified. |
| Mojaloop Central Ledger | [v19.14.0 · G17](https://github.com/mojaloop/central-ledger/releases/tag/v19.14.0); 2026-03-19; `c3ea56feca0342a8c5046e8b30e9b26e34f9cd52` | [Apache-2.0 · G16](https://github.com/mojaloop/central-ledger/blob/c3ea56feca0342a8c5046e8b30e9b26e34f9cd52/LICENSE.md) | Fulfilment-validation changes and SBOM update. Database/setup documentation conflict remains unresolved. |
| Kill Bill | [killbill-0.24.21 · G20](https://github.com/killbill/killbill/releases/tag/killbill-0.24.21); 2026-08-12; `5da9650de60b2fa83dea556d7e95c70b79dabd39` | [Apache-2.0 · G19](https://github.com/killbill/killbill/blob/5da9650de60b2fa83dea556d7e95c70b79dabd39/LICENSE) | Template-key revert in patch release. No independent security posture determination. |
| OpenFGA | [v1.19.0 · G23](https://github.com/openfga/openfga/releases/tag/v1.19.0); 2026-08-25; `130c30aea5e73543e63b173dadfbd1ee519aa97a` | [Apache-2.0 · G22](https://github.com/openfga/openfga/blob/130c30aea5e73543e63b173dadfbd1ee519aa97a/LICENSE) | Malformed-model panic and connection-pool deadlock fixes; persisted-model behavior changes. |
| Node-Casbin | [v5.51.1 · G26](https://github.com/apache/casbin-node-casbin/releases/tag/v5.51.1); 2026-06-25; `2d90c7d8c3b522415605cf3d25481e763e73381e` | [Apache-2.0 · G25](https://github.com/apache/casbin-node-casbin/blob/2d90c7d8c3b522415605cf3d25481e763e73381e/LICENSE) | Release observed; source/domain example read. Model correctness and revocation behavior remain application work. |
| Temporal TypeScript SDK | [v1.23.0 · G29](https://github.com/temporalio/sdk-typescript/releases/tag/v1.23.0); 2026-08-26; `2453adf91b5287bbd81fb24e04ebd43f1b4cf42f` | [MIT · G28](https://github.com/temporalio/sdk-typescript/blob/2453adf91b5287bbd81fb24e04ebd43f1b4cf42f/LICENSE) | protobufjs v8/type changes; native worker constraints. Hosting and transitive audit remain unverified. |
| pg-boss | [12.30.0 · G32](https://github.com/timgit/pg-boss/releases/tag/12.30.0); 2026-09-03; `180a54b65ce492bf990e524cda2d38b19f0df3f4` | [MIT · G31](https://github.com/timgit/pg-boss/blob/180a54b65ce492bf990e524cda2d38b19f0df3f4/LICENSE) | Schema 40 migration and fetch-index changes; README states one-person maintenance. Operational ownership needs proof. |
| Medusa | [v2.20.1 · G35](https://github.com/medusajs/medusa/releases/tag/v2.20.1); 2026-09-03; `0ed927bdb7a396a8fd5f6447ed69b7b354b150d3` | [MIT for core; proprietary Enterprise exclusions · G34](https://github.com/medusajs/medusa/blob/0ed927bdb7a396a8fd5f6447ed69b7b354b150d3/LICENSE) | Field-filter security fix; open-core exclusions. No current deployed vulnerability claim. |
| Amex jest-image-snapshot | [v6.5.2 · G38](https://github.com/americanexpress/jest-image-snapshot/releases/tag/v6.5.2); 2026-03-09; `d8e6b552447549188993d4fa193fed34b632368f` | [Apache-2.0 · G37](https://github.com/americanexpress/jest-image-snapshot/blob/d8e6b552447549188993d4fa193fed34b632368f/LICENSE.txt) | README-only patch note; README/peer-range drift. No compatibility or security audit performed. |

The additional One App release is [6.12.1 · G41](https://github.com/americanexpress/one-app/releases/tag/v6.12.1); context repository revision/activity details are retained in the [source register](opensource-sources.json). A GitHub `NOASSERTION` license result is not substituted for reading the file: Mojaloop's file explicitly states Apache-2.0; Medusa's file contains explicit exclusions. No claim of security is based on stars, badges, release cadence or company association.

## Turn this research into one coherent implementation

The following are proposed work/test mappings, not behavior already implemented by this report.

| Etail outcome | Upstream lesson | What stays in Etail | Concrete proof before accepting the slice |
|---|---|---|---|
| Invite an additional/employee cardholder | Casbin account domains; OpenFGA check/list tests | Explicit person/account relationship, responsibility and one server policy | A cardholder cannot issue cards unless separately authorized; Manager is not automatically a spender; Household membership exposes no private Personal/Seller data. |
| Submit and retry Add card | Formance idempotency; Hyperswitch connector separation | One saved request, payload/version check, unique issuance operation and adapter | Same request/key gives one result; changed payload conflicts; crash after provider acceptance reconciles without a second card. |
| Practice purchase with delayed completion | TigerBeetle reserve/resolve; Kill Bill pending/error distinctions | One purchase intent and domain-owned hold/post/correction rules | Worker crashes, duplicate/out-of-order events and unknown acknowledgements converge to one business effect; frozen/revoked cards' prior events still reconcile. |
| Execute durable simulation events | pg-boss transaction/manual job APIs | Event schema, business identity and command handler | Domain/outbox commit and rollback together; bounded worker recovery succeeds after timeout; redrive does not reset operation identity. |
| Reconcile merchant activity | Mojaloop settlement distinction; Hyperswitch reference IDs | Match internal operation, provider event and settlement item; explicit discrepancy cases | Missing/duplicate/amount/currency/reference mismatch is detectable; corrections append balanced entries, never overwrite history. |
| Explain operations to an authorized user | Medusa task-oriented admin pattern; Amex visual tooling | Scoped projections and command buttons, one account context | Server strips private fields; action is rechecked on submission; keyboard/mobile/error recovery tests pass. |

Start by completing the already planned account/access prerequisites and converting the relevant negative-access cases into the existing policy test matrix. Then implement the single PostgreSQL ledger/operation/outbox boundary for the next authorized financial simulation slice. Evaluate pg-boss at that point, when a real durable job requirement can be tested. Its acceptance or rejection must not delay the domain invariants or cause a second writer.

For the first issuer simulation, define the adapter contract and event schemas from Etail's workflow needs, implement a fictional provider, and make its failures/retries exercise the same domain handlers intended for a future approved provider. Do not label the Hyperswitch dummy connector or any Amex public SDK as a ready-made issuer. Real provider/network integration remains separate and disabled.

## Evidence boundaries and handoff

Primary sources only: official repository READMEs, license files, selected implementation/tests, release metadata and official documentation. The machine-readable [source register](opensource-sources.json) contains 73 entries with URL, access date, scope, observed evidence and limitations. The review did not clone repositories, install dependencies, execute upstream code, enter provider portals or write to external resources.

Release notes/security policies are evidence of specific fixes or stated processes, not a complete advisory inventory. Package signatures, lockfile contents, transitive licenses, current upstream CI, practical performance, deployment support and exploitable dependency status were not validated for these candidates. No claim of regulatory compliance or financial fitness is made.

Only this report and its source register are produced by this subtask. Application code, schema, contracts, economic rules and enabled capabilities are unchanged. This research does not complete a milestone, verify hosted Identity/Database or authorize deployment.
