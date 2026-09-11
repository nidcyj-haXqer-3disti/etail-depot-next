import {sql} from "drizzle-orm";
import {pgTable,uuid,text,bigint,integer,timestamp,primaryKey,foreignKey,check,index,unique} from "drizzle-orm/pg-core";
import {services,serviceMembers,people} from "../../platform/database/schema";
import {ledgerJournals} from "../ledger/schema";

export const cardholderFundingIntents=pgTable("cardholder_funding_intents",{
 id:uuid().primaryKey(),serviceId:uuid().notNull().references(()=>services.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),confirmCommandId:uuid().notNull().unique(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("funding_intent_amount",sql`${t.amountMinor} between 1 and 999999999999`)]);

export const cardholderTopups=pgTable("cardholder_topups",{
 id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull().references(()=>services.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),source:text().notNull().default("SANDBOX_BANK"),
 journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("cardholder_topup_amount",sql`${t.amountMinor} between 1 and 999999999999 and ${t.currency}='USD'`),check("cardholder_topup_source",sql`${t.source}='SANDBOX_BANK'`),index("cardholder_topup_service_date").on(t.serviceId,t.createdAt)]);

export const cardholderSpendingLimits=pgTable("cardholder_spending_limits",{
 serviceId:uuid().notNull(),personId:uuid().notNull(),monthlyLimitMinor:bigint({mode:"bigint"}).notNull(),
 version:integer().notNull().default(1),updatedBy:uuid().notNull().references(()=>people.id),updatedAt:timestamp({withTimezone:true}).notNull(),
},t=>[primaryKey({columns:[t.serviceId,t.personId]}),foreignKey({columns:[t.serviceId,t.personId],foreignColumns:[serviceMembers.serviceId,serviceMembers.personId]}),check("cardholder_monthly_limit",sql`${t.monthlyLimitMinor} between 0 and 999999999999 and ${t.version}>0`)]);

export const cardholderLimitChanges=pgTable("cardholder_limit_changes",{
 id:uuid().primaryKey().defaultRandom(),serviceId:uuid().notNull(),personId:uuid().notNull(),actorId:uuid().notNull().references(()=>people.id),
 previousMinor:bigint({mode:"bigint"}).notNull(),monthlyLimitMinor:bigint({mode:"bigint"}).notNull(),version:integer().notNull(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[unique("cardholder_limit_history_version").on(t.serviceId,t.personId,t.version),foreignKey({columns:[t.serviceId,t.personId],foreignColumns:[cardholderSpendingLimits.serviceId,cardholderSpendingLimits.personId]}),check("cardholder_limit_change_values",sql`${t.previousMinor} between 0 and 999999999999 and ${t.monthlyLimitMinor} between 0 and 999999999999 and ${t.version}>0`)]);
