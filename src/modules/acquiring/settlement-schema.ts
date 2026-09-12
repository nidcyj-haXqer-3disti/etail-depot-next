import {moneyAccounts} from "../money/schema";
import {sql} from "drizzle-orm";
import {pgTable,uuid,text,bigint,timestamp,foreignKey,check,unique,primaryKey} from "drizzle-orm/pg-core";
import {people} from "../../platform/database/schema";
import {merchantTerminals} from "./schema";
import {ledgerJournals} from "../ledger/schema";
import {merchantTestPayments} from "./operations-schema";
export const merchantSettlements=pgTable("merchant_settlements",{
 id:uuid().primaryKey(),moneyAccountId:uuid().references(()=>moneyAccounts.id),serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),actorId:uuid().notNull().references(()=>people.id),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.merchantUnitId,t.serviceId],foreignColumns:[merchantTerminals.id,merchantTerminals.merchantServiceId]}),unique("settlement_scope").on(t.id,t.merchantUnitId,t.serviceId),check("settlement_amount",sql`${t.amountMinor} between 1 and 999999999999`)]);
export const merchantSettlementItems=pgTable("merchant_settlement_items",{
 paymentId:uuid().primaryKey(),settlementId:uuid().notNull(),serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),
},t=>[foreignKey({columns:[t.paymentId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantTestPayments.id,merchantTestPayments.merchantUnitId,merchantTestPayments.serviceId]}),foreignKey({columns:[t.settlementId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantSettlements.id,merchantSettlements.merchantUnitId,merchantSettlements.serviceId]}),check("settlement_item_amount",sql`${t.amountMinor}>0`)]);
export const merchantDeposits=pgTable("merchant_deposits",{
 id:uuid().primaryKey(),reviewToken:text(),settlementId:uuid().notNull(),serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),actorId:uuid().notNull().references(()=>people.id),amountMinor:bigint({mode:"bigint"}).notNull(),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.settlementId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantSettlements.id,merchantSettlements.merchantUnitId,merchantSettlements.serviceId]}),check("deposit_amount",sql`${t.amountMinor} between 1 and 999999999999`)]);
export const merchantDepositEvents=pgTable("merchant_deposit_events",{
 depositId:uuid().primaryKey().references(()=>merchantDeposits.id),commandId:uuid().notNull().unique(),actorId:uuid().notNull().references(()=>people.id),outcome:text({enum:["COMPLETED","FAILED"]}).notNull(),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("deposit_event_outcome",sql`${t.outcome} in ('COMPLETED','FAILED')`)]);

export const merchantDepositItems=pgTable("merchant_deposit_items",{
 depositId:uuid().notNull().references(()=>merchantDeposits.id),paymentId:uuid().notNull().references(()=>merchantTestPayments.id),amountMinor:bigint({mode:"bigint"}).notNull(),
},t=>[primaryKey({columns:[t.depositId,t.paymentId]}),check("deposit_item_amount",sql`${t.amountMinor}>0`)]);

/** Converts a returned historical deposit batch into the same shared money account once. */
export const merchantSettlementCredits=pgTable("merchant_settlement_credits",{
 id:uuid().primaryKey(),settlementId:uuid().notNull().unique().references(()=>merchantSettlements.id),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),
 serviceId:uuid().notNull(),merchantUnitId:uuid().notNull(),amountMinor:bigint({mode:"bigint"}).notNull(),actorId:uuid().notNull().references(()=>people.id),
 journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[foreignKey({columns:[t.settlementId,t.merchantUnitId,t.serviceId],foreignColumns:[merchantSettlements.id,merchantSettlements.merchantUnitId,merchantSettlements.serviceId]}),check("settlement_credit_positive",sql`${t.amountMinor}>0`)]);
