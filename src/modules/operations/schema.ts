import { sql } from "drizzle-orm";
import { boolean, check, foreignKey, integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { people, services } from "../../platform/database/schema";
import { supportCases } from "../cases/schema";

/** Support authority is assigned explicitly, independently of customer membership. */
export const operatorServiceAccess = pgTable("operator_service_access", {
  serviceId: uuid().notNull().references(() => services.id),
  personId: uuid().notNull().references(() => people.id),
  state: text({ enum: ["ACCEPTED", "REVOKED"] }).notNull(),
  version: integer().notNull().default(1),
  canRespond: boolean().notNull().default(false),
}, t => [primaryKey({ columns: [t.serviceId, t.personId] }), check("operator_access_state", sql`${t.state} in ('ACCEPTED','REVOKED') and ${t.version}>0`)]);

export const operatorCommands = pgTable("operator_command_receipts", {
  commandId: uuid().primaryKey(),
  serviceId: uuid().notNull(), actorId: uuid().notNull(),
  caseId: uuid().notNull().references(() => supportCases.id),
  digest: text().notNull(), createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, t => [foreignKey({columns:[t.caseId,t.serviceId],foreignColumns:[supportCases.id,supportCases.serviceId]}), foreignKey({ columns: [t.serviceId, t.actorId], foreignColumns: [operatorServiceAccess.serviceId, operatorServiceAccess.personId] }), check("operator_receipt_digest", sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
