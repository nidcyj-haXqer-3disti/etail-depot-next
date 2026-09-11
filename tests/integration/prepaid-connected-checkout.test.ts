import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, expect, it, vi } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import {
  cards,
  serviceActivity,
  serviceMembers,
  workspaceCommands,
} from "../../src/platform/database/schema";
import { getBalance, type LedgerPosition } from "../../src/modules/ledger/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { operatorServiceAccess } from "../../src/modules/operations/schema";
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
  merchantDepositItems,
  merchantDepositEvents,
  merchantDeposits,
  merchantSettlementItems,
  merchantSettlements,
} from "../../src/modules/acquiring/settlement-schema";
import * as merchantOperations from "../../src/modules/acquiring/operations-service";
import { createChannel } from "../../src/modules/acquiring/service";
import { publishGuestChannel } from "../../src/modules/acquiring/guest-service";
import {
  addCardholderFunds,
  controlCard,
  getPersonSpending,
  getWorkspace,
  setCardholderSpendingLimit,
  startCardRequest,
  submitCardRequest,
  updateCardRequest,
} from "../../src/modules/workspace/service";
import { cardPerson, cardPrimary, enrollCardholder } from "../helpers/cardholder";
import { merchantAccessFixture } from "../helpers/merchant-access";
import { paymentInput } from "../helpers/acquiring";

afterAll(closeDatabase);
afterEach(() => vi.restoreAllMocks());

async function balance(position: LedgerPosition) {
  return getDb().transaction(tx => getBalance(tx, position));
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
  const saved = await updateCardRequest(primaryId, serviceId, draft.id, {
    commandId: randomUUID(),
    expectedVersion: draft.version,
    holderId,
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
  const card = (await getWorkspace(holderId, serviceId)).cards.find(
    row => row.id === issued.issuedCardId,
  );
  if (!card) throw new Error("Issued card is unavailable to its holder");
  return card;
}

async function fundedGroup(funds = "10000", limit = "5000") {
  const primary = await cardPrimary("D69 funding primary");
  const holderId = await cardPerson("D69 secondary cardholder");
  await enrollCardholder(primary.personId, primary.serviceId, holderId);
  const card = await bareCard(
    primary.personId,
    primary.serviceId,
    holderId,
    "Everyday card",
  );

  // Issuance must not create funds or a person limit.
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
  await setCardholderSpendingLimit(primary.personId, primary.serviceId, holderId, {
    commandId: randomUUID(),
    expectedVersion: 0,
    monthlyLimitMinor: limit,
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
      group: await getBalance(tx, {
        serviceId: g.primary.serviceId,
        bucket: "GROUP_AVAILABLE",
      }),
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

async function processor(serviceId: string, canProcessDeposits = true) {
  const personId = await cardPerson("D69 explicit deposit operator");
  await getDb().insert(operatorServiceAccess).values({
    serviceId,
    personId,
    state: "ACCEPTED",
    canRespond: true,
    canProcessDeposits,
  });
  return personId;
}

async function requestDeposit(m: Merchant) {
  const operations = await merchantOperations.getMerchantOperations(
    m.merchant.personId,
    m.unit.id,
  );
  if (!operations.depositReview) throw new Error("No deposit review available");
  const input = {
    commandId: randomUUID(),
    reviewToken: operations.depositReview.token,
  };
  const deposit = await merchantOperations.createMerchantPayout(
    m.merchant.personId,
    m.unit.id,
    input,
  );
  return { input, deposit };
}

async function assertJournal(
  journalId: string,
  expected: Array<{
    serviceId: string;
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
      serviceId: g.primary.serviceId,
      cardId: null,
      merchantUnitId: null,
      bucket: "GROUP_AVAILABLE",
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

  const spending = await getPersonSpending(
    g.primary.personId,
    g.primary.serviceId,
    g.holderId,
  );
  expect(spending).toMatchObject({
    spentThisMonth: { minor: "1250" },
    remainingThisMonth: { minor: "3750" },
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
      serviceId: g.primary.serviceId,
      cardId: null,
      merchantUnitId: null,
      bucket: "GROUP_AVAILABLE",
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

it("requires a fresh exact deposit review when another payment arrives", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const first = await pay(m, g);
  const old = await merchantOperations.getMerchantOperations(
    m.merchant.personId,
    m.unit.id,
  );
  expect(old.depositReview).toMatchObject({
    amount: { minor: "1250" },
    paymentCount: 1,
  });
  const second = await pay(m, g);
  const staleInput = {
    commandId: randomUUID(),
    reviewToken: old.depositReview!.token,
  };
  await expect(
    merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      staleInput,
    ),
  ).rejects.toMatchObject({ code: "DEPOSIT_REVIEW_CHANGED" });
  expect(
    await getDb()
      .select()
      .from(merchantOperationCommands)
      .where(eq(merchantOperationCommands.commandId, staleInput.commandId)),
  ).toHaveLength(0);
  expect(
    await getDb()
      .select()
      .from(merchantSettlements)
      .where(eq(merchantSettlements.merchantUnitId, m.unit.id)),
  ).toHaveLength(0);
  expect((await money(m, g)).available).toBe(2500n);

  const requested = await requestDeposit(m);
  expect(requested.deposit).toMatchObject({
    status: "PENDING",
    amount: { minor: "2500" },
    processedAt: null,
  });
  expect(requested.deposit.payments.map(row => row.id).sort()).toEqual(
    [first.paymentId, second.paymentId].sort(),
  );
  const items = await getDb()
    .select()
    .from(merchantSettlementItems)
    .where(
      eq(merchantSettlementItems.settlementId, requested.deposit.settlementId),
    );
  expect(items).toHaveLength(2);
  expect(items.reduce((sum, row) => sum + row.amountMinor, 0n)).toBe(2500n);
  expect(
    await merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      requested.input,
    ),
  ).toEqual(requested.deposit);
  expect(await money(m, g)).toMatchObject({
    available: 0n,
    settled: 0n,
    pending: 2500n,
    paidOut: 0n,
  });
}, 30_000);

it("keeps deposits pending until an explicitly assigned operator records one terminal result", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const paid = await pay(m, g);
  const requested = await requestDeposit(m);
  const supportOnly = await processor(m.merchant.serviceId, false);
  const operatorId = await processor(m.merchant.serviceId);

  // Processing assignment grants no customer service membership.
  expect(
    await getDb()
      .select()
      .from(serviceMembers)
      .where(eq(serviceMembers.personId, operatorId)),
  ).toHaveLength(0);
  for (const deniedPerson of [
    m.merchant.personId,
    m.operator.personId,
    supportOnly,
  ]) {
    await expect(
      merchantOperations.processMerchantDeposit(
        deniedPerson,
        requested.deposit.id,
        { commandId: randomUUID(), outcome: "COMPLETED" },
      ),
    ).rejects.toMatchObject({ code: "ACTION_DENIED" });
  }
  expect(await merchantOperations.getDepositProcessingQueue(supportOnly)).toEqual(
    [],
  );
  expect(
    (await merchantOperations.getDepositProcessingQueue(operatorId)).map(
      row => row.id,
    ),
  ).toContain(requested.deposit.id);

  const blockedRefund = {
    commandId: randomUUID(),
    expectedVersion: 1,
    reason: "Cannot use reserved money for a refund",
  };
  await expect(
    merchantOperations.refundMerchantPayment(
      m.merchant.personId,
      m.unit.id,
      paid.paymentId,
      blockedRefund,
    ),
  ).rejects.toMatchObject({ code: "REFUND_DEPOSIT_RESERVED" });
  expect((await money(m, g)).group).toBe(8750n);

  const event = { commandId: randomUUID(), outcome: "COMPLETED" as const };
  const completed = await merchantOperations.processMerchantDeposit(
    operatorId,
    requested.deposit.id,
    event,
  );
  expect(completed.status).toBe("COMPLETED");
  expect(completed.processedAt).not.toBeNull();
  expect(
    await merchantOperations.processMerchantDeposit(
      operatorId,
      requested.deposit.id,
      event,
    ),
  ).toEqual(completed);
  expect(
    await merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      requested.input,
    ),
  ).toEqual(completed);
  await expect(
    merchantOperations.processMerchantDeposit(operatorId, requested.deposit.id, {
      ...event,
      outcome: "FAILED",
    }),
  ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });

  expect(await money(m, g)).toMatchObject({
    pending: 0n,
    settled: 0n,
    paidOut: 1250n,
  });
  expect(
    (await merchantOperations.getDepositProcessingQueue(operatorId)).map(
      row => row.id,
    ),
  ).not.toContain(requested.deposit.id);
  expect(
    await getDb()
      .select()
      .from(merchantDepositEvents)
      .where(eq(merchantDepositEvents.depositId, requested.deposit.id)),
  ).toHaveLength(1);

  const refunded = await merchantOperations.refundMerchantPayment(m.merchant.personId, m.unit.id, paid.paymentId, blockedRefund);
  expect(refunded.status).toBe("REFUNDED");
  expect(await money(m, g)).toMatchObject({group: 10000n, paidOut: 0n});
  expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId, paid.paymentId))).toHaveLength(1);
}, 30_000);

it("releases a failed deposit once and requires a new exact-batch deposit command", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  await pay(m, g);
  const requested = await requestDeposit(m);
  const operatorId = await processor(m.merchant.serviceId);
  const failure = { commandId: randomUUID(), outcome: "FAILED" as const };
  const failed = await merchantOperations.processMerchantDeposit(
    operatorId,
    requested.deposit.id,
    failure,
  );
  expect(failed.status).toBe("FAILED");
  expect(
    await merchantOperations.processMerchantDeposit(
      operatorId,
      requested.deposit.id,
      failure,
    ),
  ).toEqual(failed);
  expect(await money(m, g)).toMatchObject({
    available: 0n,
    settled: 1250n,
    pending: 0n,
    paidOut: 0n,
  });

  // Replaying the original command reports its failure; it does not requeue.
  expect(
    await merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      requested.input,
    ),
  ).toMatchObject({...failed, retryReview: expect.objectContaining({amount: {minor:"1250",currency:"USD",formatted:"$12.50"}})});
  const retryInput = {
    commandId: randomUUID(),
    settlementId: requested.deposit.settlementId,
    reviewToken: (await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id)).payouts.find(row => row.id === requested.deposit.id)!.retryReview!.token,
  };
  const retried = await merchantOperations.createMerchantPayout(
    m.merchant.personId,
    m.unit.id,
    retryInput,
  );
  expect(retried).toMatchObject({
    status: "PENDING",
    settlementId: requested.deposit.settlementId,
    amount: { minor: "1250" },
  });
  expect(retried.id).not.toBe(requested.deposit.id);
  expect(
    await merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      retryInput,
    ),
  ).toEqual(retried);
  await expect(
    merchantOperations.createMerchantPayout(m.merchant.personId, m.unit.id, {
      ...retryInput,
      commandId: randomUUID(),
    }),
  ).rejects.toMatchObject({ code: "DEPOSIT_ALREADY_REQUESTED" });

  // An event ID cannot be reused to process a different deposit.
  await expect(
    merchantOperations.processMerchantDeposit(operatorId, retried.id, failure),
  ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
  await expect(
    merchantOperations.processMerchantDeposit(operatorId, requested.deposit.id, {
      commandId: randomUUID(),
      outcome: "COMPLETED",
    }),
  ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });

  await merchantOperations.processMerchantDeposit(operatorId, retried.id, {
    commandId: randomUUID(),
    outcome: "COMPLETED",
  });
  expect(await money(m, g)).toMatchObject({
    settled: 0n,
    pending: 0n,
    paidOut: 1250n,
  });
  expect(
    await getDb()
      .select()
      .from(merchantSettlements)
      .where(eq(merchantSettlements.merchantUnitId, m.unit.id)),
  ).toHaveLength(1);
  expect(
    await getDb()
      .select()
      .from(merchantDeposits)
      .where(eq(merchantDeposits.settlementId, retried.settlementId)),
  ).toHaveLength(2);
  expect(
    await getDb()
      .select()
      .from(merchantDepositEvents)
      .where(
        inArray(merchantDepositEvents.depositId, [
          requested.deposit.id,
          retried.id,
        ]),
      ),
  ).toHaveLength(2);
}, 30_000);

it("blocks retrying a failed batch at its old amount after one included payment is refunded", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const first = await pay(m, g);
  await pay(m, g);
  const requested = await requestDeposit(m);
  const operatorId = await processor(m.merchant.serviceId);
  await merchantOperations.processMerchantDeposit(
    operatorId,
    requested.deposit.id,
    { commandId: randomUUID(), outcome: "FAILED" },
  );
  const staleReview = (await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id)).payouts.find(row => row.id === requested.deposit.id)!.retryReview!;
  await merchantOperations.refundMerchantPayment(
    m.merchant.personId,
    m.unit.id,
    first.paymentId,
    {
      commandId: randomUUID(),
      expectedVersion: 1,
      reason: "One item returned after deposit failure",
    },
  );
  const before = await money(m, g);
  expect(before).toMatchObject({
    group: 8750n,
    settled: 1250n,
    pending: 0n,
    paidOut: 0n,
  });
  const retryInput = {
    commandId: randomUUID(),
    settlementId: requested.deposit.settlementId,
    reviewToken: staleReview.token,
  };
  await expect(
    merchantOperations.createMerchantPayout(
      m.merchant.personId,
      m.unit.id,
      retryInput,
    ),
  ).rejects.toMatchObject({ code: "DEPOSIT_REVIEW_CHANGED" });
  expect(await money(m, g)).toEqual(before);
  expect(
    await getDb()
      .select()
      .from(merchantOperationCommands)
      .where(eq(merchantOperationCommands.commandId, retryInput.commandId)),
  ).toHaveLength(0);
  expect(
    await getDb()
      .select()
      .from(merchantDeposits)
      .where(
        eq(merchantDeposits.settlementId, requested.deposit.settlementId),
      ),
  ).toHaveLength(1);
  // Historical settlement membership remains exact and immutable.
  expect(
    await getDb()
      .select()
      .from(merchantSettlementItems)
      .where(
        eq(merchantSettlementItems.settlementId, requested.deposit.settlementId),
      ),
  ).toHaveLength(2);
}, 30_000);

// Append to tests/integration/prepaid-connected-checkout.test.ts.
// Add merchantDepositItems to its existing settlement-schema named import.
// These tests reuse that file's existing real domain helpers, not HTTP simulators.

it("refunds a completed deposit from its own Sandbox bank once without rewriting deposit principal", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const first = await pay(m, g);
  const second = await pay(m, g);
  const { deposit } = await requestDeposit(m);
  const operatorId = await processor(m.merchant.serviceId);
  const processing = { commandId: randomUUID().toUpperCase(), outcome: "COMPLETED" as const };

  const completed = await merchantOperations.processMerchantDeposit(operatorId, deposit.id, processing);
  expect(completed).toMatchObject({ status: "COMPLETED", amount: { minor: "2500" }, retryReview: null });
  // UUID spelling must not make the original processing result unrecoverable.
  expect(await merchantOperations.processMerchantDeposit(operatorId, deposit.id, processing)).toEqual(completed);
  expect(await money(m, g)).toEqual({ group: 7500n, spent: 2500n, available: 0n, settled: 0n, pending: 0n, paidOut: 2500n });

  const beforeRefund = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  expect(beforeRefund.payments.find(row => row.id === first.paymentId)).toMatchObject({ canRefund: true, refundSource: "SANDBOX_BANK", refundUnavailableReason: null });
  const refundInput = { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional order returned after deposit" };
  const refunded = await Promise.all(Array.from({ length: 3 }, () => merchantOperations.refundMerchantPayment(m.merchant.personId, m.unit.id, first.paymentId, refundInput)));
  expect(new Set(refunded.map(row => row.refund?.id)).size).toBe(1);
  expect(refunded[0]).toMatchObject({ status: "REFUNDED", refund: { amount: { minor: "1250" } } });
  expect(await money(m, g)).toEqual({ group: 8750n, spent: 1250n, available: 0n, settled: 0n, pending: 0n, paidOut: 1250n });
  expect(await getPersonSpending(g.holderId, g.primary.serviceId, g.holderId)).toMatchObject({ spentThisMonth: { minor: "2500" }, remainingThisMonth: { minor: "2500" } });

  const [refund] = await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId, first.paymentId));
  await assertJournal(refund!.journalId, [
    { serviceId: m.merchant.serviceId, merchantUnitId: m.unit.id, cardId: null, bucket: "PAYOUT_CLEARING", deltaMinor: -1250n },
    { serviceId: m.merchant.serviceId, merchantUnitId: m.unit.id, cardId: null, bucket: "GATEWAY_CLEARING", deltaMinor: 1250n },
  ]);
  const cardRefunds = await getDb().select().from(ledgerJournals).where(and(eq(ledgerJournals.kind, "CARD_REFUND"), eq(ledgerJournals.referenceId, refund!.id)));
  expect(cardRefunds).toHaveLength(1);
  await assertJournal(cardRefunds[0]!.id, [
    { serviceId: g.primary.serviceId, merchantUnitId: null, cardId: g.card.id, bucket: "CARD_SPENT", deltaMinor: -1250n },
    { serviceId: g.primary.serviceId, merchantUnitId: null, cardId: null, bucket: "GROUP_AVAILABLE", deltaMinor: 1250n },
  ]);
  const after = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  const receipt = after.payouts.find(row => row.id === deposit.id)!;
  expect(receipt).toMatchObject({ status: "COMPLETED", amount: { minor: "2500" }, retryReview: null });
  expect(receipt.payments).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: first.paymentId, amount: expect.objectContaining({ minor: "1250" }), refundedAmount: expect.objectContaining({ minor: "1250" }) }),
    expect.objectContaining({ id: second.paymentId, amount: expect.objectContaining({ minor: "1250" }), refundedAmount: expect.objectContaining({ minor: "0" }) }),
  ]));
  expect(after.bankFunds?.minor).toBe("1250");
  expect(after.depositReview).toBeNull();
  await expect(merchantOperations.createMerchantPayout(m.merchant.personId, m.unit.id, { commandId: randomUUID(), settlementId: deposit.settlementId, reviewToken: "a".repeat(64) })).rejects.toMatchObject({ code: "DEPOSIT_ALREADY_REQUESTED" });
  expect(await money(m, g)).toEqual({ group: 8750n, spent: 1250n, available: 0n, settled: 0n, pending: 0n, paidOut: 1250n });
}, 30_000);

it("retries only unrefunded original-batch principal and preserves separate new collections", async () => {
  const m = await readyMerchant();
  const g = await fundedGroup();
  const first = await pay(m, g);
  const second = await pay(m, g);
  const third = await pay(m, g);
  const { deposit: original } = await requestDeposit(m);
  const operatorId = await processor(m.merchant.serviceId);
  await merchantOperations.processMerchantDeposit(operatorId, original.id, { commandId: randomUUID(), outcome: "FAILED" });
  const beforeRefund = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  const staleReview = beforeRefund.payouts.find(row => row.id === original.id)!.retryReview!;
  expect(staleReview.amount.minor).toBe("3750");

  await merchantOperations.refundMerchantPayment(m.merchant.personId, m.unit.id, first.paymentId, { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional returned order before retry" });
  const fourth = await pay(m, g);
  const beforeRetry = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  const review = beforeRetry.payouts.find(row => row.id === original.id)!.retryReview!;
  expect(review).toMatchObject({ amount: { minor: "2500" }, paymentCount: 2 });
  expect(review.token).not.toBe(staleReview.token);
  expect(beforeRetry.depositReview).toMatchObject({ amount: { minor: "1250" }, paymentCount: 1 });
  const originalRows = await getDb().select().from(merchantDepositItems).where(eq(merchantDepositItems.depositId, original.id)).orderBy(merchantDepositItems.paymentId);
  expect(originalRows.map(row => row.paymentId).sort()).toEqual([first.paymentId, second.paymentId, third.paymentId].sort());
  expect(originalRows.reduce((sum, row) => sum + row.amountMinor, 0n)).toBe(3750n);

  await expect(merchantOperations.createMerchantPayout(m.merchant.personId, m.unit.id, { commandId: randomUUID(), settlementId: original.settlementId, reviewToken: staleReview.token })).rejects.toMatchObject({ code: "DEPOSIT_REVIEW_CHANGED" });
  expect(await money(m, g)).toEqual({ group: 6250n, spent: 3750n, available: 1250n, settled: 2500n, pending: 0n, paidOut: 0n });
  const input = { commandId: randomUUID(), settlementId: original.settlementId, reviewToken: review.token };
  const retries = await Promise.all(Array.from({ length: 3 }, () => merchantOperations.createMerchantPayout(m.merchant.personId, m.unit.id, input)));
  expect(new Set(retries.map(row => row.id)).size).toBe(1);
  const retry = retries[0]!;
  expect(retry).toMatchObject({ status: "PENDING", settlementId: original.settlementId, amount: { minor: "2500" }, retryReview: null });
  expect(retry.payments.map(row => row.id).sort()).toEqual([second.paymentId, third.paymentId].sort());
  expect(await money(m, g)).toEqual({ group: 6250n, spent: 3750n, available: 1250n, settled: 0n, pending: 2500n, paidOut: 0n });
  const pending = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  expect(pending.payments.find(row => row.id === second.paymentId)).toMatchObject({ canRefund: false, refundSource: null });
  await expect(merchantOperations.refundMerchantPayment(m.merchant.personId, m.unit.id, second.paymentId, { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional refund while processing" })).rejects.toMatchObject({ code: "REFUND_DEPOSIT_RESERVED" });
  await expect(getDb().insert(merchantDepositItems).values({ depositId: retry.id, paymentId: fourth.paymentId, amountMinor: 1250n })).rejects.toMatchObject({ cause: { code: "23514" } });

  await merchantOperations.processMerchantDeposit(operatorId, retry.id, { commandId: randomUUID(), outcome: "COMPLETED" });
  await merchantOperations.refundMerchantPayment(m.merchant.personId, m.unit.id, second.paymentId, { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional return after net retry completed" });
  expect(await money(m, g)).toEqual({ group: 7500n, spent: 2500n, available: 1250n, settled: 0n, pending: 0n, paidOut: 1250n });
  const final = await merchantOperations.getMerchantOperations(m.merchant.personId, m.unit.id);
  expect(final.payouts.find(row => row.id === original.id)).toMatchObject({ status: "FAILED", amount: { minor: "3750" }, retryReview: null });
  expect(final.payouts.find(row => row.id === retry.id)).toMatchObject({ status: "COMPLETED", amount: { minor: "2500" }, retryReview: null });
  expect(final.depositReview).toMatchObject({ amount: { minor: "1250" }, paymentCount: 1 });
  expect(final.payments.find(row => row.id === fourth.paymentId)).toMatchObject({ status: "APPROVED", canRefund: true, refundSource: "COLLECTION_BALANCE" });
  expect(await getDb().select().from(merchantDepositItems).where(eq(merchantDepositItems.depositId, original.id)).orderBy(merchantDepositItems.paymentId)).toEqual(originalRows);
  expect(await getPersonSpending(g.holderId, g.primary.serviceId, g.holderId)).toMatchObject({ spentThisMonth: { minor: "5000" }, remainingThisMonth: { minor: "0" } });
}, 30_000);
