import { createHash } from "node:crypto";
import { eq, lt, sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { SecurityError } from "../../platform/security/origin";
import { passwordLoginThrottle } from "./schema";

export interface LoginAttemptLimiter { consume(email: string): Promise<void> }
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
/** Global upstream budget + per-login budget; database clock and locks work across app processes. */
export const passwordAttemptLimiter: LoginAttemptLimiter = {
  async consume(email) {
    const budgets = [
      { key: hash("password-login:global"), limit: 60, seconds: 60 },
      { key: hash(`password-login:email:${email.trim().toLowerCase()}`), limit: 10, seconds: 900 },
    ].sort((a, b) => a.key.localeCompare(b.key));
    await getDb().transaction(async tx => {
      for (const budget of budgets) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"password-login:" + budget.key},0))`);
      const result = await tx.execute<{ now: Date }>(sql`select clock_timestamp() as now`);
      const now = new Date(result.rows[0]!.now);
      // Expired email buckets are disposable; never delete identities, sessions or audit history.
      await tx.delete(passwordLoginThrottle).where(lt(passwordLoginThrottle.windowStartedAt, new Date(now.getTime() - 86_400_000)));
      for (const budget of budgets) {
        const [current] = await tx.select().from(passwordLoginThrottle).where(eq(passwordLoginThrottle.key, budget.key)).for("update");
        const inWindow = current && current.windowStartedAt.getTime() > now.getTime() - budget.seconds * 1000;
        if (inWindow && current.attempts >= budget.limit) throw new SecurityError("SIGN_IN_RATE_LIMITED", 429);
        if (!current) await tx.insert(passwordLoginThrottle).values({ key: budget.key, attempts: 1, windowStartedAt: now });
        else await tx.update(passwordLoginThrottle).set({ attempts: inWindow ? current.attempts + 1 : 1, windowStartedAt: inWindow ? current.windowStartedAt : now }).where(eq(passwordLoginThrottle.key, budget.key));
      }
    });
  },
};
