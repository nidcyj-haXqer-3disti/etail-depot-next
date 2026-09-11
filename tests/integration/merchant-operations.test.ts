import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { afterAll, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { permissionGrants } from "../../src/platform/database/schema";
import { createChannel, updateChannel } from "../../src/modules/acquiring/service";
import { merchantUnits, paymentChannels } from "../../src/modules/acquiring/schema";
import { channelActivations, merchantOperationCommands, merchantTestPayments, merchantTestRefunds, testGateways } from "../../src/modules/acquiring/operations-schema";
import { configureTestGateway, createMerchantPayout, enrollTestMerchant, getMerchantOperations, refundMerchantPayment, setChannelActivation, simulateMerchantPayment } from "../../src/modules/acquiring/operations-service";
import {getGuestPublicationManagement,publishGuestChannel,getPublicGuestRequest} from "../../src/modules/acquiring/guest-service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { acquiringFixture, paymentInput } from "../helpers/acquiring";
import {merchantDeposits} from "../../src/modules/acquiring/settlement-schema";
import { merchantAssignments } from "../../src/modules/access/schema";
import { merchantAccessFixture } from "../helpers/merchant-access";

afterAll(closeDatabase);
const command = () => randomUUID();
const activationInput = (expectedVersion = 0, active = true) => ({ commandId: command(), expectedVersion, expectedChannelVersion: 1, active });
const paymentCommand = (expectedChannelVersion = 1, outcome: "APPROVED" | "DECLINED" = "APPROVED") => ({ commandId: command(), expectedChannelVersion, outcome });
async function fixture(usage: "ONE_TIME" | "REUSABLE" = "ONE_TIME") {
  const f = await acquiringFixture();
  const [unit] = await getDb().select().from(merchantUnits).where(and(eq(merchantUnits.masterServiceId, f.serviceId), eq(merchantUnits.kind, "MASTER")));
  const input = { ...paymentInput(), usage, presentations: ["WEB", "QR", "SMS", "EMAIL", "SOCIAL", "BILL", "INVOICE"] as const, visibility: "CREATOR_PRIVATE" as const };
  const channel = await createChannel(f.personId, unit!.id, { ...input, presentations: [...input.presentations] });
  return { ...f, unit: unit!, channel };
}
async function ready(f: Awaited<ReturnType<typeof fixture>>) {
  await configureTestGateway(f.personId, f.merchantId, { commandId: command(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(f.personId, f.unit.id, { commandId: command(), expectedVersion: 0, enabled: true });
  return setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput());
}

it("gates payment setup, shares seven presentations, and records exact approved/declined/refunded effects once", async () => {
  const f = await fixture();
  expect(await getMerchantOperations(f.personId, f.unit.id)).toMatchObject({ mode: "TEST", liveEnabled: false, feeStatus: "NOT_APPLIED", gateway: { mode: "NOT_CONFIGURED" }, availableFunds: { minor: "0" } });
  await expect(setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput())).rejects.toMatchObject({ code: "CHANNEL_NOT_READY" });
  await expect(simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand())).rejects.toMatchObject({ code: "CHANNEL_NOT_READY" });
  const activation=await ready(f);
  expect(activation).toMatchObject({state:"ACTIVE"});
  expect(activation).not.toHaveProperty("canSimulate");
  expect(activation).not.toHaveProperty("previewHref");
  const published=await publishGuestChannel(f.personId,f.unit.id,f.channel.id,{commandId:command(),expectedChannelVersion:f.channel.version});
  expect(published.publication?.publicHref).toBe(`${process.env.ETAIL_PUBLIC_ORIGIN}/checkout/${published.publication!.id}`);
  expect(await getPublicGuestRequest(published.publication!.id)).toMatchObject({canStart:true,publication:{amount:{minor:"1250"}}});
  const declinedInput = paymentCommand(1, "DECLINED");
  const declined = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, declinedInput);
  expect(declined).toMatchObject({ status: "DECLINED", amount: { minor: "1250" }, canRefund: false });
  expect((await getMerchantOperations(f.personId, f.unit.id)).availableFunds?.minor).toBe("0");
  const payInput = paymentCommand();
  const paid = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, payInput);
  expect(paid).toMatchObject({ status: "APPROVED", amount: { minor: "1250" }, feeStatus: "NOT_APPLIED", canRefund: true });
  expect(await simulateMerchantPayment(f.personId, f.unit.id.toUpperCase(), f.channel.id.toUpperCase(), { ...payInput, commandId: payInput.commandId.toUpperCase() })).toEqual(paid);
  await expect(simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, { ...payInput, outcome: "DECLINED" })).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
  await expect(simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand())).rejects.toMatchObject({ code: "CHANNEL_ALREADY_USED" });
  const refundInput = { commandId: command(), expectedVersion: 1, reason: "Fictional order canceled" };
  const refunded = await refundMerchantPayment(f.personId, f.unit.id, paid.id, refundInput);
  expect(refunded).toMatchObject({ status: "REFUNDED", version: 2, amount: { minor: "1250" }, refund: { amount: { minor: "1250" } } });
  expect(await refundMerchantPayment(f.personId, f.unit.id, paid.id, refundInput)).toEqual(refunded);
  expect(await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, payInput)).toEqual(refunded);
  await expect(setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput(1))).rejects.toMatchObject({ code: "CHANNEL_ALREADY_USED" });
  const after = await getMerchantOperations(f.personId, f.unit.id);
  expect(after.availableFunds?.minor).toBe("0");
  expect(after.channels[0]?.state).toBe("USED");
  expect(after.payments).toHaveLength(2);
  const rows = await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.merchantUnitId, f.unit.id));
  expect(rows.find(row => row.id === paid.id)?.outcome).toBe("APPROVED");
  expect(rows.find(row => row.id === declined.id)?.journalId).toBeNull();
  const lines = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.merchantUnitId, f.unit.id));
  expect(lines).toHaveLength(4);
  expect(lines.reduce((total, row) => total + row.deltaMinor, 0n)).toBe(0n);
});

it("deposits reserve exactly the reviewed payments and a pending refund cannot leave partial effects", async () => {
  const f = await fixture("REUSABLE"); await ready(f);
  const paid = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand());
  const payoutInput = {commandId: command(), reviewToken: (await getMerchantOperations(f.personId,f.unit.id)).depositReview!.token};
  const payout = await createMerchantPayout(f.personId, f.unit.id, payoutInput);
  expect(payout).toMatchObject({status:"PENDING", destination:"TEST_DESTINATION", amount:{minor:"1250"},payments:[{id:paid.id}]});
  expect(await createMerchantPayout(f.personId,f.unit.id,payoutInput)).toEqual(payout);
  const refundInput = {commandId:command(), expectedVersion:1, reason:"Fictional full refund"};
  await expect(refundMerchantPayment(f.personId,f.unit.id,paid.id,refundInput)).rejects.toMatchObject({code:"REFUND_DEPOSIT_RESERVED"});
  expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paid.id))).toHaveLength(0);
  expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,refundInput.commandId))).toHaveLength(0);
  expect(await getMerchantOperations(f.personId,f.unit.id)).toMatchObject({availableFunds:{minor:"0"},settledFunds:{minor:"0"},pendingDeposits:{minor:"1250"},depositReview:null});
  await expect(createMerchantPayout(f.personId,f.unit.id,{commandId:command(),reviewToken:payoutInput.reviewToken})).rejects.toMatchObject({code:"NO_PAYMENTS_TO_DEPOSIT"});
  expect(await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.merchantUnitId,f.unit.id))).toHaveLength(1);
});

it("lets the responsible primary oversee private merchant data while retaining exact scope and independent operation permissions", async () => {
  const f = await merchantAccessFixture();
  const channel = await createChannel(f.operator.personId, f.unit.id, { ...paymentInput(), presentations: ["WEB"], visibility: "CREATOR_PRIVATE" });
  await configureTestGateway(f.merchant.personId, f.merchant.merchantId, { commandId: command(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(f.merchant.personId, f.unit.id, { commandId: command(), expectedVersion: 0, enabled: true });
  expect((await getMerchantOperations(f.merchant.personId, f.unit.id)).channels).toHaveLength(1);
  expect((await getGuestPublicationManagement(f.merchant.personId, f.unit.id, channel.id)).channelId).toBe(channel.id);
  await expect(getGuestPublicationManagement(f.helper.personId, f.unit.id, channel.id)).rejects.toMatchObject({ status: 404 });
  await expect(setChannelActivation(f.helper.personId, f.unit.id, channel.id, activationInput())).rejects.toMatchObject({ status: 404 });
  await setChannelActivation(f.operator.personId, f.unit.id, channel.id, activationInput());
  const input = paymentCommand();
  const paid = await simulateMerchantPayment(f.operator.personId, f.unit.id, channel.id, input);
  expect(paid.canRefund).toBe(false);
  expect((await getMerchantOperations(f.operator.personId, f.unit.id))).toMatchObject({ canConfigureGateway: false, canEnroll: false, canPayout: false });
  await expect(configureTestGateway(f.operator.personId, f.unit.id, { commandId: command(), expectedVersion: 1, enabled: false })).rejects.toMatchObject({ status: 404 });
  await expect(enrollTestMerchant(f.operator.personId, f.unit.id, { commandId: command(), expectedVersion: 1, enabled: false })).rejects.toMatchObject({ status: 404 });
  await expect(refundMerchantPayment(f.operator.personId, f.unit.id, paid.id, { commandId: command(), expectedVersion: 1, reason: "Fictional return" })).rejects.toMatchObject({ code: "ACTION_DENIED" });
  await expect(createMerchantPayout(f.operator.personId, f.unit.id, {commandId: command(),reviewToken:(await getMerchantOperations(f.operator.personId,f.unit.id)).depositReview?.token})).rejects.toMatchObject({ code: "ACTION_DENIED" });
  expect((await refundMerchantPayment(f.merchant.personId, f.unit.id, paid.id, { commandId: command(), expectedVersion: 1, reason: "Fictional return" })).status).toBe("REFUNDED");
  await expect(simulateMerchantPayment(f.merchant.personId, f.master.id, channel.id, paymentCommand())).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE" });
  await getDb().update(merchantAssignments).set({state:"REVOKED",version:2,revokedAt:new Date()}).where(and(eq(merchantAssignments.merchantUnitId,f.unit.id),eq(merchantAssignments.personId,f.operator.personId)));
  await expect(simulateMerchantPayment(f.operator.personId, f.unit.id, channel.id, input)).rejects.toMatchObject({ code: "MERCHANT_UNAVAILABLE" });
  expect((await getMerchantOperations(f.merchant.personId, f.unit.id)).payments).toHaveLength(1);
  expect((await getMerchantOperations(f.merchant.personId, f.unit.id)).canPayout).toBe(true);
});

it("gateway setup remains primary-only and revoked explicit grants block command replays", async()=>{
 const f=await fixture(),input={commandId:command(),expectedVersion:0,enabled:true};
 expect(await configureTestGateway(f.personId,f.merchantId,input)).toMatchObject({mode:"TEST_READY",version:1});
 expect(await configureTestGateway(f.personId,f.merchantId,input)).toMatchObject({version:1});
 await expect(configureTestGateway(f.personId,f.merchantId,{...input,commandId:command(),enabled:false})).rejects.toMatchObject({code:"STALE_VERSION"});
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.action,"gateway.manage")));
 await expect(configureTestGateway(f.personId,f.merchantId,input)).rejects.toMatchObject({code:"ACTION_DENIED"});
 expect((await getDb().select().from(testGateways).where(eq(testGateways.serviceId,f.serviceId)))[0]?.version).toBe(1);
});

it("disabling and expiry stop new effects while an authorized retry still returns its committed payment", async () => {
  const f = await fixture("REUSABLE"); await ready(f);
  const input = paymentCommand(); const paid = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, input);
  await configureTestGateway(f.personId, f.merchantId, { commandId: command(), expectedVersion: 1, enabled: false });
  await expect(simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand())).rejects.toMatchObject({ code: "CHANNEL_NOT_READY" });
  expect((await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, input)).id).toBe(paid.id);
  await configureTestGateway(f.personId, f.merchantId, { commandId: command(), expectedVersion: 2, enabled: true });
  await setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput(1, false));
  await expect(simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand())).rejects.toMatchObject({ code: "CHANNEL_NOT_READY" });
  await expect(updateChannel(f.personId, f.unit.id, f.channel.id, { ...paymentInput(), expectedVersion: 1, usage: "ONE_TIME", presentations: ["WEB"], visibility: "CREATOR_PRIVATE" })).rejects.toMatchObject({ status: 409 });
  // Time passage does not change channel identity or principal; this isolated fixture avoids sleeping.
  await getDb().update(paymentChannels).set({ expiresAt: new Date(Date.now() - 60_000) }).where(eq(paymentChannels.id, f.channel.id));
  expect((await getMerchantOperations(f.personId, f.unit.id)).channels[0]?.state).toBe("EXPIRED");
  await expect(setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput(2))).rejects.toMatchObject({ code: "CHANNEL_NOT_READY" });
  expect((await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, input)).id).toBe(paid.id);
});

it("activation and disable bind the reviewed channel terms, not just the activation setting version", async () => {
  const f = await fixture();
  await configureTestGateway(f.personId, f.merchantId, { commandId: command(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(f.personId, f.unit.id, { commandId: command(), expectedVersion: 0, enabled: true });
  const changed = await updateChannel(f.personId, f.unit.id, f.channel.id, { ...paymentInput(), amountMinor: "2500", expectedVersion: 1, presentations: ["WEB"], visibility: "CREATOR_PRIVATE" });
  const stale = activationInput();
  await expect(setChannelActivation(f.personId, f.unit.id, f.channel.id, stale)).rejects.toMatchObject({ code: "STALE_VERSION" });
  expect(await getDb().select().from(channelActivations).where(eq(channelActivations.channelId, f.channel.id))).toHaveLength(0);
  expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId, stale.commandId))).toHaveLength(0);
  await setChannelActivation(f.personId, f.unit.id, f.channel.id, { ...activationInput(), expectedChannelVersion: changed.version });
  await expect(setChannelActivation(f.personId, f.unit.id, f.channel.id, activationInput(1, false))).rejects.toMatchObject({ code: "STALE_VERSION" });
  expect((await getMerchantOperations(f.personId, f.unit.id)).channels[0]?.state).toBe("ACTIVE");
  await setChannelActivation(f.personId, f.unit.id, f.channel.id, { ...activationInput(1, false), expectedChannelVersion: changed.version });
  expect((await getMerchantOperations(f.personId, f.unit.id)).channels[0]?.state).toBe("DISABLED");
});

it("database guards keep payment, refund, payout, command and configuration origins immutable", async () => {
  const f = await fixture("REUSABLE"); await ready(f);
  const paid = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand());
  const [row] = await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.id, paid.id));
  async function rejected(operation: () => Promise<unknown>) {
    await expect(operation()).rejects.toSatisfy((error: unknown) => {
      let current = error as { code?: string; cause?: unknown };
      for (let depth = 0; depth < 4; depth++) { if (current?.code === "23514") return true; current = current?.cause as typeof current; }
      return false;
    });
  }
  await rejected(() => getDb().update(merchantTestPayments).set({ description: "Changed receipt" }).where(eq(merchantTestPayments.id, paid.id)));
  await rejected(() => getDb().delete(merchantTestPayments).where(eq(merchantTestPayments.id, paid.id)));
  await rejected(() => getDb().delete(channelActivations).where(eq(channelActivations.channelId, f.channel.id)));
  await rejected(() => getDb().update(testGateways).set({ createdAt: new Date(0) }).where(eq(testGateways.serviceId, f.serviceId)));
  await rejected(() => getDb().insert(merchantTestPayments).values({ ...row!, id: command(), outcome: "DECLINED", journalId: null, channelUsage: "ONE_TIME", testReference: "TEST-forged-snapshot" }));
  await rejected(() => getDb().insert(merchantTestPayments).values({ ...row!, id: command(), testReference: "TEST-reused-journal" }));
  const payout = await createMerchantPayout(f.personId, f.unit.id, {commandId: command(),reviewToken:(await getMerchantOperations(f.personId,f.unit.id)).depositReview?.token});
  await rejected(() => getDb().delete(merchantDeposits).where(eq(merchantDeposits.id, payout.id)));
  const second = await simulateMerchantPayment(f.personId, f.unit.id, f.channel.id, paymentCommand());
  const refunded = await refundMerchantPayment(f.personId, f.unit.id, second.id, { commandId: command(), expectedVersion: 1, reason: "Fictional return" });
  await rejected(() => getDb().update(merchantTestRefunds).set({ reason: "Rewritten" }).where(eq(merchantTestRefunds.id, refunded.refund!.id)));
  const [receipt] = await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.scopeKey, `channel:${f.channel.id}`));
  await rejected(() => getDb().delete(merchantOperationCommands).where(eq(merchantOperationCommands.commandId, receipt!.commandId)));
  const journals = await getDb().select({ id: ledgerJournals.id, total: sql<string>`sum(${ledgerEntries.deltaMinor})` }).from(ledgerJournals).innerJoin(ledgerEntries, eq(ledgerJournals.id, ledgerEntries.journalId)).where(eq(ledgerEntries.merchantUnitId, f.unit.id)).groupBy(ledgerJournals.id);
  expect(journals).toHaveLength(5); expect(journals.every(journal => journal.total === "0")).toBe(true);
});
