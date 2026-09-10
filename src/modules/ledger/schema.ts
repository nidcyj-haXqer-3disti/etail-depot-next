import { sql } from "drizzle-orm";
import { bigint, check, foreignKey, index, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { services, cards } from "../../platform/database/schema";
import { merchantUnits } from "../acquiring/schema";
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
  check("ledger_journal_kind", sql`${t.kind} in ('CARD_FUNDING','CARD_PURCHASE','CARD_REFUND','MERCHANT_PAYMENT','MERCHANT_REFUND','MERCHANT_PAYOUT')`),
  check("ledger_journal_currency", sql`${t.currency}='USD'`),
  check("ledger_journal_digest", sql`${t.digest} ~ '^[0-9a-f]{64}$'`),
]);

export const ledgerEntries = pgTable("ledger_entries", {
  id: uuid().primaryKey().defaultRandom(),
  journalId: uuid().notNull().references(() => ledgerJournals.id),
  lineNumber: integer().notNull(),
  serviceId: uuid().notNull().references(() => services.id),
  bucket: text({ enum: LEDGER_BUCKETS }).notNull(),
  cardId: uuid(),
  merchantUnitId: uuid(),
  deltaMinor: bigint({ mode: "bigint" }).notNull(),
  currency: text().notNull().default("USD"),
}, t => [
  unique("ledger_entry_line").on(t.journalId, t.lineNumber),
  foreignKey({ name: "ledger_entry_card_scope", columns: [t.cardId, t.serviceId], foreignColumns: [cards.id, cards.serviceId] }),
  foreignKey({ name: "ledger_entry_merchant_scope", columns: [t.merchantUnitId, t.serviceId], foreignColumns: [merchantUnits.id, merchantUnits.masterServiceId] }),
  check("ledger_entry_amount", sql`${t.deltaMinor}<>0 and ${t.currency}='USD'`),
  check("ledger_entry_line_number", sql`${t.lineNumber} between 1 and 64`),
  check("ledger_entry_resource_shape", sql`(${t.bucket}='PRACTICE_SOURCE' and ${t.cardId} is null and ${t.merchantUnitId} is null) or (${t.bucket} in ('CARD_AVAILABLE','CARD_SPENT') and ${t.cardId} is not null and ${t.merchantUnitId} is null) or (${t.bucket} in ('GATEWAY_CLEARING','MERCHANT_AVAILABLE','PAYOUT_CLEARING') and ${t.cardId} is null and ${t.merchantUnitId} is not null)`),
  index("ledger_entry_position").on(t.serviceId, t.bucket, t.cardId, t.merchantUnitId),
]);
