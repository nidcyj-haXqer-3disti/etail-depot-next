import { sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { SecurityError } from "../../platform/security/origin";

/** Local verification → session issuance and recovery → password update share this boundary. */
export async function withPasswordAuthentication<T>(operation: () => Promise<T>): Promise<T> {
  return getDb().transaction(async tx => {
    // Nonblocking: waiting auth connections must not starve the binding/session transactions.
    const result = await tx.execute<{ acquired: boolean }>(sql`select pg_try_advisory_xact_lock(hashtextextended('etail:local-password-authentication',0)) as acquired`);
    if (result.rows[0]?.acquired !== true) throw new SecurityError("AUTHENTICATION_BUSY", 409);
    return operation();
  });
}
