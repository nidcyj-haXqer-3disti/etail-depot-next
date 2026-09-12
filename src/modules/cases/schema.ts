import { sql } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer, unique, check, foreignKey, index } from "drizzle-orm/pg-core";
import { services, people, serviceMembers, serviceActivity, serviceKind } from "../../platform/database/schema";
import { merchantUnits } from "../acquiring/schema";
import { merchantTestPayments } from "../acquiring/operations-schema";

export const supportCases = pgTable("support_cases", {
  id: uuid().primaryKey().defaultRandom(), serviceId: uuid().notNull().references(() => services.id),
  creatorId: uuid().notNull().references(() => people.id), transactionId: uuid(),
  serviceKind: serviceKind().notNull().default("CARDHOLDER"),
  cardholderCreatorId: uuid().generatedAlwaysAs(sql`CASE WHEN "serviceKind" = 'CARDHOLDER' THEN "creatorId" ELSE NULL END`),
  merchantUnitId: uuid(), paymentId: uuid(),
  reference: text().notNull().unique(), topic: text({enum:["SERVICE","ACCESS","CARD","TRANSACTION","PAYMENT"]}).notNull(), subject: text().notNull(),
  status: text({enum:["OPEN","WITHDRAWN","RESOLVED"]}).notNull().default("OPEN"), version: integer().notNull().default(1),
  createdAt: timestamp({withTimezone:true}).notNull().defaultNow(), updatedAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [unique().on(t.id,t.serviceId,t.creatorId), unique().on(t.id,t.serviceId),
  foreignKey({name:"support_case_service_kind_scope",columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),
  foreignKey({name:"support_case_cardholder_creator_scope",columns:[t.serviceId,t.cardholderCreatorId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),
  foreignKey({columns:[t.transactionId,t.serviceId],foreignColumns:[serviceActivity.id,serviceActivity.serviceId]}),
  foreignKey({name:"support_case_merchant_scope",columns:[t.merchantUnitId,t.serviceId],foreignColumns:[merchantUnits.id,merchantUnits.masterServiceId]}),
  foreignKey({name:"support_case_payment_scope",columns:[t.paymentId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantTestPayments.id,merchantTestPayments.merchantUnitId,merchantTestPayments.serviceId]}),
  check("support_case_context",sql`(${t.serviceKind}='CARDHOLDER' and ${t.merchantUnitId} is null and ${t.paymentId} is null and ${t.topic}<>'PAYMENT') or (${t.serviceKind}='MERCHANT' and ${t.merchantUnitId} is not null and ${t.transactionId} is null and ${t.topic} in ('SERVICE','ACCESS','PAYMENT'))`),
  check("support_case_status",sql`${t.status} in ('OPEN','WITHDRAWN','RESOLVED')`), check("support_case_topic",sql`${t.topic} in ('SERVICE','ACCESS','CARD','TRANSACTION','PAYMENT')`), check("support_case_version",sql`${t.version}>0`), check("support_case_subject",sql`char_length(trim(${t.subject})) between 1 and 100`), index("support_cases_creator_list").on(t.serviceId,t.creatorId,t.createdAt), index("support_cases_merchant_creator_list").on(t.merchantUnitId,t.creatorId,t.createdAt)]);

export const supportCaseMessages = pgTable("support_case_messages", {
  id: uuid().primaryKey().defaultRandom(), caseId: uuid().notNull(), serviceId: uuid().notNull(), creatorId: uuid().notNull(),
  authorId: uuid().notNull().references(() => people.id), authorKind: text({enum:["CUSTOMER","SUPPORT"]}).notNull().default("CUSTOMER"),
  kind: text({enum:["OPENED","MESSAGE","WITHDRAWN","RESOLVED"]}).notNull(), body: text().notNull(),
  sequence: integer().notNull(), createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [foreignKey({columns:[t.caseId,t.serviceId,t.creatorId],foreignColumns:[supportCases.id,supportCases.serviceId,supportCases.creatorId]}), unique().on(t.caseId,t.sequence), check("support_message_author",sql`${t.authorKind} in ('CUSTOMER','SUPPORT') and (${t.authorKind}<>'CUSTOMER' or ${t.authorId}=${t.creatorId})`), check("support_message_kind",sql`${t.kind} in ('OPENED','MESSAGE','WITHDRAWN','RESOLVED')`), check("support_message_body",sql`char_length(trim(${t.body})) between 1 and 2000`),check("support_message_sequence",sql`${t.sequence}>0`)]);

export const supportCaseCommands = pgTable("support_case_commands", {
  commandId: uuid().primaryKey(), caseId: uuid().notNull(), serviceId: uuid().notNull(), creatorId: uuid().notNull(), kind: text().notNull(), digest: text().notNull(), createdAt: timestamp({withTimezone:true}).notNull().defaultNow(),
}, t => [foreignKey({columns:[t.caseId,t.serviceId,t.creatorId],foreignColumns:[supportCases.id,supportCases.serviceId,supportCases.creatorId]}), check("support_command_digest",sql`${t.digest} ~ '^[0-9a-f]{64}$'`)]);
