import {fundCardGroup,setPersonLimit} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { serviceActivity, services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { ledgerEntries } from "../../src/modules/ledger/schema";
import { getWorkspace, getActivity, searchActivity, startCardRequest, cancelCardRequest, controlCard, purchaseCard, updateCardRequest } from "../../src/modules/workspace/service";
import { createReportDefinition, exportHistoricalReport, getHistoricalReport } from "../../src/modules/reports/service";
import { createSupportCase, getSupportCase } from "../../src/modules/cases/service";
import { getAccessOverview, revokeMemberAccess } from "../../src/modules/access/service";
import type { ReportFilters } from "../../src/modules/reports/contracts";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

afterAll(closeDatabase);
const filters: ReportFilters = { source: "ACTIVITY", status: "ALL", from: "2020-01-01", to: "2030-12-31", query: "" };
async function fixture() {
  const p = await cardPrimary("Named primary holder"), secondary = await cardPerson("Own secondary holder"), other = await cardPerson("Other secondary holder");
  for (const holder of [secondary, other]) await enrollCardholder(p.personId, p.serviceId, holder);
  const primaryCard = await (async()=>{await fundCardGroup(p.personId,p.serviceId,"30000");await setPersonLimit(p.personId,p.serviceId,p.personId,"10000");return issuePracticeCard(p.personId,p.serviceId,p.personId,"Private primary card","701");})();
  const ownCard = await (async()=>{await setPersonLimit(p.personId,p.serviceId,secondary,"10000");return issuePracticeCard(p.personId,p.serviceId,secondary,"Secondary own card","123");})();
  const otherCard = await (async()=>{await setPersonLimit(p.personId,p.serviceId,other,"10000");return issuePracticeCard(p.personId,p.serviceId,other,"Other person's card","999");})();
  const [unassigned] = await getDb().insert(serviceActivity).values({ serviceId: p.serviceId, title: "Unattributed service row", category: "Service", occurredAt: new Date(), status: "POSTED", direction: "CREDIT", amountMinor: 111n, description: "Not linked to any card" }).returning();
  return { serviceId: p.serviceId, primary: p.personId, secondary, other, primaryCard, ownCard, otherCard, unassigned: unassigned! };
}

describe("primary oversight and secondary own-card privacy", () => {
  it("scopes every card, amount, transaction detail and search by the holder relationship", async () => {
    const f = await fixture();
    const primary = await getWorkspace(f.primary, f.serviceId);
    expect(primary.cardholderRole).toBe("PRIMARY");
    expect(primary.cards.map(row => row.id).sort()).toEqual([f.primaryCard.card.id, f.ownCard.card.id, f.otherCard.card.id].sort());
    expect(primary.cards.find(row => row.id === f.primaryCard.card.id)!.relationship).toBe("PRIMARY");
    expect(primary.cards.find(row => row.id === f.ownCard.card.id)!.relationship).toBe("SECONDARY");
    expect(primary.activity.map(row => row.id)).not.toContain(f.unassigned.id);
    const own = await getWorkspace(f.secondary, f.serviceId);
    expect(own).not.toHaveProperty("balances");expect(own).not.toHaveProperty("settlements");expect(own).not.toHaveProperty("disputes");
    expect(own).toMatchObject({ cardholderRole: "SECONDARY", cardRequests: [], cardholderOptions: [],  });
    expect(own.cards.map(row => row.id)).toEqual([f.ownCard.card.id]);
    expect(own.cards[0]).toMatchObject({ holderId: f.secondary, relationship: "SECONDARY", available: { minor: "9877" }, canPurchase: true });
    expect(own.activity.map(row => row.id)).toEqual([f.ownCard.activity!.id]);
    expect(own.people.every(row => row.id === f.secondary)).toBe(true);
    for (const value of [f.primaryCard.card.nickname, f.otherCard.card.nickname, f.primaryCard.activity!.title, f.otherCard.activity!.title, f.unassigned.title]) expect(JSON.stringify(own)).not.toContain(value);
    expect(await getActivity(f.secondary, f.serviceId, f.ownCard.activity!.id)).toEqual(f.ownCard.activity);
    for (const id of [f.primaryCard.activity!.id, f.otherCard.activity!.id, f.unassigned.id]) await expect(getActivity(f.secondary, f.serviceId, id)).rejects.toMatchObject({ status: 404 });
    expect(await searchActivity(f.secondary, f.serviceId, "Other person's")).toEqual([]);
    expect(await searchActivity(f.secondary, f.serviceId, "Secondary own")).toEqual([f.ownCard.activity]);
  });

  it("filters report totals, CSV, saved reports and support links through the same current holder scope", async () => {
    const f = await fixture();
    const report = await getHistoricalReport(f.secondary, f.serviceId, filters);
    expect(report.activity.map(row => row.id)).toEqual([f.ownCard.activity!.id]);
    expect(report.rowCount).toBe(1);
    expect(report.activityTotals.find(row => row.key === "POSTED_DEBIT")!.amount.minor).toBe("123");
    const saved = await createReportDefinition(f.secondary, f.serviceId, { commandId: randomUUID(), name: "My card", filters });
    expect((await getHistoricalReport(f.secondary, f.serviceId, saved.filters)).activity).toEqual(report.activity);
    const csv = (await exportHistoricalReport(f.secondary, f.serviceId, saved.filters)).csv;
    expect(csv).toContain(f.ownCard.activity!.id);
    for (const value of [f.primaryCard.activity!.id, f.otherCard.activity!.id, f.unassigned.id]) expect(csv).not.toContain(value);
    const ownCase = await createSupportCase(f.secondary, f.serviceId, { commandId: randomUUID(), topic: "TRANSACTION", subject: "Question about my card", message: "Fictional purchase question", transactionId: f.ownCard.activity!.id });
    expect(ownCase.transaction!.id).toBe(f.ownCard.activity!.id);
    for (const transactionId of [f.primaryCard.activity!.id, f.otherCard.activity!.id, f.unassigned.id]) await expect(createSupportCase(f.secondary, f.serviceId, { commandId: randomUUID(), topic: "TRANSACTION", subject: "Unavailable transaction", message: "Fictional question", transactionId })).rejects.toMatchObject({ status: 404 });
    const member = (await getAccessOverview(f.primary, f.serviceId)).people.find(row => row.id === f.secondary)!;
    await revokeMemberAccess(f.primary, f.serviceId, f.secondary, { commandId: randomUUID(), expectedVersion: member.version });
    await expect(getHistoricalReport(f.secondary, f.serviceId, saved.filters)).rejects.toMatchObject({ status: 404 });
    await expect(exportHistoricalReport(f.secondary, f.serviceId, saved.filters)).rejects.toMatchObject({ status: 404 });
    await expect(getSupportCase(f.secondary, f.serviceId, ownCase.id)).rejects.toMatchObject({ status: 404 });
  });

  it("keeps primary management separate from spending and secondary controls limited to the holder's card", async () => {
    const f = await fixture();
    const ledger = () => getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId, f.serviceId)).orderBy(ledgerEntries.id);
    const before = await ledger();
    await expect(startCardRequest(f.secondary, f.serviceId, { commandId: randomUUID() })).rejects.toMatchObject({ status: 403 });
    await expect(cancelCardRequest(f.secondary, f.serviceId, f.otherCard.request.id, { commandId: randomUUID(), expectedVersion: f.otherCard.request.version })).rejects.toMatchObject({ status: 403 });
    await expect(controlCard(f.secondary, f.serviceId, f.otherCard.card.id, { commandId: randomUUID(), expectedVersion: f.otherCard.card.version, action: "freeze" })).rejects.toMatchObject({ status: 403 });
    for (const actor of [f.primary, f.secondary]) await expect(purchaseCard(actor, f.serviceId, f.otherCard.card.id, { commandId: randomUUID(), expectedVersion: f.otherCard.card.version, amountMinor: "1", description: "Forbidden purchase" })).rejects.toMatchObject({ status: 403 });
    const frozen = await controlCard(f.secondary, f.serviceId, f.ownCard.card.id, { commandId: randomUUID(), expectedVersion: f.ownCard.card.version, action: "freeze" });
    expect(frozen.status).toBe("FROZEN");
    await expect(purchaseCard(f.secondary, f.serviceId, frozen.id, { commandId: randomUUID(), expectedVersion: frozen.version, amountMinor: "1", description: "Frozen purchase" })).rejects.toMatchObject({ status: 422 });
    expect(await ledger()).toEqual(before);
  });

  it("requires current accepted membership for selection and card commands despite retained grants", async () => {
    const f = await fixture();
    const draft = await startCardRequest(f.primary, f.serviceId, { commandId: randomUUID() });
    await getDb().update(serviceMembers).set({ state: "REVOKED", version: 2 }).where(and(eq(serviceMembers.serviceId, f.serviceId), eq(serviceMembers.personId, f.secondary)));
    expect((await getDb().select().from(permissionGrants).where(and(eq(permissionGrants.serviceId, f.serviceId), eq(permissionGrants.personId, f.secondary), eq(permissionGrants.action, "cards.hold"))))[0]!.state).toBe("ACCEPTED");
    expect((await getWorkspace(f.primary, f.serviceId)).cardholderOptions.map(row => row.id)).not.toContain(f.secondary);
    await expect(updateCardRequest(f.primary, f.serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version, holderId: f.secondary, nickname: "Unavailable holder", format: "VIRTUAL" })).rejects.toMatchObject({ status: 422 });
    await expect(purchaseCard(f.secondary, f.serviceId, f.ownCard.card.id, { commandId: randomUUID(), expectedVersion: f.ownCard.card.version, amountMinor: "1", description: "Revoked purchase" })).rejects.toMatchObject({ status: 404 });
  });

  it("cannot turn a Merchant service into a Cardholder workspace through broad card grants", async () => {
    const p = await cardPrimary();
    const [merchant] = await getDb().insert(services).values({ kind: "MERCHANT", primaryPersonId: p.personId, displayName: "Independent merchant" }).returning();
    await getDb().insert(serviceMembers).values({ serviceId: merchant!.id, personId: p.personId, state: "ACCEPTED" });
    await getDb().insert(permissionGrants).values(["cards.read", "cards.request", "cards.create", "activity.read", "people.read"].map(action => ({ serviceId: merchant!.id, personId: p.personId, action })));
    await expect(getWorkspace(p.personId, merchant!.id)).rejects.toMatchObject({ status: 404 });
    await expect(startCardRequest(p.personId, merchant!.id, { commandId: randomUUID() })).rejects.toMatchObject({ status: 403 });
  });
});
