import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import targets from "../../project-targets.json" with { type: "json" };
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cards, cardRequests, identityBindings, permissionGrants, serviceActivity, serviceMembers, services } from "../../src/platform/database/schema";
import { bindIdentity, createCardholderService } from "../../src/modules/services/service";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { startSandbox } from "../../src/modules/sandbox/service";
import { createInvitation, acceptInvitation, revokeMemberAccess } from "../../src/modules/access/service";
import { getCardholderDashboard } from "../../src/modules/workspace/dashboard-service";
import { cancelCardRequest, controlCard, getWorkspace, purchaseCard, saveNotificationPreferences, startCardRequest, submitCardRequest, updateCardRequest } from "../../src/modules/workspace/service";
import { createReportDefinition, exportHistoricalReport, getHistoricalReport } from "../../src/modules/reports/service";
import { addSupportMessage, createSupportCase, getSupportCase, listSupportCases, withdrawSupportCase } from "../../src/modules/cases/service";
import { ledgerEntries, ledgerJournals } from "../../src/modules/ledger/schema";
import { merchantAssignments } from "../../src/modules/access/schema";
import { operatorServiceAccess } from "../../src/modules/operations/schema";
import { fundCardGroup, setPersonLimit, issuePracticeCard, secondaryPermissions } from "../helpers/cardholder";

const issuer = `${targets.netlify.canonical_origin}/.netlify/identity`;
afterEach(() => vi.unstubAllEnvs());
afterAll(closeDatabase);

function hostedRuntime() {
  // Keep the previously opened isolated PostgreSQL connection. This switches only
  // application policy; no hosted identity, email, credential or database is used.
  getDb();
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_ID", targets.netlify.site_id);
  vi.stubEnv("ETAIL_PUBLIC_ORIGIN", targets.netlify.canonical_origin);
  vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY", "false");
  vi.stubEnv("ENABLE_REAL_MONEY", "false");
}

async function participant(displayName: string) {
  const identity = await bindIdentity(issuer, randomUUID());
  await startSandbox(identity.personId, { commandId: randomUUID(), displayName, acknowledged: true });
  return identity.personId;
}

async function primary(displayName = "Synthetic hosted primary") {
  const personId = await participant(displayName);
  const { serviceId } = await createCardholderService(personId, { commandId: randomUUID(), displayName: "My practice cards" });
  return { personId, serviceId };
}

describe("hosted sandbox Cardholder commands", () => {
  it("completes unfunded card creation, explicit group funding, controls, purchases, reports, preferences and private support after opt-in", async () => {
    hostedRuntime();
    const { personId, serviceId } = await primary();
    const empty = await getWorkspace(personId, serviceId);
    expect(empty.cards).toEqual([]);
    expect(empty.activity).toEqual([]);
    expect(empty.cardholderOptions.map(row => row.id)).toEqual([personId]);
    expect(empty.capabilities.filter(row => row.allowed).map(row => row.action)).toEqual(expect.arrayContaining(["cards.request", "cards.create", "cards.purchase", "cards.freeze", "cards.unfreeze", "notifications.manage", "support.cases.manage"]));

    const draft = await startCardRequest(personId, serviceId, { commandId: randomUUID() });
    const saved = await updateCardRequest(personId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version, holderId: personId, nickname: "Hosted practice card", format: "VIRTUAL" });
    expect(saved).toMatchObject({ canSubmit: true, prerequisites: [] });
    const submit = { commandId: randomUUID(), expectedVersion: saved.version };
    const issued = await submitCardRequest(personId, serviceId, saved.id, submit);
    expect(await submitCardRequest(personId, serviceId, saved.id, submit)).toEqual(issued);
    const unfunded = (await getWorkspace(personId, serviceId)).cards[0]!;
    expect(unfunded).toMatchObject({ id: issued.issuedCardId, relationship: "PRIMARY", available: { minor: "0" }, spending: { monthlyLimit: { minor: "0" } }, canPurchase: false, fictional: true });
    expect(await getDb().select().from(cards).where(eq(cards.requestId, saved.id))).toHaveLength(1);
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, `card-funding:${saved.id}`))).toHaveLength(0);
    expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, serviceId))).toEqual([]);
    await fundCardGroup(personId, serviceId, "12501");
    await setPersonLimit(personId, serviceId, personId, "20000");
    const card = (await getWorkspace(personId, serviceId)).cards[0]!;
    expect(card).toMatchObject({ id: issued.issuedCardId, available: { minor: "12501" }, canPurchase: true });

    const frozen = await controlCard(personId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: card.version, action: "freeze" });
    expect(frozen).toMatchObject({ status: "FROZEN", canPurchase: false, canUnfreeze: true });
    await expect(purchaseCard(personId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: frozen.version, amountMinor: "1", description: "Rejected while frozen" })).rejects.toThrow("CARD_FROZEN");
    const active = await controlCard(personId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: frozen.version, action: "unfreeze" });
    await expect(purchaseCard(personId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: active.version, amountMinor: "12502", description: "Rejected over balance" })).rejects.toThrow("INSUFFICIENT_PRACTICE_FUNDS");
    const purchase = { commandId: randomUUID(), expectedVersion: active.version, amountMinor: "2501", description: "Synthetic practice groceries" };
    const bought = await purchaseCard(personId, serviceId, card.id, purchase);
    expect(bought.card.available.minor).toBe("10000");
    expect(await purchaseCard(personId, serviceId, card.id, purchase)).toEqual(bought);
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId, card.id))).toHaveLength(1);
    const ledger = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, serviceId));
    expect(ledger.reduce((sum, row) => sum + row.deltaMinor, 0n)).toBe(0n);

    const filters = { source: "ACTIVITY" as const, status: "POSTED" as const, from: bought.activity.occurredAt.slice(0, 10), to: bought.activity.occurredAt.slice(0, 10), query: "groceries" };
    const definition = await createReportDefinition(personId, serviceId, { commandId: randomUUID(), name: "Practice groceries", filters });
    const report = await getHistoricalReport(personId, serviceId, filters);
    expect(report.activity.map(row => row.id)).toEqual([bought.activity.id]);
    expect(report.definitions.map(row => row.id)).toContain(definition.id);
    expect((await exportHistoricalReport(personId, serviceId, filters)).csv).toContain("Synthetic practice groceries");
    expect(await saveNotificationPreferences(personId, serviceId, { commandId: randomUUID(), expectedVersion: 1, serviceActivity: false, cardControls: true, caseUpdates: true })).toMatchObject({ serviceActivity: false, cardControls: true, caseUpdates: true, version: 2, delivery: "SAVED_ONLY" });

    const support = await createSupportCase(personId, serviceId, { commandId: randomUUID(), topic: "TRANSACTION", transactionId: bought.activity.id, subject: "Practice purchase question", message: "Please review this synthetic purchase." });
    expect(support).toMatchObject({ status: "OPEN", transaction: { id: bought.activity.id }, delivery: "SANDBOX_SUPPORT" });
    expect((await listSupportCases(personId, serviceId, { q: "Practice purchase" })).cases.map(row => row.id)).toEqual([support.id]);
    const message = await addSupportMessage(personId, serviceId, support.id, { commandId: randomUUID(), expectedVersion: support.version, message: "The statement matches my practice purchase." });
    expect(await withdrawSupportCase(personId, serviceId, support.id, { commandId: randomUUID(), expectedVersion: message.version, reason: "My question is answered." })).toMatchObject({ status: "WITHDRAWN", canUpdate: false });
    expect((await getSupportCase(personId, serviceId, support.id)).messages).toHaveLength(3);

    const canceled = await startCardRequest(personId, serviceId, { commandId: randomUUID() });
    expect(await cancelCardRequest(personId, serviceId, canceled.id, { commandId: randomUUID(), expectedVersion: canceled.version })).toMatchObject({ status: "CANCELED", issuedCardId: null });
    expect((await getCardholderDashboard(personId)).cardCount).toBe(1);
    expect(await getDb().select().from(services).where(and(eq(services.primaryPersonId, personId), eq(services.kind, "MERCHANT")))).toEqual([]);
    expect(await getDb().select().from(merchantAssignments).where(eq(merchantAssignments.personId, personId))).toEqual([]);
    expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId, personId))).toEqual([]);
    expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId, personId))).toEqual([]);
    expect(await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId, personId), eq(identityBindings.issuer, "urn:etail:isolated-fixture")))).toEqual([]);
  });

  it("keeps secondary spending and support private and rechecks revocation before replay", async () => {
    hostedRuntime();
    const owner = await primary();
    const second = await participant("Synthetic hosted secondary");
    const invitation = await createInvitation(owner.personId, owner.serviceId, { commandId: randomUUID(), recipientId: second, role: "SECONDARY", permissions: secondaryPermissions, delegablePermissions: [], expiresInDays: 3 });
    await acceptInvitation(second, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version });
    const own = await (async()=>{await fundCardGroup(owner.personId,owner.serviceId,"5000");await setPersonLimit(owner.personId,owner.serviceId,owner.personId,"2000");return issuePracticeCard(owner.personId,owner.serviceId,owner.personId,"Primary private card","201");})();
    const secondary = await (async()=>{await setPersonLimit(owner.personId,owner.serviceId,second,"3000");return issuePracticeCard(owner.personId,owner.serviceId,second,"Secondary private card");})();
    const purchase = { commandId: randomUUID(), expectedVersion: secondary.card.version, amountMinor: "101", description: "Secondary purchase" };
    const bought = await purchaseCard(second, owner.serviceId, secondary.card.id, purchase);
    const view = await getWorkspace(second, owner.serviceId);
    expect(view.cards.map(row => row.id)).toEqual([secondary.card.id]);
    expect(view.activity.map(row => row.id)).toEqual([bought.activity.id]);
    expect(view.cardRequests).toEqual([]);
    expect((await getHistoricalReport(second, owner.serviceId)).activity.map(row => row.id)).toEqual([bought.activity.id]);
    expect((await getWorkspace(owner.personId, owner.serviceId)).cards.map(row => row.id)).toEqual(expect.arrayContaining([own.card.id, secondary.card.id]));
    await expect(purchaseCard(owner.personId, owner.serviceId, secondary.card.id, { commandId: randomUUID(), expectedVersion: bought.card.version, amountMinor: "1", description: "No primary spending authority" })).rejects.toThrow("ACTION_DENIED");
    await expect(controlCard(second, owner.serviceId, own.card.id, { commandId: randomUUID(), expectedVersion: own.card.version, action: "freeze" })).rejects.toThrow("ACTION_DENIED");
    await expect(startCardRequest(second, owner.serviceId, { commandId: randomUUID() })).rejects.toThrow("ACTION_DENIED");
    const support = await createSupportCase(second, owner.serviceId, { commandId: randomUUID(), topic: "TRANSACTION", transactionId: bought.activity.id, subject: "Secondary private question", message: "Only assigned support should see this message." });
    await expect(getSupportCase(owner.personId, owner.serviceId, support.id)).rejects.toThrow("RESOURCE_UNAVAILABLE");
    await expect(createSupportCase(second, owner.serviceId, { commandId: randomUUID(), topic: "TRANSACTION", transactionId: own.activity!.id, subject: "Forbidden primary transaction", message: "Secondary cannot attach another card's activity." })).rejects.toThrow("RESOURCE_UNAVAILABLE");
    // Exact membership revocation invalidates both commands and cached command receipts.
    const [membership] = await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, owner.serviceId), eq(serviceMembers.personId, second)));
    await revokeMemberAccess(owner.personId, owner.serviceId, second, { commandId: randomUUID(), expectedVersion: membership!.version });
    await expect(getWorkspace(second, owner.serviceId)).rejects.toThrow("SERVICE_UNAVAILABLE");
    await expect(purchaseCard(second, owner.serviceId, secondary.card.id, purchase)).rejects.toThrow("SERVICE_UNAVAILABLE");
    await expect(getSupportCase(second, owner.serviceId, support.id)).rejects.toThrow("SERVICE_UNAVAILABLE");
  });

  it("denies strangers and unstarted members without changing existing cards, requests or money", async () => {
    hostedRuntime();
    const owner = await primary();
    const issued = await (async()=>{await fundCardGroup(owner.personId,owner.serviceId,"1000");await setPersonLimit(owner.personId,owner.serviceId,owner.personId,"1000");return issuePracticeCard(owner.personId,owner.serviceId,owner.personId,"Protected hosted card");})();
    const stranger = await participant("Synthetic independent sandbox");
    const notStarted = await bindIdentity(issuer, randomUUID());
    const records = async () => ({
      cards: await getDb().select().from(cards).where(eq(cards.serviceId, owner.serviceId)),
      requests: await getDb().select().from(cardRequests).where(eq(cardRequests.serviceId, owner.serviceId)),
      ledger: await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, owner.serviceId)),
    });
    const before = await records();
    for (const personId of [stranger, notStarted.personId]) {
      await expect(getWorkspace(personId, owner.serviceId)).rejects.toMatchObject({ status: 404 });
      await expect(startCardRequest(personId, owner.serviceId, { commandId: randomUUID() })).rejects.toMatchObject({ status: 404 });
      await expect(controlCard(personId, owner.serviceId, issued.card.id, { commandId: randomUUID(), expectedVersion: issued.card.version, action: "freeze" })).rejects.toMatchObject({ status: 404 });
      await expect(createSupportCase(personId, owner.serviceId, { commandId: randomUUID(), topic: "SERVICE", transactionId: null, subject: "Forbidden service question", message: "No membership authorizes this request." })).rejects.toMatchObject({ status: 404 });
    }
    await expect(createCardholderService(notStarted.personId, { commandId: randomUUID() })).rejects.toMatchObject({ code: "SANDBOX_START_REQUIRED", status: 403 });
    expect(await records()).toEqual(before);
    expect(await getDb().select().from(permissionGrants).where(inArray(permissionGrants.personId, [stranger, notStarted.personId]))).toEqual([]);
  });
});
