import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cards, cardRequests, serviceActivity, permissionGrants } from "../../src/platform/database/schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { getCardholderDashboard, getCardholderDashboardDetail, getCardholderDashboardFocus } from "../../src/modules/workspace/dashboard-service";
import { getWorkspace, purchaseCard, startCardRequest } from "../../src/modules/workspace/service";
import { getAccessOverview, revokeMemberAccess } from "../../src/modules/access/service";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
async function fixture() {
  const actor = await cardPrimary("Primary in A and secondary in B"), otherPrimary = await cardPrimary("Primary in B"), foreign = await cardPrimary("Unrelated primary"), additional = await cardPerson("Additional holder");
  await enrollCardholder(actor.personId, actor.serviceId, additional);
  await enrollCardholder(otherPrimary.personId, otherPrimary.serviceId, actor.personId);
  await enrollCardholder(otherPrimary.personId, otherPrimary.serviceId, additional);
  const ownPrimary = await issuePracticeCard(actor.personId, actor.serviceId, actor.personId, "Own primary card", "10000", "123");
  const managedAdditional = await issuePracticeCard(actor.personId, actor.serviceId, additional, "Managed secondary card", "10000", "222");
  const ownSecondary = await issuePracticeCard(otherPrimary.personId, otherPrimary.serviceId, actor.personId, "Own secondary card", "10000", "111");
  const hiddenPrimary = await issuePracticeCard(otherPrimary.personId, otherPrimary.serviceId, otherPrimary.personId, "Hidden primary card", "10000", "333");
  const hiddenAdditional = await issuePracticeCard(otherPrimary.personId, otherPrimary.serviceId, additional, "Hidden secondary card", "10000", "444");
  const foreignCard = await issuePracticeCard(foreign.personId, foreign.serviceId, foreign.personId, "Unrelated card", "10000", "55");
  const pendingOwned = await startCardRequest(actor.personId, actor.serviceId, { commandId: randomUUID() });
  const pendingOther = await startCardRequest(otherPrimary.personId, otherPrimary.serviceId, { commandId: randomUUID() });
  const pendingForeign = await startCardRequest(foreign.personId, foreign.serviceId, { commandId: randomUUID() });
  await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, otherPrimary.serviceId), eq(permissionGrants.personId, actor.personId), eq(permissionGrants.action, "cards.purchase")));
  const ids = [actor.serviceId, otherPrimary.serviceId, foreign.serviceId];
  const snapshot = async () => ({
    cards: await getDb().select().from(cards).where(inArray(cards.serviceId, ids)).orderBy(cards.id),
    requests: await getDb().select().from(cardRequests).where(inArray(cardRequests.serviceId, ids)).orderBy(cardRequests.id),
    activity: await getDb().select().from(serviceActivity).where(inArray(serviceActivity.serviceId, ids)).orderBy(serviceActivity.id),
    entries: await getDb().select().from(ledgerEntries).where(inArray(ledgerEntries.serviceId, ids)).orderBy(ledgerEntries.id),
  });
  return { actor, otherPrimary, foreign, additional, ownPrimary, managedAdditional, ownSecondary, hiddenPrimary, hiddenAdditional, foreignCard, pendingOwned, pendingOther, pendingForeign, snapshot };
}

describe("service-first Cardholder dashboard", () => {
  it("presents direct service identities without moving card or journal records and never unions grants", async () => {
    const f = await fixture(), before = await f.snapshot();
    const dashboard = await getCardholderDashboard(f.actor.personId);
    expect(dashboard.profiles).toHaveLength(2);
    expect(dashboard.primaryService).toMatchObject({ id: f.actor.serviceId, primaryPersonId: f.actor.personId, relationship: "PRIMARY" });
    expect(dashboard.cards.filter(card => card.accessRole === "PRIMARY").map(card => card.id).sort()).toEqual([f.ownPrimary.card.id, f.managedAdditional.card.id].sort());
    expect(dashboard.cards.filter(card => card.accessRole === "SECONDARY")).toMatchObject([{ id: f.ownSecondary.card.id, serviceId: f.otherPrimary.serviceId, holderId: f.actor.personId, canPurchase: false, canManageAccess: false, available: { minor: "9889" } }]);
    expect(dashboard.activity.map(row => row.id).sort()).toEqual([f.ownPrimary.activity!.id, f.managedAdditional.activity!.id, f.ownSecondary.activity!.id].sort());
    expect(dashboard.requests.map(row => row.id)).toEqual([f.pendingOwned.id]);
    for (const hidden of [f.hiddenPrimary.card.id, f.hiddenAdditional.card.id, f.hiddenPrimary.activity!.id, f.hiddenAdditional.activity!.id, f.pendingOther.id, f.pendingForeign.id, f.foreignCard.card.id]) expect(JSON.stringify(dashboard)).not.toContain(hidden);
    await expect(purchaseCard(f.actor.personId, f.otherPrimary.serviceId, f.ownSecondary.card.id, { commandId: randomUUID(), expectedVersion: f.ownSecondary.card.version, amountMinor: "1", description: "No cross-service grants" })).rejects.toMatchObject({ status: 403 });
    expect(await f.snapshot()).toEqual(before);
  });

  it("shows an accepted person before their first card, independently of the card page and current grants", async () => {
    const primary = await cardPrimary("Directory primary"), member = await cardPerson("Accepted without a card"), stranger = await cardPrimary("Other directory primary");
    await enrollCardholder(primary.personId, primary.serviceId, member);
    const before = await getDb().select().from(cards).where(eq(cards.serviceId, primary.serviceId));
    expect((await getCardholderDashboard(primary.personId)).cardholders).toEqual([{id: member, displayName: "Accepted without a card", serviceId: primary.serviceId, cardCount: 0, canAddCard: true}]);
    expect((await getCardholderDashboard(member)).cardholders).toEqual([]);
    expect((await getCardholderDashboard(stranger.personId)).cardholders).toEqual([]);
    await getDb().update(permissionGrants).set({state: "REVOKED"}).where(and(eq(permissionGrants.serviceId, primary.serviceId), eq(permissionGrants.personId, member), eq(permissionGrants.action, "cards.hold")));
    expect((await getCardholderDashboard(primary.personId)).cardholders).toMatchObject([{id: member, canAddCard: false}]);
    await getDb().update(permissionGrants).set({state: "REVOKED"}).where(and(eq(permissionGrants.serviceId, primary.serviceId), eq(permissionGrants.personId, primary.personId), eq(permissionGrants.action, "cards.read")));
    expect((await getCardholderDashboard(primary.personId)).cardholders).toMatchObject([{id: member, cardCount: null}]);
    await getDb().update(permissionGrants).set({state: "REVOKED"}).where(and(eq(permissionGrants.serviceId, primary.serviceId), eq(permissionGrants.personId, primary.personId), eq(permissionGrants.action, "people.read")));
    expect((await getCardholderDashboard(primary.personId)).cardholders).toEqual([]);
    expect(await getDb().select().from(cards).where(eq(cards.serviceId, primary.serviceId))).toEqual(before);
  });

  it("resolves card, request and transaction to the stored service and rejects forged mixed selectors", async () => {
    const f = await fixture(), before = await f.snapshot();
    expect(await getCardholderDashboardDetail(f.actor.personId, { card: f.ownSecondary.card.id.toUpperCase() })).toMatchObject({ kind: "CARD", workspace: { service: { id: f.otherPrimary.serviceId }, cardholderRole: "SECONDARY" } });
    expect(await getCardholderDashboardDetail(f.actor.personId, { request: f.pendingOwned.id })).toMatchObject({ kind: "REQUEST", workspace: { service: { id: f.actor.serviceId } } });
    expect(await getCardholderDashboardDetail(f.actor.personId, { transaction: f.ownSecondary.activity!.id })).toMatchObject({ kind: "ACTIVITY", workspace: { service: { id: f.otherPrimary.serviceId } } });
    expect(await getCardholderDashboardDetail(f.actor.personId, { manage: f.actor.serviceId })).toMatchObject({ kind: "PEOPLE" });
    for (const input of [{ card: f.hiddenPrimary.card.id }, { card: f.foreignCard.card.id }, { request: f.pendingOther.id }, { request: f.pendingForeign.id }, { transaction: f.hiddenAdditional.activity!.id }, { card: randomUUID() }, { card: "invalid" }]) await expect(getCardholderDashboardDetail(f.actor.personId, input)).rejects.toMatchObject({ status: 404 });
    await expect(getCardholderDashboardDetail(f.actor.personId, { manage: f.otherPrimary.serviceId })).rejects.toMatchObject({ status: 403 });
    await expect(getCardholderDashboardDetail(f.actor.personId, { card: f.ownPrimary.card.id, new: "1" })).rejects.toMatchObject({ status: 422 });
    expect(await f.snapshot()).toEqual(before);
  });

  it("uses only the actor's direct primary service for New card and rechecks the current grant", async () => {
    const f = await fixture();
    expect(await getCardholderDashboardDetail(f.actor.personId, { new: "1" })).toMatchObject({ kind: "NEW", workspace: { service: { id: f.actor.serviceId } } });
    await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.actor.serviceId), eq(permissionGrants.personId, f.actor.personId), eq(permissionGrants.action, "cards.request")));
    await expect(getCardholderDashboardDetail(f.actor.personId, { new: "1" })).rejects.toMatchObject({ status: 403 });
    await expect(getCardholderDashboardDetail(f.additional, { new: "1" })).rejects.toMatchObject({ status: 404 });
    await expect(getCardholderDashboardDetail(f.actor.personId, { new: "other" })).rejects.toMatchObject({ status: 422 });
  });

  it("keeps selected-card Home exact, bounded and read-only as grants change", async () => {
    const f = await fixture();
    let card = f.ownPrimary.card;
    for (let n = 0; n < 26; n++) card = (await purchaseCard(f.actor.personId, f.actor.serviceId, card.id, { commandId: randomUUID(), expectedVersion: card.version, amountMinor: "1", description: `Selected card purchase ${n}` })).card;
    const before = await f.snapshot();
    const focus = await getCardholderDashboardFocus(f.actor.personId, card.id.toUpperCase());
    expect(focus.workspace.cards).toHaveLength(1);
    expect(focus.workspace.activity).toHaveLength(25);
    expect(focus.workspace.activity.every(item => item.cardId === card.id && item.serviceId === f.actor.serviceId)).toBe(true);
    expect(focus.workspace).not.toHaveProperty("people");
    expect(focus.workspace).not.toHaveProperty("cardRequests");
    for (const id of [f.hiddenPrimary.card.id, f.hiddenAdditional.card.id, f.foreignCard.card.id, randomUUID(), "invalid"]) await expect(getCardholderDashboardFocus(f.actor.personId, id)).rejects.toMatchObject({ status: 404 });
    expect(await f.snapshot()).toEqual(before);
    await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.otherPrimary.serviceId), eq(permissionGrants.personId, f.actor.personId), eq(permissionGrants.action, "activity.read")));
    expect((await getCardholderDashboardFocus(f.actor.personId, f.ownSecondary.card.id)).workspace.activity).toEqual([]);
    await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.otherPrimary.serviceId), eq(permissionGrants.personId, f.actor.personId), eq(permissionGrants.action, "cards.read")));
    await expect(getCardholderDashboardFocus(f.actor.personId, f.ownSecondary.card.id)).rejects.toMatchObject({ status: 404 });
  });

  it("removes a revoked secondary scope on reload without changing the person's independent primary service", async () => {
    const f = await fixture();
    const member = (await getAccessOverview(f.otherPrimary.personId, f.otherPrimary.serviceId)).people.find(row => row.id === f.actor.personId)!;
    await revokeMemberAccess(f.otherPrimary.personId, f.otherPrimary.serviceId, f.actor.personId, { commandId: randomUUID(), expectedVersion: member.version });
    const dashboard = await getCardholderDashboard(f.actor.personId);
    expect(dashboard.profiles.map(profile => profile.id)).toEqual([f.actor.serviceId]);
    expect(dashboard.cards.every(card => card.serviceId === f.actor.serviceId)).toBe(true);
    expect(dashboard.activity.every(row => row.serviceId === f.actor.serviceId)).toBe(true);
    await expect(getCardholderDashboardFocus(f.actor.personId, f.ownSecondary.card.id)).rejects.toMatchObject({ status: 404 });
    expect((await getWorkspace(f.actor.personId, f.actor.serviceId)).cards).toHaveLength(2);
  });

  it("paginates the authorized card set without duplicates or hidden-holder counts", async () => {
    const primary = await cardPrimary(), secondary = await cardPerson("Paginated secondary");
    await enrollCardholder(primary.personId, primary.serviceId, secondary);
    for (let n = 0; n < 31; n++) await issuePracticeCard(primary.personId, primary.serviceId, primary.personId, `Primary card ${String(n).padStart(2, "0")}`, "1");
    const own = await issuePracticeCard(primary.personId, primary.serviceId, secondary, "Secondary card", "1");
    const first = await getCardholderDashboard(primary.personId), second = await getCardholderDashboard(primary.personId, 1);
    expect(first).toMatchObject({ cardCount: 32, cardsPage: 0, cardsHasMore: true });
    expect(first.cards).toHaveLength(30); expect(second.cards).toHaveLength(2); expect(second.cardsHasMore).toBe(false);
    expect(new Set([...first.cards, ...second.cards].map(card => card.id)).size).toBe(32);
    const secondaryPage = await getCardholderDashboard(secondary);
    expect(secondaryPage).toMatchObject({ cardCount: 1, cardsHasMore: false });
    expect(secondaryPage.cards.map(card => card.id)).toEqual([own.card.id]);
    await expect(getCardholderDashboard(primary.personId, -1)).rejects.toMatchObject({ status: 422 });
  });
});
