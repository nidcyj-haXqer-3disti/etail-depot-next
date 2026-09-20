import { sql } from "drizzle-orm";
import { boolean, check, foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { services, serviceKind, people } from "../../platform/database/schema";

/** Declared test personas only. This is never identity verification or merchant approval. */
export const merchantSetupEligibility = pgTable("merchant_setup_eligibility", {
  personId: uuid().primaryKey().references(() => people.id),
  personaKind: text({ enum: ["FICTIONAL_ADULT", "FICTIONAL_SUPERVISED"] }).notNull(),
  fictional: boolean().notNull().default(true),
}, t => [check("merchant_persona_kind", sql`${t.personaKind} in ('FICTIONAL_ADULT','FICTIONAL_SUPERVISED')`), check("merchant_persona_fictional", sql`${t.fictional}=true`)]);

/** One deliberate primary merchant creation effect, independent of Cardholder services. */
export const merchantServiceCommands = pgTable("merchant_service_commands", {
  commandId: uuid().primaryKey(), actorId: uuid().notNull().references(() => people.id),
  merchantServiceId: uuid().notNull(), merchantKind: serviceKind().notNull().default("MERCHANT"),
  digest: text().notNull(), createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [
  foreignKey({columns:[t.merchantServiceId,t.merchantKind],foreignColumns:[services.id,services.kind]}),
  check("merchant_command_kind",sql`${t.merchantKind}='MERCHANT'`),
  check("merchant_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`),
]);
