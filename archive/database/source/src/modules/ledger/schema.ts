import { sql } from "drizzle-orm";
import { bigint, check, foreignKey, index, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { services, cards } from "../../platform/database/schema";
import { merchantTerminals } from "../acquiring/schema";
import {moneyAccounts} from "../money/schema";
import { JOURNAL_KINDS, LEDGER_BUCKETS } from "./contracts";

/** Simulation USD only. Balances are sums of immutable lines, never mutable caches. */
export const ledgerJournals = pgTable("ledger_journals", {
  id: uuid().primaryKey().defaultRandom(),
  businessKey: text().notNull().unique(),
  kind: text({ enum: JOURNAL_KINDS }).notNull(),
  referenceId: uuid().notNull(),
  currency: text().notNull().default("USD"),
  digest: text().notNull(),
  creationTransaction: bigint({ mode: "bigint" }).notNull().default(sql`txid_current()`),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, t => [
  unique("ledger_journal_reference_effect").on(t.kind, t.referenceId),
  check("ledger_journal_key", sql`char_length(${t.businessKey}) between 1 and 200`),
  check("ledger_journal_kind", sql`${t.kind} in ('GROUP_FUNDING','CARD_FUNDING','CARD_PURCHASE','CARD_REFUND','MERCHANT_PAYMENT','MERCHANT_REFUND','MERCHANT_PAYOUT','MERCHANT_SETTLEMENT','DEPOSIT_RESERVE','DEPOSIT_RELEASE','MONEY_FUNDING','MONEY_WITHDRAWAL_RESERVE','MONEY_WITHDRAWAL_COMPLETE','MONEY_WITHDRAWAL_RELEASE','MONEY_CUTOVER','NETWORK_CAPTURE','NETWORK_AVAILABLE','NETWORK_REFUND_RESERVE','NETWORK_REFUND_COMPLETE','NETWORK_REFUND_RELEASE')`),
  check("ledger_journal_currency", sql`${t.currency}='USD'`),
  check("ledger_journal_digest", sql`${t.digest} ~ '^[0-9a-f]{64}$'`),
]);

export const ledgerEntries = pgTable("ledger_entries", {
  id: uuid().primaryKey().defaultRandom(),
  journalId: uuid().notNull().references(() => ledgerJournals.id),
  lineNumber: integer().notNull(),
  serviceId: uuid().references(() => services.id),
  moneyAccountId:uuid().references(()=>moneyAccounts.id),
  bucket: text({ enum: LEDGER_BUCKETS }).notNull(),
  cardId: uuid(),
  merchantUnitId: uuid(),
  deltaMinor: bigint({ mode: "bigint" }).notNull(),
  currency: text().notNull().default("USD"),
}, t => [
  unique("ledger_entry_line").on(t.journalId, t.lineNumber),
  foreignKey({ name: "ledger_entry_card_scope", columns: [t.cardId, t.serviceId], foreignColumns: [cards.id, cards.serviceId] }),
  foreignKey({ name: "ledger_entry_merchant_scope", columns: [t.merchantUnitId, t.serviceId], foreignColumns: [merchantTerminals.id, merchantTerminals.merchantServiceId] }),
  check("ledger_entry_amount", sql`${t.deltaMinor}<>0 and ${t.currency}='USD'`),
  check("ledger_entry_line_number", sql`${t.lineNumber} between 1 and 64`),
  check("ledger_entry_resource_shape", sql`(${t.moneyAccountId} is not null and ${t.serviceId} is null and ${t.cardId} is null and ${t.merchantUnitId} is null and ${t.bucket} in ('MONEY_SOURCE','MONEY_AVAILABLE','MONEY_WITHDRAWAL_PENDING','MONEY_WITHDRAWN')) or (${t.moneyAccountId} is null and ${t.serviceId} is not null and ((${t.bucket} in ('PRACTICE_SOURCE','GROUP_AVAILABLE') and ${t.cardId} is null and ${t.merchantUnitId} is null) or (${t.bucket} in ('CARD_AVAILABLE','CARD_SPENT') and ${t.cardId} is not null and ${t.merchantUnitId} is null) or (${t.bucket} in ('GATEWAY_CLEARING','MERCHANT_AVAILABLE','MERCHANT_SETTLED','MERCHANT_CAPTURE_PENDING','MERCHANT_REFUND_PENDING','MERCHANT_PAYOUT_PENDING','PAYOUT_CLEARING') and ${t.cardId} is null and ${t.merchantUnitId} is not null)))`),
  index("ledger_entry_position").on(t.serviceId, t.bucket, t.cardId, t.merchantUnitId),
  index("ledger_money_account_position").on(t.moneyAccountId,t.bucket),
]);
