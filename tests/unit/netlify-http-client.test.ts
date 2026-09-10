import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getDatabase } from "@netlify/database";
import { drizzle } from "drizzle-orm/netlify-db";
import { sql } from "drizzle-orm";
import targets from "../../project-targets.json";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { netlifyHttpQueryClient } from "../../src/platform/database/netlify-http-client";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { hashSessionToken, SessionService } from "../../src/modules/identity/session";
import { sessions } from "../../src/platform/database/schema";

const firstConnection = "postgresql://synthetic@database.example.invalid/synthetic";
const refreshedConnection = "postgresql://synthetic@refreshed.example.invalid/synthetic";
const token = "a".repeat(43), hash = hashSessionToken(token);
const identityId = "10000000-0000-4000-8000-000000000001", personId = "10000000-0000-4000-8000-000000000002";
const familyId = "10000000-0000-4000-8000-000000000003";
const issuedAt = "2030-01-01T00:00:00.000Z", expiresAt = "2030-01-01T08:00:00.000Z";
interface WireQuery { query: string; params: string[] }

function wireResult(query: WireQuery) {
  if (query.query.includes('"app_sessions"')) return {
    command: "SELECT", rowCount: 1,
    fields: [
      { name: "tokenHash", dataTypeID: 25 }, { name: "identityId", dataTypeID: 2950 },
      { name: "personId", dataTypeID: 2950 }, { name: "familyId", dataTypeID: 2950 },
      { name: "issuedAt", dataTypeID: 1184 }, { name: "expiresAt", dataTypeID: 1184 },
      { name: "revokedAt", dataTypeID: 1184 },
    ],
    rows: [[hash, identityId, personId, familyId, issuedAt, expiresAt, null]],
  };
  return { command: "SELECT", rowCount: 1, fields: [{ name: "value", dataTypeID: 23 }], rows: [[query.params[0] ?? "1"]] };
}

let fetcher: ReturnType<typeof vi.fn<typeof fetch>>;
beforeEach(() => {
  vi.stubEnv("APP_ENV", "production"); vi.stubEnv("SITE_ID", targets.netlify.site_id);
  vi.stubEnv("ETAIL_PUBLIC_ORIGIN", targets.netlify.canonical_origin); vi.stubEnv("ENABLE_REAL_MONEY", "false");
  vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY", "false"); vi.stubEnv("NETLIFY_DB_DRIVER", "serverless");
  vi.stubEnv("NETLIFY_DB_URL", firstConnection);
  // Exercise the installed Netlify/Drizzle/Neon stack. Only HTTP transport is fake.
  fetcher = vi.fn<typeof fetch>(async (input, init) => {
    expect(new URL(String(input)).hostname.endsWith(".invalid")).toBe(true);
    const request = JSON.parse(String(init?.body)) as WireQuery | { queries: WireQuery[] };
    return Response.json("queries" in request ? { results: request.queries.map(wireResult) } : wireResult(request));
  });
  vi.stubGlobal("fetch", fetcher);
});
afterEach(async () => { await closeDatabase(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("Netlify Database HTTP query compatibility", () => {
  it("reads a session through the application repository and authenticates mapped timestamps after hosted sign-in", async () => {
    const service = new SessionService(sessionRepository, { appEnv: "production", publicOrigin: targets.netlify.canonical_origin }, () => new Date("2030-01-01T01:00:00Z"));
    const current = await service.authenticate(`__Host-etail_session=${token}`);
    expect(current).toEqual({ tokenHash: hash, identityId, personId, familyId, issuedAt: new Date(issuedAt), expiresAt: new Date(expiresAt), revokedAt: null });
    expect(current!.issuedAt).toBeInstanceOf(Date); expect(current!.expiresAt).toBeInstanceOf(Date);
    expect(fetcher).toHaveBeenCalledOnce();
    const request = JSON.parse(String(fetcher.mock.calls[0]![1]!.body)) as WireQuery;
    expect(request.query).toContain('"app_sessions"."tokenHash" = $1');
    expect(request.params).toEqual([hash]);
  });

  it("preserves full raw query results and bound parameters through the same application client", async () => {
    const result = await getDb().execute<{ value: number }>(sql`select ${7}::int as value`);
    expect(result.rows).toEqual([{ value: 7 }]); expect(result.rowCount).toBe(1);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(JSON.parse(String(fetcher.mock.calls[0]![1]!.body))).toEqual({ query: "select $1::int as value", params: ["7"] });
  });

  it("retains explicit query, tagged templates, transaction batching, refreshing credentials and the existing pool", async () => {
    const connection = getDatabase();
    if (connection.driver !== "serverless") throw new Error("The test requires the actual serverless adapter");
    const originalPool = connection.pool, original = connection.httpClient;
    connection.httpClient = netlifyHttpQueryClient(original);
    try {
      expect(connection.pool).toBe(originalPool);
      expect(await connection.httpClient.query("select $1::int as value", [3])).toEqual([{ value: 3 }]);
      expect(await connection.httpClient`select ${5}::int as value`).toEqual([{ value: 5 }]);
      const db = drizzle({ client: connection });
      expect(await db.batch([db.select().from(sessions), db.select().from(sessions)])).toEqual([
        [{ tokenHash: hash, identityId, personId, familyId, issuedAt: new Date(issuedAt), expiresAt: new Date(expiresAt), revokedAt: null }],
        [{ tokenHash: hash, identityId, personId, familyId, issuedAt: new Date(issuedAt), expiresAt: new Date(expiresAt), revokedAt: null }],
      ]);
      vi.stubEnv("NETLIFY_DB_URL", refreshedConnection);
      expect(await db.execute<{ value: number }>(sql`select ${9}::int as value`)).toMatchObject({ rows: [{ value: 9 }] });
      expect(connection.pool).toBe(originalPool); expect(connection.connectionString).toBe(refreshedConnection);
      expect(new Headers(fetcher.mock.calls[0]![1]!.headers).get("Neon-Connection-String")).toBe(firstConnection);
      expect(new Headers(fetcher.mock.calls.at(-1)![1]!.headers).get("Neon-Connection-String")).toBe(refreshedConnection);
    } finally { await connection.pool.end(); }
  });
});
