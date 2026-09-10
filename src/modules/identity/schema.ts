import { sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, check, index, uuid } from "drizzle-orm/pg-core";
import { identityBindings } from "../../platform/database/schema";

/** Bounded local password-attempt counters; no emails, passwords, IPs or provider tokens. */
export const passwordLoginThrottle = pgTable("password_login_throttle", {
  key: text().primaryKey(),
  attempts: integer().notNull(),
  windowStartedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  check("password_login_throttle_key", sql`${table.key} ~ '^[a-f0-9]{64}$'`),
  check("password_login_throttle_attempts", sql`${table.attempts}>0 and ${table.attempts}<=60`),
  index("password_login_throttle_cleanup").on(table.windowStartedAt),
]);

/** A pending external password write cannot be cleared by a new login, timer or later reset. */
export const identityPasswordResets = pgTable("identity_password_resets", {
  identityId: uuid().primaryKey().references(() => identityBindings.id),
  attemptId: uuid().notNull().unique(),
  state: text({ enum: ["RESET_PENDING", "COMPLETE"] }).notNull(),
  startedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp({ withTimezone: true }),
}, table => [
  check("identity_password_reset_state", sql`${table.state} in ('RESET_PENDING','COMPLETE')`),
  check("identity_password_reset_completion", sql`(${table.state}='RESET_PENDING' and ${table.completedAt} is null) or (${table.state}='COMPLETE' and ${table.completedAt} is not null and ${table.completedAt}>=${table.startedAt})`),
]);
