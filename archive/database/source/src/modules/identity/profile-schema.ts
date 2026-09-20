import {sql} from "drizzle-orm";
import {check, integer, pgTable, text, timestamp, unique, uuid} from "drizzle-orm/pg-core";
import {people} from "../../platform/database/schema";

/** Typed edit receipts; no credentials or arbitrary personal-data snapshots. */
export const profileCommands = pgTable("personal_profile_commands", {
  commandId: uuid().primaryKey(),
  personId: uuid().notNull().references(() => people.id),
  digest: text().notNull(),
  savedVersion: integer().notNull(),
  createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [unique().on(t.personId,t.savedVersion),
  check("profile_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`),
  check("profile_command_version",sql`${t.savedVersion}>1`)]);
