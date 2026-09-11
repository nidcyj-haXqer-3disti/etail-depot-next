import { readFileSync } from "node:fs";
import pg from "pg";

export const applicationOrigin = "http://127.0.0.1:3101";
export const fixtureOrigin = "http://127.0.0.1:3102";
export const isolatedDatabase = "postgres://etail_local@127.0.0.1:55439/etail_depot_next_services_test";
export const fixtureHeader = "etail-isolated-email-test";
export function assertEmailHarnessEnvironment(env: Readonly<Record<string, string | undefined>> = process.env): void {
  if (env.DATABASE_URL !== isolatedDatabase || !["local", "test"].includes(env.APP_ENV ?? "") ||
      env.ENABLE_REAL_MONEY !== "false" || (env.CI && env.CI !== "false") ||
      ["NETLIFY", "SITE_ID", "CONTEXT", "URL", "NETLIFY_DB_URL", "NETLIFY_DATABASE_URL"].some(key => !!env[key])) {
    throw new Error("Email harness requires its isolated local test database and no hosted configuration.");
  }
}
export function pinnedIdentityEndpoint(): string {
  const targets = JSON.parse(readFileSync(new URL("../../project-targets.json", import.meta.url), "utf8"));
  if (targets.project_key !== "ETAIL_DEPOT_NEXT_GREENFIELD_2026" ||
      targets.netlify.site_id !== "cbbb6c24-9dbc-43a2-9234-e4357b5b5280" ||
      targets.netlify.canonical_origin !== "https://etail-depot-next.netlify.app" ||
      targets.release.real_money_allowed !== false) throw new Error("Unexpected email harness project target.");
  return `${targets.netlify.canonical_origin}/.netlify/identity`;
}
/** Verify the database itself before any harness reset or application startup. */
export async function verifyEmailHarnessDatabase(): Promise<void> {
  assertEmailHarnessEnvironment();
  const client = new pg.Client({ connectionString: isolatedDatabase, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    const { rows: [actual] } = await client.query(`SELECT current_database() AS database, current_user AS role,
      pg_get_userbyid(datdba) AS owner, shobj_description(oid, 'pg_database') AS marker
      FROM pg_database WHERE datname = current_database()`);
    if (actual?.database !== "etail_depot_next_services_test" || actual.role !== "etail_local" || actual.owner !== "etail_local" ||
        actual.marker !== "ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:test") throw new Error("Email harness database ownership mismatch.");
  } finally { await client.end(); }
}
