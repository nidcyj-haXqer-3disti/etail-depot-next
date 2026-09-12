import { createHash } from "node:crypto";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../platform/database/client";
import { services, cards } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { merchantTerminals } from "../acquiring/schema";
import {moneyAccounts,moneyAccountServices} from "../money/schema";
import { JOURNAL_KINDS, LEDGER_BUCKETS, MONEY_BUCKETS, type JournalLine, type LedgerPosition, type PostJournalInput } from "./contracts";
import { ledgerEntries, ledgerJournals } from "./schema";

export type LedgerTransaction = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
export type { JournalKind, JournalLine, LedgerBucket, LedgerPosition, PostJournalInput } from "./contracts";
const uuid = z.uuid();
const MAX_LINE = 9_223_372_036_854_775_807n;
type Position = { serviceId: string|null; moneyAccountId:string|null; bucket: LedgerPosition["bucket"]; cardId: string | null; merchantUnitId: string | null };
function invalid(): never { throw new SecurityError("INVALID_LEDGER_JOURNAL", 422); }
function normalizePosition(input: LedgerPosition): Position {
  if (!input || !(LEDGER_BUCKETS as readonly string[]).includes(input.bucket)) invalid();
  const money=(MONEY_BUCKETS as readonly string[]).includes(input.bucket);
  if(money?input.serviceId!==null||!uuid.safeParse(input.moneyAccountId).success:!uuid.safeParse(input.serviceId).success||input.moneyAccountId!=null)invalid();
  if (input.cardId != null && !uuid.safeParse(input.cardId).success) invalid();
  if (input.merchantUnitId != null && !uuid.safeParse(input.merchantUnitId).success) invalid();
  const p = { serviceId: input.serviceId?.toLowerCase()??null,moneyAccountId:input.moneyAccountId?.toLowerCase()??null, bucket: input.bucket, cardId: input.cardId?.toLowerCase() ?? null, merchantUnitId: input.merchantUnitId?.toLowerCase() ?? null };
  if (money||["PRACTICE_SOURCE","GROUP_AVAILABLE"].includes(p.bucket) ? p.cardId !== null || p.merchantUnitId !== null : p.bucket.startsWith("CARD_") ? p.cardId === null || p.merchantUnitId !== null : p.cardId !== null || p.merchantUnitId === null) invalid();
  return p;
}
function positionKey(p: Position) { return p.moneyAccountId?`money:${p.moneyAccountId}:${p.bucket}`:[p.serviceId, p.bucket, p.cardId ?? "", p.merchantUnitId ?? ""].join(":"); }
function positionWhere(p: Position) {
  return and(p.serviceId?eq(ledgerEntries.serviceId,p.serviceId):isNull(ledgerEntries.serviceId),p.moneyAccountId?eq(ledgerEntries.moneyAccountId,p.moneyAccountId):isNull(ledgerEntries.moneyAccountId),eq(ledgerEntries.bucket, p.bucket), p.cardId ? eq(ledgerEntries.cardId, p.cardId) : isNull(ledgerEntries.cardId), p.merchantUnitId ? eq(ledgerEntries.merchantUnitId, p.merchantUnitId) : isNull(ledgerEntries.merchantUnitId));
}
/** This projection confers no authority; the owning command must authorize its caller first. */
export async function getBalance(tx: LedgerTransaction, input: LedgerPosition): Promise<bigint> {
  const p = normalizePosition(input);
  const [row] = await tx.select({ total: sql<string>`coalesce(sum(${ledgerEntries.deltaMinor}),0)::text` }).from(ledgerEntries).where(positionWhere(p));
  return BigInt(row!.total);
}
async function requireResources(tx: LedgerTransaction, p: Position) {
  if(p.moneyAccountId){const [account]=await tx.select({id:moneyAccounts.id}).from(moneyAccounts).where(eq(moneyAccounts.id,p.moneyAccountId));if(!account)throw new SecurityError("LEDGER_RESOURCE_UNAVAILABLE",422);return;}
  if(!p.serviceId)throw new SecurityError("LEDGER_RESOURCE_UNAVAILABLE",422);
  const [service] = await tx.select({ id: services.id,kind:services.kind }).from(services).where(eq(services.id, p.serviceId));
  if (!service || (["PRACTICE_SOURCE","GROUP_AVAILABLE"].includes(p.bucket)&&service.kind!=="CARDHOLDER")) throw new SecurityError("LEDGER_RESOURCE_UNAVAILABLE", 422);
  if (p.cardId) {
    const [card] = await tx.select({ id: cards.id }).from(cards).where(and(eq(cards.id, p.cardId), eq(cards.serviceId, p.serviceId)));
    if (!card) throw new SecurityError("LEDGER_RESOURCE_UNAVAILABLE", 422);
  }
  if (p.merchantUnitId) {
    const [unit] = await tx.select({ id: merchantTerminals.id }).from(merchantTerminals).where(and(eq(merchantTerminals.id, p.merchantUnitId), eq(merchantTerminals.merchantServiceId, p.serviceId)));
    if (!unit) throw new SecurityError("LEDGER_RESOURCE_UNAVAILABLE", 422);
  }
}

/**
 * Sole journal writer. Call after domain authorization/service/resource locks and before
 * committing the owning business state. No provider call or snapshot funding occurs here.
 * Commands posting several journals must pre-order their complete domain lock set.
 */
export async function postJournal(tx: LedgerTransaction, input: PostJournalInput): Promise<string> {
  if (!input || typeof input.businessKey !== "string" || !/^[A-Za-z0-9][A-Za-z0-9:._/-]{0,199}$/.test(input.businessKey) || !(JOURNAL_KINDS as readonly string[]).includes(input.kind) || !uuid.safeParse(input.referenceId).success || !Array.isArray(input.lines) || input.lines.length < 2 || input.lines.length > 64) invalid();
  if(input.occurredAt!==undefined&&(!(input.occurredAt instanceof Date)||!Number.isFinite(input.occurredAt.getTime())))invalid();
  const lines = input.lines.map((line: JournalLine) => {
    if (typeof line?.deltaMinor !== "bigint" || line.deltaMinor === 0n || line.deltaMinor > MAX_LINE || line.deltaMinor < -MAX_LINE) invalid();
    return { ...normalizePosition(line), deltaMinor: line.deltaMinor };
  }).sort((a, b) => positionKey(a) < positionKey(b) ? -1 : positionKey(a) > positionKey(b) ? 1 : 0);
  if (new Set(lines.map(positionKey)).size !== lines.length || lines.reduce((sum, line) => sum + line.deltaMinor, 0n) !== 0n) invalid();
  const referenceId = input.referenceId.toLowerCase();
  // Keep historical service-position payload bytes stable; old retry identities survive D73.
  const digest = createHash("sha256").update(JSON.stringify({ kind: input.kind, referenceId, currency: "USD", ...(input.occurredAt?{occurredAt:input.occurredAt.toISOString()}:{}), lines: lines.map(line => ({serviceId:line.serviceId,bucket:line.bucket,cardId:line.cardId,merchantUnitId:line.merchantUnitId,...(line.moneyAccountId?{moneyAccountId:line.moneyAccountId}:{}),deltaMinor:line.deltaMinor.toString()})) })).digest("hex");
  const accountIds=new Set(lines.flatMap(line=>line.moneyAccountId?[line.moneyAccountId]:[]));
  for(const serviceId of new Set(lines.flatMap(line=>line.serviceId?[line.serviceId]:[]))){const [link]=await tx.select().from(moneyAccountServices).where(eq(moneyAccountServices.serviceId,serviceId));if(link)accountIds.add(link.moneyAccountId);}
  for(const accountId of [...accountIds].sort())await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"money-account:"+accountId},0))`);
  // Business identity locks precede sorted position locks. Both key and reference are unique.
  for (const key of [`ledger-effect:${input.kind}:${referenceId}`, `ledger-journal:${input.businessKey}`].sort()) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${key},0))`);
  const previous = await tx.select().from(ledgerJournals).where(or(eq(ledgerJournals.businessKey, input.businessKey), and(eq(ledgerJournals.kind, input.kind), eq(ledgerJournals.referenceId, referenceId))));
  if (previous.length) {
    const journal = previous[0]!;
    if (previous.length !== 1 || journal.businessKey !== input.businessKey || journal.digest !== digest) throw new SecurityError("LEDGER_IDEMPOTENCY_CONFLICT", 409);
    return journal.id;
  }
  for (const line of lines) await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"ledger-position:" + positionKey(line)},0))`);
  for (const line of lines) {
    await requireResources(tx, line);
    if ((["GROUP_AVAILABLE","CARD_AVAILABLE","MERCHANT_AVAILABLE","MERCHANT_SETTLED","MERCHANT_PAYOUT_PENDING","PAYOUT_CLEARING","MONEY_AVAILABLE","MONEY_WITHDRAWAL_PENDING","MONEY_WITHDRAWN"].includes(line.bucket)) && await getBalance(tx, line) + line.deltaMinor < 0n) throw new SecurityError("INSUFFICIENT_LEDGER_FUNDS", 409);
  }
  const [journal] = await tx.insert(ledgerJournals).values({ businessKey: input.businessKey, kind: input.kind, referenceId, digest, createdAt:input.occurredAt??sql`clock_timestamp()` }).returning();
  await tx.insert(ledgerEntries).values(lines.map((line, index) => ({ ...line, journalId: journal!.id, lineNumber: index + 1 })));
  return journal!.id;
}
