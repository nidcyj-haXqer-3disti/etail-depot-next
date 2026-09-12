import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { createChannel } from "../../src/modules/acquiring/service";
import { merchantUnits } from "../../src/modules/acquiring/schema";
import { merchantOperationCommands, merchantTestPayments, merchantTestRefunds } from "../../src/modules/acquiring/operations-schema";
import { configureTestGateway, createMerchantPayout, enrollTestMerchant, getMerchantOperations, refundMerchantPayment, setChannelActivation, simulateMerchantPayment } from "../../src/modules/acquiring/operations-service";
import {merchantDeposits} from "../../src/modules/acquiring/settlement-schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { acquiringFixture, paymentInput } from "../helpers/acquiring";
afterAll(closeDatabase);
async function ready() {
  const f = await acquiringFixture();
  const [unit] = await getDb().select().from(merchantUnits).where(and(eq(merchantUnits.masterServiceId, f.serviceId), eq(merchantUnits.kind, "MASTER")));
  const channel = await createChannel(f.personId, unit!.id, { ...paymentInput(), presentations: ["WEB", "QR"], visibility: "CREATOR_PRIVATE" });
  await configureTestGateway(f.personId, f.merchantId, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(f.personId, unit!.id, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await setChannelActivation(f.personId, unit!.id, channel.id, { commandId: randomUUID(), expectedVersion: 0, expectedChannelVersion: channel.version, active: true });
  return { ...f, unit: unit!, channel };
}
it("simultaneous one-time payments from different presentations have exactly one approved effect", async () => {
  const f = await ready();
  const attempts = await Promise.allSettled(Array.from({ length: 5 }, () => simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, { commandId: randomUUID(), expectedChannelVersion: 1, outcome: "APPROVED" })));
  expect(attempts.filter(row => row.status === "fulfilled")).toHaveLength(1);
  expect(attempts.filter(row => row.status === "rejected").every(row => row.reason.code === "CHANNEL_ALREADY_USED")).toBe(true);
  expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.channelId, f.channel.id))).toHaveLength(1);
  const entries = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId, f.unit.id));
  expect(entries).toHaveLength(2); expect(entries.reduce((sum, row) => sum + row.deltaMinor, 0n)).toBe(0n);
  expect((await getMerchantOperations(f.personId, f.unit.id)).availableFunds?.minor).toBe("1250");
});
it("concurrent retries share one payment, refund and balanced journal pair per effect", async () => {
  const f = await ready(), input = { commandId: randomUUID(), expectedChannelVersion: 1, outcome: "APPROVED" as const };
  const results = await Promise.all(Array.from({ length: 6 }, (_, index) => simulateMerchantPayment(f.personId, index % 2 ? f.unit.id.toUpperCase() : f.unit.id, f.channel.id, index % 2 ? { ...input, commandId: input.commandId.toUpperCase() } : input)));
  expect(new Set(results.map(row => row.id)).size).toBe(1);
  const refund = { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional duplicate return retry" };
  const refunds = await Promise.all(Array.from({ length: 4 }, () => refundMerchantPayment(f.personId, f.unit.id, results[0]!.id, refund)));
  expect(new Set(refunds.map(row => row.refund?.id)).size).toBe(1);
  expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId, input.commandId))).toHaveLength(1);
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId, f.unit.id))).toHaveLength(4);
  expect((await getMerchantOperations(f.personId, f.unit.id)).availableFunds?.minor).toBe("0");
});
it("competing transfers cannot overdraw available funds", async () => {
  const f = await ready(); await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, { commandId: randomUUID(), expectedChannelVersion: 1, outcome: "APPROVED" });
  const reviewToken=(await getMerchantOperations(f.personId,f.unit.id)).depositReview!.token;
  const transfers = await Promise.allSettled(Array.from({ length: 2 }, () => createMerchantPayout(f.personId, f.unit.id, {commandId: randomUUID(),reviewToken})));
  expect(transfers.filter(row => row.status === "fulfilled")).toHaveLength(1);
  expect(transfers.find(row => row.status === "rejected")).toMatchObject({ reason: { code: "NO_PAYMENTS_TO_DEPOSIT" } });
  expect((await getMerchantOperations(f.personId, f.unit.id)).availableFunds?.minor).toBe("0");
  expect(await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.merchantUnitId, f.unit.id))).toHaveLength(1);
});
it("a full refund racing a full transfer commits only one debit", async () => {
  const f = await ready(), paid = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, { commandId: randomUUID(), expectedChannelVersion: 1, outcome: "APPROVED" });
  const reviewToken=(await getMerchantOperations(f.personId,f.unit.id)).depositReview!.token;
  const outcomes = await Promise.allSettled([
    refundMerchantPayment(f.personId, f.unit.id, paid.id, { commandId: randomUUID(), expectedVersion: 1, reason: "Fictional race return" }),
    createMerchantPayout(f.personId, f.unit.id, {commandId: randomUUID(),reviewToken}),
  ]);
  expect(outcomes.filter(row => row.status === "fulfilled")).toHaveLength(1);
  const failure=outcomes.find(row=>row.status==="rejected");
  expect(failure?.status==="rejected"&&["NO_PAYMENTS_TO_DEPOSIT","REFUND_DEPOSIT_RESERVED"].includes(failure.reason.code)).toBe(true);
  const refunds = await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.merchantUnitId, f.unit.id));
  const payouts = await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.merchantUnitId, f.unit.id));
  expect(refunds.length + payouts.length).toBe(1);
  expect((await getMerchantOperations(f.personId, f.unit.id)).availableFunds?.minor).toBe("0");
  expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId, f.unit.id))).toHaveLength(refunds.length?4:6);
});
