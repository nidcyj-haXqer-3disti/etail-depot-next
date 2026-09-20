# Inactive database history

D108 · 20 September 2026

The user approved a public website with links to the separately hosted Ledgix and Trolleys services, while preserving existing database records. The previous Etail account, authentication and financial backend has been removed from the active application. This directory preserves its database definition and migration history; it is not a new database or an active backend.

The complete pre-retirement application, runtime tools and dependencies are recorded in Git commit **`111b703d9793c53d414f6c1ab0ec8985a5e54095`**. The archive is intentionally limited to database recovery evidence instead of another executable copy of that application.

## Contents

| Path | Preserved material |
| --- | --- |
| `migrations/` | All 24 ordered SQL migrations and their 15 existing snapshots, moved byte-for-byte from `netlify/database/migrations/`. Directory names and filenames are unchanged below `migrations/`. |
| `source/src/modules/` | Historical Drizzle schema definitions and constraint/cutover SQL, retaining their original module paths. |
| `source/src/platform/database/` | Historical shared people, service, card, session and activity schema, plus service constraint SQL. |
| `source/drizzle.config.ts` | The original schema-generation inventory from the pre-retirement commit. |
| `manifest.json` | Original/archive paths, byte lengths and SHA-256 checksums for every preserved migration, snapshot and schema/config source file. |
| `local-audit.json` | Aggregate results of the read-only local database check performed before source retirement. |

The schema source is reference material, not a standalone package. Some files import historical helpers and shared types that are available in the recorded Git commit. Do not repair those imports inside this archive or reintroduce archived modules into the public website.

## Database preservation

This cleanup issued no SQL migration, schema change, reset, seed, financial command or customer-data write. Moving application source does not undo previously applied migrations or remove database records. No customer rows, credentials, provider tokens or database connection strings are included here. **This archive is not a database backup.**

The following local databases were checked inside `BEGIN TRANSACTION READ ONLY`, after verifying PostgreSQL 18.6, owner `etail_local` and their exact `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69` generation markers:

| Database | Matching migration receipts | Public tables | Constraints | Unvalidated constraints | Disabled custom triggers |
| --- | ---: | ---: | ---: | ---: | ---: |
| `etail_depot_next_services_preview` | 24/24 | 96 | 1,245 | 0 | 0 |
| `etail_depot_next_services_test` | 24/24 | 96 | 1,245 | 0 | 0 |

Both had zero pending migrations and zero checksum mismatches. These are local catalog and migration-history checks, not a hosted-database audit, customer-record comparison, backup verification or certification of financial behavior. The retired D69 predecessor databases were not opened.

## Inactive by design

Migrations no longer occupy the active `netlify/database/migrations` discovery path. The public application must not import this archive, connect to the retired backend or run its migrations during build, startup or deployment. Archival TypeScript is excluded from active compilation and linting.

Existing hosted Database and Identity resources, stored records, provider configuration and external credentials are outside this source-only retirement. In particular, removing application authentication routes does not itself disable a separately managed Identity service or revoke existing provider accounts.

## Recovery boundary

1. Verify archived file hashes against `manifest.json` and inspect the recorded Git commit before any recovery work.
2. Establish the intended database identity and its existing migration receipts. Applied migration history must remain immutable; do not rename, regenerate or replay it as an empty database setup.
3. Obtain a verified, separately authorized data backup before any future database alteration or restoration. No backup was created or tested by this cleanup.
4. Recover the complete prior application only in an explicitly authorized isolated checkout, using its original dependency lockfile and guarded database tools. Restoring schema source alone does not restore the backend.

Reactivating internal accounts, restoring data, migrating customers to either vendor, enabling real money, or changing hosted resources requires a separate implementation and verification scope. The public website release does none of those things.
