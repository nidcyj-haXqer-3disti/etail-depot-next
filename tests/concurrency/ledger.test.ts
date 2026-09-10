import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { eq } from "drizzle-orm";
import { afterAll, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { services, serviceMembers, cards, cardRequests, people } from "../../src/platform/database/schema";
import { merchantUnits } from "../../src/modules/acquiring/schema";
import { getBalance, postJournal, type PostJournalInput } from "../../src/modules/ledger/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";

afterAll(closeDatabase);
async function cardFixture() {
  return getDb().transaction(async tx => {
    const [person] = await tx.insert(people).values({ displayName: "Fictional ledger concurrency tester" }).returning();
    const [service] = await tx.insert(services).values({ kind: "CARDHOLDER", primaryPersonId: person!.id, displayName: "Fictional concurrent practice" }).returning();
    await tx.insert(serviceMembers).values({ serviceId: service!.id, personId: person!.id, state: "ACCEPTED" });
    // Structural ledger fixture: explicit request/card provenance without a pre-funded position.
    // These rows isolate ledger invariants; the product issuance command is covered separately.
    const [request] = await tx.insert(cardRequests).values({ serviceId: service!.id, creatorId: person!.id, holderId: person!.id, nickname: "Ledger fixture request", format: "VIRTUAL", requestedLimitMinor: 10000n, status: "ISSUED" }).returning();
    const [card] = await tx.insert(cards).values({ serviceId: service!.id, requestId: request!.id, holderId: person!.id, nickname: "Fictional concurrent card", lastFour: "0000", format: "VIRTUAL", limitMinor: 10000n }).returning();
    return { serviceId: service!.id, cardId: card!.id };
  });
}
function funding(f: Awaited<ReturnType<typeof cardFixture>>): PostJournalInput {
  const referenceId = randomUUID();
  return { businessKey: `ledger-concurrent-funding:${referenceId}`, kind: "CARD_FUNDING", referenceId, lines: [{ serviceId: f.serviceId, bucket: "PRACTICE_SOURCE", deltaMinor: -10000n }, { ...f, bucket: "CARD_AVAILABLE", deltaMinor: 10000n }] };
}
const post = (input: PostJournalInput) => getDb().transaction(tx => postJournal(tx, input));
async function reachBarrier(observer: pg.Client, pid: number, count: number) {
  const until = Date.now() + 5000;
  while (Date.now() < until) {
    const result = await observer.query("select count(*)::integer as n from pg_stat_activity where datname=current_database() and $1::integer=any(pg_blocking_pids(pid))", [pid]);
    if (result.rows[0].n >= count) return;
    await delay(10);
  }
  throw new Error("Ledger commands did not both reach the deterministic position lock barrier");
}
async function simultaneous(positionKey: string, inputs: PostJournalInput[]) {
  const locker = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-ledger-barrier" });
  const observer = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-ledger-observer" });
  const pending: Promise<string>[] = [];
  let open = false;
  try {
    await locker.connect(); await observer.connect();
    await locker.query("BEGIN"); open = true;
    await locker.query("select pg_advisory_xact_lock(hashtextextended($1,0))", [`ledger-position:${positionKey}`]);
    const { rows: [row] } = await locker.query("select pg_backend_pid() as pid");
    for (const input of inputs) { const promise = post(input); pending.push(promise); void promise.catch(() => undefined); }
    await reachBarrier(observer, row.pid, inputs.length);
    await locker.query("COMMIT"); open = false;
    return await Promise.allSettled(pending);
  } finally {
    if (open) await locker.query("ROLLBACK");
    await Promise.allSettled(pending);
    await Promise.all([locker.end(), observer.end()]);
  }
}

it("serializes independent 80 and 30 purchases against 100 without overspending", async () => {
  const f = await cardFixture(); await post(funding(f));
  const inputs = [8000n, 3000n].map((amount, index): PostJournalInput => {
    const referenceId = randomUUID();
    const lines: PostJournalInput["lines"] = [{ ...f, bucket: "CARD_AVAILABLE", deltaMinor: -amount }, { ...f, bucket: "CARD_SPENT", deltaMinor: amount }];
    return { businessKey: `ledger-concurrent-purchase:${referenceId}`, kind: "CARD_PURCHASE", referenceId, lines: index ? [...lines].reverse() : lines };
  });
  const results = await simultaneous(`${f.serviceId}:CARD_AVAILABLE:${f.cardId}:`, inputs);
  expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
  expect(results.find(result => result.status === "rejected")).toMatchObject({ reason: { code: "INSUFFICIENT_LEDGER_FUNDS" } });
  const available = await getDb().transaction(tx => getBalance(tx, { ...f, bucket: "CARD_AVAILABLE" }));
  const spent = await getDb().transaction(tx => getBalance(tx, { ...f, bucket: "CARD_SPENT" }));
  expect([2000n, 7000n]).toContain(available);
  expect(available + spent).toBe(10000n);
});

it("collapses simultaneous retries into one journal and one pair of entries", async () => {
  const f = await cardFixture(), input = funding(f);
  const ids = await Promise.all(Array.from({ length: 6 }, (_, index) => post({ ...input, lines: index % 2 ? [...input.lines].reverse() : input.lines })));
  expect(new Set(ids).size).toBe(1);
  expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, input.businessKey))).toHaveLength(1);
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, ids[0]!))).toHaveLength(2);
  expect(await getDb().transaction(tx => getBalance(tx, { ...f, bucket: "CARD_AVAILABLE" }))).toBe(10000n);
});

it("serializes a Merchant payout and refund against the same available principal", async () => {
  const { serviceId, merchantUnitId } = await getDb().transaction(async tx => {
    const [person] = await tx.insert(people).values({displayName:"Merchant ledger tester"}).returning();
    const [service] = await tx.insert(services).values({ kind: "MERCHANT", primaryPersonId: person!.id, displayName: "Fictional ledger payout race" }).returning();
    const [unit] = await tx.insert(merchantUnits).values({ kind: "MASTER", masterServiceId: service!.id, displayName: "Fictional concurrent gateway", status: "ACTIVE" }).returning();
    return { serviceId: service!.id, merchantUnitId: unit!.id };
  });
  const position = { serviceId, merchantUnitId }, referenceId = randomUUID();
  await post({ businessKey: `ledger-concurrent-payment:${referenceId}`, kind: "MERCHANT_PAYMENT", referenceId, lines: [{ ...position, bucket: "GATEWAY_CLEARING", deltaMinor: -10000n }, { ...position, bucket: "MERCHANT_AVAILABLE", deltaMinor: 10000n }] });
  const payoutId = randomUUID(), refundId = randomUUID();
  const inputs: PostJournalInput[] = [
    { businessKey: `ledger-concurrent-payout:${payoutId}`, kind: "MERCHANT_PAYOUT", referenceId: payoutId, lines: [{ ...position, bucket: "MERCHANT_AVAILABLE", deltaMinor: -8000n }, { ...position, bucket: "PAYOUT_CLEARING", deltaMinor: 8000n }] },
    { businessKey: `ledger-concurrent-refund:${refundId}`, kind: "MERCHANT_REFUND", referenceId: refundId, lines: [{ ...position, bucket: "GATEWAY_CLEARING", deltaMinor: 3000n }, { ...position, bucket: "MERCHANT_AVAILABLE", deltaMinor: -3000n }] },
  ];
  const results = await simultaneous(`${serviceId}:MERCHANT_AVAILABLE::${merchantUnitId}`, inputs);
  expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
  expect(results.find(result => result.status === "rejected")).toMatchObject({ reason: { code: "INSUFFICIENT_LEDGER_FUNDS" } });
  expect([2000n, 7000n]).toContain(await getDb().transaction(tx => getBalance(tx, { ...position, bucket: "MERCHANT_AVAILABLE" })));
});
