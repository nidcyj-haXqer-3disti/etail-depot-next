# Etail Depot Next

A working two-service sandbox built from the supplied requirements and Amex front-end research. Customers enter **Cardholder services** or **Merchant services** directly. A primary cardholder oversees their card group; secondary cardholders see their own cards and permitted data. A primary merchant oversees its submerchants; delegated users see only their permitted merchant records. Supported changes persist in PostgreSQL under server-owned permissions.

**Current phase: video review and product/technical/design planning. Implementation is paused at the user's request.** Preserve the working application and existing resources. Do not start another provisioning or three-account rebuild workflow. The requested [video review](docs/research/VIDEO_PLANNING_REVIEW.md), [product and technical design](docs/PRODUCT_TECHNICAL_DESIGN.md) and [delivery plan](planning/DELIVERY_PLAN.md) govern the next work; historical task prompts are not an instruction to resume coding.

Read [project targets](project-targets.json) → [source precedence](docs/SOURCE_PRECEDENCE.md) → [master brief](02_MASTER_BUILD_PROMPT.md) → [product and technical design](docs/PRODUCT_TECHNICAL_DESIGN.md) → [delivery plan](planning/DELIVERY_PLAN.md) → [implementation status](planning/STATUS.md). [AGENTS.md](AGENTS.md) supplies standing boundaries subject to the latest explicit user decisions. The original M0–M7 [backlog](planning/backlog.json) and source workbooks remain the scope baseline; the new delivery plan supplies the active order.

The fresh application uses exactly two service kinds in its database and commands. Identity binding does not enroll someone in either service. Invitations connect named people to explicit Cardholder or merchant permissions; assigned support operators use a separate queue. Activity reports and CSV exports, saved filters, support-case timelines and session revocation reuse these boundaries. These features do not establish full American Express parity.

The [implemented two-service foundation](docs/FRESH_TWO_SERVICE_BUILD.md) and subsequent [journey refinement](docs/SANDBOX_JOURNEY_REFINEMENT.md) provide focused views for cards, activity, cardholders and saved requests, or collections, channels, payments, people and setup. One shared service switch connects both dashboards without an account-type chooser. Sign-in security works independently at `/security`. Each submerchant keeps one responsible primary and separately attributed records. Invitations preserve exact permissions, expiry and revocation. Cardholder and Merchant authority remain independent. These implementation records support the new design review; they do not replace it.

**Payment channels** use one form for SMS/text, email, invoice, bill, social media, QR and website links. Responsible primaries can oversee their submerchants' channel and payment work. Formats are previews of the same saved request; messages are not sent and invoice/bill previews are not issued tax documents. Test payment setup and practice processing do not imply a real provider MID or approval. See [implementation status](planning/STATUS.md) for tested behavior and remaining scope.

The sandbox implements practice card creation, funding and purchases, test payment channels, payments, full refunds and bounded transfers through one immutable ledger. Local preview and test databases have isolated canonical samples. Verified email members can deliberately opt into the [hosted sandbox](docs/HOSTED_SANDBOX_PRODUCT.md) and use explicit enrollment and permission commands; login alone grants no services. Retired source and databases remain recovery artifacts outside application targets. Live financial services, membership purchases and external invitation delivery remain unimplemented. Support uses explicitly assigned operators; the obsolete dispute intake has been retired. Activity reports are not billing statements.

Hosted registration, email confirmation, password sign-in and recovery are implemented through the recorded Netlify Identity provider and opaque application sessions. [D62 email reliability evidence](docs/EMAIL_ACCESS_RELIABILITY.md) records deployment, provider/settings checks and isolated email journeys. The user's own successful hosted mailbox/password roundtrip remains pending. Neither enabled forms nor synthetic provider transport proves that acceptance.

## Run the isolated preview

Use Node **24.19.0** and pnpm **11.19.0**. Dependencies are exact and the single lockfile is `pnpm-lock.yaml`. These commands are operational reference for a needed local setup, not actions required by the current documentation-only task.

```sh
pnpm install --frozen-lockfile
pnpm db:serve
```

Keep the database terminal running. In a second terminal, prepare the isolated preview only when initial preparation or reviewed pending migrations are needed, then build and start it. An already prepared preview can be started without repeating preparation. [Preparation and recovery guards](tools/README.md#clean-local-service-preview) are described in the tooling guide:

```sh
node tools/run-with-database.mjs --prepare-preview
pnpm build
pnpm preview:fixture
```

Open `http://127.0.0.1:3100`. The fresh preview is `etail_depot_next_services_preview`. Alex Morgan manages two cards and a primary merchant with two submerchants; Jamie Morgan sees only their own card and assigned Pop-up shop. Morgan Support sees the explicitly assigned support queue without customer membership. Startup verifies ownership and completed preparation without migrating or reseeding. Repeated explicit preparation applies only reviewed pending migrations and never replays a completed seed.

Automated tests use `etail_depot_next_services_test`. Retained databases (`etail_depot_next`, `etail_depot_next_test`, `etail_depot_next_preview_v2`, and `etail_depot_next_services_test_retired_d52`) are not application targets. PostgreSQL installation currently supports macOS ARM64; Linux CI uses a disposable PostgreSQL 18.6 service. No real credentials are needed for the local sample. The previous source archive and databases are retained; an independent restore has not been tested.

`dev` and `start` bind to loopback. For a separately configured local instance, copy `.env.example` to `.env.local`, configure `ETAIL_PUBLIC_ORIGIN` to match the port, and supply the new isolated local `DATABASE_URL` through the environment. The scripts do not load legacy environment files. Hosted fixtures are prohibited even if their flag is set.

## Verify

```sh
pnpm exec playwright install chromium
pnpm verify
pnpm test:handoff
pnpm peers check
```

The PostgreSQL server must be running. Tests never substitute SQLite or PGlite. `db:generate` generates SQL from the typed schema; `db:migrate` is guarded for local/test only. The test runner verifies or creates only the explicitly named fresh test database, applies reviewed migrations, and initializes its canonical sample once. Subsequent checks preserve saved test records and permissions; they do not restore retired fixtures. Do not use local migration commands on the hosted database or provision a replacement; follow the recorded hosted migration procedure and authorization.

The dedicated local email journey suite is separate from `pnpm verify` and standard CI:

```sh
pnpm test:email-e2e
```

It requires the guarded local test database and a production build, and uses ports 3101/3102 for isolated synthetic provider transport. It exercises real application routes and persistence without sending email or using real credentials. Coordinate servers before running it. `pnpm verify:hosted-email` is a separate read-only check of the canonical provider settings and hosted controls; it is not a successful-password or mailbox test. See [email reliability evidence](docs/EMAIL_ACCESS_RELIABILITY.md).

`contracts/generated/foundation-openapi.json` is generated from executable Zod schemas with `pnpm contracts:generate` and validated with Swagger Parser. The original contract inventories describe the larger product; they are not claims that those features exist.

## Architecture and review

- `src/modules/identity`: server-only provider boundary and opaque session lifecycle.
- `src/modules/services`: identity binding, explicit Cardholder and Merchant enrollment, and service queries.
- `src/modules/policy`: one deny-by-default capability evaluator.
- `src/modules/workspace`: service dashboards, exact card projections, one saved card-request lifecycle, scoped servicing commands, versions and idempotency receipts.
- `src/modules/ledger` / `src/modules/issuing`: one immutable practice ledger and deterministic sandbox card adapter; real money is disabled.
- `src/modules/access`: one typed service/merchant invitation lifecycle, outside-helper assignments, current authority/delegation ceilings and revocation.
- `src/modules/acquiring`: merchant dashboards, direct primary/submerchant ownership, one payment-channel lifecycle and sandbox payment/refund/transfer commands.
- `src/modules/cases`: customer support cases, follow-up timelines and withdrawal.
- `src/modules/operations`: separate assigned support access and versioned operator responses.
- `src/modules/reports`: Cardholder activity summaries, authorized CSV exports and private saved filter definitions.
- `src/modules/membership`: source-based annual planning estimates; no subscription or reward posting.
- `src/platform/database`: Netlify Database, Drizzle, typed PostgreSQL constraints, and scoped repositories.
- `src/app` / `src/ui`: App Router HTTP entry points and service/resource projections.

Netlify Identity is connected to the login, registration, confirmation and recovery routes. Durable throttling, exact-origin checks, opaque HttpOnly sessions and an unresolved-password-reset barrier protect those flows. The app never puts provider tokens in browser storage or authentication JSON. `ENABLE_REAL_MONEY` is a code-enforced false invariant. Provider identity is distinct from sandbox participation, service permissions and operator authority.

The existing private GitHub repository and dedicated Netlify site are recorded in [project-targets.json](project-targets.json). Excluded legacy Etail resources remain untouched. Automatic Netlify builds are held with `build.ignore`; approved sandbox publications and exact receipts are recorded in status. Do not remove the hold, create replacement resources or publish without the applicable review/release authorization. Preserve current records and reviewed command ownership.

Continue with the [product and technical design](docs/PRODUCT_TECHNICAL_DESIGN.md), [active delivery plan](planning/DELIVERY_PLAN.md), [video review](docs/research/VIDEO_PLANNING_REVIEW.md), [Amex research](docs/research/amex/README.md) and [implementation status](planning/STATUS.md). Earlier architecture and evidence documents remain historical where the current decisions supersede them.
