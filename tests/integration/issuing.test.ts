import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { getDb, closeDatabase } from "../../src/platform/database/client";
import { services, serviceMembers, permissionGrants, serviceActivity, cards, cardRequests, workspaceCommands } from "../../src/platform/database/schema";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { bindIdentity, createCardholderService } from "../../src/modules/services/service";
import { seedWorkspaceService } from "../../src/modules/workspace/fixtures";
import { getBalance } from "../../src/modules/ledger";
import { ledgerJournals, ledgerEntries } from "../../src/modules/ledger/schema";
import { getWorkspace, controlCard, startCardRequest, updateCardRequest, submitCardRequest, purchaseCard } from "../../src/modules/workspace/service";
import { cardPurchaseResultSchema } from "../../src/modules/workspace/api-contracts";
import { fundCardGroup, setPersonLimit } from "../helpers/cardholder";
afterAll(closeDatabase);

async function fixture() {
 const owner=await bindIdentity("urn:etail:isolated-fixture",randomUUID(),"Practice card owner");
 await getDb().insert(merchantSetupEligibility).values({personId:owner.personId,personaKind:"FICTIONAL_ADULT"}).onConflictDoNothing();
 const {serviceId}=await createCardholderService(owner.personId,{commandId:randomUUID()});
 await seedWorkspaceService(serviceId,owner.personId);
 await getDb().insert(merchantSetupEligibility).values({personId:owner.personId,personaKind:"FICTIONAL_ADULT"}).onConflictDoNothing();
 return {personId:owner.personId,serviceId};
}
async function holder(serviceId: string, personaKind: "FICTIONAL_ADULT" | "FICTIONAL_SUPERVISED" = "FICTIONAL_ADULT") {
  const person = await bindIdentity("urn:etail:isolated-fixture", randomUUID(), "Named practice holder");
  await getDb().insert(merchantSetupEligibility).values({ personId: person.personId, personaKind }).onConflictDoNothing();
  await getDb().insert(serviceMembers).values({ serviceId, personId: person.personId, state: "ACCEPTED" });
  await getDb().insert(permissionGrants).values(["cards.read", "cards.hold", "cards.purchase", "activity.read"].map(action => ({ serviceId, personId: person.personId, action })));
  return person.personId;
}
async function savedDraft(personId: string, serviceId: string, holderId = personId) {
  const draft = await startCardRequest(personId, serviceId, { commandId: randomUUID() });
  return updateCardRequest(personId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version, holderId, nickname: "Practice groceries", format: "VIRTUAL" });
}
async function issue(personId: string, serviceId: string, holderId = personId) {
  const draft = await savedDraft(personId, serviceId, holderId);
  const input = { commandId: randomUUID(), expectedVersion: draft.version };
  const issued = await submitCardRequest(personId, serviceId, draft.id, input);
  expect(issued.status).toBe("ISSUED");
  const card = (await getWorkspace(personId, serviceId)).cards.find(card => card.id === issued.issuedCardId)!;
  return { draft, input, issued, card };
}
async function revoke(serviceId: string, personId: string, action: string) {
  await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, serviceId), eq(permissionGrants.personId, personId), eq(permissionGrants.action, action)));
}

describe("one sandbox issuance with independent group funding and person limits", () => {
  it("issues once across retries without creating money or a person limit", async () => {
    const { personId, serviceId } = await fixture(); const before = await getWorkspace(personId, serviceId);
    const { draft, input, issued, card } = await issue(personId, serviceId);
    expect(card).toMatchObject({ available: { minor: "0" }, spending: { monthlyLimit: { minor: "0" } }, canPurchase: false });
    expect(await submitCardRequest(personId, serviceId, draft.id, input)).toEqual(issued);
    expect(await getDb().select().from(cards).where(eq(cards.requestId, draft.id))).toHaveLength(1);
    expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, serviceId))).toEqual([]);
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey, `card-funding:${draft.id}`))).toEqual([]);
    expect(await getDb().transaction(tx => getBalance(tx, { serviceId, bucket: "GROUP_AVAILABLE" }))).toBe(0n);
    const after = await getWorkspace(personId, serviceId); expect(after.activity).toEqual(before.activity);
    expect(after.cards.map(row => row.id)).toEqual([...before.cards.map(row => row.id), card.id]);
    expect((await getDb().select().from(cards).where(eq(cards.id, card.id)))[0]!.requestId).toBe(draft.id);
    await expect(submitCardRequest(personId, serviceId, draft.id, { ...input, commandId: randomUUID(), expectedVersion: issued.version })).rejects.toThrow("INVALID_STATE");

    await fundCardGroup(personId, serviceId, "12501");
    expect((await getWorkspace(personId, serviceId)).cards[0]).toMatchObject({ available: { minor: "0" }, canPurchase: false });
    await setPersonLimit(personId, serviceId, personId, "12501");
    expect((await getWorkspace(personId, serviceId)).cards[0]).toMatchObject({ id: card.id, available: { minor: "12501" }, spending: { monthlyLimit: { minor: "12501" } }, canPurchase: true });
    const lines = await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, serviceId));
    expect(lines).toHaveLength(2);
    expect(lines.reduce((total, line) => total + line.deltaMinor, 0n)).toBe(0n);
    expect(lines).toEqual(expect.arrayContaining([
      expect.objectContaining({ bucket: "GROUP_AVAILABLE", cardId: null, deltaMinor: 12501n }),
      expect.objectContaining({ bucket: "PRACTICE_SOURCE", cardId: null, deltaMinor: -12501n }),
    ]));
  });
  it("allows an unfunded adult card but keeps supervised-holder requests blocked without a card or journal", async () => {
    const { personId, serviceId } = await fixture(); const supervised = await holder(serviceId, "FICTIONAL_SUPERVISED");
    const adult = await issue(personId, serviceId);
    expect(adult.card).toMatchObject({ available: { minor: "0" }, canPurchase: false });
    const draft = await savedDraft(personId, serviceId, supervised);
    expect(draft.canSubmit).toBe(false); expect(draft.prerequisites.map(item => item.code)).toContain("GUARDIAN_REQUIRED");
    const blocked = await submitCardRequest(personId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version });
    expect(blocked).toMatchObject({ status: "BLOCKED", issuedCardId: null, canSubmit: false });
    expect(await getDb().select().from(cards).where(eq(cards.requestId, draft.id))).toEqual([]);
    expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, serviceId))).toEqual([]);
  });
  it("requires current creation authority and adult eligibility before issuing", async () => {
    const { personId, serviceId } = await fixture(); const draft = await savedDraft(personId, serviceId);
    await revoke(serviceId, personId, "cards.create");
    await expect(submitCardRequest(personId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version })).rejects.toThrow("ACTION_DENIED");
    await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.personId,personId),eq(permissionGrants.action,"cards.create")));
    await getDb().update(merchantSetupEligibility).set({personaKind:"FICTIONAL_SUPERVISED"}).where(eq(merchantSetupEligibility.personId,personId));
    await expect(submitCardRequest(personId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version })).rejects.toThrow("CARD_APPLICANT_REQUIRED");
    expect(await getDb().select().from(cards).where(eq(cards.requestId,draft.id))).toEqual([]);
    expect((await getDb().select().from(cardRequests).where(eq(cardRequests.id,draft.id)))[0]!.status).toBe("DRAFT");
  });
  it("requires explicit additional-holder management for creation and controls, never for manager spending", async () => {
    const { personId, serviceId } = await fixture(); const another = await holder(serviceId);
    await fundCardGroup(personId, serviceId, "10000");
    await setPersonLimit(personId, serviceId, another, "10000");
    const { card } = await issue(personId, serviceId, another);
    expect(card.canFreeze).toBe(true); expect(card.canPurchase).toBe(false);
    await expect(purchaseCard(personId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: 1, amountMinor: "1", description: "Manager cannot spend" })).rejects.toThrow("ACTION_DENIED");
    await revoke(serviceId, personId, "cards.manageMembers");
    expect((await getWorkspace(personId,serviceId)).cardholderOptions.map(item=>item.id)).toEqual([personId]);
    await expect(controlCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,action:"freeze"})).rejects.toThrow("ACTION_DENIED");
    const draft=await startCardRequest(personId,serviceId,{commandId:randomUUID()});
    await expect(updateCardRequest(personId,serviceId,draft.id,{commandId:randomUUID(),expectedVersion:1,holderId:another,nickname:"Another card",format:"VIRTUAL"})).rejects.toThrow("ACTION_DENIED");
    const purchase=await purchaseCard(another,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,amountMinor:"501",description:"Holder practice purchase"});
    expect(purchase.card.available.minor).toBe("9499");
  });
  it("permits secondary holders and requires named primary responsibility before issuing", async () => {
    const firstGroup=await fixture(); const outside=await holder(firstGroup.serviceId);
    await getDb().insert(permissionGrants).values({serviceId:firstGroup.serviceId,personId:firstGroup.personId,action:"cards.manageMembers"}).onConflictDoNothing();
    const draft=await startCardRequest(firstGroup.personId,firstGroup.serviceId,{commandId:randomUUID()});
    expect(await updateCardRequest(firstGroup.personId,firstGroup.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:1,holderId:outside,nickname:"Named additional card",format:"VIRTUAL"})).toMatchObject({holderId:outside,canSubmit:true});
    expect((await getWorkspace(firstGroup.personId,firstGroup.serviceId)).cardholderOptions.map(item=>item.id)).toEqual(expect.arrayContaining([firstGroup.personId,outside]));
    const secondGroup=await fixture(); const manager=await holder(secondGroup.serviceId,"FICTIONAL_ADULT");
    await revoke(secondGroup.serviceId,manager,"cards.hold");await revoke(secondGroup.serviceId,manager,"cards.purchase");
    await getDb().insert(permissionGrants).values(["cards.request","cards.create","cards.manageMembers"].map(action=>({serviceId:secondGroup.serviceId,personId:manager,action})));
    await expect(startCardRequest(manager,secondGroup.serviceId,{commandId:randomUUID()})).rejects.toThrow("ACTION_DENIED");
    await expect(getDb().update(services).set({primaryPersonId:manager,version:2}).where(eq(services.id,secondGroup.serviceId))).rejects.toThrow();
    await expect(startCardRequest(manager,secondGroup.serviceId,{commandId:randomUUID()})).rejects.toMatchObject({code:"ACTION_DENIED"});
  });

});

describe("prepaid purchases use exact shared group funds and person limits", () => {
  it("records one purchase, one journal and one activity across retries; rejects altered command reuse", async () => {
    const { personId, serviceId } = await fixture(); const { card } = await issue(personId, serviceId);
    await fundCardGroup(personId, serviceId, "10000");
    await setPersonLimit(personId, serviceId, personId, "10000");
    const input={commandId:randomUUID(),expectedVersion:1,amountMinor:"1251",description:"Practice groceries"};
    const result=await purchaseCard(personId,serviceId,card.id,input); cardPurchaseResultSchema.parse(result);
    expect(result.card).toMatchObject({version:2,available:{minor:"8749"}});
    expect(await purchaseCard(personId,serviceId,card.id,input)).toEqual(result);
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,card.id))).toHaveLength(1);
    expect(await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.businessKey,`card-purchase:${input.commandId}`))).toHaveLength(1);
    expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId))).toHaveLength(1);
    await expect(purchaseCard(personId,serviceId,card.id,{...input,amountMinor:"1"})).rejects.toThrow("IDEMPOTENCY_CONFLICT");
    await revoke(serviceId,personId,"cards.hold");
    await expect(purchaseCard(personId,serviceId,card.id,input)).rejects.toThrow("ACTION_DENIED");
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(8749n);
  });
  it("denies frozen, over-limit, underfunded and cross-service purchases without activity or ledger effects", async () => {
    const { personId, serviceId } = await fixture(); const { card } = await issue(personId,serviceId);
    await fundCardGroup(personId, serviceId, "10000");
    await setPersonLimit(personId, serviceId, personId, "5000");
    const frozen=await controlCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,action:"freeze"});
    await expect(purchaseCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:frozen.version,amountMinor:"1",description:"Frozen"})).rejects.toThrow("CARD_FROZEN");
    const active=await controlCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:frozen.version,action:"unfreeze"});
    await expect(purchaseCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:active.version,amountMinor:"5001",description:"Above person limit"})).rejects.toThrow("SPENDING_LIMIT_EXCEEDED");
    await setPersonLimit(personId, serviceId, personId, "20000");
    await expect(purchaseCard(personId,serviceId,card.id,{commandId:randomUUID(),expectedVersion:active.version,amountMinor:"10001",description:"Too much"})).rejects.toThrow("INSUFFICIENT_PRACTICE_FUNDS");
    const other=await fixture(); await expect(purchaseCard(other.personId,other.serviceId,card.id,{commandId:randomUUID(),expectedVersion:1,amountMinor:"1",description:"Other service"})).rejects.toThrow("RESOURCE_UNAVAILABLE");
    expect(await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,card.id))).toEqual([]);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"}))).toBe(10000n);
    expect(await getDb().transaction(tx=>getBalance(tx,{serviceId,bucket:"CARD_SPENT",cardId:card.id}))).toBe(0n);
  });
  it("revoked purchase and holder grants deny both new commands and saved response replays", async () => {
    const {personId,serviceId}=await fixture();const {card,draft,input:issueInput}=await issue(personId,serviceId);
    await fundCardGroup(personId, serviceId, "10000");
    await setPersonLimit(personId, serviceId, personId, "10000");
    const input={commandId:randomUUID(),expectedVersion:1,amountMinor:"1",description:"Practice"};await purchaseCard(personId,serviceId,card.id,input);
    await revoke(serviceId,personId,"cards.purchase");await expect(purchaseCard(personId,serviceId,card.id,input)).rejects.toThrow("ACTION_DENIED");
    await revoke(serviceId,personId,"cards.hold");await expect(submitCardRequest(personId,serviceId,draft.id,issueInput)).rejects.toThrow("CARDHOLDER_UNAVAILABLE");
  });
});
