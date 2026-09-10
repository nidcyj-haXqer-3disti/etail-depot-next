# Etail Depot Next

A new service experience built from the supplied requirements and Amex front-end research. Customers enter **Cardholder services** or **Merchant services** directly. A primary cardholder oversees connected cards; secondary cardholders see only their own cards and data. A primary merchant oversees its submerchants; delegated users see only their permitted merchant records. Supported changes persist in PostgreSQL under server-owned permissions.

The fresh application uses exactly two service kinds in its database and commands. Identity binding does not enroll someone in either service. Invitations connect named people to explicit Cardholder or merchant permissions; assigned support operators use a separate queue. Activity reports and CSV exports, saved filters, support-case timelines and session revocation reuse these boundaries. These features do not establish full American Express parity.

The [current design](docs/FRESH_TWO_SERVICE_BUILD.md) opens compact overviews with focused views for cards, activity, cardholders and saved requests, or collections, channels, payments, people and setup. One shared service switch connects both dashboards without an account-type chooser. Sign-in security works independently at `/security`. Each submerchant keeps one responsible primary and separately attributed records; a controller can manage units under multiple primaries. Invitations preserve exact permissions, expiry and revocation. Cardholder and Merchant authority remain independent.

**Payment channels** use one form for SMS/text, email, invoice, bill, social media, QR and website links. Responsible primaries can oversee their submerchants' permitted channel and payment work. Test gateway/MID readiness and practice processing are explicitly fictional; no real provider approval is implied. See [implementation status](planning/STATUS.md) for tested behavior and remaining scope.

The sandbox implements practice card creation, funding and purchases, test payment channels, payments, full refunds and bounded transfers through one immutable ledger. Fresh preview and test databases begin with the same current-model canonical sample. Retired source and databases remain recovery artifacts and are excluded from application targets. Live financial services, membership purchases, external invitation delivery and hosted registration remain unimplemented. Invitations work between existing fictional testers. Support responses are handled locally by explicitly assigned operators; the obsolete dispute intake has been retired. Activity reports are not billing statements.

## Run the isolated preview

Use Node **24.19.0** and pnpm **11.19.0**. Dependencies are exact and the single lockfile is `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
pnpm db:serve
```

Keep the database terminal running. In a second terminal, explicitly prepare the new preview, then build and start it. [Preparation and recovery guards](tools/README.md#clean-local-service-preview) are described in the tooling guide:

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

The PostgreSQL server must be running. Tests never substitute SQLite or PGlite. `db:generate` generates SQL from the typed schema; `db:migrate` is guarded for local/test only. The test runner verifies or creates only the explicitly named fresh test database, applies reviewed migrations, and initializes its canonical sample once. Subsequent checks preserve saved test records and permissions; they do not restore retired fixtures. Hosted Netlify migrations will be the sole hosted migration authority after its database is provisioned and validated.

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

Netlify Identity password integration is implemented behind an adapter but remains disconnected from the login route pending the complete hosted lifecycle and abuse controls. The app never puts provider tokens in browser storage or authentication JSON. `ENABLE_REAL_MONEY` is a code-enforced false invariant.

The new private GitHub repository and Netlify site are recorded in `project-targets.json`. Existing Etail resources are excluded. Automatic Netlify builds are held with `build.ignore` pending hosted review; no build hook is configured by this implementation. Do not remove the hold or publish without the required review/release approval.

See [the fresh two-service design](docs/FRESH_TWO_SERVICE_BUILD.md), [Amex research](docs/research/amex/README.md), [implementation status](planning/STATUS.md) and [remaining delivery backlog](planning/backlog.json). Earlier architecture and evidence documents remain historical where the current design supersedes them.
