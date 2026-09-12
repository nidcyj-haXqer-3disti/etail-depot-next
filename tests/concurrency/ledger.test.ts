import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { eq } from "drizzle-orm";
import { afterAll, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { services, serviceMembers, cards, cardRequests, people } from "../../src/platform/database/schema";
import { cardPrimary, fundCardGroup, issuePracticeCard } from "../helpers/cardholder";
import { merchantAccessFixture } from "../helpers/merchant-access";
import { paymentInput } from "../helpers/acquiring";
import { purchaseCard } from "../../src/modules/workspace/service";
import { createChannel } from "../../src/modules/acquiring/service";
import { publishGuestChannel } from "../../src/modules/acquiring/guest-service";
import { prepareCardCheckout, confirmCardCheckout } from "../../src/modules/acquiring/card-checkout-service";
import { configureTestGateway, enrollTestMerchant, setChannelActivation, getMerchantOperations, createMerchantSettlement, refundMerchantPayment } from "../../src/modules/acquiring/operations-service";
import { merchantSettlements, merchantSettlementItems } from "../../src/modules/acquiring/settlement-schema";
import { merchantTestRefunds } from "../../src/modules/acquiring/operations-schema";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
import { getBalance, postJournal, type PostJournalInput } from "../../src/modules/ledger/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";

afterAll(closeDatabase);
async function cardFixture() {
  return getDb().transaction(async tx => {
    const [person] = await tx.insert(people).values({ displayName: "Fictional ledger concurrency tester" }).returning();
    const [service] = await tx.insert(services).values({ kind: "CARDHOLDER", primaryPersonId: person!.id, displayName: "Fictional concurrent practice" }).returning();
    await tx.insert(serviceMembers).values({ serviceId: service!.id, personId: person!.id, state: "ACCEPTED" });
    // Structural legacy-ledger fixture with zero limits and no funding at issuance.
    // Only the legacy CARD_FUNDING primitive is used here; product races below use canonical commands.
    const [request] = await tx.insert(cardRequests).values({ serviceId: service!.id, creatorId: person!.id, holderId: person!.id, nickname: "Ledger fixture request", format: "VIRTUAL", requestedLimitMinor: 0n, status: "ISSUED" }).returning();
    const [card] = await tx.insert(cards).values({ serviceId: service!.id, requestId: request!.id, holderId: person!.id, nickname: "Fictional concurrent card", lastFour: "0000", format: "VIRTUAL", limitMinor: 0n }).returning();
    return { serviceId: service!.id, cardId: card!.id };
  });
}
function funding(f: Awaited<ReturnType<typeof cardFixture>>, amount = 10000n): PostJournalInput {
  const referenceId = randomUUID();
  return { businessKey: `ledger-concurrent-funding:${referenceId}`, kind: "CARD_FUNDING", referenceId, lines: [{ serviceId: f.serviceId, bucket: "PRACTICE_SOURCE", deltaMinor: -amount }, { ...f, bucket: "CARD_AVAILABLE", deltaMinor: amount }] };
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

it("serializes reversed-order primitive credits through the same sorted ledger-position barrier", async () => {
  const f = await cardFixture();
  const first = funding(f, 8000n), second = funding(f, 3000n);
  const results = await simultaneous(`${f.serviceId}:CARD_AVAILABLE:${f.cardId}:`, [first, { ...second, lines: [...second.lines].reverse() }]);
  expect(results.every(result => result.status === "fulfilled")).toBe(true);
  expect(await getDb().transaction(tx => getBalance(tx, { ...f, bucket: "CARD_AVAILABLE" }))).toBe(11000n);
  expect(await getDb().transaction(tx => getBalance(tx, { serviceId: f.serviceId, bucket: "PRACTICE_SOURCE" }))).toBe(-11000n);
  for (const input of [first, second]) {
    const [journal] = await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, input.businessKey));
    const entries = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, journal!.id));
    expect(entries).toHaveLength(2);
    expect(entries.reduce((sum, row) => sum + row.deltaMinor, 0n)).toBe(0n);
  }
});

it("collapses simultaneous retries into one journal and one pair of entries", async () => {
  const f = await cardFixture(), input = funding(f);
  const ids = await Promise.all(Array.from({ length: 6 }, (_, index) => post({ ...input, lines: index % 2 ? [...input.lines].reverse() : input.lines })));
  expect(new Set(ids).size).toBe(1);
  expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, input.businessKey))).toHaveLength(1);
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, ids[0]!))).toHaveLength(2);
  expect(await getDb().transaction(tx => getBalance(tx, { ...f, bucket: "CARD_AVAILABLE" }))).toBe(10000n);
});

async function blockedBy(observer: pg.Client, pid: number) {
  const until = Date.now() + 5000;
  while (Date.now() < until) {
    const result = await observer.query<{ pid: number }>("select pid from pg_stat_activity where datname=current_database() and $1::integer=any(pg_blocking_pids(pid)) order by pid limit 1", [pid]);
    if (result.rows[0]) return result.rows[0].pid;
    await delay(10);
  }
  throw new Error("Canonical commands did not reach the real PostgreSQL lock barrier");
}

async function overlapping(
  lockQuery: string,
  resourceId: string,
  first: () => Promise<unknown>,
  second: () => Promise<unknown>,
) {
  const locker = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-canonical-ledger-barrier" });
  const observer = new pg.Client({ connectionString: process.env.DATABASE_URL, application_name: "etail-canonical-ledger-observer" });
  const pending: Promise<unknown>[] = [];
  let open = false;
  try {
    await locker.connect(); await observer.connect(); await locker.query("BEGIN"); open = true;
    const { rows: [row] } = await locker.query<{ pid: number }>("select pg_backend_pid() as pid");
    await locker.query(lockQuery, [resourceId]);
    const one = first(); pending.push(one); void one.catch(() => undefined);
    const firstPid = await blockedBy(observer, row!.pid);
    const two = second(); pending.push(two); void two.catch(() => undefined);
    const secondPid = await blockedBy(observer, firstPid);
    expect(secondPid).not.toBe(firstPid);
    await locker.query("COMMIT"); open = false;
    return await Promise.allSettled(pending);
  } finally {
    if (open) await locker.query("ROLLBACK");
    await Promise.allSettled(pending);
    await Promise.all([locker.end(), observer.end()]);
  }
}

it("canonical overlapping purchases on separate cards cannot overspend the same prepaid group", async () => {
  const owner = await cardPrimary("Canonical ledger concurrency primary");
  await fundCardGroup(owner.personId, owner.serviceId, "10000");

  const first = (await issuePracticeCard(owner.personId, owner.serviceId, owner.personId, "First concurrent card", undefined, "20000")).card;
  const second = (await issuePracticeCard(owner.personId, owner.serviceId, owner.personId, "Second concurrent card", undefined, "20000")).card;
  const firstInput = { commandId: randomUUID(), expectedVersion: first.version, amountMinor: "8000", description: "First concurrent purchase" };
  const secondInput = { commandId: randomUUID(), expectedVersion: second.version, amountMinor: "3000", description: "Second concurrent purchase" };
  const results = await overlapping('SELECT id FROM cards WHERE id=$1 FOR UPDATE', first.id,
    () => purchaseCard(owner.personId, owner.serviceId, first.id, firstInput),
    () => purchaseCard(owner.personId, owner.serviceId, second.id, secondInput));
  expect(results[0]?.status).toBe("fulfilled");
  expect(results[1]).toMatchObject({ status: "rejected", reason: { code: "INSUFFICIENT_PRACTICE_FUNDS" } });
  const available = await getDb().transaction(tx => readServiceMoneyAvailable(tx,owner.serviceId));
  const spent = await getDb().transaction(tx => getBalance(tx, { serviceId: owner.serviceId, cardId: first.id, bucket: "CARD_SPENT" }));
  expect(available).toBe(2000n); expect(spent).toBe(8000n); expect(available + spent).toBe(10000n);
  expect(await getDb().transaction(tx => getBalance(tx, { serviceId: owner.serviceId, cardId: second.id, bucket: "CARD_SPENT" }))).toBe(0n);
  expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, `card-purchase:${secondInput.commandId}`))).toEqual([]);
}, 30_000);

async function paidMerchant() {
  const m = await merchantAccessFixture();
  await configureTestGateway(m.merchant.personId, m.master.id, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(m.merchant.personId, m.unit.id, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  const channel = await createChannel(m.operator.personId, m.unit.id, { ...paymentInput(), usage: "ONE_TIME", presentations: ["WEB"], visibility: "CREATOR_PRIVATE" });
  await setChannelActivation(m.operator.personId, m.unit.id, channel.id, { commandId: randomUUID(), expectedVersion: 0, expectedChannelVersion: channel.version, active: true });
  const publication = (await publishGuestChannel(m.operator.personId, m.unit.id, channel.id, { commandId: randomUUID(), expectedChannelVersion: channel.version })).publication!;
  const payer = await cardPrimary("Merchant race payer");
  await fundCardGroup(payer.personId, payer.serviceId, "10000");

  const { card } = await issuePracticeCard(payer.personId, payer.serviceId, payer.personId, "Merchant race card", undefined, "10000");
  const review = await prepareCardCheckout(payer.personId, publication.id, { commandId: randomUUID(), cardServiceId: payer.serviceId, cardId: card.id, expectedCardVersion: card.version });
  const paid = await confirmCardCheckout(payer.personId, publication.id, review.id);
  if (!paid.receipt) throw new Error("Canonical checkout did not produce a payment receipt");
  const operations = await getMerchantOperations(m.merchant.personId, m.unit.id);
  if (!operations.depositReview) throw new Error("Canonical payment did not produce a deposit review");
  return { ...m, payer, paymentId: paid.receipt.paymentId, reviewToken: operations.depositReview.token };
}

it.each(["settlement", "refund"] as const)("serializes settlement and original-card refund when %s reaches the terminal lock first", async first => {
  const f = await paidMerchant();
  const settlement = () => createMerchantSettlement(f.merchant.personId, f.unit.id, { commandId: randomUUID(), reviewToken: f.reviewToken });
  const refund = () => refundMerchantPayment(f.merchant.personId, f.unit.id, f.paymentId, { commandId: randomUUID(), expectedVersion: 1, reason: "Concurrent original purchase refund" });
  const results = await overlapping('SELECT id FROM merchant_terminals WHERE id=$1 FOR UPDATE', f.unit.id,
    first === "settlement" ? settlement : refund,
    first === "settlement" ? refund : settlement);
  expect(results[0]?.status).toBe("fulfilled");
  if(first==="settlement")expect(results[1]?.status).toBe("fulfilled");
  else expect(results[1]).toMatchObject({status:"rejected",reason:{code:"NO_PAYMENTS_TO_SETTLE"}});
  const available=await getDb().transaction(tx=>getBalance(tx,{serviceId:f.merchant.serviceId,merchantUnitId:f.unit.id,bucket:"MERCHANT_AVAILABLE"}));
  const merchantMoney=await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.merchant.serviceId));
  const cardMoney=await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.serviceId));
  expect(available).toBe(0n);expect(merchantMoney).toBe(0n);expect(cardMoney).toBe(10000n);
  expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,f.unit.id))).toHaveLength(first==="settlement"?1:0);
  expect(await getDb().select().from(merchantSettlementItems).where(eq(merchantSettlementItems.paymentId,f.paymentId))).toHaveLength(first==="settlement"?1:0);
  expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,f.paymentId))).toHaveLength(1);
},30_000);
