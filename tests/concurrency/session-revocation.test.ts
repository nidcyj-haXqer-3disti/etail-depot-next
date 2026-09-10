import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { afterAll, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { bindIdentity } from "../../src/modules/services/service";
import { SessionService } from "../../src/modules/identity";
import { revokeSelectedSessions } from "../../src/modules/identity/security";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { sessions } from "../../src/platform/database/schema";

afterAll(closeDatabase);
const cookieHeader = (cookie: string) => cookie.split(";")[0]!;
const service = () => new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });

/** Observe real lock waits, not elapsed-time guesses, to establish transaction overlap. */
async function waitForBlockedClient(observer: pg.Client, blockingPid: number): Promise<number> {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const result = await observer.query<{ pid: number }>(
      "SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND $1::integer = ANY(pg_blocking_pids(pid)) ORDER BY pid LIMIT 1",
      [blockingPid],
    );
    if (result.rows[0]) return result.rows[0].pid;
    await delay(10);
  }
  throw new Error("Expected concurrent session operation to wait on the database lock.");
}

for (const revocation of ["identity", "old-cookie", "selected-family"] as const) {
  it(`${revocation} revocation waits for an in-flight rotation and revokes its replacement`, async () => {
    const identity = await bindIdentity("urn:session-concurrency", randomUUID());
    const auth = service();
    const original = await auth.issue(identity);
    const otherDevice = await auth.issue(identity);
    const oldCookie = cookieHeader(original.cookie);
    const rowLocker = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-session-row-barrier" });
    const observer = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-session-lock-observer" });
    const pending: Promise<unknown>[] = [];
    let transactionOpen = false;
    try {
      await rowLocker.connect();
      await observer.connect();
      await rowLocker.query("BEGIN");
      transactionOpen = true;
      const { rows: [locker] } = await rowLocker.query<{ pid: number }>("SELECT pg_backend_pid() AS pid");
      await rowLocker.query('SELECT "tokenHash" FROM app_sessions WHERE "tokenHash" = $1 FOR UPDATE', [original.record.tokenHash]);

      // Rotation obtains the identity lock, then blocks on this test's session-row lock.
      const rotation = auth.rotate(oldCookie);
      pending.push(rotation);
      void rotation.catch(() => undefined);
      const rotatingPid = await waitForBlockedClient(observer, locker!.pid);

      // This must wait on rotation's identity lock before taking its update snapshot.
      const revoke = revocation === "identity" ? auth.revokeIdentity(identity.identityId) : revocation === "old-cookie" ? auth.logout(oldCookie) : revokeSelectedSessions(otherDevice.record, { familyIds: [original.record.familyId] });
      pending.push(revoke);
      void revoke.catch(() => undefined);
      const revokingPid = await waitForBlockedClient(observer, rotatingPid);
      expect(revokingPid).not.toBe(rotatingPid);
      expect(rotatingPid).not.toBe(locker!.pid);
      await rowLocker.query("COMMIT");
      transactionOpen = false;

      const replacement = await rotation;
      expect(replacement).not.toBeNull();
      await revoke;
      expect(await auth.authenticate(oldCookie)).toBeNull();
      expect(await auth.authenticate(cookieHeader(replacement!.cookie))).toBeNull();
      const remaining = await auth.authenticate(cookieHeader(otherDevice.cookie));
      expect(remaining === null).toBe(revocation === "identity");
      const persisted = await getDb().select().from(sessions).where(eq(sessions.identityId, identity.identityId));
      expect(persisted.filter(row => row.familyId === original.record.familyId && row.revokedAt === null)).toHaveLength(0);
      expect(persisted.filter(row => row.revokedAt === null)).toHaveLength(revocation === "identity" ? 0 : 1);
    } finally {
      if (transactionOpen) await rowLocker.query("ROLLBACK");
      await Promise.allSettled(pending);
      await Promise.all([rowLocker.end(), observer.end()]);
    }
  });
}

it("the database forbids a second live token in one family and preserves the original", async () => {
  const identity = await bindIdentity("urn:session-concurrency", randomUUID());
  const auth = service();
  const original = await auth.issue(identity);
  await expect(sessionRepository.insert({ ...original.record, tokenHash: randomUUID().replaceAll("-", "").repeat(2) })).rejects.toThrow();
  expect(await auth.authenticate(cookieHeader(original.cookie))).not.toBeNull();
});
