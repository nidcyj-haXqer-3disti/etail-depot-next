import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import targets from "../../project-targets.json" with { type: "json" };
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, permissionGrants, services } from "../../src/platform/database/schema";
import { bindIdentity, listServicesForPerson } from "../../src/modules/services/service";
import { createPrimaryMerchant } from "../../src/modules/services/create-merchant";
import { startSandbox } from "../../src/modules/sandbox/service";
import { createChannel, createOwnedSubmerchant, getMerchantBusinessDetails, getMerchantDirectory, getMerchantWorkspace, pauseMerchant, submitMerchantSetup, updateMerchantSetup } from "../../src/modules/acquiring/service";
import { configureTestGateway, createMerchantPayout, enrollTestMerchant, getMerchantCheckout, getMerchantNetwork, getMerchantOperations, refundMerchantPayment, setChannelActivation, simulateMerchantPayment } from "../../src/modules/acquiring/operations-service";
import { channelPresentationSchema } from "../../src/modules/acquiring/contracts";
import { merchantTestPayments } from "../../src/modules/acquiring/operations-schema";
import { getMerchantDashboard } from "../../src/modules/acquiring/dashboard-service";
import { createMerchantInvitation, getMerchantAccessOverview, revokeMerchantAccess } from "../../src/modules/access/merchant-service";
import { acceptInvitation } from "../../src/modules/access/service";
import { merchantAssignments } from "../../src/modules/access/schema";
import { operatorServiceAccess } from "../../src/modules/operations/schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { merchantOffer } from "../helpers/merchant-access";
import { completeSetup, paymentInput } from "../helpers/acquiring";

const issuer = `${targets.netlify.canonical_origin}/.netlify/identity`;

beforeAll(() => {
  // The runner has verified this isolated native test database. Only runtime policy
  // flags change below; no hosted database, Identity account or provider is called.
  expect(process.env.APP_ENV).toBe("test");
  getDb();
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_ID", targets.netlify.site_id);
  vi.stubEnv("NETLIFY", "true");
  vi.stubEnv("ETAIL_PUBLIC_ORIGIN", targets.netlify.canonical_origin);
  vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY", "false");
});
afterAll(async () => { vi.unstubAllEnvs(); await closeDatabase(); });

async function emailParticipant() {
  const identity = await bindIdentity(issuer, randomUUID(), "Synthetic sandbox merchant");
  await startSandbox(identity.personId, { commandId: randomUUID(), displayName: "Practice merchant owner", acknowledged: true });
  return identity;
}
async function merchant() {
  const identity = await emailParticipant();
  const created = await createPrimaryMerchant(identity.personId, { commandId: randomUUID(), displayName: "Practice ceramics" });
  return { ...identity, ...created };
}
async function readyChannel(personId: string, merchantId: string) {
  const channel = await createChannel(personId, merchantId, { ...paymentInput(), usage: "REUSABLE", presentations: [...channelPresentationSchema.options], visibility: "ASSIGNED" });
  await configureTestGateway(personId, merchantId, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(personId, merchantId, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await setChannelActivation(personId, merchantId, channel.id, { commandId: randomUUID(), expectedChannelVersion: channel.version, expectedVersion: 0, active: true });
  return channel;
}
const payment = (outcome: "APPROVED" | "DECLINED" = "APPROVED") => ({ commandId: randomUUID(), expectedChannelVersion: 1, outcome });

it("runs a hosted email participant through merchant setup, seven formats, receipts, refund and backed transfer without fixture identity", async () => {
  const f = await merchant();
  const setup = (await getMerchantBusinessDetails(f.personId, f.merchantId)).setup!;
  const saved = await updateMerchantSetup(f.personId, f.merchantId, setup.id, completeSetup(setup.version));
  expect((await submitMerchantSetup(f.personId, f.merchantId, setup.id, { commandId: randomUUID(), expectedVersion: saved.version })).status).toBe("PENDING_LOCAL_REVIEW");
  const sub = await createOwnedSubmerchant(f.personId, f.merchantId, { commandId: randomUUID(), displayName: "Practice pop-up shop" });
  const channel = await readyChannel(f.personId, sub.id);
  expect(channel.presentations).toEqual(channelPresentationSchema.options);
  const checkout = await getMerchantCheckout(f.personId, channel.id);
  expect(checkout).toMatchObject({ previewUrl: `${targets.netlify.canonical_origin}/pay/${channel.id}`, activation: { canSimulate: true, state: "ACTIVE" } });
  expect(checkout.qrDataUrl).toMatch(/^data:image\/png;base64,/);

  const declined = await simulateMerchantPayment(f.personId, sub.id, channel.id, payment("DECLINED"));
  expect(declined).toMatchObject({ status: "DECLINED", canRefund: false });
  const first = await simulateMerchantPayment(f.personId, sub.id, channel.id, payment());
  const second = await simulateMerchantPayment(f.personId, sub.id, channel.id, payment());
  expect((await refundMerchantPayment(f.personId, sub.id, first.id, { commandId: randomUUID(), expectedVersion: 1, reason: "Practice return" })).status).toBe("REFUNDED");
  const transfer = await createMerchantPayout(f.personId, sub.id, { commandId: randomUUID(), amountMinor: "250", currency: "USD" });
  expect(transfer).toMatchObject({ status: "COMPLETED", destination: "TEST_DESTINATION" });
  const operations = await getMerchantOperations(f.personId, sub.id);
  expect(operations).toMatchObject({ liveEnabled: false, feeStatus: "NOT_APPLIED", availableFunds: { minor: "1000" }, canConfigureGateway: true, canPayout: true });
  expect(operations.payments.map(row => row.id).sort()).toEqual([first.id, second.id, declined.id].sort());
  expect((await getMerchantNetwork(f.personId, f.merchantId)).units.map(row => row.id).sort()).toEqual([f.merchantId, sub.id].sort());
  expect((await getMerchantDashboard(f.personId)).units).toHaveLength(2);

  const journals = await getDb().select({ journalId: ledgerEntries.journalId, total: sql<string>`sum(${ledgerEntries.deltaMinor})::text` }).from(ledgerEntries).where(eq(ledgerEntries.serviceId, f.serviceId)).groupBy(ledgerEntries.journalId);
  expect(journals).toHaveLength(4);
  expect(journals.every(row => row.total === "0")).toBe(true);
  expect(await getDb().select().from(identityBindings).where(eq(identityBindings.personId, f.personId))).toMatchObject([{ issuer }]);
  expect((await listServicesForPerson(f.personId)).map(row => row.kind)).toEqual(["MERCHANT"]);
  expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId, f.personId))).toEqual([]);
});

it("requires explicit sandbox participation before merchant enrollment and rejects a different issuer", async () => {
  const email = await bindIdentity(issuer, randomUUID());
  expect((await getMerchantDashboard(email.personId)).units).toEqual([]);
  expect((await getMerchantDashboard(email.personId)).canCreatePrimary).toBe(false);
  await expect(createPrimaryMerchant(email.personId, { commandId: randomUUID(), displayName: "Unenrolled merchant" })).rejects.toMatchObject({ status: 403 });
  expect(await getDb().select().from(services).where(eq(services.primaryPersonId, email.personId))).toEqual([]);
  const untrusted = await bindIdentity("https://unrelated.example.test/.netlify/identity", randomUUID());
  await expect(startSandbox(untrusted.personId, { commandId: randomUUID(), displayName: "Untrusted participant", acknowledged: true })).rejects.toMatchObject({ status: 404 });
  const fixture = await bindIdentity("urn:etail:isolated-fixture", randomUUID());
  await expect(createPrimaryMerchant(fixture.personId, { commandId: randomUUID(), displayName: "Disabled fixture" })).rejects.toMatchObject({ status: 404 });
});

it("keeps invited email helpers inside their exact submerchant and revokes authority before saved retries", async () => {
  const f = await merchant(), helper = await emailParticipant();
  const sub = await createOwnedSubmerchant(f.personId, f.merchantId, { commandId: randomUUID(), displayName: "Helper shop" });
  const sibling = await createOwnedSubmerchant(f.personId, f.merchantId, { commandId: randomUUID(), displayName: "Private sibling shop" });
  const channel = await readyChannel(f.personId, sub.id);
  const invitation = await createMerchantInvitation(f.personId, sub.id, merchantOffer(helper.personId, ["merchant.read", "channels.read", "channels.create", "channels.update", "channels.close", "payments.read", "payments.simulate"]));
  await acceptInvitation(helper.personId, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version });
  expect((await getMerchantDirectory(helper.personId)).units.map(row => row.id)).toEqual([sub.id]);
  expect((await getMerchantOperations(helper.personId, sub.id))).toMatchObject({ canPayout: false, canConfigureGateway: false, canEnroll: false });
  const input = payment(), paid = await simulateMerchantPayment(helper.personId, sub.id, channel.id, input);
  expect(paid.status).toBe("APPROVED");
  for (const id of [f.merchantId, sibling.id]) await expect(getMerchantWorkspace(helper.personId, id)).rejects.toMatchObject({ status: 404 });
  await expect(getMerchantNetwork(helper.personId, sub.id)).rejects.toMatchObject({ status: 404 });
  await expect(configureTestGateway(helper.personId, sub.id, { commandId: randomUUID(), expectedVersion: 1, enabled: false })).rejects.toMatchObject({ status: 404 });
  await expect(refundMerchantPayment(helper.personId, sub.id, paid.id, { commandId: randomUUID(), expectedVersion: 1, reason: "Forbidden return" })).rejects.toMatchObject({ status: 403 });
  await expect(createMerchantPayout(helper.personId, sub.id, { commandId: randomUUID(), amountMinor: "100", currency: "USD" })).rejects.toMatchObject({ status: 403 });
  expect(await listServicesForPerson(helper.personId)).toEqual([]);
  const assignment = (await getMerchantAccessOverview(f.personId, sub.id)).people.find(row => row.personId === helper.personId)!;
  await revokeMerchantAccess(f.personId, sub.id, assignment.id, { commandId: randomUUID(), expectedVersion: assignment.version });
  await expect(simulateMerchantPayment(helper.personId, sub.id, channel.id, input)).rejects.toMatchObject({ status: 404 });
  expect((await getDb().select().from(merchantAssignments).where(eq(merchantAssignments.id, assignment.id)))[0]?.state).toBe("REVOKED");
});

it("preserves retry uniqueness, atomic funds and exact permissions for opted-in merchant commands", async () => {
  const f = await merchant(), channel = await readyChannel(f.personId, f.merchantId);
  const input = payment();
  const results = await Promise.all(Array.from({ length: 4 }, () => simulateMerchantPayment(f.personId, f.merchantId, channel.id, input)));
  expect(new Set(results.map(row => row.id)).size).toBe(1);
  expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.channelId, channel.id))).toHaveLength(1);
  await expect(createMerchantPayout(f.personId, f.merchantId, { commandId: randomUUID(), amountMinor: "1251", currency: "USD" })).rejects.toMatchObject({ code: "INSUFFICIENT_LEDGER_FUNDS" });
  const transfers = await Promise.allSettled(Array.from({ length: 2 }, () => createMerchantPayout(f.personId, f.merchantId, { commandId: randomUUID(), amountMinor: "1000", currency: "USD" })));
  expect(transfers.filter(result => result.status === "fulfilled")).toHaveLength(1);
  expect(transfers.filter(result => result.status === "rejected")).toHaveLength(1);
  expect((await getMerchantOperations(f.personId, f.merchantId)).availableFunds?.minor).toBe("250");
  await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.serviceId), eq(permissionGrants.action, "payments.simulate")));
  await expect(simulateMerchantPayment(f.personId, f.merchantId, channel.id, input)).rejects.toMatchObject({ code: "ACTION_DENIED" });
  await pauseMerchant(f.personId, f.merchantId, { commandId: randomUUID(), expectedVersion: 1, reason: "Practice pause" });
  expect((await getMerchantWorkspace(f.personId, f.merchantId)).canCreateChannel).toBe(false);
  await expect(createChannel(f.personId, f.merchantId, { ...paymentInput(), presentations: ["WEB"], visibility: "ASSIGNED" })).rejects.toMatchObject({ status: 404 });
});
