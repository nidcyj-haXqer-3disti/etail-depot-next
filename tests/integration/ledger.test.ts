import { randomUUID } from "node:crypto";
import pg from "pg";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { services, serviceMembers, cards, cardRequests, people, serviceActivity, workspaceCommands } from "../../src/platform/database/schema";
import { merchantTerminals } from "../../src/modules/acquiring/schema";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
import { getBalance, postJournal, type LedgerPosition, type PostJournalInput } from "../../src/modules/ledger/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { cardPrimary, fundCardGroup, issuePracticeCard } from "../helpers/cardholder";
import { purchaseCardInTransaction } from "../../src/modules/workspace/service";

const raw = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-ledger-integrity-tests" });
beforeAll(() => raw.connect());
afterAll(async () => { await raw.end(); await closeDatabase(); });
async function fixture() {
  return getDb().transaction(async tx => {
    const [person] = await tx.insert(people).values({ displayName: "Fictional ledger tester" }).returning();
    const [service] = await tx.insert(services).values({ kind: "CARDHOLDER", primaryPersonId: person!.id, displayName: "Fictional ledger practice" }).returning();
    await tx.insert(serviceMembers).values({ serviceId: service!.id, personId: person!.id, state: "ACCEPTED" });
    // Structural legacy-ledger fixture: explicit request/card provenance with zero limits and no funds.
    // CARD_FUNDING below is a legacy primitive fixture only; product issuance never calls it.
    const [request] = await tx.insert(cardRequests).values({ serviceId: service!.id, creatorId: person!.id, holderId: person!.id, nickname: "Ledger fixture request", format: "VIRTUAL", requestedLimitMinor: 0n, status: "ISSUED" }).returning();
    const [card] = await tx.insert(cards).values({ serviceId: service!.id, requestId: request!.id, holderId: person!.id, assignmentState:"ACCEPTED",assignedAt:new Date(), nickname: "Fictional ledger card", lastFour: "0000", format: "VIRTUAL", limitMinor: 0n }).returning();
    const [merchant] = await tx.insert(services).values({ kind: "MERCHANT", primaryPersonId: person!.id, displayName: "Fictional ledger merchant" }).returning();
    const [unit] = await tx.insert(merchantTerminals).values({ merchantServiceId: merchant!.id, displayName: "Fictional ledger master", status: "ACTIVE" }).returning();
    return { serviceId: service!.id, cardId: card!.id, merchantServiceId: merchant!.id, merchantUnitId: unit!.id };
  });
}
type Fixture = Awaited<ReturnType<typeof fixture>>;
function funding(f: Fixture, amount = 10000n): PostJournalInput {
  const referenceId = randomUUID();
  return { businessKey: `ledger-test-funding:${referenceId}`, kind: "CARD_FUNDING", referenceId, lines: [{ serviceId: f.serviceId, bucket: "PRACTICE_SOURCE", deltaMinor: -amount }, { serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId, deltaMinor: amount }] };
}
function purchase(f: Fixture, amount: bigint): PostJournalInput {
  const referenceId = randomUUID();
  return { businessKey: `ledger-test-purchase:${referenceId}`, kind: "CARD_PURCHASE", referenceId, lines: [{ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId, deltaMinor: -amount }, { serviceId: f.serviceId, bucket: "CARD_SPENT", cardId: f.cardId, deltaMinor: amount }] };
}
const post = (input: PostJournalInput) => getDb().transaction(tx => postJournal(tx, input));
const balance = (position: LedgerPosition) => getDb().transaction(tx => getBalance(tx, position));
async function rawTransaction(work: () => Promise<unknown>) {
  await raw.query("BEGIN");
  try { await work(); await raw.query("COMMIT"); } catch (error) { await raw.query("ROLLBACK"); throw error; }
}
async function rawJournal() {
  const id = randomUUID();
  await raw.query('INSERT INTO ledger_journals (id,"businessKey",kind,"referenceId",digest) VALUES ($1,$2,\'CARD_FUNDING\',$3,$4)', [id, `ledger-sql:${id}`, randomUUID(), "a".repeat(64)]);
  return id;
}
async function rawLine(id: string, line: number, serviceId: string, bucket: string, amount: string, cardId: string | null = null, merchantUnitId: string | null = null) {
  await raw.query('INSERT INTO ledger_entries ("journalId","lineNumber","serviceId",bucket,"deltaMinor","cardId","merchantUnitId") VALUES ($1,$2,$3,$4,$5,$6,$7)', [id, line, serviceId, bucket, amount, cardId, merchantUnitId]);
}

describe("single immutable practice USD ledger", () => {
  it("preserves amounts beyond JavaScript safe integers and derives balances only from journals", async () => {
    const f = await fixture(), amount = 9_007_199_254_740_993n;
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(0n);
    await post(funding(f, amount));
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(amount);
    expect(await balance({ serviceId: f.serviceId, bucket: "PRACTICE_SOURCE" })).toBe(-amount);
    // Check primitive inverse arithmetic inside a transaction that is explicitly
    // rolled back. An orphan purchase/refund must never be committed as a fixture.
    const spent = purchase(f, 101n), referenceId = randomUUID();
    await expect(getDb().transaction(async tx => {
      await postJournal(tx, spent);
      expect(await getBalance(tx, { serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(amount - 101n);
      await postJournal(tx, { ...spent, businessKey: `ledger-refund:${referenceId}`, kind: "CARD_REFUND", referenceId, lines: spent.lines.map(line => ({ ...line, deltaMinor: -line.deltaMinor })) });
      expect(await getBalance(tx, { serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(amount);
      expect(await getBalance(tx, { serviceId: f.serviceId, bucket: "CARD_SPENT", cardId: f.cardId })).toBe(0n);
      throw new Error("Rollback primitive inverse probe");
    })).rejects.toThrow("Rollback primitive inverse probe");
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, spent.businessKey))).toEqual([]);
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(amount);
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_SPENT", cardId: f.cardId })).toBe(0n);
  });

  it("replays the same canonical effect once and rejects changed payloads or renamed retry keys", async () => {
    const f = await fixture(), input = funding(f), id = await post(input);
    expect(await post({ ...input, lines: [...input.lines].reverse() })).toBe(id);
    expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, id))).toHaveLength(2);
    await expect(post({ ...input, lines: input.lines.map(line => ({ ...line, deltaMinor: line.deltaMinor * 2n })) })).rejects.toMatchObject({ code: "LEDGER_IDEMPOTENCY_CONFLICT" });
    await expect(post({ ...input, businessKey: `renamed:${randomUUID()}` })).rejects.toMatchObject({ code: "LEDGER_IDEMPOTENCY_CONFLICT" });
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(10000n);
  });

  it("rejects unbalanced, zero, duplicate-position, overflowing and malformed resource lines before posting", async () => {
    const f = await fixture(), input = funding(f);
    const invalid: PostJournalInput[] = [
      { ...input, lines: [{ ...input.lines[0]!, deltaMinor: -9999n }, input.lines[1]!] },
      { ...input, lines: input.lines.map(line => ({ ...line, deltaMinor: 0n })) },
      { ...input, lines: [{ ...input.lines[0]!, deltaMinor: -5000n }, { ...input.lines[0]!, deltaMinor: -5000n }, input.lines[1]!] },
      { ...input, lines: input.lines.map(line => ({ ...line, deltaMinor: line.deltaMinor > 0n ? 9_223_372_036_854_775_808n : -9_223_372_036_854_775_808n })) },
      { ...input, lines: [input.lines[0]!, { ...input.lines[1]!, cardId: null }] },
      { ...input, lines: [{ ...input.lines[0]!, merchantUnitId: f.merchantUnitId }, input.lines[1]!] },
    ];
    for (const value of invalid) await expect(post(value)).rejects.toMatchObject({ code: "INVALID_LEDGER_JOURNAL" });
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, input.businessKey))).toHaveLength(0);
  });

  it("rejects insufficient card funds and merchant funds while allowing explicit practice clearing liabilities", async () => {
    const f = await fixture();
    await expect(post(purchase(f, 1n))).rejects.toMatchObject({ code: "INSUFFICIENT_LEDGER_FUNDS" });
    const referenceId = randomUUID(), position = { serviceId: f.merchantServiceId, merchantUnitId: f.merchantUnitId };
    const payment: PostJournalInput = { businessKey: `ledger-payment:${referenceId}`, kind: "MERCHANT_PAYMENT", referenceId, lines: [{ ...position, bucket: "GATEWAY_CLEARING", deltaMinor: -500n }, { ...position, bucket: "MERCHANT_AVAILABLE", deltaMinor: 500n }] };
    await expect(getDb().transaction(async tx => {
      await postJournal(tx, payment);
      expect(await getBalance(tx, { ...position, bucket: "GATEWAY_CLEARING" })).toBe(-500n);
      const payoutId = randomUUID();
      await expect(postJournal(tx, { businessKey: `ledger-payout:${payoutId}`, kind: "MERCHANT_PAYOUT", referenceId: payoutId, lines: [{ ...position, bucket: "MERCHANT_AVAILABLE", deltaMinor: -501n }, { ...position, bucket: "PAYOUT_CLEARING", deltaMinor: 501n }] })).rejects.toMatchObject({ code: "INSUFFICIENT_LEDGER_FUNDS" });
      expect(await getBalance(tx, { ...position, bucket: "MERCHANT_AVAILABLE" })).toBe(500n);
      throw new Error("Rollback primitive clearing probe");
    })).rejects.toThrow("Rollback primitive clearing probe");
    expect(await balance({ ...position, bucket: "MERCHANT_AVAILABLE" })).toBe(0n);
    expect(await balance({ ...position, bucket: "GATEWAY_CLEARING" })).toBe(0n);
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, payment.businessKey))).toEqual([]);
  });

  it("rejects cross-service card and master merchant substitution in service and composite foreign keys", async () => {
    const f = await fixture(), other = await fixture();
    const input = funding(f);
    await expect(post({ ...input, lines: [input.lines[0]!, { ...input.lines[1]!, cardId: other.cardId }] })).rejects.toMatchObject({ code: "LEDGER_RESOURCE_UNAVAILABLE" });
    const referenceId = randomUUID();
    await expect(post({ businessKey: `ledger-cross:${referenceId}`, kind: "MERCHANT_PAYMENT", referenceId, lines: [{ serviceId: f.merchantServiceId, merchantUnitId: other.merchantUnitId, bucket: "GATEWAY_CLEARING", deltaMinor: -100n }, { serviceId: f.merchantServiceId, merchantUnitId: other.merchantUnitId, bucket: "MERCHANT_AVAILABLE", deltaMinor: 100n }] })).rejects.toMatchObject({ code: "LEDGER_RESOURCE_UNAVAILABLE" });
    await expect(rawTransaction(async () => { await rawLine(await rawJournal(), 1, f.serviceId, "CARD_AVAILABLE", "100", other.cardId); })).rejects.toMatchObject({ code: "23503", constraint: "ledger_entry_card_scope" });
    await expect(rawTransaction(async () => { await rawLine(await rawJournal(), 1, f.merchantServiceId, "MERCHANT_AVAILABLE", "100", null, other.merchantUnitId); })).rejects.toMatchObject({ code: "23503", constraint: "ledger_entry_merchant_scope" });
  });

  it("rolls financial effects back with the caller's business transaction", async () => {
    const f = await fixture(), input = funding(f);
    await expect(getDb().transaction(async tx => { await postJournal(tx, input); throw new Error("Owning command failed"); })).rejects.toThrow("Owning command failed");
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, input.businessKey))).toHaveLength(0);
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(0n);
  });

  it("rolls a canonical prepaid purchase and its activity, receipt and card version back with its caller", async () => {
    const owner = await cardPrimary("Canonical ledger rollback primary");
    await fundCardGroup(owner.personId, owner.serviceId, "10000");

    const { card } = await issuePracticeCard(owner.personId, owner.serviceId, owner.personId, "Rollback purchase card", undefined, "20000");
    const input = { commandId: randomUUID(), expectedVersion: card.version, amountMinor: "101", description: "Purchase rolled back by owner" };
    await expect(getDb().transaction(async tx => {
      await purchaseCardInTransaction(tx, owner.personId, owner.serviceId, card.id, input);
      expect(await readServiceMoneyAvailable(tx,owner.serviceId)).toBe(9899n);
      throw new Error("Canonical owning command failed");
    })).rejects.toThrow("Canonical owning command failed");
    expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,owner.serviceId))).toBe(10000n);
    expect(await balance({ serviceId: owner.serviceId, cardId: card.id, bucket: "CARD_SPENT" })).toBe(0n);
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId, card.id))).toEqual([]);
    expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId, input.commandId))).toEqual([]);
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, `card-purchase:${input.commandId}`))).toEqual([]);
    expect((await getDb().select().from(cards).where(eq(cards.id, card.id)))[0]!.version).toBe(card.version);
  });

  it("rejects empty and unbalanced raw journals at commit", async () => {
    const f = await fixture();
    await expect(rawTransaction(rawJournal)).rejects.toMatchObject({ code: "23514", message: "Ledger journal must have 2 to 64 balanced USD entries" });
    await expect(rawTransaction(async () => { const id = await rawJournal(); await rawLine(id, 1, f.serviceId, "PRACTICE_SOURCE", "-100"); await rawLine(id, 2, f.serviceId, "CARD_AVAILABLE", "99", f.cardId); })).rejects.toMatchObject({ code: "23514", message: "Ledger journal must have 2 to 64 balanced USD entries" });
    expect(await balance({ serviceId: f.serviceId, bucket: "CARD_AVAILABLE", cardId: f.cardId })).toBe(0n);
  });

  it("rejects balanced direct-SQL overspending at commit", async () => {
    const f = await fixture();
    await expect(rawTransaction(async () => { const id = await rawJournal(); await rawLine(id, 1, f.serviceId, "CARD_AVAILABLE", "-100", f.cardId); await rawLine(id, 2, f.serviceId, "CARD_SPENT", "100", f.cardId); })).rejects.toMatchObject({ code: "23514", message: "Available money cannot be negative" });
  });

  it("makes journals and entries immutable and prevents later balanced append", async () => {
    const f = await fixture(), id = await post(funding(f));
    const [entry] = await getDb().select().from(ledgerEntries).where(and(eq(ledgerEntries.journalId, id), eq(ledgerEntries.bucket, "CARD_AVAILABLE")));
    await expect(raw.query('UPDATE ledger_journals SET kind=\'CARD_REFUND\' WHERE id=$1', [id])).rejects.toMatchObject({ code: "23514", message: "Posted ledger journals are immutable" });
    await expect(raw.query('DELETE FROM ledger_journals WHERE id=$1', [id])).rejects.toMatchObject({ code: "23514", message: "Posted ledger journals are immutable" });
    await expect(raw.query('UPDATE ledger_entries SET "deltaMinor"="deltaMinor"+1 WHERE id=$1', [entry!.id])).rejects.toMatchObject({ code: "23514", message: "Posted ledger entries are immutable" });
    await expect(raw.query('DELETE FROM ledger_entries WHERE id=$1', [entry!.id])).rejects.toMatchObject({ code: "23514", message: "Posted ledger entries are immutable" });
    await expect(rawTransaction(async () => { await rawLine(id, 3, f.serviceId, "PRACTICE_SOURCE", "-100"); await rawLine(id, 4, f.serviceId, "CARD_AVAILABLE", "100", f.cardId); })).rejects.toMatchObject({ code: "23514", message: "Entries must be inserted with their new journal" });
    expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, id))).toHaveLength(2);
  });
});
