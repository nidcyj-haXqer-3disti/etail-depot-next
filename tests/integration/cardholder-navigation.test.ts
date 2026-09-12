import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { permissionGrants, services, serviceMembers } from "../../src/platform/database/schema";
import { getCardholderDashboard, getPrimaryCardholderService } from "../../src/modules/workspace/dashboard-service";
import { cardPerson, cardPrimary, enrollCardholder } from "../helpers/cardholder";

afterAll(closeDatabase);
describe("direct primary Cardholder navigation", () => {
  it("matches the dashboard's current own service and its exact grant changes", async () => {
    const f = await cardPrimary("Navigation primary");
    expect(await getPrimaryCardholderService(f.personId)).toEqual((await getCardholderDashboard(f.personId)).primaryService);
    expect(await getPrimaryCardholderService(f.personId)).toMatchObject({ id: f.serviceId, primaryPersonId: f.personId, relationship: "OWNER", canAddCard: true, canInvite: true });
    await getDb().update(permissionGrants).set({ state: "REVOKED" }).where(and(eq(permissionGrants.serviceId, f.serviceId), eq(permissionGrants.personId, f.personId), eq(permissionGrants.action, "cards.request")));
    expect(await getPrimaryCardholderService(f.personId)).toEqual((await getCardholderDashboard(f.personId)).primaryService);
    expect(await getPrimaryCardholderService(f.personId)).toMatchObject({ canAddCard: false, canInvite: true });
  });

  it.each(["MEMBERSHIP_REVOKED", "CLOSED", "SUSPENDED"] as const)("does not borrow secondary authority when the primary service is %s", async state => {
    const f = await cardPrimary(), other = await cardPrimary("Other primary");
    await enrollCardholder(other.personId, other.serviceId, f.personId);
    if (state === "MEMBERSHIP_REVOKED") await getDb().update(serviceMembers).set({ state: "REVOKED", version: 2 }).where(and(eq(serviceMembers.serviceId, f.serviceId), eq(serviceMembers.personId, f.personId)));
    else await getDb().update(services).set({ status: state, version: 2 }).where(eq(services.id, f.serviceId));
    expect(await getPrimaryCardholderService(f.personId)).toMatchObject({ id: f.serviceId, canAddCard: false, canInvite: false });
    const dashboard = await getCardholderDashboard(f.personId);
    expect(dashboard.primaryService).toEqual(await getPrimaryCardholderService(f.personId));
    expect(dashboard.primaryService).toMatchObject({ id: f.serviceId, canAddCard: false, canInvite: false });
    expect(dashboard.profiles).toMatchObject([{ id: other.serviceId, relationship: "CARDHOLDER", canAddCard: false, canInvite: false }]);
  });

  it("does not manufacture primary navigation for a secondary-only identity", async () => {
    const f = await cardPrimary(), secondary = await cardPerson("Secondary only");
    await enrollCardholder(f.personId, f.serviceId, secondary);
    await getDb().insert(permissionGrants).values(["cards.request", "people.invite"].map(action => ({ serviceId: f.serviceId, personId: secondary, action })));
    expect(await getPrimaryCardholderService(secondary)).toBeNull();
    expect((await getCardholderDashboard(secondary)).primaryService).toBeNull();
    expect(await getPrimaryCardholderService(f.personId)).toMatchObject({ id: f.serviceId, canAddCard: true, canInvite: true });
  });
});
