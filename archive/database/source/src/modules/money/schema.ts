import {sql} from "drizzle-orm";
import {pgTable,uuid,text,integer,bigint,timestamp,check,foreignKey,unique,index} from "drizzle-orm/pg-core";
import {people,services,serviceKind} from "../../platform/database/schema";
import {ledgerJournals} from "../ledger/schema";

/** Ownership is independent of holding a card or operating a terminal. */
export const moneyAccounts=pgTable("money_accounts",{
 id:uuid().primaryKey().defaultRandom(),ownerPersonId:uuid().notNull().references(()=>people.id),displayName:text().notNull(),serviceKind:serviceKind().notNull(),
 currency:text().notNull().default("USD"),status:text({enum:["ACTIVE","SUSPENDED","CLOSED"]}).notNull().default("ACTIVE"),
 version:integer().notNull().default(1),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[unique("money_account_kind_scope").on(t.id,t.serviceKind),check("money_account_fields",sql`char_length(trim(${t.displayName})) between 1 and 80 and ${t.currency}='USD' and ${t.status} in ('ACTIVE','SUSPENDED','CLOSED') and ${t.version}>0`),index("money_account_owner").on(t.ownerPersonId,t.id)]);

export const moneyAccountServices=pgTable("money_account_services",{
 serviceId:uuid().primaryKey(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),serviceKind:serviceKind().notNull(),
 createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[foreignKey({columns:[t.serviceId,t.serviceKind],foreignColumns:[services.id,services.kind]}),foreignKey({columns:[t.moneyAccountId,t.serviceKind],foreignColumns:[moneyAccounts.id,moneyAccounts.serviceKind]}),unique("one_service_per_money_account").on(t.moneyAccountId)]);

export const moneyCommands=pgTable("money_commands",{
 commandId:uuid().primaryKey(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),actorId:uuid().notNull().references(()=>people.id),
 kind:text({enum:["PREPARE_FUNDING","FUND","PREPARE_WITHDRAWAL","WITHDRAW","WITHDRAWAL_RESULT"]}).notNull(),digest:text().notNull(),createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},t=>[check("money_command_fields",sql`${t.kind} in ('PREPARE_FUNDING','FUND','PREPARE_WITHDRAWAL','WITHDRAW','WITHDRAWAL_RESULT') and ${t.digest} ~ '^[0-9a-f]{64}$'`)]);

export const moneyFundingIntents=pgTable("money_funding_intents",{
 id:uuid().primaryKey(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),confirmCommandId:uuid().notNull().unique(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_funding_intent_amount",sql`${t.amountMinor} between 1 and 999999999999`)]);

export const moneyTopups=pgTable("money_topups",{
 id:uuid().primaryKey(),commandId:uuid().notNull().unique(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),currency:text().notNull().default("USD"),source:text().notNull().default("SANDBOX_BANK"),
 journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_topup_fields",sql`${t.amountMinor} between 1 and 999999999999 and ${t.currency}='USD' and ${t.source}='SANDBOX_BANK'`),index("money_topup_account_date").on(t.moneyAccountId,t.createdAt)]);

export const moneyWithdrawalIntents=pgTable("money_withdrawal_intents",{
 id:uuid().primaryKey(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),confirmCommandId:uuid().notNull().unique(),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_withdrawal_intent_amount",sql`${t.amountMinor} between 1 and 999999999999`)]);

export const moneyWithdrawals=pgTable("money_withdrawals",{
 id:uuid().primaryKey(),intentId:uuid().notNull().unique().references(()=>moneyWithdrawalIntents.id),commandId:uuid().notNull().unique(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),actorId:uuid().notNull().references(()=>people.id),
 amountMinor:bigint({mode:"bigint"}).notNull(),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_withdrawal_amount",sql`${t.amountMinor} between 1 and 999999999999`),index("money_withdrawal_account_date").on(t.moneyAccountId,t.createdAt)]);

export const moneyWithdrawalEvents=pgTable("money_withdrawal_events",{
 withdrawalId:uuid().primaryKey().references(()=>moneyWithdrawals.id),commandId:uuid().notNull().unique(),actorId:uuid().notNull().references(()=>people.id),
 outcome:text({enum:["COMPLETED","FAILED"]}).notNull(),journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_withdrawal_outcome",sql`${t.outcome} in ('COMPLETED','FAILED')`)]);

/** D73 moves historical spendable balances once; original entries remain immutable. */
export const moneyCutoverTransfers=pgTable("money_cutover_transfers",{
 id:uuid().primaryKey(),moneyAccountId:uuid().notNull().references(()=>moneyAccounts.id),sourceServiceId:uuid().notNull().references(()=>services.id),
 sourceBucket:text().notNull(),sourceMerchantUnitId:uuid(),amountMinor:bigint({mode:"bigint"}).notNull(),
 journalId:uuid().notNull().unique().references(()=>ledgerJournals.id),createdAt:timestamp({withTimezone:true}).notNull(),
},t=>[check("money_cutover_source",sql`(${t.sourceBucket}='GROUP_AVAILABLE' and ${t.sourceMerchantUnitId} is null) or (${t.sourceBucket}='PAYOUT_CLEARING' and ${t.sourceMerchantUnitId} is not null)`),check("money_cutover_amount",sql`${t.amountMinor}>0`)]);
