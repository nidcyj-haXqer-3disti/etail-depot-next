import { sql } from "drizzle-orm";
import { pgTable, uuid, text, integer, timestamp, boolean, foreignKey, check } from "drizzle-orm/pg-core";
import { serviceMembers } from "../../platform/database/schema";

/** Private saved filters only: no financial rows, files, balances or data snapshots. */
export const savedReportDefinitions = pgTable("saved_report_definitions", {
  id: uuid().primaryKey().defaultRandom(), serviceId: uuid().notNull(), personId: uuid().notNull(),
  name: text().notNull(), source: text({ enum: ["ACTIVITY"] }).notNull(),
  status: text({ enum: ["ALL", "POSTED", "PENDING", "DECLINED"] }).notNull(),
  fromDate: text().notNull(), toDate: text().notNull(), query: text().notNull().default(""),
  version: integer().notNull().default(1), deleted: boolean().notNull().default(false),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  foreignKey({ columns: [table.serviceId, table.personId], foreignColumns: [serviceMembers.serviceId, serviceMembers.personId] }),
  check("report_definition_source", sql`${table.source} = 'ACTIVITY'`),
  check("report_definition_status", sql`${table.status} in ('ALL','POSTED','PENDING','DECLINED')`),
  check("report_definition_name", sql`char_length(${table.name}) between 1 and 60`),
  check("report_definition_query", sql`char_length(${table.query}) <= 80`),
  check("report_definition_dates", sql`${table.fromDate} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and ${table.toDate} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' and ${table.fromDate} <= ${table.toDate}`),
  check("report_definition_version", sql`${table.version} > 0`),
]);

export const reportDefinitionCommands = pgTable("report_definition_commands", {
  commandId: uuid().primaryKey(), serviceId: uuid().notNull(), personId: uuid().notNull(),
  definitionId: uuid().notNull().references(() => savedReportDefinitions.id),
  kind: text({ enum: ["CREATE", "UPDATE", "DELETE"] }).notNull(), digest: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, table => [
  foreignKey({ columns: [table.serviceId, table.personId], foreignColumns: [serviceMembers.serviceId, serviceMembers.personId] }),
  check("report_command_kind", sql`${table.kind} in ('CREATE','UPDATE','DELETE')`),
  check("report_command_digest", sql`${table.digest} ~ '^[0-9a-f]{64}$'`),
]);
