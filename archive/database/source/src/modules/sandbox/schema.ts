import { sql } from "drizzle-orm";
import { boolean, check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { people } from "../../platform/database/schema";

/** Deliberate use of simulated products; never a real age, KYC or credit decision. */
export const sandboxParticipants = pgTable("sandbox_participants", {
  personId: uuid().primaryKey().references(() => people.id),
  commandId: uuid().notNull().unique(),
  digest: text().notNull(),
  memberCode: text().notNull().unique(),
  acknowledged: boolean().notNull(),
  joinedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, t => [check("sandbox_consent_required", sql`${t.acknowledged}=true`), check("sandbox_code_format", sql`${t.memberCode} ~ '^ED-[A-F0-9]{20}$'`), check("sandbox_join_digest", sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
