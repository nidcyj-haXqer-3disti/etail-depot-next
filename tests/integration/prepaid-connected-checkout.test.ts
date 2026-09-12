import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, expect, it, vi } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import {
  cards,
  serviceActivity,
  workspaceCommands,
} from "../../src/platform/database/schema";
import {readServiceMoneyAvailable,getServiceMoneyAccount} from "../../src/modules/money/service";
import * as ledgerService from "../../src/modules/ledger/service";
import { getBalance, type LedgerPosition } from "../../src/modules/ledger/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { cardCheckoutAttempts } from "../../src/modules/acquiring/card-checkout-schema";
import {
  confirmCardCheckout,
  getCardCheckoutReview,
  prepareCardCheckout,
} from "../../src/modules/acquiring/card-checkout-service";
import {
  merchantOperationCommands,
  merchantTestPayments,
  merchantTestRefunds,
} from "../../src/modules/acquiring/operations-schema";
import {
  merchantSettlementItems,
  merchantSettlements,
} from "../../src/modules/acquiring/settlement-schema";
import * as merchantOperations from "../../src/modules/acquiring/operations-service";
import { createChannel } from "../../src/modules/acquiring/service";
import { publishGuestChannel } from "../../src/modules/acquiring/guest-service";
import {
  addCardholderFunds,
  controlCard,
  getCardSpending,
  getWorkspace,
  setCardSpendingLimit,
  startCardRequest,
  submitCardRequest,
  updateCardRequest,
} from "../../src/modules/workspace/service";
import { assignPracticeCard, cardPerson, cardPrimary, enrollCardholder } from "../helpers/cardholder";
import { merchantAccessFixture } from "../helpers/merchant-access";
import { paymentInput } from "../helpers/acquiring";

afterAll(closeDatabase);
afterEach(() => vi.restoreAllMocks());

async function balance(position: LedgerPosition) {
  return getDb().transaction(tx => position.bucket === "GROUP_AVAILABLE" && position.serviceId ? readServiceMoneyAvailable(tx,position.serviceId) : getBalance(tx, position));
}

/** Deliberately avoids the retired allocation-based issuePracticeCard helper. */
async function bareCard(
  primaryId: string,
  serviceId: string,
  holderId: string,
  nickname: string,
) {
  const draft = await startCardRequest(primaryId, serviceId, {
    commandId: randomUUID(),
  });
  const saved = await updateCardRequest(primaryId, serviceId, draft.id, {allowanceMinor:"0",
    commandId: randomUUID(),
    expectedVersion: draft.version,
    holderId:holderId===primaryId?holderId:null,
    nickname,
    format: "VIRTUAL",
  });
  const issued = await submitCardRequest(primaryId, serviceId, saved.id, {
    commandId: randomUUID(),
    expectedVersion: saved.version,
  });
  if (issued.status !== "ISSUED" || !issued.issuedCardId) {
    throw new Error("Canonical card issuance did not complete");
  }
  if(holderId!==primaryId)await assignPracticeCard(primaryId,serviceId,issued.issuedCardId,holderId);
  const card = (await getWorkspace(holderId, serviceId)).cards.find(
    row => row.id === issued.issuedCardId,
  );
  if (!card) throw new Error("Issued card is unavailable to its holder");
  return card;
}

async function fundedGroup(funds = "10000", limit = "5000") {
  const primary = await cardPrimary("Card account owner");
  const holderId = await cardPerson("Invited cardholder");
  await enrollCardholder(primary.personId, primary.serviceId, holderId);
  const card = await bareCard(
    primary.personId,
    primary.serviceId,
    holderId,
    "Everyday card",
  );

  // Issuance must not create funds or an allowance.
  expect(
    await balance({ serviceId: primary.serviceId, bucket: "GROUP_AVAILABLE" }),
  ).toBe(0n);
  expect(card.available.minor).toBe("0");

  await addCardholderFunds(primary.personId, primary.serviceId, {
    commandId: randomUUID(),
    amountMinor: funds,
    currency: "USD",
    source: "SANDBOX_BANK",
  });
  await setCardSpendingLimit(primary.personId, primary.serviceId, card.id, {
    commandId: randomUUID(),
    expectedVersion: 1,
    allowanceMinor: limit,
  });
  return { primary, holderId, card };
}

async function readyMerchant(usage: "ONE_TIME" | "REUSABLE" = "REUSABLE") {
  const f = await merchantAccessFixture();
  await merchantOperations.configureTestGateway(f.merchant.personId, f.master.id, {
    commandId: randomUUID(),
    expectedVersion: 0,
    enabled: true,
  });
  await merchantOperations.enrollTestMerchant(f.merchant.personId, f.unit.id, {
    commandId: randomUUID(),
    expectedVersion: 0,
    enabled: true,
  });
  const channel = await createChannel(f.operator.personId, f.unit.id, {
    ...paymentInput(),
    usage,
    description: "D69 ceramic order",
    presentations: ["WEB", "QR"],
    visibility: "CREATOR_PRIVATE",
  });
  await merchantOperations.setChannelActivation(
    f.operator.personId,
    f.unit.id,
    channel.id,
    {
      commandId: randomUUID(),
      expectedVersion: 0,
      expectedChannelVersion: channel.version,
      active: true,
    },
  );
  const published = await publishGuestChannel(
    f.operator.personId,
    f.unit.id,
    channel.id,
    { commandId: randomUUID(), expectedChannelVersion: channel.version },
  );
  if (!published.publication) throw new Error("Publication was not created");
  return { ...f, channel, publication: published.publication };
}

type Merchant = Awaited<ReturnType<typeof readyMerchant>>;
type Group = Awaited<ReturnType<typeof fundedGroup>>;

async function prepare(m: Merchant, g: Group) {
  const card = (await getWorkspace(g.holderId, g.primary.serviceId)).cards.find(
    row => row.id === g.card.id,
  );
  if (!card) throw new Error("Selected card is unavailable");
  const input = {
    commandId: randomUUID(),
    cardServiceId: g.primary.serviceId,
    cardId: card.id,
    expectedCardVersion: card.version,
  };
  const review = await prepareCardCheckout(g.holderId, m.publication.id, input);
  return { input, review };
}

async function pay(m: Merchant, g: Group) {
  const prepared = await prepare(m, g);
  const paid = await confirmCardCheckout(
    g.holderId,
    m.publication.id,
    prepared.review.id,
  );
  if (!paid.receipt) throw new Error("Confirmed payment has no receipt");
  return { ...prepared, paid, paymentId: paid.receipt.paymentId };
}

async function money(m: Merchant, g: Group) {
  return getDb().transaction(async tx => {
    const merchant = {
      serviceId: m.merchant.serviceId,
      merchantUnitId: m.unit.id,
    };
    return {
      group: await readServiceMoneyAvailable(tx,g.primary.serviceId),
      spent: await getBalance(tx, {
        serviceId: g.primary.serviceId,
        cardId: g.card.id,
        bucket: "CARD_SPENT",
      }),
      available: await getBalance(tx, {
        ...merchant,
        bucket: "MERCHANT_AVAILABLE",
      }),
      settled: await getBalance(tx, {
        ...merchant,
        bucket: "MERCHANT_SETTLED",
      }),
      pending: await getBalance(tx, {
        ...merchant,
        bucket: "MERCHANT_PAYOUT_PENDING",
      }),
      paidOut: await getBalance(tx, {
        ...merchant,
        bucket: "PAYOUT_CLEARING",
      }),
    };
  });
}

async function requestSettlement(m: Merchant) {
  const operations = await merchantOperations.getMerchantOperations(
    m.merchant.personId,
    m.unit.id,
  );
  if (!operations.depositReview) throw new Error("No deposit review available");
  const input = {
    commandId: randomUUID(),
    reviewToken: operations.depositReview.token,
  };
  const deposit = await merchantOperations.createMerchantSettlement(
    m.merchant.personId,
    m.unit.id,
    input,
  );
  return { input, deposit };
}

async function assertJournal(
  journalId: string,
  expected: Array<{
    serviceId: string | null;
    moneyAccountId?: string;
    cardId: string | null;
    merchantUnitId: string | null;
    bucket: string;
    deltaMinor: bigint;
  }>,
) {
  const entries = await getDb()
    .select()
    .from(ledgerEntries)
    .where(eq(ledgerEntries.journalId, journalId));
  expect(entries).toHaveLength(expected.length);
  expect(entries.reduce((sum, row) => sum + row.deltaMinor, 0n)).toBe(0n);
  for (const line of expected) {
    expect(entries).toContainEqual(expect.objectContaining(line));
  }
}

it("commits one card debit and one merchant credit under concurrent same-attempt retries", async () => {
  const m = await readyMerchant("ONE_TIME");
  const g = await fundedGroup();
  const before = await money(m, g);
  const prepared = await prepare(m, g);
  expect(prepared.review.receipt).toBeNull();
  expect(await money(m, g)).toEqual(before);

  const results = await Promise.all(
    Array.from({ length: 3 }, () =>
      confirmCardCheckout(g.holderId, m.publication.id, prepared.review.id),
    ),
  );
  const paymentId = results[0]!.receipt!.paymentId;
  expect(new Set(results.map(row => row.receipt?.paymentId)).size).toBe(1);

  const payments = await getDb()
    .select()
    .from(merchantTestPayments)
    .where(eq(merchantTestPayments.cardCheckoutId, prepared.review.id));
  expect(payments).toHaveLength(1);
  const payment = payments[0]!;
  expect(payment).toMatchObject({
    id: paymentId,
    serviceId: m.merchant.serviceId,
    merchantUnitId: m.unit.id,
    actorId: null,
    guestOrderId: null,
    cardCheckoutId: prepared.review.id,
    amountMinor: 1250n,
    outcome: "APPROVED",
  });
  expect(payment.cardActivityId).not.toBeNull();
  expect(payment.journalId).not.toBeNull();

  const [attempt] = await getDb()
    .select()
    .from(cardCheckoutAttempts)
    .where(eq(cardCheckoutAttempts.id, prepared.review.id));
  const activities = await getDb()
    .select()
    .from(serviceActivity)
    .where(eq(serviceActivity.cardId, g.card.id));
  expect(activities).toHaveLength(1);
  expect(activities[0]).toMatchObject({
    id: payment.cardActivityId,
    serviceId: g.primary.serviceId,
    direction: "DEBIT",
    amountMinor: 1250n,
  });

  const [cardJournal] = await getDb()
    .select()
    .from(ledgerJournals)
    .where(
      and(
        eq(ledgerJournals.kind, "CARD_PURCHASE"),
        eq(ledgerJournals.referenceId, payment.cardActivityId!),
      ),
    );
  const [merchantJournal] = await getDb()
    .select()
    .from(ledgerJournals)
    .where(eq(ledgerJournals.id, payment.journalId!));
  expect(cardJournal).toBeDefined();
  expect(cardJournal!.createdAt).toEqual(merchantJournal!.createdAt);

  await assertJournal(cardJournal!.id, [
    {
      serviceId: null,
      moneyAccountId:(await getDb().transaction(tx=>getServiceMoneyAccount(tx,g.primary.serviceId))).id,
      cardId: null,
      merchantUnitId: null,
      bucket: "MONEY_AVAILABLE",
      deltaMinor: -1250n,
    },
    {
      serviceId: g.primary.serviceId,
      cardId: g.card.id,
      merchantUnitId: null,
      bucket: "CARD_SPENT",
      deltaMinor: 1250n,
    },
  ]);
  await assertJournal(payment.journalId!, [
    {
      serviceId: m.merchant.serviceId,
      cardId: null,
      merchantUnitId: m.unit.id,
      bucket: "GATEWAY_CLEARING",
      deltaMinor: -1250n,
    },
    {
      serviceId: m.merchant.serviceId,
      cardId: null,
      merchantUnitId: m.unit.id,
      bucket: "MERCHANT_AVAILABLE",
      deltaMinor: 1250n,
    },
  ]);
  expect(
    await getDb()
      .select()
      .from(workspaceCommands)
      .where(eq(workspaceCommands.commandId, attempt!.confirmCommandId)),
  ).toHaveLength(1);
  expect(await money(m, g)).toEqual({
    group: 8750n,
    spent: 1250n,
    available: 1250n,
    settled: 0n,
    pending: 0n,
    paidOut: 0n,
  });

  // The completed payment changed card version and consumed the one-time link.
  // Both retries must still identify the same already-saved result.
  expect(
    await prepareCardCheckout(g.holderId, m.publication.id, prepared.input),
  ).toEqual(results[0]);
  expect(
    await getCardCheckoutReview(g.holderId, m.publication.id, prepared.review.id),
  ).toEqual(results[0]);
}, 30_000);

it("rolls back both journals, activity, payment and card version after a late confirmation failure", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const prepared = await prepare(m, g);
  const before = await money(m, g);
  const [attempt] = await getDb()
    .select()
    .from(cardCheckoutAttempts)
    .where(eq(cardCheckoutAttempts.id, prepared.review.id));
  const [originalCard] = await getDb()
    .select()
    .from(cards)
    .where(eq(cards.id, g.card.id));

  // Inject only a transport-independent failure after the real merchant writer
  // has run. The canonical card writer and both real journal writers execute.
  const original = merchantOperations.recordMerchantSandboxPayment;
  const injected = vi
    .spyOn(merchantOperations, "recordMerchantSandboxPayment")
    .mockImplementationOnce(async (...args) => {
      await original(...args);
      throw new Error("D69 injected failure before transaction commit");
    });
  await expect(
    confirmCardCheckout(g.holderId, m.publication.id, prepared.review.id),
  ).rejects.toThrow("D69 injected failure");
  expect(injected).toHaveBeenCalledTimes(1);
  injected.mockRestore();

  expect(await money(m, g)).toEqual(before);
  expect(
    await getDb()
      .select()
      .from(serviceActivity)
      .where(eq(serviceActivity.cardId, g.card.id)),
  ).toHaveLength(0);
  expect(
    await getDb()
      .select()
      .from(merchantTestPayments)
      .where(eq(merchantTestPayments.cardCheckoutId, prepared.review.id)),
  ).toHaveLength(0);
  expect(
    await getDb()
      .select()
      .from(workspaceCommands)
      .where(eq(workspaceCommands.commandId, attempt!.confirmCommandId)),
  ).toHaveLength(0);
  const [unchanged] = await getDb()
    .select()
    .from(cards)
    .where(eq(cards.id, g.card.id));
  expect(unchanged).toEqual(originalCard);

  const retry = await confirmCardCheckout(
    g.holderId,
    m.publication.id,
    prepared.review.id,
  );
  expect(retry.receipt).not.toBeNull();
  expect((await money(m, g)).group).toBe(8750n);
}, 30_000);

it("denies another person's card and review, and leaves no payment when group funds are insufficient", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup("1000");
  const foreign = await cardPrimary("D69 unrelated primary");
  const prepared = await prepare(m, g);

  // Even group oversight cannot spend a secondary's card.
  const forbiddenCommand = randomUUID();
  await expect(
    prepareCardCheckout(g.primary.personId, m.publication.id, {
      ...prepared.input,
      commandId: forbiddenCommand,
    }),
  ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE", status: 404 });
  await expect(
    prepareCardCheckout(foreign.personId, m.publication.id, {
      ...prepared.input,
      commandId: randomUUID(),
    }),
  ).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE", status: 404 });
  await expect(
    getCardCheckoutReview(foreign.personId, m.publication.id, prepared.review.id),
  ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE", status: 404 });
  await expect(
    confirmCardCheckout(foreign.personId, m.publication.id, prepared.review.id),
  ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE", status: 404 });
  expect(
    await getDb()
      .select()
      .from(cardCheckoutAttempts)
      .where(eq(cardCheckoutAttempts.id, forbiddenCommand)),
  ).toHaveLength(0);

  const before = await money(m, g);
  await expect(
    confirmCardCheckout(g.holderId, m.publication.id, prepared.review.id),
  ).rejects.toMatchObject({ code: "INSUFFICIENT_PRACTICE_FUNDS" });
  expect(await money(m, g)).toEqual(before);
  expect(
    await getDb()
      .select()
      .from(merchantTestPayments)
      .where(eq(merchantTestPayments.merchantUnitId, m.unit.id)),
  ).toHaveLength(0);
  expect(
    await getDb()
      .select()
      .from(serviceActivity)
      .where(eq(serviceActivity.cardId, g.card.id)),
  ).toHaveLength(0);
}, 30_000);

it("refunds the original group once while preserving gross monthly usage and card freeze", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const paid = await pay(m, g);
  const current = (await getWorkspace(g.holderId, g.primary.serviceId)).cards.find(
    row => row.id === g.card.id,
  )!;
  await controlCard(g.primary.personId, g.primary.serviceId, g.card.id, {
    commandId: randomUUID(),
    expectedVersion: current.version,
    action: "freeze",
  });
  const input = {
    commandId: randomUUID(),
    expectedVersion: 1,
    reason: "Original order returned",
  };
  const refunded = await merchantOperations.refundMerchantPayment(
    m.merchant.personId,
    m.unit.id,
    paid.paymentId,
    input,
  );
  expect(refunded.status).toBe("REFUNDED");
  expect(
    await merchantOperations.refundMerchantPayment(
      m.merchant.personId,
      m.unit.id,
      paid.paymentId,
      input,
    ),
  ).toEqual(refunded);
  expect(await money(m, g)).toEqual({
    group: 10000n,
    spent: 0n,
    available: 0n,
    settled: 0n,
    pending: 0n,
    paidOut: 0n,
  });

  const spending = await getCardSpending(
    g.primary.personId,
    g.primary.serviceId,
    g.card.id,
  );
  expect(spending).toMatchObject({
    used: { minor: "1250" },
    remaining: { minor: "3750" },
    available: { minor: "3750" },
  });
  const [card] = await getDb()
    .select()
    .from(cards)
    .where(eq(cards.id, g.card.id));
  expect(card).toMatchObject({ status: "FROZEN", primaryFrozen: true });

  const refunds = await getDb()
    .select()
    .from(merchantTestRefunds)
    .where(eq(merchantTestRefunds.paymentId, paid.paymentId));
  expect(refunds).toHaveLength(1);
  const refund = refunds[0]!;
  const [credit] = await getDb()
    .select()
    .from(serviceActivity)
    .where(eq(serviceActivity.id, refund.id));
  expect(credit).toMatchObject({
    serviceId: g.primary.serviceId,
    cardId: g.card.id,
    direction: "CREDIT",
    amountMinor: 1250n,
  });
  const journals = await getDb()
    .select()
    .from(ledgerJournals)
    .where(
      and(
        eq(ledgerJournals.referenceId, refund.id),
        inArray(ledgerJournals.kind, ["CARD_REFUND", "MERCHANT_REFUND"]),
      ),
    );
  expect(journals).toHaveLength(2);
  const cardRefund = journals.find(row => row.kind === "CARD_REFUND")!;
  await assertJournal(cardRefund.id, [
    {
      serviceId: g.primary.serviceId,
      cardId: g.card.id,
      merchantUnitId: null,
      bucket: "CARD_SPENT",
      deltaMinor: -1250n,
    },
    {
      serviceId: null,
      moneyAccountId:(await getDb().transaction(tx=>getServiceMoneyAccount(tx,g.primary.serviceId))).id,
      cardId: null,
      merchantUnitId: null,
      bucket: "MONEY_AVAILABLE",
      deltaMinor: 1250n,
    },
  ]);
  expect(
    (
      await getCardCheckoutReview(
        g.holderId,
        m.publication.id,
        paid.review.id,
      )
    ).receipt?.refundedAt,
  ).not.toBeNull();
}, 30_000);

it("requires a fresh exact settlement review when another payment arrives",async()=>{
 const m=await readyMerchant(),g=await fundedGroup(),first=await pay(m,g);
 const old=await merchantOperations.getMerchantOperations(m.merchant.personId,m.unit.id);const second=await pay(m,g);
 const stale={commandId:randomUUID(),reviewToken:old.depositReview!.token};
 await expect(merchantOperations.createMerchantSettlement(m.merchant.personId,m.unit.id,stale)).rejects.toMatchObject({code:"DEPOSIT_REVIEW_CHANGED"});
 expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,stale.commandId))).toHaveLength(0);
 const requested=await requestSettlement(m);expect(requested.deposit.amount.minor).toBe("2500");
 const items=await getDb().select().from(merchantSettlementItems).where(eq(merchantSettlementItems.settlementId,requested.deposit.settlementId));
 expect(items.map(row=>row.paymentId).sort()).toEqual([first.paymentId,second.paymentId].sort());
 expect(await merchantOperations.createMerchantSettlement(m.merchant.personId,m.unit.id,requested.input)).toEqual(requested.deposit);
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,m.merchant.serviceId))).toBe(2500n);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,g.primary.serviceId))).toBe(7500n);
 expect(await money(m,g)).toMatchObject({available:0n,pending:0n,settled:0n});
});
it("settlement journal debits exact terminal pending principal and credits only Merchant money",async()=>{
 const m=await readyMerchant(),g=await fundedGroup();await pay(m,g);const requested=await requestSettlement(m);
 const [batch]=await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.id,requested.deposit.settlementId));
 const account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,m.merchant.serviceId));
 expect(batch?.moneyAccountId).toBe(account.id);await assertJournal(batch!.journalId,[{serviceId:m.merchant.serviceId,merchantUnitId:m.unit.id,cardId:null,bucket:"MERCHANT_AVAILABLE",deltaMinor:-1250n},{serviceId:null,moneyAccountId:account.id,merchantUnitId:null,cardId:null,bucket:"MONEY_AVAILABLE",deltaMinor:1250n}]);
 await expect(getDb().update(merchantSettlements).set({amountMinor:1n}).where(eq(merchantSettlements.id,batch!.id))).rejects.toThrow();
 await expect(merchantOperations.createMerchantSettlement(m.operator.personId,m.unit.id,requested.input)).rejects.toMatchObject({status:403});
});
it("refund after settlement restores the separate card account once without rewriting settled principal",async()=>{
 const m=await readyMerchant(),g=await fundedGroup(),paid=await pay(m,g),requested=await requestSettlement(m);
 const command={commandId:randomUUID(),expectedVersion:1,reason:"Order returned"};
 const results=await Promise.all(Array.from({length:4},()=>merchantOperations.refundMerchantPayment(m.merchant.personId,m.unit.id,paid.paymentId,command)));expect(new Set(results.map(row=>row.refund?.id)).size).toBe(1);
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,m.merchant.serviceId))).toBe(0n);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,g.primary.serviceId))).toBe(10000n);
 const [batch]=await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.id,requested.deposit.settlementId));expect(batch?.amountMinor).toBe(1250n);
 expect((await getCardSpending(g.primary.personId,g.primary.serviceId,g.card.id)).used.minor).toBe("1250");
});
it("late settlement failure rolls back both journal lines, batch membership and command receipt",async()=>{
 const m=await readyMerchant(),g=await fundedGroup();await pay(m,g);const before=await money(m,g),operations=await merchantOperations.getMerchantOperations(m.merchant.personId,m.unit.id),input={commandId:randomUUID(),reviewToken:operations.depositReview!.token};
 const original=ledgerService.postJournal;const injected=vi.spyOn(ledgerService,"postJournal").mockImplementationOnce(async(...args)=>{await original(...args);throw new Error("Injected settlement journal failure");});
 await expect(merchantOperations.createMerchantSettlement(m.merchant.personId,m.unit.id,input)).rejects.toThrow("Injected settlement journal failure");expect(injected).toHaveBeenCalledTimes(1);injected.mockRestore();
 expect(await money(m,g)).toEqual(before);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,m.merchant.serviceId))).toBe(0n);expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,m.unit.id))).toHaveLength(0);
});
